import mongoose from "mongoose";
import ArtoSeizure from "../models/artoSeizure.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import ReleaseModel from "../models/release.model.js";
import MovementModel from "../models/movement.model.js";

const artoSeizureEntry = asyncHandler(async (req, res) => {
  const {
    mudNo,
    gdNo,
    underSection,
    vehicleType,
    regNo,
    chassisNo,
    engineNo,
    colour,
    gdDate,
    actType,
    result,
  } = req.body;

  if (
    !mudNo ||
    !gdNo ||
    !underSection ||
    !vehicleType ||
    !regNo ||
    !chassisNo ||
    !engineNo ||
    !colour ||
    !gdDate ||
    !actType ||
    !result
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const entryExists = await ArtoSeizure.findOne({
    regNo,
    chassisNo,
    engineNo,
  });
  if (entryExists) {
    throw new ApiError(
      400,
      "Entry with this registration, chassis, engine number already exists"
    );
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatarURL = await uploadOnCloudinary(avatarLocalPath);
  if (!avatarURL) {
    throw new ApiError(400, "Failed to upload avatar file");
  }

  const NewArtoSeizureEntry = await ArtoSeizure.create({
    mudNo,
    gdNo,
    underSection,
    vehicleType,
    regNo,
    chassisNo,
    engineNo,
    colour,
    gdDate,
    actType,
    result,
    avatar: avatarURL.url,
  });

  if (!NewArtoSeizureEntry) {
    throw new ApiError(400, "Invalid entry data");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        NewArtoSeizureEntry,
        "Aarto Seizure Entry successful "
      )
    );
});

const getArtoSeizure = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "id is inviled");
  }

  const getartoSeizure = await ArtoSeizure.findById(id);

  if (!getMvctAct) {
    throw new ApiError(404, "Entry not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, getartoSeizure, "Entry retrieved successfully"));
});

const getArtoSeizureList = asyncHandler(async (req, res) => {
  const ArtoSeizureList = await ArtoSeizure.find();

  return res
    .status(200)
    .json(
      new ApiResponse(200, ArtoSeizureList, "Entries retrieved successfully")
    );
});

const updateArtoSeizure = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const {
    mudNo,
    gdNo,
    underSection,
    vehicleType,
    regNo,
    chassisNo,
    engineNo,
    colour,
    gdDate,
    actType,
    result,
  } = req.body;

  if (
    !mudNo ||
    !gdNo ||
    !underSection ||
    !vehicleType ||
    !regNo ||
    !chassisNo ||
    !engineNo ||
    !colour ||
    !gdDate ||
    !actType ||
    !result
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingEntry = await ArtoSeizure.findById(id);
  if (!existingEntry) {
    throw new ApiError(404, "Data does not Exist");
  }
  const existingMudNo = existingEntry.mudNo;

  const releaseItem = await ReleaseModel.findOne({ mudNo: existingMudNo });
  if (releaseItem.length > 0) {
    throw new ApiError(400, "Modification is not allowed for released data");
  }
  const moveItem = await MovementModel.findOne({ mudNo: existingMudNo });
  if (moveItem) {
    throw new ApiError(400, "Modification is not allowed for Move data");
  }

  if (req.files?.avatar?.[0]?.path) {
    const avatarFile = req.files.avatar[0].path;
    const avatarUploadResult = await uploadOnCloudinary(avatarFile);

    if (!avatarUploadResult?.url) {
      throw new ApiError(500, "Failed to upload new avatar file");
    }

    req.body.avatar = avatarUploadResult.url;
  }

  const updatedEntry = await ArtoSeizure.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedEntry, "Entry updated successfully"));
});

const deleteArtoSeizure = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const existingEntry = await ArtoSeizure.findById(id);
  if (!existingEntry) {
    throw new ApiError(404, "Entry not found");
  }

  await ArtoSeizure.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, " ", "Data deleted successfully"));
});

export {
  artoSeizureEntry,
  getArtoSeizure,
  getArtoSeizureList,
  updateArtoSeizure,
  deleteArtoSeizure,
};
