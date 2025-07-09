import { Star, Settings, Palette, Type, Eye } from 'lucide-react';
import React, { useState } from 'react';

function StoreReviewSettings() {
    const [settings, setSettings] = useState({
        // General Settings
        storeName: 'Store Rating',
        
        totalReviewsBased: 'Based on {{ number_of_reviews }} verified reviews',
        showRecentReviews: true,
   
        
        // Style Settings
        primaryColor: '#000000',
        accentColor: '#EFF6FF',
        starColor: '#f59e0b',
        textColor: '#1F2937',
        backgroundColor: '#ffffff',
        borderRadius: '0.75rem',
        shadowIntensity: 'medium',
        
        // Layout Settings
        headerGradient: true,
        buttonStyle: 'rounded',
       
        compactMode: false,
        
        // Content Settings
        buttonText: 'Write a Review',
        reviewSectionTitle: 'Recent Reviews',
        showReviewDates: true,
        truncateReviews: true
    });

    const [activeTab, setActiveTab] = useState('general');

    const sampleReviews = [
        {
            name: 'Sarah Johnson',
            rating: 4,
            message: 'I absolutely love this product. The quality is outstanding and it exceeded all my expectations.',
            date: '2 weeks ago'
        },
        {
            name: 'Mike Chen',
            rating: 5,
            message: 'Fantastic service and amazing product quality. Will definitely order again!',
            date: '1 week ago'
        },
        {
            name: 'Emma Davis',
            rating: 3,
            message: 'Good product overall, but shipping took longer than expected. Otherwise satisfied with the purchase.',
            date: '3 days ago'
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
                    fontSize: '24px',
                    marginRight: '2px'
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
            boxShadow: settings.shadowIntensity === 'low' ? '0 1px 3px rgba(0,0,0,0.1)' :
                      settings.shadowIntensity === 'medium' ? '0 4px 6px rgba(0,0,0,0.1)' :
                      '0 10px 15px rgba(0,0,0,0.1)',
            borderRadius: settings.borderRadius,
            overflow: 'hidden',
            fontSize: settings.compactMode ? '0.875rem' : '1rem'
        },
        headerGradient: {
            padding: settings.compactMode ? '1rem' : '1.25rem',
            background: settings.headerGradient 
                ? `linear-gradient(to right, ${settings.accentColor}, ${settings.accentColor}dd)` 
                : settings.backgroundColor
        },
        headerContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        headerTitle: {
            fontSize: settings.compactMode ? '1.25rem' : '1.5rem',
            fontWeight: 'bold',
            color: settings.textColor,
            margin: 0
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
            color: settings.textColor
        },
        reviewCountText: {
            fontSize: '0.875rem',
            color: '#6B7280',
            marginTop: '0.25rem'
        },
        writeReviewButton: {
            backgroundColor: settings.primaryColor,
            color: 'white',
            padding: settings.compactMode ? '0.5rem 1rem' : '0.625rem 1.25rem',
            borderRadius: settings.buttonStyle === 'rounded' ? '50px' : '0.375rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500'
        },
        reviewSection: {
            padding: settings.compactMode ? '1rem' : '1.25rem'
        },
        reviewSectionTitle: {
            fontSize: '1.125rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: settings.textColor,
            margin: '0 0 1rem 0'
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
            marginRight: '0.75rem',
            color: settings.textColor
        },
        reviewDate: {
            fontSize: '0.875rem',
            color: '#6B7280'
        },
        reviewMessage: {
            color: '#374151',
            display: settings.truncateReviews ? '-webkit-box' : 'block',
            WebkitLineClamp: settings.truncateReviews ? 2 : 'none',
            WebkitBoxOrient: 'vertical',
            overflow: settings.truncateReviews ? 'hidden' : 'visible'
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
                        Widget Settings
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
                                    Store Name
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
                                        fontSize: '0.875rem'
                                    }}
                                />
                            </div>

                            

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Total Reviews
                                </label>
                                <input
                                    type="text"
                                    value={settings.totalReviewsBased}
                                    onChange={(e) => updateSetting('totalReviewsBased', parseInt(e.target.value))}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem'
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
                                        fontSize: '0.875rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Review Section Title
                                </label>
                                <input
                                    type="text"
                                    value={settings.reviewSectionTitle}
                                    onChange={(e) => updateSetting('reviewSectionTitle', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem'
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
                                        checked={settings.truncateReviews}
                                        onChange={(e) => updateSetting('truncateReviews', e.target.checked)}
                                    />
                                    Truncate Long Reviews
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'style' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Primary Color (Button)
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
                                    Accent Color (Header)
                                </label>
                                <input
                                    type="color"
                                    value={settings.accentColor}
                                    onChange={(e) => updateSetting('accentColor', e.target.value)}
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

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Border Radius
                                </label>
                                <select
                                    value={settings.borderRadius}
                                    onChange={(e) => updateSetting('borderRadius', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    <option value="0">Sharp (0px)</option>
                                    <option value="0.25rem">Small (4px)</option>
                                    <option value="0.5rem">Medium (8px)</option>
                                    <option value="0.75rem">Large (12px)</option>
                                    <option value="1rem">Extra Large (16px)</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Shadow Intensity
                                </label>
                                <select
                                    value={settings.shadowIntensity}
                                    onChange={(e) => updateSetting('shadowIntensity', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    <option value="none">None</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {activeTab === 'layout' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Button Style
                                </label>
                                <select
                                    value={settings.buttonStyle}
                                    onChange={(e) => updateSetting('buttonStyle', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    <option value="rounded">Rounded</option>
                                    <option value="square">Square</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                                    <input
                                        type="checkbox"
                                        checked={settings.headerGradient}
                                        onChange={(e) => updateSetting('headerGradient', e.target.checked)}
                                    />
                                    Header Gradient Background
                                </label>
                            </div>

                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                                    <input
                                        type="checkbox"
                                        checked={settings.compactMode}
                                        onChange={(e) => updateSetting('compactMode', e.target.checked)}
                                    />
                                    Compact Mode
                                </label>
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
                
                <div style={{ maxWidth: '600px', width: '100%' }}>
                    <div style={styles.container}>
                        <div style={styles.headerGradient}>
                            <div style={styles.headerContainer}>
                                <div>
                                    <h2 style={styles.headerTitle}>{settings.storeName}</h2>
                                     <div style={styles.starContainer}>
                            
                             <div style={styles.stars}>★★★★☆</div>
                    
                            <span style={styles.starSubtext}>(3.5)</span>
                        </div>
                                    <p style={styles.reviewCountText}>
                                     {settings.totalReviewsBased.replace('{{ number_of_reviews }}', 458)}
                                    </p>
                                </div>
                                <button style={styles.writeReviewButton}>
                                    {settings.buttonText}
                                </button>
                            </div>
                        </div>

                        {settings.showRecentReviews && (
                            <div style={styles.reviewSection}>
                                <h3 style={styles.reviewSectionTitle}>{settings.reviewSectionTitle}</h3>
                                {sampleReviews.slice(0, settings.maxReviewsToShow).map((review, index) => (
                                    <div key={index} style={{
                                        ...styles.reviewItem,
                                        borderBottom: index === Math.min(settings.maxReviewsToShow, sampleReviews.length) - 1 ? 'none' : '1px solid #E5E7EB'
                                    }}>
                                        <div style={styles.reviewHeader}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <h4 style={styles.reviewName}>{review.name}</h4>
                                                {renderStars(review.rating)}
                                            </div>
                                            {settings.showReviewDates && (
                                                <span style={styles.reviewDate}>{review.date}</span>
                                            )}
                                        </div>
                                        <p style={styles.reviewMessage}>{review.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StoreReviewSettings;