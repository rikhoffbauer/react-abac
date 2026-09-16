# Versioned Starlight Website Design

Date: 2026-09-17
Status: approved in chat; awaiting written-spec review

## Goal

Replace the README-only project presence with a polished GitHub Pages website for `react-abac`.
The root URL is a custom product/landing page, current documentation lives under `/docs/`, and
immutable historical documentation remains available under `/versions/<version>/`.

The site must deploy from the existing Release workflow and must preserve older documentation
rather than replacing it on each release.

## Primary URLs

- `/react-abac/` — custom Astro landing page.
- `/react-abac/docs/` — documentation for the current/latest release.
- `/react-abac/versions/` — version index and selector target.
- `/react-abac/versions/0.1.18/` — frozen documentation for `0.1.18`.
- `/react-abac/versions/0.1.17/` — historical documentation sourced from tag `v0.1.17`.
- Equivalent `/versions/<semver>/` routes for all published semver tags that can be recovered.

The GitHub Pages base path is `/react-abac` and all generated links must work beneath that base.
## Technology

Use Astro with the official Starlight integration. Starlight owns documentation rendering,
sidebar navigation, search, code highlighting, dark mode, accessibility, metadata, and mobile
navigation. The landing page remains a normal custom Astro page so its design is not constrained
by the documentation layout.

The website lives in a focused `website/` directory inside the existing repository. The library
build remains independent of the website build.

Expected structure:

```text
website/
  astro.config.mjs
  package.json
  src/
    assets/
    components/
    content/docs/docs/
    pages/index.astro
    styles/global.css
  scripts/generate-versioned-docs.ts
```

Starlight content is nested under `content/docs/docs/` so current documentation naturally routes
under `/docs/`. Generated historical content is written under `content/docs/versions/` before the
Astro build and is never committed.
## Landing page

The homepage should look like a maintained React library, not a generated documentation starter.
It uses a restrained dark/light visual system with a React-adjacent cyan accent, a secondary
violet accent, strong typography, subtle grid/lattice details, and compact motion only where it
improves orientation.

Above the fold:

- `react-abac` wordmark and concise RBAC + ABAC positioning.
- Install command with copy affordance: `npm install react-abac`.
- Primary CTA to current docs and secondary links to GitHub and npm.
- A real code example showing `AbacProvider`, `AllowedTo`, and an attribute-based rule.
- Current release badge populated from generated site metadata rather than hard-coded copy.

Below the fold:

- Three conceptual cards: Roles, Permissions, Rules.
- A compact “why react-abac” section focused on declarative authorization and typed React APIs.
- Quick-start progression from provider to permission check to ABAC rule.
- Compatibility/current-version panel and link to version history.
- Footer with package, repository, license, and documentation links.

No marketing claims that cannot be supported by the package or repository are added.
## Current documentation information architecture

The current README is source material, not the final information architecture. Split it into
focused Starlight pages:

- `docs/index` — overview and installation.
- `docs/getting-started` — minimal provider + permission example.
- `docs/concepts/roles` — role model and role assignment.
- `docs/concepts/permissions` — direct permission model.
- `docs/concepts/rules` — attribute-based rules and predicates.
- `docs/api/create` — `create()` factory and returned API.
- `docs/api/abac-provider` — provider props and behavior.
- `docs/api/allowed-to` — `AllowedTo` and `NotAllowedTo`.
- `docs/api/use-abac` — hook reference.
- `docs/api/secured` — HOC/decorator reference.
- `docs/recipes` — practical combinations taken from existing examples.
- `docs/versioning` — version selector behavior and historical-doc caveats.

Examples should be copied from verified package APIs and updated only when required for the
current source. The root README remains useful for GitHub/npm but becomes concise and links to the
full website instead of duplicating the entire manual indefinitely.

## Search and navigation

Use Starlight's built-in search and sidebar. The top navigation exposes Docs, Versions, GitHub,
and npm. Current docs show a version selector with `Latest (<highest published semver>)` plus available historical
versions. Version data comes from a generated JSON manifest shared by the landing page and docs UI.
## Historical documentation generation

Git tags are the canonical historical source. `generate-versioned-docs.ts` enumerates published
`v<semver>` tags and produces temporary Starlight content for each version before a site build.

For tags that contain the structured website documentation, the generator extracts that tag's
`website/src/content/docs/docs/**` tree and rewrites frontmatter/routes into
`website/src/content/docs/versions/<version>/**`.

For older tags that predate Starlight, the generator extracts that tag's `README.md`, converts it
into a valid Starlight page, and publishes it at `/versions/<version>/`. This fallback is explicitly
labeled “Archived README documentation” so it is not mistaken for the richer current manual.

The generator also writes a deterministic version manifest containing:

```ts
type DocsVersion = {
  version: string;
  tag: string;
  kind: 'structured' | 'readme-archive';
  latest: boolean;
  url: string;
};
```

Generated historical content and the manifest output are build artifacts and are ignored by Git.
A clean clone with full tags must be able to reproduce the complete Pages site.
## Release and GitHub Pages flow

