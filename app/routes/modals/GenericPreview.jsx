import { useLoaderData } from '@remix-run/react';
import { Button } from '@shopify/polaris';
import { CheckCircle, Eye, Layout, Loader2, Palette, Settings, Type, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

const ReviewWidgetSettings = () => {

  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingSettings, setIsFetchingSettings] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const staticWidths = ["90%", "70%", "50%", "30%", "10%"];
  const { shopData } = useLoaderData();
  const storeName = shopData?.myshopifyDomain;
  const [settings, setSettings] = useState({});

  const Toast = ({ message, type, onClose }) => {
    const toastStyles = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '16px 20px',
      borderRadius: '8px',
      color: 'white',
      fontSize: '14px',
      fontWeight: '500',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      minWidth: '300px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      animation: 'slideIn 0.3s ease-out',
      backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'
    };

    useEffect(() => {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }, [onClose]);

    return (
      <div style={toastStyles}>
        {type === 'success' && <CheckCircle size={18} />}
        {type === 'error' && <XCircle size={18} />}
        {type === 'info' && <Loader2 size={18} />}
        <span>{message}</span>
        <style>
          {`
            @keyframes slideIn {
              from {
                transform: translateX(100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
          `}
        </style>
      </div>
    );
  };

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: '' });
  };

  const fetchRatingConfig = async () => {
    setIsFetchingSettings(true);
    try {
      const response = await fetch(`https://def94b3b3985.ngrok-free.app/api/reviewSettings/${storeName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'abcdefg',
          'ngrok-skip-browser-warning': true,
        }
      });

      const detailsData = await response.json();

      if (response.ok && detailsData?.data) {
        const { _id, __v, createdAt, updatedAt, ...cleanData } = detailsData.data;
        setSettings(cleanData);
      } else {
        throw new Error(detailsData?.message || 'Failed to load settings');
      }
    } catch (error) {
      showToast(`Error loading settings: ${error.message}`, 'error');
    } finally {
      setIsFetchingSettings(false);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {

      const { _id, __v, createdAt, updatedAt, ...settingsToSave } = settings;

      const response = await fetch(`https://def94b3b3985.ngrok-free.app/api/reviewSettings/${storeName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'abcdefg',
          'ngrok-skip-browser-warning': true,
        },
        body: JSON.stringify(settingsToSave)
      });

      const result = await response.json();

      if (response.ok) {
        showToast('Widget settings saved successfully!', 'success');
      } else {
        throw new Error(result?.message || 'Failed to save settings');
      }
    } catch (error) {
      showToast(`Error saving settings: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (storeName) {
      fetchRatingConfig();
    }
  }, [storeName]);

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
          fontSize: settings.starSize || '18px',
          padding: `0 ${settings.starSpacing || '2px'}`,
          color: index < rating ? (settings.primaryColor || '#ffc107') : '#e1e1e1'
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
      color: settings.textColor || '#333'
    },
    title: {
      fontSize: settings.titleFontSize || '18px',
      fontWeight: "700",
      color: settings.textColor || '#333',
      margin: "0 0 8px 0",
      textAlign: "center"
    },
    subtitle: {
      fontSize: settings.subTitleFontSize || '15px',
      color: settings.textColor || '#333',
      margin: 0,
      textAlign: "center"
    },
    reviewsSummary: {
      backgroundColor: '#ffffff',
      borderRadius: `${settings.borderRadius || 8}px`,
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
      color: settings.primaryColor || '#ffc107',
      fontSize: settings.starSize || '18px',
      letterSpacing: settings.starSpacing || '2px'
    },
    ratingNumber: {
      fontSize: "18px",
      fontWeight: 700,
      marginTop: "8px",
      color: settings.textColor || '#333'
    },
    reviewCount: {
      fontSize: "15px",
      color: settings.textColor || '#333',
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
      color: settings.primaryColor || '#ffc107',
      fontSize: "16px",
      fontWeight: "600",
      minWidth: "80px"
    },
    ratingCount: {
      color: settings.textColor || '#333',
      fontSize: "14px"
    },
    writeReviewButton: {
      backgroundColor: settings.buttonBackground || '#007bff',
      color: settings.writeButtonText || '#ffffff',
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
      color: settings.textColor || '#333',
      margin: "0 0 8px 0"
    },
    ratingStars: {
      color: settings.primaryColor || '#ffc107',
      fontSize: "20px",
      margin: "10px 0",
      letterSpacing: "3px"
    },
    reviewText: {
      color: settings.textColor || '#333',
      fontSize: "15px",
      lineHeight: 1.7,
      margin: "12px 0"
    },
    reviewDate: {
      color: settings.textColor || '#333',
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

  const LoadingOverlay = () => (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '12px',
      zIndex: 10
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '14px', color: '#64748b' }}>Loading settings...</span>
      </div>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

      <div style={{
        width: '400px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        height: 'fit-content',
        position: 'sticky',
        top: '20px',
        position: 'relative'
      }}>
        {isFetchingSettings && <LoadingOverlay />}

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <Settings style={{ marginRight: '8px' }} />
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Widget Settings</h2>
        </div>

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

        {activeTab === 'general' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <Type size={16} style={{ display: 'inline', marginRight: '5px' }} />
                Title
              </label>
              <input
                type="text"
                value={settings.title || ''}
                onChange={(e) => handleSettingChange('title', e.target.value)}
                style={inputStyle}
                disabled={isFetchingSettings}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <Type size={16} style={{ display: 'inline', marginRight: '5px' }} />
                Subtitle
              </label>
              <input
                type="text"
                value={settings.subtitle || ''}
                onChange={(e) => handleSettingChange('subtitle', e.target.value)}
                style={inputStyle}
                disabled={isFetchingSettings}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <Type size={16} style={{ display: 'inline', marginRight: '5px' }} />
                Button Text
              </label>
              <input
                type="text"
                value={settings.buttonText || ''}
                onChange={(e) => handleSettingChange('buttonText', e.target.value)}
                style={inputStyle}
                disabled={isFetchingSettings}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <Type size={16} style={{ display: 'inline', marginRight: '5px' }} />
                Review Title
              </label>
              <input
                type="text"
                value={settings.mainTitle || ''}
                onChange={(e) => handleSettingChange('mainTitle', e.target.value)}
                style={inputStyle}
                disabled={isFetchingSettings}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <Type size={16} style={{ display: 'inline', marginRight: '5px' }} />
                Reviews Subtitle
              </label>
              <input
                type="text"
                value={settings.mainSubtitle || ''}
                onChange={(e) => handleSettingChange('mainSubtitle', e.target.value)}
                style={inputStyle}
                disabled={isFetchingSettings}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px', fontWeight: '500' }}>
                <input
                  type="checkbox"
                  checked={settings.showOverallReviews || false}
                  onChange={(e) => handleSettingChange('showOverallReviews', e.target.checked)}
                  style={{ marginRight: '8px' }}
                  disabled={isFetchingSettings}
                />
                Show All Review Listing
              </label>
            </div>

            <Button
              variant="primary"
              onClick={saveSettings}
              loading={isLoading}
              disabled={isLoading || isFetchingSettings}
            >
              {isLoading ? 'Saving...' : 'Save Widget Settings'}
            </Button>
          </div>
        )}

        {activeTab === 'style' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <Palette size={16} style={{ display: 'inline', marginRight: '5px' }} />
                Text Color
              </label>
              <input
                type="color"
                value={settings.textColor || '#333333'}
                onChange={(e) => handleSettingChange('textColor', e.target.value)}
                style={{ ...inputStyle, height: '40px' }}
                disabled={isFetchingSettings}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <Palette size={16} style={{ display: 'inline', marginRight: '5px' }} />
                Button Text Color
              </label>
              <input
                type="color"
                value={settings.writeButtonText || '#ffffff'}
                onChange={(e) => handleSettingChange('writeButtonText', e.target.value)}
                style={{ ...inputStyle, height: '40px' }}
                disabled={isFetchingSettings}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <Palette size={16} style={{ display: 'inline', marginRight: '5px' }} />
                Button Background
              </label>
              <input
                type="color"
                value={settings.buttonBackground || '#007bff'}
                onChange={(e) => handleSettingChange('buttonBackground', e.target.value)}
                style={{ ...inputStyle, height: '40px' }}
                disabled={isFetchingSettings}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <Palette size={16} style={{ display: 'inline', marginRight: '5px' }} />
                Star Color
              </label>
              <input
                type="color"
                value={settings.primaryColor || '#ffc107'}
                onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                style={{ ...inputStyle, height: '40px' }}
                disabled={isFetchingSettings}
              />
            </div>

            <Button
              variant="primary"
              onClick={saveSettings}
              loading={isLoading}
              disabled={isLoading || isFetchingSettings}
            >
              {isLoading ? 'Saving...' : 'Save Widget Settings'}
            </Button>
          </div>
        )}

        {activeTab === 'layout' && (
          <div>
            <div>
              <label style={labelStyle}>Title Font Size</label>
              <select
                value={settings.titleFontSize || '18px'}
                onChange={(e) => handleSettingChange('titleFontSize', e.target.value)}
                style={selectStyle}
                disabled={isFetchingSettings}
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
                value={settings.subTitleFontSize || '15px'}
                onChange={(e) => handleSettingChange('subTitleFontSize', e.target.value)}
                style={selectStyle}
                disabled={isFetchingSettings}
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
                value={settings.starSize || '18px'}
                onChange={(e) => handleSettingChange('starSize', e.target.value)}
                style={selectStyle}
                disabled={isFetchingSettings}
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
                value={settings.starSpacing || '2px'}
                onChange={(e) => handleSettingChange('starSpacing', e.target.value)}
                style={selectStyle}
                disabled={isFetchingSettings}
              >
                <option value="0px">None (0px)</option>
                <option value="1px">Tight (1px)</option>
                <option value="2px">Normal (2px)</option>
                <option value="3px">Loose (3px)</option>
                <option value="4px">Extra Loose (4px)</option>
              </select>
            </div>

            <Button
              variant="primary"
              onClick={saveSettings}
              loading={isLoading}
              disabled={isLoading || isFetchingSettings}
            >
              {isLoading ? 'Saving...' : 'Save Widget Settings'}
            </Button>
          </div>
        )}
      </div>

      <div style={{ flex: 1, minWidth: '600px' }}>
        <div style={{ padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <Eye size={20} style={{ marginRight: '8px' }} />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Live Preview</h3>
          </div>

          <div style={getWidgetStyles().container}>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={getWidgetStyles().title}>{settings.title || 'Widget Title'}</h3>
              <p style={getWidgetStyles().subtitle}>{settings.subtitle || 'Widget Subtitle'}</p>
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
                          backgroundColor: settings.primaryColor || '#ffc107',
                        }}
                      />
                    </div>
                    <div style={getWidgetStyles().ratingCount}>{item.count}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button style={getWidgetStyles().writeReviewButton}>
                  {settings.buttonText || 'Write a Review'}
                </button>
              </div>
            </div>

            {settings.showOverallReviews && (
              <div style={{ display: "flex", flexDirection: "column", marginTop: "20px" }}>
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                  <h1 style={{ fontSize: settings.titleFontSize || '18px', fontWeight: '700', margin: '0', color: settings.textColor || '#333' }}>
                    {settings.mainTitle || 'Customer Reviews'}
                  </h1>
                  <p style={{ fontSize: settings.subTitleFontSize || '15px', color: settings.textColor || '#333', margin: '8px 0 24px 0' }}>
                    {settings.mainSubtitle || 'See what our customers are saying'}
                  </p>
                </div>

                {reviewData.map((review, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: `${settings.borderRadius || 8}px`,
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