import { body, param, query, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

// Auth validations
export const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  body('registrationNumber')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Registration number must be between 1 and 100 characters'),
  handleValidationErrors
];

export const validateLogin = [
  body('identifier')
    .trim()
    .notEmpty()
    .withMessage('Email or registration number is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Post validations
export const validateCreatePost = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Post content must be between 1 and 2000 characters'),
  body('image')
    .optional()
    .isURL()
    .withMessage('Image must be a valid URL'),
  handleValidationErrors
];

export const validateComment = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be between 1 and 500 characters'),
  handleValidationErrors
];

// Event validations
export const validateEventRegistration = [
  body('registrationType')
    .optional()
    .isIn(['participant', 'volunteer'])
    .withMessage('Registration type must be participant or volunteer'),
  body('paymentMethod')
    .optional()
    .isIn(['card', 'upi', 'cash', 'free'])
    .withMessage('Invalid payment method'),
  body('amount')
    .optional()
    .isNumeric()
    .withMessage('Amount must be a number'),
  handleValidationErrors
];

// Parameter validations
export const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
  handleValidationErrors
];

export const validatePostId = [
  param('postId')
    .isInt({ min: 1 })
    .withMessage('Post ID must be a positive integer'),
  handleValidationErrors
];

export const validateEventId = [
  param('eventId')
    .isInt({ min: 1 })
    .withMessage('Event ID must be a positive integer'),
  handleValidationErrors
];

export const validateClubId = [
  param('clubId')
    .isInt({ min: 1 })
    .withMessage('Club ID must be a positive integer'),
  handleValidationErrors
];

// Query validations
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

// Profile validations
export const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  body('registrationNumber')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Registration number must be between 1 and 100 characters'),
  body('profilePicture')
    .optional()
    .isURL()
    .withMessage('Profile picture must be a valid URL'),
  handleValidationErrors
];

export const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain uppercase, lowercase, number, and special character'),
  handleValidationErrors
];
