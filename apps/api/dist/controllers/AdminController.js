"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AdminService_1 = __importDefault(require("../services/AdminService"));
class GameController {
    constructor() {
        this.getGames = async (req, res) => {
            console.log("GameController.getGames() called...");
            await this.adminService.getGames();
            res.send("Games retrieved from the database.");
        };
        this.adminService = AdminService_1.default.getInstance();
    }
    static getInstance() {
        if (!GameController.instance) {
            GameController.instance = new GameController();
        }
        return GameController.instance;
    }
}
exports.default = GameController;
