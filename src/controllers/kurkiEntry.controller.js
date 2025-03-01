import asyncHandler from "../utils/asyncHandler.js";
import KurkiEntry from "../models/kurkiEntry.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../config/cloudinary.js";

const createKurkiEntry = asyncHandler(async (req, res) => {
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
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, newEntry, "Malkhana entry created successfully")
    );
});

const getKurkiEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const KurkiEntryDetails = await KurkiEntry.findById(id);

  if (!KurkiEntryDetails) {
    throw new ApiError(404, "Malkhana entry not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        KurkiEntryDetails,
        "Malkhana entry fetched successfully"
      )
    );
});

const getAllKurkiEntry = asyncHandler(async (req, res) => {
  const kurkiEntry = await KurkiEntry.find();

  if (!kurkiEntry.length) {
    throw new ApiError(404, "No Malkhana entries found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, kurkiEntry, "Malkhana entries fetched successfully")
    );
});

const updateKurkiEntryDetails = asyncHandler(async (req, res) => {
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

  const kurkiEntryUpdateDetails = await KurkiEntry.findByIdAndUpdate(
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

  if (!kurkiEntryUpdateDetails) {
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

export {
  createKurkiEntry,
  getKurkiEntry,
  getAllKurkiEntry,
  updateKurkiEntryDetails,
};
