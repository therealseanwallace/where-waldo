import dotenv from "dotenv";
import express from "express";
import { Request, Response, NextFunction } from 'express';
import "express-async-errors";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import { body } from "express-validator";
import CustomError from "./utils/CustomError";
import adminRouter from "./routes/gameRouter";

dotenv.config();

interface SystemError extends Error {
  code?: string;
  errno?: number;
  syscall?: string;
  hostname?: string;
}

process.on("unhandledRejection", (reason, promise) => {
  const reasonAsSystemError = reason as SystemError;
  if (reason instanceof Error) {
    console.error({
      error: "Unhandled Rejection",
      message: reasonAsSystemError.message,
      stack: reasonAsSystemError.stack,
      code: reasonAsSystemError.code,
      errno: reasonAsSystemError.errno,
      syscall: reasonAsSystemError.syscall,
      hostname: reasonAsSystemError.hostname,
    });
  } else {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
  }
});

process.on("uncaughtException", async (error) => {
  const errorAsSystemError = error as SystemError;
  console.error("Uncaught Exception:", {
    message: errorAsSystemError.message,
    stack: errorAsSystemError.stack,
  });
  /* if (DBService.sequelizeInstance) {
    try {
      // Gracefully close the database connection before exiting
      await DBService.sequelizeInstance.close();
      console.log("Sequelize disconnected on app termination");
    } catch (disconnectError) {
      console.error("Error during Sequelize disconnection:", disconnectError);
    } finally {
      process.exit(1);
    }
  }*/
});

const app = express();

let serverReadyResolve: () => void;

const serverReadyPromise = new Promise<void>((resolve) => {
  serverReadyResolve = resolve;
});

async function startServer() {
  try {
    // Wait for Sequelize connection
  // await DBService.sequelizeInstance.authenticate();

  app.use(helmet());

  app.use(express.json());

  app.use(express.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    console.log(`Received a ${req.method} request to ${req.url}`);
    next();
  });

  const __dirname = path.dirname(__filename);

  // Serve static files from the public directory
  app.use(express.static(path.join(__dirname, "public")));

  app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }));

  // app.use(passport.initialize());

  app.get("/", (req, res) => {
    res.send("Welcome to Express");
  });

  app.use("/admin", adminRouter);

  app.use((err: Error | CustomError, req: Request, res: Response, next: NextFunction): void => {
    // Log the error details
    console.error(
      `Status: ${(err as CustomError).status || 500}, Message: ${err.message}, Stack: ${err.stack
      }`
    );

    // Check if the error is an instance of CustomError
    if (err instanceof CustomError) {
      res.status(err.status).json([
        {
          status: err.status,
          message: err.message,
        },
      ]);
    } else {
      // If it's not a CustomError, default to 500.
      res.status(500).json([
        {
          status: 500,
          message: "Internal Server Error",
        },
      ]);
    }
  });

  serverReadyResolve();
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
  
};

startServer();

export { app, serverReadyPromise, serverReadyResolve };