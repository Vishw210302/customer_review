import { useFetcher, useNavigation, useSearchParams } from '@remix-run/react';
import {
    BlockStack,
    Button,
    DataTable,
    LegacyCard,
    Modal,
    Page,
    Pagination,
    Select,
    Spinner,
    Text,
    TextField,
    Toast
} from '@shopify/polaris';
import { DeleteIcon } from '@shopify/polaris-icons';
import React, { useCallback, useEffect, useState } from 'react';
import DeleteButtonModal from './modals/DeleteButtonModal';

export async function action({ request }) {
    const APIURL = process.env.APIURL
    const formData = await request.formData();
    const actionType = formData.get('actionType');

    try {
        if (actionType === 'updateStatus') {
            const reviewId = formData.get('reviewId');
            const newStatus = formData.get('newStatus') === 'true';

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            try {
                const response = await fetch(`${APIURL}/api/storeReview/${reviewId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': true
                    },
                    body: JSON.stringify({ isActive: newStatus })
                });

                clearTimeout(timeoutId);

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
                    actionType: 'updateStatus',
                    updatedReview: responseData.updatedReview
                };
            } catch (error) {
                clearTimeout(timeoutId);

                if (error.name === 'AbortError') {
                    return {
                        success: false,
                        error: 'Request timed out. Please check your network connection.'
                    };
                }

                return {
                    success: false,
                    error: error.message || 'Failed to update review status',
                    details: error.toString()
                };
            }
        }

        return { success: false, error: 'Invalid action type' };
    } catch (error) {
        console.error('Unexpected error in action:', error);
        return {
            success: false,
            error: 'An unexpected error occurred',
            details: error.toString()
        };
    }
}

function StoreReviewListing({ storeReviews, updateStoreReviewStatus, deleteStoreReview, }) {

    const [searchParams, setSearchParams] = useSearchParams();
    const fetcher = useFetcher();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
    const [filterRating, setFilterRating] = useState(searchParams.get('rating') || 'all');
    const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || 'all');
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [selectedImagesArray, setSelectedImagesArray] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null);
    const [toast, setToast] = useState({ active: false, message: '', error: false });
    const navigate = useNavigation();
    const isPageLoading = navigate.state === "loading";

    if (isPageLoading) {
        return (
            <div style={{
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

    const processReviews = useCallback((rawReviews) => {
        if (!rawReviews || !Array.isArray(rawReviews)) return [];

        return rawReviews.map(review => ({
            id: review._id,
            customer: review.name,
            email: review.email,
            product: `Email: ${review.email}`,
            reviewTitle: review.reviewTitle || 'No Title',
            rating: review.rating,
            review: review.reviewMessage,
            date: review.createdAt,
            isActive: review.isActive !== undefined ? review.isActive : true,
            images: review.reviewImages ? review.reviewImages.map(img => `https://8f16-223-229-149-98.ngrok-free.app/uploads/${img}`) : []
        }));
    }, []);

    const [reviews, setReviews] = useState(processReviews(storeReviews));

    useEffect(() => {
        setReviews(processReviews(storeReviews));
    }, [storeReviews, processReviews]);

    const ratingOptions = [
        { label: 'All Ratings', value: 'all' },
        { label: '5 Stars', value: '5' },
        { label: '4 Stars', value: '4' },
        { label: '3 Stars', value: '3' },
        { label: '2 Stars', value: '2' },
        { label: '1 Star', value: '1' }
    ];

    const statusOptions = [
        { label: 'All Status', value: 'all' },
        { label: 'Active', value: 'true' },
        { label: 'Inactive', value: 'false' }
    ];

    const statusChangeOptions = [
        { label: 'Active', value: 'true' },
        { label: 'Inactive', value: 'false' }
    ];

    useEffect(() => {
        let filteredReviews = processReviews(storeReviews);

        if (searchValue) {
            const searchLower = searchValue.toLowerCase();
            filteredReviews = filteredReviews.filter(review =>
                (review.customer && review.customer.toLowerCase().includes(searchLower)) ||
                (review.email && review.email.toLowerCase().includes(searchLower))
            );
        }

        if (filterRating !== 'all') {
            filteredReviews = filteredReviews.filter(review =>
                review.rating === parseInt(filterRating)
            );
        }

        if (filterStatus !== 'all') {
            const isActive = filterStatus === 'true';
            filteredReviews = filteredReviews.filter(review =>
                review.isActive === isActive
            );
        }

        setReviews(filteredReviews);
        setCurrentPage(1);
    }, [searchValue, filterRating, filterStatus, storeReviews, processReviews]);

    const handleSearchChange = useCallback((value) => {
        setSearchValue(value);

        const params = new URLSearchParams(searchParams);

        if (value) {
            params.set('search', value);
        } else {
            params.delete('search');
        }

        params.set('page', '1');

        setSearchParams(params, {
            replace: true,
            preventScrollReset: true
        });
    }, [searchParams, setSearchParams]);

    const handlePaginationChange = useCallback((newPage) => {
        setCurrentPage(newPage);
    }, []);

    const handleImageClick = useCallback((images) => {
        setSelectedImagesArray(images);
        setSelectedImageIndex(0);
        setShowImageModal(true);
    }, []);

    const handleModalClose = useCallback(() => {
        setShowImageModal(false);
    }, []);

    const handleImageNavigation = useCallback((direction) => {
        if (direction === 'next') {
            setSelectedImageIndex((prevIndex) =>
                prevIndex === selectedImagesArray?.length - 1 ? 0 : prevIndex + 1
            );
        } else {
            setSelectedImageIndex((prevIndex) =>
                prevIndex === 0 ? selectedImagesArray?.length - 1 : prevIndex - 1
            );
        }
    }, [selectedImagesArray]);

    const handleStatusChange = useCallback(async (reviewId, newStatus) => {
        try {
            const isActive = newStatus === 'true';

            const result = await updateStoreReviewStatus(reviewId, isActive);

            if (result.success) {
                setReviews(prevReviews =>
                    prevReviews.map(review =>
                        review.id === reviewId
                            ? { ...review, isActive: isActive }
                            : review
                    )
                );

                setToast({
                    active: true,
                    message: `Review ${isActive ? 'activated' : 'deactivated'} successfully`,
                    error: false
                });
            } else {
                setReviews(prevReviews =>
                    prevReviews.map(review =>
                        review.id === reviewId
                            ? { ...review, isActive: !isActive }
                            : review
                    )
                );

                setToast({
                    active: true,
                    message: result.error || 'Failed to update review status',
                    error: true
                });
            }
        } catch (error) {
            console.error('Status Change Error:', error);

            setToast({
                active: true,
                message: 'An unexpected error occurred',
                error: true
            });
        }
    }, [updateStoreReviewStatus]);

    useEffect(() => {
        if (fetcher.data) {
            if (fetcher.data.success) {
                setToast({
                    active: true,
                    message: 'Review status updated successfully',
                    error: false
                });
            } else {
                setToast({
                    active: true,
                    message: fetcher.data.error || 'Failed to update review status',
                    error: true
                });

                setReviews(prevReviews =>
                    prevReviews.map(review => ({
                        ...review,
                        isActive: !review.isActive
                    }))
                );
            }
        }
    }, [fetcher.data]);

    const handleDeleteModalOpen = useCallback((reviewId) => {
        setSelectedReviewId(reviewId);
        setDeleteModalOpen(true);
    }, []);

    const handleDeleteModalClose = useCallback(() => {
        setDeleteModalOpen(false);
        setSelectedReviewId(null);
    }, []);

    const handleDeleteReview = useCallback(async () => {
        if (selectedReviewId) {
            try {
                const result = await deleteStoreReview(selectedReviewId);

                if (result.success) {
                    setReviews(prevReviews =>
                        prevReviews.filter(review => review.id !== selectedReviewId)
                    );
                    setToast({
                        active: true,
                        message: 'Review deleted successfully',
                        error: false
                    });
                } else {
                    setToast({
                        active: true,
                        message: result.error || 'Failed to delete review',
                        error: true
                    });
                }
                handleDeleteModalClose();
            } catch (error) {
                setToast({
                    active: true,
                    message: 'An unexpected error occurred',
                    error: true
                });
                handleDeleteModalClose();
            }
        }
    }, [selectedReviewId, deleteStoreReview, handleDeleteModalClose]);

    const renderStarRating = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    const containerStyle = {
        display: 'flex',
        overflowX: 'scroll',
        gap: '8px',
        padding: '10px 15px',
        msOverflowStyle: 'none',
        scrollbarWidth: 'thin',
    };

    const imgStyle = {
        height: '100px',
        minWidth: '100px',
        objectFit: 'cover',
        borderRadius: '6px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s ease',
    };

    const renderImageThumbnails = useCallback((images) => {
        if (!images || images?.length === 0) {
            return <Text color="subdued">No images</Text>;
        }

        return (
            <BlockStack spacing="tight">
                <div
                    style={containerStyle}
                    onClick={() => handleImageClick(images)}
                >
                    {images && images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt="Product view"
                            style={imgStyle}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                    ))}
                </div>
            </BlockStack>
        );
    }, [handleImageClick]);

    const handleSort = useCallback(
        (index, direction) => {
            const sortedData = [...reviews].sort((a, b) => {
                let valueA, valueB;

                switch (index) {
                    case 1:
                        valueA = a.customer?.toLowerCase() || '';
                        valueB = b.customer?.toLowerCase() || '';
                        break;
                    case 2:
                        valueA = a.rating || 0;
                        valueB = b.rating || 0;
                        break;
                    case 3:
                        valueA = a.review?.toLowerCase() || '';
                        valueB = b.review?.toLowerCase() || '';
                        break;
                    case 4:
                        valueA = a.reviewTitle?.toLowerCase() || '';
                        valueB = b.reviewTitle?.toLowerCase() || '';
                        break;
                    case 5:
                        valueA = new Date(a.date || 0);
                        valueB = new Date(b.date || 0);
                        break;
                    default:
                        return 0;
                }

                if (direction === 'ascending') {
                    return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
                } else {
                    return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
                }
            });

            setReviews(sortedData);
        },
        [reviews]
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = reviews.slice(indexOfFirstItem, indexOfLastItem);

    const rows = currentItems.map(review => [
        <div key={`images-${review.id}`} style={{ width: "250px" }}>
            {renderImageThumbnails(review.images)}
        </div>,
        <div key={`product-${review.id}`}>
            <div style={{ fontSize: '15px', color: '#637381', fontWeight: 'bold' }}>{review.customer}</div>
            <div style={{ fontSize: "12px" }}>{review.product}</div>
        </div>,
        <div key={`rating-${review.id}`} style={{ color: '#FFB900', fontSize: "18px" }}>
            {renderStarRating(review.rating)}
        </div>,
        <div key={`reviewTitle-${review.id}`} style={{ width: "250px", whiteSpace: "normal" }}>
            {review.reviewTitle}
        </div>,
        <div key={`review-${review.id}`} style={{ textWrap: "wrap", width: "250px" }}>
            {review.review}
        </div>,
        <div key={`date-${review.id}`}>
            {new Date(review.date).toLocaleDateString()}
        </div>,
        <Select
            key={`status-${review.id}`}
            options={statusChangeOptions}
            onChange={(value) => handleStatusChange(review.id, value)}
            value={review.isActive ? 'true' : 'false'}
        />,
        <Button
            key={`action-${review.id}`}
            icon={DeleteIcon}
            tone="critical"
            onClick={() => handleDeleteModalOpen(review.id)}
            accessibilityLabel="Delete review"
        />
    ]);

    const dismissToast = useCallback(() => {
        setToast({ active: false, message: '', error: false });
    }, []);

    return (
        <Page fullWidth>
            <LegacyCard>
                <LegacyCard.Section>
                    <BlockStack distribution="fillEvenly">
                        <div style={{ display: "flex", gap: "10px" }}>
                            <div style={{ width: "100%" }}>
                                <TextField
                                    label="Search Name or Email"
                                    value={searchValue}
                                    onChange={handleSearchChange}
                                    placeholder="Search by customer name or email"
                                    clearButton
                                    onClearButtonClick={() => handleSearchChange('')}
                                />
                            </div>
                            <div style={{ width: "100%" }}>
                                <Select
                                    label="Rating"
                                    options={ratingOptions}
                                    value={filterRating}
                                    onChange={(value) => {
                                        setFilterRating(value);
                                        const params = new URLSearchParams(searchParams);
                                        if (value !== 'all') {
                                            params.set('rating', value);
                                        } else {
                                            params.delete('rating');
                                        }
                                        params.set('page', '1');
                                        setSearchParams(params, {
                                            replace: true,
                                            preventScrollReset: true
                                        });
                                    }}
                                />
                            </div>
                            <div style={{ width: "100%" }}>
                                <Select
                                    label="Status"
                                    options={statusOptions}
                                    value={filterStatus}
                                    onChange={(value) => {
                                        setFilterStatus(value);
                                        const params = new URLSearchParams(searchParams);
                                        if (value !== 'all') {
                                            params.set('status', value);
                                        } else {
                                            params.delete('status');
                                        }
                                        params.set('page', '1');
                                        setSearchParams(params, {
                                            replace: true,
                                            preventScrollReset: true
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </BlockStack>
                </LegacyCard.Section>

                <DataTable
                    columnContentTypes={[
                        'text',
                        'text',
                        'text',
                        'text',
                        'text',
                        'text',
                        'text',
                        'text',
                    ]}
                    headings={[
                        'Images',
                        'Customer / Email',
                        'Rating',
                        'Review Title',
                        'Review',
                        'Date',
                        "Status",
                        "Actions",
                    ]}
                    rows={rows}
                    sortable={[false, true, true, true, true, true, false, false]}
                    defaultSortDirection="descending"
                    onSort={handleSort}
                    hasZebraStripingOnData
                    increasedTableDensity
                    hideScrollIndicator={true}
                />

                <LegacyCard.Section>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <p>{`Showing ${reviews?.length > 0 ? indexOfFirstItem + 1 : 0}-${Math.min(reviews?.length, indexOfLastItem)} of ${reviews?.length} results`}</p>

                        <Pagination
                            hasPrevious={currentPage > 1}
                            onPrevious={() => handlePaginationChange(currentPage - 1)}
                            hasNext={indexOfLastItem < reviews?.length}
                            onNext={() => handlePaginationChange(currentPage + 1)}
                        />
                    </div>
                </LegacyCard.Section>
            </LegacyCard>

            <Modal
                open={showImageModal}
                onClose={handleModalClose}
                title="Product Images"
                primaryAction={{
                    content: 'Close',
                    onAction: handleModalClose,
                }}
            >
                <Modal.Section>
                    {selectedImagesArray?.length > 0 && selectedImageIndex !== null && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                <img
                                    src={selectedImagesArray[selectedImageIndex]}
                                    alt="Product"
                                    style={{ maxWidth: '100%', maxHeight: '400px' }}
                                />
                            </div>
                            {selectedImagesArray?.length > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center", gap: '10px' }}>
                                    <Button onClick={() => handleImageNavigation('prev')}>Previous</Button>
                                    <Text>Image {selectedImageIndex + 1} of {selectedImagesArray?.length}</Text>
                                    <Button onClick={() => handleImageNavigation('next')}>Next</Button>
                                </div>
                            )}
                        </div>
                    )}
                </Modal.Section>
            </Modal>

            <DeleteButtonModal isOpen={deleteModalOpen} onClose={handleDeleteModalClose} onConfirm={handleDeleteReview} />

            {toast.active && (
                <Toast
                    content={toast.message}
                    error={toast.error}
                    onDismiss={dismissToast}
                />
            )}
        </Page>
    );
}

export default StoreReviewListing;