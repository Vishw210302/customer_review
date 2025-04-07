import { useNavigation, useNavigate } from "@remix-run/react";
import { Spinner } from "@shopify/polaris";
import React from "react";

function CardsOfDashboard({ data, storeReviewData }) {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isPageLoading = navigation.state === "loading";

  const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating);

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            style={{
              color: index < fullStars ? "#FFB800" : "#D1D5DB",
              fontSize: "18px",
              marginRight: "2px",
            }}
          >
            ★
          </span>
        ))}
        <span
          style={{ marginLeft: "4px", fontWeight: "600", fontSize: "14px" }}
        >
          {rating?.toFixed(1)}
        </span>
      </div>
    );
  };

  const cardStyles = {
    container: {
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow:
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      marginBottom: "24px",
    },
    header: {
      padding: "16px 20px",
      borderBottom: "1px solid #E5E7EB",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "10px",
    },
    title: {
      fontSize: "16px",
      fontWeight: "600",
      margin: 0,
      display: "flex",
      alignItems: "center",
    },
    headerIcon: {
      marginRight: "8px",
      color: "#4B5563",
    },
    content: {
      padding: "20px",
    },
    footer: {
      padding: "16px 20px",
      borderTop: "1px solid #E5E7EB",
      textAlign: "center",
    },
  };

  const layoutStyles = {
    container: {
      padding: "32px",
      backgroundColor: "#F3F4F6",
      minHeight: "calc(100vh - 76px)",
    },
    row: {
      display: "flex",
      flexWrap: "wrap",
    },
    column: {
      padding: "0 12px",
      marginBottom: "24px",
    },
    full: {
      width: "100%",
    },
  };

  const handleNavigateProductReviewCard = () => {
    navigate("/app/crudeOperation");
  };

  const handleNavigateStoreReviewPage = () => {
    navigate("/app/crudeOperation");
  };

  if (isPageLoading) {
    return (
      <div
        style={{
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

  return (
    <div style={layoutStyles.row}>
      <div style={{ ...layoutStyles.column, ...layoutStyles.third }}>
        <div style={cardStyles.container}>
          <div style={cardStyles.header}>
            <h3 style={cardStyles.title}>
              <span style={cardStyles.headerIcon}>★</span>
              Product Reviews
            </h3>
            <button
              style={{
                color: "#2563EB",
                fontSize: "14px",
                textDecoration: "none",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              onClick={handleNavigateProductReviewCard}
            >
              View all Product Reviews
            </button>
          </div>
          <div style={cardStyles.content}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "24px",
              }}
            >
              <div>
                <div style={{ fontSize: "20px", fontWeight: "700" }}>
                  {data?.pagination?.totalReviews}
                </div>
                <div style={{ fontSize: "14px", color: "#6B7280" }}>
                  Total Reviews
                </div>
              </div>
              <RatingStars rating={data?.averageRating} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...layoutStyles.column, ...layoutStyles.third }}>
        <div style={cardStyles.container}>
          <div style={cardStyles.header}>
            <h3 style={cardStyles.title}>
              <span style={cardStyles.headerIcon}>★</span>
              Store Reviews
            </h3>
            <button
              style={{
                color: "#2563EB",
                fontSize: "14px",
                textDecoration: "none",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              onClick={handleNavigateStoreReviewPage}
            >
              View all Store Reviews
            </button>
          </div>
          <div style={cardStyles.content}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "24px",
              }}
            >
              <div>
                <div style={{ fontSize: "20px", fontWeight: "700" }}>
                  {storeReviewData?.totalReviews}
                </div>
                <div style={{ fontSize: "14px", color: "#6B7280" }}>
                  Total Reviews
                </div>
              </div>
              <RatingStars rating={storeReviewData?.averageRating} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardsOfDashboard;
