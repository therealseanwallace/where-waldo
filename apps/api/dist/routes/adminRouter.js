"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GameController_1 = __importDefault(require("../controllers/GameController"));
const adminController = GameController_1.default.getInstance();
const router = express_1.default.Router();
/*
/* POST for uploading a new image

router.post("/upload", uploadImage, (req, res) => {
  res.json({message: 'Image uploaded successfully'});
});

/* POST for adding characters and their hitboxes to an uploaded image

router.post("/addcharacters", addChars, (req, res) => {
  res.json({message: 'Characters added successfully'});
}); */
router.get("/get-games", adminController.getGames, (req, res) => {
    res.json({ message: 'Games retrieved successfully' });
});
exports.default = router;
