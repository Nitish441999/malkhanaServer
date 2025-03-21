import asyncHandler from "../utils/asyncHandler.js";
import FileEntry from "../models/fileEntry.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import xlsx from "xlsx";
import fs from "fs";

const uploadExcelFile = asyncHandler(async (req, res) => {
  try {
    const user = req.user;

    if (!req.file) {
      throw new ApiError(400, "No file uploaded!");
    }

    console.log("Uploaded File Info:", req.file);

    const filePath = req.file.path;
    if (!fs.existsSync(filePath)) {
      throw new ApiError(400, "File not found on server!");
    }

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log("Extracted Data:", data);

    if (!data.length) {
      throw new ApiError(400, "Excel file is empty!");
    }

    const enrichedData = data.map((entry) => ({
      policeStation: user.policeStation,
      district: user.district,
    }));

    console.log("Data to Insert:", enrichedData);

    await FileEntry.insertMany(enrichedData);

    fs.unlinkSync(filePath);

    res
      .status(200)
      .json(
        new ApiResponse(200, enrichedData, "Excel file imported successfully!")
      );
  } catch (error) {
    console.error("Error processing Excel file:", error);
    throw new ApiError(500, "Error processing Excel file");
  }
});

const getFileEntryList = asyncHandler(async (req, res) => {
  const fileEntryList = await FileEntry.find({});
  if (!fileEntryList) {
    throw new ApiError(400, "File entry List Is Not Found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, fileEntryList, "Get list of file entry successfull")
    );
});

const deletefileEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID format");
  }

  const existingEntry = await FileEntry.findById(id);
  if (!existingEntry) {
    throw new ApiError(404, "Entry not found");
  }

  await FileEntry.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, " ", "Data deleted successfully"));
});

const deleteAllFileEntries = asyncHandler(async (req, res) => {
  const result = await FileEntry.deleteMany({});

  if (result.deletedCount === 0) {
    throw new ApiError(404, "No entries found to delete");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "All file entries deleted successfully"));
});

export {
  uploadExcelFile,
  getFileEntryList,
  deletefileEntry,
  deleteAllFileEntries,
};
