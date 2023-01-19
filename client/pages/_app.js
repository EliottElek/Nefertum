import Layout from "../layout";
import "../styles/globals.scss";
import { ThemeProvider } from "@material-tailwind/react";
import { AppWrapper } from "../context";

function MyApp({ Component, pageProps }) {
  return (
    <AppWrapper>
      <ThemeProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </AppWrapper>
  );
}

export default MyApp;
