import mongoose from "mongoose";
import IpcVehicle from "../models/ipcVehicle.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponce from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

const ipcVehicleEntry = asyncHandler(async (req, res) => {
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
    !vehicleOwner ||
    !firNo
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const entryExists = await IpcVehicle.findOne({ regNo });
  if (entryExists) {
    throw new ApiError(
      400,
      "Entry with this registration number already exists"
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

  const NewIpcVehicleEntry = await IpcVehicle.create({
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
    avatar: avatarURL.url,
  });

  if (!NewIpcVehicleEntry) {
    throw new ApiError(400, "Invalid entry data");
  }
  return res
    .status(201)
    .json(
      new ApiResponce(
        201,
        NewIpcVehicleEntry,
        "M.V Act Seizure Entry successful "
      )
    );
});

const getIpcVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "id is inviled");
  }

  const getIpcVehicle = await IpcVehicle.findById(id);

  if (!getMvctAct) {
    throw new ApiError(404, "Entry not found");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, getIpcVehicle, "Entry retrieved successfully"));
});

const getIpcVehicleList = asyncHandler(async (req, res) => {
  const IpcVehicleList = await IpcVehicle.find();

  return res
    .status(200)
    .json(
      new ApiResponce(200, IpcVehicleList, "Entries retrieved successfully")
    );
});

const updateIpcVehicle = asyncHandler(async (req, res) => {
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
    !vehicleOwner ||
    !firNo
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingEntry = await IpcVehicle.findById(id);
  if (!existingEntry) {
    throw new ApiError(404, "Entry not found");
  }

  if (req.files?.avatar?.[0]?.path) {
    const avatarFile = req.files.avatar[0].path;
    const avatarUploadResult = await uploadOnCloudinary(avatarFile);

    if (!avatarUploadResult?.url) {
      throw new ApiError(500, "Failed to upload new avatar file");
    }

    req.body.avatar = avatarUploadResult.url;
  }

  const updatedEntry = await IpcVehicle.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(new ApiResponce(200, updatedEntry, "Entry updated successfully"));
});
export { ipcVehicleEntry, getIpcVehicle, getIpcVehicleList, updateIpcVehicle };
