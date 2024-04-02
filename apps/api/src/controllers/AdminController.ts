import { Request, Response } from "express";
import DBService from "../services/DBService";

class AdminController {
  private static instance: AdminController;

  private dbService: DBService | undefined;

  private async init() {
    this.dbService = await DBService.getInstance();
  }

  private constructor() {
    this.init();
  }

  public static getInstance(): AdminController {
    if (!AdminController.instance) {
      AdminController.instance = new AdminController();
    }
    return AdminController.instance;
  }

  public uploadGame = async (req: Request, res: Response) => {};

  public addChars = async (req: Request, res: Response) => {};
}

export default AdminController;
