import asyncHandler from "../utils/asyncHandler.js";
import FslEntry from "../models/FslEntry.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import releaseModel from "../models/release.model.js";

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

  const existingEntry = await FslEntry.findOne({ firNo, mudNo });
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
    "avtar",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      throw new ApiError(400, `Field '${field}' is required`);
    }
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

export { createFslEntry, getFslEntry, getAllFslEntry, updateFslEntryDetails };
