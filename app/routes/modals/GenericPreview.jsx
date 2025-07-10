import React, { useState, useEffect } from 'react';
import { Settings, Star, Type, Palette, Layout, Timer, Users, Eye } from 'lucide-react';

const ReviewWidgetSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    title: "Customer Reviews",
    subtitle: "See what our customers are saying about us",
    mainTitle: "What Our Customers Say",
  mainSubtitle: "Discover why our customers love our products and services",
    primaryColor: "#f59e0b",
    showRatingBreakdown: true,   
    
    buttonText: "Write a Review",
    
    showOverallRating: true,
    
  
    
  });

  const [activeReview, setActiveReview] = useState(0);

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
    { stars: 5, count: 802 },
    { stars: 4, count: 12 },
    { stars: 3, count: 5 },
    { stars: 2, count: 2 },
    { stars: 1, count: 3 }
  ];

  useEffect(() => {
   
      const intervalId = setInterval(() => {
        setActiveReview((prev) => (prev + 1) % 3);
      }, 5000 );
      return () => clearInterval(intervalId);

  },);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getWidgetStyles = () => ({
    container: {
      padding: "20px",
      
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      margin: "0 auto",
      color: '#2d3748'
    },
    title: {
      fontSize: "20px",
      fontWeight: "700",
      color: '#2d3748',
      margin: "0 0 8px 0",
      textAlign: "center"
    },
    subtitle: {
      fontSize: "15px",
      color: '#718096',
      margin: 0,
      textAlign: "center"
    },
    reviewsSummary: {
      backgroundColor: '#ffffff',
      borderRadius: `${settings.borderRadius}px`,
      padding: "24px",
      
      marginBottom: "30px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      marginTop: "20px"
    },
    overallRating: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      borderBottom: "1px solid #e2e8f0",
      paddingBottom: "20px"
    },
    stars: {
      color: settings.primaryColor,
      fontSize: "28px",
      letterSpacing: "3px"
    },
    allReviews: {
      display:"flex",
      justifyContent:"space-between"
    },
    ratingNumber: {
      fontSize: "24px",
      fontWeight: 700,
      marginTop: "8px",
      color: '#2d3749'
    },
    reviewCount: {
      fontSize: "15px",
      color: '#718096',
      marginTop: "5px"
    },
    ratingBreakdown: {
      width: "100%",
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
      minWidth: "120px"
    },
    ratingCount: {
      color: '#718096',
      fontSize: "14px"
    },
    writeReviewButton: {
      backgroundColor:'#000000',
      color: '#ffffff',
      border: "none",
      borderRadius: "50px",
      padding: "12px 24px",
      fontSize: "15px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
    },
    reviewsContainer: {
      position: "relative",
      minHeight: "180px",
      display: "flex",
      overflow: "hidden"
    },
    reviewCard: (index) => ({
      backgroundColor:'#ffffff',
      borderRadius: `${settings.borderRadius}px`,
      padding: "24px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      flexShrink: 0,
      width: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      transition: "all 0.5s ease",
      transform: `translateX(${(index - activeReview) * 100}%)`,
      opacity: index === activeReview ? 1 : 0.7,
      pointerEvents: index === activeReview ? "auto" : "none"
    }),
    reviewContent: {
      textAlign: "left"
    },
    authorName: {
      fontSize: "17px",
      fontWeight: "600",
      color: '#2d3748',
      margin: "0 0 8px 0"
    },
    ratingStars: {
      color: settings.primaryColor,
      fontSize: "20px",
      margin: "10px 0",
      letterSpacing: "3px"
    },
    reviewText: {
      color:'#4a5568',
      fontSize: "15px",
      lineHeight: 1.7,
      margin: "12px 0",
      
      display: "inline-block"
    },
    reviewDate:{
      color:'#4a5568',
        fontSize: "15px",
    },
    paginationContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: "24px",
      gap: "8px"
    },
    paginationDot: (isActive) => ({
      width: isActive ? "30px" : "10px",
      height: "10px",
      borderRadius: isActive ? "5px" : "50%",
      backgroundColor: isActive ? settings.primaryColor : `${settings.primaryColor}30`,
      cursor: "pointer",
      transition: "all 0.3s ease"
    })
  });

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
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
          <button
            onClick={() => setActiveTab('general')}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: activeTab === 'general' ? '#3b82f6' : '#64748b',
              borderBottom: activeTab === 'general' ? '2px solid #3b82f6' : '2px solid transparent',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Settings size={16} />
            General
          </button>
          <button
            onClick={() => setActiveTab('style')}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: activeTab === 'style' ? '#3b82f6' : '#64748b',
              borderBottom: activeTab === 'style' ? '2px solid #3b82f6' : '2px solid transparent',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Palette size={16} />
            Style
          </button>
          <button
            onClick={() => setActiveTab('layout')}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: activeTab === 'layout' ? '#3b82f6' : '#64748b',
              borderBottom: activeTab === 'layout' ? '2px solid #3b82f6' : '2px solid transparent',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Layout size={16} />
            Layout
          </button>
        </div>

        {/* General Tab */}
        {activeTab === 'general' && (
          <div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
            <Type size={16} style={{ display: 'inline', marginRight: '5px' }} />
            Title
          </label>
          <input
            type="text"
            value={settings.title}
            onChange={(e) => handleSettingChange('title', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
            <Type size={16} style={{ display: 'inline', marginRight: '5px' }} />
            Subtitle
          </label>
          <input
            type="text"
            value={settings.subtitle}
            onChange={(e) => handleSettingChange('subtitle', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>

       

        

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
            <Type size={16} style={{ display: 'inline', marginRight: '5px' }} />
            Button Text
          </label>
          <input
            type="text"
            value={settings.buttonText}
            onChange={(e) => handleSettingChange('buttonText', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>

       

        <div style={{ marginBottom: '20px' }}>
  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
    <Type size={16} style={{ display: 'inline', marginRight: '5px' }} />
    Main Title
  </label>
  <input
    type="text"
    value={settings.mainTitle}
    onChange={(e) => handleSettingChange('mainTitle', e.target.value)}
    style={{
      width: '100%',
      padding: '8px',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      fontSize: '14px'
    }}
  />
</div>

<div style={{ marginBottom: '20px' }}>
  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
    <Type size={16} style={{ display: 'inline', marginRight: '5px' }} />
    Main Subtitle
  </label>
  <input
    type="textarea"
    value={settings.mainSubtitle}
    onChange={(e) => handleSettingChange('mainSubtitle', e.target.value)}
    style={{
      width: '100%',
      padding: '8px',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      fontSize: '14px'
    }}
  />
</div>

        
        
          </div>
        )}

        {/* Style Tab */}
        {activeTab === 'style' && (
          <div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
            <Palette size={16} style={{ display: 'inline', marginRight: '5px' }} />
            Star Color
          </label>
          <input
            type="color"
            value={settings.primaryColor}
            onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
            style={{
              width: '100%',
              padding: '4px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              height: '40px'
            }}
          />
        </div>

       

       

       
       
          </div>
        )}

        {/* Layout Tab */}
        {activeTab === 'layout' && (
          <div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px', fontWeight: '500' }}>
            <input
              type="checkbox"
              checked={settings.showOverallRating}
              onChange={(e) => handleSettingChange('showOverallRating', e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Show Overall Rating
          </label>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px', fontWeight: '500' }}>
            <input
              type="checkbox"
              checked={settings.showRatingBreakdown}
              onChange={(e) => handleSettingChange('showRatingBreakdown', e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Show Rating Breakdown
          </label>
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
              {settings.showOverallRating && (
              <div style={getWidgetStyles().overallRating}>
                    <div style={getWidgetStyles().stars}>★★★★★</div>
                    <div style={getWidgetStyles().ratingNumber}>5</div>
                    <div style={getWidgetStyles().reviewCount}>From 834 reviews</div>
                </div>
              )}

              {settings.showRatingBreakdown && (
                <div style={getWidgetStyles().ratingBreakdown}>
                  {ratingBreakdown.map((item, index) => (
                    <div key={index} style={getWidgetStyles().ratingBar}>
                      <div style={getWidgetStyles().ratingLabelStar}>
                        {item.stars} {renderStars(item.stars)}
                      </div>
                      <div style={getWidgetStyles().ratingCount}>{item.count}</div>
                    </div>
                  ))}
                </div>
              )}

             
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                  <button style={getWidgetStyles().writeReviewButton}>
                    {settings.buttonText}
                  </button>
                </div>
              
            </div>



           <div style={{
  display: "flex",
  flexDirection: "column",

  marginTop: "20px"
}}>
  <div style={{ marginBottom: '20px', textAlign: 'center' }}>
  <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0', color: '#2d3748' }}>
    {settings.mainTitle || "What Our Customers Say"}
  </h1>
  <p style={{ fontSize: '16px', color: '#718096', margin: '8px 0 24px 0' }}>
    {settings.mainSubtitle || "Discover why our customers love our products and services"}
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
        <p style={getWidgetStyles().reviewText}>
          {review.text}
        </p>
      </div>
      <div className='reiview-date'>
         <p style={getWidgetStyles().reviewDate}>
          {review.date}
        </p>
        </div>
        </div>
    </div>
  ))}
</div>

          
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewWidgetSettings;