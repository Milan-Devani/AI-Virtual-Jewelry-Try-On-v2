import WebSocket from "ws";

// Polyfill global WebSocket for environments without native global.WebSocket
if (typeof globalThis.WebSocket === "undefined") {
  (globalThis as any).WebSocket = WebSocket;
}

import app from "./app.js";
import { config } from "./config/index.js";
import { logger } from "./utils/logger.js";
import { connectPrisma } from "./config/prisma.js";

const server = app.listen(config.port, async () => {
  logger.info(`✨ JEWELAI Backend Server running on port ${config.port} [${config.env}]`);
  logger.info(`🔗 Health Check: http://localhost:${config.port}/api/health`);
  logger.info(`📦 Active Storage: ${config.storage.provider}`);
  logger.info(`🤖 Configured Gemini Model: ${config.gemini.imageModel}`);
  await connectPrisma();
});

// Graceful shutdown handling
const handleShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    logger.info("HTTP server closed.");
    process.exit(0);
  });

  // Force close after 10s if hanging
  setTimeout(() => {
    logger.error("Could not close connections in time, forcefully shutting down.");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));
