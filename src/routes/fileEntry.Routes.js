import express from "express";
import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import verifyJWT from "../middlewares/auth.Middleware.js";
import {
  deletefileEntry,
  getFileEntryList,
  uploadExcelFile,
} from "../controllers/fileEntry.controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

router.use(express.static(path.resolve(__dirname, "../../Public/temp")));

router.use(verifyJWT);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../Public/temp");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("file"), uploadExcelFile);
router.get("/", getFileEntryList);
router.delete("/:id ", deletefileEntry);
export default router;
