import { useNavigation } from '@remix-run/react';
import { Spinner } from '@shopify/polaris';
import React, { useState } from 'react';

const RatingOfDashboard = () => {

    const [timeframe, setTimeframe] = useState('7d');
    const handleTimeframeChange = (e) => setTimeframe(e.target.value);
    const navigate = useNavigation();
    const isPageLoading = navigate.state === "loading";

    if (isPageLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#e3e3e3",
                    height: "100vh",
                }}
            >
                <Spinner accessibilityLabel="Loading widgets" size="large" />
            </div>
        );
    }

    const metrics = {
        totalReviews: 1248,
        todayReviews: 24,
        monthlyReviews: 356,
        averageRating: 3.5,
        productReviews: 987,
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
                <span style={{ marginLeft: '4px', fontWeight: '600', fontSize: '14px' }}>{rating?.toFixed(1)}</span>
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
            margin: '0 -12px',
        },
        column: {
            padding: '0 12px',
            marginBottom: '24px',
        },
        full: {
            width: '100%',
        }
    };

    return (
        <>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                <select
                    value={timeframe}
                    onChange={handleTimeframeChange}
                    style={{
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: '1px solid #D1D5DB',
                        width: '200px',
                    }}
                >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="ytd">Year to date</option>
                    <option value="all">All time</option>
                </select>
            </div>

            <div style={layoutStyles.row}>
                <div style={{ ...layoutStyles.column, ...layoutStyles.half }}>
                    <div style={cardStyles.container}>
                        <div style={cardStyles.content}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 8px 0', fontWeight: '600' }}>Overall Rating</h3>
                                    <RatingStars rating={metrics.averageRating} />
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '20px', fontWeight: '700' }}>{metrics.totalReviews}</div>
                                    <div style={{ fontSize: '14px', color: '#6B7280' }}>Total Reviews</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                                <div style={{ width: '33%', textAlign: 'center' }}>
                                    <div style={{ color: '#F59E0B', fontSize: '20px', marginBottom: '4px' }}>★</div>
                                    <div style={{ fontSize: '20px', fontWeight: '700' }}>{metrics.todayReviews}</div>
                                    <div style={{ fontSize: '14px', color: '#6B7280' }}>Today</div>
                                </div>
                                <div style={{ width: '33%', textAlign: 'center' }}>
                                    <div style={{ color: '#3B82F6', fontSize: '20px', marginBottom: '4px' }}>★</div>
                                    <div style={{ fontSize: '20px', fontWeight: '700' }}>{metrics.monthlyReviews}</div>
                                    <div style={{ fontSize: '14px', color: '#6B7280' }}>This Month</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ ...layoutStyles.column, ...layoutStyles.half }}>
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ ...cardStyles.container, marginBottom: '16px' }}>
                            <div style={cardStyles.content}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 4px 0', fontWeight: '600' }}>Review Distribution</h3>
                                        <div style={{ fontSize: '14px', color: '#6B7280' }}>Product vs Store reviews</div>
                                    </div>
                                    <div>
                                        <span style={{
                                            backgroundColor: '#DCFCE7',
                                            color: '#166534',
                                            padding: '2px 8px',
                                            borderRadius: '9999px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            marginRight: '8px'
                                        }}>
                                            {Math.round(metrics.productReviews / metrics.totalReviews * 100)}% Products
                                        </span>
                                        <span style={{
                                            backgroundColor: '#DBEAFE',
                                            color: '#1E40AF',
                                            padding: '2px 8px',
                                            borderRadius: '9999px',
                                            fontSize: '12px',
                                            fontWeight: '500'
                                        }}>
                                            {Math.round(metrics.storeReviews / metrics.totalReviews * 100)}% Store
                                        </span>
                                    </div>
                                </div>
                                <div style={{ marginTop: '16px' }}>
                                    <ProgressBar
                                        progress={metrics.productReviews / metrics.totalReviews * 100}
                                        color="success"
                                        height="12px"
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={cardStyles.container}>
                            <div style={cardStyles.content}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 4px 0', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                                            <span style={{ marginRight: '8px', fontSize: '18px' }}>★</span>
                                            Response Rate
                                        </h3>
                                        <div style={{ fontSize: '14px', color: '#6B7280' }}>How often you respond to reviews</div>
                                    </div>
                                    <div style={{ fontSize: '18px', fontWeight: '700' }}>{metrics.responseRate}%</div>
                                </div>
                                <div style={{ marginTop: '12px' }}>
                                    <ProgressBar progress={metrics.responseRate} color="primary" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default RatingOfDashboard