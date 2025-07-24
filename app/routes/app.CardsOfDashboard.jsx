import { useNavigate, useNavigation } from "@remix-run/react";
import {
  Badge,
  BlockStack,
  Box,
  Button,
  Card,
  Divider,
  Icon,
  InlineStack,
  Layout,
  Page,
  Select,
  Spinner,
  Text
} from "@shopify/polaris";
import { ArrowUpIcon, StarIcon } from "@shopify/polaris-icons";
import { useCallback, useMemo, useState } from "react";

function CardsOfDashboard({ data, storeReviewData }) {

  const navigation = useNavigation();
  const navigate = useNavigate();
  const isPageLoading = navigation.state === "loading";

  const [selectedTimeRange, setSelectedTimeRange] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedRecommendation, setSelectedRecommendation] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchValue, setSearchValue] = useState("");
  const [dateRange, setDateRange] = useState({ start: null, end: null });

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
        default: return 0;
      }
    });

    return filtered;
  }, [selectedTimeRange, selectedRating, selectedRecommendation, sortOrder, searchValue, dateRange, getDateFromTimeRange]);

  const filteredStoreReviews = useMemo(() =>
    filterReviews(storeReviewData?.reviews, "store"),
    [storeReviewData?.reviews, filterReviews]
  );

  const filteredProductReviews = useMemo(() =>
    filterReviews(data?.reviews, "product"),
    [data?.reviews, filterReviews]
  );

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
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
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
                    fill="url(#gradient)"
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

  const handleNavigateToReviews = useCallback(() => {
    navigate("/app/manageReviews");
  }, [navigate]);

  const handleClearFilters = useCallback(() => {
    setSelectedTimeRange("all");
    setSelectedRating("all");
    setSelectedRecommendation("all");
    setSortOrder("newest");
    setSearchValue("");
    setDateRange({ start: null, end: null });
  }, []);

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
      <p style={headerStyles.title}>Reviews Dashboard</p>
      <p style={headerStyles.subtitle}>Monitor and manage customer feedback</p>

      <Layout>
        <Layout.Section variant="fullWidth">
          <Card>
            <BlockStack gap="400">
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <Text as="h3" variant="headingMd">Filters & Controls</Text>
                <Button variant="primary" onClick={handleClearFilters}>Clear All Filters</Button>
              </div>

              <Layout>
                <Layout.Section variant="oneThird">
                  <Select
                    label="Time Range"
                    options={timeRangeOptions}
                    onChange={setSelectedTimeRange}
                    value={selectedTimeRange}
                  />
                </Layout.Section>
                <Layout.Section variant="oneThird">
                  <Select
                    label="Rating Filter"
                    options={ratingOptions}
                    onChange={setSelectedRating}
                    value={selectedRating}
                  />
                </Layout.Section>
                <Layout.Section variant="oneThird">
                  <Select
                    label="Recommendation Filter (Product Reviews)"
                    options={recommendationOptions}
                    onChange={setSelectedRecommendation}
                    value={selectedRecommendation}
                  />
                </Layout.Section>
              </Layout>
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
      </Layout>
    </Page>
  );
}

export default CardsOfDashboard;