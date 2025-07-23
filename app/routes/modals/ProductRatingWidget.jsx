import { useLoaderData } from '@remix-run/react';
import { Button } from '@shopify/polaris';
import { Eye, Layout, Palette, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

const TABS = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'style', label: 'Style', icon: Palette },
    { id: 'layout', label: 'Layout', icon: Layout }
];

const SELECT_OPTIONS = {
    titleFontSize: [
        { value: '12px', label: 'Extra Small (12px)' },
        { value: '14px', label: 'Small (14px)' },
        { value: '15px', label: 'Medium (15px)' },
        { value: '16px', label: 'Large (16px)' },
        { value: '18px', label: 'Extra Large (18px)' }
    ],
    starSize: [
        { value: '16px', label: 'Small (16px)' },
        { value: '18px', label: 'Medium (18px)' },
        { value: '20px', label: 'Large (20px)' },
        { value: '24px', label: 'Extra Large (24px)' },
        { value: '28px', label: 'Huge (28px)' }
    ],
    countFontSize: [
        { value: '12px', label: 'Extra Small (12px)' },
        { value: '14px', label: 'Small (14px)' },
        { value: '16px', label: 'Medium (16px)' },
        { value: '18px', label: 'Large (18px)' }
    ],
    gap: [
        { value: '4px', label: 'Small (4px)' },
        { value: '6px', label: 'Medium (6px)' },
        { value: '8px', label: 'Large (8px)' },
        { value: '12px', label: 'Extra Large (12px)' }
    ],
    padding: [
        { value: '0px', label: 'none' },
        { value: '12px', label: 'Medium (12px)' },
        { value: '16px', label: 'Large (16px)' },
        { value: '20px', label: 'Extra Large (20px)' }
    ],
    fontWeight: [
        { value: '400', label: 'Normal (400)' },
        { value: '500', label: 'Medium (500)' },
        { value: '600', label: 'Semi Bold (600)' },
        { value: '700', label: 'Bold (700)' }
    ],
    alignment: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
    ]
};

