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
        <el-form-item label="据点  ">
          <el-select v-model="searchData.stationId" clearable placeholder="请选择">
              <el-option
              v-for="item in stationOptions"
              :value="item.value"
              :key="item.value"
              :label="item.desc"
              >
              </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="initList">查询</el-button>
          <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- <div  class="tools-bar">
      <el-button type="success" icon="el-icon-plus" size="small" @click="dialogVisible = true;dialogTitle='新增车型类型'">新增</el-button>
    </div> -->
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
          width="180px"
          fixed
          >
          <template slot-scope="scope">
            <div>
                <el-button
                    size="mini"
                    type="success"
                    plain
                    @click="handleEdit(scope.$index, scope.row,0)">查看</el-button>
                <el-button
                    type="primary"
                    size="mini"
                    plain
                    @click="handleEdit(scope.$index, scope.row,1)"
                >派工设定</el-button>
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
            <div v-if="scope.row.status=='1'">未派工</div>
            <div v-if="scope.row.status=='0'">已派工</div>
          </template>
        </el-table-column>
        <el-table-column
          label="订单状态"
          align="center"
          >
          <template slot-scope="scope">
            <div v-if="scope.row.status=='1'">未派工</div>
            <div v-if="scope.row.status=='0'">已派工</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-bar">
        <el-pagination
          @current-change="handleCurrentChange"
          layout="total, prev, pager, next, jumper"
          :total="totalRecord"
          background
          >
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="55%" @close="onDialogClose()">
      <el-form :inline="true" ref="dutyData" label-width="100px" :model="dutyData" size="mini">
          <el-divider content-position="left">勤务信息</el-divider>
          <el-row>
            <el-col :span="8">
              <el-form-item label="勤务编号">
                <el-input v-model="dutyData.subOrderId" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="勤务状态">
                <el-input v-model="dutyData.subOrderId" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="服务类型">
                <el-input v-model="dutyData.orderSubType" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="接送日期">
                <el-input v-model="dutyData.subOrderId" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用车时间">
                <el-input v-model="dutyData.orderTime" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="自定车型">
                <el-input v-model="dutyData.subOrderId" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="预计开始时间">
                <el-input v-model="dutyData.subOrderId" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="预计结束时间">
                <el-input v-model="dutyData.subOrderId" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
      </el-form>
      <el-form :inline="true" ref="dataForm" label-width="100px" :rules="rules" :model="dataForm" size="mini">
        <el-divider content-position="left">派工设定</el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="据点  " prop="stationId" hide-required-asterisk>
              <el-select v-model="dataForm.stationId" clearable placeholder="请选择">
                  <el-option
                  v-for="item in stationOptions"
                  :value="item.value"
                  :key="item.value"
                  :label="item.desc"
                  >
                  </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="驾驶名称" prop="driverName">
              <el-input v-model="dataForm.driverName" placeholder="驾驶名称" style="width:130px;margin-right:3px"></el-input>
              <el-button plain size="mini" icon="el-icon-more" @click="handleSelectDriver(0)" style="padding:7px 8px;"></el-button>
          </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="驾驶电话" prop="driverPhone">
              <el-input v-model="dataForm.driverPhone" placeholder="驾驶电话"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="牌照号码" prop="carPlateNumber">
              <el-input v-model="dataForm.carPlateNumber" placeholder="牌照号码" style="width:130px;margin-right:3px"></el-input>
              <el-button plain size="mini" icon="el-icon-more" @click="handleSelectDriver(1)" style="padding:7px 8px;"></el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="备注" prop="stationComment">
              <el-input type="textarea" v-model="dataForm.stationComment" placeholder="备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">车辆升等</el-divider>
        <el-row>
          <el-col :span="4" style="text-align: center;">
            <el-form-item>
              <el-switch
                v-model="isUpgrade"
                active-color="#13ce66"
                :active-value="true"
                :inactive-value="false"
                active-text="升等"
                inactive-text=""
                @change="handleIsUpgrade(isUpgrade)">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="升等车型" prop="vehicleId">
              <el-select v-model="dataForm.vehicleId" :disabled="!isUpgrade" clearable placeholder="请选择" style="width: 150px;">
                  <el-option
                  v-for="item in carOptions"
                  :value="item.value"
                  :key="item.value"
                  :label="item.desc"
                  >
                  </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="升等原因" prop="carPlateNumber">
              <el-input v-model="dataForm.carPlateNumber" :disabled="!isUpgrade" placeholder="升等原因"></el-input>
          </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="onDialogSubmit()" v-if="dialogTitle=='修改车型类型'">保存</el-button>
        <el-button size="medium" type="primary" @click="onDialogSubmit()" v-else>派工</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="subdialogTitle" :visible.sync="subdialogVisible" width="60%" append-to-body>
        <div class="block" style="margin-bottom:20px;">
            <span class="demonstration">日期：</span>
            <el-date-picker
              v-model="valueDate"
              type="date"
              size="small"
              placeholder="选择日期">
            </el-date-picker>
        </div>
        <el-table
            :data="driverTableData"
            border
            fit
            highlight-current-row
            style="width: 100%"
            :cell-class-name="rowClass">
        >
        <el-table-column
          label="操作"
          align="center"
          width="80px"
          fixed
          >
          <template slot-scope="scope">
            <div>
                <el-button
                    type="primary"
                    size="mini"
                    plain
                    @click="handleSubmitDriver(scope.$index, scope.row)"
                >选取</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column
        v-if="this.subdialogTitle=='选择车辆'"
        prop="className"
        label="车型"
        align="center"
        >
        </el-table-column>
        <el-table-column
          prop="sourceName"
          :label="this.subdialogTitle=='选择司机'?'姓名':'车牌号'"
          align="center"
          >
        </el-table-column>
        <el-table-column
            v-for="item in rowTimesdata"
            :label="item"
            align="center"
            >
            <!-- <template slot-scope="scope">
                <span style="margin-left: 10px"></span>
                {{ scope.row.date }}
            </template> -->
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-card>
</template>
<script>
    import { dispatchList,carOrDriverList,optionsList } from '@/api/common'
    import { getOssAuthInfo } from '@/api/common'
    let OSS = require('ali-oss');
    export default {
        data() {
            return {
                totalRecord: 0,
                tableLoading: false,
                dialogVisible: false,
                subdialogVisible: false,
                subdialogVisible2: false,
                valueDate:new Date(),
                isUpgrade:false,   //是否升等
                stationOptions:'', //据点下拉框
                carOptions:'',    //车辆类型下拉框
                rowTimesdata:[],//选择司机——时间表
                dialogTitle: '',
                subdialogTitle:'',
                searchData: {
                    orderId: '',
                    orderSubId: '',
                    stationId:'',
                    status:'',
                    startTime:'',
                    endTime:'',
                    page:1
                },
                pickerOptions:{ //日期不可选
                  disabledDate:(time)=>{
                    return time.getTime() < this.searchData.startTime;
                  }
                },
                dutyData:{  //勤务信息
                  subOrderId: '',//勤务编号
                  subOrderId: '',//勤务状态
                  orderSubType:'',//服务类型
                  orderTime:'',//用车时间
                  subOrderId: '',//接送日期
                  subOrderId: '',//用车时间
                  subOrderId: '',//自定车型
                  subOrderId: '',//预计开始时间
                  subOrderId: '',//预计结束时间
                },
                dataForm: {
                  stationId: '',//据点编号
                  driverName:'',//驾驶名称
                  driverPhone:'',//驾驶电话
                  carPlateNumber:'',//车牌号
                  // carPlateNumber:''//备注
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
                  {name:'orderSubType',text:'服务类型'},
                  {name:'vehicleId',text:'接送日期'},
                  {name:'orderTime',text:'用车时间'},
                  {name:'stationName',text:'据点'},
                  {name:'vehicleName',text:'车型'},
                  {name:'driverName',text:'驾驶名称'},
                  {name:'passenger',text:'乘客'},
                  {name:'startPoint',text:'起点'},
                  {name:'endPoint',text:'终点'},
                ],    
                tableData: [],
                driverTableData:[],
            }
        },
        created() {
            this.initList()
            this.selectList()
            this.rowTimes()
            
        },
        methods: {
           //选择车辆\司机的时间勤务
            rowTimes(){
                for(let i=1;i<25;i++){
                    this.rowTimesdata.push(i+':00')
                }
            },
            //是否升等
            handleIsUpgrade(val){
              if(val){

              }
              console.log(this.isUpgrade)
            },
            rowClass ({ row, column, rowIndex, columnIndex }) {
              if (rowIndex === 5 && columnIndex === 4) {
                return 'rgb196'
              } else if (rowIndex === 6 && columnIndex === 4) {
                return 'bacColorf4984e'
              } else if (rowIndex === 6 && columnIndex === 5) {
                return 'bacColor317eb0'
              }
            },
            //查询列表
            async initList() {
                const data = await dispatchList(this.searchData)
                this.tableData = data.list
                this.totalRecord = data.pageInfo.totalSize
            },
            //查询下拉框列表
            async selectList() {
                const data1 = await optionsList({dictionaryCodes:["STATION"]})
                const data2 = await optionsList({dictionaryCodes:["VEHICLE_CLASS"]})
                this.stationOptions = data1[0].list
                this.carOptions = data2[0].list
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
            handleShow(index, row){

            },
            handleSelectDriver(val){
                // val==0 选择司机 val=1 选择车辆
                this.subdialogVisible = true
                if(val==0){
                  this.subdialogTitle = "选择司机"
                  carOrDriverList({"type":1}).then(result=>{
                    this.driverTableData = result
                  })
                }else{
                  this.subdialogTitle = "选择车辆"
                  carOrDriverList({"type":2}).then(result=>{
                    this.driverTableData = result
                  })
                }
            },
            //选择司机
            handleSubmitDriver(index, row){
                if(this.subdialogTitle=="选择司机"){
                    this.dataForm.driverName = row.sourceName;
                    this.dataForm.driverPhone = row.driverPhone
                }else{
                  this.dataForm.carPlateNumber = row.carPlateNumber;
                }
                this.subdialogVisible = false
                
            },
            //派工
            handleEdit(index, row,val) {
                this.dialogVisible = true
                if(val==0){
                  this.dialogTitle = "详情"
                }else{
                  this.dialogTitle = "派工"
                }
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
            //关闭弹窗
            onDialogClose() {
                this.dataForm.vehicleId = '';
                this.$refs.dataForm.resetFields()
            },   
            //跳转到指定页
            handleCurrentChange(val) {
              this.searchData.page = val;
              this.initList()
            },
            // onSearch() {
            //   vehicleList(this.searchData).then(response => {
            //     this.tableData = response.list
            //   })
            // },
        },
    }
</script>
<style lang="scss" >
  
</style>