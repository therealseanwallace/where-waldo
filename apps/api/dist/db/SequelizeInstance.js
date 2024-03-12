"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-await-in-loop */
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
const Character_1 = __importDefault(require("../models/Character"));
const HighScore_1 = __importDefault(require("../models/HighScore"));
const Game_1 = __importDefault(require("../models/Game"));
dotenv_1.default.config();
class SequelizeInstance {
    constructor() {
        this.sequelizeInstance = null;
        this.databaseUrl = `postgres://${process.env.DATABASE_USERNAME}:${process.env.POSTGRES_ADMIN_PASSWORD}@${process.env.HOSTED_AT}/${process.env.DB_NAME}`;
        if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
            console.log("Running on production deployment; using DATABASE_URL env variable...");
            this.databaseUrl = process.env.DATABASE_URL;
        }
        else {
            console.log("Running in dev environment. Using template literal database URL...");
        }
        SequelizeInstance.setupAssociations();
    }
    static delay(duration) {
        return new Promise((resolve) => {
            setTimeout(resolve, duration);
        });
    }
    static setupAssociations() {
        Game_1.default.hasMany(Character_1.default, {
            foreignKey: "gameId",
            as: "characters",
        });
        Character_1.default.belongsTo(Game_1.default, {
            foreignKey: "gameId",
            as: "game",
        });
        Game_1.default.hasMany(HighScore_1.default, {
            foreignKey: "gameId",
            as: "highScores",
        });
        HighScore_1.default.belongsTo(Game_1.default, {
            foreignKey: "gameId",
            as: "game",
        });
    }
    async connectWithRetry(maxRetries = 5, initialDelay = 1000) {
        let attempt = 0;
        let currentDelay = initialDelay;
        const environment = process.env.NODE_ENV || "development";
        while (attempt < maxRetries) {
            try {
                const dialectOptions = environment === "production" || environment === "staging" ? {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false,
                    },
                } : null;
                console.log("Environment is:", environment, ". Dialect options are:", dialectOptions);
                this.sequelizeInstance = new sequelize_1.Sequelize(this.databaseUrl, {
                    logging: false,
                    dialectOptions,
                });
                await this.sequelizeInstance.authenticate();
                console.log("Connection has been established successfully.");
                return this.sequelizeInstance;
            }
            catch (error) {
                attempt += 1;
                console.error({
                    message: "Unable to connect to the database. Retrying...",
                    error,
                    attempt,
                    nextRetryIn: currentDelay,
                });
                await SequelizeInstance.delay(currentDelay);
                currentDelay *= 2;
            }
        }
        console.error("Maximum retry attempts reached. Unable to connect to the database.");
        process.exit(1);
    }
}
exports.default = SequelizeInstance;
