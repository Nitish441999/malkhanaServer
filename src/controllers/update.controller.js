import mongoose from "mongoose";
import releaseModel from "../models/release.model";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import ArtoSeizure from "../models/artoSeizure.model.js";
import ExciseVehicle from "../models/exciseVehicle.model.js";
import FslEntry from "../models/FslEntry.model.js";
import IpcVehicle from "../models/ipcVehicle.model.js";
import KurkiEntry from "../models/kurkiEntry.model.js";
import MalkhanaEntry from "../models/malkhanaEntry.model.js";
import MvActSeizure from "../models/mvActSeizure.model.js";
import OtherEntry from "../models/OthersEntry.model.js";
import SeizureVehicle from "../models/seizureVehicle.model.js";
import UnclaimedEntry from "../models/UnclaimedEntry.model.js";
import UnclaimedVehicle from "../models/unclaimedVehicle.model.js";

const updateAll = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Id is invailed");
  }
  const ReleaseItem = await releaseModel.findById(id);
  if (!ReleaseItem) {
    throw new ApiError(400, "Release Data not found");
  }
  const mudNo = ReleaseItem.mudNo;

  if (!mudNo) {
    throw new ApiError(400, "Mud Numebr is not found");
  }

  const isMudRestricted = async (mudNo) => {
    const collections = [
      ArtoSeizure,
      ExciseVehicle,
      FslEntry,
      IpcVehicle,
      KurkiEntry,
      MalkhanaEntry,
      MvActSeizure,
      OtherEntry,
      SeizureVehicle,
      UnclaimedEntry,
      UnclaimedVehicle,
    ];

    for (const collection of collections) {
      const record = await collection.findOne({ mudNo });
      if (record) {
        return collection.modelName;
      }
    }
    return null;
  };

  const restrictedCollection = await isMudRestricted(mudNo);

  if (restrictedCollection) {
    throw new ApiError(
      400,
      "Modification not allowed for this document as it exists in Collection2"
    );
  }

  res.status(200).json({ message: "Entry updated successfully" });
});
