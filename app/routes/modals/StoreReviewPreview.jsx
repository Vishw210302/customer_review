import { useLoaderData } from '@remix-run/react';
import { Button } from '@shopify/polaris';
import { Eye, Palette, Settings, Type } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const FONT_SIZE_OPTIONS = [
    { value: '12px', label: 'Extra Small (12px)' },
    { value: '14px', label: 'Small (14px)' },
    { value: '15px', label: 'Medium (15px)' },
    { value: '16px', label: 'Large (16px)' },
    { value: '18px', label: 'Extra Large (18px)' },
    { value: '20px', label: 'Large (20px)' },
    { value: '22px', label: 'Extra Large (22px)' }
];

const STAR_SIZE_OPTIONS = [
    { value: '16px', label: 'Small (16px)' },
    { value: '18px', label: 'Medium (18px)' },
    { value: '20px', label: 'Large (20px)' },
    { value: '24px', label: 'Extra Large (24px)' },
    { value: '28px', label: 'Huge (28px)' }
];

const STAR_SPACING_OPTIONS = [
    { value: '0px', label: 'None (0px)' },
    { value: '1px', label: 'Tight (1px)' },
    { value: '2px', label: 'Normal (2px)' },
    { value: '3px', label: 'Loose (3px)' },
    { value: '4px', label: 'Extra Loose (4px)' }
];

const SAMPLE_REVIEWS = [
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

const TABS = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'style', label: 'Style', icon: Palette },
    { id: 'layout', label: 'Layout', icon: Type }
];

const InputField = ({ label, value, onChange, type = 'text', placeholder }) => (
    <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            {label}
        </label>
        <input
            type={type}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            style={{
                width: '100%',
                height: type === 'color' ? '40px' : 'auto',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                boxSizing: 'border-box'
            }}
        />
    </div>
);

const SelectField = ({ label, value, onChange, options }) => (
    <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            {label}
        </label>
        <select
            value={value || ''}
            onChange={onChange}
            style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
            }}
        >
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

const CheckboxField = ({ label, checked, onChange }) => (
    <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
            <input
                type="checkbox"
                checked={checked || false}
                onChange={onChange}
            />
            {label}
        </label>
    </div>
);

