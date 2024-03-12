"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SequelizeInstance_1 = __importDefault(require("../db/SequelizeInstance"));
class DBService {
    constructor() {
        this.DB = new SequelizeInstance_1.default();
    }
    static getInstance() {
        if (!DBService.instance) {
            DBService.instance = new DBService();
        }
        return DBService.instance;
    }
    async getImages() {
        console.log("DBService.getImages() called...");
    }
}
exports.default = DBService;
