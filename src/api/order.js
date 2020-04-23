// --------------------------订单管理----------------------------------
import axios from '@/config/httpConfig'
const urlMock = "http://192.168.21.79:3000/mock/25";
//订单列表
export function orderList(data) {
    return axios.post('/order/list/query',data)
}
//小单详情
export function orderSubDetail(id) {
    return axios.get('/order/detail/query?orderId='+id)
}
//大单详情
export function orderDetail(id) {
    return axios.get('/order/toCreateSubOrder?orderBatchId='+id)
}
//下单
export function createOrder(data) {
    return axios.post('/order/create',data)
}
//订车人模糊查询
export function vehicleUserSearch(data) {
    return axios.post('/user/search',data)
}
//同订车人
export function getSubscriperInfo(id) {
    return axios.get('/order/getSubscriperInfo?subscriperId='+id)
}
//时长里程查询
export function mileageDuration(data) {
    return axios.post('/price/basePrice/queryDuration',data)
}
//航站楼查询
export function terminalList(id) {
    return axios.get('/company/airportData/queryTerminalListByCityCode?cityCode='+id)
}
//车型查询
export function vehicleList(data) {
    return axios.get('/company/vehicle/queryByCityCode',{params:data})
}
//下单价格查询
export function priceQuery(data) {
    return axios.post('/price/basePrice/querySubOrderPayInfo',data)
}
//完单回复——查询
export function finishReplyList(id) {
    return axios.get('/order/queryPayItem?orderId='+id)
}
//完单回复——保存
export function finishReply(data) {
    return axios.post('/order/finishReply',data)
}
//司机列表、车辆列表
export function carOrDriverList(data) {
    return axios.post('/order/dispatch/queryDispatchResources',data)
}
//派工
export function dispatchSaveOne(data) {
    return axios.post('/order/dispatch/saveOne',data)
}
//取消订单
export function cancelOrder(data) {
    return axios.post('/order/cancelOrder',data)
}



// --------------------------司机排班----------------------------------
//排班列表
export function scheduleList(data) {
    return axios.post(urlMock+'/order/driverSchedule/queryList',data)
}
//设置司机休假
export function scheduleRest(data) {
    return axios.post(urlMock+'/order/driverSchedule/saveHoliday',data)
}


// //查询列表—————————司机派工
// export function dispatchList(data) {
//     return axios.post(urlMock+'/order/dispatch/queryList',data)
// }

// //完工列表
// export function finishList(data) {
//     return axios.post(urlMock+'/order/finish/queryList',data)
// }
// //查询列表——————————价格配置
// export function basePriceList(data) {
//     return axios.post(urlMock+'/price/basePrice/queryList',data)
// }