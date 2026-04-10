import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import app from "./app";
import config from "./config";
import logger from "./logger";
import { initNotificationSocket } from "./socket/notification.service";

async function main() {
  try {
    await mongoose.connect("mongodb+srv://iftykhar:root@onlineap.vorgswt.mongodb.net/onlineap?appName=onlineap" as string);
    logger.info("MongoDB connected successfully");
    const httpServer = http.createServer(app);

    const io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      logger.info(`Client connected: ${socket.id}`);
      socket.on("joinRoom", (userId) => socket.join(userId));
    });

    initNotificationSocket(io);

    httpServer.listen(5000, () => {
      logger.info(`Server running on port ${5000}`);
    });
  } catch (error: any) {
    logger.error("Server failed to start:", error);
  }
}

main();
