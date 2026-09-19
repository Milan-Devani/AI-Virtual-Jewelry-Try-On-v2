import multer from "multer";
import { config } from "../config/index.js";
import { ValidationError } from "../utils/errors.js";

const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: config.maxUploadBytes,
    files: 2,
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (allowedMimes.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(
        new ValidationError(
          `Unsupported file type (${file.mimetype}). Please upload a JPEG, PNG, or WebP image.`,
          "UNSUPPORTED_IMAGE_TYPE"
        )
      );
    }
  },
});

export const tryOnUpload: any = uploadMiddleware.fields([
  { name: "modelImage", maxCount: 1 },
  { name: "jewelryImage", maxCount: 1 },
]);

export const singleImageUpload: any = uploadMiddleware.single("image");
