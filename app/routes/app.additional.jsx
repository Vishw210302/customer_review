import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Button, RadioButton } from "@shopify/polaris";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {

  const { session } = await authenticate.admin(request);
  const shopDomain = session.shop;
  const accessToken = session.accessToken;
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
  const accessToken = session.accessToken;
  const shopDomain = session.shop;

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

const ThemeStatus = () => {

  const { themeNames, activeTheme, session, appBlckId } = useLoaderData();
  const fetcher = useFetcher();
  const [isThemeSelectionVisible, setIsThemeSelectionVisible] = useState(false);
  const [showAppEmbed, setShowAppEmbed] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState(activeTheme?.id);
  const [appEmbedStatus, setAppEmbedStatus] = useState(null);
  const refLink = useRef(null);

  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      maxWidth: "970px",
      margin: "20px auto",
      border: "1px solid #e0e0e0",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    header: {
      padding: "15px",
      paddingBottom: "1px",
      backgroundColor: "#ffffff",
    },
    title: {
      margin: "0",
      fontSize: "16px",
      fontWeight: "bold",
    },
    subtitle: {
      color: "#666",
      fontSize: "14px",
      marginTop: "5px",
      marginBottom: "5px",
    },
    progress: {
      backgroundColor: "#e0e0e0",
      height: "4px",
      width: "100%",
    },
    content: {
      backgroundColor: "#ffffff",
      padding: "15px",
    },
    radioContainer: {
      display: isThemeSelectionVisible ? "block" : "none",
      marginTop: "10px",
    },
    radioItem: {
      display: "flex",
      alignItems: "center",
      marginBottom: "8px",
      cursor: "pointer",
    },
    radioInput: {
      marginRight: "10px",
    },
    contentBackground: {
      backgroundColor: "#f1f1f1",
      padding: "15px",
      borderRadius: "10px",
    },
    appBlockSection: {
      backgroundColor: "#f1f1f1",
      padding: "15px",
      borderRadius: "5px",
    },
    addBlockButton: {
      backgroundColor: "#000000",
      color: "#ffffff",
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    checkBox: {
      cursor: "pointer",
      height: "24px",
      width: "18px",
    },
    statusSection: {
      marginTop: "15px",
      padding: "15px",
      backgroundColor: "#f1f1f1",
      borderRadius: "5px",
    },
    statusActive: {
      color: "green",
      fontWeight: "bold",
    },
    statusInactive: {
      color: "red",
      fontWeight: "bold",
    },
    liquidCode: {
      backgroundColor: "#f8f8f8",
      padding: "15px",
      border: "1px solid #ddd",
      borderRadius: "5px",
      marginTop: "15px",
      fontFamily: "monospace",
      whiteSpace: "pre-wrap",
    }
  };

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

  const toggleThemeSelection = () => {
    setIsThemeSelectionVisible(!isThemeSelectionVisible);
  };

  const renderLiquidCode = () => {
    if (appEmbedStatus === null) {
      return <p>Checking app embed status...</p>;
    }
  };

  return (

    <div style={styles.container}>

      <div style={styles.header}>
        <h2 style={styles.title}>Setup Guide</h2>
        <p style={styles.subtitle}>
          Use this personalized guide to get Stock-Info Inventory app up and
          running.
        </p>
      </div>

      <div style={styles.content}>
        <div style={styles.contentBackground}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
            onClick={toggleThemeSelection}
          >
            <input
              type="checkbox"
              checked={selectedTheme !== null}
              onChange={toggleThemeSelection}
              style={styles.checkBox}
            />
            <h3 style={styles.title}>Theme Selection</h3>
          </div>
          <p style={styles.subtitle}>
            Select a theme you want to activate the product page inventory
            widget on:
          </p>

          <div style={styles.radioContainer}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {themeNames &&
                [...themeNames]
                  .reverse()
                  .map((theme) => (
                    <RadioButton
                      key={theme.node.id}
                      name="theme"
                      label={
                        activeTheme.id != theme.node.id
                          ? theme.node.name
                          : `${theme.node.name} (Live)`
                      }
                      checked={selectedTheme === theme.node.id}
                      onChange={() => handleThemeSelect(theme.node.id)}
                    />
                  ))}
            </div>
          </div>
        </div>
      </div>

      {showAppEmbed && (
        <div style={styles.content}>
          <div style={styles.appBlockSection}>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
              >
                <h3 style={styles.title}>
                  Activate app embed in theme settings
                </h3>
              </div>
              <p style={styles.subtitle}>
                Click the button to Active the Stock-Info App
              </p>
            </div>
            <Button onClick={handleAppembed} style={{ background: "#000" }}>
              Activate app embed
            </Button>
            <a
              ref={refLink}
              target="_blank"
              href={
                selectedTheme
                  ? `https://${session.shop}/admin/themes/${selectedTheme?.split("/").pop()}/editor?context=apps&activateAppId=${appBlckId}/app-embed`
                  : "#"
              }
              style={{ display: "none" }}
            >
              Add app block
            </a>
          </div>
        </div>
      )}

      <div style={styles.content}>
        <div style={styles.statusSection}>
          <h3 style={styles.title}>App Embed Status</h3>
          <p style={styles.subtitle}>
            Current status of the app embed in your selected theme:
          </p>

          {fetcher.state === "submitting" ? (
            <p>Checking status...</p>
          ) : (
            <p>
              Status: {appEmbedStatus === null ? (
                "Checking..."
              ) : appEmbedStatus ? (
                <span style={styles.statusActive}>Active</span>
              ) : (
                <span style={styles.statusInactive}>Not Active</span>
              )}
            </p>
          )}

          {renderLiquidCode()}
        </div>
      </div>

    </div>
  );
};

export default ThemeStatus;