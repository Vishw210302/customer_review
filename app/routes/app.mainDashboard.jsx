import { useLoaderData, useNavigation } from '@remix-run/react';
import { Spinner } from '@shopify/polaris';
import React from 'react';
import CardsOfDashboard from './app.CardsOfDashboard';
import { authenticate } from '../shopify.server';

export async function loader({ request }) {

    const apiurl = process.env.API_URL;
    const url = new URL(request.url);
    const reviewType = url.searchParams.get('reviewType') || 'product';
    const searchQuery = url.searchParams.get('searchQuery') || '';
    const status = url.searchParams.get('status');
    const rating = url.searchParams.get('rating');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const { session } = await authenticate.admin(request);
    const shopName = session.shop

    try {
        const filterParams = new URLSearchParams();
        filterParams.append('reviewType', reviewType);
        if (searchQuery) filterParams.append('searchQuery', searchQuery);
        if (status !== null && status !== undefined) filterParams.append('status', status);
        if (rating) filterParams.append('rating', rating);
        filterParams.append('page', page.toString());
        filterParams.append('limit', limit.toString());

        const queryString = filterParams.toString();
        const endpoint = `${apiurl}/api/getallReview/${shopName}?${queryString}`;
        const storeEndpoint = `${apiurl}/api/storeReview/${shopName}`;

        const [response, storeResponse] = await Promise.all([
            fetch(endpoint, {
                headers: { 'ngrok-skip-browser-warning': true }
            }),
            fetch(storeEndpoint, {
                headers: { 'ngrok-skip-browser-warning': true }
            })
        ]);

        if (!response.ok) {
            console.error("API error:", response.status, response.statusText);
            return {
                success: false,
                reviews: [],
                pagination: { currentPage: 1, totalPages: 1 },
                reviewType,
                storeReviewData: null
            };
        }

        if (!storeResponse.ok) {
            console.error("Store API error:", storeResponse.status, storeResponse.statusText);
        }

        const data = await response.json();
        const storeReviewData = storeResponse.ok ? await storeResponse.json() : null;

        return {
            success: true,
            data: {
                averageRating: data.averageRating,
                reviews: data.reviews,
                pagination: {
                    totalReviews: data.totalReviews,
                    totalPages: data.totalPages,
                    currentPage: data.currentPage,
                    pageSize: data.pageSize
                },
                reviewType
            },
            storeReviewData
        };

    } catch (error) {
        console.error("Failed to fetch reviews:", error);
        return {
            success: false,
            data: {
                reviews: [],
                pagination: { currentPage: 1, totalPages: 1 },
                reviewType
            },
            storeReviewData: null
        };
    }
}

const MainDashboard = () => {

    const navigate = useNavigation();
    const isPageLoading = navigate.state === "loading";
    const { data, storeReviewData } = useLoaderData();

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

    const headerStyles = {
        container: {
            padding: '24px 32px',
            backgroundColor: 'white',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
        title: {
            fontSize: '24px',
            fontWeight: '700',
            margin: '0 0 8px 0',
        },
        subtitle: {
            fontSize: '16px',
            color: '#6B7280',
            margin: '0 0 16px 0',
        },
        actions: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        button: {
            backgroundColor: '#2563EB',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            fontWeight: '500',
            cursor: 'pointer',
            marginRight: '8px',
        },
        secondaryButton: {
            backgroundColor: 'white',
            color: '#4B5563',
            border: '1px solid #D1D5DB',
            padding: '8px 16px',
            borderRadius: '4px',
            fontWeight: '500',
            cursor: 'pointer',
        },
    };

    const layoutStyles = {
        container: {
            padding: '32px',
            backgroundColor: '#F3F4F6',
            minHeight: 'calc(100vh - 76px)',
        },
        row: {
            display: 'flex',
            flexWrap: 'wrap',
            margin: '0 -12px',
        },
        column: {
            padding: '0 12px',
            marginBottom: '24px',
        },
        full: {
            width: '100%',
        }
    };

    return (
        <div>
            <div style={headerStyles.container}>
                <h1 style={headerStyles.title}>Reviews Dashboard</h1>
                <p style={headerStyles.subtitle}>Monitor and manage customer feedback</p>
            </div>

            <div style={layoutStyles.container}>
                <CardsOfDashboard data={data} storeReviewData={storeReviewData} />
            </div>
        </div>
    );
};

export default MainDashboard;