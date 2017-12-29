// TODO: make this better - much better
// Right now, all the user data is just stored in LocalStorage, which is not exactly a great
// solution. We could make a small server and store it all there - which would also give us the
// ability to have a high scores tally and be more like the original return true to win.

const LS_KEY = 'rttw-userinfo';
const defaultUserInfo = {
  completed: []
};

// Returns a fresh copy of the userInfo stored in localStorage
export function getUserInfo() {
  return JSON.parse(localStorage.getItem(LS_KEY) || JSON.stringify(defaultUserInfo));
}

// Sets the given userInfo object to localStorage
export function setUserInfo(userInfo) {
  // Keep completed list sorted by index
  userInfo.completed.sort((a, b) => a.index - b.index);
  return localStorage.setItem(LS_KEY, JSON.stringify(userInfo));
}

// Clears userInfo from localStorage
export function clearUserInfo() {
  return localStorage.removeItem(LS_KEY);
}

// Returns the user's solution for a given puzzle index, if any
export function getUserSolution(index, info = getUserInfo()) {
  return info.completed.find((x) => x.index === index);
}
