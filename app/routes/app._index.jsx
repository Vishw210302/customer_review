import { json } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import { Card, Grid, Page, Text } from '@shopify/polaris';
import React, { useEffect, useState } from 'react';
import { authenticate } from "../shopify.server";
import GenericPreview from './modals/GenericPreview';
import ProductRatingWidget from './modals/ProductRatingWidget';

export const loader = async ({ request }) => {

  const { session, admin } = await authenticate.admin(request);
  const accessToken = session.accessToken
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
      `https://${session.shop}/admin/api/2025-01/graphql.json`,
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
      activeTheme = themeData.data.themes.edges.find(
        (theme) => theme.node.role === "MAIN",
      )?.node || null;
    }

    const shopResponse = await fetch(
      `https://${session.shop}/admin/api/2025-01/graphql.json`,
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
        ]) {
          metafields {
            id
          }
        }
      }
    `);

    if (metafieldUpdateResponse.errors) {
      console.error("Error updating metafields:", metafieldUpdateResponse.errors);
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

const Index = () => {

  const { activeTheme, session, blockId } = useLoaderData();
  const [selectedTheme, setSelectedTheme] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("Activetheme");
      if (storedTheme) {
        setSelectedTheme(storedTheme);
      } else if (activeTheme?.id) {
        setSelectedTheme(activeTheme.id);
        localStorage.setItem("Activetheme", activeTheme.id);
      }
    }
  }, [activeTheme]);

  if (!selectedTheme) {
    return (
      <Page fullWidth>
        <Card sectioned>
          <h1 style={{ fontSize: "24px", color: "#333", marginBottom: "25px", fontWeight: "bold" }}>
            Widget Gallery
          </h1>
          <div style={{
            padding: "20px",
            backgroundColor: "#fde8e8",
            borderRadius: "8px",
            color: "#c53030",
            marginBottom: "20px"
          }}>
            <p>No active theme found. Please make sure your Shopify store has an active theme.</p>
          </div>
        </Card>
      </Page>
    );
  }

  const themeId = selectedTheme?.split("/").pop();

  const particularProductUrl = `https://${session.shop}/admin/themes/${themeId}/editor?template=product&addAppBlockId=${blockId}/particular-product&target=mainSection`;
  const starRatingUrl = `https://${session.shop}/admin/themes/${themeId}/editor?template=product&addAppBlockId=${blockId}/star-rating&target=section`;

  return (
    <Page fullWidth>
      <Card sectioned>
        <h1 style={{ fontSize: "24px", color: "#333", marginBottom: "25px", fontWeight: "bold" }}>
          Widget Gallery
        </h1>

        <Grid
          columns={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2 }}
          gap="4"
        >

          <Grid.Cell>
            <Card>
              <Text>
                Product Rating Widget
              </Text>
              <ProductRatingWidget />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <a
                  target="_blank"
                  href={particularProductUrl}
                  style={{
                    backgroundColor: "#2c3e50",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 16px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "background 0.2s",
                    textDecoration: "none",
                    display: "inline-block",
                    textAlign: "center"
                  }}
                >
                  Install Widget
                </a>
              </div>
            </Card>
          </Grid.Cell>

          <Grid.Cell>

            <Card>

              <GenericPreview />

              <div style={{ display: "flex", justifyContent: "center" }}>
                <a
                  target="_blank"
                  href={starRatingUrl}
                  style={{
                    backgroundColor: "#2c3e50",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 16px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "background 0.2s",
                    textDecoration: "none",
                    display: "inline-block",
                    textAlign: "center"
                  }}
                >
                  Install Widget
                </a>
              </div>
            </Card>
          </Grid.Cell>
        </Grid>
      </Card>
    </Page>
  );
};

export default Index;
