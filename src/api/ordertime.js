import axios from '@/config/httpConfig'
const urlMock = "http://192.168.21.79:3000/mock/25";
//------------------------预约时间--------------------------
//预约用车时间配置查询
export function appoTimeList(){
    return axios.get('/ordertime/appointmentTime')
}
//预约用车时间配置保存
export function appoTimeSave(data){
    return axios.post('/ordertime/appointmentTime/save',data)
}
//------------------------年度假日---------------------------
//年度假日
export function yearHolidayList(data) {
    return axios.post('/ordertime/yearHoliday',data)
}
//保存（单个/批量）
export function yearHolidaySave(data){
    return axios.post('/ordertime/yearHoliday/save',data)
}
//删除
export function yearHolidayDelete(data){
    return axios.get('/ordertime/yearHoliday/delete/'+data)
}
//产生年度假日
export function yearHolidayCreate(data){
    return axios.post('/ordertime/yearHoliday/createAnnualHoliday',data)
}