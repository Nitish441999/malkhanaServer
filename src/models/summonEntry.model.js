import mongoose from "mongoose";

const summonEntrySchema = new mongoose.Schema(
  {
    entryType: {
      type: String,
      required: true,
      enum: [
        "MV Act Seizure",
        "ARTO Seizure",
        "IPC Vehicle",
        "Excise Vehicle",
        "Unclaimed Vehicle",
        "Seizure Vehicle",
      ],
    },
    firOrGdNumber: {
      type: String,
      required: true,
    },
    policeStation: {
      type: String,
      required: true,
    },
    vehicleOwner: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    vehicleRegistrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    place: {
      type: String,
      required: true,
    },
    lastDays: {
      type: Number,
      required: true,
    },
    releaseDays: {
      type: Number,
    },
    actType: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
   
  },
  { timestamps: true }
);

const SummonEntry = mongoose.model("SummonEntry", summonEntrySchema);

export default SummonEntry;
