# Promoting reviewed OSS changes

`marrahub-oss` is the public contribution repository. Volunteers can clone it,
open branches, and submit pull requests without access to production hosting,
provider dashboards, or private deployment settings.

Production promotion is maintainer-only:

1. Review and merge the volunteer PR in `marrahub-oss`.
2. In the production deployment repository, cherry-pick only the reviewed commit
   range that is intended for release.
3. Set production-only values in the hosting/provider dashboards, not in git:
   Formspree endpoint, Turnstile site keys, Azure Function URL, Graph settings,
   Turnstile secret, and any storage or SharePoint settings.
4. Run the production repository's normal checks before deployment.

Do not merge all of `oss/main` wholesale into a production repository. Promotion
is a deliberate release decision, and source control should contain no production
secrets in either direction.
