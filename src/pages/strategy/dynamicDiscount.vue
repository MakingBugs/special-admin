<template lang="html">
    <el-card class="box-card">
      <div class="search-bar">
        <el-form :inline="true" :model="searchData" class="fl" size="small">
          <el-form-item label="城市">
            <el-select v-model="cityCode" placeholder="请选择">
                <el-option label="杭州" value=""></el-option>
                <!-- <el-option
                    v-for="item in carStatusList"
                    :key="item.value"
                    :label="item.desc"
                    :value="item.value">
                </el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="时间">
            <el-date-picker
                v-model="searchData.startDay"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
            </el-date-picker>
            -
            <el-date-picker
                v-model="searchData.endDay"
                type="date"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions1"
                placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="initList(1)">查询</el-button>
            <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
          </el-form-item>
          <el-form-item style="float: right;">
            <router-link :to="'/operation/operationLog/'+currentMenuId" style="color: #fff;">
              <el-button type="primary" plain @click="handleReset">操作日志</el-button>
            </router-link>
          </el-form-item>         
        </el-form>
      </div>
      <div  class="tools-bar">
        <el-button type="success" icon="el-icon-plus" size="small" @click="addEdit">新增折扣规则</el-button>
      </div>
      <div>
        <el-table :data="tableData" border fit>
          <el-table-column v-for="item in rowData" :prop="item.name" :label="item.text" align="center">
          </el-table-column>
          <el-table-column label="里程" align="center">
            <template slot-scope="scope">
                <div v-if="scope.row.discounts">
                    <div v-for="item in scope.row.discounts">{{item.distanceDesc}}</div>
                </div>
            </template>
          </el-table-column>
          <el-table-column label="折扣系数" align="center">
            <template slot-scope="scope">
                <div v-if="scope.row.discounts">
                    <div v-for="item in scope.row.discounts">{{item.discount1}}</div>
                </div>
            </template>
          </el-table-column>
          <el-table-column label="折扣" align="center">
            <template slot-scope="scope">
                <div v-if="scope.row.discounts">
                    <div v-for="item in scope.row.discounts">{{item.discount2}}</div>
                </div>
            </template>
          </el-table-column>
          <el-table-column label="生效时间" prop="time" align="center"></el-table-column>
          <el-table-column label="规则状态" prop="status" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width=250>
            <template slot-scope="scope">
              <div>
                <el-button v-if="scope.row.disableVisible" type="warning" size="mini" plain @click="handleInvalid(scope.$index, scope.row)">失效</el-button>
                <el-button v-if="scope.row.viewVisible" type="success" size="mini" plain @click="handleEdit(scope.$index, scope.row,0)">查看</el-button>
                <el-button type="primary" v-if="scope.row.editVisible" size="mini" plain @click="handleEdit(scope.$index, scope.row,1)">编辑</el-button>
                <el-button type="primary" size="mini" plain @click="handleEdit(scope.$index, scope.row,2)" style="margin-top: 8px;">复制</el-button>              
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-bar">
          <el-pagination
            :current-page="searchData.page"
            @current-change="handleCurrentChange"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="totalRecord"
            background
            >
          </el-pagination>
        </div>
      </div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible1" @close="onDialogClose(1)">
        <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="150px" style="width: 80%;" size="small">
            <el-form-item label="城市" prop="">
                <el-select v-model="dataForm.city" placeholder="请选择" style="width: 100%;">
                    <el-option value="杭州" label="杭州"></el-option>
                </el-select>
                <!-- <el-transfer v-model="value" :data="data"></el-transfer>330100 -->
            </el-form-item>
            <el-form-item label="车型" prop="">
              <el-select v-model="dataForm.vehicle" placeholder="请选择" style="width: 100%;">
                  <el-option value="专车" label="专车"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="日期" required>
              <el-col :span="11">
                  <el-form-item prop="startDay">
                      <el-date-picker
                          v-model="dataForm.startDay"
                          type="date"
                          :picker-options="pickerOptions2"
                          value-format="yyyy-MM-dd"
                          style="width: 100%;"
                          placeholder="选择时间">
                      </el-date-picker>
                  </el-form-item>
              </el-col>
              <el-col style="text-align: center;" :span="2">-</el-col>
              <el-col :span="11">
                  <el-form-item prop="endDay">
                      <el-date-picker
                          v-model="dataForm.endDay"
                          type="date"
                          :picker-options="pickerOptions3"
                          value-format="yyyy-MM-dd"
                          style="width: 100%;"
                          placeholder="选择时间">
                      </el-date-picker>
                  </el-form-item>
              </el-col>
            </el-form-item>  
            <el-form-item v-for="(item, index) in dataForm.times" :label="'时段 ' + (index+1)" style="position: relative;" required>
              <el-col :span="11">
                  <el-form-item :prop="'times.' + index + '.startTime'"
                  :rules="rules.startTime">
                      <el-time-picker 
                          v-model="item.startTime" 
                          placeholder="请选择时间" 
                          format="HH:mm"
                          value-format='HH:mm' 
                          style="width: 100%;"
                          :picker-options="{
                              selectableRange:`00:00:00 -${item.endTime ? item.endTime+':00' : '23:59:00'}`
                          }"
                      ></el-time-picker>
                  </el-form-item>
              </el-col>
              <el-col style="text-align: center;" :span="2">-</el-col>
              <el-col :span="11">
                  <el-form-item  :prop="'times.' + index + '.endTime'"
                  :rules="rules.endTime">
                      <el-time-picker 
                          v-model="item.endTime" 
                          placeholder="请选择时间" 
                          style="width: 100%;"
                          format="HH:mm"
                          value-format='HH:mm' 
                          :picker-options="{
                              selectableRange:`${item.startTime ? item.startTime+':00' : '00:00:00'}-23:59:00`
                          }"
                      ></el-time-picker>
                  </el-form-item>
              </el-col>                
              <el-button v-if="index===0" plain type="primary" @click.prevent="addTime()" icon="el-icon-plus" size="small" style="position: absolute;right: -70px;bottom: 18px;"></el-button>
              <el-button v-if="index>0" plain type="danger" @click.prevent="removeTime(item)" icon="el-icon-minus" size="small" style="position: absolute;right: -70px;bottom: 18px;"></el-button>
            </el-form-item>
            <el-form-item label="星期" prop="days" style="width:110%">
              <el-tag v-for="tag in tags" :key="tag.name" :type="tag.type" @click="handleClickWeek(tag)" style="margin:0 10px 10px 0;cursor: pointer;">{{tag.name}}</el-tag>
            </el-form-item> 
            <el-form-item label="封顶金额" prop="maxDiscount">
              <el-input type="text" v-model="dataForm.maxDiscount"></el-input>
            </el-form-item> 
            <el-form-item v-for="(item, index) in dataForm.discounts" :label="'里程折扣 ' + (index+1)" style="position: relative;" required>
                <el-col :span="11">
                    <el-form-item :prop="'discounts.' + index + '.distance'"
                    :rules="rules.distance">
                      <el-input v-model="item.distance" placeholder="里程数"></el-input>
                    </el-form-item>
                </el-col>
                <el-col style="text-align: center;" :span="2">-</el-col>
                <el-col :span="11">
                    <el-form-item :prop="'discounts.' + index + '.discount'"
                    :rules="rules.discount">
                      <el-input v-model="item.discount" placeholder="折扣数"></el-input>
                    </el-form-item>
                </el-col>
                <!-- <i class="el-icon-plus" v-if="index===0" @click.prevent="addDiscount()" style="position: absolute;right: -70px;bottom: 18px;"></i>
                <i class="el-icon-minus" v-if="index>0" @click.prevent="removeDiscount(item)" style="position: absolute;right: -70px;bottom: 18px;color: red;"></i> -->
                <el-button v-if="index===0" plain type="primary" @click.prevent="addDiscount()" size="small" icon="el-icon-plus" style="position: absolute;right: -70px;bottom: 18px;"></el-button>
                <el-button v-if="index>0" plain type="danger" @click.prevent="removeDiscount(item)" icon="el-icon-minus" size="small" style="position: absolute;right: -70px;bottom: 18px;"></el-button>
            </el-form-item> 
          </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="medium" @click="dialogVisible1 = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="onDialogSubmit()" v-if="dialogTitle=='修改折扣'">保存</el-button>
          <el-button size="medium" type="primary" @click="onDialogSubmit()" v-else>立即创建</el-button>
        </div>
      </el-dialog>
      <el-dialog title="折扣详情" :visible.sync="dialogVisible2" @close="onDialogClose(0)">
        <el-form label-width="200px" :model="dataForm">
            <el-form-item label="城市：" style="margin-bottom: 0;">
                <span>{{ dataForm.city }}</span>
            </el-form-item>
            <el-form-item label="车型：" style="margin-bottom: 0;">
              <span>{{ dataForm.vehicle }}</span>
            </el-form-item>
            <el-form-item label="生效日期：" style="margin-bottom: 0;">
              <span>{{ timeDetail }}</span>
            </el-form-item>
            <!-- <el-form-item label="结束日期：" style="margin-bottom: 0;">
              <span>{{ dataForm.endDay }}</span>
            </el-form-item> -->
            <el-form-item label="星期：" style="margin-bottom: 0;">
              <el-tag v-for="tag in tags" :key="tag.name" v-if="tag.type==='primary'" type="info" style="margin-right: 10px;">{{tag.name}}</el-tag>
            </el-form-item>
            <el-form-item label="封顶金额：" style="margin-bottom: 0;">
              <span>{{ dataForm.maxDiscount }} 元</span>
            </el-form-item>
            <el-form-item label="时段：" style="margin-bottom: 0;">
              <div v-for="item in dataForm.times">
                <span>{{ item.startTime }}</span>
                <span> -- </span>
                <span>{{ item.endTime }}</span>
              </div>
            </el-form-item>
            <el-form-item label="折扣：">
              <div v-for="item in dataForm.discounts">
                <span>{{ item.distanceDesc }}</span>
                <span> -- </span>
                <span>{{ item.discount1 }}</span>
              </div>
            </el-form-item>
        </el-form>
      </el-dialog>
    </el-card>
