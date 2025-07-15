import { Button } from '@shopify/polaris';
import { Eye, Layout, Palette, Settings, Type } from 'lucide-react';
import { useState } from 'react';

const ReviewWidgetSettings = () => {

  const [activeTab, setActiveTab] = useState('general');
  const staticWidths = ["90%", "70%", "50%", "30%", "10%"];

  const [settings, setSettings] = useState({
    title: "Customer Reviews",
    subtitle: "See what our customers are saying about us",
    mainTitle: "What Our Customers Say",
    mainSubtitle: "Discover why our customers love our products and services",
    primaryColor: "#f59e0b",
    textColor: "#000000",
    writeButtonText: "#ffffff",
    buttonBackground: "#000000",
    buttonText: "Write a Review",
    showOverallReviews: true,
    titleFontSize: '18px',
    subTitleFontSize: '15px',
    starSize: '20px',
    starSpacing: '2px',
    borderRadius: 8
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <span
        key={index}
        style={{
          fontSize: settings.starSize,
          padding: `0 ${settings.starSpacing}`,
          color: index < rating ? settings.primaryColor : '#e1e1e1'
        }}
      >
        {index < rating ? '★' : '☆'}
      </span>
    ));
  };

  const reviewData = [
    {
      name: "Sarah J.",
      rating: 5,
      text: "This product exceeded all my expectations. The quality is outstanding, and it arrived earlier than expected!",
      date: "27/05/2025",
    },
    {
      name: "Michael T.",
      rating: 5,
      text: "Absolutely worth every penny. This has become an essential part of my daily routine.",
      date: "01/06/2025",
    },
    {
      name: "Elena R.",
      rating: 4,
      text: "Great product, very satisfied with my purchase. Would definitely recommend to friends.",
      date: "15/12/2024",
    }
  ];

  const ratingBreakdown = [
    { stars: 5, count: 8 },
    { stars: 4, count: 6 },
    { stars: 3, count: 5 },
    { stars: 2, count: 2 },
    { stars: 1, count: 3 }
  ];

  const getWidgetStyles = () => ({
    container: {
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      margin: "0 auto",
      color: settings.textColor
    },
    title: {
      fontSize: settings.titleFontSize,
      fontWeight: "700",
      color: settings.textColor,
      margin: "0 0 8px 0",
      textAlign: "center"
    },
    subtitle: {
      fontSize: settings.subTitleFontSize,
      color: settings.textColor,
      margin: 0,
      textAlign: "center"
    },
    reviewsSummary: {
      backgroundColor: '#ffffff',
      borderRadius: `${settings.borderRadius}px`,
      padding: "24px",
      marginBottom: "30px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "20px",
      marginTop: "20px"
    },
    overallRating: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    stars: {
      color: settings.primaryColor,
      fontSize: settings.starSize,
      letterSpacing: settings.starSpacing
    },
    ratingNumber: {
      fontSize: "18px",
      fontWeight: 700,
      marginTop: "8px",
      color: settings.textColor
    },
    reviewCount: {
      fontSize: "15px",
      color: settings.textColor,
      marginTop: "5px"
    },
    ratingBreakdown: {
      padding: "20px 0"
    },
    ratingBar: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "10px"
    },
    ratingLabelStar: {
      color: settings.primaryColor,
      fontSize: "16px",
      fontWeight: "600",
      minWidth: "80px"
    },
    ratingCount: {
      color: settings.textColor,
      fontSize: "14px"
    },
    writeReviewButton: {
      backgroundColor: settings.buttonBackground,
      color: settings.writeButtonText,
      border: "none",
      borderRadius: "50px",
      padding: "12px 24px",
      fontSize: "15px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
    },
    reviewContent: {
      textAlign: "left"
    },
    authorName: {
      fontSize: "17px",
      fontWeight: "600",
      color: settings.textColor,
      margin: "0 0 8px 0"
    },
    ratingStars: {
      color: settings.primaryColor,
      fontSize: "20px",
      margin: "10px 0",
      letterSpacing: "3px"
    },
    reviewText: {
      color: settings.textColor,
      fontSize: "15px",
      lineHeight: 1.7,
      margin: "12px 0"
    },
    reviewDate: {
      color: settings.textColor,
      fontSize: "15px",
    },
    allReviews: {
      display: "flex",
      justifyContent: "space-between"
    }
  });

  const tabStyle = (isActive) => ({
    flex: 1,
    padding: '12px 16px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: isActive ? '#3b82f6' : '#64748b',
    borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  });

  const inputStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '14px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '500',
    fontSize: '14px'
  };

  const selectStyle = {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    marginBottom: '1rem'
  };

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>

      {/* Settings Panel */}
      <div style={{
        width: '400px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        height: 'fit-content',
        position: 'sticky',
        top: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <Settings style={{ marginRight: '8px' }} />
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Widget Settings</h2>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          marginBottom: '20px',
          borderBottom: '1px solid #e2e8f0',
          gap: '0'
        }}>
          <button onClick={() => setActiveTab('general')} style={tabStyle(activeTab === 'general')}>
            <Settings size={16} />
            General
          </button>
          <button onClick={() => setActiveTab('style')} style={tabStyle(activeTab === 'style')}>
            <Palette size={16} />
            Style
          </button>
          <button onClick={() => setActiveTab('layout')} style={tabStyle(activeTab === 'layout')}>
            <Layout size={16} />
            Layout
          </button>
        </div>

        {/* General Tab */}
        {activeTab === 'general' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <Type size={16} style={{ display: 'inline', marginRight: '5px' }} />
                Title
              </label>
              <input
                type="text"
                value={settings.title}
                onChange={(e) => handleSettingChange('title', e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <Type size={16} style={{ display: 'inline', marginRight: '5px' }} />
                Subtitle
              </label>
              <input
                type="text"
                value={settings.subtitle}
                onChange={(e) => handleSettingChange('subtitle', e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <Type size={16} style={{ display: 'inline', marginRight: '5px' }} />
                Button Text
              </label>
              <input
                type="text"
                value={settings.buttonText}
                onChange={(e) => handleSettingChange('buttonText', e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <Type size={16} style={{ display: 'inline', marginRight: '5px' }} />
                Review Title
              </label>
              <input
                type="text"
                value={settings.mainTitle}
                onChange={(e) => handleSettingChange('mainTitle', e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <Type size={16} style={{ display: 'inline', marginRight: '5px' }} />
                Reviews Subtitle
              </label>
              <input
                type="text"
                value={settings.mainSubtitle}
                onChange={(e) => handleSettingChange('mainSubtitle', e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px', fontWeight: '500' }}>
                <input
                  type="checkbox"
                  checked={settings.showOverallReviews}
                  onChange={(e) => handleSettingChange('showOverallReviews', e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Show All Review Listing
              </label>
            </div>

            <Button variant="primary">
              Save Widget Settings
            </Button>
          </div>
        )}

        {/* Style Tab */}
        {activeTab === 'style' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <Palette size={16} style={{ display: 'inline', marginRight: '5px' }} />
                Text Color
              </label>
              <input
                type="color"
                value={settings.textColor}
                onChange={(e) => handleSettingChange('textColor', e.target.value)}
                style={{ ...inputStyle, height: '40px' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <Palette size={16} style={{ display: 'inline', marginRight: '5px' }} />
                Button Text Color
              </label>
              <input
                type="color"
                value={settings.writeButtonText}
                onChange={(e) => handleSettingChange('writeButtonText', e.target.value)}
                style={{ ...inputStyle, height: '40px' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <Palette size={16} style={{ display: 'inline', marginRight: '5px' }} />
                Button Background
              </label>
              <input
                type="color"
                value={settings.buttonBackground}
                onChange={(e) => handleSettingChange('buttonBackground', e.target.value)}
                style={{ ...inputStyle, height: '40px' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <Palette size={16} style={{ display: 'inline', marginRight: '5px' }} />
                Star Color
              </label>
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                style={{ ...inputStyle, height: '40px' }}
              />
            </div>
          </div>
        )}

        {/* Layout Tab */}
        {activeTab === 'layout' && (
          <div>
            <div>
              <label style={labelStyle}>Title Font Size</label>
              <select
                value={settings.titleFontSize}
                onChange={(e) => handleSettingChange('titleFontSize', e.target.value)}
                style={selectStyle}
              >
                <option value="14px">Extra Small (14px)</option>
                <option value="16px">Small (16px)</option>
                <option value="18px">Medium (18px)</option>
                <option value="20px">Large (20px)</option>
                <option value="22px">Extra Large (22px)</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Subtitle Font Size</label>
              <select
                value={settings.subTitleFontSize}
                onChange={(e) => handleSettingChange('subTitleFontSize', e.target.value)}
                style={selectStyle}
              >
                <option value="12px">Extra Small (12px)</option>
                <option value="14px">Small (14px)</option>
                <option value="15px">Medium (15px)</option>
                <option value="16px">Large (16px)</option>
                <option value="18px">Extra Large (18px)</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Star Size</label>
              <select
                value={settings.starSize}
                onChange={(e) => handleSettingChange('starSize', e.target.value)}
                style={selectStyle}
              >
                <option value="16px">Small (16px)</option>
                <option value="18px">Medium (18px)</option>
                <option value="20px">Large (20px)</option>
                <option value="24px">Extra Large (24px)</option>
                <option value="28px">Huge (28px)</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Star Spacing</label>
              <select
                value={settings.starSpacing}
                onChange={(e) => handleSettingChange('starSpacing', e.target.value)}
                style={selectStyle}
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

      {/* Preview */}
      <div style={{ flex: 1, minWidth: '600px' }}>
        <div style={{ padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <Eye size={20} style={{ marginRight: '8px' }} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Live Preview</h3>
          </div>

          <div style={getWidgetStyles().container}>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={getWidgetStyles().title}>{settings.title}</h3>
              <p style={getWidgetStyles().subtitle}>{settings.subtitle}</p>
            </div>

            <div style={getWidgetStyles().reviewsSummary}>
              <div style={getWidgetStyles().overallRating}>
                <div style={getWidgetStyles().stars}>★★★★★</div>
                <div style={getWidgetStyles().ratingNumber}>4.50 out of 5</div>
                <div style={getWidgetStyles().reviewCount}>Based on 24 reviews</div>
              </div>

              <div style={getWidgetStyles().ratingBreakdown}>
                {ratingBreakdown.map((item, index) => (
                  <div key={index} style={getWidgetStyles().ratingBar}>
                    <div style={getWidgetStyles().ratingLabelStar}>
                      {renderStars(item.stars)}
                    </div>
                    <div style={{
                      width: "100px",
                      height: "8px",
                      backgroundColor: "#e1e1e1",
                      borderRadius: "4px",
                      margin: "0 10px",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}>
                      <div
                        style={{
                          width: staticWidths[index],
                          height: "100%",
                          backgroundColor: settings.primaryColor,
                        }}
                      />
                    </div>
                    <div style={getWidgetStyles().ratingCount}>{item.count}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button style={getWidgetStyles().writeReviewButton}>
                  {settings.buttonText}
                </button>
              </div>
            </div>

            {settings.showOverallReviews && (
              <div style={{ display: "flex", flexDirection: "column", marginTop: "20px" }}>
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                  <h1 style={{ fontSize: settings.titleFontSize, fontWeight: '700', margin: '0', color: settings.textColor }}>
                    {settings.mainTitle}
                  </h1>
                  <p style={{ fontSize: settings.subTitleFontSize, color: settings.textColor, margin: '8px 0 24px 0' }}>
                    {settings.mainSubtitle}
                  </p>
                </div>

                {reviewData.map((review, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: `${settings.borderRadius}px`,
                      padding: "24px",
                      borderTop: "1px solid #8080802b",
                      borderBottom: "1px solid #8080802b",
                    }}
                  >
                    <div style={getWidgetStyles().allReviews}>
                      <div style={getWidgetStyles().reviewContent}>
                        <h4 style={getWidgetStyles().authorName}>{review.name}</h4>
                        <div style={getWidgetStyles().ratingStars}>{renderStars(review.rating)}</div>
                        <p style={getWidgetStyles().reviewText}>{review.text}</p>
                      </div>
                      <div>
                        <p style={getWidgetStyles().reviewDate}>{review.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ReviewWidgetSettings;