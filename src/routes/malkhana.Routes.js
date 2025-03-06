import { Router } from "express";
import {
  createMalkhanaEntry,
  getMalkhanaEntry,
  getAllMalkhanaEntries,
  updateMalkhanaEntryDetails,
  deleteMalkhanaEntry,
} from "../controllers/malkhanaEntry.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import verifyJWT from "../middlewares/auth.Middleware.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getAllMalkhanaEntries)
  .post(
    upload.fields([
      {
        name: "avatar",
        maxCount: 10,
      },
    ]),
    createMalkhanaEntry
  );

router
  .route("/:id")
  .get(getMalkhanaEntry)
  .patch( upload.fields([
    {
      name: "avatar",
      maxCount: 10,
    },
  ]),updateMalkhanaEntryDetails)
  .delete(deleteMalkhanaEntry);

export default router;
