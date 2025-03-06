import mongoose from "mongoose";

const seizureVehicleSchema = new mongoose.Schema(
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
      
    },
    chassisNo: {
      type: String,
      required: true,
      unique: true,
      
    },
    engineNo: {
      type: String,
      required: true,
      unique: true,
     
    },
    colour: {
      type: String,
      required: true,
     
    },
    gdDate: {
      type: String,
      required: true,
    },
    actType: {
      type: String,
      required: true,
     
    },
    result: {
      type: String,
      required: true,
      
    },
    avatar: {
      type: String,
      required: true,
     
    },
    vivechak: {
      type: String,
      required: true,
      
    
    },
    firNo: {
      type: String,
      required: true,
     
    },
    banam: {
      type: String,
      required: true,
      
    },
    vehicleOwner: {
      type: String,
      required: true,
      
    },
    trackingBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("seizureVehicle", seizureVehicleSchema);
