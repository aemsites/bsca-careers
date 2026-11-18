Please always provide the Jira ticket your PR is for, as well as test URLs where your change can be observed (before and after):

Jira: ASCCAEM-<id>
Fix #<gh-issue-id> (only if there is a GitHub issue; otherwise delete this line)

Test URLs:
- Before: https://main--bsca-careers--blueshieldca.aem.page/<path>
- After: https://<branch>--bsca-careers--blueshieldca.aem.page/<path>

Brand sites (one code base runs every brand site):
- [ ] This change doesn't affect the other brand sites, or I checked it on each one (delete the ones you didn't check):
  - Stellarus: https://<branch>--stellarus-careers--blueshieldca.aem.page/careers
  - Ascendiun: https://<branch>--ascendiun-careers--blueshieldca.aem.page/careers
  - Stage: https://<branch>--bsca-careers-stage--blueshieldca.aem.page/<path>

Checklist (see [RULES.md](../blob/main/RULES.md)):
- [ ] `npm run lint` passes
- [ ] CSS selectors are scoped to the block (`.blockname ...`), and values use design tokens
- [ ] Changed blocks have an up-to-date `README.md`
- [ ] PageSpeed Insights scores 100 on the After preview URL (mobile)
- [ ] Commit messages follow Conventional Commits (`type(scope): description`)
