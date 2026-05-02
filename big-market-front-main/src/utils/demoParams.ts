export const DEFAULT_DEMO_ACTIVITY_ID = 100301;

const DEMO_USER_ID_STORAGE_KEY = 'big_market_guest_user_id';
const DEMO_USER_ID_PREFIX = 'guest_';

function createGuestUserId() {
  const randomValue =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 12)
      : Math.random().toString(16).slice(2, 14).padEnd(12, '0');

  return `${DEMO_USER_ID_PREFIX}${randomValue}`;
}

export function getDemoUserId() {
  if (typeof window === 'undefined') {
    return `${DEMO_USER_ID_PREFIX}preview`;
  }

  const urlUserId = new URLSearchParams(window.location.search).get('userId');
  if (urlUserId) {
    localStorage.setItem(DEMO_USER_ID_STORAGE_KEY, urlUserId);
    return urlUserId;
  }

  const cachedUserId = localStorage.getItem(DEMO_USER_ID_STORAGE_KEY);
  if (cachedUserId) {
    return cachedUserId;
  }

  const guestUserId = createGuestUserId();
  localStorage.setItem(DEMO_USER_ID_STORAGE_KEY, guestUserId);
  return guestUserId;
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

export function resetDemoUserId() {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(DEMO_USER_ID_STORAGE_KEY);
}
