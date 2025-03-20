import asyncHandler from "../utils/asyncHandler.js";
import MalkhanaEntry from "../models/malkhanaEntry.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import releaseModel from "../models/release.model.js";
import movementModel from "../models/movement.model.js";

const createMalkhanaEntry = asyncHandler(async (req, res) => {
  const user = req.user;


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

  const existingEntry = await MalkhanaEntry.findOne({ firNo, mudNo });
  if (existingEntry) {
    throw new ApiError(400, "Malkhana entry already exists");
  }
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Failed to upload avatar file");
  }

  const newEntry = await MalkhanaEntry.create({
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
    policeStation: user.policeStation,
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, newEntry, "Malkhana entry created successfully")
    );
});

const getMalkhanaEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const malkhanaDetails = await MalkhanaEntry.findById(id);

  if (!malkhanaDetails) {
    throw new ApiError(404, "Malkhana entry not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        malkhanaDetails,
        "Malkhana entry fetched successfully"
      )
    );
});

const getAllMalkhanaEntries = asyncHandler(async (req, res) => {
  const malkhanaEntries = await MalkhanaEntry.find();

  if (!malkhanaEntries.length) {
    throw new ApiError(404, "No Malkhana entries found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        malkhanaEntries,
        "Malkhana entries fetched successfully"
      )
    );
});

const updateMalkhanaEntryDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const existingEntry = await MalkhanaEntry.findById(id);
  if (!existingEntry) {
    throw new ApiError(404, "Entry not found");
  }

  const existingMudNo = existingEntry.mudNo;
  const releaseItem = await releaseModel.findOne({ mudNo: existingMudNo });

  if (releaseItem) {
    throw new ApiError(400, "Modification is not allowed for released data");
  }

  const moveItem = await movementModel.findOne({ mudNo: existingMudNo });
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

  const malkhanaUpdateDetails = await MalkhanaEntry.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!malkhanaUpdateDetails) {
    throw new ApiError(404, "Malkhana entry not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        malkhanaUpdateDetails,
        "Malkhana details updated successfully"
      )
    );
});

const deleteMalkhanaEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const existingEntry = await MalkhanaEntry.findById(id);
  if (!existingEntry) {
    throw new ApiError(404, "Entry not found");
  }

  await MalkhanaEntry.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, " ", "Data deleted successfully"));
});
export {
  createMalkhanaEntry,
  getMalkhanaEntry,
  getAllMalkhanaEntries,
  updateMalkhanaEntryDetails,
  deleteMalkhanaEntry,
};
