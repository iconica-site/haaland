# Deploy

## GitHub Pages

1. Push this project to a GitHub repository with `main` as the default branch.
2. In GitHub, open `Settings -> Pages`.
3. Set `Build and deployment -> Source` to `GitHub Actions`.
4. Push to `main`. The workflow in `.github/workflows/pages.yml` builds `dist` and publishes it to Pages.

## Deploy Key

The deploy key is generated locally and must not be committed.

Add the public key to `Settings -> Deploy keys` in the GitHub repository. Enable `Allow write access` only if you want this key to push code to the repository.
