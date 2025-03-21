import React, { useState } from 'react'

const LatestReviewDashboard = () => {

    const [selected, setSelected] = useState(0);
    const handleTabChange = (selectedTabIndex) => setSelected(selectedTabIndex);

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

    const latestReviews = [
        { customer: 'John D.', product: 'Black T-shirt', rating: 5, comment: 'Great quality and fast shipping!', date: '2 hours ago' },
        { customer: 'Sarah M.', product: 'Leather Wallet', rating: 4, comment: 'Nice product but slight color difference', date: '5 hours ago' },
        { customer: 'Mike R.', product: 'Store Experience', rating: 5, comment: 'Customer service was exceptional', date: '1 day ago' },
        { customer: 'Emma L.', product: 'Canvas Bag', rating: 3, comment: 'Average quality for the price', date: '1 day ago' },
    ];

    const tabs = [
        { id: 'all-reviews', label: 'All Reviews' },
        { id: 'product-reviews', label: 'Product Reviews' },
        { id: 'store-reviews', label: 'Store Reviews' },
    ];


    const tabStyles = {
        container: {
            display: 'flex',
            borderBottom: '1px solid #E5E7EB',
        },
        tab: {
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            color: '#6B7280',
            borderBottom: '2px solid transparent',
        },
        active: {
            color: '#2563EB',
            borderBottom: '2px solid #2563EB',
        }
    };

    return (
        <div style={layoutStyles.row}>
            <div style={{ ...layoutStyles.column, ...layoutStyles.full }}>
                <div style={cardStyles.container}>
                    <div style={tabStyles.container}>
                        {tabs.map((tab, index) => (
                            <div
                                key={tab.id}
                                style={{
                                    ...tabStyles.tab,
                                    ...(selected === index ? tabStyles.active : {})
                                }}
                                onClick={() => handleTabChange(index)}
                            >
                                {tab.label}
                            </div>
                        ))}
                    </div>
                    <div style={cardStyles.content}>
                        <h3 style={{ marginTop: 0, marginBottom: '16px', fontWeight: '600' }}>Latest Reviews</h3>
                        <div style={{ overflow: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                                        <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '600', color: '#4B5563' }}>Customer</th>
                                        <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '600', color: '#4B5563' }}>Product</th>
                                        <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: '600', color: '#4B5563' }}>Rating</th>
                                        <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '600', color: '#4B5563' }}>Comment</th>
                                        <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '600', color: '#4B5563' }}>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {latestReviews.map((review, index) => (
                                        <tr key={index} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                            <td style={{ padding: '12px 16px' }}>{review.customer}</td>
                                            <td style={{ padding: '12px 16px' }}>{review.product}</td>
                                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                <div style={{ display: 'inline-flex' }}>
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <span key={i} style={{ color: '#FFB800', fontSize: '16px' }}>★</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>{review.comment}</td>
                                            <td style={{ padding: '12px 16px', color: '#6B7280' }}>{review.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LatestReviewDashboard