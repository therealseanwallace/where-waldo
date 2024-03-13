import jwt from "jsonwebtoken";
import DBService from "./DBService";
import GameInstance from "../interfaces/GameInstance";
import Character, { CharacterAttributes } from "../models/Character";

interface CharacterForGame extends CharacterAttributes {
  found: boolean;
}

interface Coordinates {
  x: number;
  y: number;
}

interface CheckCollissionPayload extends Coordinates {
  id: number;
}

class GameService {
  private static instance: GameService;

  private dbService: DBService | undefined;

  private async init() {
    this.dbService = await DBService.getInstance();
  }

  private static generateGameJwt(payload: object) {
    const secret = process.env.GAME_JWT_SECRET;
    if (!secret) {
      throw new Error("GAME_JWT_SECRET not found in environment variables.");
    }
    return jwt.sign(payload, secret, { expiresIn: "1h" });
  }

  private static checkInsideRectangle(
    rectStartX: number,
    rectEndY: number,
    rectStartY: number,
    rectEndX: number,
    pointX: number,
    pointY: number
  ) {
    const minX = Math.min(rectStartX, rectEndX);
    const maxX = Math.max(rectStartX, rectEndX);
    const minY = Math.min(rectStartY, rectEndY);
    const maxY = Math.max(rectStartY, rectEndY);

    return (
      pointX >= minX && pointX <= maxX && pointY >= minY && pointY <= maxY
    );
  }

  public static getInstance() {
    if (!GameService.instance) {
      GameService.instance = new GameService();
      GameService.instance.init();
    }
    return GameService.instance;
  }

  constructor() {
    this.init();
  }

  public async getGames() {
    return this.dbService!.getGames();
  }

  public async getOneGame(slug: string): Promise<GameInstance | null> {
    const game = await this.dbService!.getOneGame(slug);
    return game as GameInstance | null;
  }

  public async startGame(slug: string) {
    const timestamp = Date.now();

    const game = (await this.dbService!.getOneGame(
      slug
    )) as GameInstance | null;

    if (!game) {
      throw new Error("Game not found");
    }

    const charsToFind: CharacterForGame[] = game.characters.map((char) => {
      const charAttributes = char?.get() as CharacterAttributes;
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

  public async checkCollision(payload: CheckCollissionPayload) {
    try {
      const char = await this.dbService!.getOneCharacter(payload.id) as Character;

      const { rectStartX, rectEndX, rectStartY, rectEndY } = char.get();
    } catch (error) {}
  }
}

export default GameService;