const STYLES = {
    container: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f8fafc'
    },
    settingsPanel: {
        width: '400px',
        backgroundColor: 'white',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        overflowY: 'auto'
    },
    header: {
        padding: '1.5rem',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb'
    },
    headerTitle: {
        margin: 0,
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: '#1f2937',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    tabNav: {
        display: 'flex',
        borderBottom: '1px solid #e5e7eb'
    },
    tabButton: {
        flex: 1,
        padding: '0.75rem',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.25rem'
    },
    tabContent: {
        padding: '1.5rem'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    label: {
        display: 'block',
        marginBottom: '0.5rem',
        fontWeight: '500'
    },
    input: {
        width: '100%',
        padding: '0.5rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.375rem',
        fontSize: '0.875rem'
    },
    colorInput: {
        width: '100%',
        height: '40px',
        border: '1px solid #d1d5db',
        borderRadius: '0.375rem'
    },
    previewPanel: {
        flex: 1,
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#f1f5f9'
    },
    previewHeader: {
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#64748b',
        fontSize: '1.125rem',
        fontWeight: '500'
    },
    previewContainer: {
        maxWidth: '600px',
        width: '100%'
    },
    loadingMessage: {
        backgroundColor: '#e1f5fe',
        color: '#0277bd',
        padding: '10px',
        border: '1px solid #b3e5fc',
        borderRadius: '4px',
        marginBottom: '1rem',
        textAlign: 'center'
    }
};

function ProductRatingSettings() {

    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const { shopData } = useLoaderData();
    const [settings, setSettings] = useState({});
    const storeName = shopData?.myshopifyDomain;

    const fetchRatingConfig = async () => {
        setFetchLoading(true);
        try {
            const response = await fetch(`https://def94b3b3985.ngrok-free.app/api/ratingConfig/${storeName}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'abcdefg',
                    'ngrok-skip-browser-warning': true,
                }
            });
            const detailsData = await response.json();
            setSettings(detailsData?.data);
        } catch (error) {
            console.error('Error fetching rating config:', error);
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => {
        fetchRatingConfig();
    }, []);

    const saveSettings = async () => {
        setLoading(true);
        try {
            await fetch(`https://def94b3b3985.ngrok-free.app/api/ratingConfig/${storeName}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'abcdefg',
                    'ngrok-skip-browser-warning': true,
                },
                body: JSON.stringify(settings)
            });
        } catch (error) {
            console.error('Error saving settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const getPreviewStyles = () => ({
        container: {
            padding: settings.padding,
            backgroundColor: settings.backgroundColor
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
        count: {
            color: settings.countColor,
            fontSize: settings.countFontSize,
            fontWeight: settings.countWeight
        }
    });

    const renderStars = () => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span
                    key={i}
                    style={{
                        fontSize: settings.starSize,
                        padding: '0 2px',
                        color: i < 4 ? settings.starColor : settings.emptyStarColor
                    }}
                    aria-hidden="true"
                >
                    {i < 4 ? '★' : '☆'}
                </span>
            );
        }
        return stars;
    };

    const renderFormField = (type, key, label, options = null) => (
        <div key={key}>
            <label style={STYLES.label}>{label}</label>
            {type === 'text' && (
                <input
                    type="text"
                    value={settings[key] || ''}
                    onChange={e => handleChange(key, e.target.value)}
                    style={{ ...STYLES.input, marginBottom: '10px' }}
                />
            )}
            {type === 'color' && (
                <input
                    type="color"
                    value={settings[key] || '#000000'}
                    onChange={e => handleChange(key, e.target.value)}
                    style={STYLES.colorInput}
                />
            )}
            {type === 'select' && (
                <select
                    value={settings[key] || ''}
                    onChange={e => handleChange(key, e.target.value)}
                    style={STYLES.input}
                >
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div style={STYLES.formGroup}>
                        {renderFormField('text', 'titleText', 'Title Text')}
                        {fetchLoading && (
                            <div style={STYLES.loadingMessage}>
                                Loading configuration...
                            </div>
                        )}
                        <Button
                            variant="primary"
                            onClick={saveSettings}
                            loading={loading}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Product Rating Setting'}
                        </Button>
                    </div>
                );
            case 'style':
                return (
                    <div style={STYLES.formGroup}>
                        {renderFormField('color', 'starColor', 'Star')}
                        {renderFormField('color', 'emptyStarColor', 'Empty Star')}
                        {renderFormField('color', 'titleColor', 'Title')}
                        {renderFormField('color', 'countColor', 'Count')}
                        {/* {renderFormField('color', 'backgroundColor', 'Background')} */}
                        <Button
                            variant="primary"
                            onClick={saveSettings}
                            loading={loading}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Product Rating Setting'}
                        </Button>
                    </div>

                );
            case 'layout':
                return (
                    <div style={STYLES.formGroup}>
                        {renderFormField('select', 'alignment', 'Alignment', SELECT_OPTIONS.alignment)}
                        {renderFormField('select', 'titleFontSize', 'Title Font Size', SELECT_OPTIONS.titleFontSize)}
                        {renderFormField('select', 'starSize', 'Star Size', SELECT_OPTIONS.starSize)}
                        {renderFormField('select', 'countFontSize', 'Count Font Size', SELECT_OPTIONS.countFontSize)}
                        {renderFormField('select', 'gap', 'Element Gap', SELECT_OPTIONS.gap)}
                        {renderFormField('select', 'padding', 'Widget Padding', SELECT_OPTIONS.padding)}
                        {renderFormField('select', 'titleWeight', 'Title Font Weight', SELECT_OPTIONS.fontWeight)}
                        {renderFormField('select', 'countWeight', 'Count Font Weight', SELECT_OPTIONS.fontWeight)}
                        <Button
                            variant="primary"
                            onClick={saveSettings}
                            loading={loading}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Product Rating Setting'}
                        </Button>
                    </div>

                );
            default:
                return null;
        }
    };

    const previewStyles = getPreviewStyles();

    return (
        <div style={STYLES.container}>
            <div style={STYLES.settingsPanel}>
                <div style={STYLES.header}>
                    <h2 style={STYLES.headerTitle}>
                        <Settings size={20} />
                        Product Rating Settings
                    </h2>
                </div>

                <div style={STYLES.tabNav}>
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                ...STYLES.tabButton,
                                backgroundColor: activeTab === tab.id ? '#f3f4f6' : 'transparent',
                                color: activeTab === tab.id ? '#1f2937' : '#6b7280'
                            }}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div style={STYLES.tabContent}>
                    {renderTabContent()}
                </div>
            </div>

            <div style={STYLES.previewPanel}>
                <div style={STYLES.previewHeader}>
                    <Eye size={20} />
                    Live Preview
                </div>

                <div style={STYLES.previewContainer}>
                    <div style={previewStyles.container}>
                        <div style={previewStyles.content}>
                            <span style={previewStyles.title}>
                                {settings.titleText}
                            </span>
                            <div style={{ display: 'inline-flex' }}>
                                {renderStars()}
                            </div>
                            <span style={previewStyles.count}>
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