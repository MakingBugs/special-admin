// --------------------------隐私通话----------------------------------
import axios from '@/config/httpConfig'
// ------------------折扣配置-----------------ist
//查询列表
export function receiveList(data) {
    return axios.post('/receive/search',data)
}
//获取录音地址
export function receiveDown(id) {
    return axios.get('/receive/get/down/'+id)
}