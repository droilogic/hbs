const app = require("./backend/app");
const debug = require("debug")("node-angular");
const http = require("http");

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      // permission denied
      console.error(bind + " requires elevated privileges; aborting.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      // resource already in use
      console.error(bind + " is already in use; aborting.");
      process.exit(1);
      break;
      case "ECONNRESET":
        // connection reset by peer
        console.error("connection " + bind + " reset by peer; aborting.");
        process.exit(1);
        break;
      default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Server listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3333");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
