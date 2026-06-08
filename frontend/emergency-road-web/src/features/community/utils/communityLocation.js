const LAST_COMMUNITY_LOCATION_KEY = "lastCommunityLocation";
const LEGACY_COMMUNITY_HPID_KEY = "lastCommunityHpid";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

function readSavedLocation() {
  const raw = localStorage.getItem(LAST_COMMUNITY_LOCATION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(LAST_COMMUNITY_LOCATION_KEY);
    return null;
  }
}

export function saveLastCommunityLocation({ hpid, postId = null, hospitalName }) {
  if (!hpid) return;

  const previous = readSavedLocation();
  const shouldKeepHospitalName =
    previous?.hpid === hpid && !hospitalName && previous?.hospitalName;

  localStorage.setItem(
    LAST_COMMUNITY_LOCATION_KEY,
    JSON.stringify({
      hpid,
      postId,
      hospitalName: shouldKeepHospitalName
        ? previous.hospitalName
        : hospitalName || null,
      savedAt: Date.now(),
    }),
  );
}

export function getLastCommunityLocation() {
  const savedLocation = readSavedLocation();

  if (savedLocation?.hpid) {
    const savedAt = Number(savedLocation.savedAt || 0);
    const isExpired = savedAt && Date.now() - savedAt > MAX_AGE_MS;

    if (isExpired) {
      localStorage.removeItem(LAST_COMMUNITY_LOCATION_KEY);
      return null;
    }

    return {
      hpid: savedLocation.hpid,
      postId: savedLocation.postId || null,
      hospitalName: savedLocation.hospitalName || null,
    };
  }

  const legacyHpid = localStorage.getItem(LEGACY_COMMUNITY_HPID_KEY);
  return legacyHpid ? { hpid: legacyHpid, postId: null, hospitalName: null } : null;
}

export function getLastCommunityPath() {
  const savedLocation = getLastCommunityLocation();
  if (!savedLocation?.hpid) return null;

  if (savedLocation.postId) {
    return `/community/${savedLocation.hpid}/posts/${savedLocation.postId}`;
  }

  return `/community/${savedLocation.hpid}`;
}
