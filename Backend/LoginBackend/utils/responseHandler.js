// utils/responseHandler.js

// SUCCESS RESPONSE
export const successResponse = (res, data = {}, message = "Success", status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data
  });
};

// ERROR RESPONSE
export const errorResponse = (res, message = "Something went wrong", status = 500, error = null) => {
  return res.status(status).json({
    success: false,
    message,
    error
  });
};

// VALIDATION ERROR
export const validationError = (res, message = "Validation failed", errors = {}) => {
  return res.status(400).json({
    success: false,
    message,
    errors
  });
};

// UNAUTHORIZED
export const unauthorizedResponse = (res, message = "Unauthorized") => {
  return res.status(401).json({
    success: false,
    message
  });
};

// NOT FOUND
export const notFoundResponse = (res, message = "Resource not found") => {
  return res.status(404).json({
    success: false,
    message
  });
};