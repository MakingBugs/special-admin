<template lang="html">
  <el-card class="box-card">
    <div class="search-bar">
      <el-form :inline="true" :model="searchData" class="fl" size="small">
        <el-form-item label="订单编号">
          <el-input v-model="searchData.orderId" placeholder="订单编号" style="width:120px;"></el-input>
        </el-form-item>
        <el-form-item label="勤务编号">
          <el-input v-model="searchData.orderSubId" placeholder="勤务编号" style="width:120px;"></el-input>
        </el-form-item>
        <el-form-item label="驾驶名称">
          <el-input v-model="searchData.driverName" placeholder="驾驶名称" style="width:120px;"></el-input>
        </el-form-item>
        <el-form-item label="据点">
          <el-select v-model="searchData.stationId" clearable placeholder="请选择">
              <el-option
                v-for="item in options"
                :value="item.value"
                :key="item.value"
                :label="item.desc"
              >
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="勤务状态">
          <el-select v-model="searchData.status" clearable placeholder="请选择" style="width: 120px;">
            <el-option value="1" label="已派工"></el-option>
            <el-option value="2" label="已完工"></el-option>
            <el-option value="3" label="空趟"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接送日期">
          <el-date-picker
            v-model="searchData.startTime"
            type="datetime"
            style="width:190px;"
            placeholder="选择时间">
          </el-date-picker>
          -
          <el-date-picker
            v-model="searchData.endTime"
            type="datetime"
            placeholder="选择时间"
            style="width:190px;"
            :picker-options="pickerOptions"
            default-time="23:59:59">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="initList">查询</el-button>
          <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div>
      <el-table
        :data="tableData"
        border
        fit
        highlight-current-row
        style="width: 100%"
        >
        <el-table-column
          label="操作"
          align="center"
          width="100"
          fixed
          >
          <template slot-scope="scope">
            <div>
              <el-button
                type="primary"
                size="mini"
                plain
                @click="handleReply(scope.$index, scope.row)"
              >回复</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            v-for="item in rowData"
            :prop="item.name"
            :label="item.text"
            align="center"
         >
        </el-table-column>
        <el-table-column
          label="勤务状态"
          align="center"
          >
          <template slot-scope="scope">
            <div v-if="scope.row.status=='1'">已派工</div>
            <div v-if="scope.row.status=='2'">完工确认</div>
            <div v-if="scope.row.status=='3'">空趟</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-bar">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="totalRecord"
          background
          >
        </el-pagination>
      </div>
    </div>
    <el-dialog title="完工回复" :visible.sync="dialogVisible" width="55%" @close="onDialogClose()">
      <el-form :inline="true" ref="dutyData" label-width="100px" :model="dutyData" size="mini">
        <el-divider content-position="left">勤务信息</el-divider>
        <el-form-item label="勤务单号">
            <el-input v-model="dutyData.subOrderId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="牌照号码">
            <el-input v-model="dutyData.carPlateNumber" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="驾驶名称">
            <el-input v-model="dutyData.driverName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="据点名称">
            <el-input v-model="dutyData.stationName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="用车时间">
            <el-input v-model="dutyData.orderTime" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="计费标准">
            <el-input v-model="dutyData.subOrderId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="订单金额">
            <el-input v-model="dutyData.subOrderId" :disabled="true"></el-input>
        </el-form-item>
        <el-table
            border
            fit
            highlight-current-row
            style="width: 100%"
            >
            <el-table-column
                v-for="item in rowPriceData1"
                :prop="item.name"
                :label="item.text"
                align="center">
            </el-table-column>
        </el-table>
      </el-form>
      <el-form :inline="true" ref="dataForm" label-width="100px" :rules="rules" :model="dataForm" size="small">
        <el-divider content-position="left">完工回复</el-divider>
        <el-row>
          <el-col :span="10">
            <el-form-item label="完工日期" prop="vehicleName">
              <el-date-picker
                  v-model="time3"
                  type="date"
                  style="width:200px;"
                  placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="具体时间" prop="vehicleName">
              <el-time-picker
                is-range
                v-model="value1"
                range-separator="至"
                value-format="HH:mm:ss"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                @change="getSTime">
              </el-time-picker>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="开始里程" prop="vehicleName">
              <el-input v-model="dataForm.vehicleName" placeholder="开始里程"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="结束里程" prop="vehicleName">
              <el-input v-model="dataForm.vehicleName" placeholder="结束里程"></el-input>
          </el-form-item></br>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="起点" prop="vehicleName">
              <el-input v-model="dataForm.vehicleName" placeholder="起点"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="终点" prop="vehicleName">
              <el-input v-model="dataForm.vehicleName" placeholder="终点"></el-input>
            </el-form-item>
          </el-col>
        </el-row>        
        <el-divider content-position="left">应收明细</el-divider>
        <el-table
            border
            fit
            highlight-current-row
            style="width: 100%"
            >
            <el-table-column
                v-for="item in rowPriceData2"
                :prop="item.name"
                :label="item.text"
                align="center">
            </el-table-column>
        </el-table>
        <el-divider content-position="left">收款登记</el-divider>
        <el-row>
          <el-col :span="7">
            <el-form-item label="收款日期" prop="vehicleName">
              <el-date-picker
                  v-model="time6"
                  type="date"
                  style="width: 150px;"
                  placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="收款方式" prop="vehicleName">
              <el-select v-model="dataForm.stationId" clearable placeholder="请选择" style="width: 150px;">
                <el-option value="0" label="现金"></el-option>
                <el-option value="1" label="支付宝"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="收款金额" prop="vehicleName">
              <el-input v-model="dataForm.vehicleName" placeholder="收款金额" style="width: 150px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button type="success" icon="el-icon-plus" size="small" @click="handleAddPrice">新增</el-button>
          </el-col>
        </el-row>
        
        <el-table
            border
            fit
            highlight-current-row
            style="width: 100%"
            >
            <el-table-column
                v-for="item in rowPriceType"
                :prop="item.name"
                :label="item.text"
                align="center">
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="100"
                >
                <el-button
                size="mini"
                type="danger"
                plain
                @click="handleRemove(scope.$index, scope.row)">删除</el-button>
            </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="onDialogSubmit()">保存</el-button>
        <!-- <el-button size="medium" type="primary" @click="onDialogSubmit()" v-else>立即创建</el-button> -->
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
    import { finishList,vehicleSave,vehicleDelete,vehicleStatus,optionsList } from '@/api/common'
    export default {
        data() {
            return {
                totalRecord: 0,
                pageSize: 10,
                tableLoading: false,
                dialogVisible: false,
                options:'',
                time1:"",
                time2: new Date(),
                time3:"",
                time4:"",
                time5:"",
                time6:"",
                value1:'',
                searchData: {
                    orderId: '',
                    orderSubId: '',
                    stationId:'',
                    status:'',
                    driverName:'',
                    startTime:'',
                    endTime:'',
                    page:1
                },
                pickerOptions:{
                  disabledDate:(time)=>{
                    return time.getTime() < this.searchData.startTime;
                  }
                },  
                dutyData:{  //勤务信息
                  subOrderId: '',//勤务编号
                  carPlateNumber:'',//车牌号
                  driverName:'',//驾驶名称
                  stationName: '',//据点
                  orderTime:'',  //用车时间
                },
                dataForm: {
                    orderId:'',//订单编号
                    subOrderId:'',//勤务编号
                    startPoint:'',//起点
                    endPoint:'',//终点
                },
                rules: {
                  stationId: [
                      {
                          required: true,
                          message: '请选择所属据点',
                          trigger: 'change'
                      },
                      
                  ],
                  vehicleName: [
                      {
                          required: true,
                          message: '车辆类型名称不能为空',
                          trigger: 'blur'
                      },
                  ],
                  vehiclePic:[
                      {
                          required: true,
                          message: '车辆类型图片不能为空',
                          trigger: 'change'
                      },
                  ],
                  seats: [
                      {
                          required: true,
                          message: '可容乘客不能为空',
                          trigger: 'blur'
                      },
                  ],
                  luggage: [
                      {
                          required: true,
                          message: '可容行李不能为空',
                          trigger: 'blur'
                      },
                  ],
                },   
                rowData:[
                  {name:'orderId',text:'订单编号'},
                  {name:'subOrderId',text:'勤务编号'},
                  {name:'vehicleName',text:'接送日期'},
                  {name:'orderTime',text:'用车时间'},
                  {name:'orderSubType',text:'服务类型'},
                  {name:'vehicleName',text:'车辆类型名称'},
                  {name:'vehicleId',text:'接送地点'},
                  {name:'stationName',text:'用车类型'},
                  {name:'enterpriseName',text:'企业名称'},
                  {name:'passenger',text:'乘客'},
                  {name:'stationName',text:'订车人'},
                  {name:'stationName',text:'据点'},
                  {name:'carPlateNumber',text:'车牌号码'},
                  {name:'driverName',text:'驾驶名称'},
                  {name:'needInvoice',text:'需开发票'},
                ],   
                rowPriceData1:[
                    {name:'vehicleId',text:'定价'},
                    {name:'stationName',text:'餐费'},
                    {name:'vehicleName',text:'夜间加费'},
                    {name:'vehicleId',text:'配件费'},
                    {name:'stationName',text:'折扣'},
                    {name:'vehicleName',text:'总金额'},
                ],
                rowPriceData2:[
                    {name:'vehicleId',text:'订单金额'},
                    {name:'stationName',text:'超时费用'},
                    {name:'vehicleName',text:'超里费用'},
                    {name:'vehicleId',text:'等待超时费'},
                    {name:'stationName',text:'停车费'},
                    {name:'vehicleName',text:'过路过桥费'},
                    {name:'stationName',text:'空趟费用'},
                    {name:'vehicleName',text:'应收总金额'},
                ],
                rowPriceType:[
                    {name:'vehicleId',text:'收款日期'},
                    {name:'stationName',text:'收款方式'},
                    {name:'vehicleName',text:'收款金额'},
                    {name:'vehicleName',text:'备注'},
                ],
                tableData: [],

                dialogImageUrl: '',
                imgdialogVisible: false,

                
            }
        },
        created() {
            this.initList()
            this.selectList()
        },
        methods: {
            //完工的具体时间段
            getSTime(val) {
              val.map(item=>{
                return item
              })
                console.log(val);//这个sTime是在data中声明的，也就是v-model绑定的值
            },
            handleAddPrice(){

            },
            //查询列表
            async initList() {
                const data = await finishList(this.searchData)
                this.tableData = data.list
                this.totalRecord = data.pageInfo.totalSize
            },
            //查询下拉框列表
            async selectList() {
                const data = await optionsList({dictionaryCodes:["STATION"]})
                this.options = data[0].list
            },
            //重置搜索条件
            handleReset() {
                this.searchData = {
                    vehicleId: '',
                    vehicleId:'',
                    vehicleName: '',
                    page:1
                }
                // this.initList()
            },
            //完工回复
            handleReply(index, row) {
                this.dialogVisible = true
                this.$nextTick(() => {
                  for (let x of Object.keys(this.dataForm)) {
                    this.dataForm[x] = row[x]                   
                  }
                  for (let y of Object.keys(this.dutyData)) {
                    this.dutyData[y] = row[y]                   
                  }
                })
            },
            //保存车型类型
            onDialogSubmit() {
              this.$refs.dataForm.validate((valid) => {
                if (valid) {
                  vehicleSave(this.dataForm).then(response => {
                    this.$message({
                      type: 'success',
                      message: '保存成功！'
                    });
                    this.dialogVisible=false
                    this.initList()
                  })
                } else {
                  return false;
                }
              });
            },
            //删除车型类型
            handleRemove(index, row) {
                this.$confirm('确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                  vehicleDelete({vehicleId:row.vehicleId}).then(response=>{
                    this.$message({
                      message: '删除成功',
                      type: 'success',
                      duration:1500,
                    });
                    this.initList()
                  });
                }).catch(err => { console.log(err) })
            },
            //禁启用
            handleStatus(row) {
              const tip = row.status==1?"启用成功":"禁用成功"
              const type = row.status==1?"success":"info"
              const status = row.status===1?2:1
              vehicleStatus({vehicleId:row.vehicleId,status:status}).then(response=>{
                this.$message({
                  message: tip,
                  type: type,
                  duration:1000,
                });
              });
            },
            //关闭弹窗
            onDialogClose() {
                this.imageList=[];
                this.dataForm.vehicleId = '';
                this.$refs.dataForm.resetFields()
            },   
            //跳到指定页        
            handleSizeChange(val) {
                this.pageSize = val
                this.initList()
            },
            //跳转到指定页
            handleCurrentChange(val) {
              this.searchData.page = val;
              this.initList()
            },
        },
    }
</script>
<style lang="scss" scoped>
    
</style>