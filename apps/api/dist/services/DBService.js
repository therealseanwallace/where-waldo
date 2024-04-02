"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SequelizeInstance_1 = __importDefault(require("../db/SequelizeInstance"));
class DBService {
    async init() {
        this.DB = await SequelizeInstance_1.default.getInstance();
        // Check if the models are initialized
        if (!this.DB.Game || !this.DB.Character || !this.DB.HighScore) {
            throw new Error("Models are not initialized");
        }
    }
    static async getInstance() {
        if (!DBService.instance) {
            DBService.instance = new DBService();
            await DBService.instance.init();
        }
        return DBService.instance;
    }
    async getGames() {
        try {
            const games = await this.DB.Game.findAll();
            console.log(games);
        }
        catch (error) {
            console.error("Error in DBService.getGames:", error);
            throw error;
        }
    }
    async getOneGame(slug) {
        try {
            const game = await this.DB.Game.findOne({
                where: {
                    slug,
                },
                include: [
                    {
                        model: this.DB.Character,
                        as: "characters",
                    },
                    {
                        model: this.DB.HighScore,
                        as: "highScores",
                    },
                ],
            });
            console.log(game);
            return game;
        }
        catch (error) {
            console.error("Error in DBService.getOneGame:", error);
            throw error;
        }
    }
    async getOneCharacter(id) {
        try {
            const character = await this.DB.Character.findOne({
                where: {
                    id,
                },
            });
            console.log(character);
            return character;
        }
        catch (error) {
            console.error("Error in DBService.getOneCharacter:", error);
            throw error;
        }
    }
    async createOrUpdateModel({ model, data, updateCondition = null, }) {
        const transaction = await this.DB.transaction();
        try {
            if (updateCondition) {
                await model.update(data, {
                    where: updateCondition,
                    transaction,
                });
                const returnValue = await model.findOne({
                    where: updateCondition,
                    transaction,
                });
                await transaction.commit();
                return returnValue;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const createdModel = await model.create(data, { transaction });
            await transaction.commit();
            return createdModel;
        }
        catch (error) {
            await transaction.rollback();
            console.error(`Error in createOrUpdateModel: `, error);
            throw new Error("Database error. Please try again shortly or contact support if this persists.");
        }
    }
}
exports.default = DBService;
