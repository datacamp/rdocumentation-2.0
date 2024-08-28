/** @jsxImportSource @emotion/react */

import { Button } from '@datacamp/waffles/button';
import { mediaQuery } from '@datacamp/waffles/helpers';
import { useMediaQuery } from '@datacamp/waffles/hooks';
import { ExternalLink } from '@datacamp/waffles/icon';
import { Link } from '@datacamp/waffles/link';
import { Paragraph } from '@datacamp/waffles/paragraph';
import {
  darkThemeStyle,
  lightThemeStyle,
  theme as themeTokens,
} from '@datacamp/waffles/theme';
import { tokens } from '@datacamp/waffles/tokens';
import styled from '@emotion/styled';
import { useContext } from 'react';

import { ThemeContext } from '../pages/_app';

const ContentWrapper = styled.div({
  '&, &[data-theme="light"]': {
    ...lightThemeStyle,
  },
  '&[data-theme="dark"]': {
    ...darkThemeStyle,
  },
  display: 'grid',
  margin: '0 auto',
  width: '100%',
  [mediaQuery.aboveMedium]: {
    gridGap: tokens.spacing.large,
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    marginTop: tokens.spacing.xlarge,
    padding: `0 ${tokens.spacing.large} ${tokens.spacing.large}`,
    width: 'auto',
  },
});

const Column = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing.large,
  marginBottom: tokens.spacing.large,
  [mediaQuery.aboveMedium]: {
    marginBottom: 0,
  },
});

const ListWrapper = styled.div(`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
  padding: 0 ${tokens.spacing.medium};
  [${mediaQuery.aboveMedium}]: {
    padding: 0;
  }
`);

const linkStyle = {
  '&:hover': {
    border: 'none',
    boxShadow: 'none',
    textDecoration: 'underline',
  },
  backgroundColor: 'unset',
  border: 'none',
  color: themeTokens.text.main,
};

const categoryStyle = {
  marginBottom: 0,
};

export const HomePageLinks = () => {
  const { theme } = useContext(ThemeContext);
  const { isAboveSmall } = useMediaQuery();
  const buttonSize = isAboveSmall ? 'medium' : 'large';
  return (
    <ContentWrapper data-theme={theme}>
      <Column>
        <Button
          as="a"
          href="https://www.datacamp.com/tracks/r-programming-fundamentals"
          iconRight={<ExternalLink />}
          size={buttonSize}
        >
          R Fundamentals
        </Button>
        <ListWrapper>
          <Paragraph style={categoryStyle} variant="secondary">
            Course
          </Paragraph>
          <Link
            css={linkStyle}
            href="https://www.datacamp.com/courses/free-introduction-to-r"
          >
            Introduction to R
          </Link>
          <Link
            css={linkStyle}
            href="https://www.datacamp.com/tracks/data-visualization-with-r"
          >
            Data Visualization with R
          </Link>
          <Paragraph style={categoryStyle} variant="secondary">
            Tutorial
          </Paragraph>
          <Link
            css={linkStyle}
            href="https://www.datacamp.com/cheat-sheet/getting-started-r"
          >
            R Basics Cheat Sheet
          </Link>
          <Link
            css={linkStyle}
            href="https://www.datacamp.com/tutorial/linear-regression-R"
          >
            Linear Regression in R
          </Link>
          <Link
            css={linkStyle}
            href="https://www.datacamp.com/tutorial/make-histogram-basic-r"
          >
            Histograms in R
          </Link>
        </ListWrapper>
      </Column>
      <Column>
        <Button
          as="a"
          href="https://www.datacamp.com/tracks/big-data-with-r"
          iconRight={<ExternalLink />}
          size={buttonSize}
        >
          Big Data with R
        </Button>
        <ListWrapper>
          <Paragraph style={categoryStyle} variant="secondary">
            Course
          </Paragraph>
          <Link
            css={linkStyle}
            href="https://www.datacamp.com/courses/practicing-statistics-interview-questions-in-r"
          >
            Practicing Interview Questions in R
          </Link>
          <Link
            css={linkStyle}
            href="https://www.datacamp.com/tracks/data-manipulation-with-r"
          >
            Data Manipulation with R
          </Link>
          <Paragraph style={categoryStyle} variant="secondary">
            Tutorial
          </Paragraph>
          <Link
            css={linkStyle}
            href="https://www.datacamp.com/tutorial/r-data-import-tutorial"
          >
            Importing Data into R
          </Link>
          <Link
            css={linkStyle}
            href="https://www.datacamp.com/tutorial/pca-analysis-r"
          >
            Principal Component Analysis in R
          </Link>
          <Link
            css={linkStyle}
            href="https://www.datacamp.com/tutorial/contingency-tables-r"
          >
            Contingency Tables in R
          </Link>
        </ListWrapper>
      </Column>
      <Column>
        <Button
          as="a"
          href="https://www.datacamp.com/tracks/machine-learning-scientist-with-r"
          iconRight={<ExternalLink />}
          size={buttonSize}
        >
          Machine Learning with R
        </Button>
        <ListWrapper>
          <Paragraph style={categoryStyle} variant="secondary">
            Course
          </Paragraph>
          <Link
            css={linkStyle}
            href="https://www.datacamp.com/courses/machine-learning-in-the-tidyverse"
          >
            Machine Learning in the Tidyverse
          </Link>
          <Link
            css={linkStyle}
            href="https://www.datacamp.com/tracks/supervised-machine-learning-in-r"
          >
            Supervised Machine Learning in R
          </Link>
          <Paragraph style={categoryStyle} variant="secondary">
            Tutorial
          </Paragraph>
          <Link
            css={linkStyle}
            href="https://www.datacamp.com/tutorial/decision-trees-R"
          >
            Decision Trees in R
          </Link>
          <Link
            css={linkStyle}
            href="https://www.datacamp.com/tracks/supervised-machine-learning-in-r"
          >
            Hierarchical Clustering in R
          </Link>
        </ListWrapper>
      </Column>
    </ContentWrapper>
  );
};
