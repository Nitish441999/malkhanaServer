import Malkhana_Entry from "../models/malkhanaEntry.model.js";
import FSL_Entry from "../models/FslEntry.model.js";
import Kurki_Entry from "../models/kurkiEntry.model.js";
import Other_Entry from "../models/OthersEntry.model.js";
import Unclaimed_Entry from "../models/UnclaimedEntry.model.js";
import MVAct_Seizure from "../models/mvActSeizure.model.js";
import ARTO_Seizure from "../models/artoSeizure.model.js";
import IPC_Vehicle from "../models/ipcVehicle.model.js";
import Excise_Vehicle from "../models/exciseVehicle.model.js";
import Unclaimed_Vehicle from "../models/unclaimedVehicle.model.js";
import Seizure_Vehicle from "../models/seizureVehicle.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

const entryModels = {
  Malkhana_Entry,
  FSL_Entry,
  Kurki_Entry,
  Other_Entry,
  Unclaimed_Entry,
  MVAct_Seizure,
  ARTO_Seizure,
  IPC_Vehicle,
  Excise_Vehicle,
  Unclaimed_Vehicle,
  Seizure_Vehicle,
};
const getAllCollectionsData = asyncHandler(async (req, res) => {
  const allCollectionData = await Promise.all(
    Object.entries(entryModels).map(async ([key, model]) => {
      const data = await model.find({});
      return { collection: key, data };
    })
  );
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        allCollectionData,
        "Fetched all collections successfully"
      )
    );
});

export { getAllCollectionsData };
