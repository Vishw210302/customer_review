import { Link, Outlet, useLoaderData, useNavigation, useRouteError } from "@remix-run/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { authenticate } from "../shopify.server";
import { Spinner ,  SkeletonPage,
  Layout,
  SkeletonBodyText,
  SkeletonDisplayText,
  Card} from "@shopify/polaris";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData();
  const navigate = useNavigation();
  const isPageLoading = navigate.state === "loading";

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

      {isPageLoading ? (
        <SkeletonPage primaryAction>
          <Layout>
            <Layout.Section>
              <Card sectioned>
                <SkeletonDisplayText size="large" />
                <SkeletonBodyText />
              </Card>
              <Card sectioned>
                <SkeletonBodyText lines={3} />
              </Card>
            </Layout.Section>
          </Layout>
        </SkeletonPage>
      ) : (
        <Outlet />
      )}
    </AppProvider>
  );
}


export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
