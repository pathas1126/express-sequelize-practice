const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-type": "text/plain" });
  res.write("Holy Moly");
  res.end();
});

server.listen(3000);
