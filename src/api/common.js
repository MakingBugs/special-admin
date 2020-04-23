import axios from '@/config/httpConfig'
const urlMock = "http://192.168.21.79:3000/mock/25";
//const url = "http://10.21.241.68:7022" //zhikuan
//登录
export function login(data) {
    return axios.post('/login', data, axios.form)
}
//菜单
export function fetchPermission() {
    return axios.post('/common/getmenues')
}
//获取oss的accessKeyId、accessKeySecret、securityToken
export function getOssAuthInfo() {
    return axios.post('/oss/getOssAuthInfo')
}
//查询城市列表
export function cityList(data) {
    return axios.post('/sys/areaInfo/provinceCityRelation',data)
}
//查询下拉框列表
export function optionsList(data) {
    return axios.post('/sys/dictionary/queryList',data)
}
//查询操作日志列表
export function operationLogList(data) {
    return axios.post('/sys/operationLogs/searchLogList',data)
}
//查询操作日志详情
export function operationLogDetail(data) {
    return axios.post('/sys/operationLogs/queryLogDetail',data)
}
