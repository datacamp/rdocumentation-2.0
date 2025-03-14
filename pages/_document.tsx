/* eslint-disable class-methods-use-this */
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link href="/favicon.ico" rel="icon" />
          <meta
            content="l7VjaJvG_OgqxbCyZDDtk_ykMcPXyqwTSoWnf94hGQk"
            name="google-site-verification"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
            `,
            }}
          />
          <script
            async
            src="https://campaign-service.datacamp.com/api/v1/banner"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
