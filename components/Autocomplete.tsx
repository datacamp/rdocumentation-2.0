/** @jsxImportSource @emotion/react */

import { Heading } from '@datacamp/waffles/heading';
import { Paragraph } from '@datacamp/waffles/paragraph';
import { tokens } from '@datacamp/waffles/tokens';
import router from 'next/router';
import { useEffect, useRef, useState } from 'react';

import { API_URL } from '../lib/utils';
import { keepNewestVersionPerKey } from '../lib/versionCompare';

const DEBOUNCE_MS = 300;

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
  const [isSearching, setIsSearching] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  function onClick(query) {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  async function autoComplete(query: string) {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!query || query.trim().length === 0) {
      setPackageSuggestions([]);
      setTopicSuggestions([]);
      setIsSearching(false);
      return;
    }

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      const packagesEndpoint = `${API_URL}/search_packages?q=${encodeURIComponent(
        query,
      )}&page=1&latest=1`;
      const functionsEndpoint = `${API_URL}/search_functions?q=${encodeURIComponent(
        query,
      )}&page=1`;

      const [resPackages, resTopics] = await Promise.all([
        fetch(packagesEndpoint, {
          headers: {
            Accept: 'application/json',
          },
          signal,
        }),
        fetch(functionsEndpoint, {
          headers: {
            Accept: 'application/json',
          },
          signal,
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

      // Collapse repeated packages/functions to their newest version. The API
      // scores every indexed version identically, so the first entry returned
      // is the oldest one rather than the most relevant.
      const relevantPackages = keepNewestVersionPerKey(
        packages.filter((item) => item?.score > 1),
        (item) => item?.fields?.package_name,
        (item) => item?.fields?.version,
      );

      const relevantTopics = keepNewestVersionPerKey(
        topics.filter((item) => item?.score > 1),
        (item) =>
          item?.fields?.name && item?.fields?.package_name
            ? `${item.fields.name}@${item.fields.package_name}`
            : null,
        (item) => item?.fields?.version,
      );

      setPackageSuggestions(relevantPackages.slice(0, 5));
      setTopicSuggestions(relevantTopics.slice(0, 5));
      setIsSearching(false);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setIsSearching(false);
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  useEffect(() => {
    if (searchInput && searchInput.trim().length > 0) {
      setIsSearching(true);
    }

    const timeoutId = setTimeout(() => {
      autoComplete(searchInput);
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
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
      {isSearching &&
        packageSuggestions.length === 0 &&
        topicSuggestions.length === 0 && (
          <div className="px-4 py-2">
            <Paragraph css={{ color: tokens.colors.grey, marginBottom: 0 }}>
              Searching...
            </Paragraph>
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
              const funcName = t?.fields?.name;
              const pkgName = t?.fields?.package_name;
              const scopedQuery =
                funcName && pkgName
                  ? `${funcName}(${pkgName})`
                  : funcName || '';
              return (
                <li
                  className="flex items-center px-4 py-2"
                  css={liStyle}
                  key={`${pkgName}-${funcName}`}
                  onClick={() => onClick(scopedQuery)}
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
