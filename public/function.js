/**表单检查 */
const Check={
  /**非空验证 */
  required:{
    /**验证下拉框 */
    select(msg){
      return {required: true, message: msg}
    },
    /**一般Input验证 */
    req(msg){
      return {required: true, message: msg}
    },
    // PCA:{required: true, message: '请选择数据！'},
    // req:{required: true, message: '此项必填！'},
    // select:{required: true, message: '请选择数据！', trigger: 'blur,change',type:'number'},
    // text:{required: true, message: '此项不可为空！', trigger: 'blur,change'},
    // number:{required: true, message: '此项不可为空！', trigger: 'blur,change',type:'number'},
    // radio:{required:true, message: '至少选中一项！', trigger: 'change' }, //单选框
    // multiple:{required: true, type: 'array', min: 1, message: '至少选中一项！', trigger: 'change'},//多选
    // select1:{required: true, message: '请选择数据！', trigger: 'blur,change',type:'text'},//下拉框
    // date1:{required: true, message: '日期不可为空！', type: 'date', trigger: 'change'},//日期
  },
  /**内容验证 */
  checkvalue:{
    // number:{pattern:/^[0-9]*$/,message: '内容必须为数字！', trigger: 'blur,change'},
    // mail:{type: 'email', message: '邮箱格式错误！', trigger: 'blur,change'},
    // date:{type: 'date', message: '时间格式错误！', trigger: 'blur,change'},
    // tel:{pattern:/^\d{3}-\d{8}|\d{4}-\d{7}$/,message:'格式错误！示例(0370-6666888)',trigger:'blur,change'},
    // fax:{pattern:/^(\d{3,4}-)?\d{7,8}$/,message:'格式错误！示例(0370-6666888)',trigger:'blur,change'},
    // zipcode:{pattern:/^[1-9]\d{5}(?!\d)$/,message:'邮政编码格式错误！',trigger:'blur,change'},
    // mobiel:{pattern:/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,message:'手机号码格式错误！',trigger:'blur,change'}
  }
}

/**数组、对象的深拷贝 */
function DeepClone(value){
  let obj
  obj=JSON.parse(JSON.stringify(value))
  return obj
}

// /**餐补功能-字符串转时间（HH:mm） */
// function StrToTime(strDate) { 
//   var str=strDate.split(":")
//   var a=str[0]
//   var b=str[1]
//   var Time=new Date(2020,0,0,a,b)
//   return Time; 
// } 

export default {DeepClone,Check}

