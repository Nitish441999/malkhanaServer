import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
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
import { uploadOnCloudinary } from "../config/cloudinary.js";
import mongoose from "mongoose";
import ReturnModel from "../models/return.Model.js";
import movementModel from "../models/movement.model.js";

const createReturn = asyncHandler(async (req, res) => {
  const user = req.user;
  const { entryType, firNo, mudNo, receivedBy, trackingBy, description } =
    req.body;

  if (!entryType || !firNo || !mudNo || !receivedBy || !trackingBy) {
    throw new ApiError(400, "All required fields must be filled.");
  }
  const moveItem = await movementModel.find({ mudNo: mudNo });
  if (!moveItem) {
    throw new ApiError(401, "Mud Number is not Move data");
  }
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatarUpload = await uploadOnCloudinary(avatarLocalPath);
  if (!avatarUpload || !avatarUpload.secure_url) {
    throw new ApiError(400, "Failed to upload avatar file");
  }

  const newReturnEntry = await ReturnModel.create({
    entryType,
    firNo,
    mudNo,
    receivedBy,
    trackingBy,
    description,
    avatar: avatarUpload.secure_url,
    policeStation: user.policeStation,
    district: user.district,
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
    { $set: { trackingBy: newReturnEntry.trackingBy } },
    { new: true }
  );

  res
    .status(201)
    .json(new ApiResponse(201, createReturn, "Is Return created successfully"));
});

const getReturnItemList = asyncHandler(async (req, res) => {
  const returnItemList = await ReturnModel.find({});

  if (returnItemList.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No Return list items found"));
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        returnItemList,
        "Return list items retrieved successfully"
      )
    );
});

const deleteReturnItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid ID");
  }

  const deletedItem = await ReturnModel.findByIdAndDelete(id);

  if (!deletedItem) {
    throw new ApiError(404, "Return item not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, " ", "Return item deleted successfully"));
});
export { createReturn, getReturnItemList, deleteReturnItem };
