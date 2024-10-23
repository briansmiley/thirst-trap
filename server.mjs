import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const getNewUser = (() => {
  let id = 0;
  return (name) => ({ id: id++, name, status: "human" });
})();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("user connected");

    socket.on("addUser", (profile) => {
      console.log(`EVT addUser`);
      console.log({
        ...profile,
        imageBase64: profile.imageBase64.slice(0, 50),
      });
      io.emit("addUser", JSON.stringify(profile));
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
