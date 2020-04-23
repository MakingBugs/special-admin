// --------------------------策略管理----------------------------------
import axios from '@/config/httpConfig'
let testUrl = 'http://stest3.carplusgo.com/api'
// ------------------折扣配置-----------------ist
//查询列表
export function dynamicList(data) {
    return axios.post(testUrl+'/strategy/dynamicDiscount/queryList',data)
}
//失效
export function disableOne(data) {
    return axios.post('/strategy/dynamicDiscount/disableOne',data)
}
//折扣详情
export function dynamicDetail(data) {
    return axios.post(testUrl+'/strategy/dynamicDiscount/queryOne',data)
}
//新增/修改
export function dynamicSave(data) {
    return axios.post('/strategy/dynamicDiscount/saveOrUpdate',data)
}

// ------------------审核-----------------
//查询列表
export function examineList(data) {
    return axios.post('/strategy/auditDynamicDiscount/queryList',data)
}
//审核通过
export function examinePass(data) {
    return axios.post('/strategy/auditDynamicDiscount/auditOne',data)
}