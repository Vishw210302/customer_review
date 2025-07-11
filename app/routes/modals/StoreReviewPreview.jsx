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
        writeButtonTextColor: '#ffffff',
        starColor: '#f59e0b',
        textColor: '#1F2937',
        backgroundColor: '#ffffff',
        borderRadius: '0.75rem',
      
        // Layout Settings
        titleFontSize: '16px',
        subTitleFontSize: '15px',
        reviewNameFontSize: '15px',
        reviewMessageFontSize: '15px',
        dateFontSize: '15px',
        starSize: '20px',
        starSpacing: '2px',
        
        // Content Settings
        buttonText: 'Write a Review',
        reviewSectionTitle: 'Recent Reviews',
        showReviewDates: true,
        
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
                    fontSize: settings.starSize,
                    marginRight: '2px',
                      padding: `0 ${settings.starSpacing}`,
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
          
            overflow: 'hidden',
            fontSize: '1rem'
        },
        headerGradient: {
            padding: '1.25rem',
            borderBottom: '1px solid grey',
        },
        headerContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        headerTitle: {
            fontSize: settings.titleFontSize,
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
            fontSize: settings.subTitleFontSize,
            color: settings.textColor,
            marginTop: '0.25rem'
        },
        writeReviewButton: {
            backgroundColor: settings.primaryColor,
            color: settings.writeButtonTextColor,
            padding: '0.625rem 1.25rem',
            borderRadius: '50px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500'
        },  
        reviewSection: {
            padding: '1.25rem'
        },
        reviewSectionTitle: {
            fontSize: settings.titleFontSize,
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
            color: settings.textColor,
            fontSize: settings.reviewNameFontSize
        },
        reviewDate: {
            fontSize: settings.dateFontSize,
            color: settings.textColor
        },
        reviewMessage: {
            color: settings.textColor,
            display: 'block',
            WebkitLineClamp: 'none',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontSize: settings.reviewMessageFontSize
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
                                        fontSize: '0.875rem'
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
                                   Button Text
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
                                    Star
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
                                    Review Text 
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
                                    Background
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
                  Reviewer FontSize
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
                  Reviewer Message FontSize
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
                 Date FontSize
              </label>
              <select
                  value={settings.dateFontSize}
                  onChange={(e) => updateSetting('dateFontSize', e.target.value)}
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
                                            <div style={{ display: 'flex', alignItems: 'center'  }}>
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