"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = __importDefault(require());
const adminController_1 = require("../controllers/adminController");
const router = module_1.default.Router();
router.post("/uploadGame", adminController_1.uploadGame);
router.post("/addChars", adminController_1.addChars);
