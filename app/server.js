const http = require("node:http");
const fs = require("node:fs/promises")
const path = require("node:path")

// const server = http.createServer((request, response) => {
//   response.end("Hello Node.js");
// });

// find the first note
const filePath = path.join(
    __dirname,
    "..",
    "docs",
    "azure",
    "1azure-networking-basics.md"
)

// read the note
const server = http.createServer(async (request, response) => {
  if (request.url === "/") {
    response.end("Home");
    return;
  }

  if (request.url === "/hello") {
    response.end("Hello!");
    return;
  }

  if (request.url === "/azure-networking") {
    const content = await fs.readFile(filePath, "utf-8");
    response.end(content);
    return;
  }

  response.statusCode = 404;
  response.end("Not Found");
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

