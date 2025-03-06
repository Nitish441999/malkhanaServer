import mongoose from "mongoose";
import MvActSeizure from "../models/mvActSeizure.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import releaseModel from "../models/release.model.js";

const mvActSeizureEntry = asyncHandler(async (req, res) => {
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

  const entryExists = await MvActSeizure.findOne({
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

  const NewMvActSeizureEntry = await MvActSeizure.create({
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

  if (!NewMvActSeizureEntry) {
    throw new ApiError(400, "Invalid entry data");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        NewMvActSeizureEntry,
        "M.V Act Seizure Entry successful "
      )
    );
});

const getMvActSeizure = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "id is inviled");
  }

  const getMvctAct = await MvActSeizure.findById(id);

  if (!getMvctAct) {
    throw new ApiError(404, "Entry not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, getMvctAct, "Entry retrieved successfully"));
});

const getMvActSeizureList = asyncHandler(async (req, res) => {
  const MvActSeizureList = await MvActSeizure.find();

  return res
    .status(200)
    .json(
      new ApiResponse(200, MvActSeizureList, "Entries retrieved successfully")
    );
});

const updateMvActSeizure = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const requiredFields = [
    "mudNo",
    "gdNo",
    "underSection",
    "vehicleType",
    "regNo",
    "chassisNo",
    "engineNo",
    "colour",
    "gdDate",
    "actType",
    "result",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      throw new ApiError(400, `Field '${field}' is required`);
    }
  }

  const existingEntry = await MvActSeizure.findById(id);
  if (!existingEntry) {
    throw new ApiError(404, "Entry not found");
  }

  const releaseItem = await releaseModel.findOne({
    mudNo: existingEntry.mudNo,
  });

  if (releaseItem) {
    throw new ApiError(400, "Modification is not allowed for released data");
  }

  if (req.files?.avatar?.[0]?.path) {
    const avatarFile = req.files.avatar[0].path;
    const avatarUploadResult = await uploadOnCloudinary(avatarFile);

    if (!avatarUploadResult?.url) {
      throw new ApiError(500, "Failed to upload new avatar file");
    }

    req.body.avatar = avatarUploadResult.url;
  }

  const updatedEntry = await MvActSeizure.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!updatedEntry) {
    throw new ApiError(404, "Failed to update entry");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedEntry, "Entry updated successfully"));
});

const deleteMvActSeizure = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const existingEntry = await MvActSeizure.findById(id);
  if (!existingEntry) {
    throw new ApiError(404, "Entry not found");
  }

  await MvActSeizure.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, " ", "Data deleted successfully"));
});

export {
  mvActSeizureEntry,
  getMvActSeizure,
  getMvActSeizureList,
  updateMvActSeizure,
  deleteMvActSeizure,
};
