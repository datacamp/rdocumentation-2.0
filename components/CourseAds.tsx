/** @jsxImportSource @emotion/react */
import { Card } from '@datacamp/waffles/card';
import { Heading } from '@datacamp/waffles/heading';
import { mediaQuery } from '@datacamp/waffles/helpers';
import { Link } from '@datacamp/waffles/link';
import { tokens } from '@datacamp/waffles/tokens';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';

import { useRenderCourseAds } from '../helpers/hooks/useRenderCourseAds';

const Wrapper = styled.div({
  display: 'grid',
  gridGap: tokens.spacing.medium,
  gridTemplateColumns: '1fr',
  marginBottom: tokens.spacing.medium,
  [mediaQuery.aboveMedium]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
});

const cards = [
  {
    description:
      'Level-up your R programming skills! Learn how to work with common data structures, optimize code, and write your own functions.',
    link: 'https://www.datacamp.com/tracks/r-programming-fundamentals',
    title: 'R Fundamentals',
  },
  {
    description:
      'Work with big data in R via parallel programming, interfacing with Spark, writing scalable & efficient R code, and learn ways to visualize big data.',
    link: 'https://www.datacamp.com/tracks/big-data-with-r',
    title: 'Big Data with R',
  },
  {
    description:
      'A machine learning scientist researches new approaches and builds machine learning models.',
    link: 'https://www.datacamp.com/tracks/machine-learning-scientist-with-r',
    title: 'Machine Learning with R',
  },
];

function CourseAds() {
  const shouldRender = useRenderCourseAds();
  const router = useRouter();

  if (!shouldRender) {
    return null;
  }

  return (
    <section>
      <Heading css={{ marginBottom: tokens.spacing.medium }}>
        Continue Improving Your R Skills
      </Heading>
      <Wrapper>
        {cards.map(({ description, link, title }) => (
          <Card
            css={{
              '&:active, &:focus, &:hover': {
                cursor: 'pointer',
              },
            }}
            key={title}
            onClick={() => router.push(link)}
          >
            <Card.Header>
              <Link
                css={{
                  '&:active, &:focus, &:hover': {
                    cursor: 'pointer',
                  },
                }}
                href={link}
              >
                {title}
              </Link>
            </Card.Header>

            <Card.Body>{description}</Card.Body>
          </Card>
        ))}
      </Wrapper>
    </section>
  );
}

export default CourseAds;
