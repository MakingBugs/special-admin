const baseUrl =  process.env.NODE_ENV === 'production' ? process.env.VUE_APP_HOST : process.env.VUE_APP_BASE
export default baseUrl
// const baseUrl = process.env.NODE_ENV === 'production' ? 'http://stest.carplusgo.com/api' : '/api'
//http://118.31.122.123:7022    测试映射ip
//测试环境：http://stest.carplusgo.com/api

//http://172.16.96.237:7022     生产映射ip
//生产环境：https://special.carplusgo.com/api
