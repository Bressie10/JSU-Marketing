module.exports = function(eleventyConfig) {
  // Copy all your asset folders
  eleventyConfig.addPassthroughCopy("CSS");
  eleventyConfig.addPassthroughCopy("icons");
  eleventyConfig.addPassthroughCopy("Photos");
  eleventyConfig.addPassthroughCopy("Videos");
  eleventyConfig.addPassthroughCopy("JS");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("FormReplies.php");

  return {
    htmlTemplateEngine: "liquid",
    dir: {
      input: "HTML",
      includes: "../_includes",
      output: "_site"
    }
  };
};
