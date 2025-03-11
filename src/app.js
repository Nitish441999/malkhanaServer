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
import mvActSeizureRouter from "./routes/mvActSeizure.Routes.js";
import artoSeizureRouter from "./routes/artoSeizure.Routes.js";
import exciseVehicleRouter from "./routes/exciseVehicle.Routes.js";
import ipcVehicleRouter from "./routes/ipcVehicle.Routes.js";
import seizureVehicleRouter from "./routes/seizureVehicle.Routes.js";
import unclaimedVehicleRouter from "./routes/unclaimedVehicle.Routes.js";
import SummonEntryRouter from "./routes/summonEntry.Routes.js";
import fileEntryRouter from "./routes/fileEntry.Routes.js";
import releaseRouter from "./routes/release.Routes.js";
import seizedRouter from "./routes/seizedItems.Routes.js";
import moveRouter from "./routes/moveItem.Routes.js";
import returnRouter from "./routes/return.Routes.js";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      process.env.CORS_ORIGIN,
      "https://malkhanaserver.onrender.com",
      "http://localhost:5173",
    ].filter(Boolean),
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
app.use("/api/v1/mvact", mvActSeizureRouter);
app.use("/api/v1/artoSeizure", artoSeizureRouter);
app.use("/api/v1/exciseVehicle", exciseVehicleRouter);
app.use("/api/v1/ipcVehicle", ipcVehicleRouter);
app.use("/api/v1/seizureVehicle", seizureVehicleRouter);
app.use("/api/v1/unclaimedVehicle", unclaimedVehicleRouter);
app.use("/api/v1/summon", SummonEntryRouter);
app.use("/api/v1/fileEntry", fileEntryRouter);
app.use("/api/v1/release", releaseRouter);
app.use("/api/v1/seized", seizedRouter);
app.use("/api/v1/move", moveRouter);
app.use("/api/v1/return", returnRouter);
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ success: false, message: err.message });
});
export default app;
