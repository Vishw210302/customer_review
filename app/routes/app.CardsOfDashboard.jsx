import { useNavigate } from "@remix-run/react";
import {
  Badge,
  Banner,
  BlockStack,
  Box,
  Button,
  ButtonGroup,
  Card,
  Divider,
  Icon,
  InlineStack,
  Layout,
  List,
  Modal,
  Page,
  Select,
  Spinner,
  Text,
  TextField,
  Thumbnail,
  Tooltip
} from "@shopify/polaris";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  EmailIcon,
  ExportIcon,
  FilterIcon,
  ImageIcon,
  MobileIcon,
  SearchIcon,
  StarIcon,
  ThumbsDownIcon,
  ThumbsUpIcon
} from "@shopify/polaris-icons";
import { useCallback, useMemo, useState } from "react";

function CardsOfDashboard({ data, storeReviewData }) {

  const navigate = useNavigate();
  const isPageLoading = !data || !storeReviewData;
  const [selectedTimeRange, setSelectedTimeRange] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedRecommendation, setSelectedRecommendation] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchValue, setSearchValue] = useState("");
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [exportModalActive, setExportModalActive] = useState(false);

  const timeRangeOptions = [
    { label: "All Time", value: "all" },
    { label: "Last 7 Days", value: "7days" },
    { label: "Last 30 Days", value: "30days" },
    { label: "Last 90 Days", value: "90days" },
  ];

  const ratingOptions = [
    { label: "All Ratings", value: "all" },
    { label: "5 Stars", value: "5" },
    { label: "4 Stars", value: "4" },
    { label: "3 Stars", value: "3" },
    { label: "2 Stars", value: "2" },
    { label: "1 Star", value: "1" },
  ];

  const recommendationOptions = [
    { label: "All Recommendations", value: "all" },
    { label: "Recommended", value: "true" },
    { label: "Not Recommended", value: "false" },
  ];

  const sortOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
    { label: "Highest Rating", value: "rating_desc" },
    { label: "Lowest Rating", value: "rating_asc" },
  ];

  const productOptions = useMemo(() => {
    const products = new Set();
    data?.reviews?.forEach(review => {
      if (review.productId) products.add(review.productId);
    });
    return [
      { label: "All Products", value: "all" },
      ...Array.from(products).map(productId => ({
        label: `Product ${productId}`,
        value: productId
      }))
    ];
  }, [data?.reviews]);

  const getDateFromTimeRange = useCallback((range) => {
    const now = new Date();
    const days = {
      "7days": 7,
      "30days": 30,
      "90days": 90,
      "6months": 180,
      "1year": 365
    };

    return days[range] ? new Date(now.getTime() - days[range] * 24 * 60 * 60 * 1000) : null;
  }, []);

  const filterReviews = useCallback((reviews, type = "store") => {
    if (!reviews?.length) return [];

    let filtered = reviews.filter(review => {
      if (selectedTimeRange !== "all") {
        const cutoffDate = selectedTimeRange === "custom" ? dateRange.start : getDateFromTimeRange(selectedTimeRange);
        const endDate = selectedTimeRange === "custom" ? dateRange.end : new Date();

        if (cutoffDate) {
          const reviewDate = new Date(review.createdAt);
          if (reviewDate < cutoffDate || reviewDate > endDate) return false;
        }
      }

      if (selectedRating !== "all" && review.rating.toString() !== selectedRating) return false;

      if (type === "product" && selectedRecommendation !== "all" &&
        review.recommend?.toString() !== selectedRecommendation) return false;

      if (type === "product" && selectedProduct !== "all" &&
        review.productId?.toString() !== selectedProduct) return false;

      if (searchValue) {
        const searchLower = searchValue.toLowerCase();
        const searchFields = [
          review.name, review.email, review.reviewTitle,
          review.reviewMessage, review.reviewText
        ];

        if (!searchFields.some(field => field?.toLowerCase().includes(searchLower))) return false;
      }

      return true;
    });

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      switch (sortOrder) {
        case "newest": return dateB - dateA;
        case "oldest": return dateA - dateB;
        case "rating_desc": return b.rating - a.rating;
        case "rating_asc": return a.rating - b.rating;
        case "helpful": return (b.helpfulCount || 0) - (a.helpfulCount || 0);
        default: return 0;
      }
    });

    return filtered;
  }, [selectedTimeRange, selectedRating, selectedRecommendation, selectedProduct, sortOrder, searchValue, dateRange, getDateFromTimeRange]);

  const filteredStoreReviews = useMemo(() =>
    filterReviews(storeReviewData?.reviews, "store"),
    [storeReviewData?.reviews, filterReviews]
  );

  const filteredProductReviews = useMemo(() =>
    filterReviews(data?.reviews, "product"),
    [data?.reviews, filterReviews]
  );

  const reviewAnalytics = useMemo(() => {
    const allReviews = [...(filteredProductReviews || []), ...(filteredStoreReviews || [])];
    const totalReviews = allReviews.length;

    const avgRating = totalReviews > 0
      ? allReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    const recommendationRate = filteredProductReviews.length > 0
      ? (filteredProductReviews.filter(r => r.recommend).length / filteredProductReviews.length) * 100
      : 0;

    const reviewsWithImages = allReviews.filter(r => r.reviewImages?.length > 0).length;
    const imageRate = totalReviews > 0 ? (reviewsWithImages / totalReviews) * 100 : 0;

    const currentPeriodStart = getDateFromTimeRange(selectedTimeRange);
    const previousPeriodStart = currentPeriodStart
      ? new Date(currentPeriodStart.getTime() - (new Date().getTime() - currentPeriodStart.getTime()))
      : null;

    let trend = 0;
    if (previousPeriodStart && currentPeriodStart) {
      const previousReviews = allReviews.filter(r => {
        const reviewDate = new Date(r.createdAt);
        return reviewDate >= previousPeriodStart && reviewDate < currentPeriodStart;
      });
      const currentReviews = allReviews.filter(r => {
        const reviewDate = new Date(r.createdAt);
        return reviewDate >= currentPeriodStart;
      });

      if (previousReviews.length > 0) {
        trend = ((currentReviews.length - previousReviews.length) / previousReviews.length) * 100;
      }
    }

    return {
      totalReviews,
      avgRating,
      recommendationRate,
      imageRate,
      trend,
      reviewsWithImages
    };
  }, [filteredProductReviews, filteredStoreReviews, selectedTimeRange, getDateFromTimeRange]);

  const generateTrendData = useCallback((reviews) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentDate = new Date();

    return Array.from({ length: 6 }, (_, i) => {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - (5 - i), 1);
      const reviewCount = reviews.filter(review => {
        const reviewDate = new Date(review.createdAt);
        return reviewDate.getMonth() === date.getMonth() &&
          reviewDate.getFullYear() === date.getFullYear();
      }).length;

      return {
        month: months[date.getMonth()],
        reviews: reviewCount,
        year: date.getFullYear(),
      };
    });
  }, []);

  const generateRatingDistribution = useCallback((reviews) => {
    const distribution = reviews.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

    const total = reviews.length;
    return [5, 4, 3, 2, 1].map(rating => ({
      rating: `${rating}★`,
      count: distribution[rating],
      percentage: total > 0 ? Math.round((distribution[rating] / total) * 100) : 0,
    }));
  }, []);

  const calculateAverage = useCallback((reviews) => {
    if (!reviews?.length) return 0;
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  }, []);

  const storeReviewTrendData = useMemo(() => generateTrendData(filteredStoreReviews), [filteredStoreReviews, generateTrendData]);
  const productReviewTrendData = useMemo(() => generateTrendData(filteredProductReviews), [filteredProductReviews, generateTrendData]);
  const storeRatingDistribution = useMemo(() => generateRatingDistribution(filteredStoreReviews), [filteredStoreReviews, generateRatingDistribution]);
  const productRatingDistribution = useMemo(() => generateRatingDistribution(filteredProductReviews), [filteredProductReviews, generateRatingDistribution]);
  const filteredStoreAverage = useMemo(() => calculateAverage(filteredStoreReviews), [filteredStoreReviews, calculateAverage]);
  const filteredProductAverage = useMemo(() => calculateAverage(filteredProductReviews), [filteredProductReviews, calculateAverage]);

  const RatingStars = ({ rating }) => (
    <InlineStack gap="100" align="center">
      <InlineStack gap="050">
        {Array.from({ length: 5 }, (_, index) => (
          <Text
            key={index}
            as="span"
            tone={index < Math.floor(rating) ? "warning" : "subdued"}
          >
            ★
          </Text>
        ))}
      </InlineStack>
      <Text as="span" variant="bodyMd" fontWeight="semibold">
        {rating?.toFixed(1)}
      </Text>
    </InlineStack>
  );

  const SimpleLineChart = ({ data, title }) => {
    const maxValue = Math.max(...data.map(item => item.reviews), 1);

    return (
      <Card>
        <BlockStack gap="300">
          <Text as="h3" variant="headingMd">{title}</Text>
          <div style={{ height: "200px", position: "relative" }}>
            <svg width="100%" height="100%" viewBox="0 0 400 160">
              <defs>
                <linearGradient id={`gradient-${title.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0066cc" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0066cc" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {Array.from({ length: 5 }, (_, i) => (
                <line
                  key={i}
                  x1="40" y1={40 + i * 25}
                  x2="380" y2={40 + i * 25}
                  stroke="#e5e7eb" strokeWidth="1"
                />
              ))}

              {data.length > 1 && (
                <>
                  <polyline
                    fill="none" stroke="#0066cc" strokeWidth="2"
                    points={data.map((item, index) => {
                      const x = 60 + (index * 280) / (data.length - 1);
                      const y = 140 - (item.reviews / maxValue) * 80;
                      return `${x},${y}`;
                    }).join(" ")}
                  />
                  <polygon
                    fill={`url(#gradient-${title.replace(/\s+/g, '')})`}
                    points={`60,140 ${data.map((item, index) => {
                      const x = 60 + (index * 280) / (data.length - 1);
                      const y = 140 - (item.reviews / maxValue) * 80;
                      return `${x},${y}`;
                    }).join(" ")} ${60 + (280 * (data.length - 1)) / (data.length - 1)},140`}
                  />
                </>
              )}

              {data.map((item, index) => {
                const x = data.length === 1 ? 200 : 60 + (index * 280) / (data.length - 1);
                const y = 140 - (item.reviews / maxValue) * 80;
                return (
                  <g key={index}>
                    <circle cx={x} cy={y} r="4" fill="#0066cc" stroke="white" strokeWidth="2" />
                    <text x={x} y={y - 10} textAnchor="middle" fontSize="10" fill="#0066cc" fontWeight="bold">
                      {item.reviews}
                    </text>
                    <text x={x} y="155" textAnchor="middle" fontSize="12" fill="#6b7280">
                      {item.month}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </BlockStack>
      </Card>
    );
  };

  const RatingDistributionChart = ({ data, title }) => (
    <Card>
      <BlockStack gap="300">
        <Text as="h3" variant="headingMd">{title}</Text>
        <BlockStack gap="200">
          {data.map((item, index) => (
            <InlineStack key={index} gap="300" align="center">
              <Box minWidth="40px">
                <Text as="span" variant="bodyMd">{item.rating}</Text>
              </Box>
              <Box style={{ flex: 1 }}>
                <div style={{
                  width: "100%", height: "20px", backgroundColor: "#f3f4f6",
                  borderRadius: "4px", overflow: "hidden",
                }}>
                  <div style={{
                    width: `${item.percentage}%`, height: "100%", backgroundColor: "#0066cc",
                    transition: "width 0.3s ease",
                  }} />
                </div>
              </Box>
              <Box minWidth="60px">
                <Text as="span" variant="bodyMd" tone="subdued">
                  {item.count} ({item.percentage}%)
                </Text>
              </Box>
            </InlineStack>
          ))}
        </BlockStack>
      </BlockStack>
    </Card>
  );

  const AnalyticsCard = ({ title, value, subtitle, trend, icon, color = "success" }) => (
    <Card>
      <BlockStack gap="200">
        <InlineStack align="space-between">
          <InlineStack gap="200" align="center">
            <Icon source={icon} tone={color} />
            <Text as="h3" variant="headingSm">{title}</Text>
          </InlineStack>
          {trend !== 0 && (
            <Badge tone={trend > 0 ? "success" : "critical"}>
              <InlineStack gap="050" align="center">
                <Icon source={trend > 0 ? ArrowUpIcon : ArrowDownIcon} />
                {Math.abs(trend).toFixed(1)}%
              </InlineStack>
            </Badge>
          )}
        </InlineStack>
        <Text as="p" variant="headingLg">{value}</Text>
        <Text as="p" variant="bodyMd" tone="subdued">{subtitle}</Text>
      </BlockStack>
    </Card>
  );

  const RecentReviews = ({ reviews, title, type }) => (
    <Card>
      <BlockStack gap="300">
        <InlineStack align="space-between">
          <Text as="h3" variant="headingMd">{title}</Text>
        </InlineStack>
        <Divider />
        <BlockStack gap="200">
          {reviews.slice(0, 3).map((review, index) => (
            <Card key={index} sectioned>
              <BlockStack gap="200">
                <InlineStack align="space-between">
                  <InlineStack gap="200" align="center">
                    <RatingStars rating={review.rating} />
                    <Text as="span" variant="bodyMd" fontWeight="semibold">
                      {review.name}
                    </Text>
                  </InlineStack>
                  <InlineStack gap="100">
                    {review.reviewImages && review.reviewImages.length > 0 && (
                      <Tooltip content={`${review.reviewImages.length} images`}>
                        <Icon source={ImageIcon} tone="subdued" />
                      </Tooltip>
                    )}
                    {type === "product" && review.recommend && (
                      <Tooltip content="Recommended">
                        <Icon source={ThumbsUpIcon} tone="success" />
                      </Tooltip>
                    )}
                    {type === "product" && review.recommend === false && (
                      <Tooltip content="Not Recommended">
                        <Icon source={ThumbsDownIcon} tone="critical" />
                      </Tooltip>
                    )}
                  </InlineStack>
                </InlineStack>
                <Text as="p" variant="bodyMd" tone="subdued">
                  {(review.reviewText || review.reviewMessage || "").substring(0, 100)}
                  {(review.reviewText || review.reviewMessage || "").length > 100 && "..."}
                </Text>
                <InlineStack gap="200">
                  <Text as="span" variant="bodyMd" tone="subdued">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Text>
                </InlineStack>
              </BlockStack>
            </Card>
          ))}
          {reviews.length === 0 && (
            <Box padding="400">
              <InlineStack gap="200" align="center">
                <Icon source={StarIcon} tone="subdued" />
                <Text as="p" variant="bodyMd" tone="subdued">
                  No reviews found with current filters
                </Text>
              </InlineStack>
            </Box>
          )}
        </BlockStack>
      </BlockStack>
    </Card>
  );

  const ExportModal = () => (
    <Modal
      open={exportModalActive}
      onClose={() => setExportModalActive(false)}
      title="Export Reviews"
      primaryAction={{
        content: 'Export CSV',
        onAction: handleExportCSV,
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: () => setExportModalActive(false),
        },
      ]}
    >
      <Modal.Section>
        <BlockStack gap="300">
          <Text variant="bodyMd">
            Export your filtered reviews to CSV format. This will include all reviews matching your current filters.
          </Text>
          <Banner status="info">
            <List>
              <List.Item>Product Reviews: {filteredProductReviews.length} reviews</List.Item>
              <List.Item>Store Reviews: {filteredStoreReviews.length} reviews</List.Item>
              <List.Item>Total: {reviewAnalytics.totalReviews} reviews</List.Item>
            </List>
          </Banner>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );

  const handleNavigateToReviews = useCallback(() => {
    navigate("/app/manageReviews");
  }, [navigate]);

  const handleClearFilters = useCallback(() => {
    setSelectedTimeRange("all");
    setSelectedRating("all");
    setSelectedRecommendation("all");
    setSelectedProduct("all");
    setSortOrder("newest");
    setSearchValue("");
    setDateRange({ start: null, end: null });
  }, []);

  const handleExportCSV = useCallback(() => {
    const allReviews = [...filteredProductReviews, ...filteredStoreReviews];
    const csv = [
      ['Name', 'Email', 'Rating', 'Review', 'Recommendation', 'Date', 'Type', 'Store', 'Product ID'].join(','),
      ...allReviews.map(review => [
        `"${review.name}"`,
        `"${review.email}"`,
        review.rating,
        `"${(review.reviewText || review.reviewMessage || '').replace(/"/g, '""')}"`,
        review.recommend !== undefined ? review.recommend : 'N/A',
        new Date(review.createdAt).toLocaleDateString(),
        review.productId ? 'Product' : 'Store',
        `"${review.storeName}"`,
        review.productId || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trust-me-reviews-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    setExportModalActive(false);
  }, [filteredProductReviews, filteredStoreReviews]);

  if (isPageLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spinner accessibilityLabel="Loading dashboard" size="large" />
      </div>
    );
  }

  const headerStyles = {
    title: { fontSize: "21px", color: "#3c3a3a", fontWeight: 600, margin: "0 0 5px 0" },
    subtitle: { fontSize: "16px", color: "#6B7280", margin: "0 0 10px 0" }
  };

  const ReviewCard = ({ title, reviews, totalReviews, average, icon = StarIcon }) => (
    <Card>
      <BlockStack gap="300">
        <InlineStack align="space-between">
          <InlineStack gap="200" align="center">
            <Icon source={icon} tone="warning" />
            <Text as="h3" variant="headingMd">{title}</Text>
          </InlineStack>
          <Button variant="plain" onClick={handleNavigateToReviews}>View all</Button>
        </InlineStack>

        <Divider />

        <InlineStack align="space-between">
          <BlockStack gap="100">
            <Text as="p" variant="headingLg">{reviews.length}</Text>
            <Text as="p" variant="bodyMd" tone="subdued">
              {reviews.length !== totalReviews ? `Filtered from ${totalReviews} total` : "Total Reviews"}
            </Text>
          </BlockStack>
          <RatingStars rating={average} />
        </InlineStack>

        <Badge tone={reviews.length > 0 ? "success" : "info"}>
          <InlineStack gap="100" align="center">
            <Icon source={ArrowUpIcon} />
            {reviews.length} reviews shown
          </InlineStack>
        </Badge>
      </BlockStack>
    </Card>
  );

  return (
    <Page>
      <BlockStack gap="400">
        <BlockStack gap="200">
          <p style={headerStyles.title}>Reviews Dashboard</p>
          <p style={headerStyles.subtitle}>Monitor and manage customer feedback</p>
        </BlockStack>

        <Layout>
          <Layout.Section variant="fullWidth">
            <Layout>
              {/* Row 1 */}
              <Layout.Section variant="oneHalf">
                <AnalyticsCard
                  title="Total Reviews"
                  value={reviewAnalytics.totalReviews}
                  subtitle="All reviews combined"
                  trend={reviewAnalytics.trend}
                  icon={StarIcon}
                />
              </Layout.Section>
              <Layout.Section variant="oneHalf">
                <AnalyticsCard
                  title="Average Rating"
                  value={reviewAnalytics.avgRating.toFixed(1)}
                  subtitle="Overall satisfaction"
                  trend={0}
                  icon={StarIcon}
                  color="warning"
                />
              </Layout.Section>

              {/* Row 2 */}
              <Layout.Section variant="oneHalf">
                <AnalyticsCard
                  title="Recommendation Rate"
                  value={`${reviewAnalytics.recommendationRate.toFixed(1)}%`}
                  subtitle="Products recommended"
                  trend={0}
                  icon={ThumbsUpIcon}
                  color="success"
                />
              </Layout.Section>
              <Layout.Section variant="oneHalf">
                <AnalyticsCard
                  title="Reviews with Images"
                  value={`${reviewAnalytics.imageRate.toFixed(1)}%`}
                  subtitle={`${reviewAnalytics.reviewsWithImages} total`}
                  trend={0}
                  icon={ImageIcon}
                  color="info"
                />
              </Layout.Section>
            </Layout>
          </Layout.Section>

          <Layout.Section variant="fullWidth">
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between">
                  <InlineStack gap="200" align="center">
                    <Icon source={FilterIcon} />
                    <Text as="h3" variant="headingMd">Filters & Controls</Text>
                  </InlineStack>
                  <ButtonGroup>
                    <Button
                      icon={FilterIcon}
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      {showFilters ? 'Hide' : 'Show'} Filters
                    </Button>
                    <Button
                      icon={ExportIcon}
                      onClick={() => setExportModalActive(true)}
                    >
                      Export
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleClearFilters}
                    >
                      Clear All Filters
                    </Button>
                  </ButtonGroup>
                </InlineStack>

                <TextField
                  label="Search Reviews"
                  value={searchValue}
                  onChange={setSearchValue}
                  placeholder="Search by name, email, or review content..."
                  prefix={<Icon source={SearchIcon} />}
                  clearButton
                  onClearButtonClick={() => setSearchValue("")}
                />

                {showFilters && (
                  <Layout>
                    <Layout.Section variant="oneQuarter">
                      <Select
                        label="Time Range"
                        options={timeRangeOptions}
                        onChange={setSelectedTimeRange}
                        value={selectedTimeRange}
                      />
                    </Layout.Section>
                    <Layout.Section variant="oneQuarter">
                      <Select
                        label="Rating Filter"
                        options={ratingOptions}
                        onChange={setSelectedRating}
                        value={selectedRating}
                      />
                    </Layout.Section>
                    <Layout.Section variant="oneQuarter">
                      <Select
                        label="Sort Order"
                        options={sortOptions}
                        onChange={setSortOrder}
                        value={sortOrder}
                      />
                    </Layout.Section>
                  </Layout>
                )}

                {showFilters && (
                  <Layout>
                    <Layout.Section variant="oneThird">
                      <Select
                        label="Recommendation Filter (Product Reviews)"
                        options={recommendationOptions}
                        onChange={setSelectedRecommendation}
                        value={selectedRecommendation}
                      />
                    </Layout.Section>
                  </Layout>
                )}

                {(selectedTimeRange !== "all" || selectedRating !== "all" || selectedRecommendation !== "all" || selectedProduct !== "all" || searchValue) && (
                  <BlockStack gap="200">
                    <Text as="h4" variant="headingSm">Active Filters:</Text>
                    <InlineStack gap="200">
                      {selectedTimeRange !== "all" && (
                        <Badge onAction={() => setSelectedTimeRange("all")}>
                          Time: {timeRangeOptions.find(opt => opt.value === selectedTimeRange)?.label}
                        </Badge>
                      )}
                      {selectedRating !== "all" && (
                        <Badge onAction={() => setSelectedRating("all")}>
                          Rating: {selectedRating} Stars
                        </Badge>
                      )}
                      {selectedRecommendation !== "all" && (
                        <Badge onAction={() => setSelectedRecommendation("all")}>
                          Rec: {selectedRecommendation === "true" ? "Yes" : "No"}
                        </Badge>
                      )}
                      {selectedProduct !== "all" && (
                        <Badge onAction={() => setSelectedProduct("all")}>
                          Product: {productOptions.find(opt => opt.value === selectedProduct)?.label}
                        </Badge>
                      )}
                      {searchValue && (
                        <Badge onAction={() => setSearchValue("")}>
                          Search: "{searchValue}"
                        </Badge>
                      )}
                    </InlineStack>
                  </BlockStack>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section variant="fullWidth">
            <Layout>
              <Layout.Section variant="oneHalf">
                <ReviewCard
                  title="Product Reviews"
                  reviews={filteredProductReviews}
                  totalReviews={data?.pagination?.totalReviews}
                  average={filteredProductAverage}
                />
              </Layout.Section>
              <Layout.Section variant="oneHalf">
                <ReviewCard
                  title="Store Reviews"
                  reviews={filteredStoreReviews}
                  totalReviews={storeReviewData?.totalReviews}
                  average={filteredStoreAverage}
                />
              </Layout.Section>
            </Layout>
          </Layout.Section>

          <Layout.Section variant="fullWidth">
            <Layout>
              <Layout.Section variant="oneHalf">
                <RecentReviews
                  reviews={filteredProductReviews}
                  title="Recent Product Reviews"
                  type="product"
                />
              </Layout.Section>
              <Layout.Section variant="oneHalf">
                <RecentReviews
                  reviews={filteredStoreReviews}
                  title="Recent Store Reviews"
                  type="store"
                />
              </Layout.Section>
            </Layout>
          </Layout.Section>

          <Layout.Section variant="fullWidth">
            <Layout>
              <Layout.Section variant="oneHalf">
                <SimpleLineChart data={productReviewTrendData} title="Product Review Trends" />
              </Layout.Section>
              <Layout.Section variant="oneHalf">
                <SimpleLineChart data={storeReviewTrendData} title="Store Review Trends" />
              </Layout.Section>
            </Layout>
          </Layout.Section>

          <Layout.Section variant="fullWidth">
            <Layout>
              <Layout.Section variant="oneHalf">
                <RatingDistributionChart data={productRatingDistribution} title="Product Rating Distribution" />
              </Layout.Section>
              <Layout.Section variant="oneHalf">
                <RatingDistributionChart data={storeRatingDistribution} title="Store Rating Distribution" />
              </Layout.Section>
            </Layout>
          </Layout.Section>

          <Layout.Section variant="fullWidth">
            <Card>
              <BlockStack gap="300">
                <Text as="h3" variant="headingMd">Review Statistics</Text>
                <Divider />
                <Layout>
                  <Layout.Section variant="oneThird">
                    <BlockStack gap="200">
                      <Text as="h4" variant="headingSm">Response Rate</Text>
                      <BlockStack gap="100">
                        <InlineStack align="space-between">
                          <Text variant="bodyMd">Product Reviews</Text>
                          <Text variant="bodyMd" fontWeight="semibold">
                            {filteredProductReviews.length > 0 ?
                              `${((filteredProductReviews.filter(r => r.reviewText || r.reviewMessage).length / filteredProductReviews.length) * 100).toFixed(1)}%` :
                              '0%'
                            }
                          </Text>
                        </InlineStack>
                        <InlineStack align="space-between">
                          <Text variant="bodyMd">Store Reviews</Text>
                          <Text variant="bodyMd" fontWeight="semibold">
                            {filteredStoreReviews.length > 0 ?
                              `${((filteredStoreReviews.filter(r => r.reviewText || r.reviewMessage).length / filteredStoreReviews.length) * 100).toFixed(1)}%` :
                              '0%'
                            }
                          </Text>
                        </InlineStack>
                      </BlockStack>
                    </BlockStack>
                  </Layout.Section>
                  <Layout.Section variant="oneThird">
                    <BlockStack gap="200">
                      <Text as="h4" variant="headingSm">Review Quality</Text>
                      <BlockStack gap="100">
                        <InlineStack align="space-between">
                          <Text variant="bodyMd">With Images</Text>
                          <Text variant="bodyMd" fontWeight="semibold">
                            {reviewAnalytics.reviewsWithImages}
                          </Text>
                        </InlineStack>
                        <InlineStack align="space-between">
                          <Text variant="bodyMd">Detailed Reviews</Text>
                          <Text variant="bodyMd" fontWeight="semibold">
                            {[...filteredProductReviews, ...filteredStoreReviews].filter(r =>
                              (r.reviewText || r.reviewMessage || '').length > 50
                            ).length}
                          </Text>
                        </InlineStack>
                      </BlockStack>
                    </BlockStack>
                  </Layout.Section>
                  <Layout.Section variant="oneThird">
                    <BlockStack gap="200">
                      <Text as="h4" variant="headingSm">Engagement</Text>
                      <BlockStack gap="100">
                        <InlineStack align="space-between">
                          <Text variant="bodyMd">Active Reviews</Text>
                          <Text variant="bodyMd" fontWeight="semibold">
                            {[...filteredProductReviews, ...filteredStoreReviews].filter(r => r.isActive).length}
                          </Text>
                        </InlineStack>
                        <InlineStack align="space-between">
                          <Text variant="bodyMd">This Month</Text>
                          <Text variant="bodyMd" fontWeight="semibold">
                            {[...filteredProductReviews, ...filteredStoreReviews].filter(r => {
                              const reviewDate = new Date(r.createdAt);
                              const currentDate = new Date();
                              return reviewDate.getMonth() === currentDate.getMonth() &&
                                reviewDate.getFullYear() === currentDate.getFullYear();
                            }).length}
                          </Text>
                        </InlineStack>
                      </BlockStack>
                    </BlockStack>
                  </Layout.Section>
                </Layout>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        <ExportModal />
      </BlockStack>
    </Page>
  );
}

export default CardsOfDashboard;