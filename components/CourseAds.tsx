/** @jsxImportSource @emotion/react */
import { RLogomark } from '@datacamp/waffles/asset';
import { Card } from '@datacamp/waffles/card';
import { Link } from '@datacamp/waffles/link';
import { tokens } from '@datacamp/waffles/tokens';
import styled from '@emotion/styled';

const Wrapper = styled.div({
  display: 'grid',
  gridGap: tokens.spacing.medium,
  gridTemplateColumns: 'repeat(3, 1fr)',
  marginBottom: tokens.spacing.medium,
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
  return (
    <Wrapper>
      {cards.map(({ description, link, title }) => (
        <Card
          css={{
            '&:active, &:focus, &:hover': {
              cursor: 'pointer',
            },
          }}
          headstone={<Card.HeadstoneAvatar content={<RLogomark />} />}
          key={title}
          onClick={() => {
            // TODO: use router
            window.location.href = link;
          }}
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
  );
}

export default CourseAds;
