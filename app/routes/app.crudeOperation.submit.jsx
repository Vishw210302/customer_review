import { json } from "@remix-run/node";

export const action = async ({ request }) => {
    try {
        if (request.method === "POST") {
            const formData = await request.formData();
            const reviewData = Object.fromEntries(formData);
            reviewData.rating = parseInt(reviewData.rating || "0");
            reviewData.productId = parseInt(reviewData.productId || "0");
            reviewData.recommend = reviewData.recommend === 'true';

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
                return json({
                    success: false,
                    errors,
                    message: 'Validation failed'
                }, { status: 400 });
            }

            const response = await fetch("https://5605-122-164-16-245.ngrok-free.app/api/addReview", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: reviewData.name,
                    email: reviewData.email,
                    mobile: reviewData.mobile || null,
                    rating: parseInt(reviewData.rating),
                    reviewText: reviewData.reviewText || null,
                    recommend: reviewData.recommend,
                    productId: String(reviewData.productId)
                }),
            });

            const result = await response.json();
            return json(result);

        }
        return json({
            success: false,
            message: "Method not allowed"
        }, { status: 405 });
    } catch (error) {
        console.error("Error handling request:", error);
        return json({
            success: false,
            message: 'Failed to process request',
            error: error.message
        }, { status: 500 });
    }
};
