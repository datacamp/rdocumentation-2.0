# RDocumentation 2.0

RDocumentation provides an easy way to search the documentation for every version of every R package on [CRAN](https://cran.r-project.org/) and [Bioconductor](http://bioconductor.org/).

## Setup

To run locally, clone this repo and `cd` into the directory.

Change the name of `.env.local.example` to `.env.local`. Since RDocumentation fetches data from the GitHub API, you'll need to create a GitHub [personal access token](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token) and add it as an environment variable.

```
GITHUB_TOKEN=YOUR_PERSONAL_ACCESS_TOKEN
```

Then run the following to install dependencies and start the development server on `http://localhost:3000`:

```
yarn
yarn dev
```

## Stack

This project is built with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/) and our own [Waffles component library](https://waffles.datacamp.com/component-library). We ❤️ open source.
