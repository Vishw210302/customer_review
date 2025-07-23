import { json } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { Card, Page, Spinner, Tabs, Text } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { authenticate } from "../shopify.server";
import GenericPreview from "./modals/GenericPreview";
import ProductRatingWidget from "./modals/ProductRatingWidget";
import StoreReviewPreview from "./modals/StoreReviewPreview";

const THEME_QUERY = `
  query {
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

const SHOP_QUERY = `
  query {
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
  }
`;

const makeGraphQLRequest = async (shop, accessToken, query) => {
  const response = await fetch(`https://${shop}/admin/api/2025-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: JSON.stringify({ query }),
  });
  return response.json();
};

const callRatingConfigAPI = async (storeName) => {
  try {
    const response = await fetch('https://def94b3b3985.ngrok-free.app/api/ratingConfig', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'abcdefg',
        'ngrok-skip-browser-warning': true,
      },
      body: JSON.stringify({
        storeName: storeName
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling rating config API:', error);
    throw error;
  }
};

const callStoreReviewSettingAPI = async (storeName) => {
  try {
    const response = await fetch('https://def94b3b3985.ngrok-free.app/api/storeReviewSetting', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'abcdefg',
        'ngrok-skip-browser-warning': true,
      },
      body: JSON.stringify({
        storeName: storeName
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling store review setting API:', error);
    throw error;
  }
};

const callReviewSettingsAPI = async (storeName) => {
  try {
    const response = await fetch('https://def94b3b3985.ngrok-free.app/api/reviewSettings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'abcdefg',
        'ngrok-skip-browser-warning': true,
      },
      body: JSON.stringify({
        storeName: storeName
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling review settings API:', error);
    throw error;
  }
};

export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
  const { accessToken, shop } = session;
  const blockId = process.env.SHOPIFY_REVIEW_ID;

  try {

    const [themeData, shopDataResponse] = await Promise.all([
      makeGraphQLRequest(shop, accessToken, THEME_QUERY),
      makeGraphQLRequest(shop, accessToken, SHOP_QUERY),
    ]);

    const themeNames = themeData?.data?.themes?.edges || [];
    const activeTheme = themeNames.find(theme => theme.node.role === "MAIN")?.node || null;
    const shopData = shopDataResponse?.data?.shop;

    let ratingConfigData = null;
    let storeReviewSettingData = null;
    let reviewSettingsData = null;

    if (shopData?.myshopifyDomain) {
      try {
        const [ratingConfig, storeReviewSetting, reviewSettings] = await Promise.all([
          callRatingConfigAPI(shopData.myshopifyDomain),
          callStoreReviewSettingAPI(shopData.myshopifyDomain),
          callReviewSettingsAPI(shopData.myshopifyDomain),
        ]);
        ratingConfigData = ratingConfig;
        storeReviewSettingData = storeReviewSetting;
        reviewSettingsData = reviewSettings;
      } catch (error) {
        console.error('Failed to call API(s):', error);
      }
    }

    if (shopData) {
      const metafieldUpdateResponse = await admin.graphql(`
        mutation {
          metafieldsSet(metafields: [
            {
               ownerId: "${shopData.id}",
               namespace: "accesstoken",
               key: "token",
               value: "${accessToken}",
               type: "string"
            },
            {
               ownerId: "${shopData.id}",
               namespace: "blockID",
               key: "blockID",
               value: "${blockId}",
               type: "string"
            },
            {
               ownerId: "${shopData.id}",
               namespace: "shopName",
               key: "shopName",
               value: "${shopData.myshopifyDomain}",
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
    }

    return json({
      themeNames,
      activeTheme,
      session,
      blockId,
      shopData,
      ratingConfigData,
      storeReviewSettingData,
      reviewSettingsData,
    });
  } catch (error) {
    console.error("Loader error:", error);
    return json({
      themeNames: [],
      activeTheme: null,
      session,
      blockId,
      shopData: null,
      ratingConfigData: null,
      storeReviewSettingData: null,
      reviewSettingsData: null,
    });
  }
};

const TABS = [
  { id: "generic", content: "Generic Widget" },
  { id: "store-review", content: "Store Review Widget" },
  { id: "product-rating", content: "Product Rating Widget" },
];

const WIDGET_CONFIGS = {
  0: {
    component: GenericPreview,
    blockType: "custom-block",
    target: "section",
    template: "product"
  },
  1: {
    component: StoreReviewPreview,
    blockType: "store-review",
    target: "body",
    template: "product"
  },
  2: {
    component: ProductRatingWidget,
    blockType: "particular-product",
    target: "mainSection",
    template: "product"
  }
};

const styles = {
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#e3e3e3",
    height: "100vh",
  },
  errorContainer: {
    padding: "20px",
    backgroundColor: "#fde8e8",
    borderRadius: "8px",
    color: "#c53030",
    marginBottom: "20px",
  },
  titleStyle: {
    marginBottom: "30px"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "auto",
    padding: "16px",
  },
  button: {
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
  },
  tabContent: {
    padding: "16px"
  }
};

const ThemeStatus = () => {

  const { activeTheme, session, blockId, shopData, ratingConfigData, storeReviewSettingData, reviewSettingsData } = useLoaderData();
  const [selectedTheme, setSelectedTheme] = useState(null);
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState(0);
  const isPageLoading = navigation.state === "loading";

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

  const handleRatingConfigUpdate = async () => {
    if (shopData?.myshopifyDomain) {
      try {
        const response = await fetch('https://def94b3b3985.ngrok-free.app/api/ratingConfig', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'abcdefg',
            'ngrok-skip-browser-warning': true,
          },
          body: JSON.stringify({
            storeName: shopData.myshopifyDomain
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error updating rating config:', error);
      }
    }
  };

  const handleStoreReviewSettingUpdate = async () => {
    if (shopData?.myshopifyDomain) {
      try {
        const response = await fetch('https://def94b3b3985.ngrok-free.app/api/storeReviewSetting', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'abcdefg',
            'ngrok-skip-browser-warning': true,
          },
          body: JSON.stringify({
            storeName: shopData.myshopifyDomain
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error updating store review setting:', error);
      }
    }
  };

  const handleReviewSettingsUpdate = async () => {
    if (shopData?.myshopifyDomain) {
      try {
        const response = await fetch('https://def94b3b3985.ngrok-free.app/api/reviewSettings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'abcdefg',
            'ngrok-skip-browser-warning': true,
          },
          body: JSON.stringify({
            storeName: shopData.myshopifyDomain
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error updating review settings:', error);
      }
    }
  };

  const handleWidgetInstallClick = async () => {
    const promises = [];

    if (shopData?.myshopifyDomain) {
      promises.push(handleRatingConfigUpdate());
      promises.push(handleStoreReviewSettingUpdate());
      promises.push(handleReviewSettingsUpdate());
    }

    try {
      await Promise.all(promises);
    } catch (error) {
      console.error('Error updating API configurations:', error);
    }
  };

  if (isPageLoading) {
    return (
      <div style={styles.loadingContainer}>
        <Spinner accessibilityLabel="Loading widgets" size="large" />
      </div>
    );
  }

  if (!selectedTheme) {
    return (
      <Page fullWidth>
        <Card sectioned>
          <Text variant="headingLg" as="h1" style={styles.titleStyle}>
            Widget Gallery
          </Text>
          <div style={styles.errorContainer}>
            <p>
              No active theme found. Please make sure your Shopify store has an
              active theme.
            </p>
          </div>
        </Card>
      </Page>
    );
  }

  const themeId = selectedTheme.split("/").pop();

  const renderTabContent = () => {
    const config = WIDGET_CONFIGS[selectedTab];
    if (!config) return null;

    const Component = config.component;
    const installUrl = `https://${session?.shop}/admin/themes/${themeId}/editor?template=${config.template}&addAppBlockId=${blockId}/${config.blockType}&target=${config.target}`;

    return (
      <>
        <Component />
        <div style={styles.buttonContainer}>
          <a
            target="_blank"
            href={installUrl}
            style={styles.button}
            rel="noopener noreferrer"
            onClick={handleWidgetInstallClick}
          >
            Install Widget
          </a>
        </div>
      </>
    );
  };

  return (
    <Page fullWidth>
      <Card sectioned>
        <div style={styles.titleStyle}>
          <Text variant="headingLg" as="h5">
            Widget Gallery
          </Text>
          {ratingConfigData && (
            <div style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
              Rating Config: {JSON.stringify(ratingConfigData)}
            </div>
          )}
          {storeReviewSettingData && (
            <div style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
              Store Review Setting: {JSON.stringify(storeReviewSettingData)}
            </div>
          )}
          {reviewSettingsData && (
            <div style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
              Review Settings: {JSON.stringify(reviewSettingsData)}
            </div>
          )}
        </div>

        <Tabs
          tabs={TABS}
          selected={selectedTab}
          onSelect={setSelectedTab}
        >
          <style jsx>
            {`.Polaris-Tabs {
                gap: 15px;
              }
              .Polaris-Tabs__Tab:not(.Polaris-Tabs__Tab--selected) {
                border-bottom: 2px solid #ccc;
              }`}
          </style>
          <div style={styles.tabContent}>
            {renderTabContent()}
          </div>
        </Tabs>
      </Card>
    </Page>
  );
};

export default ThemeStatus;