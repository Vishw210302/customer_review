import { Star, Settings, Palette, Type, Eye, Layout } from 'lucide-react';
import React, { useState } from 'react';

function ProductRatingSettings() {
    const [settings, setSettings] = useState({
        // General Settings
        titleText: 'Customer Rating',
        rating: 4,
        totalReviews: 42,
       
        
        // Style Settings
        starColor: '#ff9d2d',
        emptyStarColor: '#d1d5db',
        titleColor: '#2d3748',
        countColor: '#4a5568',
        backgroundColor: '#ffffff',
     
        
        
        // Layout Settings
        alignment: 'center',
        titleFontSize: '15px',
        starSize: '20px',
        countFontSize: '14px',
        gap: '8px',
        padding: '12px',
        titleWeight: '600',
        countWeight: '500',
        showCountBackground: false,
        countBackgroundColor: '#edf2f7',
        countBorderRadius: '12px',
        
        // Advanced Settings
        starSpacing: '2px',
        countPadding: '3px 8px',
        showBorder: false,
        borderColor: '#e2e8f0',
        borderWidth: '1px'
    });

    const [activeTab, setActiveTab] = useState('general');

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <span
                key={index}
                style={{
                    fontSize: settings.starSize,
                    padding: `0 ${settings.starSpacing}`,
                    color: index < rating ? settings.starColor : settings.emptyStarColor
                }}
                aria-hidden="true"
            >
                {index < rating ? '★' : '☆'}
            </span>
        ));
    };

    const getPreviewStyles = () => ({
        container: {
            padding: settings.padding,
            
            backgroundColor: settings.backgroundColor,
            borderRadius: settings.borderRadius,
            border: settings.showBorder ? `${settings.borderWidth} solid ${settings.borderColor}` : 'none'
        },
        content: {
            display: 'flex',
            alignItems: 'center',
            gap: settings.gap,
            justifyContent: settings.alignment
        },
        title: {
            fontWeight: settings.titleWeight,
            color: settings.titleColor,
            fontSize: settings.titleFontSize,
            margin: 0
        },
        starsContainer: {
            display: 'inline-flex'
        },
        count: {
            color: settings.countColor,
            fontSize: settings.countFontSize,
            fontWeight: settings.countWeight,
            backgroundColor: settings.showCountBackground ? settings.countBackgroundColor : 'transparent',
            padding: settings.showCountBackground ? settings.countPadding : '0',
            borderRadius: settings.showCountBackground ? settings.countBorderRadius : '0'
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
                        Product Rating Settings
                    </h2>
                </div>

                {/* Tab Navigation */}
                <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
                    {[
                        { id: 'general', label: 'General', icon: Settings },
                        { id: 'style', label: 'Style', icon: Palette },
                        { id: 'layout', label: 'Layout', icon: Layout }
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
                                    Title Text
                                </label>
                                <input
                                    type="text"
                                    value={settings.titleText}
                                    onChange={(e) => updateSetting('titleText', e.target.value)}
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
                                        checked={settings.showCountBackground}
                                        onChange={(e) => updateSetting('showCountBackground', e.target.checked)}
                                    />
                                    Show Count Background
                                </label>
                            </div>

                           
                        </div>
                    )}

                    {activeTab === 'style' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                                    Empty Star
                                </label>
                                <input
                                    type="color"
                                    value={settings.emptyStarColor}
                                    onChange={(e) => updateSetting('emptyStarColor', e.target.value)}
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
                                    Title
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
                                    Count
                                </label>
                                <input
                                    type="color"
                                    value={settings.countColor}
                                    onChange={(e) => updateSetting('countColor', e.target.value)}
                                    style={{
                                        width: '100%',
                                        height: '40px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem'
                                    }}
                                />
                            </div>

                            

                            {settings.showCountBackground && (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                        Count Background
                                    </label>
                                    <input
                                        type="color"
                                        value={settings.countBackgroundColor}
                                        onChange={(e) => updateSetting('countBackgroundColor', e.target.value)}
                                        style={{
                                            width: '100%',
                                            height: '40px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.375rem'
                                        }}
                                    />
                                </div>
                            )}

                           

                          

                          
                        </div>
                    )}

                    {activeTab === 'layout' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Alignment
                                </label>
                                <select
                                    value={settings.alignment}
                                    onChange={(e) => updateSetting('alignment', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    <option value="flex-start">Left</option>
                                    <option value="center">Center</option>
                                    <option value="flex-end">Right</option>
                                    <option value="space-between">Space Between</option>
                                </select>
                            </div>

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
                                    Count Font Size
                                </label>
                                <select
                                    value={settings.countFontSize}
                                    onChange={(e) => updateSetting('countFontSize', e.target.value)}
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
                                    <option value="16px">Medium (16px)</option>
                                    <option value="18px">Large (18px)</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Element Gap
                                </label>
                                <select
                                    value={settings.gap}
                                    onChange={(e) => updateSetting('gap', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    <option value="4px">Small (4px)</option>
                                    <option value="6px">Medium (6px)</option>
                                    <option value="8px">Large (8px)</option>
                                    <option value="12px">Extra Large (12px)</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Widget Padding
                                </label>
                                <select
                                    value={settings.padding}
                                    onChange={(e) => updateSetting('padding', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    <option value="8px">Small (8px)</option>
                                    <option value="12px">Medium (12px)</option>
                                    <option value="16px">Large (16px)</option>
                                    <option value="20px">Extra Large (20px)</option>
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

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Title Font Weight
                                </label>
                                <select
                                    value={settings.titleWeight}
                                    onChange={(e) => updateSetting('titleWeight', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    <option value="400">Normal (400)</option>
                                    <option value="500">Medium (500)</option>
                                    <option value="600">Semi Bold (600)</option>
                                    <option value="700">Bold (700)</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                    Count Font Weight
                                </label>
                                <select
                                    value={settings.countWeight}
                                    onChange={(e) => updateSetting('countWeight', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    <option value="400">Normal (400)</option>
                                    <option value="500">Medium (500)</option>
                                    <option value="600">Semi Bold (600)</option>
                                    <option value="700">Bold (700)</option>
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
                        <div style={styles.content}>
                            <span style={styles.title}>
                                {settings.titleText}
                            </span>

                            <div style={{ display: 'inline-flex' }}>
                        <span style={{ fontSize: '20px', padding: '0 2px', color: settings.starColor  }} aria-hidden="true">★</span>
                        <span style={{ fontSize: '20px', padding: '0 2px', color: settings.starColor  }} aria-hidden="true">★</span>
                        <span style={{ fontSize: '20px', padding: '0 2px', color: settings.starColor  }} aria-hidden="true">★</span>
                        <span style={{ fontSize: '20px', padding: '0 2px', color: settings.starColor  }} aria-hidden="true">★</span>
                        <span style={{ fontSize: '20px', padding: '0 2px', color: settings.emptyStarColor }} aria-hidden="true">☆</span>
                    </div>

                           
                                <span style={styles.count}>
                                    (42)
                                </span>
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductRatingSettings;