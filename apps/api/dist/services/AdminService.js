"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const CloudStorageMulterEngine_1 = __importDefault(require("./CloudStorageMulterEngine"));
const DBService_1 = __importDefault(require("./DBService"));
const Game_1 = __importDefault(require("../models/Game"));
const Character_1 = __importDefault(require("../models/Character"));
class AdminService {
    async init() {
        this.dbService = await DBService_1.default.getInstance();
        this.CloudStorageMulterEngine = new CloudStorageMulterEngine_1.default();
    }
    constructor() {
        this.init();
    }
    static getInstance() {
        if (!AdminService.instance) {
            AdminService.instance = new AdminService();
        }
        return AdminService.instance;
    }
    uploadGame() {
        return (req, res, _next) => {
            AdminService.imageUploader(req, res, async (err) => {
                var _a;
                if (err) {
                    console.error("Error occurred while uploading image:", err);
                    return res
                        .status(422)
                        .send("An error occurred while uploading the image.");
                }
                // File uploaded successfully.
                const { name, slug } = req.body;
                // Create an empty array of ten null highScores
                const highScores = Array(10).fill(null);
                // Add the image's metadata to the database
                const game = new Game_1.default({
                    name,
                    slug,
                    path: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path,
                    highScores,
                });
                try {
                    await this.dbService.createOrUpdateModel({
                        model: Game_1.default,
                        data: game,
                    });
                    res.json({
                        message: `Game ${name} uploaded successfully! Slug: ${slug}.`,
                    });
                }
                catch (error) {
                    console.error("Error occurred while uploading game:", error);
                    res.status(500).send("An error occurred while uploading the game.");
                }
            });
        };
    }
    uploadChar() {
        return (req, res, _next) => {
            AdminService.thumbnailUploader(req, res, async (err) => {
                var _a;
                if (err) {
                    console.error("Error occurred while uploading thumbnail:", err);
                    return res
                        .status(422)
                        .send("An error occurred while uploading the thumbnail.");
                }
                // File upload is successful. Add the character's data to the database.
                const { name, rectStart, rectEnd, gameSlug } = req.body;
                const char = new Character_1.default({
                    name,
                    gameSlug,
                    thumbnailPath: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path,
                    thumbnailHeight: req.body.thumbnailHeight,
                    thumbnailWidth: req.body.thumbnailWidth,
                    rectStartX: rectStart.x,
                    rectStartY: rectStart.y,
                    rectEndX: rectEnd.x,
                    rectEndY: rectEnd.y,
                });
                try {
                    await this.dbService.createOrUpdateModel({
                        model: Character_1.default,
                        data: char,
                    });
                    res.json({ message: `Character ${name} uploaded successfully!` });
                }
                catch (error) {
                    console.error("Error occurred while uploading character:", error);
                    res
                        .status(500)
                        .send("An error occurred while uploading the character.");
                }
            });
        };
    }
}
AdminService.imageUploader = (0, multer_1.default)({
    storage: new CloudStorageMulterEngine_1.default(),
}).single("image");
AdminService.thumbnailUploader = (0, multer_1.default)({
    storage: new CloudStorageMulterEngine_1.default(),
}).single("thumbnail");
exports.default = AdminService;
