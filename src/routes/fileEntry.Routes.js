import express from "express"; // ✅ Import express
import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url"; // Required for __dirname in ES Modules
import verifyJWT from "../middlewares/auth.Middleware.js";
import { uploadExcelFile } from "../controllers/fileEntry.controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

router.use(express.static(path.resolve(__dirname, "../../public")));

router.use(verifyJWT);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../public/temp");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("file"), uploadExcelFile);

export default router;