function StoreReviewSettings() {

    const [settings, setSettings] = useState({ data: {} });
    const [isLoading, setIsLoading] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const { shopData, apiUrl } = useLoaderData();
    const storeName = shopData?.myshopifyDomain;
    const [activeTab, setActiveTab] = useState('general');

    const updateSetting = useCallback((key, value) => {
        setSettings(prev => ({
            ...prev,
            data: {
                ...prev.data,
                [key]: value
            }
        }));
    }, []);

    const renderStars = useCallback((rating) => {
        return Array.from({ length: 5 }).map((_, index) => (
            <span
                key={index}
                style={{
                    color: index < rating ? settings.data?.starColor || '#fbbf24' : '#D1D5DB',
                    fontSize: settings.data?.starSize || '18px',
                    marginRight: settings.data?.starSpacing || '2px',
                }}
            >
                ★
            </span>
        ));
    }, [settings.data?.starColor, settings.data?.starSize, settings.data?.starSpacing]);

    const fetchRatingConfig = useCallback(async () => {
        if (!storeName || !apiUrl) {
            console.error('Store name or API URL not found');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/api/storeReviewSetting/${storeName}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'abcdefg',
                    'ngrok-skip-browser-warning': true,
                }
            });
            const detailsData = await response.json();
            if (detailsData) {
                setSettings(detailsData);
            }
        } catch (error) {
            console.error('Error fetching rating config:', error);
        }
    }, [storeName, apiUrl]);

    const saveSettings = async () => {
        if (!storeName) {
            setSaveMessage('Error: Store name not found');
            return;
        }

        if (!apiUrl) {
            setSaveMessage('Error: API URL not configured');
            return;
        }

        setIsLoading(true);
        setSaveMessage('');

        try {
            const response = await fetch(`${apiUrl}/api/storeReviewSetting/${storeName}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'abcdefg',
                    'ngrok-skip-browser-warning': true,
                },
                body: JSON.stringify(settings.data)
            });

            if (response.ok) {
                setSaveMessage('Settings saved successfully!');
                await fetchRatingConfig();

                setTimeout(() => setSaveMessage(''), 3000);
            } else {
                throw new Error('Failed to save settings');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            setSaveMessage('Error saving settings. Please try again.');
            setTimeout(() => setSaveMessage(''), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRatingConfig();
    }, [fetchRatingConfig]);

    const renderGeneralTab = useMemo(() => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <InputField
                label="Title"
                value={settings.data?.title}
                onChange={(e) => updateSetting('title', e.target.value)}
            />
            <InputField
                label="Button Text"
                value={settings.data?.buttonText}
                onChange={(e) => updateSetting('buttonText', e.target.value)}
            />
            <CheckboxField
                label="Show Recent Reviews"
                checked={settings.data?.showRecentReviews}
                onChange={(e) => updateSetting('showRecentReviews', e.target.checked)}
            />
            <CheckboxField
                label="Show Review Dates"
                checked={settings.data?.showReviewDates}
                onChange={(e) => updateSetting('showReviewDates', e.target.checked)}
            />
            <CheckboxField
                label="Show Review Images"
                checked={settings.data?.showReviewImage}
                onChange={(e) => updateSetting('showReviewImage', e.target.checked)}
            />
            <CheckboxField
                label="Show Review Email"
                checked={settings.data?.showReviewEmail}
                onChange={(e) => updateSetting('showReviewEmail', e.target.checked)}
            />

            {saveMessage && (
                <div style={{
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    backgroundColor: saveMessage.includes('Error') ? '#fee2e2' : '#d1fae5',
                    color: saveMessage.includes('Error') ? '#dc2626' : '#059669',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                }}>
                    {saveMessage}
                </div>
            )}

            <Button
                variant="primary"
                onClick={saveSettings}
                disabled={isLoading}
            >
                {isLoading ? 'Saving...' : 'Save Store Widget Settings'}
            </Button>
        </div>
    ), [settings.data, updateSetting, saveSettings, isLoading, saveMessage]);

    const renderStyleTab = useMemo(() => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <InputField
                label="Button Background"
                value={settings.data?.primaryColor}
                onChange={(e) => updateSetting('primaryColor', e.target.value)}
                type="color"
            />
            <InputField
                label="Button Text Color"
                value={settings.data?.writeButtonTextColor}
                onChange={(e) => updateSetting('writeButtonTextColor', e.target.value)}
                type="color"
            />
            <InputField
                label="Star Color"
                value={settings.data?.starColor}
                onChange={(e) => updateSetting('starColor', e.target.value)}
                type="color"
            />
            <InputField
                label="Text Color"
                value={settings.data?.textColor}
                onChange={(e) => updateSetting('textColor', e.target.value)}
                type="color"
            />
            <InputField
                label="Date Color"
                value={settings.data?.dateColor}
                onChange={(e) => updateSetting('dateColor', e.target.value)}
                type="color"
            />
            <InputField
                label="Title Color"
                value={settings.data?.titleColor}
                onChange={(e) => updateSetting('titleColor', e.target.value)}
                type="color"
            />
            <InputField
                label="Background Color"
                value={settings.data?.backgroundColor}
                onChange={(e) => updateSetting('backgroundColor', e.target.value)}
                type="color"
            />

            {saveMessage && (
                <div style={{
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    backgroundColor: saveMessage.includes('Error') ? '#fee2e2' : '#d1fae5',
                    color: saveMessage.includes('Error') ? '#dc2626' : '#059669',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                }}>
                    {saveMessage}
                </div>
            )}

            <Button
                variant="primary"
                onClick={saveSettings}
                disabled={isLoading}
            >
                {isLoading ? 'Saving...' : 'Save Store Widget Settings'}
            </Button>
        </div>
    ), [settings.data, updateSetting, saveSettings, isLoading, saveMessage]);

    const renderLayoutTab = useMemo(() => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <SelectField
                label="Title Font Size"
                value={settings.data?.titleFontSize}
                onChange={(e) => updateSetting('titleFontSize', e.target.value)}
                options={FONT_SIZE_OPTIONS}
            />
            <SelectField
                label="Subtitle Font Size"
                value={settings.data?.subTitleFontSize}
                onChange={(e) => updateSetting('subTitleFontSize', e.target.value)}
                options={FONT_SIZE_OPTIONS}
            />
            <SelectField
                label="Reviewer Name Font Size"
                value={settings.data?.reviewNameFontSize}
                onChange={(e) => updateSetting('reviewNameFontSize', e.target.value)}
                options={FONT_SIZE_OPTIONS}
            />
            <SelectField
                label="Review Title Font Size"
                value={settings.data?.reviewTitleFontSize}
                onChange={(e) => updateSetting('reviewTitleFontSize', e.target.value)}
                options={FONT_SIZE_OPTIONS}
            />
            <SelectField
                label="Review Message Font Size"
                value={settings.data?.reviewMessageFontSize}
                onChange={(e) => updateSetting('reviewMessageFontSize', e.target.value)}
                options={FONT_SIZE_OPTIONS}
            />
            <SelectField
                label="Star Size"
                value={settings.data?.starSize}
                onChange={(e) => updateSetting('starSize', e.target.value)}
                options={STAR_SIZE_OPTIONS}
            />
            <SelectField
                label="Star Spacing"
                value={settings.data?.starSpacing}
                onChange={(e) => updateSetting('starSpacing', e.target.value)}
                options={STAR_SPACING_OPTIONS}
            />

            {saveMessage && (
                <div style={{
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    backgroundColor: saveMessage.includes('Error') ? '#fee2e2' : '#d1fae5',
                    color: saveMessage.includes('Error') ? '#dc2626' : '#059669',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                }}>
                    {saveMessage}
                </div>
            )}

            <Button
                variant="primary"
                onClick={saveSettings}
                disabled={isLoading}
            >
                {isLoading ? 'Saving...' : 'Save Store Widget Settings'}
            </Button>
        </div>
    ), [settings.data, updateSetting, saveSettings, isLoading, saveMessage]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return renderGeneralTab;
            case 'style':
                return renderStyleTab;
            case 'layout':
                return renderLayoutTab;
            default:
                return renderGeneralTab;
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
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

                <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
                    {TABS.map(tab => (
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
                    {renderTabContent()}
                </div>
            </div>

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
                    <div style={{
                        width: '100%',
                        backgroundColor: settings.data?.backgroundColor || '#ffffff',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                    }}>
                        <div style={{ padding: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: "column" }}>
                                <div>
                                    <h2 style={{
                                        fontSize: settings.data?.titleFontSize || '16px',
                                        fontWeight: 'bold',
                                        color: settings.data?.textColor || '#000000',
                                        margin: 0,
                                        textAlign: "center",
                                    }}>
                                        {settings.data?.title || 'Customer Reviews'}
                                    </h2>
                                    <p style={{
                                        fontSize: settings.data?.subTitleFontSize || '14px',
                                        color: settings.data?.textColor || '#000000',
                                        marginTop: "5px",
                                        textAlign: "center",
                                    }}>
                                        {settings.data?.totalReviewsBased || 'Based on customer reviews'}
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginTop: '5px',
                                        justifyContent: "center",
                                    }}>
                                        {renderStars(4)}
                                    </div>
                                </div>
                                <button style={{
                                    backgroundColor: settings.data?.primaryColor || '#3b82f6',
                                    color: settings.data?.writeButtonTextColor || '#ffffff',
                                    padding: '0.625rem 1.25rem',
                                    borderRadius: '50px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    marginTop: "5px",
                                }}>
                                    {settings.data?.buttonText || 'Write a Review'}
                                </button>
                            </div>
                        </div>

                        {settings.data?.showRecentReviews && (
                            <div style={{
                                padding: '1.25rem',
                                backgroundColor: '#f9fafb'
                            }}>
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                                    gap: "1.5rem",
                                    width: "100%"
                                }}>
                                    {SAMPLE_REVIEWS.map((review, index) => (
                                        <div key={index} style={{
                                            backgroundColor: settings.data?.backgroundColor || '#ffffff',
                                            boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
                                            padding: "1rem",
                                            borderRadius: "0.5rem"
                                        }}>
                                            <div>
                                                <h4 style={{
                                                    fontWeight: 'bold',
                                                    color: settings.data?.textColor || '#000000',
                                                    fontSize: settings.data?.reviewNameFontSize || '14px',
                                                    margin: '0 0 0.25rem 0'
                                                }}>
                                                    {review.name}
                                                </h4>

                                                {settings.data?.showReviewEmail && (
                                                    <p style={{
                                                        fontSize: "13px",
                                                        color: "#6b7280",
                                                        fontWeight: "500",
                                                        margin: '0 0 5px 0'
                                                    }}>
                                                        {review.email}
                                                    </p>
                                                )}

                                                <div style={{ marginBottom: '5px' }}>
                                                    {renderStars(review.rating)}
                                                </div>
                                            </div>

                                            <p style={{
                                                color: settings.data?.titleColor || '#000000',
                                                fontWeight: "bold",
                                                fontSize: settings.data?.reviewTitleFontSize || '14px',
                                                margin: '0 0 5px 0'
                                            }}>
                                                {review.title}
                                            </p>
                                            <p style={{
                                                color: settings.data?.textColor || '#000000',
                                                fontSize: settings.data?.reviewMessageFontSize || '14px',
                                                margin: '0 0 10px 0',
                                                lineHeight: '1.5'
                                            }}>
                                                {review.message}
                                            </p>

                                            {settings.data?.showReviewImage && (
                                                <div style={{ display: "flex", flexWrap: "wrap", width: "100%", gap: "5px" }}>
                                                    <div style={{
                                                        width: '40%',
                                                        height: '120px',
                                                        borderRadius: '0.375rem',
                                                        backgroundColor: '#f3f4f6',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        marginBottom: '0.75rem',
                                                        color: '#9ca3af',
                                                        fontSize: '0.875rem'
                                                    }}>
                                                        Product Image
                                                    </div>
                                                    <div style={{
                                                        width: '40%',
                                                        height: '120px',
                                                        borderRadius: '0.375rem',
                                                        backgroundColor: '#f3f4f6',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        marginBottom: '0.75rem',
                                                        color: '#9ca3af',
                                                        fontSize: '0.875rem'
                                                    }}>
                                                        Product Image
                                                    </div>
                                                </div>
                                            )}

                                            {settings.data?.showReviewDates && (
                                                <p style={{
                                                    fontSize: settings.data?.subTitleFontSize || '12px',
                                                    color: settings.data?.dateColor || '#6b7280',
                                                    margin: 0
                                                }}>
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