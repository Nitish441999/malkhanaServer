import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import ReleaseEntry from "../models/release.model.js"; // Ensure correct model import
import { uploadOnCloudinary } from "../config/cloudinary.js";

const createReleaseEntry = asyncHandler(async (req, res) => {
  const {
    entryType,
    mudNo,
    mudDetails,
    receiverName,
    fatherName,
    address,
    mobile,
    releaseItems,
  } = req.body;

  // ✅ 1. Check if all required fields are provided
  if (
    !entryType ||
    !mudNo ||
    !mudDetails ||
    !receiverName ||
    !fatherName ||
    !address ||
    !mobile ||
    !releaseItems
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const entryExists = await ReleaseEntry.findOne({ mudNo });
  if (entryExists) {
    throw new ApiError(400, "Entry with this Mud No already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatarUploadResponse = await uploadOnCloudinary(avatarLocalPath);
  if (!avatarUploadResponse || !avatarUploadResponse.url) {
    throw new ApiError(400, "Failed to upload avatar file");
  }

  const documentLocalPath = req.files?.documentImage?.[0]?.path;
  console.log(documentLocalPath);

  if (!documentLocalPath) {
    throw new ApiError(400, "Document file is required");
  }

  const documentUploadResponse = await uploadOnCloudinary(documentLocalPath);
  if (!documentUploadResponse || !documentUploadResponse.url) {
    throw new ApiError(400, "Failed to upload document file");
  }

  const newEntry = new ReleaseEntry({
    entryType,
    mudNo,
    mudDetails,
    receiverName,
    fatherName,
    address,
    mobile,
    releaseItems,
    avatar: avatarUploadResponse.url,
    documentImage: documentUploadResponse.url,
  });

  await newEntry.save();

  return res
    .status(201)
    .json(new ApiResponse(201, newEntry, "Entry created successfully"));
});

export { createReleaseEntry };
