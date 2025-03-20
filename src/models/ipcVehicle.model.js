import mongoose from "mongoose";

const ipcVehicleSchema = new mongoose.Schema(
  {
    mudNo: {
      type: String,
      required: true,
      trim: true,
    },
    gdNo: {
      type: String,
      required: true,
      trim: true,
    },
    underSection: {
      type: String,
      required: true,
      trim: true,
    },
    vehicleType: {
      type: String,
      required: true,
      trim: true,
      enum: ["Car", "Bike", "Truck", "Bus", "Other"],
    },
    regNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    chassisNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    vivechak: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    engineNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    colour: {
      type: String,
      required: true,
      trim: true,
    },
    gdDate: {
      type: String,
      required: true,
    },
    actType: {
      type: String,
      required: true,
      trim: true,
    },
    result: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
      trim: true,
    },
    firNo: {
      type: String,
      required: true,
      trim: true,
    },
    vehicleOwner: {
      type: String,
      required: true,
      trim: true,
    },
    trackingBy: {
      type: String,
    },
    policeStation: {
      type: String,
    },
    district:{
      type:String
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("IpcVehicle", ipcVehicleSchema);
