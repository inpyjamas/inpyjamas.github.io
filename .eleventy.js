module.exports = function (eleventyConfig) {
  eleventyConfig.setTemplateFormats(["liquid", "html"]);
  eleventyConfig.addWatchTarget("./src/assets/css/*.css");
  eleventyConfig.addPassthroughCopy({ "src/assets/css/": "assets/css/" });
  return {
    input: "src",
    includes: "_includes",
    layouts: "_layouts",
    output: "_site",
    passthroughFileCopy: true,
  };
};
