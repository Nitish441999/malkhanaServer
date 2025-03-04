import { Router } from "express";

import { upload } from "../middlewares/multer.middlewares.js";
import verifyJWT from "../middlewares/auth.Middleware.js";
import {
  createMove,
  deleteMoveItem,
  getMoveItemList,
} from "../controllers/moveMovement.controller.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getMoveItemList)
  .post(
    upload.fields([
      {
        name: "avatar",
        maxCount: 10,
      },
    ]),
    createMove
  );

router
  .route("/:id")
  //   .get(getMalkhanaEntry)
  //   .patch(updateMalkhanaEntryDetails)
  .delete(deleteMoveItem);

export default router;
