import { json } from "@remix-run/node";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import {
  Banner,
  BlockStack,
  Box,
  Button,
  Card,
  Grid,
  Icon,
  InlineStack,
  Layout,
  Page,
  RadioButton,
  SkeletonBodyText,
  SkeletonDisplayText,
  Text
} from "@shopify/polaris";
import {
  AlertTriangleIcon,
  CaretDownIcon,
  CaretUpIcon,
} from "@shopify/polaris-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const getActiveThemeQuery = `
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

  try {
    const themeResponse = await admin.graphql(getActiveThemeQuery);
    const themeData = await themeResponse.json();
    var themeNames = themeData.data.themes.edges;
    var activeTheme = themeData.data.themes.edges.find(
      (theme) => theme.node.role === "MAIN",
    )?.node;

    var blockID = process.env.SHOPIFY_REVIEW_ID;
  } catch (error) {
    console.error("error", error);
  }
  return json({
    themeNames: themeNames,
    activeTheme,
    session,
    blockID,
    appId: process.env.SHOPIFY_REVIEW_ID,
  });
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const activeThemeId = formData.get("activeThemeId");
  const response = await fetch(
    `https://${session.shop}/admin/api/2025-01/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": session.accessToken,
      },
      body: JSON.stringify({
        query: `
          query GetTheme($id: ID!) {
            theme(id: $id) {
              id
              name
              role
              files(filenames: ["config/settings_data.json"], first: 1) {
                nodes {
                  body {
                    ... on OnlineStoreThemeFileBodyText {
                      content
                    }
                  }
                }
              }
            }
          }
        `,
        variables: { id: activeThemeId },
      }),
    },
  );

  const appEmbedData = await response.json();
  if (appEmbedData.data.theme?.files) {
    const data = appEmbedData.data.theme.files?.nodes[0]?.body.content;
    const productSectionBlocks = JSON.parse(
      data.substring(data.indexOf("{")),
    ).current;
    var checkDisabled = true;

    if (typeof productSectionBlocks.blocks == "undefined") {
      checkDisabled = true;
    } else {
      Object.values(productSectionBlocks.blocks).find((item) => {
        if (item.type.includes(`customer-review`)) {
          checkDisabled = item.disabled;
        }
      });
    }
  } else {
    console.log("App Embed Not Active");
  }

  return json({
    checkDisabled,
    appEmbedData,
  });
};

const ThemeSelectionSkeleton = () => (
  <Card>
    <BlockStack gap="400" align="center">
      <InlineStack align="space-between" gap="800">
        <SkeletonDisplayText size="medium" />
        <SkeletonDisplayText size="small" />
      </InlineStack>

      <SkeletonBodyText lines={2} />

      <BlockStack gap="200">
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={1} />
          </div>
        ))}
      </BlockStack>
    </BlockStack>
  </Card>
);

const AppEmbedSkeleton = () => (
  <Card>
    <BlockStack gap="200">
      <SkeletonDisplayText size="medium" />
      <SkeletonBodyText lines={2} />
      <SkeletonDisplayText size="small" />
    </BlockStack>
  </Card>
);

const RecommendedAppsSkeleton = () => (
  <Card>
    <Text variant="headingMd" as="h2" style={{ marginBottom: "15px" }}>
      Recommended apps
    </Text>
    <Grid>
      {[1, 2, 3, 4].map((_, index) => (
        <Grid.Cell
          key={index}
          columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
        >
          <Card sectioned>
            <InlineStack wrap={false} gap="400">
              <Box>
                <SkeletonDisplayText size="large" />
              </Box>
              <BlockStack inlineAlign="start" gap="100">
                <SkeletonDisplayText size="medium" />
                <SkeletonBodyText lines={2} />
                <SkeletonDisplayText size="small" />
              </BlockStack>
            </InlineStack>
          </Card>
        </Grid.Cell>
      ))}
    </Grid>
  </Card>
);

const Index = () => {
  const [isThemeSelectionLoading, setIsThemeSelectionLoading] = useState(true);
  const [isRecommendedAppsLoading, setIsRecommendedAppsLoading] = useState(true);
  const { themeNames, activeTheme, session, blockID } = useLoaderData();
  const [showAll, setShowAll] = useState(false);
  const fetcher = useFetcher();
  const [embedStatus, setEmbedStatus] = useState(null);
  const [isThemeSelectionVisible, setIsThemeSelectionVisible] = useState(true);
  const [lastActiveTheme] = useState(false);
  const [appEmbedStatus, setAppEmbedStatus] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedTheme, setSelectedTheme] = useState(
    lastActiveTheme ? lastActiveTheme : activeTheme.id,
  );

  const handleNavigateWidgetsPage = () => {
    navigate("/app/additional");
  };

  const appData = [
    {
      title: "QBoost: Upsell & Cross Sell",
      description:
        "Maximize your store's potential with seamless upsell features that drive extra revenue.",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/0560/1535/6003/files/QuickBoostLogo.png?v=1742299521",
      imageAlt: "QBoost",
      appUrl: "https://apps.shopify.com/qboost-upsell-cross-sell",
    },
    {
      title: "ChatNest: Stay in touch",
      description:
        "Make your communication easy, enjoyable, and safe with Chat Nest: Stay In Touch.",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/0560/1535/6003/files/ChatNestLogo.png?v=1742298505",
      imageAlt: "ChatNest",
      appUrl: "https://apps.shopify.com/chatnest-stay-in-touch-1",
    },
    {
      title: "ScriptInjector",
      description:
        "Effortlessly insert custom scripts into your store for enhanced tracking and functionality.",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/0560/1535/6003/files/ScriptInjectorLogo.png?v=1742298347",
      imageAlt: "Script Injector",
      appUrl: "https://apps.shopify.com/scriptinjectorapp",
    },

    {
      title: "FileMaster ‑ Files Exporter",
      description:
        "Easily manage & download all your store files in just one click.",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/0560/1535/6003/files/FilemasterLogo.png?v=1742298178",
      imageAlt: "FileMaster",
      appUrl: "https://apps.shopify.com/filemaster-exporter",
    },
    {
      title: "IceMajesty",
      description: "Snowy magic: Transform with enchanting snow effects!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/0560/1535/6003/files/IceMajestyLogo.png?v=1742479358",
      imageAlt: "IceMajesty",
      appUrl: "https://apps.shopify.com/icemajesty-1",
    },
  ];

  const refLink = useRef(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("Activetheme");
      setSelectedTheme(storedTheme || activeTheme?.id);
    }
  }, [activeTheme?.id]);

  useEffect(() => {
    if (selectedTheme) {
      fetcher.submit({ activeThemeId: selectedTheme }, { method: "post" });
    }
  }, [selectedTheme]);

  useEffect(() => {
    setIsLoading(
      fetcher.state === "submitting"
        ? true
        : fetcher.state === "idle" && fetcher.data
          ? false
          : isLoading,
    );
  }, [fetcher.state, fetcher.data]);

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data?.checkDisabled !== undefined) {
        setAppEmbedStatus(!fetcher.data.checkDisabled);
      }
      setEmbedStatus(fetcher.data?.appEmbedData?.data.theme.files || null);
    }
  }, [fetcher.data]);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsThemeSelectionLoading(false);
      setIsRecommendedAppsLoading(false);
    }, 1500);

    return () => clearTimeout(loadingTimer);
  }, []);

  const handleThemeSelect = useCallback(
    (id) => {
      setSelectedTheme(id);
      fetcher.submit({ activeThemeId: id }, { method: "post" });
      localStorage.setItem("Activetheme", id);
    },
    [fetcher],
  );

  const handleAppembed = () => {
    refLink.current.click();
  };

  const toggleThemeSelection = () => {
    setIsThemeSelectionVisible((prev) => !prev);
  };
  const displayedApps = showAll ? appData : appData.slice(0, 2);

  return (
    <Page title="Setup Guide">
      <Layout>
        <Layout.Section>
          <Text as="p" variant="bodyMd">
            Use this personalized guide to get Stock-Info Inventory app up and
            running.
          </Text>
        </Layout.Section>

        <Layout.Section>
          {isThemeSelectionLoading ? (
            <ThemeSelectionSkeleton />
          ) : (
            <Card>
              <BlockStack gap="400" align="center">
                <Text as="p" variant="bodyMd">
                  Select a theme you want to activate the product page inventory
                  widget on:
                </Text>
                <InlineStack align="space-between" gap="800">
                  <Text>Theme Selection</Text>
                  <span
                    onClick={toggleThemeSelection}
                    style={{
                      fontSize: "14px",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    <Icon
                      source={
                        isThemeSelectionVisible ? CaretUpIcon : CaretDownIcon
                      }
                    />
                  </span>
                </InlineStack>

                {isThemeSelectionVisible && (
                  <BlockStack gap="200">
                    {themeNames &&
                      [...themeNames]
                        .reverse()
                        .map((theme) => (
                          <RadioButton
                            key={theme.node.id}
                            label={
                              activeTheme.id !== theme.node.id
                                ? theme.node.name
                                : `${theme.node.name} (Live)`
                            }
                            checked={selectedTheme === theme.node.id}
                            onChange={() => handleThemeSelect(theme.node.id)}
                          />
                        ))}
                  </BlockStack>
                )}
              </BlockStack>
            </Card>
          )}
        </Layout.Section>

        <Layout.Section>
          <Card>
            {isLoading ? (
              <BlockStack gap="200" align="center">
                <AppEmbedSkeleton />
              </BlockStack>
            ) : embedStatus == null ? (
              <Banner
                title="You need to purchase the theme to enable the App "
                tone="critical"
                icon={AlertTriangleIcon}
              />
            ) : appEmbedStatus ? (
              <Text as="p" variant="bodySm" tone="success">
                ✓ App Embed is Active on Selected Theme
              </Text>
            ) : (
              <BlockStack gap="200">
                <Banner
                  title="App Embed Is Missing From The Selected Theme"
                  tone="critical"
                  icon={AlertTriangleIcon}
                />
                <Box>
                  <Button
                    variant="primary"
                    onClick={handleAppembed}
                    fullWidth={false}
                  >
                    Activate App Embed
                  </Button>
                  <a
                    ref={refLink}
                    target="_blank"
                    href={`https://admin.shopify.com/store/${session.shop.split(".")[0]}/themes/current/editor?context=apps&activateAppId=${blockID}/app-embed`}
                    style={{ display: "none" }}
                  >
                    Activate App Embed
                  </a>
                </Box>
              </BlockStack>
            )}
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="200">
              <InlineStack blockAlign="center" gap="200">
                <Text variant="headingMd" fontWeight="semibold">
                  Custom Widgets
                </Text>
              </InlineStack>

              <Text variant="bodyMd" color="subdued">
                Enhance your store with additional inventory widgets and
                customize their appearance.
              </Text>

              <Box paddingBlockStart="300">
                <Button variant="primary" onClick={handleNavigateWidgetsPage}>
                  Install Widgets
                </Button>
              </Box>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* <CalloutCard
          title="Are you enjoing the app?"
          illustration={ratingImage}
          primaryAction={{
            content: "Write Review",
            url: "#",
          }}
        >
          <p>We work around the clock to create smooth and animated effects. Your feedback is really important to us, and we would greatly appreciate it if you could take a moment to leave a review.Thank you!</p>
        </CalloutCard> */}

        <Layout.Section>
          <Box paddingBlockEnd="500">
            {isRecommendedAppsLoading ? (
              <RecommendedAppsSkeleton />
            ) : (
              <Card>
                <Text variant="headingMd" as="h2">
                  <div style={{ marginBottom: "15px" }}>Recommended apps</div>
                </Text>

                <Grid>
                  {displayedApps.map((app, index) => (
                    <Grid.Cell
                      key={index}
                      columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
                    >
                      <Card title="Sales" sectioned>
                        <InlineStack wrap={false} gap="400">
                          <Box>
                            <img
                              src={app.imageUrl}
                              alt={app.imageAlt}
                              style={{
                                width: "5rem",
                                height: "5rem",
                                borderRadius: "10px",
                              }}
                            />
                          </Box>
                          <BlockStack inlineAlign="start" gap="100">
                            <Text variant="headingMd" as="h2">
                              <div>{app.title}</div>
                            </Text>
                            <Text variant="bodyMd" as="p">
                              <div style={{ marginBottom: "5px" }}>
                                {app.description}
                              </div>
                            </Text>
                            <Button
                              url={app.appUrl}
                              external={true}
                              target="_blank"
                              fullWidth={false}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                }}
                              >
                                Install Now
                              </div>
                            </Button>
                          </BlockStack>
                        </InlineStack>
                      </Card>
                    </Grid.Cell>
                  ))}
                </Grid>

                <div style={{ textAlign: "center", margin: "20px 0" }}>
                  {!showAll ? (
                    <Button onClick={() => setShowAll(true)} primary>
                      Show More
                    </Button>
                  ) : (
                    <Button onClick={() => setShowAll(false)} primary>
                      Show Less
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </Box>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Index;
