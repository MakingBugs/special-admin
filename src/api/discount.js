import axios from '@/config/httpConfig'
const urlMock = "http://192.168.21.79:3000/mock/25"

//查询优惠设定列表————————优惠设定
function discountList(data) {
    return axios.post('/discount/search',data)
}
//优惠设定修改状态————————优惠设定
function  discountStatus(data){
  return axios.post('/discount/updateStatus',data)
}
//优惠设定新增或修改————————优惠设定
function discountSave(data) {
    return axios.post('/discount/insertOrUpdate',data)
}
//优惠设定车辆类型查询————————优惠设定
function discountGet(data){
    return axios.get('/company/vehicle/get/'+data)
}
//优惠设定包车查询————————优惠设定
function discountDurations(data){
  return axios.post('/price/searchDuration',data)
}
//优惠设定删除————————优惠设定
function discountDelete(data){
  return axios.post('/discount/delete/',data)
}
//优惠设定机场信息查询————————优惠设定
function discountAirport(data){
  return axios.post('/discount/search/airport',data)
}

export default {discountList,discountStatus,discountSave,discountGet,discountDurations,discountAirport,discountDelete}
