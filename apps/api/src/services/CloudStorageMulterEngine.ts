import { Storage } from "@google-cloud/storage";
import multer from "multer";
import CloudStorageService from "./CloudStorageService";

class CloudStorageMulterEngine implements multer.StorageEngine {
  private cloudStorageService: CloudStorageService;

  constructor() {
    this.cloudStorageService = CloudStorageService.getInstance(new Storage());
  }

  _handleFile(
    req: Express.Request,
    file: Express.Multer.File,
    callback: (error?: any, info?: Partial<Express.Multer.File>) => void
  ): void {
    const saveLocation = `$${Date.now()}-${file.originalname}`;
    this.cloudStorageService
      .saveImage({
        saveLocation,
        image: file.buffer,
      })
      .then(() => {
        callback(null, {
          destination: saveLocation,
          filename: file.originalname,
          path: saveLocation,
          size: file.size,
        });
      })
      .catch(callback);
  }

  _removeFile(
    _req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error) => void
  ): void {
    console.log("_removeFile not implemented");
  }
}

export default CloudStorageMulterEngine;
