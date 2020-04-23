export default {
    set userInfo(value){
        var curTime = new Date().getTime();
        localStorage.setItem("account",JSON.stringify(value));
        localStorage.setItem("logintime",curTime);
    },
    get UserToken(){
        var dataObj = JSON.parse(localStorage.getItem("account"));
        var time = JSON.parse(localStorage.getItem("logintime"));
        if (new Date().getTime() - time>1000*60*60*3) {
            // console.log('token已过期');
        }else{
            return dataObj.uid;
        }
    },
    get userAccount(){
        return JSON.parse(localStorage.getItem("account"));
    },
    /* 导航菜单是否折叠 */
    isSidebarNavCollapse: false,
    /* 面包屑导航列表 */
    crumbList: []
}
