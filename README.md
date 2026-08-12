# Academic Portfolio

This repository contains Ruizhe Zhou's academic portfolio. It is a static Next.js site for research interests, experience, news, and publications.

## Work locally

Install Node.js 22, then run:

```sh
npm ci
npm run dev
```

Open the local address printed in the terminal. Before publishing a change, run the same checks used by deployment:

```sh
npm test -- --run
npm run lint
npx tsc --noEmit
npm run build
npm run test:e2e
```

## Update content

The editable content lives in these files:

- `src/data/profile.ts`: name, biography, portrait, CV, QR code, and contact links
- `src/data/research.ts`: research interests
- `src/data/experience.ts`: roles and institutions
- `src/data/news.ts`: dated updates
- `src/data/publications.ts`: papers and their links

Store profile images and the WeChat QR code in `public/profile/`, paper images in `public/papers/`, and the CV at `public/cv.pdf`. Reference those files from the matching data fields.

Optional content is hidden when its value is an empty string. The portrait, WeChat QR code, LinkedIn, email, WeChat contact, and CV fields are currently waiting for user-provided values. Leave them empty until the real files or details are available; do not add invented or unverified placeholders. More generally, publish only facts and links that have been verified.

## Deploy with GitHub Pages

In the repository on GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**. This setup is required once by a repository administrator.

The `Deploy portfolio to GitHub Pages` workflow runs on every push to `main` and can also be started manually from the Actions tab. It installs dependencies, runs unit tests, linting, and type-checking, builds the static site, uploads the `out/` directory, and deploys it to the `github-pages` environment. The build automatically handles both user-site and repository-site paths from GitHub's workflow environment.
