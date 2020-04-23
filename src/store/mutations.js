export default {
    LOGIN_IN(state, account) {
        state.userInfo = account;
    },
    LOGIN_OUT(state) {
        localStorage.clear();
    },
    toggleNavCollapse(state) {
        state.isSidebarNavCollapse = !state.isSidebarNavCollapse
    },
    setCrumbList(state, list) {
        state.crumbList = list
    },
    currentId(state, val) {
        state.currentMenuId = val
    },
}