The existing manual Release workflow remains responsible for npm/GitHub release publishing and
adds Pages deployment after semantic-release succeeds or reports that no new package release is
required.

Release workflow sequence:

1. Checkout full history and tags.
2. Install root dependencies.
3. Build and test the library.
4. Run semantic-release using npm trusted publishing/OIDC.
5. Install website dependencies.
6. Generate versioned documentation from all release tags.
7. Build the Astro/Starlight site with `site=https://rikhoffbauer.github.io` and
   `base=/react-abac`.
8. Upload the complete `website/dist` tree as the GitHub Pages artifact.
9. Deploy using GitHub Pages' Actions deployment API.

The workflow receives `pages: write` and retains `id-token: write`; Pages uses a `github-pages`
environment. The repository Pages source is configured to GitHub Actions. Release/Pages runs use a
single concurrency group so two deployments cannot race.

A Pages failure must fail the workflow visibly but must never attempt to roll back an npm release.
A rerun after an npm release must be safe: semantic-release can no-op while the site is rebuilt and
redeployed from tags.
## Validation

Local validation must include:

- Root library clean install, build, and tests.
- Website type/content validation through Astro/Starlight build.
- Version generator tests against a synthetic structured-tag fixture and one real README-only historical tag.
- Assertions that generated version routes are unique, semver-sorted, and contain no broken base
  path assumptions.
- Static-link checks for the landing page, current docs, version index, newest historical version,
  and an older README archive.
- `git diff --check` before every commit.

Release validation must additionally prove:

- GitHub Pages deployment job completes successfully.
- Published Pages root returns the landing page.
- `/react-abac/docs/` returns current docs.
- `/react-abac/versions/0.1.18/` and at least one older version return documentation.
- Existing npm/GitHub release behavior remains intact.

## Failure handling

A malformed historical README must not abort every future release. The generator records the tag
as skipped with a clear warning when content cannot be converted safely. Structured current docs,
site configuration errors, or failure to generate the current version are hard build failures.

Missing Git tags are a hard CI/release configuration error because historical reproducibility
requires `fetch-depth: 0` and tags.
## Metadata and indexing

The landing page and current docs include useful title/description metadata, canonical URLs, and
Open Graph metadata. Historical pages are indexable but must show their exact package version and
a prominent link back to the latest documentation.

`/react-abac/versions/` is a human-readable archive page. A generated `/react-abac/versions.json`
exposes the same deterministic manifest used by the version selector and landing page.

## Initial migration

The first Pages deployment publishes the new structured current docs and generates README archive
pages for all existing semver tags with readable source documentation. Because `v0.1.18` predates
the Starlight site, its `/versions/0.1.18/` entry is a README archive. The first package release
whose tag contains `website/src/content/docs/docs/**` becomes the first structured historical
snapshot automatically. No existing npm version, Git tag, or GitHub release is modified.

## Accessibility and performance

The custom landing page must preserve Starlight-level keyboard accessibility and contrast. Motion
must respect `prefers-reduced-motion`. Interactive behavior should remain minimal and progressively
enhanced; the site must be useful with JavaScript disabled.

Avoid large client-side React bundles for decorative effects. Prefer Astro, CSS, inline SVG, and
small isolated components. The production homepage and documentation pages should remain static.

## Repository and package boundaries

The website must not become a runtime dependency of `react-abac`. Website-only packages stay in
`website/package.json`, and the library package published to npm must not include website source or
build output.

The root CI workflow gains a website build check so broken documentation cannot silently reach a
release. It does not deploy Pages; deployment remains release-only.

## Non-goals

- No CMS, server, database, analytics platform, or authentication.
- No live code playground in the first iteration.
- No attempt to reconstruct historical structured docs that never existed.
- No per-patch duplicated HTML committed to `main` or a `gh-pages` branch.
- No custom search implementation when Starlight's search is sufficient.
- No large redesign of the library API as part of the documentation work.

## Accepted design decisions

- Astro + Starlight rather than a custom documentation framework.
- Custom landing page at the Pages root; Starlight current docs under `/docs/`.
- Historical docs under `/versions/<semver>/` generated reproducibly from Git tags.
- README fallback for releases predating structured docs.
- GitHub Actions Pages deployment integrated into the Release workflow.
- Future releases preserve structured docs automatically because their tags contain the site source.


## Completion criteria

The work is complete only when all of the following are true:

- GitHub Pages serves the custom landing page at `/react-abac/`.
- Current structured Starlight documentation works at `/react-abac/docs/`.
- `/react-abac/versions/` and the version selector expose historical releases.
- `0.1.18` and at least one older release have accessible archived documentation.
- A synthetic structured-version test proves future tagged Starlight docs are preserved correctly.
- Root CI validates both the library and website without deploying Pages.
- The Release workflow publishes/deploys Pages and finishes green.
- The deployed site passes route/link smoke checks against the real GitHub Pages URL.
- Existing npm trusted publishing and GitHub release behavior remain functional.
