const commentRule = {
    //带小数点的数字
    number : (rule, value, callback) => {
        if (!(/^\d+(?=\.{0,1}\d+$|$)/).test(value)) {
            callback(new Error('请输入数字'))
        }else {callback()}
    },
    //用于编辑时保存的再次验证——大于当前日期
    date : (rule, value, callback) => {
        if (new Date().getTime()>=new Date(value).getTime()+ 8.64e7) {
            callback(new Error('请选择大于当前时间的日期'))
        } else {callback()}
    },
    // //日期可选项——大于当前日期
    // pickerOptions:{ 
    //     disabledDate: time => {
    //       return time.getTime() < Date.now() - 8.64e7;
    //     }
    // },
}
export default commentRule
