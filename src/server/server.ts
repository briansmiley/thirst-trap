import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import playerService from "./services/player";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = Number(process.env.PORT) || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(
    httpServer
    //   , {
    //   cors: {
    //     origin: "*",
    //     methods: ["GET", "POST"]
    //   }
    // }
  );

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("addPlayer", (profile, callback) => {
      console.log(`EVT addPlayer from ${socket.id}`);
      console.log({
        ...profile,
        imageBase64: profile.imageBase64?.slice(0, 50),
      });
      playerService
        .create({
          playerId: profile.id,
          name: profile.name,
          picture: profile.imageBase64,
        })
        .then((newPlayer) => {
          io.emit("addPlayer", newPlayer);
          if (callback) callback({ success: true });
        })
        .catch((err) => {
          console.error(err);
          if (callback) callback({ success: false, message: err.message });
        });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
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
