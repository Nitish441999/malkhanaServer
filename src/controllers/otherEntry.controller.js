import asyncHandler from "../utils/asyncHandler.js";
import OtherEntry from "../models/OthersEntry.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import releaseModel from "../models/release.model.js";
import movementModel from "../models/movement.model.js";

const createOthersEntry = asyncHandler(async (req, res) => {
  const {
    firNo,
    mudNo,
    gdNo,
    ioName,
    banam,
    underSection,
    description,
    place,
    court,
    firYear,
    gdDate,
    DakhilKarneWala,
    caseProperty,
    actType,
    status,
  } = req.body;

  if (
    !firNo ||
    !mudNo ||
    !gdNo ||
    !ioName ||
    !banam ||
    !underSection ||
    !description ||
    !place ||
    !court ||
    !firYear ||
    !gdDate ||
    !DakhilKarneWala ||
    !caseProperty ||
    !actType ||
    !status
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingEntry = await OtherEntry.findOne({ firNo, mudNo });
  if (existingEntry) {
    throw new ApiError(400, "other entry already exists");
  }
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Failed to upload avatar file");
  }

  const newEntry = await OtherEntry.create({
    firNo,
    mudNo,
    gdNo,
    ioName,
    banam,
    underSection,
    description,
    place,
    court,
    firYear,
    gdDate,
    DakhilKarneWala,
    caseProperty,
    actType,
    status,
    avatar: avatar.url,
  });

  res
    .status(201)
    .json(new ApiResponse(201, newEntry, "other entry created successfully"));
});

const getOthersEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const otherDetails = await OtherEntry.findById(id);

  if (!otherDetails) {
    throw new ApiError(404, "other entry not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, otherDetails, "other entry fetched successfully")
    );
});

const getAllOthersEntry = asyncHandler(async (req, res) => {
  const otherEntries = await OtherEntry.find();

  if (!otherEntries.length) {
    throw new ApiError(404, "No other entries found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, otherEntries, "other entries fetched successfully")
    );
});

const updateOthersEntryDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const existingEntry = await OtherEntry.findById(id);
  if (!existingEntry) {
    throw new ApiError(404, "Entry not found");
  }

  const releaseItem = await releaseModel.findOne({
    mudNo: existingEntry.mudNo,
  });
  if (releaseItem) {
    throw new ApiError(400, "Modification is not allowed for released data");
  }

  const moveItem = await movementModel.find({ mudNo: existingMudNo });
    if (moveItem.length > 0) {
      throw new ApiError(400, "Modification is not allowed for Move data");
    }

  const requiredFields = [
    "firNo",
    "mudNo",
    "gdNo",
    "ioName",
    "banam",
    "underSection",
    "description",
    "place",
    "court",
    "firYear",
    "gdDate",
    "DakhilKarneWala",
    "caseProperty",
    "actType",
    "status",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      throw new ApiError(400, `Field '${field}' is required`);
    }
  }
  if (req.files?.avatar?.[0]?.path) {
    const avatarFile = req.files.avatar[0].path;
    const avatarUploadResult = await uploadOnCloudinary(avatarFile);

    if (!avatarUploadResult?.url) {
      throw new ApiError(500, "Failed to upload new avatar file");
    }

    req.body.avatar = avatarUploadResult.url;
  }

  const updatedEntry = await OtherEntry.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!updatedEntry) {
    throw new ApiError(404, "Other entry not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedEntry, "Other details updated successfully")
    );
});

const deleteOtherEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const existingEntry = await OtherEntry.findById(id);
  if (!existingEntry) {
    throw new ApiError(404, "Entry not found");
  }

  await OtherEntry.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, " ", "Data deleted successfully"));
});

export {
  createOthersEntry,
  getOthersEntry,
  getAllOthersEntry,
  updateOthersEntryDetails,
  deleteOtherEntry
};
