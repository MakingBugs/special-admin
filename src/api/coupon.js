// ----------------------------优惠券管理--------------------------------
import axios from '@/config/httpConfig'
// --------------------优惠券核销-----------------
//查询列表
export function couponVerifyList(data) {
    return axios.post('/verify/getCouponVerifyList',data)
}
//导出
export function verifyExport(data) {
    return axios.post('/verify/export',data)
}

// ---------------------优惠券模板-----------------
//列表
export function templateList(data) {
    return axios.post('/template/search',data)
}
//导出
export function templateExport(data) {
    return axios.post('/template/export',data)
}
  
//根据id查询优惠券详情
export function templateOne(id) {
    return axios.get('/template/get/'+id)
}
//新增/修改保存——优惠券/礼包
export function templateSave(data) {
    return axios.post('/template/insertOrUpdate',data)
}
//删除模板
export function templateDelete(id) {
    return axios.get('/template/delete/'+id)
}
// ---------------------优惠券发放-----------------
//上传
export function grantUpload(data) {
    return axios.post('/grant/upload',data, axios.form)
}
//发放
export function grantInsert(data) {
    return axios.post('/grant/insert',data)
}
// ----------------------发放记录-------------------
//列表
export function grantList(data) {
    return axios.post('/grant/search',data)
}
//导出
export function grantExport(data) {
    return axios.post('/grant/export',data)
}

// ---------------------优惠券审核-----------------
//列表
export function couponCheckList(data) {
    return axios.post('/coupon/IssuanceOrAuditing',data)
}
//审核
export function couponCheck(data) {
    return axios.post('/grant/examine',data)
}





