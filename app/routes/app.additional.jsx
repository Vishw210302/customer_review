import { json } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { Card, Grid, Page, Spinner, Text } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { authenticate } from "../shopify.server";
import GenericPreview from "./modals/GenericPreview";
import ProductRatingWidget from "./modals/ProductRatingWidget";
import StoreReviewPreview from "./modals/StoreReviewPreview";

export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
  const accessToken = session.accessToken;
  const blockId = process.env.SHOPIFY_REVIEW_ID;
  let themeNames = [];
  let activeTheme = null;
  let shopData = null;

  const getActiveThemeQuery = `query {
      themes(first: 20) {
        edges {
          node {
            id
            name
            role
          }
        }
      }
    }
  `;

  const getShopDataQuery = `query {
    shop {
      id
      name
      myshopifyDomain
      primaryDomain {
        url
        host
      }
      plan {
        displayName
        partnerDevelopment
        shopifyPlus
      }
    }
  }`;

  try {
    const themeResponse = await fetch(
      `https://${session?.shop}/admin/api/2025-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
        body: JSON.stringify({
          query: getActiveThemeQuery,
        }),
      },
    );

    const themeData = await themeResponse.json();

    if (themeData?.data?.themes?.edges) {
      themeNames = themeData.data.themes.edges;
      activeTheme =
        themeData.data.themes.edges.find((theme) => theme.node.role === "MAIN")
          ?.node || null;
    }

    const shopResponse = await fetch(
      `https://${session?.shop}/admin/api/2025-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
        body: JSON.stringify({
          query: getShopDataQuery,
        }),
      },
    );

    const shopDataResponse = await shopResponse.json();
    const shopData = shopDataResponse?.data?.shop;
    const shopName = shopDataResponse?.data?.shop.myshopifyDomain;
    const blockID = process.env.SHOPIFY_REVIEW_ID;

    const metafieldUpdateResponse = await admin.graphql(`
      mutation {
        metafieldsSet(metafields: [
          {
             ownerId: "${shopData?.id}",
             namespace: "accesstoken",
             key: "token",
             value: "${accessToken}",
             type: "string"
          },
          {
             ownerId: "${shopData?.id}",
             namespace: "blockID",
             key: "blockID",
             value: "${blockID}",
             type: "string"
          },
          {
             ownerId: "${shopData?.id}",
             namespace: "shopName",
             key: "shopName",
             value: "${shopName}",
             type: "string"
          },
        ]) {
          metafields {
            id
          }
        }
      }
    `);

    if (metafieldUpdateResponse.errors) {
      console.error(
        "Error updating metafields:",
        metafieldUpdateResponse.errors,
      );
    }
  } catch (error) {
    console.log("error", error);
  }

  return json({
    themeNames,
    activeTheme,
    session,
    blockId,
    shopData,
  });
};

const ThemeStatus = () => {
  const { activeTheme, session, blockId } = useLoaderData();

  const [selectedTheme, setSelectedTheme] = useState(null);
  const navigate = useNavigation();
  const isPageLoading = navigate.state === "loading";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("Activetheme");
      if (storedTheme) {
        setSelectedTheme(storedTheme);
      } else if (activeTheme?.id) {
        setSelectedTheme(activeTheme?.id);
        localStorage.setItem("Activetheme", activeTheme?.id);
      }
    }
  }, [activeTheme]);

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

  if (!selectedTheme) {
    return (
      <Page fullWidth>
        <Card sectioned>
          <h1
            style={{
              fontSize: "24px",
              color: "#333",
              marginBottom: "25px",
              fontWeight: "bold",
            }}
          >
            Widget Gallery
          </h1>
          <div
            style={{
              padding: "20px",
              backgroundColor: "#fde8e8",
              borderRadius: "8px",
              color: "#c53030",
              marginBottom: "20px",
            }}
          >
            <p>
              No active theme found. Please make sure your Shopify store has an
              active theme.
            </p>
          </div>
        </Card>
      </Page>
    );
  }

  const themeId = selectedTheme?.split("/").pop();
 

  const cardStyle = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  };

  const cardContentStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "16px",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: "auto",
    padding: "16px",
  };

  const buttonStyle = {
    backgroundColor: "#000000",
    color: "white",
    border: "none",
    borderRadius: "50px",
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background 0.2s",
    textDecoration: "none",
    display: "inline-block",
    textAlign: "center",
  };
const titleStyle = {
  marginBottom: "30px"
};
  return (
    <Page fullWidth>
      <Card sectioned>
        <div style={titleStyle}>
        <Text variant="headingLg" as="h5">
          Widget Gallery
        </Text>
        </div>
        <Grid columns={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2 }} gap="4">
           <Grid.Cell>
            <div style={cardStyle}>
              <Card>
                <div style={cardContentStyle}>
                  <div style={{ flex: 1 }}>
                    <GenericPreview />
                  </div>
                  <div style={buttonContainerStyle}>
                    <a
                      target="_blank"
                      href={`https://${session?.shop}/admin/themes/${themeId}/editor?template=product&addAppBlockId=${blockId}/custom-block&target=section`}
                      style={buttonStyle}
                    >
                      Install Widget
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </Grid.Cell>
          <Grid.Cell>
            <div style={cardStyle}>
              <Card>
                <div style={cardContentStyle}>
                  <div style={{ flex: 1 }}>
                    <StoreReviewPreview />
                  </div>
                  <div style={buttonContainerStyle}>
                    <a
                      target="_blank"
                      href={`https://${session?.shop}/admin/themes/${themeId}/editor?template=product&addAppBlockId=${blockId}/store-review&target=body`}
                      style={buttonStyle}
                    >
                      Install Widget
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </Grid.Cell>
          <Grid.Cell>
            <div style={cardStyle}>
              <Card>
                <div style={cardContentStyle}>
                  <div style={{ flex: 1 }}>
                    <ProductRatingWidget />
                  </div>
                  <div style={buttonContainerStyle}>
                    <a
                      target="_blank"
                      href={`https://${session?.shop}/admin/themes/${themeId}/editor?template=product&addAppBlockId=${blockId}/particular-product&target=mainSection`}
                      style={buttonStyle}
                    >
                      Install Widget
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </Grid.Cell>

         

          
        </Grid>
      </Card>
    </Page>
  );
};

export default ThemeStatus;
