// TODO: make this better - much better

const LS_KEY = 'rttw-userinfo';
const defaultUserInfo = {
    completed: []
};

export function getUserInfo() {
    return JSON.parse(localStorage.getItem(LS_KEY) || JSON.stringify(defaultUserInfo));
}

export function setUserInfo(userInfo) {
    // Keep completed list sorted by index
    userInfo.completed.sort((a, b) => a.index - b.index);
    return localStorage.setItem(LS_KEY, JSON.stringify(userInfo));
}

export function clearUserInfo() {
    return localStorage.removeItem(LS_KEY);
}

export function getUserSolution(index, info = getUserInfo()) {
    return info.completed.find(x => x.index === index);
};