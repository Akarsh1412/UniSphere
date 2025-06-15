import multer from 'multer';
import { uploadImage } from '../config/cloudinary.js';

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export const uploadSingle = (fieldName) => {
  return async (req, res, next) => {
    upload.single(fieldName)(req, res, async (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
              success: false, 
              message: 'File size too large. Maximum 5MB allowed.' 
            });
          }
        }
        return res.status(400).json({ 
          success: false, 
          message: err.message 
        });
      }
      
      if (req.file) {
        try {
          // Convert buffer to base64 for Cloudinary
          const b64 = Buffer.from(req.file.buffer).toString('base64');
          const dataURI = `data:${req.file.mimetype};base64,${b64}`;
          
          // Upload to Cloudinary
          const imageUrl = await uploadImage(dataURI, 'unisphere');
          
          // Add image URL to request body
          req.body[fieldName] = imageUrl;
          
          next();
        } catch (error) {
          console.error('Image upload error:', error);
          return res.status(500).json({ 
            success: false, 
            message: 'Image upload failed' 
          });
        }
      } else {
        next();
      }
    });
  };
};

export const uploadMultiple = (fieldName, maxCount = 5) => {
  return async (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, async (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
              success: false, 
              message: 'File size too large. Maximum 5MB per file allowed.' 
            });
          }
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ 
              success: false, 
              message: `Too many files. Maximum ${maxCount} files allowed.` 
            });
          }
        }
        return res.status(400).json({ 
          success: false, 
          message: err.message 
        });
      }
      
      if (req.files && req.files.length > 0) {
        try {
          const imageUrls = [];
          
          for (const file of req.files) {
            const b64 = Buffer.from(file.buffer).toString('base64');
            const dataURI = `data:${file.mimetype};base64,${b64}`;
            const imageUrl = await uploadImage(dataURI, 'unisphere');
            imageUrls.push(imageUrl);
          }
          
          req.body[fieldName] = imageUrls;
          next();
        } catch (error) {
          console.error('Image upload error:', error);
          return res.status(500).json({ 
            success: false, 
            message: 'Image upload failed' 
          });
        }
      } else {
        next();
      }
    });
  };
};
