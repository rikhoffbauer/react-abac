# Versioned Starlight Website Design

Date: 2026-09-17
Status: approved in chat; awaiting written-spec review

## Goal

Replace the README-only documentation experience with a polished GitHub Pages site that serves as both the public product landing page and the canonical documentation for `react-abac`, while preserving browsable documentation for released versions.

## User-facing structure

The GitHub Pages project site will use the repository subpath `/react-abac/`:

- `/react-abac/` — custom Astro landing page for the library.
- `/react-abac/docs/` — current documentation rendered with Starlight.
- `/react-abac/versions/` — version archive/index.
- `/react-abac/versions/<version>/` — immutable documentation snapshot for a released version.
- `/react-abac/versions.json` — machine-readable version manifest used by the version switcher.

The current docs remain at the stable `/docs/` URL. Historical URLs are immutable once published.

## Technology

Create an Astro + Starlight site under `website/` in the existing repository. The package/library build remains independent from the documentation application.

Starlight provides the documentation shell, search, navigation, dark mode, responsive layout, accessible defaults, Markdown/MDX support, and code presentation. The homepage is a custom Astro page so it can look like a product site rather than a stock documentation template.

The site must build correctly with Astro's GitHub Pages `base` set to `/react-abac` and must not assume root-domain hosting.

## Visual direction

The site should feel like a modern, focused React library rather than a generic generated documentation site. Keep Starlight's readable documentation chrome, but use a custom visual identity for the landing page:

- strong typographic hero and concise positioning;
- immediately visible install command;
- a compact realistic RBAC/ABAC code example;
- visual explanation of roles, permissions, and context-aware rules;
- feature/benefit cards focused on the actual library capabilities;
- clear routes into Quick Start, Concepts, API Reference, GitHub, and npm;
- restrained motion and visual effects, with no heavy runtime UI framework required;
- full light/dark theme support and responsive behavior.

The visual system should be implemented with Astro/Starlight CSS and components unless a component genuinely needs client-side behavior.

## Documentation information architecture

The current monolithic README becomes source material for structured docs. The README remains useful as the repository front page, but the website becomes canonical for detailed documentation.

Initial Starlight sections:

1. Getting Started
   - Introduction
   - Installation
   - Quick Start
2. Concepts
   - Roles
   - Permissions
   - Rules / ABAC predicates
3. Guides
   - Basic RBAC
   - Context-aware ABAC
   - Conditional rendering
   - Protecting components with `secured`
4. API Reference
   - `create`
   - `AbacProvider`
   - `AllowedTo`
   - `NotAllowedTo`
   - `useAbac`
   - `secured`
5. Compatibility / Releases
   - React compatibility
   - version archive / release notes links

The implementation should migrate and improve the existing documentation rather than inventing unsupported behavior.

## Versioning model

Versioned documentation is stored in the GitHub Pages publication state, not duplicated indefinitely on `main`.

For each new release:

1. Build the current site once from the exact source revision being released.
2. Publish that build as the root/current site.
3. Copy the same build into `versions/<released-version>/`, excluding nested historical version archives.
4. Preserve every existing `versions/<older-version>/` directory unchanged.
5. Regenerate the version manifest and version archive page.

This guarantees that future releases preserve the exact documentation that accompanied them.

### Legacy versions

Existing releases predate the Starlight site. During the first Pages publication, a bootstrap script will enumerate historical semver tags and extract each tag's `README.md` with `git show`.

Those READMEs will be rendered into a lightweight historical-documentation page using the site's typography and shared legacy styling, placed at `versions/<version>/`. This makes old docs browsable without attempting to run obsolete dependency trees or reconstruct a nonexistent historical Starlight project.

Once a version has a full Starlight snapshot, that snapshot takes precedence and is never regenerated from README content.

## Version selector

Current documentation should expose a compact version selector showing the current release and the available historical releases. It reads a generated manifest containing version, URL, release date when available, and whether the version is the current release.

Selecting an older version navigates to its immutable snapshot. Historical snapshots link back to the latest docs.

The version selector does not need to recreate Starlight's internal navigation state across versions; preserving the version landing page and stable archive URL is sufficient.

## Publication state

