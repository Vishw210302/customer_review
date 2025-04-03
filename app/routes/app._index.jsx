import { json } from "@remix-run/node";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import {
  Badge,
  BlockStack,
  Box,
  Button,
  Card,
  Grid,
  InlineStack,
  Page,
  RadioButton,
  Spinner,
  Text
} from "@shopify/polaris";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {

  const { session } = await authenticate.admin(request);
  const shopDomain = session?.shop;
  const accessToken = session?.accessToken;
  const appBlckId = process.env.SHOPIFY_REVIEW_ID;

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
    const themeResponse = await fetch(
      `https://${shopDomain}/admin/api/2025-01/graphql.json`,
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

    var themeNames = themeData.data.themes.edges;
    var activeTheme = themeData.data.themes.edges.find(
      (theme) => theme.node.role === "MAIN",
    )?.node;

  } catch (error) {
    console.log("error", error);
  }

  return json({
    themeNames: themeNames,
    activeTheme,
    session,
    shopDomain,
    appBlckId
  });
};

export const action = async ({ request }) => {

  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const activeThemeId = formData.get("activeThemeId");
  const appBlckId = process.env.SHOPIFY_REVIEW_ID;
  const accessToken = session?.accessToken;
  const shopDomain = session?.shop;

  const response = await fetch(
    `https://${shopDomain}/admin/api/2025-01/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
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
  const data = appEmbedData?.data?.theme?.files?.nodes[0].body?.content;

  try {
    const settingsData = JSON.parse(data.substring(data.indexOf('{')));
    const currentSettings = settingsData.current;

    let appNeedsToBeEmbedded = true;

    if (currentSettings && currentSettings.blocks) {
      const appBlock = Object.values(currentSettings.blocks).find(
        (item) => item.type && item.type.includes(appBlckId)
      );

      if (appBlock && appBlock.disabled !== true) {
        appNeedsToBeEmbedded = false;
      }
    }

    return json({
      checkDisabled: appNeedsToBeEmbedded,
    });

  } catch (error) {
    console.error('Error parsing theme settings:', error);
    return json({
      checkDisabled: true,
      error: 'Failed to parse theme settings',
    });
  }
};

function Index() {

  const { themeNames, activeTheme, session, appBlckId } = useLoaderData();
  const fetcher = useFetcher();
  const [isThemeSelectionVisible, setIsThemeSelectionVisible] = useState(true);
  const [showAppEmbed, setShowAppEmbed] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState(activeTheme?.id);
  const [appEmbedStatus, setAppEmbedStatus] = useState(null);
  const refLink = useRef(null);
  const navigate = useNavigate();
  const isPageLoading = false;
  const [showAll, setShowAll] = useState(false);

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

  const appData = [
    {
      title: "QBoost: Upsell & Cross Sell",
      description: "Maximize your store's potential with seamless upsell features that drive extra revenue.",
      imageUrl: "https://cdn.shopify.com/s/files/1/0560/1535/6003/files/QuickBoostLogo.png?v=1742299521",
      imageAlt: "QBoost",
      appUrl: "https://apps.shopify.com/qboost-upsell-cross-sell"
    },
    {
      title: "IceMajesty",
      description: "Snowy magic: Transform with enchanting snow effects!",
      imageUrl: "https://cdn.shopify.com/s/files/1/0560/1535/6003/files/IceMajestyLogo.png?v=1742479358",
      imageAlt: "IceMajesty",
      appUrl: "https://apps.shopify.com/icemajesty-1"
    },
    {
      title: "ChatNest: Stay in touch",
      description: "Make your communication easy, enjoyable, and safe with Chat Nest: Stay In Touch.",
      imageUrl: "https://cdn.shopify.com/s/files/1/0560/1535/6003/files/ChatNestLogo.png?v=1742298505",
      imageAlt: "ChatNest",
      appUrl: "https://apps.shopify.com/chatnest-stay-in-touch-1"
    },
    {
      title: "ScriptInjector",
      description: "Effortlessly insert custom scripts into your store for enhanced tracking and functionality.",
      imageUrl: "https://cdn.shopify.com/s/files/1/0560/1535/6003/files/ScriptInjectorLogo.png?v=1742298347",
      imageAlt: "Script Injector",
      appUrl: "https://apps.shopify.com/scriptinjectorapp"
    },
    {
      title: "FileMaster ‑ Files Exporter",
      description: "Easily manage & download all your store files in just one click.",
      imageUrl: "https://cdn.shopify.com/s/files/1/0560/1535/6003/files/FilemasterLogo.png?v=1742298178",
      imageAlt: "FileMaster",
      appUrl: "https://apps.shopify.com/filemaster-exporter"
    },
  ];

  const displayedApps = showAll ? appData : appData.slice(0, 2);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("Activetheme");
      if (storedTheme) {
        setSelectedTheme(storedTheme);
        fetcher.submit(
          { activeThemeId: storedTheme },
          { method: "post" }
        );
      } else {
        setSelectedTheme(activeTheme?.id);
        if (activeTheme?.id) {
          fetcher.submit(
            { activeThemeId: activeTheme.id },
            { method: "post" }
          );
        }
      }
    }
  }, []);

  useEffect(() => {
    if (fetcher.data?.checkDisabled !== undefined) {
      setShowAppEmbed(fetcher.data.checkDisabled);
      setAppEmbedStatus(!fetcher.data.checkDisabled);
    }
  }, [fetcher.data]);

  const handleThemeSelect = useCallback(
    (id) => {
      setSelectedTheme(id);
      fetcher.submit(
        { activeThemeId: id },
        { method: "post" },
      );
      localStorage.setItem("Activetheme", id);
    },
    [fetcher, setSelectedTheme],
  );

  const handleAppembed = () => {
    refLink.current.click();
  };

  const handleNavigateWidgetsPage = () => {
    navigate("/app/additional");
  };

  const toggleThemeSelection = () => {
    setIsThemeSelectionVisible(!isThemeSelectionVisible);
  };

  const renderSetupGuide = () => {
    return (
      <BlockStack gap="400">

        <Card>
          <BlockStack gap="200">
            <InlineStack align="space-between" blockAlign="center">
              <Text variant="headingMd" fontWeight="semibold">
                Theme Selection
              </Text>
              <Button
                variant="monochromePlain"
                onClick={toggleThemeSelection}
                style={{ textDecoration: "none" }}
              >
                <span style={{ fontSize: "30px", textDecoration: "none" }}>
                  {isThemeSelectionVisible ? "-" : "+"}
                </span>
              </Button>
            </InlineStack>

            <Text variant="bodyMd" color="subdued">
              Select the theme you want to activate the product page inventory widget on
            </Text>

            {isThemeSelectionVisible && (
              <BlockStack gap="200">
                {themeNames &&
                  [...themeNames]
                    .reverse()
                    .map((theme) => (
                      <RadioButton
                        key={theme.node.id}
                        label={
                          activeTheme.id != theme.node.id
                            ? theme.node.name
                            : `${theme.node.name} (Live)`
                        }
                        checked={selectedTheme === theme.node.id}
                        id={theme.node.id}
                        name="theme"
                        onChange={() => handleThemeSelect(theme.node.id)}
                      />
                    ))}
              </BlockStack>
            )}
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="200">
            <InlineStack blockAlign="center" gap="200">
              <Text variant="headingMd" fontWeight="semibold">App Embed Configuration</Text>
            </InlineStack>

            <Text variant="bodyMd" color="subdued">
              To display inventory information on your product pages, you need to activate the Stock-Info app embed in your theme settings.
            </Text>

            <Box paddingBlockStart="0">
              <InlineStack gap="200" blockAlign="center">
                {showAppEmbed ? (
                  <Button
                    variant="primary"
                    onClick={handleAppembed}
                  >
                    Activate App Embed
                  </Button>
                ) : (
                  <>
                    {appEmbedStatus && <Badge tone="success">Active</Badge>}
                  </>
                )}

                {fetcher.state === "submitting" && (
                  <Badge progress="incomplete">Checking status...</Badge>
                )}

                <a
                  ref={refLink}
                  target="_blank"
                  href={
                    selectedTheme
                      ? `https://${session?.shop}/admin/themes/${selectedTheme?.split("/").pop()}/editor?context=apps&activateAppId=${appBlckId}/app-embed`
                      : "#"
                  }
                  style={{ display: "none" }}
                >
                  Add app block
                </a>
              </InlineStack>
            </Box>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="200">

            <InlineStack blockAlign="center" gap="200">
              <Text variant="headingMd" fontWeight="semibold">Custom Widgets</Text>
            </InlineStack>

            <Text variant="bodyMd" color="subdued">
              Enhance your store with additional inventory widgets and customize their appearance.
            </Text>

            <Box paddingBlockStart="300">
              <Button
                variant="primary"
                onClick={handleNavigateWidgetsPage}
              >
                Install Widgets
              </Button>
            </Box>

          </BlockStack>
        </Card>

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

        <Box paddingBlockEnd="500">
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
                            width: "6rem",
                            height: "6rem",
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
                  View More
                </Button>
              ) : (
                <Button onClick={() => setShowAll(false)} primary>
                  View Less
                </Button>
              )}
            </div>
          </Card>
        </Box>

      </BlockStack>
    );
  };

  return (
    <Page>
      <Box paddingBlockStart="400">
        {renderSetupGuide()}
      </Box>
    </Page>
  );

};

export default Index;
