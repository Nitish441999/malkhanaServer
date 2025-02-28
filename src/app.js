import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "./routes/user.Routes.js";
import malkhanaRouter from "./routes/malkhana.Routes.js";
import fslrouter from "./routes/fsl.Routes.js";
import kurkiRouter from "./routes/kurki.Routes.js";
import otherRouter from "./routes/others.Routes.js";
import unclaimedRouter from "./routes/unclaimed.Routes.js";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("Public"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server started via GET request");
});

app.use("/api/v1/users", authRouter);
app.use("/api/v1/malkhana", malkhanaRouter);
app.use("/api/v1/fsl", fslrouter);
app.use("/api/v1/kurki", kurkiRouter);
app.use("/api/v1/other", otherRouter);
app.use("/api/v1/unclaimed", unclaimedRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ success: false, message: err.message });
});
export default app;
