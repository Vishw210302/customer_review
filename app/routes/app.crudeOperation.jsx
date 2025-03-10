import { useLoaderData, useSubmit } from '@remix-run/react';
import {
  AppProvider,
  Badge,
  Button,
  Card,
  DataTable,
  Frame,
  Page,
  Pagination,
  Select,
  Text,
  Toast
} from '@shopify/polaris';
import { DeleteIcon } from '@shopify/polaris-icons';
import '@shopify/polaris/build/esm/styles.css';
import React, { useState } from 'react';
import DeleteButtonModal from './modals/DeleteButtonModal';

export async function loader() {
  try {
    const response = await fetch("https://5605-122-164-16-245.ngrok-free.app/api/getallReview")
    if (!response.ok) {
      console.error("API error:", response.status, response.statusText);
      return { success: false, reviews: [] };
    }
    const data = await response.json();
    return { success: true, reviews: data.reviews };
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return { success: false, reviews: [] };
  }
}

export async function action({ request }) {
  const formData = await request.formData();
  const actionType = formData.get('actionType');

  if (actionType === 'deleteReview') {
    const reviewId = formData.get('reviewId');

    try {
      const response = await fetch(`https://5605-122-164-16-245.ngrok-free.app/api/deleteReview/${reviewId}`, {
        method: 'DELETE',
        headers: { 'ngrok-skip-browser-warning': true }
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `Failed to delete review. Status: ${response.status}, Message: ${errorText}`
        };
      }
      return { success: true, actionType: 'deleteReview' };
    } catch (error) {
      return {
        success: false,
        error: `Network error: ${error.message}`
      };
    }
  } else if (actionType === 'updateStatus') {
    const reviewId = formData.get('reviewId');
    const newStatus = formData.get('newStatus') === 'true';

    try {
      const response = await fetch(`https://5605-122-164-16-245.ngrok-free.app/api/updateReview/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': true
        },
        body: JSON.stringify({ isActive: newStatus })
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `Failed to update review status. Status: ${response.status}, Message: ${errorText}`
        };
      }
      return { success: true, actionType: 'updateStatus' };
    } catch (error) {
      return {
        success: false,
        error: `Network error: ${error.message}`
      };
    }
  }

  return { success: false, error: 'Invalid action type' };
}

function CustomerReviewsManager() {

  const { reviews } = useLoaderData();
  const submit = useSubmit();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState({ active: false, message: '', error: false });
  const [reviewStatuses, setReviewStatuses] = useState(
    reviews.reduce((acc, review) => {
      acc[review._id] = review.isActive;
      return acc;
    }, {})
  );
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = reviews.slice(indexOfFirstItem, indexOfLastItem);

  const handleDeleteModalOpen = (id) => {
    setSelectedReviewId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setSelectedReviewId(null);
  };

  const handleDeleteReview = () => {
    const formData = new FormData();
    formData.append('reviewId', selectedReviewId);
    formData.append('actionType', 'deleteReview');

    submit(formData, {
      method: 'DELETE',
    });

    setToast({
      active: true,
      message: 'Review deleted successfully',
      error: false
    });

    handleDeleteModalClose();
  };

  const handleStatusChange = (reviewId, newStatus) => {
    const isActive = newStatus === 'true';

    const formData = new FormData();
    formData.append('reviewId', reviewId);
    formData.append('newStatus', newStatus);
    formData.append('actionType', 'updateStatus');

    submit(formData, {
      method: 'PUT',
    });

    setReviewStatuses(prev => ({
      ...prev,
      [reviewId]: isActive
    }));

    setToast({
      active: true,
      message: `Review status changed to ${isActive ? 'Active' : 'Inactive'}`,
      error: false
    });
  };

  const toggleToast = () => {
    setToast({ ...toast, active: false });
  };

  const getRatingColor = (rating) => {
    if (typeof rating === 'number') {
      switch (rating) {
        case 5: return '#10B981';
        case 4: return '#3B82F6';
        case 3: return '#F59E0B';
        case 2: return '#EF4444';
        case 1: return '#DC2626';
        default: return '#3B82F6';
      }
    } else {
      switch (rating) {
        case 'Excellent': return '#10B981';
        case 'Good': return '#3B82F6';
        case 'Average': return '#F59E0B';
        case 'Poor': return '#EF4444';
        case 'Very Poor': return '#DC2626';
        default: return '#3B82F6';
      }
    }
  };

  const getRatingText = (rating) => {
    if (typeof rating === 'number') {
      switch (rating) {
        case 5: return 'Excellent';
        case 4: return 'Good';
        case 3: return 'Average';
        case 2: return 'Poor';
        case 1: return 'Very Poor';
        default: return 'Unknown';
      }
    }
    return rating;
  };

  const getTimeAgo = (dateString) => {
    const days = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  const statusOptions = [
    { label: 'Active', value: 'true' },
    { label: 'Inactive', value: 'false' }
  ];

  const rows = currentReviews.map((review, index) => {
    console.log("reviewreviewreviewreviewreviewreviewreviewreview", review)
    const ratingDisplay = getRatingText(review.rating);

    return [
      <Text key={index + "key"} variant="bodyMd" as="p">{review.name || "Unknown"}</Text>,
      review.productId,
      review.email,
      review.mobile || "N/A",
      <Badge
        key={`rating-${review._id}`}
        tone="info"
        style={{
          backgroundColor: `${getRatingColor(review.rating)}15`,
          color: getRatingColor(review.rating)
        }}
      >
        {ratingDisplay}
      </Badge>,
      <Text key={`date-${review._id}`} variant="bodyMd" as="p">
        {new Date(review.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
        <br />
        <Text variant="bodySm" tone="subdued">{getTimeAgo(review.createdAt)}</Text>
      </Text>,
      review.reviewText || "N/A",
      <Badge
        key={`recommend-${review._id}`}
        tone={review.recommend ? "success" : "critical"}
      >
        {review.recommend ? "Recommended" : "Not Recommended"}
      </Badge>,
      <Select
        key={review._id}
        labelInline
        options={statusOptions}
        onChange={(newStatus) => handleStatusChange(review._id, newStatus)}
        value={String(reviewStatuses[review._id])}
      />,
      <Button
        key={`delete-${review._id}`}
        icon={DeleteIcon}
        tone="critical"
        onClick={() => handleDeleteModalOpen(review._id)}
        accessibilityLabel={`Delete review by ${review.name || "Unknown"}`}
      />
    ];
  });

  return (
    <AppProvider>
      <Frame>
        <Page title="Customer Reviews Dashboard">
          <Card>
            <>
              <DataTable
                columnContentTypes={[
                  'text', 'text', 'text', 'text', 'text',
                  'text', 'text', 'text', 'text', 'text'
                ]}
                headings={[
                  'Reviewer', 'Product', 'Email', 'Mobile Number', 'Rating',
                  'Date', 'Review', 'Recommended', 'Status', 'Actions'
                ]}
                rows={rows}
              />
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <Pagination
                  label={`Page ${currentPage} of ${Math.ceil(reviews.length / itemsPerPage)}`}
                  hasPrevious={currentPage > 1}
                  onPrevious={() => setCurrentPage(currentPage - 1)}
                  hasNext={currentPage < Math.ceil(reviews.length / itemsPerPage)}
                  onNext={() => setCurrentPage(currentPage + 1)}
                />
              </div>
            </>
          </Card>

          <DeleteButtonModal
            isOpen={deleteModalOpen}
            onClose={handleDeleteModalClose}
            onConfirm={handleDeleteReview}
          />

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

export default CustomerReviewsManager;