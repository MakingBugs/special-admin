import axios from 'axios'
import store from '@/store/index.js'
// import baseURL from './baseUrl'
import { Message } from 'element-ui'
//axios默认Request Payload入参，'Content-Type': 'application/json'  
const http = {}
var instance = axios.create({
    timeout: 5000,
    baseURL:process.env.VUE_APP_BASE,
    validateStatus(status) {
        switch (status) {
        case 400:
            Message.error('请求出错')
            break
        case 401:
            Message.warning({
                message: '授权失败，请重新登录'
            })
            store.commit('LOGIN_OUT')
            setTimeout(() => {
                window.location.reload()
            }, 1000)
            return
        case 403:
            Message.warning({
                message: '拒绝访问'
            })
            break
        case 404:
            Message.warning({
                message: '请求错误,未找到该资源'
            })
            break
        case 500:
            Message.warning({
                message: '服务端错误'
            })
            break
        }
        return status >= 200 && status < 300
    }
})
//添加请求拦截器
instance.interceptors.request.use(
    function(config) {
        // 请求头添加token
        if(store.state.currentMenuId){
            config.headers.menuId = store.state.currentMenuId
        }
        // if (store.state.UserToken) {
        //     config.headers.Authorization = `Bearer ${store.state.UserToken}`
        // }
        return config
    },
    function(error) {
        return Promise.reject(error)
    }
)
// 响应拦截器即异常处理
instance.interceptors.response.use(
    response => {
        return response.data
    },
    err => {
        if (err && err.response) {
        } else {
            err.message = '连接服务器失败'
        }
        // Message.error({
        //     message: err.message
        // })
        return Promise.reject(err.response)
    }
)
http.get = function(url, options) {
    let loading = document.getElementById('ajaxLoading')
    if (!options || options.isShowLoading !== false) {
        loading = document.getElementById('ajaxLoading')
        loading.style.display = 'block'
    }
    return new Promise((resolve, reject) => {
        instance
            .get(url, options)
            .then(response => {
                if (!options || options.isShowLoading !== false) {
                    loading.style.display = 'none'
                }
                if(response.errorCode==1002){
                    Message.warning({
                        message: '登录过期，请重新登录'
                    })
                    store.commit('LOGIN_OUT')
                    window.location.reload()
                }
                if (response.success) {
                    resolve(response.data)
                } else {
                    Message.error({
                        message: response.message
                    })
                    reject(response.message)
                }
            })
            .catch(e => {
                loading.style.display = 'none'
                // console.log(e)
            })
    })
}
http.post = function(url, data, options) {
    let loading = document.getElementById('ajaxLoading')
    if (!options || options.isShowLoading !== false) {
        loading.style.display = 'block'
    }
    return new Promise((resolve, reject) => {
        instance
            .post(url, data, options)
            .then(response => {
                if (!options || options.isShowLoading !== false) {
                    loading.style.display = 'none'
                }
                if(response.errorCode==1002){
                    Message.warning({
                        message: '登录过期，请重新登录'
                    })
                    store.commit('LOGIN_OUT')
                    window.location.reload()
                }  
                if (response.success) {
                    resolve(response.data)
                } else {
                    Message.error({
                        message: response.message
                    })
                    reject(response.message)
                }
            })
            .catch(e => {
                loading.style.display = 'none'
                // console.log(e)
            })
    })
}
//如果接口需要form提交,'Content-Type': 'application/x-www-form-urlencoded'
//引用这个方法，参考login接口
http.form = {
    transformRequest:function (data) {
        let ret = ''
        for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
    }
}
export default http
// transformResponse