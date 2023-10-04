const http = require("http");
const fs = require("fs");
require('dotenv').config();

const USERNAME_ADMIN = process.env.USERNAME_ADMIN;
const PASSWORD_ADMIN = process.env.PASSWORD_ADMIN;

const handlePostRequest = (req, res, usersData) => {
  let requestBody = "";

  req.on("data", (chunk) => {
    requestBody += chunk;
  });

  req.on("end", () => {
    try {
      const requestData = JSON.parse(requestBody);
      const username = requestData.username;
      const password = requestData.password;

      if (username && password) {
        const user = usersData.find((user) => user.username === username && user.password === password);

        if (user) {
          sendResponse(res, 200, "credenciales validas");
        } else {
          sendResponse(res, 401, "credenciales invalidas");
        }
      } else {
        sendResponse(res, 400, "faltan campos");
      }
    } catch (error) {
      sendResponse(res, 400, "error al analizar json");
    }
  });
};

const handleGetRequest = (req, res) => {
  sendResponse(res, 200, "esto es un get");
};

const handleDeleteRequest = (req, res, usersData) => {
  let requestBody = "";

  req.on("data", (chunk) => {
    requestBody += chunk;
  });

  req.on("end", () => {
    try {
      const requestData = JSON.parse(requestBody);
      const username = requestData.username;
      const password = requestData.password;

      if (username === USERNAME_ADMIN && password === PASSWORD_ADMIN) {
        const usernameAEliminar = requestData.usernameAEliminar;
        const indexAEliminar = usersData.findIndex((user) => user.username === usernameAEliminar);

        if (indexAEliminar !== -1) {
          usersData.splice(indexAEliminar, 1);
          sendResponse(res, 200, "usuario eliminado");
        } else {
          sendResponse(res, 404, "usuario no encontrado");
        }
      } else {
        sendResponse(res, 401, "credenciales admin no validas");
      }
    } catch (error) {
      sendResponse(res, 400, "error analizar json");
    }
  });
};

const handlePutRequest = (req, res, usersData) => {
  let requestBody = "";

  req.on("data", (chunk) => {
    requestBody += chunk;
  });

  req.on("end", () => {
    try {
      const requestData = JSON.parse(requestBody);
      const username = requestData.username;
      const password = requestData.password;
      const newPassword = requestData.newPassword;

      if (username === USERNAME_ADMIN && password === PASSWORD_ADMIN) {
        const userToChange = usersData.find((user) => user.username === requestData.usernameToChange);

        if (userToChange) {
          userToChange.password = newPassword;
          sendResponse(res, 200, "contraseña actualizada");
        } else {
          sendResponse(res, 404, "usuario no encontrado");
        }
      } else {
        sendResponse(res, 401, "credenciales admin no validas");
      }
    } catch (error) {
      sendResponse(res, 400, "error analizar json");
    }
  });
};

const sendResponse = (res, statusCode, message) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message }));
};

fs.readFile("data.json", "utf8", (err, data) => {
  if (err) {
    console.error("error al cargar json:", err);
    return;
  }

  const usersData = JSON.parse(data);

  const server = http.createServer((req, res) => {
    if (req.method === "GET" && req.url === "/") {
      handleGetRequest(req, res);
    } else if (req.method === "POST" && req.url === "/mandodatos") {
      handlePostRequest(req, res, usersData);
    } else if (req.method === "DELETE" && req.url === "/eliminardatos") {
      handleDeleteRequest(req, res, usersData);
    } else if (req.method === "PUT" && req.url === "/actualizardatos") {
      handlePutRequest(req, res, usersData);
    } else {
      sendResponse(res, 404, "endpoint invalido");
    }
  });

  server.listen(3000, () => {
    console.log("server en el puerto 3k");
  });
});
