export function getPackageUrls(stringOfUrls: string) {
  const urls = { githubUrl: null, homeUrl: null };
  if (!stringOfUrls) return urls;

  const urlArray = stringOfUrls.split(',').map((url) => url.trim());
  const githubIndex = urlArray.findIndex((url) => url.includes('github.com'));

  // if there's a github url, save it
  if (githubIndex >= 0) urls.githubUrl = urlArray[githubIndex];
  // if there's more than one url, save the first non-github url as home
  if (urlArray.length > 1) urls.homeUrl = urlArray[githubIndex === 0 ? 1 : 0];

  return urls;
}

export function getGithubOwnerRepo(githubUrl: string) {
  const ownerRepo = { githubOwner: null, githubRepo: null };
  if (!githubUrl) return ownerRepo;

  const ownerRepoDirty = githubUrl.split('github.com/');
  const ownerRepoClean = ownerRepoDirty[1].split('/').slice(0, 2);

  return { githubOwner: ownerRepoClean[0], githubRepo: ownerRepoClean[1] };
}

// calculate a sum on a per-group basis
export function sumByGroup(objectArray: any, groupBy: string, sumBy: string) {
  return objectArray.reduce((acc, obj) => {
    const key = obj[groupBy];
    if (!acc[key]) {
      acc[key] = 0;
    }
    acc[key] += obj[sumBy];
    return acc;
  }, {});
}

// https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
// TODO: make this more robust to older browsers?
export function copyTextToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}
