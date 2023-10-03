const http = require("http");

const server = http.createServer((req, res) => {
  //get
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("¡Hola, mundo!\n");
    return "hola";
  }
  if (req.method === "POST" && req.url === "/mandodatos") {
    async () => {
      await console.log(req.nombre);
      res.end(res.nombre);
    };
  }
});

server.listen(3000);
