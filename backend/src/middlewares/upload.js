import multer from "multer";
import path from "path";

export const uploadAvatar = multer({
  storage: multer.diskStorage({
    destination: "uploads/avatars",
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${req.user.id}_${Date.now()}${ext}`);
    },
  }),
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Invalid file type"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});
