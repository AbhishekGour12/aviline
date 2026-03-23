// middleware/ecommerceMulterConfig.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Create upload directories
const uploadDir = path.join(process.cwd(), "uploads", "products");
fs.mkdirSync(uploadDir, { recursive: true });

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// Image-only filter
const imageFileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg", 
    "image/png", 
    "image/webp", 
    "image/jpg", 
    "image/avif", 
    "image/svg+xml", 
    "image/gif", 
    "image/tiff",
    "image/bmp", 
    "image/heic"
  ];
  
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

// Excel + images filter
const excelAndImageFileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "text/csv",
    "application/vnd.oasis.opendocument.spreadsheet"
  ];
  
  const allowedExtensions = ['.xlsx', '.xls', '.csv', '.ods'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowed.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images and Excel files are allowed."), false);
  }
};

// Product images upload (multiple images)
export const uploadProductImages = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});

// Excel + images upload for bulk operations
export const uploadExcelAndImages = multer({
  storage,
  fileFilter: excelAndImageFileFilter,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB limit
});

// Multiple images upload
export const uploadMultipleImages = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
}).array('images', 20); // Max 20 images

// Fields upload (for mixed file types)
export const uploadMixedFiles = multer({
  storage,
  fileFilter: excelAndImageFileFilter,
  limits: { fileSize: 200 * 1024 * 1024 },
}).fields([
  { name: 'excelFile', maxCount: 1 },
  { name: 'productImages', maxCount: 50 },
  { name: 'images', maxCount: 20 }
]);

// Error handler middleware for multer
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 100MB.' });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};