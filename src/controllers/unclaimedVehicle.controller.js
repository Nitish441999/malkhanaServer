import mongoose from "mongoose";
import UnclaimedVehicle from "../models/unclaimedVehicle.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import releaseModel from "../models/release.model.js";
import movementModel from "../models/movement.model.js";

const unclaimedVehicleEntry = asyncHandler(async (req, res) => {
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

    vivechak,
    banam,
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
    !result ||
    !vivechak ||
    !banam
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const entryExists = await UnclaimedVehicle.findOne({
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

  const NewUnclaimedVehicleEntry = await UnclaimedVehicle.create({
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

    vivechak,
    banam,
    avatar: avatarURL.url,
  });

  if (!NewUnclaimedVehicleEntry) {
    throw new ApiError(400, "Invalid entry data");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        NewUnclaimedVehicleEntry,
        "Unclaimed Vehicle Entry successful "
      )
    );
});

const getUnclaimedVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "id is inviled");
  }

  const unclaimedVehicles = await UnclaimedVehicle.findById(id);

  if (!unclaimedVehicles) {
    throw new ApiError(404, "Entry not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, unclaimedVehicles, "Entry retrieved successfully")
    );
});

const getUnclaimedVehicleList = asyncHandler(async (req, res) => {
  const UnclaimedVehicleList = await UnclaimedVehicle.find();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        UnclaimedVehicleList,
        "Entries retrieved successfully"
      )
    );
});

const updateUnclaimedVehicle = asyncHandler(async (req, res) => {
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

    vivechak,
    banam,
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
    !result ||
    !vivechak ||
    !banam
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingEntry = await UnclaimedVehicle.findById(id);
  if (!existingEntry) {
    throw new ApiError(404, "Entry not found");
  }

   const releaseItem = await releaseModel.findOne({
      mudNo: existingEntry.mudNo,
    });
    if (releaseItem) {
      throw new ApiError(400, "Modification is not allowed for released data");
    }
  
    const moveItem = await movementModel.findOne({ mudNo: existingEntry.mudNo });
    if (moveItem.length > 0) {
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

  const updatedEntry = await UnclaimedVehicle.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedEntry, "Entry updated successfully"));
});

const deleteUnclaimedVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const existingEntry = await UnclaimedVehicle.findById(id);
  if (!existingEntry) {
    throw new ApiError(404, "Entry not found");
  }

  await UnclaimedVehicle.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, " ", "Data deleted successfully"));
});
export {
  unclaimedVehicleEntry,
  getUnclaimedVehicle,
  getUnclaimedVehicleList,
  updateUnclaimedVehicle,
  deleteUnclaimedVehicle,
};
