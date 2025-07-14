import { Eye, Palette, Settings, Type } from 'lucide-react';
import { useState } from 'react';

function StoreReviewSettings() {

    const [settings, setSettings] = useState({
        storeName: 'Customer Reviews',
        totalReviewsBased: 'Average 3.8 Based on 4 Rating Verified Reviews',
        showRecentReviews: true,
        buttonText: 'Write a Review',
        showReviewDates: true,
        showReviewImage: true,
        showReviewEmail: true,
        primaryColor: '#000000',
        writeButtonTextColor: '#ffffff',
        starColor: '#f59e0b',
        textColor: '#1F2937',
        dateColor: '#1F2937',
        titleColor: '#1F2937',
        backgroundColor: '#ffffff',
        titleFontSize: '16px',
        subTitleFontSize: '15px',
        reviewNameFontSize: '15px',
        reviewTitleFontSize: '15px',
        reviewMessageFontSize: '12px',
        starSize: '20px',
        starSpacing: '2px',
    });

    const [activeTab, setActiveTab] = useState('general');

    const sampleReviews = [
        {
            name: 'Sarah Johnson',
            rating: 4,
            title: "Great Product Quality",
            message: 'I absolutely love this product. The quality is outstanding and it exceeded all my expectations.',
            email: "sarah.johnson@email.com",
            date: "April 9, 2025"
        },
        {
            name: 'Mike Chen',
            rating: 5,
            title: "Excellent Service",
            message: 'Fantastic service and amazing product quality. Will definitely order again!',
            email: "mike.chen@email.com",
            date: "April 8, 2025"
        },
        {
            name: 'Emma Davis',
            rating: 3,
            title: "Good but Could Be Better",
            message: 'Good product overall, but shipping took longer than expected. Otherwise satisfied with the purchase.',
            email: "emma.davis@email.com",
            date: "April 7, 2025"
        }
    ];

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <span
                key={index}
                style={{
                    color: index < rating ? settings.starColor : '#D1D5DB',
                    fontSize: settings.starSize,
                    marginRight: settings.starSpacing,
                }}
            >
                ★
            </span>
        ));
    };

    const getPreviewStyles = () => ({
        container: {
            width: '100%',
            backgroundColor: settings.backgroundColor,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            borderRadius: '0.5rem',
            overflow: 'hidden',
        },
        headerSection: {
            padding: '1.25rem',
        },
        headerContainer: {
            display: 'flex',
            flexDirection: "column",
        },
        headerTitle: {
            fontSize: settings.titleFontSize,
            fontWeight: 'bold',
            color: settings.textColor,
            margin: 0,
            textAlign: "center",
        },
        starContainer: {
            display: 'flex',
            alignItems: 'center',
            marginTop: '5px',
            justifyContent: "center",
        },
        starSubtext: {
            marginLeft: '0.5rem',
            fontSize: '1.125rem',
            fontWeight: 'bold',
            color: settings.textColor
        },
        reviewCountText: {
            fontSize: settings.subTitleFontSize,
            color: settings.textColor,
            marginTop: "5px",
            textAlign: "center",
        },
        writeReviewButton: {
            backgroundColor: settings.primaryColor,
            color: settings.writeButtonTextColor,
            padding: '0.625rem 1.25rem',
            borderRadius: '50px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500',
            marginTop: "5px",
        },
        reviewSection: {
            padding: '1.25rem',
            backgroundColor: '#f9fafb'
        },
        reviewsGrid: {
            display: "grid",
            gridTemplateColumns: "2fr 2fr",
            gap: "1.5rem",
            width: "100%"
        },
        reviewCard: {
            backgroundColor: settings.backgroundColor,
            boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
            padding: "1rem",
            borderRadius: "0.5rem"
        },
        reviewName: {
            fontWeight: 'bold',
            color: settings.textColor,
            fontSize: settings.reviewNameFontSize,
            margin: '0 0 0.25rem 0'
        },
        emailName: {
            fontSize: "13px",
            color: "#6b7280",
            fontWeight: "500",
            margin: '0 0 5px 0'
        },
        reviewTitle: {
            color: settings.titleColor,
            fontWeight: "bold",
            fontSize: settings.reviewTitleFontSize,
            margin: '0 0 5px 0'
        },
        reviewMessage: {
            color: settings.textColor,
            fontSize: settings.reviewMessageFontSize,
            margin: '0 0 10px 0',
            lineHeight: '1.5'
        },
        productImage: {
            width: '40%',
            height: '120px',
            objectFit: 'cover',
            borderRadius: '0.375rem',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem',
            color: '#9ca3af',
            fontSize: '0.875rem'
        },
        reviewDate: {
            fontSize: settings.subTitleFontSize,
            color: settings.dateColor,
            margin: 0
        }
    });

    const styles = getPreviewStyles();

    return (

        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* Settings Panel */}
            <div style={{
                width: '400px',
                backgroundColor: 'white',
                boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
                overflowY: 'auto'
            }}>
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: '#f9fafb'
                }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <Settings size={20} />
                        Store Widget Settings
                    </h2>
                </div>

                {/* Tab Navigation */}
                <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
                    {[
                        { id: 'general', label: 'General', icon: Settings },
                        { id: 'style', label: 'Style', icon: Palette },
                        { id: 'layout', label: 'Layout', icon: Type }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                border: 'none',
                                backgroundColor: activeTab === tab.id ? '#f3f4f6' : 'transparent',
                                color: activeTab === tab.id ? '#1f2937' : '#6b7280',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.25rem'
                            }}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div style={{ padding: '1.5rem' }}>
                    {activeTab === 'general' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={settings.storeName}
                                    onChange={(e) => updateSetting('storeName', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Total Reviews Text
                                </label>
                                <input
                                    type="text"
                                    value={settings.totalReviewsBased}
                                    onChange={(e) => updateSetting('totalReviewsBased', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Button Text
                                </label>
                                <input
                                    type="text"
                                    value={settings.buttonText}
                                    onChange={(e) => updateSetting('buttonText', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                                    <input
                                        type="checkbox"
                                        checked={settings.showRecentReviews}
                                        onChange={(e) => updateSetting('showRecentReviews', e.target.checked)}
                                    />
                                    Show Recent Reviews
                                </label>
                            </div>

                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                                    <input
                                        type="checkbox"
                                        checked={settings.showReviewDates}
                                        onChange={(e) => updateSetting('showReviewDates', e.target.checked)}
                                    />
                                    Show Review Dates
                                </label>
                            </div>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                                    <input
                                        type="checkbox"
                                        checked={settings.showReviewImage}
                                        onChange={(e) => updateSetting('showReviewImage', e.target.checked)}
                                    />
                                    Show Review Images
                                </label>
                            </div>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                                    <input
                                        type="checkbox"
                                        checked={settings.showReviewEmail}
                                        onChange={(e) => updateSetting('showReviewEmail', e.target.checked)}
                                    />
                                    Show Review Email
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'style' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Button Background
                                </label>
                                <input
                                    type="color"
                                    value={settings.primaryColor}
                                    onChange={(e) => updateSetting('primaryColor', e.target.value)}
                                    style={{
                                        width: '100%',
                                        height: '40px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Button Text Color
                                </label>
                                <input
                                    type="color"
                                    value={settings.writeButtonTextColor}
                                    onChange={(e) => updateSetting('writeButtonTextColor', e.target.value)}
                                    style={{
                                        width: '100%',
                                        height: '40px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Star Color
                                </label>
                                <input
                                    type="color"
                                    value={settings.starColor}
                                    onChange={(e) => updateSetting('starColor', e.target.value)}
                                    style={{
                                        width: '100%',
                                        height: '40px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Text Color
                                </label>
                                <input
                                    type="color"
                                    value={settings.textColor}
                                    onChange={(e) => updateSetting('textColor', e.target.value)}
                                    style={{
                                        width: '100%',
                                        height: '40px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Date Color
                                </label>
                                <input
                                    type="color"
                                    value={settings.dateColor}
                                    onChange={(e) => updateSetting('dateColor', e.target.value)}
                                    style={{
                                        width: '100%',
                                        height: '40px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Title Color
                                </label>
                                <input
                                    type="color"
                                    value={settings.titleColor}
                                    onChange={(e) => updateSetting('titleColor', e.target.value)}
                                    style={{
                                        width: '100%',
                                        height: '40px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Background Color
                                </label>
                                <input
                                    type="color"
                                    value={settings.backgroundColor}
                                    onChange={(e) => updateSetting('backgroundColor', e.target.value)}
                                    style={{
                                        width: '100%',
                                        height: '40px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem'
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'layout' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Title Font Size
                                </label>
                                <select
                                    value={settings.titleFontSize}
                                    onChange={(e) => updateSetting('titleFontSize', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    <option value="14px">Extra Small (14px)</option>
                                    <option value="16px">Small (16px)</option>
                                    <option value="18px">Medium (18px)</option>
                                    <option value="20px">Large (20px)</option>
                                    <option value="22px">Extra Large (22px)</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Subtitle Font Size
                                </label>
                                <select
                                    value={settings.subTitleFontSize}
                                    onChange={(e) => updateSetting('subTitleFontSize', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    <option value="12px">Extra Small (12px)</option>
                                    <option value="14px">Small (14px)</option>
                                    <option value="15px">Medium (15px)</option>
                                    <option value="16px">Large (16px)</option>
                                    <option value="18px">Extra Large (18px)</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Reviewer Name Font Size
                                </label>
                                <select
                                    value={settings.reviewNameFontSize}
                                    onChange={(e) => updateSetting('reviewNameFontSize', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    <option value="12px">Extra Small (12px)</option>
                                    <option value="14px">Small (14px)</option>
                                    <option value="15px">Medium (15px)</option>
                                    <option value="16px">Large (16px)</option>
                                    <option value="18px">Extra Large (18px)</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Review Title Font Size
                                </label>
                                <select
                                    value={settings.reviewTitleFontSize}
                                    onChange={(e) => updateSetting('reviewTitleFontSize', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    <option value="12px">Extra Small (12px)</option>
                                    <option value="14px">Small (14px)</option>
                                    <option value="15px">Medium (15px)</option>
                                    <option value="16px">Large (16px)</option>
                                    <option value="18px">Extra Large (18px)</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Review Message Font Size
                                </label>
                                <select
                                    value={settings.reviewMessageFontSize}
                                    onChange={(e) => updateSetting('reviewMessageFontSize', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    <option value="12px">Extra Small (12px)</option>
                                    <option value="14px">Small (14px)</option>
                                    <option value="15px">Medium (15px)</option>
                                    <option value="16px">Large (16px)</option>
                                    <option value="18px">Extra Large (18px)</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Star Size
                                </label>
                                <select
                                    value={settings.starSize}
                                    onChange={(e) => updateSetting('starSize', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    <option value="16px">Small (16px)</option>
                                    <option value="18px">Medium (18px)</option>
                                    <option value="20px">Large (20px)</option>
                                    <option value="24px">Extra Large (24px)</option>
                                    <option value="28px">Huge (28px)</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Star Spacing
                                </label>
                                <select
                                    value={settings.starSpacing}
                                    onChange={(e) => updateSetting('starSpacing', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    <option value="0px">None (0px)</option>
                                    <option value="1px">Tight (1px)</option>
                                    <option value="2px">Normal (2px)</option>
                                    <option value="3px">Loose (3px)</option>
                                    <option value="4px">Extra Loose (4px)</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Preview Panel */}
            <div style={{
                flex: 1,
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#f1f5f9'
            }}>
                <div style={{
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#64748b',
                    fontSize: '1.125rem',
                    fontWeight: '500'
                }}>
                    <Eye size={20} />
                    Live Preview
                </div>

                <div style={{ width: '100%' }}>
                    <div style={styles.container}>
                        <div style={styles.headerSection}>
                            <div style={styles.headerContainer}>
                                <div>
                                    <h2 style={styles.headerTitle}>{settings.storeName}</h2>
                                    <p style={styles.reviewCountText}>
                                        {settings.totalReviewsBased}
                                    </p>
                                    <div style={styles.starContainer}>
                                        {renderStars(4)}
                                    </div>
                                </div>
                                <button style={styles.writeReviewButton}>
                                    {settings.buttonText}
                                </button>
                            </div>
                        </div>

                        {settings.showRecentReviews && (
                            <div style={styles.reviewSection}>
                                <div style={styles.reviewsGrid}>
                                    {sampleReviews.map((review, index) => (
                                        <div key={index} style={styles.reviewCard}>
                                            <div>
                                                <h4 style={styles.reviewName}>{review.name}</h4>

                                                {settings.showReviewEmail && (
                                                    <p style={styles.emailName}>{review.email}</p>
                                                )}

                                                <div style={{ marginBottom: '5px' }}>
                                                    {renderStars(review.rating)}
                                                </div>
                                            </div>

                                            <p style={styles.reviewTitle}>{review.title}</p>
                                            <p style={styles.reviewMessage}>{review.message}</p>

                                            {settings.showReviewImage && (
                                                <div style={{ display: "flex", flexWrap: "wrap", width: "100%", gap: "5px" }}>
                                                    <div style={styles.productImage}>
                                                        Product Image
                                                    </div>

                                                    <div style={styles.productImage}>
                                                        Product Image
                                                    </div>
                                                </div>
                                            )}

                                            {settings.showReviewDates && (
                                                <p style={styles.reviewDate}>
                                                    {review.date}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StoreReviewSettings;