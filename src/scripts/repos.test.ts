/* eslint-disable jest/no-hooks */
import * as repos from "./repos";

import { repo } from "./repo-test-fixture";
import fetch from "node-fetch";
import fs from "fs";
jest.mock("fs");
jest.mock("node-fetch", () => jest.fn());

describe("repos scripts", () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  test("prop picker", () => {
    expect(repos.repoPropPicker(repo)).toHaveProperty("html_url");
    expect(repos.repoPropPicker(repo)).toHaveProperty("name");
    expect(repos.repoPropPicker(repo)).toHaveProperty("stargazers_count");
    expect(repos.repoPropPicker(repo)).toHaveProperty("updated_at");
    expect(repos.repoPropPicker(repo)).not.toHaveProperty("forks");
  });

  test("main function", async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    fetch.mockResolvedValueOnce({
      ok: true,
      text: jest.fn().mockResolvedValue("err"),
      json: jest.fn().mockResolvedValue([repo]),
    });
    await repos.main();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fs.writeFile).toHaveBeenCalledTimes(1);
  });

  test("main function private repo", async () => {
    repo.private = true;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    fetch.mockResolvedValueOnce({
      ok: true,
      text: jest.fn().mockResolvedValue("err"),
      json: jest.fn().mockResolvedValue([repo]),
    });
    await repos.main();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fs.writeFile).toHaveBeenCalledTimes(1);
  });

  test("main function errors", async () => {
    jest.spyOn(console, "error").mockImplementationOnce(() => {
      return;
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    fetch.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValue([repo]),
    });
    await expect(repos.main()).rejects.toThrow("response not ok");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fs.writeFile).not.toHaveBeenCalled();
  });
  test("main function fs.writeFile error", async () => {
    jest.spyOn(console, "error").mockImplementationOnce(() => {
      return;
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    fetch.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValue([repo]),
    });
    await expect(repos.main()).rejects.toThrow("response not ok");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fs.writeFile).not.toHaveBeenCalled();
  });

  test("fs error callback", () => {
    expect(() => {
      repos.fsCallback(new Error("error"));
    }).toThrow("error");
  });
});
