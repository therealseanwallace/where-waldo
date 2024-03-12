"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gameController_1 = require("../controllers/gameController");
const router = express_1.default.Router();
/* GET for obtaining a list of images/games and their metadata */
router.get("/getimages", gameController_1.getImages);
/* GET for obtaining the image and characters of a specific game */
router.get("/:slug", gameController_1.getGame);
/* GET for checking whether a user's click intersects with a character's hitbox */
router.get("/checkcollision/:x/:y/:id", gameController_1.checkCollision);
/* POST for starting a new game */
router.post("/startgame/:slug", gameController_1.startGame);
/* POST for resetting an existing game */
router.post("/resetgame/", gameController_1.resetGame);
/* POST for submitting a new high score */
router.post("/sethighscore/:name", gameController_1.setHighScores);
exports.default = router;
