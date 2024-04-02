"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameService_1 = __importDefault(require("../services/GameService"));
class GameController {
    constructor() {
        this.getGames = async (req, res) => {
            console.log("GameController.getGames() called...");
            await this.gameService.getGames();
            res.send("Games retrieved from the database.");
        };
        this.gameService = GameService_1.default.getInstance();
    }
    static getInstance() {
        if (!GameController.instance) {
            GameController.instance = new GameController();
        }
        return GameController.instance;
    }
}
exports.default = GameController;
