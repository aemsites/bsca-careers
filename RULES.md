# Repository rules

Plain Git hooks (`.githooks/`) and one Node script (`tools/rules.mjs`, Node built-ins only) check
commits and pushes locally; CI (`.github/workflows/`) repeats the checks that matter, because local
hooks can be skipped. No extra npm packages.

## Rules

| Rule | Checked by | Escape hatch |
| --- | --- | --- |
| Commit message first line is `type(optional-scope): description`. Types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `perf`, `ci`, `build`, `revert`. Scope: lowercase letters, digits, hyphens. Description: 1–72 characters, does not start with an uppercase letter, no trailing period. Body and trailers (`Co-authored-by: ...`) are free. Git's own `Merge ...` and `Revert "..."` subjects pass; lines starting with `#` are ignored. | `commit-msg` hook; CI on pull requests (every commit of the PR, first parent, no merges; not on release pull requests `develop` → `stage` and `stage` → `main` (or `develop` → `main`), whose commits were checked on their way into `develop`) | none in CI (`--no-verify` skips only the local hook) |
| No commits on `main` or `stage` | `pre-commit` hook | `ALLOW_MAIN=1` |
| `scripts/aem.js` (vendored aem-boilerplate core) is not changed or deleted | `pre-commit` hook (all staged paths, deletions included); CI workflow `Vendored aem.js` compares it with [aem-boilerplate main](https://raw.githubusercontent.com/adobe/aem-boilerplate/main/scripts/aem.js) and comments on the PR | `ALLOW_AEM_JS=1` (to copy a new upstream version) |
| A changed block (`blocks/<name>/*.js`, `.css`, `.html` added or modified) has `blocks/<name>/README.md`; removed and renamed blocks are not checked | `pre-commit` hook | none |
| Staged `.js` / `.mjs` files pass ESLint, staged `.css` files pass Stylelint (the generated path `helix-importer-ui/` is skipped) | `pre-commit` hook; full `npm run lint` in `pre-push` and CI | none |
| No pushes to `main` or `stage`: they change only through release pull requests (`develop` → `stage` → `main`, see below) | `pre-push` hook; GitHub ruleset (below) | `ALLOW_MAIN=1` (the ruleset still applies) |
| Other pushed branches are `develop` or `<type>/<description>`. Types: `feature`, `fix`, `hotfix`, `release`, `chore`, `docs`, `refactor`, `tools` (tooling branches, see below). Characters `A-Z a-z 0-9 . _ -`, no spaces, no `--`. Example: `feature/story-filters` | `pre-push` hook | none |
| The preview host `<branch>--<repo>--<owner>` fits in 63 characters (`/` in the branch becomes `-`). Checked for the GitHub repo you push to, and for `aemsites/bsca-careers` also against its nine repoless sites in `blueshieldca` (`bsca-careers`, `stellarus-careers`, `ascendiun-careers`, each with `-stage` and `-develop`); the longest, `ascendiun-careers-develop--blueshieldca`, leaves 22 characters for the branch. The message shows the maximum branch length. | `pre-push` hook | none |
| `npm test` (when a `test` script exists) and `npm run lint` pass | `pre-push` hook; CI (`npm run lint`) | none |

Rule settings (types, branches, generated paths, site overrides) are at the top of `tools/rules.mjs`.

## Branches and environments

Code moves `feature/*` (and other `<type>/*`) → `develop` → `stage` → `main`. Each branch is shown with
its own Document Authoring content, for every brand:

| Branch | Environment | Sites (`blueshieldca`) | Preview |
| --- | --- | --- | --- |
| `develop` | Dev | `bsca-careers-develop`, `stellarus-careers-develop`, `ascendiun-careers-develop` | `https://develop--<site>--blueshieldca.aem.page` |
| `stage` | Stage | `bsca-careers-stage`, `stellarus-careers-stage`, `ascendiun-careers-stage` | `https://stage--<site>--blueshieldca.aem.page` |
| `main` | Prod | `bsca-careers`, `stellarus-careers`, `ascendiun-careers` | `https://main--<site>--blueshieldca.aem.page` |

- Feature pull requests go into `develop` and are checked on the `-develop` sites.
- A release is a pull request `develop` → `stage` (checked on the `-stage` sites), then `stage` → `main`.
- Content belongs to a site, not a branch: any branch can be opened on any site. The Dev and Stage sites
  set `cdn.preview.host` / `cdn.live.host` to their branch, so the Sidekick and Document Authoring open
  the matching branch.

## Tooling branches

Tools that are not part of the client scope live on their own long-lived branches, not in `develop`, `stage`
or `main`:

| Branch | Contents |
| --- | --- |
| `tools/storybook` | Storybook for the blocks and design tokens (`storybook/`) |
| `tools/visual-testing` | Visual regression tests against the LIVE site (`e2e/visual-testing/`, see its README) |

- Each one is `develop` plus its tool. To bring it up to date, merge `develop` into it
  (`git switch tools/visual-testing && git merge aemsites/develop`); never merge it into `develop`.
- Change the tool with a pull request into its tooling branch; site code changes go to `develop` as usual.
- Their folders are in that branch's `.hlxignore`, so branch previews do not serve them.

## Turn the hooks on

The hooks are activated by pointing Git at `.githooks/`:

```sh
npm ci                 # runs "prepare", which sets core.hooksPath
npm run hooks:install  # or set it explicitly
```

Both run `git config core.hooksPath .githooks` in your clone. Hooks need Node.js on `PATH`;
`.githooks/_common.sh` also looks in `/usr/local/bin`, `/opt/homebrew/bin` and `~/.nvm`. GUI clients
(GitHub Desktop, some IDEs) start hooks with a minimal `PATH`: if a hook says Node.js was not found,
start the client from a terminal where `node` works.

Run a check by hand:

```sh
node tools/rules.mjs commit-msg .git/COMMIT_EDITMSG
node tools/rules.mjs branch feature/my-change --remote-url "$(git remote get-url origin)"
node tools/rules.mjs commits origin/main..HEAD
```

## Escape hatches

- `ALLOW_MAIN=1 git commit ...` / `ALLOW_MAIN=1 git push ...`: commit on or push to `main` (the GitHub
  ruleset still blocks direct pushes).
- `ALLOW_AEM_JS=1 git commit ...`: update `scripts/aem.js` to a new aem-boilerplate version (copy it as is).
- `git commit --no-verify` / `git push --no-verify` skip the local hooks; CI still checks lint, commit
  messages and `scripts/aem.js` on pull requests.

## Limits

- Hooks only run on branches that contain `.githooks/`; on older branches nothing is checked locally.
- Edits made on github.com and `--no-verify` bypass the hooks. Real enforcement is the GitHub ruleset
  plus CI, which cannot be set from files:

## GitHub settings checklist (set by a repository admin)

- [ ] Ruleset for `main` and `stage`: require a pull request with at least 1 approval
- [ ] Require status check `build` (workflow **Build**), and `aem-js` (workflow **Vendored aem.js**) if wanted
- [ ] Require branches to be up to date before merging
- [ ] Require conversation resolution
- [ ] Block force pushes and deletion (`main`, `stage`)
- [ ] No bypass list, administrators included
- [ ] Merge method: any (squash is fine: there is no subtree)
- [ ] Optional: "Require review from Code Owners". `.github/CODEOWNERS` lists the owners for the whole repo; add a
      second owner first, because authors can't approve their own pull requests

The pull request template (`.github/pull_request_template.md`) asks for the Jira ticket (`ASCCAEM-<id>`),
Before/After preview URLs, and a check that the change doesn't affect the other brand sites (or was checked on each).
