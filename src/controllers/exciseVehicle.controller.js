import mongoose from "mongoose";
import ExciseVehicle from "../models/exciseVehicle.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import releaseModel from "../models/release.model.js";
import MovementModel from "../models/movement.model.js";

const exciseVehicleEntry = asyncHandler(async (req, res) => {
  const user = req.user;
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
    firNo,

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
    !firNo ||
    !banam
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const entryExists = await ExciseVehicle.findOne({
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

  const NewExciseVehicleEntry = await ExciseVehicle.create({
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
    firNo,

    vivechak,
    banam,
    avatar: avatarURL.url,
    policeStation: user.policeStation,
    district: user.district,
  });

  if (!NewExciseVehicleEntry) {
    throw new ApiError(400, "Invalid entry data");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        NewExciseVehicleEntry,
        "Excise Seizure Entry successful "
      )
    );
});

const getExciseVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "id is inviled");
  }

  const exciseVehicles = await ExciseVehicle.findById(id);

  if (!getMvctAct) {
    throw new ApiError(404, "Entry not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, exciseVehicles, "Entry retrieved successfully"));
});

const getExciseVehicleList = asyncHandler(async (req, res) => {
  const ExciseVehicleList = await ExciseVehicle.find();

  return res
    .status(200)
    .json(
      new ApiResponse(200, ExciseVehicleList, "Entries retrieved successfully")
    );
});

const updateExciseVehicle = asyncHandler(async (req, res) => {
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
    firNo,
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
    !firNo ||
    !banam
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingEntry = await ExciseVehicle.findById(id);
  if (!existingEntry) {
    throw new ApiError(404, "Entry not found");
  }
  const existingMudNo = existingEntry.mudNo;

  const releaseItem = await releaseModel.findOne({ mudNo: existingMudNo });
  if (releaseItem) {
    throw new ApiError(400, "Modification is not allowed for released data");
  }
  const moveItem = await MovementModel.findOne({ mudNo: existingMudNo });
  if (moveItem) {
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

  const updatedEntry = await ExciseVehicle.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedEntry, "Entry updated successfully"));
});

const deleteExciseVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const existingEntry = await ExciseVehicle.findById(id);
  if (!existingEntry) {
    throw new ApiError(404, "Entry not found");
  }

  await ExciseVehicle.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, " ", "Data deleted successfully"));
});

export {
  exciseVehicleEntry,
  getExciseVehicle,
  getExciseVehicleList,
  updateExciseVehicle,
  deleteExciseVehicle,
};
