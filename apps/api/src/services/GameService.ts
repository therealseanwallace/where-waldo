import jwt, { JwtPayload } from "jsonwebtoken";
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

interface CheckCollisionPayload extends Coordinates {
  id: number;
  token: string;
}

interface HitPayload {
  rectStartX: number;
  rectEndX: number;
  rectStartY: number;
  rectEndY: number;
  pointX: number;
  pointY: number;
}

interface GameHighScore {
  name: string;
  score: number;
  gameSlug: string;
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

  private static checkInsideRectangle(payload: HitPayload) {
    const { rectStartX, rectEndX, rectStartY, rectEndY, pointX, pointY } =
      payload;
    const minX = Math.min(rectStartX, rectEndX);
    const maxX = Math.max(rectStartX, rectEndX);
    const minY = Math.min(rectStartY, rectEndY);
    const maxY = Math.max(rectStartY, rectEndY);

    return pointX >= minX && pointX <= maxX && pointY >= minY && pointY <= maxY;
  }

  private static checkHighScores = (
    score: number,
    highScores: GameHighScore[]
  ) => {
    let isHighScore = true;

    highScores.forEach((highScore) => {
      if (highScore.score !== null && score > highScore.score) {
        isHighScore = false;
      }
    });

    return isHighScore;
  };

  private static calculateScore(startTime: number, completionTime: number) {
    return Math.floor((completionTime - startTime) / 1000);
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

  public async checkCollision(payload: CheckCollisionPayload) {
    interface simpleReturnValue {
      collison: boolean;
    }

    interface returnValueWithToken extends simpleReturnValue {
      token: string;
      isHighScore: boolean;
      collision: boolean;
      playerScore: number;
    }

    try {
      const char = (await this.dbService!.getOneCharacter(
        payload.id
      )) as Character;

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
        const decoded = jwt.verify(
          token,
          process.env.GAME_JWT_SECRET!
        ) as JwtPayload;

        let allFound = true;

        decoded.charsTofind = decoded.charsTofind.map(
          (character: CharacterForGame) => {
            if (character.id === payload.id) {
              return { ...character, found: true };
            }
            if (character.found === false) {
              allFound = false;
            }
            return character;
          }
        );

        if (allFound === true) {
          const completionTime = Date.now();
          decoded.completionTime = completionTime;
          const playerScore = GameService.calculateScore(
            decoded.startTime,
            completionTime
          );
          const isHighScore = GameService.checkHighScores(
            playerScore,
            decoded.highScores
          );

          return {
            collision: true,
            token: GameService.generateGameJwt(decoded),
            isHighScore,
            playerScore,
          };
        }
      }
    } catch (error) {
      console.error("Error occurred while checking collision:", error);
      return { collision: "error" };
    }
  }
}

export default GameService;
