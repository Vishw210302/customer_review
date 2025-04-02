import { useNavigation } from '@remix-run/react';
import {
    BlockStack,
    Button,
    DataTable,
    LegacyCard,
    Page,
    Pagination,
    Select,
    Spinner,
    TextField
} from '@shopify/polaris';
import { DeleteIcon } from '@shopify/polaris-icons';
import React, { useCallback, useEffect, useState } from 'react';
import DeleteButtonModal from './modals/DeleteButtonModal';

const CollectionReviewListing = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchValue, setSearchValue] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterRating, setFilterRating] = useState('all');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
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

    const initialReviews = [
        {
            id: 1,
            product: 'vishwprajapati66@gmail.com',
            rating: 5,
            customer: 'John Doe',
            review: 'API is working',
            date: '2025-03-15',
            reviewTitle: 'this is very good API is also working and loader is completethis is very good API is also working and loader is completethis is very good API is also working and loader is completethis is very good API is also working and loader is completethis is very good API is also working and loader is completethis is very good API is also working and loader is complete',
            images: [
                'https://picsum.photos/200/300',
                'https://picsum.photos/200/300',
                'https://picsum.photos/200/300',
            ],
            isActive: true
        },
        {
            id: 2,
            product: 'vishwprajapati66@gmail.com',
            rating: 5,
            customer: 'John Doe',
            review: 'Amazing product, fits perfectly!',
            date: '2025-03-15',
            reviewTitle: 'this is very good API is also working and loader is complete',
            images: [
                'https://picsum.photos/200/300',
                'https://picsum.photos/200/300',
                'https://picsum.photos/200/300',
                'https://picsum.photos/200/300',
            ],
            isActive: false
        },
        {
            id: 3,
            product: 'vishwprajapati66@gmail.com',
            rating: 5,
            customer: 'John Doe',
            review: 'Amazing product, fits perfectly!',
            date: '2025-03-15',
            reviewTitle: 'this is very good API is also working and loader is complete',
            images: [
                'https://picsum.photos/200/300',
                'https://picsum.photos/200/300',
            ],
            isActive: true
        },
        {
            id: 4,
            product: 'vishwprajapati66@gmail.com',
            rating: 5,
            customer: 'John Doe',
            review: 'Amazing product, fits perfectly!',
            date: '2025-03-15',
            reviewTitle: 'this is very good API is also working and loader is complete',
            images: [
                'https://picsum.photos/200/300',
                'https://picsum.photos/200/300',
                'https://picsum.photos/200/300',
                'https://picsum.photos/200/300',
            ],
            isActive: true
        },
    ];

    const [reviews, setReviews] = useState([...initialReviews]);

    const categoryOptions = [
        { label: 'All Categories', value: 'all' },
        { label: 'Apparel', value: 'Apparel' },
        { label: 'Accessories', value: 'Accessories' },
        { label: 'Electronics', value: 'Electronics' },
        { label: 'Home', value: 'Home' },
        { label: 'Fitness', value: 'Fitness' }
    ];

    const ratingOptions = [
        { label: 'All Ratings', value: 'all' },
        { label: '5 Stars', value: '5' },
        { label: '4 Stars', value: '4' },
        { label: '3 Stars', value: '3' },
        { label: '2 Stars', value: '2' },
        { label: '1 Star', value: '1' }
    ];

    const statusOptions = [
        { label: 'Active', value: 'true' },
        { label: 'Inactive', value: 'false' }
    ];

    useEffect(() => {
        let filteredReviews = [...initialReviews];

        if (searchValue) {
            const searchLower = searchValue.toLowerCase();
            filteredReviews = filteredReviews.filter(review =>
                review.product.toLowerCase().includes(searchLower) ||
                review.customer.toLowerCase().includes(searchLower) ||
                review.review.toLowerCase().includes(searchLower)
            );
        }

        if (filterCategory !== 'all') {
            filteredReviews = filteredReviews.filter(review =>
                review.reviewTitle === filterCategory
            );
        }

        if (filterRating !== 'all') {
            filteredReviews = filteredReviews.filter(review =>
                review.rating === parseInt(filterRating)
            );
        }

        setReviews(filteredReviews);
        setCurrentPage(1);
    }, [searchValue, filterCategory, filterRating]);

    const handleSearchChange = useCallback((value) => {
        setSearchValue(value);
    }, []);

    const handleCategoryChange = useCallback((value) => {
        setFilterCategory(value);
    }, []);

    const handleRatingChange = useCallback((value) => {
        setFilterRating(value);
    }, []);

    const handlePaginationChange = useCallback((newPage) => {
        setCurrentPage(newPage);
    }, []);

    const handleStatusChange = useCallback((reviewId, newStatus) => {
        const isActive = newStatus === 'true';

        setReviews(prevReviews =>
            prevReviews.map(review =>
                review.id === reviewId
                    ? { ...review, isActive: isActive }
                    : review
            )
        );

        initialReviews.forEach(review => {
            if (review.id === reviewId) {
                review.isActive = isActive;
            }
        });

    }, []);

    const handleDeleteReview = () => {

    }

    const renderStarRating = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    const handleDeleteModalOpen = () => {
        setDeleteModalOpen(true);
    };

    const handleDeleteModalClose = () => {
        setDeleteModalOpen(false);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = reviews.slice(indexOfFirstItem, indexOfLastItem);

    const rows = currentItems.map(review => [
        <div key={`product-${review.id}`}>
            <div style={{ fontSize: '15px', color: '#637381', fontWeight: 'bold' }}>{review.customer}</div>
            <div style={{ fontSize: "12px" }}>{review.product}</div>
        </div>,
        <div key={`rating-${review.id}`} style={{ color: '#FFB900', fontSize: "18px" }}>
            {renderStarRating(review.rating)}
        </div>,
        <div key={`review-${review.id}`}>
            {review.review.length > 50 ? `${review.review.substring(0, 50)}...` : review.review}
        </div>,
        <div key={`reviewTitle-${review.id}`} style={{ width: "300px", whiteSpace: "normal" }}>
            {review.reviewTitle}
        </div>,
        <div key={`date-${review.id}`}>
            {new Date(review.date).toLocaleDateString()}
        </div>,
        <Select
            key={`status-${review.id}`}
            options={statusOptions}
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

    const handleSort = useCallback(
        (index, direction) => {
            const sortedData = [...reviews].sort((a, b) => {
                let valueA, valueB;

                switch (index) {
                    case 1:
                        valueA = a.customer.toLowerCase();
                        valueB = b.customer.toLowerCase();
                        break;
                    case 2:
                        valueA = a.rating;
                        valueB = b.rating;
                        break;
                    case 3:
                        valueA = a.review.toLowerCase();
                        valueB = b.review.toLowerCase();
                        break;
                    case 4:
                        valueA = a.reviewTitle.toLowerCase();
                        valueB = b.reviewTitle.toLowerCase();
                        break;
                    case 5:
                        valueA = new Date(a.date);
                        valueB = new Date(b.date);
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

    return (
        <Page fullWidth>
            <LegacyCard>
                <LegacyCard.Section>
                    <BlockStack distribution="fillEvenly">
                        <div style={{ display: "flex", gap: "10px" }}>
                            <div style={{ width: "100%" }}>
                                <TextField
                                    label="Search"
                                    value={searchValue}
                                    onChange={handleSearchChange}
                                    placeholder="Search by product, customer or review"
                                    clearButton
                                    onClearButtonClick={() => setSearchValue('')}
                                />
                            </div>
                            <div style={{ width: "100%" }}>
                                <Select
                                    label="Review Title"
                                    options={categoryOptions}
                                    value={filterCategory}
                                    onChange={handleCategoryChange}
                                />
                            </div>
                            <div style={{ width: "100%" }}>
                                <Select
                                    label="Rating"
                                    options={ratingOptions}
                                    value={filterRating}
                                    onChange={handleRatingChange}
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
                    ]}
                    headings={[
                        'Collection Name',
                        'Avg. Rating',
                        'Review',
                        'Review Title',
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
                        <p>{`Showing ${reviews.length > 0 ? indexOfFirstItem + 1 : 0}-${Math.min(reviews.length, indexOfLastItem)} of ${reviews.length} results`}</p>

                        <Pagination
                            hasPrevious={currentPage > 1}
                            onPrevious={() => handlePaginationChange(currentPage - 1)}
                            hasNext={indexOfLastItem < reviews.length}
                            onNext={() => handlePaginationChange(currentPage + 1)}
                        />
                    </div>
                </LegacyCard.Section>
            </LegacyCard>

            <DeleteButtonModal isOpen={deleteModalOpen} onClose={handleDeleteModalClose} onConfirm={handleDeleteReview} />
        </Page>
    );
};

export default CollectionReviewListing;