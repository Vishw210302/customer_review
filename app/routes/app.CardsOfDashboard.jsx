import { useNavigate } from '@remix-run/react';
import React from 'react';


function CardsOfDashboard({ data }) {

    console.log("datadatadatadatadata", data)

    const metrics = {
        totalReviews: 1248,
        todayReviews: 24,
        monthlyReviews: 356,
        averageRating: 4.7,
        productReviews: data.pagination.totalReviews,
        storeReviews: 261,
        pendingReviews: 18,
        responseRate: 92
    };

    const RatingStars = ({ rating }) => {
        const fullStars = Math.floor(rating);

        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {[...Array(5)].map((_, index) => (
                    <span key={index} style={{ color: index < fullStars ? '#FFB800' : '#D1D5DB', fontSize: '18px', marginRight: '2px' }}>
                        ★
                    </span>
                ))}
                <span style={{ marginLeft: '4px', fontWeight: '600', fontSize: '14px' }}>{rating.toFixed(1)}</span>
            </div>
        );
    };

    const ProgressBar = ({ progress, color, height = '8px' }) => {
        const getColor = () => {
            switch (color) {
                case 'success': return '#10B981';
                case 'warning': return '#F59E0B';
                case 'critical': return '#EF4444';
                default: return '#2563EB';
            }
        };

        return (
            <div style={{ width: '100%', backgroundColor: '#E5E7EB', borderRadius: '4px', height }}>
                <div
                    style={{
                        width: `${progress}%`,
                        backgroundColor: getColor(),
                        height: '100%',
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                    }}
                ></div>
            </div>
        );
    };

    const cardStyles = {
        container: {
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            marginBottom: '24px',
        },
        header: {
            padding: '16px 20px',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: "10px"
        },
        title: {
            fontSize: '16px',
            fontWeight: '600',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
        },
        headerIcon: {
            marginRight: '8px',
            color: '#4B5563',
        },
        content: {
            padding: '20px',
        },
        footer: {
            padding: '16px 20px',
            borderTop: '1px solid #E5E7EB',
            textAlign: 'center',
        }
    };

    const layoutStyles = {
        container: {
            padding: '32px',
            backgroundColor: '#F3F4F6',
            minHeight: 'calc(100vh - 76px)',
        },
        row: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        column: {
            padding: '0 12px',
            marginBottom: '24px',
        },
        full: {
            width: '100%',
        }
    };

    const navigate = useNavigate();

    const handleNavigateProductReviewCard = () => {
        navigate("/app/crudeOperation");
    };

    return (
        <div style={layoutStyles.row}>

            <div style={{ ...layoutStyles.column, ...layoutStyles.third }}>
                <div style={cardStyles.container}>
                    <div style={cardStyles.header}>
                        <h3 style={cardStyles.title}>
                            <span style={cardStyles.headerIcon}>★</span>
                            Product Reviews
                        </h3>
                        <button
                            style={{
                                color: '#2563EB',
                                fontSize: '14px',
                                textDecoration: 'none',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0
                            }}
                            onClick={handleNavigateProductReviewCard}
                        >
                            View all Reviews
                        </button>
                    </div>
                    <div style={cardStyles.content}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <div>
                                <div style={{ fontSize: '20px', fontWeight: '700' }}>{metrics.productReviews}</div>
                                <div style={{ fontSize: '14px', color: '#6B7280' }}>Total Reviews</div>
                            </div>
                            <RatingStars rating={data?.averageRating} />
                        </div>
                        {/*    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ width: '80%' }}>
                                    <ProgressBar progress={85} color="success" />
                                </div>
                                <div style={{ fontSize: '14px' }}>5★</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ width: '60%' }}>
                                    <ProgressBar progress={60} color="success" />
                                </div>
                                <div style={{ fontSize: '14px' }}>4★</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ width: '25%' }}>
                                    <ProgressBar progress={25} color="warning" />
                                </div>
                                <div style={{ fontSize: '14px' }}>3★</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ width: '10%' }}>
                                    <ProgressBar progress={10} color="critical" />
                                </div>
                                <div style={{ fontSize: '14px' }}>2★</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ width: '5%' }}>
                                    <ProgressBar progress={5} color="critical" />
                                </div>
                                <div style={{ fontSize: '14px' }}>1★</div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

            <div style={{ ...layoutStyles.column, ...layoutStyles.third }}>
                <div style={cardStyles.container}>
                    <div style={cardStyles.header}>
                        <h3 style={cardStyles.title}>
                            <span style={cardStyles.headerIcon}>★</span>
                            Store Reviews
                        </h3>
                        <button
                            style={{
                                color: '#2563EB',
                                fontSize: '14px',
                                textDecoration: 'none',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0
                            }}
                            onClick={handleNavigateProductReviewCard}
                        >
                            View all Reviews
                        </button>
                    </div>
                    <div style={cardStyles.content}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <div>
                                <div style={{ fontSize: '20px', fontWeight: '700' }}>{metrics.storeReviews}</div>
                                <div style={{ fontSize: '14px', color: '#6B7280' }}>Total Reviews</div>
                            </div>
                            <RatingStars rating={4.8} />
                        </div>
                        {/*  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ width: '90%' }}>
                                    <ProgressBar progress={90} color="success" />
                                </div>
                                <div style={{ fontSize: '14px' }}>5★</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ width: '70%' }}>
                                    <ProgressBar progress={70} color="success" />
                                </div>
                                <div style={{ fontSize: '14px' }}>4★</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ width: '15%' }}>
                                    <ProgressBar progress={15} color="warning" />
                                </div>
                                <div style={{ fontSize: '14px' }}>3★</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ width: '5%' }}>
                                    <ProgressBar progress={5} color="critical" />
                                </div>
                                <div style={{ fontSize: '14px' }}>2★</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ width: '2%' }}>
                                    <ProgressBar progress={2} color="critical" />
                                </div>
                                <div style={{ fontSize: '14px' }}>1★</div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CardsOfDashboard;