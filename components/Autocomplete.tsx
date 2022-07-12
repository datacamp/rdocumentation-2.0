import { Heading, Paragraph } from "@datacamp/waffles-text";
import router from "next/router";
import { useEffect, useState } from "react";
import { API_URL } from "../lib/utils";

type Props = {
    searchInput: string,
    onSearch: () => void,
};

export default function AutoComplete({ searchInput, onSearch }: Props) {
  const [packageSuggestions, setPackageSuggestions] = useState([]);
  const [topicSuggestions, setTopicSuggestions] = useState([]);

    function onClick(query, type) {
      switch (type) {
        case "topic":
          router.push(`/packages/${encodeURIComponent(query?.fields?.package_name)}/versions/${encodeURIComponent(query?.fields?.version)}/topics/${encodeURIComponent(query?.fields?.name)}`);
          onSearch();
          break
        case "package":
          router.push(`/search?q=${encodeURIComponent(query)}`);
          onSearch();
          break
        case "search":
          router.push(`/search?q=${encodeURIComponent(query)}`);
          onSearch();
          break
        default:
          break
      }
    };

    async function autoComplete(query) {
      try {
          // fetch the data
          const [resPackages, resTopics] = await Promise.all([
            fetch(
              `${API_URL}/search_packages?q=${query}&page=1&latest=1`,
              {
                headers: {
                  Accept: 'application/json',
                },
              },
            ),
            fetch(
              `${API_URL}/search_functions?q=${query}&page=1&latest=1`,
              {
                headers: {
                  Accept: 'application/json',
                },
              },
            )
          ]);
  
          const { packages }  = await resPackages?.json();
          const functions = await resTopics?.json();
          const topics = functions?.functions;
          const relevantPackages = packages?.filter((p)=>(p?.score>1));
          const relevantTopics = topics?.filter((p)=>(p?.score>1));
          setPackageSuggestions(relevantPackages?.slice(0, Math.min(relevantPackages?.length, 5)));
          setTopicSuggestions(relevantTopics?.slice(0, Math.min(relevantTopics?.length, 5)));
  
      } catch (err) {
        console.error(err);
      }
    };

    useEffect(()=>{
      autoComplete(searchInput);
    }, [searchInput])

    return (
      <div className="my-2 bg-white rounded-2xl shadow-lg">
          {
            searchInput
            &&
            <div
            onClick={()=>onClick(searchInput, "search")}
            className="flex items-center px-4 py-4 cursor-pointer hover:bg-dc-beige200 hover:opacity-0.5"
            >
              <Paragraph className="pl-2 py-2">{`View results for "${searchInput}"`}</Paragraph>
            </div>
          }
          <div>
            {
              packageSuggestions?.length>0
              &&
              searchInput
              &&
              <ul>
                <li className="my-2 ml-2 pl-4 text-dc-grey200 flex justify-between">
                  <Heading as="h3" size={300}>PACKAGES</Heading>
                </li>
                {
                  packageSuggestions?.map((p)=>{
                    return (
                      <li
                      key={p?.fields?.package_name}
                      onClick={()=>onClick(p?.fields?.package_name, "package")}
                      className="flex items-center px-4 py-2 cursor-pointer hover:bg-dc-beige200 hover:opacity-0.5"
                      >
                        <Paragraph className="pl-2 sm:text-lg">{p?.fields?.package_name}</Paragraph>
                      </li>
                    )
                })}
              </ul>
            }
          </div>
          <div>
            {
              topicSuggestions?.length>0
              &&
              searchInput
              &&
              <ul>
                <li className="my-2 ml-2 pl-4 text-dc-grey200 flex justify-between">
                  <Heading as="h3" size={300}>FUNCTIONS</Heading>
                </li>
                {
                  topicSuggestions?.map((t)=>{
                    return (
                      <li
                      key={t?.fields?.package_name+t?.fields?.name}
                      onClick={()=>onClick(t, "topic")}
                      className="flex flex-wrap items-center px-4 py-2 cursor-pointer hover:bg-dc-beige200 hover:opacity-0.5"
                      >
                        <div>
                          <Paragraph className="pl-2 pr-1 sm:pr-2 sm:text-lg">{`${t?.fields?.name}`}</Paragraph>
                        </div>
                        <div>
                          <Paragraph className="sm:text-lg">{`(${t?.fields?.package_name})`}</Paragraph>
                        </div>
                      </li>
                    )
                })}
            </ul>
            }
          </div>
        </div>
    )
}