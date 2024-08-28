import {
  darkThemeStyle,
  lightThemeStyle,
  theme as themeTokens,
} from '@datacamp/waffles/theme';
import tokens from '@datacamp/waffles/tokens/tokens';
import styled from '@emotion/styled';
import Head from 'next/head';
import { useContext } from 'react';

import { ThemeContext } from '../pages/_app';

import Navbar from './Navbar';

type Props = {
  canonicalLink?: string;
  children: React.ReactNode;
  description?: string;
  title: string;
};

const BASE_URL = 'https://www.rdocumentation.org';

const ContentWrapper = styled.div({
  '&[data-theme="dark"] *': {
    ...darkThemeStyle,
  },
  '&[data-theme="light"] *': {
    ...lightThemeStyle,
  },
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  margin: '0 auto',
  maxWidth: 1200,
  padding: `0 ${tokens.spacing.medium}`,
});

const Divider = styled.hr({
  '&[data-theme="dark"]': {
    ...darkThemeStyle,
  },
  '&[data-theme="light"]': {
    ...lightThemeStyle,
  },
  borderColor: themeTokens.border.strong,
});

export default function Layout({
  canonicalLink,
  children,
  description,
  title,
}: Props) {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <Head>
        <title>{title ? `${title} - RDocumentation` : 'RDocumentation'}</title>
        {description && <meta content={description} name="description" />}
        {canonicalLink && (
          <link href={[BASE_URL, canonicalLink].join('')} rel="canonical" />
        )}
      </Head>
      <Navbar />
      <Divider data-theme={theme} />
      <ContentWrapper data-theme={theme}>{children}</ContentWrapper>
    </>
  );
}
