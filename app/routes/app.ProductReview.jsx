import { useLoaderData, useNavigation } from "@remix-run/react";
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
  Toast,
} from "@shopify/polaris";
import { DeleteIcon } from "@shopify/polaris-icons";
import "@shopify/polaris/build/esm/styles.css";
import { useEffect, useState } from "react";
import { authenticate } from "../shopify.server";
import DeleteButtonModal from "./modals/DeleteButtonModal";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  return { session };
}

function ProductReview({
  reviews,
  pagination,
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
  const [toast, setToast] = useState({ active: false, message: "", error: false });
  const [productTitles, setProductTitles] = useState({});
  const [processingAction, setProcessingAction] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const [reviewStatuses, setReviewStatuses] = useState(
    reviews.reduce((acc, review) => {
      acc[review._id] = review.isActive;
      return acc;
    }, {})
  );

  useEffect(() => {
    fetchProductTitles();
  }, [reviews]);

  const fetchProductTitles = async () => {
    const titles = {};
    for (const review of reviews) {
      const productId = review?.productId;
      if (!productId || titles[productId]) continue;

      try {
        const response = await fetch(
          `https://corsproxy.io/?https://jitali2103.myshopify.com/admin/api/2025-07/graphql.json`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Access-Token": "shpua_2ec21b539fb65088d3820d6e7f763997",
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
        titles[productId] = data?.data?.product?.title || "Unknown Product";
      } catch (error) {
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
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ];

  const handlePageChange = (newPage) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", newPage.toString());
    const formData = new FormData();
    for (const [k, v] of url.searchParams.entries()) formData.append(k, v);
    setIsFiltering(true);
    submit(formData, { method: "get", replace: true });
  };

  const rows = reviews.map((review, index) => [
    <Text truncate>{review?.name || "Unknown"}</Text>,

    <Text truncate>{productTitles[review?.productId] || "Loading…"}</Text>,

    <Text truncate>{review?.email || "N/A"}</Text>,

    <Text tone={review?.mobile ? "default" : "subdued"}>
      {review?.mobile || "N/A"}
    </Text>,

    <Badge tone={getRatingTone(review?.rating)}>
      {getRatingText(review?.rating)}
    </Badge>,

    <div>
      <Text>
        {new Date(review?.createdAt).toLocaleDateString("en-US", {
          year: "numeric", month: "short", day: "numeric"
        })}
      </Text>
      <Text variant="bodySm" tone="subdued">
        {getTimeAgo(review?.createdAt)}
      </Text>
    </div>,

    <Text truncate title={review?.reviewText}>
      {review?.reviewText || "N/A"}
    </Text>,

    <Badge tone={review?.recommend ? "success" : "critical"}>
      {review?.recommend ? "Recommended" : "Not Recommended"}
    </Badge>,

    <Select
      labelInline
      options={statusOptions}
      onChange={(val) => handleStatusChange(review?._id, val)}
      value={String(reviewStatuses[review?._id])}
      disabled={processingAction || isLoading || isFiltering}
    />,

    <Button
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
            <div style={{ maxHeight: "600px", overflowY: "auto" }}>
              <DataTable
                columnContentTypes={Array(10).fill("text")}
                headings={[
                  <Text variant="bodyMd" fontWeight="bold">Customer</Text>,
                  <Text variant="bodyMd" fontWeight="bold">Product</Text>,
                  <Text variant="bodyMd" fontWeight="bold">Email</Text>,
                  <Text variant="bodyMd" fontWeight="bold">Mobile</Text>,
                  <Text variant="bodyMd" fontWeight="bold">Rating</Text>,
                  <Text variant="bodyMd" fontWeight="bold">Date</Text>,
                  <Text variant="bodyMd" fontWeight="bold">Review</Text>,
                  <Text variant="bodyMd" fontWeight="bold">Recommended</Text>,
                  <Text variant="bodyMd" fontWeight="bold">Status</Text>,
                  <Text variant="bodyMd" fontWeight="bold">Actions</Text>,
                ]}
                rows={rows}
                truncate
                increasedTableDensity
              />
            </div>

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
