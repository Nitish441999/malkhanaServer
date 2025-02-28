import { Router } from "express";

import { upload } from "../middlewares/multer.middlewares.js";
import verifyJWT from "../middlewares/auth.Middleware.js";
import { createKurkiEntry, getAllKurkiEntry, getKurkiEntry, updateKurkiEntryDetails } from "../controllers/kurkiEntry.controller.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getAllKurkiEntry)
  .post(
    upload.fields([
      {
        name: "avatar",
        maxCount: 1,
      },
    ]),
    createKurkiEntry
  );

router.route("/:id").get(getKurkiEntry).put(updateKurkiEntryDetails);


export default router;