Use a dedicated `gh-pages` branch as the durable publication store. The release workflow will:

- check out the existing `gh-pages` branch into a temporary publication directory when it exists;
- overlay the newly built current site at the publication root;
- preserve existing `versions/` snapshots;
- add the new release snapshot when a release was produced;
- bootstrap missing legacy snapshots on the first deployment;
- update the version manifest;
- push the publication tree to `gh-pages`;
- deploy that exact tree through GitHub Pages.

The branch is generated output and is never hand-edited.

## Release workflow integration

The existing `Release` workflow remains responsible for package validation and semantic-release/npm publishing. Documentation publication occurs after the release step.

Required flow:

1. checkout with full history/tags;
2. install dependencies;
3. build library;
4. test library;
5. run semantic-release using npm OIDC trusted publishing;
6. record the newest semver tag before and after semantic-release; a changed newest tag is the released version, avoiding reliance on the repository package.json version;
7. build the website;
8. update the durable Pages publication tree;
9. deploy to GitHub Pages.

If npm/GitHub release publication fails, Pages publication must not run. If the website build or Pages deployment fails after npm publication succeeds, the release remains valid but the workflow is red so the documentation failure is visible and retryable.

A manual Release run that produces no new package version may refresh the root/current site but must not fabricate a new version snapshot.

## GitHub Pages configuration

Use GitHub's Actions-based Pages deployment with `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages`. The workflow requires the standard Pages permissions (`pages: write` and `id-token: write`) and a `github-pages` environment.

The `gh-pages` branch is used for durable historical state even though the final deployment is performed by the Pages Actions API. This separates persistent archive storage from the deployment mechanism.

## Failure and concurrency behavior

Release/Pages publication must be serialized with a workflow concurrency group so two releases cannot update `gh-pages` concurrently.

The publication script must fail rather than delete an existing version snapshot. Creating a snapshot for a version that already exists is allowed only when the existing snapshot is byte-for-byte equivalent or when explicitly running a documented repair mode.

All file operations happen in a temporary directory; `main` remains clean after local site builds.

## Testing and verification

Add deterministic scripts that can run locally and in CI:

- `website` type/build validation;
- link/path sanity checks for the GitHub Pages base path;
- publication-tree test using a temporary fake prior `gh-pages` tree;
- legacy README extraction/rendering test using at least one real historical tag;
- assertion that publishing a second version preserves the first snapshot unchanged;
- assertion that the generated manifest is semver-sorted and identifies the current release;
- smoke checks that the built root page, `/docs/`, `/versions/`, and the newest version snapshot exist.

The release workflow is only considered complete when both the package release and Pages deployment have been exercised successfully on GitHub Actions.

## Search, accessibility, and metadata

Use Starlight's built-in search for current documentation. Historical legacy pages do not need cross-version search.

The custom homepage must preserve keyboard navigation, visible focus states, semantic headings, reduced-motion preferences, sufficient contrast, and meaningful labels.

Add useful title/description/Open Graph metadata and canonical URLs. Generated historical pages should be indexable but clearly identify their version and link to the latest documentation.

## Migration and initial publication

The first deployment should publish the current docs as the latest site and bootstrap archive entries for all existing semver releases for which a README exists. Because the Starlight site did not exist in the `v0.1.18` source revision, `v0.1.18` and earlier releases receive legacy README snapshots. The first release made after the site lands receives the first immutable full Starlight snapshot.

No old npm package, Git tag, or GitHub release is modified by this migration.

## Non-goals

- Hosting a dynamic documentation backend.
- Rebuilding every historical release with its historical Node dependency graph.
- Maintaining a separate documentation repository.
- Adding a large client-side React application merely for the website.
- Automatically rewriting historical documentation content to match current APIs.

## Completion criteria

The work is complete when:

- GitHub Pages is enabled and serves the custom landing page;
- current structured Starlight docs are reachable at `/docs/`;
- the version selector and `/versions/` archive work;
- at least the existing 0.1.x releases have accessible historical docs where source README content exists;
- a release creates an immutable full-site snapshot for its version;
- a subsequent deployment demonstrably preserves previous snapshots;
- CI/build/link/publication tests pass locally and in GitHub Actions;
- release and Pages workflows finish green.
