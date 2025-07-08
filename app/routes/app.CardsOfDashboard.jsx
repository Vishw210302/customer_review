import { useNavigate, useNavigation } from "@remix-run/react";
import {
  Badge,
  BlockStack,
  Box,
  Button,
  Card,
  ChoiceList,
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

  console.log("datadatadatadata", data)
  console.log("storeReviewData", storeReviewData)

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
    { label: "Last 6 Months", value: "6months" },
    { label: "Last Year", value: "1year" },
    { label: "Custom Range", value: "custom" },
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

  const getDateFromTimeRange = (range) => {
    const now = new Date();
    switch (range) {
      case "7days":
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case "30days":
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case "90days":
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case "6months":
        return new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
      case "1year":
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default:
        return null;
    }
  };

  const filterReviews = useCallback((reviews, type = "store") => {
    if (!reviews) return [];

    let filtered = [...reviews];

    if (selectedTimeRange !== "all") {
      const cutoffDate = selectedTimeRange === "custom" ? dateRange.start : getDateFromTimeRange(selectedTimeRange);
      const endDate = selectedTimeRange === "custom" ? dateRange.end : new Date();

      if (cutoffDate) {
        filtered = filtered.filter(review => {
          const reviewDate = new Date(review.createdAt);
          return reviewDate >= cutoffDate && reviewDate <= endDate;
        });
      }
    }

    if (selectedRating !== "all") {
      filtered = filtered.filter(review => review.rating.toString() === selectedRating);
    }

    if (type === "product" && selectedRecommendation !== "all") {
      filtered = filtered.filter(review =>
        review.recommend?.toString() === selectedRecommendation
      );
    }

    if (searchValue) {
      filtered = filtered.filter(review =>
        review.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
        review.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
        review.reviewTitle?.toLowerCase().includes(searchValue.toLowerCase()) ||
        review.reviewMessage?.toLowerCase().includes(searchValue.toLowerCase()) ||
        review.reviewText?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      switch (sortOrder) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "rating_desc":
          return b.rating - a.rating;
        case "rating_asc":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedTimeRange, selectedRating, selectedRecommendation, sortOrder, searchValue, dateRange]);

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
    const trendData = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = months[date.getMonth()];
      const reviewCount = reviews.filter(review => {
        const reviewDate = new Date(review.createdAt);
        return reviewDate.getMonth() === date.getMonth() && reviewDate.getFullYear() === date.getFullYear();
      }).length;

      trendData.push({
        month: monthName,
        reviews: reviewCount,
        year: date.getFullYear(),
      });
    }

    return trendData;
  }, []);

  const generateRatingDistribution = useCallback((reviews) => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach(review => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });

    const total = reviews.length;
    return Object.entries(distribution).reverse().map(([rating, count]) => ({
      rating: `${rating}★`,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));
  }, []);

  const storeReviewTrendData = useMemo(() =>
    generateTrendData(filteredStoreReviews),
    [filteredStoreReviews, generateTrendData]
  );

  const productReviewTrendData = useMemo(() =>
    generateTrendData(filteredProductReviews),
    [filteredProductReviews, generateTrendData]
  );

  const storeRatingDistribution = useMemo(() =>
    generateRatingDistribution(filteredStoreReviews),
    [filteredStoreReviews, generateRatingDistribution]
  );

  const productRatingDistribution = useMemo(() =>
    generateRatingDistribution(filteredProductReviews),
    [filteredProductReviews, generateRatingDistribution]
  );

  const calculateAverage = useCallback((reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  }, []);

  const filteredStoreAverage = useMemo(() =>
    calculateAverage(filteredStoreReviews),
    [filteredStoreReviews, calculateAverage]
  );

  const filteredProductAverage = useMemo(() =>
    calculateAverage(filteredProductReviews),
    [filteredProductReviews, calculateAverage]
  );

  const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating);
    return (
      <InlineStack gap="100" align="center">
        <InlineStack gap="050">
          {[...Array(5)].map((_, index) => (
            <Text
              key={index}
              as="span"
              tone={index < fullStars ? "warning" : "subdued"}
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
  };

  const SimpleLineChart = ({ data, title }) => {
    const maxValue = Math.max(...data.map(item => item.reviews), 1);

    return (
      <Card>
        <BlockStack gap="300">
          <Text as="h3" variant="headingMd">
            {title}
          </Text>
          <div style={{ height: "200px", position: "relative" }}>
            <svg width="100%" height="100%" viewBox="0 0 400 160">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0066cc" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0066cc" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="40"
                  y1={40 + i * 25}
                  x2="380"
                  y2={40 + i * 25}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}

              {data.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#0066cc"
                  strokeWidth="2"
                  points={data
                    .map((item, index) => {
                      const x = 60 + (index * 280) / (data.length - 1);
                      const y = 140 - (item.reviews / maxValue) * 80;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                />
              )}

              {data.length > 1 && (
                <polygon
                  fill="url(#gradient)"
                  points={`60,140 ${data
                    .map((item, index) => {
                      const x = 60 + (index * 280) / (data.length - 1);
                      const y = 140 - (item.reviews / maxValue) * 80;
                      return `${x},${y}`;
                    })
                    .join(" ")} ${60 + (280 * (data.length - 1)) / (data.length - 1)},140`}
                />
              )}

              {data.map((item, index) => {
                const x = data.length === 1 ? 200 : 60 + (index * 280) / (data.length - 1);
                const y = 140 - (item.reviews / maxValue) * 80;
                return (
                  <g key={index}>
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#0066cc"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text
                      x={x}
                      y={y - 10}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#0066cc"
                      fontWeight="bold"
                    >
                      {item.reviews}
                    </text>
                  </g>
                );
              })}

              {data.map((item, index) => {
                const x = data.length === 1 ? 200 : 60 + (index * 280) / (data.length - 1);
                return (
                  <text
                    key={index}
                    x={x}
                    y="155"
                    textAnchor="middle"
                    fontSize="12"
                    fill="#6b7280"
                  >
                    {item.month}
                  </text>
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
        <Text as="h3" variant="headingMd">
          {title}
        </Text>
        <BlockStack gap="200">
          {data.map((item, index) => (
            <InlineStack key={index} gap="300" align="center">
              <Box minWidth="40px">
                <Text as="span" variant="bodyMd">
                  {item.rating}
                </Text>
              </Box>
              <Box style={{ flex: 1 }}>
                <div
                  style={{
                    width: "100%",
                    height: "20px",
                    backgroundColor: "#f3f4f6",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${item.percentage}%`,
                      height: "100%",
                      backgroundColor: "#0066cc",
                      transition: "width 0.3s ease",
                    }}
                  />
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

  const handleNavigateProductReviewCard = () => {
    navigate("/app/crudeOperation");
  };

  const handleNavigateStoreReviewPage = () => {
    navigate("/app/crudeOperation");
  };

  const handleClearFilters = () => {
    setSelectedTimeRange("all");
    setSelectedRating("all");
    setSelectedRecommendation("all");
    setSortOrder("newest");
    setSearchValue("");
    setDateRange({ start: null, end: null });
  };

  const appliedFilters = [];

  if (selectedTimeRange !== "all") {
    appliedFilters.push({
      key: "timeRange",
      label: `Time: ${timeRangeOptions.find(opt => opt.value === selectedTimeRange)?.label}`,
      onRemove: () => setSelectedTimeRange("all"),
    });
  }
  if (selectedRating !== "all") {
    appliedFilters.push({
      key: "rating",
      label: `Rating: ${ratingOptions.find(opt => opt.value === selectedRating)?.label}`,
      onRemove: () => setSelectedRating("all"),
    });
  }
  if (selectedRecommendation !== "all") {
    appliedFilters.push({
      key: "recommendation",
      label: `Recommendation: ${recommendationOptions.find(opt => opt.value === selectedRecommendation)?.label}`,
      onRemove: () => setSelectedRecommendation("all"),
    });
  }
  if (searchValue) {
    appliedFilters.push({
      key: "search",
      label: `Search: ${searchValue}`,
      onRemove: () => setSearchValue(""),
    });
  }
  if (isPageLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spinner accessibilityLabel="Loading dashboard" size="large" />
      </div>
    );
  }

  const headerStyles = {
    title: {
      fontSize: "21px",
      color: "#3c3a3a",
      fontWeight: 600,
      margin: "0 0 5px 0"
    },
    subtitle: {
      fontSize: "16px",
      color: "#6B7280",
      margin: "0 0 10px 0",
    }
  }

  return (
    <Page>
      <p style={headerStyles.title}>
        Reviews Dashboard
      </p>
      <p style={headerStyles.subtitle}>
        Monitor and manage customer feedback
      </p>
      <Layout>
        <Layout.Section variant="fullWidth">
          <Card>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <div>
                    <InlineStack gap="200">
                      Filters & Controls
                    </InlineStack>
                  </div>
                  <Button variant="primary" onClick={handleClearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              </Text>

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
              <Card>
                <BlockStack gap="300">
                  <InlineStack align="space-between">
                    <InlineStack gap="200" align="center">
                      <Icon source={StarIcon} tone="warning" />
                      <Text as="h3" variant="headingMd">
                        Product Reviews
                      </Text>
                    </InlineStack>
                    <Button
                      variant="plain"
                      onClick={handleNavigateProductReviewCard}
                    >
                      View all
                    </Button>
                  </InlineStack>

                  <Divider />

                  <InlineStack align="space-between">
                    <BlockStack gap="100">
                      <Text as="p" variant="headingLg">
                        {filteredProductReviews.length}
                      </Text>
                      <Text as="p" variant="bodyMd" tone="subdued">
                        {filteredProductReviews.length !== data?.pagination?.totalReviews ?
                          `Filtered from ${data?.pagination?.totalReviews} total` :
                          "Total Reviews"
                        }
                      </Text>
                    </BlockStack>
                    <RatingStars rating={filteredProductAverage} />
                  </InlineStack>

                  <InlineStack gap="200">
                    <Badge tone={filteredProductReviews.length > 0 ? "success" : "info"}>
                      <InlineStack gap="100">
                        <Icon source={ArrowUpIcon} />
                        {filteredProductReviews.length} reviews shown
                      </InlineStack>
                    </Badge>
                  </InlineStack>
                </BlockStack>
              </Card>
            </Layout.Section>

            <Layout.Section variant="oneHalf">
              <Card>
                <BlockStack gap="300">
                  <InlineStack align="space-between">
                    <InlineStack gap="100">
                      <Icon source={StarIcon} tone="warning" />
                      <Text as="h3" variant="headingMd">
                        Store Reviews
                      </Text>
                    </InlineStack>
                    <Button
                      variant="plain"
                      onClick={handleNavigateStoreReviewPage}
                    >
                      View all
                    </Button>
                  </InlineStack>

                  <Divider />

                  <InlineStack align="space-between">
                    <BlockStack gap="100">
                      <Text as="p" variant="headingLg">
                        {filteredStoreReviews.length}
                      </Text>
                      <Text as="p" variant="bodyMd" tone="subdued">
                        {filteredStoreReviews.length !== storeReviewData?.totalReviews ?
                          `Filtered from ${storeReviewData?.totalReviews} total` :
                          "Total Reviews"
                        }
                      </Text>
                    </BlockStack>
                    <RatingStars rating={filteredStoreAverage} />
                  </InlineStack>

                  <InlineStack gap="200">
                    <Badge tone={filteredStoreReviews.length > 0 ? "success" : "info"}>
                      <InlineStack gap="100" align="center">
                        <Icon source={ArrowUpIcon} />
                        {filteredStoreReviews.length} reviews shown
                      </InlineStack>
                    </Badge>
                  </InlineStack>
                </BlockStack>
              </Card>
            </Layout.Section>
          </Layout>
        </Layout.Section>

        <Layout.Section variant="fullWidth">
          <Layout>
            <Layout.Section variant="oneHalf">
              <SimpleLineChart
                data={productReviewTrendData}
                title="Product Review Trends"
              />
            </Layout.Section>
            <Layout.Section variant="oneHalf">
              <SimpleLineChart
                data={storeReviewTrendData}
                title="Store Review Trends"
              />
            </Layout.Section>
          </Layout>
        </Layout.Section>

        <Layout.Section variant="fullWidth">
          <Layout>
            <Layout.Section variant="oneHalf">
              <RatingDistributionChart
                data={productRatingDistribution}
                title="Product Rating Distribution"
              />
            </Layout.Section>
            <Layout.Section variant="oneHalf">
              <RatingDistributionChart
                data={storeRatingDistribution}
                title="Store Rating Distribution"
              />
            </Layout.Section>
          </Layout>
        </Layout.Section>

      </Layout>
    </Page>
  );
}

export default CardsOfDashboard;