import asyncHandler from "../utils/asyncHandler.js";
import OtherEntry from "../models/OthersEntry.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../config/cloudinary.js";

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
    .json(
      new ApiResponse(201, newEntry, "other entry created successfully")
    );
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
      new ApiResponse(
        200,
        otherEntries,
        "other entries fetched successfully"
      )
    );
});

const updateOthersEntryDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
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
    avtar,
  } = req.body || {};

  if (Object.values(req.body).some((value) => !value)) {
    throw new ApiError(400, "All fields are required");
  }

  const otherUpdateDetails = await OtherEntry.findByIdAndUpdate(
    id,
    {
      $set: {
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
        avtar,
      },
    },
    { new: true, runValidators: true }
  );

  if (!otherUpdateDetails) {
    throw new ApiError(404, "other entry not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        otherUpdateDetails,
        "other details updated successfully"
      )
    );
});

export {
  createOthersEntry,
  getOthersEntry,
  getAllOthersEntry,
  updateOthersEntryDetails,
};
