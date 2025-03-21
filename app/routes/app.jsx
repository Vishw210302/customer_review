import { Link, Outlet, useLoaderData, useNavigation, useRouteError } from "@remix-run/react";
import { NavMenu } from "@shopify/app-bridge-react";
import { Spinner } from "@shopify/polaris";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { authenticate } from "../shopify.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {

  const { apiKey } = useLoaderData();
  const navigate = useNavigation();
  const isPageLoading = navigate.state === "loading";

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
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        <Link to="/app" rel="home">
          Home
        </Link>
        <Link to="/app/mainDashboard">Dashboard</Link>
        <Link to="/app/crudeOperation">All Reviews</Link>
        <Link to="/app/additional">Widgets</Link>
      </NavMenu>
      <Outlet />
    </AppProvider>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
