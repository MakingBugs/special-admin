import axios from '@/config/httpConfig'
// --------------------行程单-----------------
//列表
export function tripList(data) {
    return axios.post('/tripOrder/tripList',data)
}



