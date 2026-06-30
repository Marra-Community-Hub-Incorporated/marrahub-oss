// Feature flags for turning parts of the site on/off per environment.
//
// `volunteer` controls the public Volunteer Agreement flow — the /volunteer
// page plus every nav link and CTA that points at it. The programme isn't open
// to the public yet, so it is hidden in production by default while staying on
// in local dev (so the form can keep being built and tested).
//
// To turn it on for a deployed environment later, set VITE_VOLUNTEER_ENABLED=true
// at build time. No code change needed — flip the env var and redeploy.
const volunteerEnabledEnv = import.meta.env.VITE_VOLUNTEER_ENABLED as string | undefined;

export const featureFlags = {
  volunteer:
    volunteerEnabledEnv != null ? volunteerEnabledEnv === 'true' : !import.meta.env.PROD,
};
