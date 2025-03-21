import { useNavigation } from '@remix-run/react';
import { Spinner } from '@shopify/polaris';
import React from 'react'

const StoreReviewPreview = () => {

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
            <div>
                <p>Vishw Prajapati</p>
            </div>
        </>
    )
}

export default StoreReviewPreview