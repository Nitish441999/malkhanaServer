import mongoose from "mongoose";
const seizedCashSchema = new mongoose.Schema(
  {
    firNo: {
      type: String,
    },
    mudNo: {
      type: String,
    },
    policeStation: {
      type: String,
    },
    itemName: {
      type: String,
    },
    itemQty: {
      type: String,
    },
    expectedAmt: {
      type: String,
    },
    descriptions: {
      type: String,
    },
    avatar: {
      type: String,
    },
    seizedItem: {
      type: String,
      enum: ["Cash", "Gold Metal", "Antiques Items"],
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
export default mongoose.model("SeizedCashMetal", seizedCashSchema);
