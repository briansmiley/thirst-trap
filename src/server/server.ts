import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import playerService from "./services/player";
import { ClientToServerEvents, ServerToClientEvents } from "./interface";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = Number(process.env.PORT) || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(
    httpServer
    //   , {
    //   cors: {
    //     origin: "*",
    //     methods: ["GET", "POST"]
    //   }
    // }
  );

  io.on("connection", socket => {
    console.log("ON connected:", socket.id);

    socket.on("addPlayer", (player, callback) => {
      console.log("ON addPlayer:", socket.id, {
        ...player,
        picture: player.picture.slice(0, 50)
      });
      playerService
        .create(player)
        .then(newPlayer => {
          console.log("EMIT addPlayer:", newPlayer);
          io.emit("addPlayer", newPlayer);
          callback({ success: true });
        })
        .catch(err => {
          console.error(err);
          callback({ success: false, message: err.message });
        });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  httpServer
    .once("error", err => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, "127.0.0.1", () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
