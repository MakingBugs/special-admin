// --------------------------公司管理----------------------------------
import axios from '@/config/httpConfig'
const urlMock = "http://192.168.21.79:3000/mock/25";
// ------------------据点-----------------
//查询列表
export function stationList(data) {
    return axios.post('/company/station/queryList',data)
}
//新增/修改
export function stationSave(data) {
    return axios.post('/company/station/saveOrUpdate',data)
}
//删除
export function stationDelete(data) {
    return axios.post('/company/station/deleteOne',data)
}
//禁/启用
export function stationStatus(data) {
    return axios.post('/company/station/modifyStatus',data)
}
// ------------------车辆类型-----------------
//查询列表
export function vehicleList(data) {
    return axios.post('/company/vehicle/queryList',data)
}
//新增/修改
export function vehicleSave(data) {
    return axios.post('/company/vehicle/saveOrUpdate',data)
}
//删除
export function vehicleDelete(data) {
    return axios.post('/company/vehicle/deleteOne',data)
}
//禁/启用
export function vehicleStatus(data) {
    return axios.post('/company/vehicle/modifyStatus',data)
}
// -------------------车型-----------------
//查询列表
export function carClassList(data) {
    return axios.post('/company/carClass/queryList',data)
}
//新增/修改
export function carClassSave(data) {
    return axios.post('/company/carClass/saveOrUpdate',data)
}
//删除
export function carClassDelete(data) {
    return axios.post('/company/carClass/deleteOne',data)
}
//禁启用
export function carClassStatus(data) {
    return axios.post('/company/carClass/modifyStatus',data)
}
// --------------------车辆资料维护-----------------
//列表
export function vehicleDataList(data) {
    return axios.post('/company/vehicleData/queryList',data)
}
//新增/修改
export function vehicleDataSave(data) {
    return axios.post('/company/vehicleData/saveOrUpdate',data)
}
//据点车型级联查询
export function vehicleRelation(data) {
    return axios.post('/stationInfo/vehicleRelation',data)
}
// --------------------机场资料维护-----------------
//列表
export function airportDataList(data) {
    return axios.post('/company/airportData/queryList',data)
}
//禁启用
export function airportDataStatus(data) {
    return axios.post('/company/airportData/modifyStatus',data)
}
//新增
export function airportDataSave(data) {
    return axios.post('/company/airportData/save',data)
}
//修改
export function airportDataUpdate(data) {
    return axios.post('/company/airportData/update',data)
}
// --------------------驾驶员每日出勤查询-----------------
//列表
export function attendanceList(data) {
    return axios.post('/drive/attendance/queryList',data)
}
// --------------------驾驶员资料维护-----------------
//列表
export function driverList(data) {
    return axios.get('/driver/search',{params:data})
}
//禁启用
export function driverStatus(data) {
    return axios.post('/driver/updateStatus',data)
}
//新增/修改
export function driverSave(data) {
    return axios.post('/driver/insertOrUpdate',data)
}
//-----------------------用户资料--------------------
//列表
export function userSearchList(data){
    return axios.post('/company/user/search',data)
}
//新增/修改
export function userSave(data) {
    return axios.post('/company/user/insertOrUpdate',data)
}
//根据ID查询用户资料
export function userGetList(data) {
    return axios.get('/company/user/get/'+data)
}
//-----------------------企业资料--------------------
//列表
export function searchList(data){
    return axios.post('/company/search',data)
}
//新增/修改
export function companySave(data) {
    return axios.post('/company/insertOrUpdate',data)
}
//根据ID查询企业资料
export function companyGetList(data) {
    return axios.get('/company/get/'+data)
}
//查询所有企业
export function companySearchAll(){
    return axios.get('/company/searchAll')
}
//根据企业id查支付方式
export function GetPayWay(data){
    return axios.get('/company/payWay/'+data)
}