# Viewing this Page

Use:

```bash
npm i
npm run dev
```

You should be able to view it at `http://localhost:5173`.

# Deploying to GitHub Pages

This repo is configured for GitHub Pages deployment at:

`https://www.elijahsprouse.com/`

Deployment is handled by GitHub Actions on pushes to the `production` branch.

If you are not using the custom domain yet, the default GitHub Pages URL will be:

`https://pizzadogsquared.github.io/portfolio/`

To enable it in GitHub:

1. Push this repo to GitHub.
2. Open the repository on GitHub.
3. Go to `Settings -> Pages`.
4. Under `Build and deployment`, choose `GitHub Actions` as the source.
5. Push to `production`, or run the `Deploy to GitHub Pages` workflow manually from the `Actions` tab.
