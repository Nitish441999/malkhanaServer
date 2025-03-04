import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import verifyJWT from "../middlewares/auth.Middleware.js";
import {
  createSeizedCashMetel,
  deleteSeizedItem,
  getSeizedItemList,
} from "../controllers/seizedCashMetel.controller.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getSeizedItemList)
  .post(
    upload.fields([
      {
        name: "avatar",
        maxCount: 10,
      },
    ]),
    createSeizedCashMetel
  );

router
  .route("/:id")
  //   .get(getArtoSeizure)
  //   .patch(
  //     upload.fields([
  //       {
  //         name: "avatar",
  //         maxCount: 10,
  //       },
  //     ]),
  //     updateArtoSeizure
  //   )
  .delete(deleteSeizedItem);
export default router;
