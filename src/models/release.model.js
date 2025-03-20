import mongoose from "mongoose";

const releaseSchema = new mongoose.Schema(
  {
    entryType: {
      type: String,
      enum: [
        "Malkhana Entry",
        "FSL Entry",
        "Kurki Entry",
        "Other Entry",
        "MVAct Seizure",
        "ARTO Seizure",
        "IPC Vehicle",
        "Excise Vehicle",
        "Unclaimed Vehicle",
        "Seizure Vehicle",
      ],
      required: true,
    },
    mudNo: {
      type: String,
      required: true,
    },
    mudDetails: {
      type: String,
      required: true,
    },
    receiverName: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    releaseItems: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    documentImage: {
      type: String,
      required: false,
    },
    policeStation: {
      type: String,
    },
    district:{
      type:String
    },
  },
  { timestamps: true }
);

export default mongoose.model("MalkhanaRelease", releaseSchema);
