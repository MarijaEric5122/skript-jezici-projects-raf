import { Router } from "express";
import * as PicturesController from "./pictures.controller";
import { authGuard } from "../../utils/auth";

const router = Router();

/**
 * Public GET endpoints
 */
router.get("/", PicturesController.listPictures);
router.get("/:pictureId", PicturesController.getPicture);

/**
 * Protected endpoints: only accessible to authenticated users
 */
router.post("/", authGuard, PicturesController.createPicture);
router.patch("/:pictureId", authGuard, PicturesController.updatePicture);
router.delete("/:pictureId", authGuard, PicturesController.deletePicture);

export default router;
