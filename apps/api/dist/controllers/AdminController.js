"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DBService_1 = __importDefault(require("../services/DBService"));
class AdminController {
    async init() {
        this.dbService = await DBService_1.default.getInstance();
    }
    constructor() {
        this.uploadGame = async (req, res) => { };
        this.addChars = async (req, res) => { };
        this.init();
    }
    static getInstance() {
        if (!AdminController.instance) {
            AdminController.instance = new AdminController();
        }
        return AdminController.instance;
    }
}
exports.default = AdminController;
