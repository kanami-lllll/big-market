export const DEFAULT_DEMO_USER_ID = 'xiaofuge';
export const DEFAULT_DEMO_ACTIVITY_ID = 100301;

export function getDemoUserId() {
  if (typeof window === 'undefined') {
    return DEFAULT_DEMO_USER_ID;
  }

  return new URLSearchParams(window.location.search).get('userId') || DEFAULT_DEMO_USER_ID;
}

export function getDemoActivityId() {
  if (typeof window === 'undefined') {
    return DEFAULT_DEMO_ACTIVITY_ID;
  }

  const activityId = Number(new URLSearchParams(window.location.search).get('activityId'));
  return activityId || DEFAULT_DEMO_ACTIVITY_ID;
}

export function getDemoParams() {
  return {
    userId: getDemoUserId(),
    activityId: getDemoActivityId(),
  };
}
