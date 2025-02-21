// import { json } from "@remix-run/react";
import prisma from "../db.server";

export const loader = async ({ request }) => {
}

export const action = async ({ request }) => {
    try {
        const formData = await request.formData();
        const reviewData = Object.fromEntries(formData);

        reviewData.rating = parseInt(reviewData.rating || "0");
        reviewData.productId = parseInt(reviewData.productId || "0");
        reviewData.recommend = reviewData.recommend === 'true' ? true :
            reviewData.recommend === 'false' ? false : null;

        const errors = {};

        if (!reviewData.name || !reviewData.name.trim()) {
            errors.name = 'Name is required';
        }

        if (!reviewData.email || !reviewData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(reviewData.email)) {
            errors.email = 'Email format is invalid';
        }

        if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
            errors.rating = 'Rating is required and must be between 1 and 5';
        }

        if (!reviewData.productId) {
            errors.productId = 'Product ID is required';
        }

        if (Object.keys(errors).length > 0) {
            return ({
                success: false,
                errors,
                message: 'Validation failed'
            }, { status: 400 });
        }

        const review = await prisma.review.create({
            data: {
                name: reviewData.name,
                email: reviewData.email,
                mobile: reviewData.mobile || null,
                rating: parseInt(reviewData.rating),
                reviewText: reviewData.reviewText || null,  
                recommend: reviewData.recommend == "true",
                productId: String(reviewData.productId)
            }
        });

        return ({
            success: true,
            data: review,
            message: 'Review created successfully'
        });
    } catch (error) {
        console.log(error.message, "error.message")
        return ({
            success: false,
            message: 'Failed to create review',
            error: error.message
        });
    }
};
