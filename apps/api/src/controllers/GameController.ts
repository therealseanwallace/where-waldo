import { Request, Response } from 'express';
import GameService from '../services/GameService';

class GameController {
  private static instance: GameController;

  private gameService: GameService;

  private constructor() {
    this.gameService = GameService.getInstance();
  }

  public static getInstance(): GameController {
    if (!GameController.instance) {
      GameController.instance = new GameController();
    }
    return GameController.instance;
  }

  public getGames = async (req: Request, res: Response): Promise<void> => {
    console.log("GameController.getGames() called...");
    await this.gameService.getGames();
    res.send("Games retrieved from the database.");
  }
}

export default GameController;