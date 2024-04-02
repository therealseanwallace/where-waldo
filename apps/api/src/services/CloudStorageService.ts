import { Response } from "express";
import { Storage } from "@google-cloud/storage";

class CloudStorageService {
  private static instance: CloudStorageService;

  private storageInstance: Storage;

  private constructor(storageInstance: Storage) {
    this.storageInstance = storageInstance;
    if (!CloudStorageService.serviceKeyProvider.serviceKey) {
      throw new Error(
        "Unable to find GCP_SERVICE_KEY_BASE64 environment variable. Check your environment variable configuration."
      );
    }

    const storage = new Storage({
      projectId: CloudStorageService.serviceKeyProvider.serviceKey.project_id,
      credentials: CloudStorageService.serviceKeyProvider.serviceKey,
    });

    this.storageInstance = storage;
  }

  private static serviceKeyProvider = {
    get serviceKey() {
      const { GCP_SERVICE_KEY_BASE64 } = process.env;

      if (!GCP_SERVICE_KEY_BASE64) return null;

      const serviceKey = JSON.parse(
        Buffer.from(GCP_SERVICE_KEY_BASE64, "base64").toString()
      );
      return serviceKey;
    },
  };

  private static getContentType(filename: string): string | undefined {
    const extension = filename.split(".").pop();
    if (extension === "jpg" || extension === "jpeg") {
      return "image/jpeg";
    }

    if (extension === "png") {
      return "image/png";
    }

    if (extension === "webp") {
      return "image/webp";
    }
  }

  public static getInstance(storageInstance: Storage): CloudStorageService {
    if (!CloudStorageService.instance) {
      CloudStorageService.instance = new CloudStorageService(storageInstance);
    }
    return CloudStorageService.instance;
  }

  public saveImage = async ({
    saveLocation,
    image,
  }: {
    saveLocation: string;
    image: Buffer;
  }) => {
    try {
      const bucket = this.storageInstance.bucket("waldo-odin");
      const blob = bucket.file(saveLocation);

      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: CloudStorageService.getContentType(saveLocation),
        },
      });

      blobStream.on("error", (error) => {
        console.error(error);
        throw error;
      });

      blobStream.on("finish", () => {
        console.log("Image uploaded to Google Cloud Storage.");
      });

      blobStream.end(image);

      return saveLocation;
    } catch (error) {
      console.error("Error saving image", error);
      throw error;
    }
  };

  public getImage = async ({
    filename,
    res,
  }: {
    filename: string;
    res: Response;
  }) => {
    try {
      const bucket = this.storageInstance.bucket("quantum-calc");
      const file = bucket.file(filename);

      res.setHeader("Content-Type", "image/png");

      file
        .createReadStream()
        .pipe(res)
        .on("error", (error) => {
          console.error("Error streaming image", error);
          res.status(500).send([{ message: "Error streaming image." }]);
        });
    } catch (error) {
      console.error("Error retrieving image", error);
      throw error;
    }
  };
}

export default CloudStorageService;
