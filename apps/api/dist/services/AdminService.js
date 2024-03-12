"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DBService_1 = __importDefault(require("./DBService"));
class AdminService {
    constructor() {
        this.DB = DBService_1.default.getInstance();
    }
    static getInstance() {
        if (!AdminService.instance) {
            AdminService.instance = new AdminService();
        }
        return AdminService.instance;
    }
    async getGames() {
        console.log("Getting games from the database...");
        await this.DB.getImages();
    }
}
exports.default = AdminService;
