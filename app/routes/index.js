const fs = require("node:fs/promises");
const path = require("node:path");
const docs = require("./docs");

const docsPath = path.join(
  __dirname,
  "..",
  "docs"
);


module.exports = async function homeHandler(request, response) {
  try {
    const categories = await fs.readdir(docsPath, {
      withFileTypes: true,
    });

    let documentsHtml = "";

    // get the category(folders) under the docs folder
    for (const category of categories) {
      if (!category.isDirectory()) {
        continue;
      }

      const categoryPath = path.join(
        docsPath,
        category.name
      );

      const files = await fs.readdir(categoryPath, {
        withFileTypes: true,
      });

      const markdownFiles = files.filter((file) => {
        return (
          file.isFile() &&
          file.name.endsWith(".md")
        );
      });

      if (markdownFiles.length === 0) {
        continue;
      }

      documentsHtml += `<h2>${category.name}</h2>`;
      documentsHtml += "<ul>";

      // go through the folder and list the documentations
      for (const file of markdownFiles) {
        const fileNameWithoutExtension = path.basename(
          file.name,
          ".md"
        );

        const documentUrl =
          `/docs/${category.name}/${fileNameWithoutExtension}`;

        documentsHtml += `
          <li>
            <a href="${documentUrl}">
              ${fileNameWithoutExtension}
            </a>
          </li>
        `;
      }

      documentsHtml += "</ul>";
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
          />
          <title>Documents</title>
        </head>

        <body>
          <h1>Documents</h1>

          ${documentsHtml}
        </body>
      </html>
    `;

    response.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
    });

    response.end(html);
  } catch (error) {
    console.error(error);

    response.statusCode = 500;
    response.end("Unable to read documents");
  }
};