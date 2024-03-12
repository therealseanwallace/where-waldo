import express from "express";
import GameController from "../controllers/GameController";

const gameController = GameController.getInstance();

const router = express.Router();

/* 
/* POST for uploading a new image 

router.post("/upload", uploadImage, (req, res) => {
  res.json({message: 'Image uploaded successfully'});
});

/* POST for adding characters and their hitboxes to an uploaded image 

router.post("/addcharacters", addChars, (req, res) => {
  res.json({message: 'Characters added successfully'});
}); */

router.get("/get-games", gameController.getGames);

export default router;