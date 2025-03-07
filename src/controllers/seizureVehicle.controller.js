import mongoose from "mongoose";
import SeizureVehicle from "../models/seizureVehicle.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import movementModel from "../models/movement.model.js";

const seizureVehicleEntry = asyncHandler(async (req, res) => {
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
    vehicleOwner,
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
    !banam ||
    !vehicleOwner
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const entryExists = await SeizureVehicle.findOne({
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

  const NewSeizureVehicleEntry = await SeizureVehicle.create({
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
    vehicleOwner,
    vivechak,
    banam,
    avatar: avatarURL.url,
  });

  if (!NewSeizureVehicleEntry) {
    throw new ApiError(400, "Invalid entry data");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        NewSeizureVehicleEntry,
        "seizure Vehicle Entry successful "
      )
    );
});

const getSeizureVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "id is inviled");
  }

  const seizureVehicle = await SeizureVehicle.findById(id);

  if (!getMvctAct) {
    throw new ApiError(404, "Entry not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, seizureVehicle, "Entry retrieved successfully"));
});

const getSeizureVehicleList = asyncHandler(async (req, res) => {
  const seizureVehicles = await SeizureVehicle.find();

  return res
    .status(200)
    .json(
      new ApiResponse(200, seizureVehicles, "Entries retrieved successfully")
    );
});

const updateSeizureVehicle = asyncHandler(async (req, res) => {
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
    vehicleOwner,
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
    !banam ||
    !vehicleOwner
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingEntry = await SeizureVehicle.findById(id);
  if (!existingEntry) {
    throw new ApiError(404, "Entry not found");
  }
  const existingMudNo = existingEntry.mudNo;

  const releaseItem = await releaseModel.findOne({ mudNo: existingMudNo });
  if (releaseItem.length > 0) {
    throw new ApiError(400, "Modification is not allowed for released data");
  }

   const moveItem = await movementModel.findOne({ mudNo: existingMudNo });
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

  const updatedEntry = await SeizureVehicle.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedEntry, "Entry updated successfully"));
});

const deleteSeizureVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const existingEntry = await SeizureVehicle.findById(id);
  if (!existingEntry) {
    throw new ApiError(404, "Entry not found");
  }

  await SeizureVehicle.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, " ", "Data deleted successfully"));
});
export {
  seizureVehicleEntry,
  getSeizureVehicle,
  getSeizureVehicleList,
  updateSeizureVehicle,
  deleteSeizureVehicle,
};
