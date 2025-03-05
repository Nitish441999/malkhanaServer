import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import verifyJWT from "../middlewares/auth.Middleware.js";
import {
  createReturn,
  deleteReturnItem,
  getReturnItemList,
} from "../controllers/returnMovement.Controller.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getReturnItemList)
  .post(
    upload.fields([
      {
        name: "avatar",
        maxCount: 10,
      },
    ]),
    createReturn
  );

router
  .route("/:id")
  //   .get(getMalkhanaEntry)
  //   .patch(updateMalkhanaEntryDetails)
  .delete(deleteReturnItem);

export default router;
