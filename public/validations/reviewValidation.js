// src/validations/reviewValidation.js

export const validateReview = (data) => {
    const errors = {};
    
    if (!data.name || !data.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!data.email || !data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Email format is invalid';
    }
    
    if (!data.rating || data.rating < 1 || data.rating > 5) {
      errors.rating = 'Rating is required and must be between 1 and 5';
    }
    
    if (!data.productId) {
      errors.productId = 'Product ID is required';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };