"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = require("@google-cloud/storage");
class CloudStorageService {
    constructor(storageInstance) {
        this.saveImage = async ({ saveLocation, image, }) => {
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
            }
            catch (error) {
                console.error("Error saving image", error);
                throw error;
            }
        };
        this.getImage = async ({ filename, res, }) => {
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
            }
            catch (error) {
                console.error("Error retrieving image", error);
                throw error;
            }
        };
        this.storageInstance = storageInstance;
        if (!CloudStorageService.serviceKeyProvider.serviceKey) {
            throw new Error("Unable to find GCP_SERVICE_KEY_BASE64 environment variable. Check your environment variable configuration.");
        }
        const storage = new storage_1.Storage({
            projectId: CloudStorageService.serviceKeyProvider.serviceKey.project_id,
            credentials: CloudStorageService.serviceKeyProvider.serviceKey,
        });
        this.storageInstance = storage;
    }
    static getContentType(filename) {
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
    static getInstance(storageInstance) {
        if (!CloudStorageService.instance) {
            CloudStorageService.instance = new CloudStorageService(storageInstance);
        }
        return CloudStorageService.instance;
    }
}
CloudStorageService.serviceKeyProvider = {
    get serviceKey() {
        const { GCP_SERVICE_KEY_BASE64 } = process.env;
        if (!GCP_SERVICE_KEY_BASE64)
            return null;
        const serviceKey = JSON.parse(Buffer.from(GCP_SERVICE_KEY_BASE64, "base64").toString());
        return serviceKey;
    },
};
exports.default = CloudStorageService;
