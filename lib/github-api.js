import { request } from '@octokit/request';

const requestWithAuth = request.defaults({
  headers: {
    authorization: process.env.GITHUB_ACCESS_TOKEN,
  },
});

export function getGithubReadme(githubOwnerRepo) {
  return requestWithAuth(`GET /repos/${githubOwnerRepo}/contents/README.md`, {
    mediaType: {
      format: 'raw',
    },
  });
}
