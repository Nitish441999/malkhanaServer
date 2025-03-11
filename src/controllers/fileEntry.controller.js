import asyncHandler from "../utils/asyncHandler.js";
import FileEntry from "../models/fileEntry.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import xlsx from "xlsx";
import fs from "fs";

const uploadExcelFile = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      throw new ApiError(400, "No file uploaded!");
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!data || data.length === 0) {
      throw new ApiError(400, "Excel file is empty!");
    }

    await FileEntry.insertMany(data);

    fs.unlinkSync(req.file.path);

    res
      .status(200)
      .json(new ApiResponse(200, data, "Excel file imported successfully!"));
  } catch (error) {
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

export { uploadExcelFile, getFileEntryList, deletefileEntry };
