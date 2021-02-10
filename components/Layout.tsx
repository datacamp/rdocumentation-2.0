import Head from 'next/head';

import Footer from './Footer';
import Navbar from './Navbar';

type Props = {
  canonicalLink?: string;
  children: React.ReactNode;
  description?: string;
  title: string;
};

const BASE_URL = 'https://www.rdocumentation.org';

export default function Layout({
  canonicalLink,
  children,
  description,
  title,
}: Props) {
  return (
    <>
      <Head>
        <title>{title ? `${title} - RDocumentation` : 'RDocumentation'}</title>
        {description && <meta content={description} name="description" />}
        {canonicalLink && (
          <link href={[BASE_URL, canonicalLink].join('')} rel="canonical" />
        )}
      </Head>
      <div className="flex flex-col max-w-screen-xl min-h-screen px-5 mx-auto overflow-x-hidden md:px-10">
        <Navbar />
        <div className="flex flex-col flex-grow">{children}</div>
        <Footer />
      </div>
    </>
  );
}
