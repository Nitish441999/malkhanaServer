import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import verifyJWT from "../middlewares/auth.Middleware.js";
import { createReleaseEntry } from "../controllers/release.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(
  upload.fields([
    { name: "avatar", maxCount: 10 },
    { name: "documentImage", maxCount: 10 },
  ]),
  createReleaseEntry
);

// router
//   .route("/:id")
//   .get(getArtoSeizure)
//   .patch(
//     upload.fields([
//       {
//         name: "avatar",
//         maxCount: 10,
//       },
//     ]),
//     updateArtoSeizure
//   );

export default router;