</template>
<script>
    import { mapState } from 'vuex'
    import { dynamicList,disableOne,dynamicDetail,dynamicSave} from '@/api/strategy'
    import Rule from '@/utils/rules';
    var dataForm = {
        id:null, //id
        city:'杭州',//城市
        vehicle:'专车',//车型
        maxDiscount: '',//封顶金额
        startDay:'',//开始日期
        endDay:'', //结束日期
        days: '',//星期id
        times:[{startTime:'',endTime:''}],//时段
        discounts:[{distance:'',discount:''}]//公里折扣
    }
    export default {
        data() {
            const validatePass1 = (rule, value, callback) => {
                let index = rule.field.substring(rule.field.indexOf(".")+1,rule.field.lastIndexOf("."))-1
                if((value*10)%5 !=0||value<0.5){
                    callback(new Error('请输入0.5为单位的数字'))
                } else {
                  if(index>=0){
                    let preVal = this.dataForm.discounts[index].distance
                    if(Number(value)<=Number(preVal)){
                        callback(new Error('公里数必须大于上一项'))
                    } else {callback()}
                  }else {
                    callback()
                  }
                }
            }
            const validatePass2 = (rule, value, callback) => {
                if(value < 0.1 || value > 0.99){
                    callback(new Error('请输入0.1-0.99的数字'))
                } else {callback()}
            }
            const validatePass3 = (rule, value, callback) => {
                if(value < this.dataForm.startDay){
                    callback(new Error('结束日期应大于或等于开始日期'))
                } else {callback()}
            }
            const validatePass4 = (rule, value, callback) => {
                if(value==''||!value){
                    callback()
                }else if (!(/^\d+(?=\.{0,1}\d+$|$)/).test(value)||value==0) {
                    callback(new Error('请输入大于0的数字'))
                }else {
                    callback()
                }
            }
            return {
                totalRecord: 0,
                pageSize: 10,
                tableLoading: false,
                dialogVisible1: false,
                dialogTitle: '',
                dialogVisible2:false,
                cityCode:'',//搜索城市回显
                timeDetail:'',//详情时间回显
                searchData: {
                    // cityCode: null,//车牌号
                    startDay: '',
                    endDay:'',//车辆状态
                    page:1
                },
                dataForm:dataForm,
                tags: [
                  { name: '星期一', type: 'info', val:'1' },
                  { name: '星期二', type: 'info', val:'2' },
                  { name: '星期三', type: 'info', val:'3' },
                  { name: '星期四', type: 'info', val:'4' },
                  { name: '星期五', type: 'info', val:'5' },
                  { name: '星期六', type: 'info', val:'6' },
                  { name: '星期日', type: 'info', val:'7' },
                ],
                pickerOptions1:{ //搜索日期
                    disabledDate:(time)=>{
                      return time.getTime() < new Date(this.searchData.startDay).getTime()- 8.64e7;
                    }
                },
                pickerOptions2:{ //起始日期——不可选
                    disabledDate:(time)=>{
                      return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                pickerOptions3:{ //结束日期——不可选
                    disabledDate:(time)=>{                        
                        return time.getTime() < new Date(this.dataForm.startDay).getTime()- 8.64e7;
                    }
                },
                rules: {
                  startDay: [{required: true,message: '开始日期不能为空'},{validator:Rule.date, trigger: 'blur'}],
                  endDay: [
                    {required: true,message: '结束日期不能为空'},
                    {validator:Rule.date, trigger: 'blur'},
                    {validator:validatePass3, trigger: 'blur'}
                  ],
                  startTime:[{required: true, message: '开始时间不能为空'}],
                  endTime:[{required: true, message: '结束时间不能为空'}],
                  maxDiscount: [{required: false,validator:validatePass4, trigger: 'blur'}],
                  days: [{required: true,message: '请选择星期'}],
                  distance:[
                    {required: true, message: '里程数不能为空'},
                    {pattern:/^\d+(?=\.{0,1}\d+$|$)/, message: '请输入数字'},
                    {validator: validatePass1}
                  ],
                  discount:[
                    {required: true, message: '折扣数不能为空'},
                    {pattern:/^\d+(?=\.{0,1}\d+$|$)/, message: '请输入数字'},
                    {validator: validatePass2}
                  ]
                  // pattern:/^\d+(\.5)?$/
                },   
                rowData:[
                  {name:'id',text:'规则ID'},
                  {name:'createTime',text:'配置日期'},
                  {name:'city',text:'城市'},
                  {name:'hours',text:'时段'},
                  {name:'vehicle',text:'车型'},
                  {name:'maxDiscount',text:'封顶金额'},
                ],    
                tableData: [],
            }
        },
        computed: {
            ...mapState( ['currentMenuId'])
        },
        created() {
            this.initList(1)
        },
        methods: {
              //查询列表
              async initList(val) {
                  this.searchData.page = val;
                  const data = await dynamicList(this.searchData)
                  this.tableData = data.list
                  this.totalRecord = data.pageInfo.totalSize
              },
              //失效
              handleInvalid(index, row) {
                this.$confirm('失效后将不在对应客户端展示,请确认是否失效', '提示', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'warning'
                }).then(() => {
                  disableOne({id:row.id}).then(response=>{
                    this.$message({
                      message: '失效成功',
                      type: 'success',
                      duration:1500,
                    });
                    this.initList(this.searchData.page)
                  });
                }).catch(err => { console.log(err) })
              },
              //删除时段
              removeTime(item) {
                  let index = this.dataForm.times.indexOf(item)
                  this.dataForm.times.splice(index, 1)
              },
              //添加时段
              addTime() {
                let index = this.dataForm.times.length-1
                this.$refs['dataForm'].validateField(`times.${index}.startTime`, errMsg => {
                  if(!errMsg){
                    this.$refs['dataForm'].validateField(`times.${index}.endTime`, errMsg => {
                      if(!errMsg){
                        this.dataForm.times.push({startTime:'',endTime:''});
                      }
                    })
                  }
                })
              },
              //删除折扣
              removeDiscount(item) {
                  let index = this.dataForm.discounts.indexOf(item)
                  this.dataForm.discounts.splice(index, 1)
              },
              //添加折扣
              addDiscount() {
                let index = this.dataForm.discounts.length-1
                if(index==9){
                    return this.$message({type: 'error',message: '最多只能配置十条！'});
                }
                this.$refs['dataForm'].validateField(`discounts.${index}.distance`, errMsg => {
                  if(!errMsg){
                    this.$refs['dataForm'].validateField(`discounts.${index}.discount`, errMsg => {
                      if(!errMsg){
                        this.dataForm.discounts.push({distance:'',discount:''});
                      }
                    })
                  }
                })
              },
              //星期点击事件
              handleClickWeek(tag){
                tag.type = tag.type==='info' ? 'primary' : 'info'
              },
            //重置搜索条件
            handleReset() {
                this.searchData = {
                    // cityCode: null,
                    startDay: '',
                    endDay:'',
                    page:this.searchData.page
                }
            },
            //新增折扣
            addEdit(){
              this.dialogVisible1 = true;
              this.dialogTitle='新增折扣';
              this.tags = this.tags.map(item=>{
                  item.type = "info"
                  return item;
              })
            },
            //修改折扣
            handleEdit(index, row,type) {
                dynamicDetail({id:row.id}).then(result=>{
                    switch(type){
                        case 0:
                            this.dialogTitle = "折扣详情"
                            this.dialogVisible2 = true
                            break;
                        case 1:
                            this.dialogTitle = "修改折扣"
                            this.dialogVisible1 = true
                            break;
                        case 2:
                            this.dialogTitle = "新增折扣"
                            this.dialogVisible1 = true
                            break;
                        default:
                    }
                    this.$nextTick(() => {
                      for (let x of Object.keys(this.dataForm)) {
                        this.dataForm[x] = result[x]                   
                      }
                      this.timeDetail = result.time
                      if(result.days){
                        let weekIds = result.days.split(",")
                        this.tags = this.tags.map(item=>{
                          item.type = weekIds.includes(item.val) ? "primary" : "info"
                          return item
                        })
                      }
                      if(type===2){
                        this.dataForm.id = null
                      }
                    })
                })
            },
            //保存折扣
            onDialogSubmit() {
              let days = []
              for(let i in this.tags){
                if(this.tags[i].type === "primary"){
                  days.push(this.tags[i].val)
                }
              }
              this.dataForm.days = days.join()
              this.$refs.dataForm.validate((valid) => {
                if (valid) {
                  if(this.isReaplce()){
                    dynamicSave(this.dataForm).then(response => {
                      this.$message({
                        type: 'success',
                        message: '保存成功！'
                      });
                      this.dialogVisible1=false
                      this.initList(this.searchData.page)
                    })
                  }else{
                      return this.$message({type: 'error',message: '存在重复时段'});
                  }
                } else {
                    return false;
                }
              });
            },
            isReaplce(){
              for (let k in this.dataForm.times) {
                if (!this.judege(k)) {
                  return false
                }
              }
              return true
            },
            judege(idx) {
              for (let k in this.dataForm.times) {
                if (idx !== k) {
                  if (this.dataForm.times[k].startTime <= this.dataForm.times[idx].startTime && this.dataForm.times[k].endTime > this.dataForm.times[idx].startTime ) {
                    return false
                  }
                  if (this.dataForm.times[k].startTime < this.dataForm.times[idx].endTime && this.dataForm.times[k].endTime >= this.dataForm.times[idx].endTime ) {
                    return false
                  }
                }
              }
              return true
            },
            //关闭弹窗
            onDialogClose(type) {
                this.dataForm ={
                    id:null, //id
                    city:'杭州',//城市
                    vehicle:'专车',//车型
                    maxDiscount: '',//封顶金额
                    startDay:'',//开始日期
                    endDay:'', //结束日期
                    days: '',//星期id
                    times:[{startTime:'',endTime:''}],//时段
                    discounts:[{distance:'',discount:''}]//公里折扣
                }
                if(type===1) this.$refs.dataForm.resetFields()
            },   
            //跳转到指定页
            handleCurrentChange(val) {
              this.initList(val)
            },
        }
    }
</script>
<style lang="scss">   
</style>