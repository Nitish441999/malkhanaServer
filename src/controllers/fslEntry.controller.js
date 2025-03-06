import asyncHandler from "../utils/asyncHandler.js";
import FslEntry from "../models/FslEntry.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import releaseModel from "../models/release.model.js";
import MovementModel from "../models/movement.model.js";

const createFslEntry = asyncHandler(async (req, res) => {
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
  console.log(req.body);

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

  const existingEntry = await FslEntry.findOne({ mudNo });
  if (existingEntry) {
    throw new ApiError(400, "fsl entry already exists");
  }
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Failed to upload avatar file");
  }

  const newEntry = await FslEntry.create({
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
    .json(new ApiResponse(201, newEntry, "fsl entry created successfully"));
});

const getFslEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const flsDetails = await FslEntry.findById(id);

  if (!flsDetails) {
    throw new ApiError(404, "fsl entry not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, flsDetails, "fsl entry fetched successfully"));
});

const getAllFslEntry = asyncHandler(async (req, res) => {
  const flsEntries = await FslEntry.find();

  if (!flsEntries.length) {
    throw new ApiError(404, "No fsl entries found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, flsEntries, "fsl entries fetched successfully"));
});

const updateFslEntryDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const existingEntry = await FslEntry.findById(id);
  if (!existingEntry) {
    throw new ApiError(404, "Entry not found");
  }

  const existingMudNo = existingEntry.mudNo;
  const releaseItem = await releaseModel.findOne({ mudNo: existingMudNo });

  if (releaseItem) {
    throw new ApiError(400, "Modification is not allowed for released data");
  }

  const moveItem = await MovementModel.find({ mudNo: existingMudNo });
  if (moveItem.length > 0) {
    throw new ApiError(400, "Modification is not allowed for Move data");
  }

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
  console.log(req.body);

  const requiredFields = {
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
  };

  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value || value === "") {
      throw new ApiError(400, `Field '${key}' is required`);
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

  const updatedFslEntry = await FslEntry.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!updatedFslEntry) {
    throw new ApiError(404, "FSL entry not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedFslEntry, "FSL details updated successfully")
    );
});

const deleteFslEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const existingEntry = await FslEntry.findById(id);
  if (!existingEntry) {
    throw new ApiError(404, "Entry not found");
  }

  await FslEntry.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, " ", "Data deleted successfully"));
});

export {
  createFslEntry,
  getFslEntry,
  getAllFslEntry,
  updateFslEntryDetails,
  deleteFslEntry,
};
