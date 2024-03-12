import { Request, Response } from 'express';
import AdminService from '../services/AdminService';

class GameController {
  private static instance: GameController;

  private adminService: AdminService;

  private constructor() {
    this.adminService = AdminService.getInstance();
  }

  public static getInstance(): GameController {
    if (!GameController.instance) {
      GameController.instance = new GameController();
    }
    return GameController.instance;
  }

  public getGames = async (req: Request, res: Response): Promise<void> => {
    console.log("GameController.getGames() called...");
    await this.adminService.getGames();
    res.send("Games retrieved from the database.");
  }
}

export default GameController;