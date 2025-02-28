import asyncHandler from "../utils/asyncHandler.js";
import UnclaimedEntry from "../models/UnclaimedEntry.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const createUnclaimedEntry = asyncHandler(async (req, res) => {
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
    !status ||
    !avtar
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingEntry = await UnclaimedEntry.findOne({ firNo, mudNo });
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

  const newEntry = await UnclaimedEntry.create({
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

const getUnclaimedEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const UnclaimedEntryDetails = await UnclaimedEntry.findById(id);

  if (!UnclaimedEntryDetails) {
    throw new ApiError(404, "Malkhana entry not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        UnclaimedEntryDetails,
        "Malkhana entry fetched successfully"
      )
    );
});

const getAllUnclaimedEntry = asyncHandler(async (req, res) => {
  const unclaimedEntries = await UnclaimedEntry.find();

  if (!unclaimedEntries.length) {
    throw new ApiError(404, "No Malkhana entries found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        malkhanaEntries,
        "MalkhanaunclaimedEntries entries fetched successfully"
      )
    );
});

const updateUnclaimedEntryDetails = asyncHandler(async (req, res) => {
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

  const unclaimedUpdateDetails = await UnclaimedEntry.findByIdAndUpdate(
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

  if (!unclaimedUpdateDetails) {
    throw new ApiError(404, "Malkhana entry not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        unclaimedUpdateDetails,
        "Malkhana details updated successfully"
      )
    );
});

export {
  createUnclaimedEntry,
  getUnclaimedEntry,
  getAllUnclaimedEntry,
  updateUnclaimedEntryDetails,
};
