// import sharp from "sharp";
// import fs from "fs/promises"; // Use async file operations

// export const compressImage = async (filePath) => {
//   try {
//     const compressedPath = filePath.replace(/\.(png|jpg|jpeg)$/, "-compressed.jpg");

//     await sharp(filePath)
//       .resize(800) // Resize width to 800px
//       .jpeg({ quality: 70 }) // Reduce quality to 70%
//       .toFile(compressedPath);

//     await fs.unlink(filePath); // Delete original file
//     return compressedPath;
//   } catch (error) {
//     console.error("Image compression failed:", error);
//     return filePath; // Return original if compression fails
//   }
// };
