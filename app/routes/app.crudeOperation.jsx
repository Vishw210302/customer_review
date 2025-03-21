import { useLoaderData, useNavigation, useSubmit } from '@remix-run/react';
import {
  AppProvider,
  Card,
  Frame,
  LegacyStack,
  Page,
  Spinner,
  Tabs,
  Toast
} from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import React, { useCallback, useEffect, useState } from 'react';
import ProductReview from './app.productReview';
import StoreReviewListing from './app.StoreReviewListing';
import CollectionReviewListing from './CollectionReviewListing';

export async function loader({ request }) {

  const APIURL = process.env.API_URL;
  const url = new URL(request.url);
  const reviewType = url.searchParams.get('reviewType') || 'product';
  const searchQuery = url.searchParams.get('searchQuery') || '';
  const status = url.searchParams.get('status');
  const rating = url.searchParams.get('rating');
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);

  try {
    const filterParams = new URLSearchParams();
    filterParams.append('reviewType', reviewType);
    if (searchQuery) filterParams.append('searchQuery', searchQuery);
    if (status !== null && status !== undefined) filterParams.append('status', status);
    if (rating) filterParams.append('rating', rating);
    filterParams.append('page', page.toString());
    filterParams.append('limit', limit.toString());

    const queryString = filterParams.toString();
    const endpoint = `${APIURL}/api/getallReview?${queryString}`;

    const response = await fetch(endpoint, {
      headers: { 'ngrok-skip-browser-warning': true }
    });

    if (!response.ok) {
      console.error("API error:", response.status, response.statusText);
      return {
        success: false,
        reviews: [],
        pagination: { currentPage: 1, totalPages: 1 },
        reviewType
      };
    }

    const data = await response.json();

    return {
      success: true,
      reviews: data.reviews,
      pagination: {
        totalReviews: data.totalReviews,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        pageSize: data.pageSize
      },
      reviewType
    };

  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return {
      success: false,
      reviews: [],
      pagination: { currentPage: 1, totalPages: 1 },
      reviewType
    };
  }
}

export async function action({ request }) {
  const APIURL = process.env.API_URL;
  const formData = await request.formData();
  const actionType = formData.get('actionType');
  const reviewType = formData.get('reviewType') || 'product';

  if (actionType === 'deleteReview') {
    const reviewId = formData.get('reviewId');

    try {
      const response = await fetch(`${APIURL}/api/deleteReview/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'ngrok-skip-browser-warning': true,
          'X-Review-Type': reviewType
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `Failed to delete review. Status: ${response.status}, Message: ${errorText}`,
          reviewType
        };
      }
      return { success: true, actionType: 'deleteReview', reviewType };
    } catch (error) {
      return {
        success: false,
        error: `Network error: ${error.message}`,
        reviewType
      };
    }
  } else if (actionType === 'updateStatus') {
    const reviewId = formData.get('reviewId');
    const newStatus = formData.get('newStatus') === 'true';

    try {
      const response = await fetch(`${APIURL}/api/updateReview/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': true,
          'X-Review-Type': reviewType
        },
        body: JSON.stringify({ isActive: newStatus })
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `Failed to update review status. Status: ${response.status}, Message: ${errorText}`,
          reviewType
        };
      }
      return { success: true, actionType: 'updateStatus', reviewType };
    } catch (error) {
      return {
        success: false,
        error: `Network error: ${error.message}`,
        reviewType
      };
    }
  }

  return { success: false, error: 'Invalid action type', reviewType };
}

function ReviewsManager() {

  const { reviews, pagination, reviewType } = useLoaderData();
  const submit = useSubmit();
  const [selectedTab, setSelectedTab] = useState(0);
  const [toast, setToast] = useState({ active: false, message: '', error: false });
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

  useEffect(() => {
    const tabMap = { 'product': 0, 'collection': 1, 'store': 2 };
    setSelectedTab(tabMap[reviewType] || 0);
  }, [reviewType]);

  const handleTabChange = useCallback((selectedTabIndex) => {
    setSelectedTab(selectedTabIndex);
    const tabTypeMap = { 0: 'product', 1: 'collection', 2: 'store' };
    const newType = tabTypeMap[selectedTabIndex];

    const params = new URLSearchParams(window.location.search);
    params.set('reviewType', newType);
    params.set('page', '1');

    submit(params, {
      method: 'get',
      replace: true,
      preventScrollReset: true
    });
  }, [submit]);

  const toggleToast = () => {
    setToast({ ...toast, active: false });
  };

  const handleDeleteSuccess = () => {
    setToast({
      active: true,
      message: 'Review deleted successfully',
      error: false
    });
  };

  const handleStatusChangeSuccess = (isActive) => {
    setToast({
      active: true,
      message: `Review status changed to ${isActive ? 'Active' : 'Inactive'}`,
      error: false
    });
  };

  const tabs = [
    {
      id: 'product-reviews',
      content: 'Product Reviews',
      panelID: 'product-reviews-content',
    },
    {
      id: 'collection-reviews',
      content: 'Collection Reviews',
      panelID: 'collection-reviews-content',
    },
    {
      id: 'store-reviews',
      content: 'Store Reviews',
      panelID: 'store-reviews-content',
    },
  ];

  return (
    <AppProvider>
      <Frame>
        <Page fullWidth title="Reviews Management Dashboard">
          <Card>
            <Tabs
              tabs={tabs}
              selected={selectedTab}
              onSelect={handleTabChange}
              fitted
            />
            <LegacyStack vertical>
              {selectedTab === 0 && (
                <ProductReview
                  reviews={reviews}
                  pagination={pagination}
                  submit={submit}
                  onDeleteSuccess={handleDeleteSuccess}
                  onStatusChangeSuccess={handleStatusChangeSuccess}
                />
              )}
              {selectedTab === 1 && (
                <CollectionReviewListing />
              )}
              {selectedTab === 2 && (
                <StoreReviewListing />
              )}
            </LegacyStack>
          </Card>

          {toast.active && (
            <Toast
              content={toast.message}
              error={toast.error}
              onDismiss={toggleToast}
            />
          )}
        </Page>
      </Frame>
    </AppProvider>
  );
}

export default ReviewsManager;