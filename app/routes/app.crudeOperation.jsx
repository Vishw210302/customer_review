import { useLoaderData, useSubmit } from '@remix-run/react';
import {
  AppProvider,
  Card,
  Frame,
  LegacyStack,
  Page,
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
  const nameSearch = url.searchParams.get('name') || '';
  const emailSearch = url.searchParams.get('email') || '';
  const status = url.searchParams.get('status');
  const rating = url.searchParams.get('rating');
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);

  let reviewsResponse = {
    success: false,
    reviews: [],
    pagination: { currentPage: 1, totalPages: 1 },
    reviewType
  };

  let storeReviewsResponse = {
    success: false,
    storeReviews: [],
    pagination: { currentPage: 1, totalPages: 1 }
  };

  try {
    const filterParams = new URLSearchParams();
    if (searchQuery) filterParams.append('searchQuery', searchQuery);
    if (nameSearch) filterParams.append('name', nameSearch);
    if (emailSearch) filterParams.append('email', emailSearch);
    if (status !== null && status !== undefined) filterParams.append('status', status);
    if (rating) filterParams.append('rating', rating);
    filterParams.append('page', page.toString());
    filterParams.append('limit', limit.toString());

    const queryString = filterParams.toString();
    const endpoint = `${APIURL}/api/getallReview?${queryString}`;

    const response = await fetch(endpoint, {
      headers: { 'ngrok-skip-browser-warning': true }
    });

    if (response.ok) {
      const data = await response.json();
      reviewsResponse = {
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
    } else {
      console.error("API error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
  }

  try {
    const storeReviewFilterParams = new URLSearchParams();
    if (nameSearch) storeReviewFilterParams.append('name', nameSearch);
    if (emailSearch) storeReviewFilterParams.append('email', emailSearch);
    storeReviewFilterParams.append('page', page.toString());
    storeReviewFilterParams.append('limit', limit.toString());

    const storeReviewEndpoint = `${APIURL}/api/storeReview?${storeReviewFilterParams.toString()}`;

    const storeResponse = await fetch(storeReviewEndpoint, {
      headers: { 'ngrok-skip-browser-warning': true }
    });

    if (storeResponse.ok) {
      const storeData = await storeResponse.json();

      storeReviewsResponse = {
        success: true,
        storeReviews: storeData.reviews || [],
        storePagination: storeData.pagination || {
          currentPage: page,
          totalPages: storeData.totalPages || 1
        },
      };
    } else {
      console.error("Store API error:", storeResponse.status, storeResponse.statusText);
    }
  } catch (error) {
    console.error("Failed to fetch store reviews:", error);
  }

  return {
    ...reviewsResponse,
    ...storeReviewsResponse,
    APIURL
  };
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
  const {
    reviews,
    pagination,
    reviewType,
    storeReviews,
    storePagination,
    success,
    APIURL
  } = useLoaderData();
  const submit = useSubmit();
  const [selectedTab, setSelectedTab] = useState(0);
  const [toast, setToast] = useState({ active: false, message: '', error: false });

  const updateStoreReviewStatus = async (reviewId, newStatus) => {
    try {
      const response = await fetch(`${APIURL}/api/storeReview/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': true
        },
        body: JSON.stringify({ isActive: newStatus })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const responseData = await response.json();

      if (!responseData || !responseData.updatedReview) {
        throw new Error('Review not found or could not be updated');
      }

      return {
        success: true,
        updatedReview: responseData.updatedReview
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update review status'
      };
    }
  };

  const deleteStoreReview = async (reviewId) => {
    try {
      const response = await fetch(`${APIURL}/api/deleteReview/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'ngrok-skip-browser-warning': true
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to delete review'
      };
    }
  };

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
    params.delete('searchQuery');
    params.delete('status');
    params.delete('rating');

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
                <StoreReviewListing
                  storeReviews={storeReviews}
                  pagination={storePagination}
                  reviewType={reviewType}
                  success={success}
                  updateStoreReviewStatus={updateStoreReviewStatus}
                  deleteStoreReview={deleteStoreReview}
                />
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