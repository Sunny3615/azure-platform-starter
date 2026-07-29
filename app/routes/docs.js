const fs = require("node:fs/promises");
const path = require("node:path");

module.exports = async function docsHandler(request, response) {
  try {

    const { marked } = await import("marked");

    // request.url shoule be
    // /docs/azure/1azure-networking-basics

    const markdownPath = path.join(
      __dirname,
      "..",
      "..",
      `${request.url}.md`
    );

    const content = await fs.readFile(markdownPath, "utf-8");

    const html = marked.parse(content);

    response.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
    });
    
    response.end(html);
  } catch (error) {
    console.error(error);

    response.statusCode = 404;
    response.end("Document not found");
  }
};