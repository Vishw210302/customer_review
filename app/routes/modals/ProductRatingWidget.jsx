import { useNavigation } from '@remix-run/react';
import { Spinner } from '@shopify/polaris';
import React from 'react';

const ProductRatingWidget = () => {

    const navigate = useNavigation();
    const isPageLoading = navigate.state === "loading";

    if (isPageLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#e3e3e3",
                    height: "100vh",
                }}
            >
                <Spinner accessibilityLabel="Loading widgets" size="large" />
            </div>
        );
    }

    return (
        <>
            <div style={{ padding: '12px', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent:'center'
                }}>
                    <span style={{
                        fontWeight: '600',
                        color: '#2d3748',
                        fontSize: '15px'
                    }}>
                        Customer Rating
                    </span>

                    <div style={{ display: 'inline-flex' }}>
                        <span style={{ fontSize: '20px', padding: '0 2px', color: '#ff9d2d' }} aria-hidden="true">★</span>
                        <span style={{ fontSize: '20px', padding: '0 2px', color: '#ff9d2d' }} aria-hidden="true">★</span>
                        <span style={{ fontSize: '20px', padding: '0 2px', color: '#ff9d2d' }} aria-hidden="true">★</span>
                        <span style={{ fontSize: '20px', padding: '0 2px', color: '#ff9d2d' }} aria-hidden="true">★</span>
                        <span style={{ fontSize: '20px', padding: '0 2px', color: '#d1d5db' }} aria-hidden="true">☆</span>
                    </div>

                    <span style={{
                        color: '#4a5568',
                        fontSize: '14px',
                        fontWeight: '500',
                        // backgroundColor: '#edf2f7',
                        padding: '3px 8px',
                        borderRadius: '12px'
                    }}>
                        (42)
                    </span>
                </div>

            </div>
        </>
    );
};

export default ProductRatingWidget;