import fetch from "node-fetch";
import fs from "fs";
import path from "path";
interface Generic {
  [key: string]: any;
}
interface ReducedRepo {
  name: string;
  html_url: string;
  stargazers_count: number;
  updated_at: string;
}
export function repoPropPicker({
  name,
  html_url,
  stargazers_count,
  updated_at,
}: Generic): ReducedRepo {
  return { name, html_url, stargazers_count, updated_at };
}
export async function main(): Promise<void> {
  try {
    const response = await fetch("http://api.github.com/orgs/inpyjamas/repos", {
      method: "GET",
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    const json = await response.json();
    const repos: ReducedRepo[] = json.map((repo: Generic) => {
      if (
        repo.private === false &&
        repo.fork === false &&
        repo.archived === false
      ) {
        return repoPropPicker(repo);
      } else {
        return;
      }
    });
    fs.writeFile(
      path.resolve(__dirname, "../../_data/reposList.json"),
      JSON.stringify({ data: { repos } }),
      "utf8",
      (err) => {
        if (err) throw err;
      },
    );
  } catch (error) {
    console.error(error);
  }
}

if (require.main === module) {
  main().catch((err) => console.error(err));
}
