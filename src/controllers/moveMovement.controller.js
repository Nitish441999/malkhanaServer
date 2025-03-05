import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponce from "../utils/ApiResponse.js";
import Malkhana_Entry from "../models/malkhanaEntry.model.js";
import FSL_Entry from "../models/FslEntry.model.js";
import Kurki_Entry from "../models/kurkiEntry.model.js";
import Other_Entry from "../models/OthersEntry.model.js";
import Unclaimed_Entry from "../models/UnclaimedEntry.model.js";
import MVAct_Seizure from "../models/mvActSeizure.model.js";
import ARTO_Seizure from "../models/artoSeizure.model.js";
import IPC_Vehicle from "../models/ipcVehicle.model.js";
import Excise_Vehicle from "../models/exciseVehicle.model.js";
import Unclaimed_Vehicle from "../models/unclaimedVehicle.model.js";
import Seizure_Vehicle from "../models/seizureVehicle.model.js";
import MovementModel from "../models/movement.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import mongoose from "mongoose";

const createMove = asyncHandler(async (req, res) => {
  const { entryType, firNo, mudNo, takenOutBy, trackingBy, description } =
    req.body;

  if (!entryType || !firNo || !mudNo || !takenOutBy || !trackingBy) {
    throw new ApiError(400, "All required fields must be filled.");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatarUpload = await uploadOnCloudinary(avatarLocalPath);
  if (!avatarUpload || !avatarUpload.secure_url) {
    throw new ApiError(400, "Failed to upload avatar file");
  }

  
  const newMoveEntry = await MovementModel.create({
    entryType, 
    firNo,
    mudNo,
    takenOutBy,
    trackingBy,
    description,
    avatar: avatarUpload.secure_url,
  });

  
  const entryModels = {
    Malkhana_Entry,
    FSL_Entry,
    Kurki_Entry,
    Other_Entry,
    Unclaimed_Entry,
    MVAct_Seizure,
    ARTO_Seizure,
    IPC_Vehicle,
    Excise_Vehicle,
    Unclaimed_Vehicle,
    Seizure_Vehicle,
  };

  const EntryModel = entryModels[entryType]; // ✅ Use `entryType` directly
  if (!EntryModel) {
    throw new ApiError(400, "Invalid entry type.");
  }

  
  await EntryModel.findOneAndUpdate(
    { mudNo },
    { $set: { trackingBy: newMoveEntry.trackingBy } },
    { new: true }
  );

  res
    .status(201)
    .json(new ApiResponce(201, newMoveEntry, "Entry created successfully"));
});

const getMoveItemList = asyncHandler(async (req, res) => {
  const moveItemList = await MovementModel.find({});

  if (moveItemList.length === 0) {
    return res
      .status(200)
      .json(new ApiResponce(200, [], "No move list items found"));
  }

  res
    .status(200)
    .json(
      new ApiResponce(
        200,
        moveItemList,
        "Move list items retrieved successfully"
      )
    );
});

const deleteMoveItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid ID");
  }

  const deletedItem = await MovementModel.findByIdAndDelete(id);

  if (!deletedItem) {
    throw new ApiError(404, "Move item not found");
  }

  res
    .status(200)
    .json(new ApiResponce(200, " ", "Move item deleted successfully"));
});



export { createMove, getMoveItemList, deleteMoveItem };
