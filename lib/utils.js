export function getPackageUrls(stringOfUrls) {
  const urls = { homeUrl: null, githubUrl: null };
  if (!stringOfUrls) return urls;

  const urlArray = stringOfUrls.split(',').map((url) => url.trim());
  const githubIndex = urlArray.findIndex((url) => url.includes('github.com'));

  // if there's a github url, save it
  if (githubIndex >= 0) urls.githubUrl = urlArray[githubIndex];
  // if there's more than one url, save the first non-github url as home
  if (urlArray.length > 1) urls.homeUrl = urlArray[githubIndex === 0 ? 1 : 0];

  return urls;
}

export function getGithubOwnerRepo(githubUrl) {
  const ownerRepo = { githubOwner: null, githubRepo: null };
  if (!githubUrl) return ownerRepo;

  const ownerRepoDirty = githubUrl.split('github.com/');
  const ownerRepoClean = ownerRepoDirty[1].split('/').slice(0, 2);

  return { githubOwner: ownerRepoClean[0], githubRepo: ownerRepoClean[1] };
}
