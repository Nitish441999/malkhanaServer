import asyncHandler from "../utils/asyncHandler.js";
import KurkiEntry from "../models/kurkiEntry.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import releaseModel from "../models/release.model.js";
import movementModel from "../models/movement.model.js";

const createKurkiEntry = asyncHandler(async (req, res) => {
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

  const existingEntry = await KurkiEntry.findOne({ firNo, mudNo });
  if (existingEntry) {
    throw new ApiError(400, "kurki entry already exists");
  }
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Failed to upload avatar file");
  }

  const newEntry = await KurkiEntry.create({
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
    district: user.district,
  });

  res
    .status(201)
    .json(new ApiResponse(201, newEntry, "Kurki entry created successfully"));
});

const getKurkiEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const KurkiEntryDetails = await KurkiEntry.findById(id);

  if (!KurkiEntryDetails) {
    throw new ApiError(404, "Kurki entry not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        KurkiEntryDetails,
        "Kurki entry fetched successfully"
      )
    );
});

const getAllKurkiEntry = asyncHandler(async (req, res) => {
  const kurkiEntry = await KurkiEntry.find();

  if (!kurkiEntry.length) {
    throw new ApiError(404, "No Kurki entries found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, kurkiEntry, "Kurki entries fetched successfully")
    );
});

const updateKurkiEntryDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const existingEntry = await KurkiEntry.findById(id);
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

  const kurkiEntryUpdateDetails = await KurkiEntry.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!kurkiEntryUpdateDetails) {
    throw new ApiError(404, "Kurki entry not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        kurkiEntryUpdateDetails,
        "Kurki details updated successfully"
      )
    );
});

const deleteKurkiEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const existingEntry = await KurkiEntry.findById(id);
  if (!existingEntry) {
    throw new ApiError(404, "Entry not found");
  }

  await KurkiEntry.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, " ", "Data deleted successfully"));
});

export {
  createKurkiEntry,
  getKurkiEntry,
  getAllKurkiEntry,
  updateKurkiEntryDetails,
  deleteKurkiEntry,
};
