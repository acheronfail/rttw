// TODO: make this better - much better

const defaultUserInfo = {
    completed: []
};

export function getUserInfo() {
    return JSON.parse(localStorage.getItem('rttw-userinfo')) || defaultUserInfo;
}

export function setUserInfo(userInfo) {
    // Keep completed list sorted by index
    userInfo.completed.sort((a, b) => a.index - b.index);
    return localStorage.setItem('rttw-userinfo', JSON.stringify(userInfo));
}

export function getUserSolution(index, info = getUserInfo()) {
    return info.completed.find(x => x.index === index);
};