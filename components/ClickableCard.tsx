/** @jsxImportSource @emotion/react */

import { Link } from '@datacamp/waffles/link';
import { Paragraph } from '@datacamp/waffles/paragraph';
import { theme } from '@datacamp/waffles/theme';
import { tokens } from '@datacamp/waffles/tokens';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import Html from './Html';

type Props = {
  description: string;
  extraInfo?: string;
  href: string;
  id: string | number;
  name: string;
};

const clickableCardStyles = css({
  borderRadius: tokens.borderRadius.medium,
  borderWidth: tokens.borderWidth.medium,
  color: theme.text.main,
  display: 'flex',
  flexDirection: 'column',
  padding: '10px 12px',
  textDecoration: 'none',
  width: '100%',
});

const TitleWrapper = styled.div({
  alignItems: 'baseline',
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
});

const HTMLWrapper = styled.div({
  fontWeight: 'bold',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const DescriptionWrapper = styled.div({
  display: '-webkit-box',
  fontSize: tokens.fontSizes.small,
  fontWeight: 'normal',
  marginTop: tokens.spacing.small,
  overflow: 'hidden',
  textAlign: 'left',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
});

export default function ClickableCard({
  description,
  extraInfo,
  href,
  id,
  name,
}: Props) {
  return (
    <Link css={clickableCardStyles} href={href} key={id}>
      <TitleWrapper>
        <HTMLWrapper>
          <Html>{name}</Html>
        </HTMLWrapper>
        <Paragraph css={{ margin: 0 }} size="small" variant="secondary">
          {extraInfo}
        </Paragraph>
      </TitleWrapper>
      <DescriptionWrapper>
        <Html>{description}</Html>
      </DescriptionWrapper>
    </Link>
  );
}
