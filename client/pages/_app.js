import Layout from "../layout";
import "../styles/globals.scss";
import { ThemeProvider } from "@material-tailwind/react";
import { AppWrapper } from "../context";
const theme = {
  button: {
    styles: {
      background: "#cf46ca",
    },
  },
};
function MyApp({ Component, pageProps }) {
  return (
    <AppWrapper>
      <ThemeProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </AppWrapper>
  );
}

export default MyApp;
