// src/controllers/reviewController.js

import { createReview } from '../services/reviewService.js';

export const addReview = async (req, res) => {
  try {
    const result = await createReview(req.body);
    
    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};