import { useNavigation } from "@remix-run/react";
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
import DeleteButtonModal from "./modals/DeleteButtonModal";

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
  const isNavigationLoading =
    navigation.state === "loading" || navigation.state === "submitting";
  const isLoading = parentIsLoading || isNavigationLoading;
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [toast, setToast] = useState({
    active: false,
    message: "",
    error: false,
  });
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || "");
  const [ratingFilter, setRatingFilter] = useState(initialRating || "");
  const [statusFilter, setStatusFilter] = useState(initialStatus || "");
  const [localSearchQuery, setLocalSearchQuery] = useState(
    initialSearchQuery || "",
  );
  const [processingAction, setProcessingAction] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [reviewStatuses, setReviewStatuses] = useState(
    reviews.reduce((acc, review) => {
      acc[review._id] = review.isActive;
      return acc;
    }, {}),
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
      }, {}),
    );
    setSearchQuery(initialSearchQuery || "");
    setStatusFilter(initialStatus || "");
    setRatingFilter(initialRating || "");
    setLocalSearchQuery(initialSearchQuery || "");
    setIsFiltering(false);
  }, [reviews, initialSearchQuery, initialStatus, initialRating]);

  const handleDeleteModalOpen = (id) => {
    setSelectedReviewId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setSelectedReviewId(null);
  };

  const handleDeleteReview = async () => {
    if (selectedReviewId) {
      try {
        setProcessingAction(true);
        const result = await deleteReview(selectedReviewId);

        if (result.success) {
          setToast({
            active: true,
            message: "Review deleted successfully",
            error: false,
          });
          onDeleteSuccess && onDeleteSuccess();

          const url = new URL(window.location.href);
          const formData = new FormData();
          for (const [key, value] of url.searchParams.entries()) {
            formData.append(key, value);
          }
          submit(formData, { method: "get", replace: true });
        } else {
          setToast({
            active: true,
            message: result.error || "Failed to delete review",
            error: true,
          });
        }
        handleDeleteModalClose();
      } catch (error) {
        setToast({
          active: true,
          message: "An unexpected error occurred",
          error: true,
        });
        handleDeleteModalClose();
      } finally {
        setProcessingAction(false);
      }
    }
  };

  const handleStatusChange = async (reviewId, newStatus) => {
    if (isLoading || isFiltering) return;

    try {
      setProcessingAction(true);

      setReviewStatuses((prev) => ({
        ...prev,
        [reviewId]: newStatus === "true",
      }));

      const result = await updateReviewStatus(reviewId, newStatus);

      if (result && result.success) {
        setToast({
          active: true,
          message: "Review status updated successfully",
          error: false,
        });
        onStatusChangeSuccess && onStatusChangeSuccess(newStatus === "true");
      } else {
        setReviewStatuses((prev) => ({
          ...prev,
          [reviewId]: !newStatus,
        }));
        setToast({
          active: true,
          message: result?.error || "Failed to update review status",
          error: true,
        });
      }
    } catch (error) {
      setReviewStatuses((prev) => ({
        ...prev,
        [reviewId]: !newStatus,
      }));
      setToast({
        active: true,
        message: "An unexpected error occurred",
        error: true,
      });
    } finally {
      setProcessingAction(false);
    }
  };

  const toggleToast = () => {
    setToast({ ...toast, active: false });
  };

  const getRatingText = (rating) => {
    if (typeof rating === "number") {
      switch (rating) {
        case 5:
          return "Excellent";
        case 4:
          return "Good";
        case 3:
          return "Average";
        case 2:
          return "Poor";
        case 1:
          return "Very Poor";
        default:
          return "Unknown";
      }
    }
    return rating;
  };

  const getRatingTone = (rating) => {
    if (typeof rating === "number") {
      switch (rating) {
        case 5:
          return "success";
        case 4:
          return "info";
        case 3:
          return "warning";
        case 2:
          return "caution";
        case 1:
          return "critical";
        default:
          return "info";
      }
    }
    return "info";
  };

  const getTimeAgo = (dateString) => {
    const days = Math.floor(
      (new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24),
    );
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

  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const submitFilter = (formData) => {
    if (!isFiltering) {
      setIsFiltering(true);
      submit(formData, { method: "get", replace: true });
    }
  };

  const debouncedSubmit = debounce(submitFilter, 500);

  const handleSearchChange = (value) => {
    setLocalSearchQuery(value);
    setSearchQuery(value);
    debouncedSubmit(formData);
  };

  const handleStatusFilterChange = (value) => {
    if (isLoading || isFiltering) return;

    setStatusFilter(value);

    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set("status", value);
    } else {
      url.searchParams.delete("status");
    }
    url.searchParams.set("page", "1");

    const formData = new FormData();
    for (const [key, value] of url.searchParams.entries()) {
      formData.append(key, value);
    }
    setIsFiltering(true);
    submit(formData, { method: "get", replace: true });
  };

  const handleRatingFilterChange = (value) => {
    if (isLoading || isFiltering) return;

    setRatingFilter(value);

    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set("rating", value);
    } else {
      url.searchParams.delete("rating");
    }
    url.searchParams.set("page", "1");

    const formData = new FormData();
    for (const [key, value] of url.searchParams.entries()) {
      formData.append(key, value);
    }
    setIsFiltering(true);
    submit(formData, { method: "get", replace: true });
  };

  const handleClearAllFilters = () => {
    if (isLoading || isFiltering) return;

    const url = new URL(window.location.href);
    url.searchParams.delete("searchQuery");
    url.searchParams.delete("status");
    url.searchParams.delete("rating");
    url.searchParams.set("page", "1");

    const formData = new FormData();
    formData.append("page", "1");
    setIsFiltering(true);
    submit(formData, { method: "get", replace: true });

    setLocalSearchQuery("");
    setSearchQuery("");
    setStatusFilter("");
    setRatingFilter("");
  };

  const handlePageChange = (newPage) => {
    if (isLoading || isFiltering) return;

    const url = new URL(window.location.href);
    url.searchParams.set("page", newPage.toString());

    const formData = new FormData();
    for (const [key, value] of url.searchParams.entries()) {
      formData.append(key, value);
    }
    setIsFiltering(true);
    submit(formData, { method: "get", replace: true });
  };

  const handleQueryClear = () => {
    if (isLoading || isFiltering) return;

    setLocalSearchQuery("");
    setSearchQuery("");
    const url = new URL(window.location.href);
    url.searchParams.delete("searchQuery");
    url.searchParams.set("page", "1");
    const formData = new FormData();
    for (const [key, value] of url.searchParams.entries()) {
      formData.append(key, value);
    }
    setIsFiltering(true);
    submit(formData, { method: "get", replace: true });
  };

  const rows = filteredReviews.map((review, index) => {
    const ratingDisplay = getRatingText(review?.rating);
    const ratingTone = getRatingTone(review?.rating);

    return [
      <Text key={index + "key"} variant="bodyMd" as="p">
        {review?.name || "Unknown"}
      </Text>,
      review?.productId,
      review?.email,
      review?.mobile || "N/A",
      <Badge key={`rating-${review?._id}`} tone={ratingTone}>
        {ratingDisplay}
      </Badge>,
      <Text key={`date-${review?._id}`} variant="bodyMd" as="p">
        {new Date(review?.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
        <br />
        <Text variant="bodySm" tone="subdued">
          {getTimeAgo(review?.createdAt)}
        </Text>
      </Text>,
      review?.reviewText || "N/A",
      <Badge
        key={`recommend-${review?._id}`}
        tone={review?.recommend ? "success" : "critical"}
      >
        {review?.recommend ? "Recommended" : "Not Recommended"}
      </Badge>,
      <Select
        key={`status-${review?._id}`}
        labelInline
        options={statusOptions.filter((option) => option.value !== "")}
        onChange={(newStatus) => handleStatusChange(review?._id, newStatus)}
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
    ];
  });

  return (
    <AppProvider>
      <Frame>
        <Page fullWidth title="Product Reviews">
          <Card>
            <>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div style={{ width: "100%" }}>
                  <span style={{ padding: "10px" }}>Search :</span>
                  <Filters
                    style={{ height: "40px" }}
                    queryValue={localSearchQuery}
                    queryPlaceholder="Search Name, Email and Product here..."
                    filters={[]}
                    disabled={isLoading || isFiltering}
                    appliedFilters={[
                      ...(statusFilter
                        ? [
                            {
                              key: "status",
                              label: `Status: ${statusOptions.find((opt) => opt.value === statusFilter)?.label || ""}`,
                            },
                          ]
                        : []),
                      ...(ratingFilter
                        ? [
                            {
                              key: "rating",
                              label: `Rating: ${ratingOptions.find((opt) => opt.value === ratingFilter)?.label || ""}`,
                            },
                          ]
                        : []),
                    ]}
                    onQueryChange={handleSearchChange}
                    onQueryClear={handleQueryClear}
                    onClearAll={handleClearAllFilters}
                  />
                </div>

                <div style={{ width: "100%" }}>
                  <Select
                    label="Status"
                    options={statusOptions}
                    onChange={handleStatusFilterChange}
                    value={statusFilter}
                    disabled={isLoading || isFiltering}
                  />
                </div>

                <div style={{ width: "100%" }}>
                  <Select
                    label="Rating"
                    options={ratingOptions}
                    onChange={handleRatingFilterChange}
                    value={ratingFilter}
                    disabled={isLoading || isFiltering}
                  />
                </div>
              </div>

              <>
                <div>
                  <DataTable
                    columnContentTypes={[
                      "text",
                      "text",
                      "text",
                      "text",
                      "text",
                      "text",
                      "text",
                      "text",
                      "text",
                      "text",
                    ]}
                    headings={[
                      "Reviewer",
                      "Product",
                      "Email",
                      "Mobile Number",
                      "Rating",
                      "Date",
                      "Review",
                      "Recommended",
                      "Status",
                      "Actions",
                    ]}
                    rows={rows}
                    hideScrollIndicator={true}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "0.5rem",
                    }}
                  >
                    <Text variant="bodySm" tone="subdued">
                      Showing {filteredReviews.length} of{" "}
                      {pagination.totalReviews} reviews
                      {(isLoading || isFiltering) && " (Loading...)"}
                    </Text>
                  </div>
                  <Pagination
                    label={`Page ${pagination.currentPage} of ${pagination.totalPages}`}
                    hasPrevious={pagination.currentPage > 1}
                    onPrevious={() =>
                      handlePageChange(pagination.currentPage - 1)
                    }
                    hasNext={pagination.currentPage < pagination.totalPages}
                    onNext={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={isLoading || isFiltering}
                  />
                </div>
              </>
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

export default ProductReview;
