import { useLoaderData, useSubmit } from '@remix-run/react';
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
    Toast
} from '@shopify/polaris';
import { DeleteIcon } from '@shopify/polaris-icons';
import '@shopify/polaris/build/esm/styles.css';
import React, { useEffect, useState, useRef } from 'react';
import DeleteButtonModal from './modals/DeleteButtonModal';

export async function loader({ request }) {

    const APIURL = process.env.API_URL;
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get('searchQuery') || '';
    const status = url.searchParams.get('status');
    const rating = url.searchParams.get('rating');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    try {
        const filterParams = new URLSearchParams();
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
            return { success: false, reviews: [], pagination: { currentPage: 1, totalPages: 1 } };
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
            }
        };

    } catch (error) {
        console.error("Failed to fetch reviews:", error);
        return { success: false, reviews: [], pagination: { currentPage: 1, totalPages: 1 } };
    }

}

export async function action({ request }) {
    const APIURL = process.env.API_URL;
    const formData = await request.formData();
    const actionType = formData.get('actionType');

    if (actionType === 'deleteReview') {
        const reviewId = formData.get('reviewId');

        try {
            const response = await fetch(`${APIURL}/api/deleteReview/${reviewId}`, {
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
            const response = await fetch(`${APIURL}/api/updateReview/${reviewId}`, {
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

function ProductReview() {

    const { reviews, pagination } = useLoaderData();
    const submit = useSubmit();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null);
    const [toast, setToast] = useState({ active: false, message: '', error: false });
    const [searchQuery, setSearchQuery] = useState("");
    const [ratingFilter, setRatingFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [reviewStatuses, setReviewStatuses] = useState(
        reviews.reduce((acc, review) => {
            acc[review._id] = review.isActive;
            return acc;
        }, {})
    );

    const isInitialMount = useRef(true);
    const filtersChanged = useRef(false);

    useEffect(() => {
        const url = new URL(window.location.href);
        setSearchQuery(url.searchParams.get('searchQuery') || '');
        setStatusFilter(url.searchParams.get('status') || '');
        setRatingFilter(url.searchParams.get('rating') || '');
    }, []);

    useEffect(() => {
        setReviewStatuses(
            reviews.reduce((acc, review) => {
                acc[review._id] = review.isActive;
                return acc;
            }, {})
        );
    }, [reviews]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (filtersChanged.current) {
            const timeoutId = setTimeout(() => {
                applyFilters(1);
                filtersChanged.current = false;
            }, 500);

            return () => clearTimeout(timeoutId);
        }
    }, [searchQuery, statusFilter, ratingFilter]);

    const applyFilters = (page = 1) => {
        const params = new URLSearchParams();

        if (searchQuery) {
            params.append('searchQuery', searchQuery);
        }

        if (statusFilter) {
            params.append('status', statusFilter);
        }

        if (ratingFilter) {
            params.append('rating', ratingFilter);
        }

        params.append('page', page.toString());
        params.append('limit', '10');

        submit(params, {
            method: 'get',
            replace: true,
            preventScrollReset: true
        });
    };

    const handlePageChange = (newPage) => {
        applyFilters(newPage);
    };

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

        setTimeout(() => {
            applyFilters(pagination.currentPage);
        }, 500);
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
        { label: 'All', value: '' },
        { label: 'Active', value: 'true' },
        { label: 'Inactive', value: 'false' }
    ];

    const ratingOptions = [
        { label: 'All Ratings', value: '' },
        { label: 'Very Poor', value: '1' },
        { label: 'Poor', value: '2' },
        { label: 'Average', value: '3' },
        { label: 'Good', value: '4' },
        { label: 'Excellent', value: '5' },
    ];

    const handleSearchChange = (value) => {
        setSearchQuery(value);
        filtersChanged.current = true;
    };

    const handleStatusFilterChange = (value) => {
        setStatusFilter(value);
        filtersChanged.current = true;
    };

    const handleRatingFilterChange = (value) => {
        setRatingFilter(value);
        filtersChanged.current = true;
    };

    const handleClearAllFilters = () => {
        setSearchQuery("");
        setStatusFilter("");
        setRatingFilter("");
        applyFilters(1);
    };

    const rows = reviews.map((review, index) => {
        const ratingDisplay = getRatingText(review.rating);

        return [
            <Text key={index + "key"} variant="bodyMd" as="p">{review.name || "Unknown"}</Text>,
            review.productId,
            review.email,
            review.mobile || "N/A",
            <Badge
                key={`rating-${review._id}`}
                tone="info"
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
                options={statusOptions.filter(option => option.value !== '')}
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
                <Page fullWidth title="Product Reviews">
                    <Card>
                        <>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ width: "100%" }}>
                                    <span style={{ padding: "10px" }}>Search :</span>
                                    <Filters
                                        style={{ height: "40px" }}
                                        queryValue={searchQuery}
                                        queryPlaceholder="Search Name, Email and Product here..."
                                        filters={[]}
                                        appliedFilters={[]}
                                        onQueryChange={handleSearchChange}
                                        onQueryClear={() => {
                                            setSearchQuery("");
                                            filtersChanged.current = true;
                                        }}
                                        onClearAll={handleClearAllFilters}
                                    />
                                </div>

                                <div style={{ width: "100%" }}>
                                    <Select
                                        label="Status"
                                        options={statusOptions}
                                        onChange={handleStatusFilterChange}
                                        value={statusFilter}
                                    />
                                </div>

                                <div style={{ width: "100%" }}>
                                    <Select
                                        label="Rating"
                                        options={ratingOptions}
                                        onChange={handleRatingFilterChange}
                                        value={ratingFilter}
                                    />
                                </div>

                                <div style={{ marginTop: "20px" }}>
                                    <Button onClick={() => applyFilters(1)} primary>
                                        Apply Filters
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <DataTable columnContentTypes={[
                                    'text', 'text', 'text', 'text', 'text',
                                    'text', 'text', 'text', 'text', 'text'
                                ]} headings={[
                                    'Reviewer', 'Product', 'Email', 'Mobile Number', 'Rating',
                                    'Date', 'Review', 'Recommended', 'Status', 'Actions'
                                ]}
                                    sortable={[false, true, true, true, true, true, false, false]}
                                    rows={rows}
                                    hideScrollIndicator={true}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
                                    <Text variant="bodySm" tone="subdued">
                                        Showing {reviews.length} of {pagination.totalReviews} reviews
                                    </Text>
                                </div>
                                <Pagination
                                    label={`Page ${pagination.currentPage} of ${pagination.totalPages}`}
                                    hasPrevious={pagination.currentPage > 1}
                                    onPrevious={() => handlePageChange(pagination.currentPage - 1)}
                                    hasNext={pagination.currentPage < pagination.totalPages}
                                    onNext={() => handlePageChange(pagination.currentPage + 1)}
                                />
                            </div>
                        </>
                    </Card>

                    <DeleteButtonModal isOpen={deleteModalOpen} onClose={handleDeleteModalClose} onConfirm={handleDeleteReview} />

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