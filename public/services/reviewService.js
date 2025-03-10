import prisma from '../config/db.js';
import { validateReview } from '../validations/reviewValidation.js';

export const createReview = async (reviewData) => {

  const { isValid, errors } = validateReview(reviewData);

  if (!isValid) {
    return {
      success: false,
      errors,
      message: 'Validation failed'
    };
  }

  try {

    const product = await prisma.product.findUnique({
      where: { id: parseInt(reviewData.productId) }
    });

    if (!product) {
      return {
        success: false,
        message: 'Product not found'
      };
    }

    const review = await prisma.review.create({
      data: {
        name: reviewData.name,
        email: reviewData.email,
        mobile: reviewData.mobile || null,
        rating: parseInt(reviewData.rating),
        reviewText: reviewData.reviewText || null,
        recommend: reviewData.recommend !== undefined ? reviewData.recommend : null,
        productId: parseInt(reviewData.productId)
      }
    });

    return {
      success: true,
      data: review,
      message: 'Review created successfully'
    };

  } catch (error) {
    console.error('Error creating review:', error);
    return {
      success: false,
      message: 'Failed to create review',
      error: error.message
    };
  }

};