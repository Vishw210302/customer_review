import React, { useState } from 'react';

const ReviewWidgetSettings = () => {
  const [settings, setSettings] = useState({
    // Text settings
    widgetTitle: 'Customer Reviews',
    widgetSubTitle: 'See what our customers are saying about us',
        writeButtonText: 'Write a Review',
    cancelButtonText: 'Cancel review',
    headerWithReviews: 'Based on {{ number_of_reviews }} review/reviews',
    headerNoReviews: 'Be the first to write a review',
    
    // Colors
    primaryColor: '#108474',
    starColor: '#f59e0b',
    
    // Features
    showPhotosVideos: false,
    showMedals: true,
    roundCorners: false,
    
    // Review data
    overallRating: 5.0,
    totalReviews: 834,
    ratingBreakdown: {
      5: 802,
      4: 12,
      3: 5,
      2: 2,
      1: 3
    }
  });

  const [activeTab, setActiveTab] = useState('text');

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetToDefault = () => {
    setSettings({
      widgetTitle: 'Customer Reviews',
        widgetSubTitle: 'See what our customers are saying about us',
    
      writeButtonText: 'Write a Review',
      cancelButtonText: 'Cancel review',
      headerWithReviews: 'Based on {{ number_of_reviews }} review/reviews',
      headerNoReviews: 'Be the first to write a review',
      primaryColor: '#108474',
      starColor: '#f59e0b',
      showPhotosVideos: false,
      showMedals: true,
      roundCorners: false,
      overallRating: 5.0,
      totalReviews: 834,
      ratingBreakdown: {
        5: 802,
        4: 12,
        3: 5,
        2: 2,
        1: 3
      }
    });
  };

  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    settingsPanel: {
      width: '400px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      overflow: 'auto'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      padding: '20px',
      borderBottom: '1px solid #e2e8f0',
      backgroundColor: '#ffffff'
    },
    backButton: {
      backgroundColor: 'transparent',
      border: 'none',
      marginRight: '12px',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '4px',
      color: '#6b7280'
    },
    headerTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1f2937',
      margin: 0
    },
    tabContainer: {
      display: 'flex',
      borderBottom: '1px solid #e2e8f0',
      backgroundColor: '#ffffff'
    },
    tab: (isActive) => ({
      padding: '12px 20px',
      backgroundColor: isActive ? '#f3f4f6' : 'transparent',
      border: 'none',
      borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      color: isActive ? '#3b82f6' : '#6b7280'
    }),
    settingsContent: {
      padding: '20px'
    },
    section: {
      marginBottom: '24px'
    },
    sectionTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '12px'
    },
    inputGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '500',
      color: '#6b7280',
      marginBottom: '6px'
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      backgroundColor: '#ffffff'
    },
    colorInput: {
      width: '40px',
      height: '40px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      cursor: 'pointer',
      padding: '2px'
    },
    colorGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px'
    },
    colorInfo: {
      flex: 1
    },
    colorLabel: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '4px'
    },
    colorCode: {
      fontSize: '12px',
      color: '#6b7280',
      fontFamily: 'monospace'
    },
    colorDescription: {
      fontSize: '12px',
      color: '#6b7280',
      marginTop: '4px'
    },
    checkbox: {
      marginRight: '8px'
    },
    checkboxLabel: {
      fontSize: '14px',
      color: '#374151',
      cursor: 'pointer'
    },
    resetButton: {
      color: '#3b82f6',
      textDecoration: 'none',
      fontSize: '14px',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: 'transparent'
    },
    previewPanel: {
      flex: 1,
      backgroundColor: '#f8f9fa',
      padding: '20px',
      overflow: 'auto'
    },
    previewHeader: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '20px'
    },
    // Preview styles
    previewContainer: {
      background: 'linear-gradient(to right, #EFF6FF, #DBEAFE)',
      padding: '20px',
      borderRadius: settings.roundCorners ? '24px' : '12px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      maxWidth: '600px',
      margin: '0 auto'
    },
    previewTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#2d3748',
      margin: '0 0 8px 0',
      textAlign: 'center'
    },
    previewSubtitle: {
      fontSize: '15px',
      color: '#718096',
      margin: '0 0 24px 0',
      textAlign: 'center'
    },
    summaryCard: {
      backgroundColor: '#ffffff',
      borderRadius: settings.roundCorners ? '20px' : '12px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      marginBottom: '30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    ratingSection: {
      flex: 1,
      textAlign: 'center',
      borderRight: '1px solid #e2e8f0',
      paddingRight: '20px'
    },
    ratingStars: {
      color: settings.starColor,
      fontSize: '28px',
      letterSpacing: '3px'
    },
    ratingNumber: {
      fontSize: '24px',
      fontWeight: '700',
      marginTop: '8px',
      color: '#2d3748'
    },
    reviewCount: {
      fontSize: '15px',
      color: '#718096',
      marginTop: '5px'
    },
    breakdownSection: {
      flex: 2,
      padding: '0 30px'
    },
    ratingBar: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '8px',
      gap: '15px'
    },
    ratingLabel: {
      minWidth: '80px',
      color: settings.starColor,
      fontSize: '14px',
      fontWeight: '600'
    },
    ratingBarFill: {
      height: '6px',
      backgroundColor: settings.primaryColor,
      borderRadius: '3px',
      flex: 1
    },
    ratingBarEmpty: {
      height: '6px',
      backgroundColor: '#e2e8f0',
      borderRadius: '3px',
      flex: 1
    },
    ratingCount: {
      minWidth: '30px',
      color: '#718096',
      fontSize: '14px',
      textAlign: 'right'
    },
    buttonSection: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: '20px',
      borderLeft: '1px solid #e2e8f0'
    },
    writeButton: {
      backgroundColor: settings.primaryColor,
      color: 'white',
      border: 'none',
      borderRadius: settings.roundCorners ? '25px' : '50px',
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    },
    medalsSection: {
      display: settings.showMedals ? 'block' : 'none',
      backgroundColor: '#ffffff',
      borderRadius: settings.roundCorners ? '20px' : '12px',
      padding: '16px',
      marginBottom: '20px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    },
    medalsTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    verifiedBadge: {
      backgroundColor: '#ebf8ff',
      color: settings.primaryColor,
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600'
    }
  };

  const renderSettingsContent = () => {
    switch(activeTab) {
      case 'text':
        return (
          <div style={styles.settingsContent}>
            <div style={styles.section}>
              <div style={styles.sectionTitle}>Widget title</div>
              <div style={styles.inputGroup}>
                <input
                  type="text"
                  value={settings.widgetTitle}
                  onChange={(e) => handleSettingChange('widgetTitle', e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.section}>
              <div style={styles.sectionTitle}>Widget subtitle</div>
              <div style={styles.inputGroup}>
                <input
                  type="text"
                  value={settings.widgetSubTitle}
                  onChange={(e) => handleSettingChange('widgetSubTitle', e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>  
                       <div style={styles.section}>
              <div style={styles.sectionTitle}>Write button text</div>
              <div style={styles.inputGroup}>
                <input
                  type="text"
                  value={settings.writeButtonText}
                  onChange={(e) => handleSettingChange('writeButtonText', e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.section}>
              <div style={styles.sectionTitle}>Cancel button text</div>
              <div style={styles.inputGroup}>
                <input
                  type="text"
                  value={settings.cancelButtonText}
                  onChange={(e) => handleSettingChange('cancelButtonText', e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>

           

            <div style={styles.section}>
              <div style={styles.sectionTitle}>Text header</div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Header (with reviews) label</label>
                <input
                  type="text"
                  value={settings.headerWithReviews}
                  onChange={(e) => handleSettingChange('headerWithReviews', e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Header (no reviews) label</label>
                <input
                  type="text"
                  value={settings.headerNoReviews}
                  onChange={(e) => handleSettingChange('headerNoReviews', e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div style={styles.settingsContent}>
            <div style={styles.section}>
              <div style={styles.sectionTitle}>
                Colors
                <button onClick={resetToDefault} style={styles.resetButton}>
                  Reset to default
                </button>
              </div>
              
              <div style={styles.colorGroup}>
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                  style={styles.colorInput}
                />
                <div style={styles.colorInfo}>
                  <div style={styles.colorLabel}>Primary color</div>
                  <div style={styles.colorCode}>{settings.primaryColor}</div>
                  <div style={styles.colorDescription}>
                    Used for buttons, links and interactive elements
                  </div>
                </div>
              </div>

              <div style={styles.colorGroup}>
                <input
                  type="color"
                  value={settings.starColor}
                  onChange={(e) => handleSettingChange('starColor', e.target.value)}
                  style={styles.colorInput}
                />
                <div style={styles.colorInfo}>
                  <div style={styles.colorLabel}>Star color</div>
                  <div style={styles.colorCode}>{settings.starColor}</div>
                  <div style={styles.colorDescription}>
                    Used only for star ratings in the Review Widget
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.section}>
              <div style={styles.sectionTitle}>Style Options</div>
              <div style={styles.inputGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={settings.roundCorners}
                    onChange={(e) => handleSettingChange('roundCorners', e.target.checked)}
                    style={styles.checkbox}
                  />
                  Round corners
                </label>
              </div>
            </div>

            <div style={styles.section}>
              <div style={styles.sectionTitle}>Photos and Videos</div>
              <div style={styles.inputGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={settings.showPhotosVideos}
                    onChange={(e) => handleSettingChange('showPhotosVideos', e.target.checked)}
                    style={styles.checkbox}
                  />
                  Show recent photos and videos in a grid
                </label>
              </div>
            </div>

            <div style={styles.section}>
              <div style={styles.sectionTitle}>Judge.me Medals</div>
              <div style={styles.inputGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={settings.showMedals}
                    onChange={(e) => handleSettingChange('showMedals', e.target.checked)}
                    style={styles.checkbox}
                  />
                  Show product medals
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.settingsPanel}>
        <div style={styles.header}>
         
          <h2 style={styles.headerTitle}>Customize Text</h2>
        </div>

        <div style={styles.tabContainer}>
          <button
            style={styles.tab(activeTab === 'text')}
            onClick={() => setActiveTab('text')}
          >
            Text
          </button>
          <button
            style={styles.tab(activeTab === 'appearance')}
            onClick={() => setActiveTab('appearance')}
          >
            Appearance
          </button>
        </div>

        {renderSettingsContent()}
      </div>

      <div style={styles.previewPanel}>
        <div style={styles.previewHeader}>Preview</div>
        
        <div style={styles.previewContainer}>
          <h3 style={styles.previewTitle}>{settings.widgetTitle}</h3>
          <p style={styles.previewSubtitle}>{ settings.widgetSubTitle}</p>

          <div style={styles.summaryCard}>
            <div style={styles.ratingSection}>
              <div style={styles.ratingStars}>★★★★★</div>
              <div style={styles.ratingNumber}>{settings.overallRating}</div>
              <div style={styles.reviewCount}>
                {settings.headerWithReviews.replace('{{ number_of_reviews }}', settings.totalReviews)}
              </div>
            </div>

            <div style={styles.breakdownSection}>
              {[5, 4, 3, 2, 1].map(rating => {
                const count = settings.ratingBreakdown[rating];
                const percentage = (count / settings.totalReviews) * 100;
                return (
                  <div key={rating} style={styles.ratingBar}>
                    <div style={styles.ratingLabel}>
                      {rating} {renderStars(rating)}
                    </div>
                    <div style={{ flex: 1, backgroundColor: '#e2e8f0', borderRadius: '3px', height: '6px' }}>
                      <div style={{
                        ...styles.ratingBarFill,
                        width: `${percentage}%`
                      }} />
                    </div>
                    <div style={styles.ratingCount}>{count}</div>
                  </div>
                );
              })}
            </div>

            <div style={styles.buttonSection}>
              <button style={styles.writeButton}>{settings.writeButtonText}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewWidgetSettings;