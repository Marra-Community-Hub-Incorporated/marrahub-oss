# Promoting a change from here to production

This repo (`marrahub-oss`) is where open development happens — anyone can
branch, PR, and get reviewed here. The live site at
[marrahub.com.au](https://marrahub.com.au) actually deploys from a separate
private repo, `marrahub`, which only the core maintainer(s) can push to.

Both repos were created from the same history, so a commit made here has the
same SHA there — no patch files, no manual re-typing of changes. Promoting is
just git.

## Promoting a finished, reviewed feature

Do this from a checkout that has both remotes configured:

```bash
git remote add origin https://github.com/Marra-Community-Hub-Incorporated/marrahub.git
git remote add oss https://github.com/Marra-Community-Hub-Incorporated/marrahub-oss.git
```

Then, once a feature branch has been reviewed and merged into `marrahub-oss`'s
`main`:

```bash
git fetch oss main
git checkout -b promote/<feature-name> origin/main
git cherry-pick <first-commit>^..<last-commit>   # just this feature's commits
git push origin promote/<feature-name>
gh pr create --repo Marra-Community-Hub-Incorporated/marrahub \
  --base main --head promote/<feature-name>
```

That PR goes through `marrahub`'s normal required checks (secret scan, build,
API checks) and CODEOWNERS review before it can merge — merging to `marrahub`
`main` is what triggers the real production deploy.

**Cherry-pick the specific commits, don't merge all of `oss/main` wholesale** —
`oss/main` may have work-in-progress that hasn't been earmarked for
production yet.

## Why not sync everything automatically?

Because "reviewed and working in the open repo" and "ready for production"
aren't the same milestone — promotion is a deliberate, separate decision, not
a side effect of merging a PR here. Secrets are never a concern either way:
they never live in git in the first place (see [CI.md](./CI.md)), so nothing
extra needs scrubbing when moving code from public to private.
