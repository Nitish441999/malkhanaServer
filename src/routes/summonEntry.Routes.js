import { Router } from "express";

import verifyJWT from "../middlewares/auth.Middleware.js";
import {
  createSummonEntry,
  getSummonEntry,
  getSummonEntryList,
} from "../controllers/summonEntry.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getSummonEntryList).post(createSummonEntry);

router.route("/:id").get(getSummonEntry);

export default router;
