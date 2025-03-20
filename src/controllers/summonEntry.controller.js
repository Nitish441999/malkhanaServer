import asyncHandler from "../utils/asyncHandler.js";
import SummonEntry from "../models/summonEntry.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const createSummonEntry = asyncHandler(async (req, res) => {
  const user = req.user;
  const {
    entryType,
    firOrGdNumber,
    policeStation,
    vehicleOwner,
    fatherName,
    address,
    vehicleRegistrationNumber,
    place,
    lastDays,
    releaseDays,
    actType,
    date,
    time,
  } = req.body;

  if (
    !entryType ||
    !firOrGdNumber ||
    !policeStation ||
    !vehicleOwner ||
    !fatherName ||
    !address ||
    !vehicleRegistrationNumber ||
    !place ||
    !lastDays ||
    !releaseDays ||
    !actType ||
    !date ||
    !time
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const newSummonEntry = new SummonEntry({
    entryType,
    firOrGdNumber,
    policeStation,
    vehicleOwner,
    fatherName,
    address,
    vehicleRegistrationNumber,
    place,
    lastDays,
    releaseDays,
    actType,
    date,
    time,
    policeStation: user.policeStation,
  });

  await newSummonEntry.save();

  res
    .status(201)
    .json(
      new ApiResponse(200, newSummonEntry, " Create Summon Entry successfully")
    );
});

const getSummonEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const summonEntry = await SummonEntry.findById(id);

  if (!summonEntry) {
    throw new ApiError(404, "Summon Entry not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, summonEntry, "Summon Entry retrieved successfully")
    );
});

const getSummonEntryList = asyncHandler(async (req, res) => {
  const summonEntryList = await SummonEntry.find({});

  if (summonEntryList.length === 0) {
    throw new ApiError(404, "Summon List not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        summonEntryList,
        "Summon List retrieved successfully"
      )
    );
});

const deleteSummonEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const existingEntry = await SummonEntry.findById(id);
  if (!existingEntry) {
    throw new ApiError(404, "Entry not found");
  }

  await SummonEntry.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, " ", "Data deleted successfully"));
});

export {
  createSummonEntry,
  getSummonEntry,
  getSummonEntryList,
  deleteSummonEntry,
};
