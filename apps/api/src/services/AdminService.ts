/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, RequestHandler, Request, Response } from "express";
import multer from "multer";
import CloudStorageService from "./CloudStorageService";
import CloudStorageMulterEngine from "./CloudStorageMulterEngine";
import DBService from "./DBService";
import Game from "../models/Game";
import Character from "../models/Character";

class AdminService {
  private static instance: AdminService;

  private dbService: DBService | undefined;

  private CloudStorageMulterEngine: CloudStorageMulterEngine | undefined;

  private async init() {
    this.dbService = await DBService.getInstance();
    this.CloudStorageMulterEngine = new CloudStorageMulterEngine();
  }

  private constructor() {
    this.init();
  }

  private static imageUploader: RequestHandler = multer({
    storage: new CloudStorageMulterEngine(),
  }).single("image");

  private static thumbnailUploader: RequestHandler = multer({
    storage: new CloudStorageMulterEngine(),
  }).single("thumbnail");

  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  public uploadGame() {
    return (req: Request, res: Response, _next: NextFunction) => {
      AdminService.imageUploader(req, res, async (err: unknown) => {
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
        const game = new Game({
          name,
          slug,
          path: req.file?.path,
          highScores,
        });

        try {
          await this.dbService!.createOrUpdateModel({
            model: Game,
            data: game,
          });

          res.json({
            message: `Game ${name} uploaded successfully! Slug: ${slug}.`,
          });
        } catch (error) {
          console.error("Error occurred while uploading game:", error);
          res.status(500).send("An error occurred while uploading the game.");
        }
      });
    };
  }

  public uploadChar() {
    return (req: Request, res: Response, _next: NextFunction) => {
      AdminService.thumbnailUploader(req, res, async (err: unknown) => {
        if (err) {
          console.error("Error occurred while uploading thumbnail:", err);
          return res
            .status(422)
            .send("An error occurred while uploading the thumbnail.");
        }

        // File upload is successful. Add the character's data to the database.

        const { name, rectStart, rectEnd, gameSlug } = req.body;

        const char = new Character({
          name,
          gameSlug,
          thumbnailPath: req.file?.path,
          thumbnailHeight: req.body.thumbnailHeight,
          thumbnailWidth: req.body.thumbnailWidth,
          rectStartX: rectStart.x,
          rectStartY: rectStart.y,
          rectEndX: rectEnd.x,
          rectEndY: rectEnd.y,
        });

        try {
          await this.dbService!.createOrUpdateModel({
            model: Character,
            data: char,
          });

          res.json({ message: `Character ${name} uploaded successfully!` });
        } catch (error) {
          console.error("Error occurred while uploading character:", error);
          res
            .status(500)
            .send("An error occurred while uploading the character.");
        }
      });
    };
  }
}

export default AdminService;
