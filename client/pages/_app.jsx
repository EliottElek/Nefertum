import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen p-8">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
