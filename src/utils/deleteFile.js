import fs from "fs/promises";
import path from "path";

export const deleteFile = async (fileName) => {
  const filePath = path.join(process.cwd(), "uploads", "avatars", fileName);

  try {
    await fs.unlink(filePath);
  } catch (err) {
    console.error("Error deleting file:", err);
  }
};
