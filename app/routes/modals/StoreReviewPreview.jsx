import { Star } from 'lucide-react';
import React from 'react';

function StoreReviewPreview() {

    const styles = {
        container: {
            width: '100%',
            // maxWidth: '28rem',
            margin: '0 auto',
            backgroundColor: 'white',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            borderRadius: '0.75rem',
            overflow: 'hidden'
        },
        headerGradient: {
            padding: '1.25rem',
            background: 'linear-gradient(to right, #EFF6FF, #DBEAFE)'
        },
        headerContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        headerTitle: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1F2937'
        },
        starContainer: {
            display: 'flex',
            alignItems: 'center',
            marginTop: '0.5rem'
        },
        starSubtext: {
            marginLeft: '0.75rem',
            fontSize: '1.125rem',
            fontWeight: 'bold',
            color: '#374151'
        },
        reviewCountText: {
            fontSize: '0.875rem',
            color: '#4B5563',
            marginTop: '0.25rem'
        },
        writeReviewButton: {
            backgroundColor: '#000000',
            color: 'white',
            padding: '0.625rem 1.25rem',
            borderRadius: '50px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border:'none'
        },
        reviewSection: {
            padding: '1.25rem'
        },
        reviewSectionTitle: {
            fontSize: '1.125rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#1F2937'
        },
        reviewItem: {
            borderBottom: '1px solid #E5E7EB',
            paddingBottom: '1rem',
            marginBottom: '1rem'
        },
        reviewHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.5rem'
        },
        reviewName: {
            fontWeight: 'bold',
            marginRight: '0.75rem'
        },
        reviewDate: {
            fontSize: '0.875rem',
            color: '#6B7280'
        },
        reviewMessage: {
            color: '#374151',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
        },
          stars: {
            color: "#f59e0b",
            fontSize: "28px",
            letterSpacing: "3px",
              display: 'inline-block',
              padding: "10px 0"
        },
    };

    const reviews = [
        {
            name: 'Sarah Johnson',
            rating: 3.5,
            title: 'Amazing Product!',
            message: 'I absolutely love this product. The quality is outstanding and it exceeded all my expectations.',
            date: '2 weeks ago',
            images: []
        },
    ];

    // const renderStars = (rating) => {
    //     return Array.from({ length: 5 }).map((_, index) => (
    //         <Star
    //             key={index}
    //             style={{
    //                 display: 'inline-block',
    //                 color: index < rating ? '#FFC107' : '#D1D5DB',
    //                 fill: index < rating ? '#FFC107' : 'none'
    //             }}
    //         />
    //     ));
    // };

    return (
        <div style={styles.container}>
            <div style={styles.headerGradient}>
                <div style={styles.headerContainer}>
                    <div>
                        <h2 style={styles.headerTitle}>Store Rating</h2>
                        <div style={styles.starContainer}>
                            
                             <div style={styles.stars}>★★★★☆</div>
                    
                            <span style={styles.starSubtext}>(3.5)</span>
                        </div>
                        <p style={styles.reviewCountText}>Based on 458 verified reviews</p>
                    </div>
                    <button
                        style={styles.writeReviewButton}
                    >
                        Write a Review
                    </button>
                </div>
            </div>

            <div style={styles.reviewSection}>
                <h3 style={styles.reviewSectionTitle}>Recent Reviews</h3>
                {reviews && reviews.map((review, index) => (
                    <div key={index} style={{
                        ...styles.reviewItem,
                        borderBottom: index === reviews.length - 1 ? 'none' : '1px solid #E5E7EB'
                    }}>
                        <div style={styles.reviewHeader}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <h4 style={styles.reviewName}>{review.name}</h4>
                               
                                 <div style={styles.stars}>★★★★☆</div>
                            </div>
                            <span style={styles.reviewDate}>{review.date}</span>
                        </div>
                        <p style={styles.reviewMessage}>{review.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoreReviewPreview;