"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = require("@google-cloud/storage");
const CloudStorageService_1 = __importDefault(require("./CloudStorageService"));
class CloudStorageMulterEngine {
    constructor() {
        this.cloudStorageService = CloudStorageService_1.default.getInstance(new storage_1.Storage());
    }
    _handleFile(req, file, callback) {
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
    _removeFile(_req, file, callback) {
        console.log("_removeFile not implemented");
    }
}
exports.default = CloudStorageMulterEngine;
