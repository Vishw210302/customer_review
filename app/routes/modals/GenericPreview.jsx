import React, { useEffect, useState } from 'react';

const GenericPreview = () => {

    const [isWideScreen, setIsWideScreen] = useState(false);
    const [activeReview, setActiveReview] = useState(0);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 768px)");
        setIsWideScreen(mediaQuery.matches);

        const handleResize = () => {
            setIsWideScreen(mediaQuery.matches);
        };

        mediaQuery.addEventListener('change', handleResize);

        const intervalId = setInterval(() => {
            setActiveReview((prev) => (prev + 1) % 3);
        }, 5000);

        return () => {
            mediaQuery.removeEventListener('change', handleResize);
            clearInterval(intervalId);
        };
    }, []);

    const reviewData = [
        {
            name: "Sarah J.",
            rating: 5,
            text: "This product exceeded all my expectations. The quality is outstanding, and it arrived earlier than expected!",
        },
        {
            name: "Michael T.",
            rating: 5,
            text: "Absolutely worth every penny. This has become an essential part of my daily routine.",
        },
        {
            name: "Elena R.",
            rating: 4,
            text: "Great product, very satisfied with my purchase. Would definitely recommend to friends.",
        }
    ];

    const styles = {
        container: {
            backgroundColor: "#f8fafc",
            padding: "20px",
            borderRadius: "12px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
            maxWidth: "600px",
            margin: "0 auto"
        },
        headerContainer: {
            textAlign: "center",
            marginBottom: "24px"
        },
        title: {
            fontSize: "20px",
            fontWeight: "700",
            color: "#2d3748",
            margin: "0 0 8px 0"
        },
        subtitle: {
            fontSize: "15px",
            color: "#718096",
            margin: 0
        },
        reviewsContainer: {
            position: "relative",
            minHeight: "180px",
            marginTop: "30px",
            display: "flex",
            overflow: "hidden"
        },
        reviewCard: (index) => ({
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.06)",
            flexShrink: 0,
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            transition: "all 0.5s ease",
            transform: `translateX(${(index - activeReview) * 100}%)`,
            opacity: index === activeReview ? 1 : 0.7,
            pointerEvents: index === activeReview ? "auto" : "none"
        }),
        reviewContent: {
            textAlign: "center"
        },
        authorName: {
            fontSize: "17px",
            fontWeight: "600",
            color: "#2d3748",
            margin: "0 0 8px 0"
        },
        ratingStars: {
            color: "#f59e0b",
            fontSize: "20px",
            margin: "10px 0",
            letterSpacing: "3px"
        },
        reviewText: {
            fontStyle: "italic",
            color: "#4a5568",
            fontSize: "15px",
            lineHeight: 1.7,
            margin: "12px 0",
            maxWidth: "500px",
            display: "inline-block"
        },
        paginationContainer: {
            display: "flex",
            justifyContent: "center",
            marginTop: "24px",
            gap: "8px"
        },
        paginationDot: (isActive) => ({
            width: isActive ? "30px" : "10px",
            height: "10px",
            borderRadius: isActive ? "5px" : "50%",
            backgroundColor: isActive ? "#f59e0b" : "rgba(245, 158, 11, 0.3)",
            cursor: "pointer",
            transition: "all 0.3s ease"
        }),
        reviewsSummary: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            marginBottom: "30px",
            flexDirection: isWideScreen ? "row" : "column",
            gap: "20px"
        },
        overallRating: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRight: isWideScreen ? "1px solid #e2e8f0" : "none",
            borderBottom: isWideScreen ? "none" : "1px solid #e2e8f0",
            paddingRight: isWideScreen ? "20px" : 0,
            paddingBottom: isWideScreen ? 0 : "20px",
            marginBottom: isWideScreen ? 0 : "10px",
            width: isWideScreen ? "auto" : "100%"
        },
        stars: {
            color: "#f59e0b",
            fontSize: "28px",
            letterSpacing: "3px"
        },
        ratingNumber: {
            fontSize: "24px",
            fontWeight: 700,
            marginTop: "8px",
            color: "#2d3748"
        },
        reviewCount: {
            fontSize: "15px",
            color: "#718096",
            marginTop: "5px"
        },
        ratingBreakdown: {
            flex: 2,
            padding: isWideScreen ? "0 30px" : "20px 0",
            borderRight: isWideScreen ? "1px solid #e2e8f0" : "none",
            width: "100%"
        },
        ratingBar: {
            display: "flex",
            alignItems: "center",
            marginBottom: "10px"
        },
        ratingLabelStar: {
            minWidth: "80px",
            color: "#f59e0b",
            fontSize: "16px",
            fontWeight: "600"
        },
        ratingCount: {
            textAlign: "right",
            color: "#718096",
            minWidth: "40px",
            fontSize: "14px"
        },
        reviewButtonContainer: {
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: isWideScreen ? 0 : "10px",
            width: isWideScreen ? "auto" : "100%"
        },
        writeReviewButton: {
            backgroundColor: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "14px 28px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)"
        },
        verifiedBadge: {
            display: "inline-flex",
            alignItems: "center",
            backgroundColor: "#ebf8ff",
            color: "#3182ce",
            borderRadius: "16px",
            padding: "4px 10px",
            fontSize: "12px",
            fontWeight: "600",
            marginBottom: "10px"
        },
        checkIcon: {
            marginRight: "5px",
            width: "14px",
            height: "14px",
            fill: "#3182ce"
        }
    };

    const renderStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    return (
        <div style={styles.container}>

            <div style={styles.headerContainer}>
                <h3 style={styles.title}>Customer Reviews</h3>
                <p style={styles.subtitle}>See what our customers are saying about us</p>
            </div>

            <div style={styles.reviewsSummary}>

                <div style={styles.overallRating}>
                    <div style={styles.stars}>★★★★★</div>
                    <div style={styles.ratingNumber}>5</div>
                    <div style={styles.reviewCount}>from 834 reviews</div>
                </div>

                <div style={styles.ratingBreakdown}>

                    <div style={styles.ratingBar}>
                        <div style={styles.ratingLabelStar}>5 ★★★★★</div>
                        <div style={styles.ratingCount}>802</div>
                    </div>

                    <div style={styles.ratingBar}>
                        <div style={styles.ratingLabelStar}>4 ★★★★</div>
                        <div style={styles.ratingCount}>12</div>
                    </div>

                    <div style={styles.ratingBar}>
                        <div style={styles.ratingLabelStar}>3 ★★★</div>
                        <div style={styles.ratingCount}>5</div>
                    </div>

                    <div style={styles.ratingBar}>
                        <div style={styles.ratingLabelStar}>2 ★★</div>
                        <div style={styles.ratingCount}>2</div>
                    </div>

                    <div style={styles.ratingBar}>
                        <div style={styles.ratingLabelStar}>1 ★</div>
                        <div style={styles.ratingCount}>3</div>
                    </div>

                </div>

                <div style={styles.reviewButtonContainer}>
                    <button style={styles.writeReviewButton}>Write a Review</button>
                </div>

            </div>

            <div style={styles.reviewsContainer}>
                {reviewData.map((review, index) => (
                    <div key={index} style={styles.reviewCard(index)}>
                        <div style={styles.reviewContent}>
                            <h4 style={styles.authorName}>{review.name}</h4>
                            <div style={styles.ratingStars}>{renderStars(review.rating)}</div>
                            <p style={styles.reviewText}>
                                "{review.text}"
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={styles.paginationContainer}>
                {[0, 1, 2].map(index => (
                    <div
                        key={index}
                        onClick={() => setActiveReview(index)}
                        style={styles.paginationDot(index === activeReview)}
                    />
                ))}
            </div>

        </div>
    );
};

export default GenericPreview;