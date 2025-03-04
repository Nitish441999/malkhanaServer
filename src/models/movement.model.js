import mongoose from "mongoose";
const moveMovementSchema = mongoose.Schema(
  {
    entryType: {
      type: String,
      required: true,
      enum: [
        "Malkhana_Entry",
        "FSL_Entry",
        "Kurki_Entry",
        "Other_Entry",
        "Unclaimed_Entry",
        "MVAct_Seizure",
        "ARTO_Seizure",
        "IPC_Vehicle",
        "Excise_Vehicle",
        "Unclaimed_Vehicle",
        "Seizure_Vehicle",
      ],
    },
    firNo: {
      type: String,
      required: true,
    },
    mudNo: {
      type: String,
      required: true,
    },
    takenOutBy: {
      type: String,
      required: true,
    },
    trackingBy: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    trackingBy: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("MoveMovement", moveMovementSchema);
