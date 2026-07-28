const http = require("node:http");

const homeHandler = require("./routes/index");
const docsHandler = require("./routes/docs");

const server = http.createServer(async (request, response) => {

  if (request.url === "/") {
    await homeHandler(request, response);
    return;
  }

  if (request.url.startsWith("/docs/")) {
    await docsHandler(request, response);
    return;
  }

  response.statusCode = 404;
  response.end("Not Found");

});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});