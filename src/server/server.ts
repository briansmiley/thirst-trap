import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import playerService from "./services/player";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

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
      playerService.create({ playerId: profile.id, name: profile.name, picture: profile.imageBase64 })
        .then((newPlayer) => {
          io.emit("addUser", newPlayer);
        }).catch((err) => console.error(err));
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
