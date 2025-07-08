import { useLoaderData, useNavigation } from "@remix-run/react";
import {
  AppProvider,
  Badge,
  Button,
  Card,
  DataTable,
  Filters,
  Frame,
  Page,
  Pagination,
  Select,
  Text,
  Toast,
} from "@shopify/polaris";
import { DeleteIcon } from "@shopify/polaris-icons";
import "@shopify/polaris/build/esm/styles.css";
import React, { useEffect, useMemo, useState } from "react";
import { authenticate } from "../shopify.server";
import DeleteButtonModal from "./modals/DeleteButtonModal";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  return { session };
}

function ProductReview({
  reviews,
  pagination,
  initialSearchQuery,
  initialStatus,
  initialRating,
  submit,
  deleteReview,
  updateReviewStatus,
  onDeleteSuccess,
  onStatusChangeSuccess,
  isLoading: parentIsLoading,
}) {
  const navigation = useNavigation();
  const { session } = useLoaderData();
  const isNavigationLoading =
    navigation.state === "loading" || navigation.state === "submitting";
  const isLoading = parentIsLoading || isNavigationLoading;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [toast, setToast] = useState({ active: false, message: "", error: false });
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || "");
  const [ratingFilter, setRatingFilter] = useState(initialRating || "");
  const [statusFilter, setStatusFilter] = useState(initialStatus || "");
  const [localSearchQuery, setLocalSearchQuery] = useState(initialSearchQuery || "");
  const [processingAction, setProcessingAction] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [productTitles, setProductTitles] = useState({}); // 👈 new
  const [reviewStatuses, setReviewStatuses] = useState(
    reviews.reduce((acc, review) => {
      acc[review._id] = review.isActive;
      return acc;
    }, {})
  );

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const matchesSearch =
        !searchQuery ||
        review.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.productId?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        !statusFilter || String(review.isActive) === statusFilter;
      const matchesRating =
        !ratingFilter || String(review.rating) === ratingFilter;
      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [reviews, searchQuery, statusFilter, ratingFilter]);

  useEffect(() => {
    setReviewStatuses(
      reviews.reduce((acc, review) => {
        acc[review._id] = review.isActive;
        return acc;
      }, {})
    );
    setSearchQuery(initialSearchQuery || "");
    setStatusFilter(initialStatus || "");
    setRatingFilter(initialRating || "");
    setLocalSearchQuery(initialSearchQuery || "");
    setIsFiltering(false);
  }, [reviews, initialSearchQuery, initialStatus, initialRating]);

  useEffect(() => {
    fetchProductTitles();
  }, [reviews]);

 const fetchProductTitles = async () => {
  console.log("getting here")
  const titles = {};
  
  for (const review of reviews) {
    const productId = review?.productId;
    if (!productId || titles[productId]) continue;
    
    try {
      // Try corsproxy.io instead
      const response = await fetch(
        `https://corsproxy.io/?https://jitali2103.myshopify.com/admin/api/2025-07/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': 'shpua_2ec21b539fb65088d3820d6e7f763997',
          },
          body: JSON.stringify({
            query: `
              query ProductTitle($ownerId: ID!) {
                product(id: $ownerId) {
                  title
                }
              }
            `,
            variables: { ownerId: `gid://shopify/Product/${productId}` },
          }),
        }
      );
      
      const data = await response.json();
      console.log("data", data);
      titles[productId] = data?.data?.product?.title || "Unknown Product";
    } catch (error) {
      console.error("Error fetching product:", productId, error);
      titles[productId] = "Unknown Product";
    }
  }
  
  setProductTitles(titles);
};

  const handleDeleteModalOpen = (id) => {
    setSelectedReviewId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setSelectedReviewId(null);
  };

  const handleDeleteReview = async () => {
    if (!selectedReviewId) return;
    try {
      setProcessingAction(true);
      const result = await deleteReview(selectedReviewId);
      if (result.success) {
        setToast({ active: true, message: "Review deleted", error: false });
        onDeleteSuccess && onDeleteSuccess();
        const url = new URL(window.location.href);
        const formData = new FormData();
        for (const [k, v] of url.searchParams.entries()) formData.append(k, v);
        submit(formData, { method: "get", replace: true });
      } else {
        setToast({ active: true, message: result.error || "Failed", error: true });
      }
      handleDeleteModalClose();
    } catch {
      setToast({ active: true, message: "Unexpected error", error: true });
      handleDeleteModalClose();
    } finally {
      setProcessingAction(false);
    }
  };

  const handleStatusChange = async (reviewId, newStatus) => {
    if (isLoading || isFiltering) return;
    try {
      setProcessingAction(true);
      setReviewStatuses((prev) => ({ ...prev, [reviewId]: newStatus === "true" }));
      const result = await updateReviewStatus(reviewId, newStatus);
      if (result?.success) {
        setToast({ active: true, message: "Status updated", error: false });
        onStatusChangeSuccess && onStatusChangeSuccess(newStatus === "true");
      } else {
        setReviewStatuses((prev) => ({ ...prev, [reviewId]: !newStatus }));
        setToast({ active: true, message: result?.error || "Failed", error: true });
      }
    } catch {
      setReviewStatuses((prev) => ({ ...prev, [reviewId]: !newStatus }));
      setToast({ active: true, message: "Unexpected error", error: true });
    } finally {
      setProcessingAction(false);
    }
  };

  const toggleToast = () => setToast({ ...toast, active: false });

  const getRatingText = (rating) => ["", "Very Poor", "Poor", "Average", "Good", "Excellent"][rating] || rating;
  const getRatingTone = (rating) => ["info", "critical", "caution", "warning", "info", "success"][rating] || "info";
  const getTimeAgo = (dateString) => {
    const days = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  const statusOptions = [
    { label: "All", value: "" },
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ];

  const ratingOptions = [
    { label: "All Ratings", value: "" },
    { label: "Very Poor", value: "1" },
    { label: "Poor", value: "2" },
    { label: "Average", value: "3" },
    { label: "Good", value: "4" },
    { label: "Excellent", value: "5" },
  ];

  const handlePageChange = (newPage) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", newPage.toString());
    const formData = new FormData();
    for (const [k, v] of url.searchParams.entries()) formData.append(k, v);
    setIsFiltering(true);
    submit(formData, { method: "get", replace: true });
  };

  const rows = filteredReviews.map((review, index) => [
    <Text key={index + "name"}>{review?.name || "Unknown"}</Text>,
    <Text key={`product-${review?._id}`}>{productTitles[review?.productId] || "Loading…"}</Text>,
    review?.email,
    review?.mobile || "N/A",
    <Badge key={`rating-${review?._id}`} tone={getRatingTone(review?.rating)}>
      {getRatingText(review?.rating)}
    </Badge>,
    <Text key={`date-${review?._id}`}>
      {new Date(review?.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
      <br />
      <Text variant="bodySm" tone="subdued">{getTimeAgo(review?.createdAt)}</Text>
    </Text>,
    review?.reviewText || "N/A",
    <Badge key={`rec-${review?._id}`} tone={review?.recommend ? "success" : "critical"}>
      {review?.recommend ? "Recommended" : "Not Recommended"}
    </Badge>,
    <Select
      key={`status-${review?._id}`}
      labelInline
      options={statusOptions.filter((o) => o.value !== "")}
      onChange={(val) => handleStatusChange(review?._id, val)}
      value={String(reviewStatuses[review?._id])}
      disabled={processingAction || isLoading || isFiltering}
    />,
    <Button
      key={`delete-${review?._id}`}
      icon={DeleteIcon}
      tone="critical"
      onClick={() => handleDeleteModalOpen(review?._id)}
      accessibilityLabel={`Delete review by ${review?.name || "Unknown"}`}
      disabled={processingAction || isLoading || isFiltering}
    />,
  ]);

  return (
    <AppProvider>
      <Frame>
        <Page fullWidth title="Product Reviews">
          <Card>
            <DataTable
              columnContentTypes={Array(10).fill("text")}
              headings={[
                "Customer", "Product", "Email", "Mobile", "Rating", "Date",
                "Review", "Recommended", "Status", "Actions"
              ]}
              rows={rows}
              hideScrollIndicator
            />
            <Pagination
              label={`Page ${pagination.currentPage} of ${pagination.totalPages}`}
              hasPrevious={pagination.currentPage > 1}
              onPrevious={() => handlePageChange(pagination.currentPage - 1)}
              hasNext={pagination.currentPage < pagination.totalPages}
              onNext={() => handlePageChange(pagination.currentPage + 1)}
              disabled={isLoading || isFiltering}
            />
          </Card>

          <DeleteButtonModal
            isOpen={deleteModalOpen}
            onClose={handleDeleteModalClose}
            onConfirm={handleDeleteReview}
          />

          {toast.active && (
            <Toast content={toast.message} error={toast.error} onDismiss={toggleToast} />
          )}
        </Page>
      </Frame>
    </AppProvider>
  );
}

export default ProductReview;
