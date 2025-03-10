import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Button, RadioButton } from "@shopify/polaris";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {

  const { admin, session } = await authenticate.admin(request);
  const shopDomain = session.shop;
  const accessToken = session.accessToken;

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
  });

};

export const action = async ({ request }) => {

  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const activeThemeId = formData.get("activeThemeId");

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
  const data = appEmbedData.data.theme.files.nodes[0].body.content;

  const productSectionBlocks = JSON.parse(
    data.substring(data.indexOf("{")),
  ).current;

  var checkDisabled = true;

  if (typeof productSectionBlocks.blocks == 'undefined') {
    checkDisabled = true;
  } else {
    checkDisabled = Object.values(productSectionBlocks.blocks).find((item) =>
      item.type.includes("11c1775f-0f8d-4694-9a1a-a376d42343e3")
    )?.disabled ?? true;
  }

  return json({
    checkDisabled,
  });
};

const ThemeStatus = () => {

  const { themeNames, activeTheme, session, shopDomain } = useLoaderData();
  const fetcher = useFetcher();
  const [showError, setShowError] = useState(false);
  const [isThemeSelectionVisible, setIsThemeSelectionVisible] = useState(false);
  const [showAppEmbed, setshowAppEmbed] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(activeTheme?.id);
  const linkRef = useRef(null);
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
      cursor: "pointer",
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
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("Activetheme");
      if (storedTheme) {
        setSelectedTheme(storedTheme);
      } else {
        setSelectedTheme(activeTheme?.id);
      }
    }
  }, []);

  useEffect(() => {
    if (fetcher.data?.checkDisabled !== undefined) {
      setshowAppEmbed(fetcher.data.checkDisabled);
    }
  }, [fetcher.data]);

  const handleThemeSelect = useCallback(
    (id) => {
      setSelectedTheme(id);
      fetcher.submit(
        {
          activeThemeId: id,
        },
        { method: "post" },
      );
      localStorage.setItem("Activetheme", id);
    },
    [fetcher, setSelectedTheme],
  );

  const handleAddBlock = () => {
    linkRef.current.click();
  };

  const handleAppembed = () => {
    refLink.current.click();
  };

  const toggleThemeSelection = () => {
    setIsThemeSelectionVisible(!isThemeSelectionVisible);
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

          {showError && (
            <p style={{ color: "red", marginTop: "10px" }}>
              Please select a theme before adding the block.
            </p>
          )}
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
                  ? `https://${session.shop}/admin/themes/${selectedTheme?.split("/").pop()}/editor?context=apps&activateAppId=11c1775f-0f8d-4694-9a1a-a376d42343e3/embed`
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
              <h3 style={styles.title}>Add App Block On Product Page</h3>
            </div>

            <p style={styles.subtitle}>
              Click the button to add the Stock-Info Inventory widget to your
              product page
            </p>

          </div>

          <Button
            onClick={() => {
              if (!selectedTheme) {
                setShowError(true);
                return;
              }
              setShowError(false);
              handleAddBlock();
            }}
            style={styles.addBlockButton}
          >
            Add Block
          </Button>

          <a
            ref={linkRef}
            target="_blank"
            href={
              selectedTheme
                ? `https://${session.shop}/admin/themes/${selectedTheme?.split("/").pop()}/editor?template=product&addAppBlockId=11c1775f-0f8d-4694-9a1a-a376d42343e3/Stock-info&target=mainSection`
                : "#"
            }
            style={{ display: "none" }}
          >
            Add app block
          </a>

        </div>
      </div>

    </div>
  );
};

export default ThemeStatus;