import mongoose from "mongoose";
import SeizedCashMetal from "../models/seizedCashYellowMetel.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import releaseModel from "../models/release.model.js";
import movementModel from "../models/movement.model.js";

const createSeizedCashMetel = asyncHandler(async (req, res) => {
  const {
    firNo,
    mudNo,
    policeStation,
    itemName,
    itemQty,
    expectedAmt,
    descriptions,
    seizedItem,
  } = req.body;

  const existingEntry = await SeizedCashMetal.findOne({ mudNo });
  if (!existingEntry) {
    throw new ApiError(400, "Mud number does not exist");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const seizedItems = await SeizedCashMetal.create({
    firNo,
    mudNo,
    policeStation,
    itemName,
    itemQty,
    expectedAmt,
    descriptions,
    seizedItem,
    avatar: avatar.url,
  });

  if (!seizedItems) {
    throw new ApiError(400, "Failed to add seized item.");
  }

  res
    .status(201)
    .json(new ApiResponse(201, seizedItems, "Seized item added successfully"));
});

const getSeizedItemList = asyncHandler(async (req, res) => {
  const seizedItemList = await SeizedCashMetal.find({});
  if (!seizedItemList) {
    throw new ApiError(400, "Seized item list is not Found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, seizedItemList, " Get Seized item list successfull")
    );
});

const deleteSeizedItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid ID");
  }

  const deletedItem = await SeizedCashMetal.findByIdAndDelete(id);

  if (!deletedItem) {
    throw new ApiError(404, "Seized item not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, " ", "Seized item deleted successfully"));
});

const updateSeizedItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const existingEntry = await SeizedCashMetal.findById(id);
  if (!existingEntry) {
    throw new ApiError(404, "Entry not found");
  }
  console.log(existingEntry);

  const existingMudNo = existingEntry.mudNo;
  console.log(existingMudNo);

  const releaseItem = await releaseModel.findOne({ mudNo: existingMudNo });
  if (releaseItem) {
    throw new ApiError(400, "Modification is not allowed for released data");
  }

  const moveItem = await movementModel.findOne({ mudNo: existingMudNo });
  console.log(moveItem);
  if (moveItem) {
    throw new ApiError(400, "Modification is not allowed for Move data");
  }

  const updateData = { ...req.body };

  if (req.files?.avatar?.[0]?.path) {
    const avatarFile = req.files.avatar[0].path;
    const avatarUploadResult = await uploadOnCloudinary(avatarFile);

    if (!avatarUploadResult?.url) {
      throw new ApiError(500, "Failed to upload new avatar file");
    }

    updateData.avatar = avatarUploadResult.url;
  }

  const updatedEntry = await SeizedCashMetal.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedEntry) {
    throw new ApiError(404, "Seized cash metal entry not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedEntry, "Seized Cash Metal update successful")
    );
});

export {
  createSeizedCashMetel,
  getSeizedItemList,
  deleteSeizedItem,
  updateSeizedItem,
};
