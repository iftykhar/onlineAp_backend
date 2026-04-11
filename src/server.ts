import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import app from "./app";
import config from "./config";
import logger from "./logger";
import { initNotificationSocket } from "./socket/notification.service";

async function main() {
  try {
    if (!config.mongodbUrl) {
      throw new Error("MONGODB_URL is not defined in the environment variables");
    }

    await mongoose.connect(config.mongodbUrl as string);
    logger.info("✅ MongoDB connected successfully");

    const httpServer = http.createServer(app);

    const io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
      },
    });

    io.on("connection", (socket) => {
      logger.info(`Client connected: ${socket.id}`);
      socket.on("joinRoom", (userId) => socket.join(userId));
    });

    initNotificationSocket(io);

    const port = config.port || 5000;
    httpServer.listen(port, () => {
      logger.info(`🌐 Server running on port ${port}`);
    });
  } catch (error: any) {
    if (error.code === "EADDRINUSE") {
      logger.error(`❌ Port ${config.port || 5000} is already in use. Please stop the existing process.`);
    } else {
      logger.error("🔥 Server failed to start:", error);
    }
    process.exit(1);
  }
}

main();
