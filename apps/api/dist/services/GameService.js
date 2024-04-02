"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const DBService_1 = __importDefault(require("./DBService"));
class GameService {
    async init() {
        this.dbService = await DBService_1.default.getInstance();
    }
    static generateGameJwt(payload) {
        const secret = process.env.GAME_JWT_SECRET;
        if (!secret) {
            throw new Error("GAME_JWT_SECRET not found in environment variables.");
        }
        return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: "1h" });
    }
    static checkInsideRectangle(payload) {
        const { rectStartX, rectEndX, rectStartY, rectEndY, pointX, pointY } = payload;
        const minX = Math.min(rectStartX, rectEndX);
        const maxX = Math.max(rectStartX, rectEndX);
        const minY = Math.min(rectStartY, rectEndY);
        const maxY = Math.max(rectStartY, rectEndY);
        return pointX >= minX && pointX <= maxX && pointY >= minY && pointY <= maxY;
    }
    static calculateScore(startTime, completionTime) {
        return Math.floor((completionTime - startTime) / 1000);
    }
    static getInstance() {
        if (!GameService.instance) {
            GameService.instance = new GameService();
            GameService.instance.init();
        }
        return GameService.instance;
    }
    constructor() {
        this.init();
    }
    async getGames() {
        return this.dbService.getGames();
    }
    async getOneGame(slug) {
        const game = await this.dbService.getOneGame(slug);
        return game;
    }
    async startGame(slug) {
        const timestamp = Date.now();
        const game = (await this.dbService.getOneGame(slug));
        if (!game) {
            throw new Error("Game not found");
        }
        const charsToFind = game.characters.map((char) => {
            const charAttributes = char === null || char === void 0 ? void 0 : char.get();
            return {
                id: charAttributes.id,
                gameSlug: charAttributes.gameSlug,
                name: charAttributes.name,
                thumbnailPath: charAttributes.thumbnailPath,
                thumbnailHeight: charAttributes.thumbnailHeight,
                thumbnailWidth: charAttributes.thumbnailWidth,
                rectStartX: charAttributes.rectStartX,
                rectEndX: charAttributes.rectEndX,
                rectStartY: charAttributes.rectStartY,
                rectEndY: charAttributes.rectEndY,
                found: false,
            };
        });
        const gameObject = {
            slug,
            startTime: timestamp,
            charsToFind,
        };
        const gameJwt = GameService.generateGameJwt(gameObject);
        return gameJwt;
    }
    async checkCollision(payload) {
        try {
            const char = (await this.dbService.getOneCharacter(payload.id));
            const { rectStartX, rectEndX, rectStartY, rectEndY } = char.get();
            const isInside = GameService.checkInsideRectangle({
                rectStartX,
                rectEndX,
                rectStartY,
                rectEndY,
                pointX: payload.x,
                pointY: payload.y,
            });
            if (isInside) {
                const { token } = payload;
                const decoded = jsonwebtoken_1.default.verify(token, process.env.GAME_JWT_SECRET);
                let allFound = true;
                decoded.charsTofind = decoded.charsTofind.map((character) => {
                    if (character.id === payload.id) {
                        return Object.assign(Object.assign({}, character), { found: true });
                    }
                    if (character.found === false) {
                        allFound = false;
                    }
                    return character;
                });
                if (allFound === true) {
                    const completionTime = Date.now();
                    decoded.completionTime = completionTime;
                    const playerScore = GameService.calculateScore(decoded.startTime, completionTime);
                    const isHighScore = GameService.checkHighScores(playerScore, decoded.highScores);
                    return {
                        collision: true,
                        token: GameService.generateGameJwt(decoded),
                        isHighScore,
                        playerScore,
                    };
                }
            }
        }
        catch (error) {
            console.error("Error occurred while checking collision:", error);
            return { collision: "error" };
        }
    }
}
GameService.checkHighScores = (score, highScores) => {
    let isHighScore = true;
    highScores.forEach((highScore) => {
        if (highScore.score !== null && score > highScore.score) {
            isHighScore = false;
        }
    });
    return isHighScore;
};
exports.default = GameService;
