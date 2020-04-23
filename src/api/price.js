import axios from '@/config/httpConfig'
const urlMock = "http://192.168.21.79:3000/mock/25"

/**-----------------------------超时等待-------------------------- */
//查询列表—————————超时等待
function waitList(data) {
    return axios.post('/price/wait/queryList',data)
}
//新增/修改—————————超时等待
function waitSave(data) {
    return axios.post('/price/wait/saveOrUpdate',data)
}
//删除—————————超时等待
function waitDelete(data) {
    return axios.post('/price/wait/deleteOne',data)
}
//禁/启用—————————超时等待
function waitStatus(data) {
    return axios.post('/price/wait/modifyStatus',data)
}
/**---------------------------包车超额---------------------------- */
//查询列表—————————包车超额
function overList(data) {
    return axios.post('/price/over/queryList',data)
}
//新增/修改—————————包车超额
function overSave(data) {
    return axios.post('/price/over/saveOrUpdate',data)
}
//删除—————————包车超额
function overDelete(data) {
    return axios.post('/price/over/deleteOne',data)
}
//禁/启用—————————包车超额
function overStatus(data) {
    return axios.post('/price/over/modifyStatus',data)
}

//餐补管理-----------------------------------------------------
/**查询——餐补列表 */
function lunchList(data) {
    return axios.post('/price/lunch/queryList',data)
}
/**启禁用——餐补 */
function lunchStatus(data) {
    return axios.post('/price/lunch/modifyStatus',data)
}
/**保存/更新——餐补 */
function lunchAddUp(data) {
    return axios.post('/price/lunch/saveOrUpdate',data)
}
/**删除——餐补 */
function lunchRemove(data) {
    return axios.post('/price/lunch/deleteOne',data)
}
//夜间费用--------------------------------------------------------
/**夜间费列表 */
function nightList(data) {
  return axios.post('/price/night/queryList',data)
}
/**保存更新夜间费 */
function nightAddUp(data) {
  return axios.post('/price/night/saveOrUpdate',data)
}
/**启用禁用夜间费 */
function nightStatus(data) {
  return axios.post('/price/night/modifyStatus',data)
}
/**删除夜间费 */
function nightRemove(data) {
  return axios.post('/price/night/deleteOne',data)
}

//基础定价管理-----------------------------------------------------
/**查询——价格配置列表 */
function basePriceList(data) {
    return axios.post('/price/basePrice/queryList',data)
}
/**查询——时长里程查询 */
function basePriceQueryDuration(data) {
    return axios.post('/price/basePrice/queryDuration',data)
}
/**查询——优惠设定包车查询 */
function basePriceSearchDuration(data) {
    return axios.post('/price/basePrice/searchDuration',data)
}
/**查询——后台下单-小单价格查询 */
function basePriceSubOrderPayInfo(data) {
    return axios.post('/price/basePrice/querySubOrderPayInfo',data)
}
/**保存/更新——价格 */
function basePriceAddUp(data) {
    return axios.post('/price/basePrice/saveOrUpdate',data)
}
/**删除——删除价格配置 */
function basePriceRemove(data) {
    return axios.post('/price/basePrice/deleteOne',data)
}
//台湾基础定价----------------------------------------------------------
/**查询-列表 */
function twPriceList(data){
  return axios.post('/price/twPrice',data)
}
/**保存 */
function twPriceSave(data){
  return axios.post('/price/twPrice/save',data)
}


export default {waitList,waitSave,waitDelete,waitStatus,overList,overSave,overDelete,overStatus,lunchList,lunchStatus,lunchAddUp,lunchRemove,basePriceList,basePriceQueryDuration,basePriceSearchDuration,basePriceSubOrderPayInfo,basePriceAddUp,basePriceRemove,nightList,nightAddUp,nightStatus,nightRemove,twPriceList,twPriceSave}