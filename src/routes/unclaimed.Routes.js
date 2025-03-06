import { Router } from "express";

import { upload } from "../middlewares/multer.middlewares.js";
import verifyJWT from "../middlewares/auth.Middleware.js";
import {
  createUnclaimedEntry,
  deleteUnclaimedEntry,
  getAllUnclaimedEntry,
  getUnclaimedEntry,
  updateUnclaimedEntryDetails,
} from "../controllers/unclaimed.controller.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getAllUnclaimedEntry)
  .post(
    upload.fields([
      {
        name: "avatar",
        maxCount: 10,
      },
    ]),
    createUnclaimedEntry
  );

router.route("/:id").get(getUnclaimedEntry).patch( upload.fields([
  {
    name: "avatar",
    maxCount: 10,
  },
]),updateUnclaimedEntryDetails).delete(deleteUnclaimedEntry);;

export default router;
