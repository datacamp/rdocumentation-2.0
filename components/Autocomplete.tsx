/** @jsxImportSource @emotion/react */

import { Heading } from '@datacamp/waffles/heading';
import { Paragraph } from '@datacamp/waffles/paragraph';
import { tokens } from '@datacamp/waffles/tokens';
import router from 'next/router';
import { useEffect, useState } from 'react';

import { API_URL } from '../lib/utils';

type Props = {
  searchInput: string;
};

const liStyle = {
  '&:hover': {
    backgroundColor: tokens.colors.greySubtle,
    borderRadius: tokens.borderRadius.medium,
    cursor: 'pointer',
  },
};

const paragraphStyle = {
  color: tokens.colors.navy,
  marginBottom: 0,
};

const Autocomplete = ({ searchInput }: Props) => {
  const [packageSuggestions, setPackageSuggestions] = useState([]);
  const [topicSuggestions, setTopicSuggestions] = useState([]);

  function onClick(query) {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  async function autoComplete(query) {
    setPackageSuggestions([]);
    setTopicSuggestions([]);

    if (!query || query.trim().length === 0) {
      return;
    }

    try {
      const packagesEndpoint = `${API_URL}/search_packages?q=${query}&page=1&latest=1`;
      const functionsEndpoint = `${API_URL}/search_functions?q=${query}&page=1&latest=1`;

      const [resPackages, resTopics] = await Promise.all([
        fetch(packagesEndpoint, {
          headers: {
            Accept: 'application/json',
          },
        }),
        fetch(functionsEndpoint, {
          headers: {
            Accept: 'application/json',
          },
        }),
      ]);

      let packages = [];
      let topics = [];

      if (resPackages.ok) {
        const packagesData = await resPackages.json();
        packages = packagesData.packages || [];
      }

      if (resTopics.ok) {
        const functionsData = await resTopics.json();
        topics = functionsData.functions || [];
      }

      const relevantPackages = packages?.filter((p) => p?.score > 1);
      const relevantTopics = topics?.filter((p) => p?.score > 1);
      setPackageSuggestions(
        relevantPackages?.slice(0, Math.min(relevantPackages?.length, 5)),
      );
      setTopicSuggestions(
        relevantTopics?.slice(0, Math.min(relevantTopics?.length, 5)),
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  useEffect(() => {
    autoComplete(searchInput);
  }, [searchInput]);

  return (
    <div
      className="my-2 bg-white shadow-lg"
      css={{ borderRadius: tokens.borderRadius.medium }}
    >
      {searchInput && (
        <div
          className="flex items-center px-4 py-4"
          css={liStyle}
          onClick={() => onClick(searchInput)}
        >
          <Paragraph
            className="pl-2 py-2"
            css={paragraphStyle}
          >{`View results for "${searchInput}"`}</Paragraph>
        </div>
      )}
      <div>
        {packageSuggestions?.length > 0 && searchInput && (
          <ul>
            <li className="my-2 pl-4 flex justify-between">
              <Heading
                as="h3"
                css={{ ...paragraphStyle, textTransform: 'uppercase' }}
              >
                Packages
              </Heading>
            </li>
            {packageSuggestions?.map((p) => {
              return (
                <li
                  className="flex items-center px-4 py-2"
                  css={liStyle}
                  key={p?.fields?.package_name}
                  onClick={() => onClick(p?.fields?.package_name)}
                >
                  <Paragraph className="pl-2 text-lg" css={paragraphStyle}>
                    {p?.fields?.package_name}
                  </Paragraph>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div>
        {topicSuggestions?.length > 0 && searchInput && (
          <ul>
            <li className="my-2 pl-4 flex justify-between">
              <Heading
                as="h3"
                css={{ ...paragraphStyle, textTransform: 'uppercase' }}
              >
                Functions
              </Heading>
            </li>
            {topicSuggestions?.map((t) => {
              return (
                <li
                  className="flex items-center px-4 py-2"
                  css={liStyle}
                  key={t?.fields?.package_name + t?.fields?.name}
                  onClick={() => onClick(t?.fields?.name)}
                >
                  <div>
                    <Paragraph
                      css={paragraphStyle}
                    >{`${t?.fields?.name}`}</Paragraph>
                  </div>
                  <div>
                    <Paragraph
                      css={paragraphStyle}
                    >{`(${t?.fields?.package_name})`}</Paragraph>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Autocomplete;
