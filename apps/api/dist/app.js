"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverReadyResolve = exports.serverReadyPromise = exports.app = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const CustomError_1 = __importDefault(require("./utils/CustomError"));
const adminRouter_1 = __importDefault(require("./routes/adminRouter"));
dotenv_1.default.config();
process.on("unhandledRejection", (reason, promise) => {
    const reasonAsSystemError = reason;
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
    }
    else {
        console.error("Unhandled Rejection at:", promise, "reason:", reason);
    }
});
process.on("uncaughtException", async (error) => {
    const errorAsSystemError = error;
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
const app = (0, express_1.default)();
exports.app = app;
let serverReadyResolve;
const serverReadyPromise = new Promise((resolve) => {
    exports.serverReadyResolve = serverReadyResolve = resolve;
});
exports.serverReadyPromise = serverReadyPromise;
async function startServer() {
    try {
        // Wait for Sequelize connection
        // await DBService.sequelizeInstance.authenticate();
        app.use((0, helmet_1.default)());
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: false }));
        app.use((req, res, next) => {
            console.log(`Received a ${req.method} request to ${req.url}`);
            next();
        });
        const __dirname = path_1.default.dirname(__filename);
        // Serve static files from the public directory
        app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
        app.use((0, cors_1.default)({
            origin: process.env.CORS_ORIGIN,
            credentials: true,
        }));
        // app.use(passport.initialize());
        app.get("/", (req, res) => {
            res.send("Welcome to Express");
        });
        app.use("/admin", adminRouter_1.default);
        app.use((err, req, res, next) => {
            // Log the error details
            console.error(`Status: ${err.status || 500}, Message: ${err.message}, Stack: ${err.stack}`);
            // Check if the error is an instance of CustomError
            if (err instanceof CustomError_1.default) {
                res.status(err.status).json([
                    {
                        status: err.status,
                        message: err.message,
                    },
                ]);
            }
            else {
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
    }
    catch (error) {
        console.error("Failed to start the server:", error);
        process.exit(1);
    }
}
;
startServer();
