import styled from '@emotion/styled';
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

const ContentWrapper = styled.div({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
});

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
        <ContentWrapper>{children}</ContentWrapper>
        <Footer />
      </div>
    </>
  );
}
