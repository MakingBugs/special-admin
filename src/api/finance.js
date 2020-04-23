// --------------------------账务管理----------------------------------
import axios from '@/config/httpConfig'
const urlMock = "http://192.168.21.79:3000/mock/25"
//收款明细列表
export function chargeInfoList(data) {
    return axios.post('/finance/chargeInfoList',data)
}
//确认收款
export function confirmCharge(data) {
    return axios.post('/finance/confirmCharge',data)
}

//发票列表
export function invoiceList(data) {
    return axios.post('/finance/invoiceList',data)
}
//发票详情
export function invoiceDetail(data) {
    return axios.post('/finance/invoiceDetail',data)
}
//重开发票
export function againInvoice(id) {
    return axios.get('/finance/againInvoice?invoiceId='+id)
}
//新增发票
export function addInvoice(data) {
    return axios.post('/finance/addInvoice',data)
}
//发票基础信息列表
export function invoiceBasicList(data) {
    return axios.post('/finance/invoiceBasicList',data)
}
//添加/修改基础信息
export function saveInvoiceBasic(data) {
    return axios.post('/finance/saveInvoiceBasic',data)
}
//订单退款列表
export function orderRefundList(data) {
    return axios.post('/finance/orderRefundList',data)
}
//退款操作
export function toRefund(data) {
    return axios.post('/finance/toRefund',data)
}