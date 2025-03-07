import asyncHandler from "../utils/asyncHandler.js";
import UnclaimedEntry from "../models/UnclaimedEntry.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import releaseModel from "../models/release.model.js";
import movementModel from "../models/movement.model.js";

const createUnclaimedEntry = asyncHandler(async (req, res) => {
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

  const existingEntry = await UnclaimedEntry.findOne({ firNo, mudNo });
  if (existingEntry) {
    throw new ApiError(400, "unclaimed entry already exists");
  }
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Failed to upload avatar file");
  }

  const newEntry = await UnclaimedEntry.create({
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
    .json(
      new ApiResponse(201, newEntry, "unclaimed entry created successfully")
    );
});

const getUnclaimedEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const UnclaimedEntryDetails = await UnclaimedEntry.findById(id);

  if (!UnclaimedEntryDetails) {
    throw new ApiError(404, "unclaimed entry not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        UnclaimedEntryDetails,
        "unclaimed entry fetched successfully"
      )
    );
});

const getAllUnclaimedEntry = asyncHandler(async (req, res) => {
  const unclaimedEntries = await UnclaimedEntry.find();

  if (!unclaimedEntries.length) {
    throw new ApiError(404, "No unclaimed entries found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        unclaimedEntries,
        "unclaimedunclaimedEntries entries fetched successfully"
      )
    );
});

const updateUnclaimedEntryDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const existingEntry = await UnclaimedEntry.findById(id);
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
    throw new ApiError(404, " unclaimed entry not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        unclaimedUpdateDetails,
        "unclaimed details updated successfully"
      )
    );
});

const deleteUnclaimedEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const existingEntry = await UnclaimedEntry.findById(id);
  if (!existingEntry) {
    throw new ApiError(404, "Entry not found");
  }

  await UnclaimedEntry.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, " ", "Data deleted successfully"));
});

export {
  createUnclaimedEntry,
  getUnclaimedEntry,
  getAllUnclaimedEntry,
  updateUnclaimedEntryDetails,
  deleteUnclaimedEntry,
};
