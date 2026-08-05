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
          <title>Cloud Engineering Notes</title>
        </head>

        <body>
          <h1>Cloud Engineering Notes</h1>
          <p>
            Welcome to my cloud learning documentation site.
            This project is built with Node.js and deployed to Microsoft Azure using Terraform as Infrastructure as Code (IaC).
            My goal is to document the technologies I learn, the challenges I encounter, and the solutions I discover throughout my cloud and DevOps journey.
            </p>

            <p>
            The project will continue to evolve with features such as automated CI/CD pipelines in the future.
            The complete source code, including the Node.js application, Terraform configuration, and future deployment pipeline, is available on
            <a href="https://github.com/Sunny3615/azure-platform-starter" target="_blank">
            GitHub
            </a>.
            </p>
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