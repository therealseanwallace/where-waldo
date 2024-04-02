import express from "express";
import AdminController from "../controllers/AdminController";

const adminController: AdminController = AdminController.getInstance();

const router = express.Router();

router.post("/uploadGame", adminController.uploadGame);

router.post("/addChars", adminController.addChars);
