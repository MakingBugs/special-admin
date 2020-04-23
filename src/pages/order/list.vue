<template lang="html">
    <el-card class="box-card">
      <div class="search-bar">
        <el-form :inline="true" :model="searchData" class="fl" size="small">
          <el-form-item label="订单编号">
            <el-input v-model="searchData.orderId" placeholder="订单编号" style="width:160px;"></el-input>
          </el-form-item>
          <el-form-item label="勤务编号">
            <el-input v-model="searchData.orderSubId" placeholder="勤务编号" style="width:160px;"></el-input>
          </el-form-item>
          <el-form-item label="订车人">
            <el-input v-model="searchData.passenger" placeholder="订车人" style="width:120px;"></el-input>
          </el-form-item>
          <el-form-item label="企业名称">
            <el-input v-model="searchData.enterpriseName" placeholder="企业名称" style="width:120px;"></el-input>
          </el-form-item>
          <el-form-item label="用车时间">
            <el-date-picker
              v-model="searchData.startTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:190px;"
              placeholder="选择时间">
            </el-date-picker>
            -
            <el-date-picker
              v-model="searchData.endTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择时间"
              style="width:190px;"
              :picker-options="pickerOptions"
              default-time="23:59:59">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="订单来源">
            <el-select v-model="searchData.orderSource" placeholder="请选择">
                <el-option :value=0 label="电话"></el-option>
                <el-option :value=1 label="微信"></el-option>
                <el-option :value=2 label="APP"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="initList(1)">查询</el-button>
            <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div  class="tools-bar">
        <router-link to="/order/build-order" style="color: #fff;"><el-button type="success" icon="el-icon-plus" size="small">后台下单</el-button></router-link>
      </div>
      <div>
        <el-table
          :data="tableData"
          border
          fit
          :span-method="objectSpanMethod"
          style="width: 100%"
          >  
            <el-table-column 
                v-for="item in rowData"
                :prop="item.name"
                :label="item.text"
                align="center"
                >
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="190px"
                fixed="right"
                >
                <template slot-scope="scope">
                <div>               
                    <el-button
                        size="mini"
                        type="success"
                        plain
                        style="margin-bottom: 10px;"
                        @click="handleShow(scope.$index, scope.row)">查看</el-button>
                    <el-button
                        v-if="scope.row.dispatchVisible"
                        type="primary"
                        size="mini"
                        plain
                        @click="handleDispatch(scope.$index, scope.row,1)"
                    >派工</el-button>
                    <el-button
                        v-if="scope.row.finishVisible"
                        type="primary"
                        size="mini"
                        plain
                        @click="handleReply(scope.$index, scope.row,2)"
                    >回复</el-button>
                    <el-button
                        v-if="scope.row.cancelVisible"
                        type="warning"
                        size="mini"
                        plain
                        @click="handleCancelOrder(scope.$index, scope.row)"
                    >取消订单</el-button>
                </div>
                </template>
            </el-table-column>     
            <el-table-column
                label=""
                align="center"
                width="110px"
                fixed="right"
                >
                <template slot-scope="scope">
                <div v-if="scope.row.source==0||scope.row.source==1">
                    <router-link :to="'/order/build-order/'+scope.row.orderId" style="color: #fff;">
                        <el-button size="mini" type="primary" plain >新增勤务</el-button>
                    </router-link>
                </div>
                </template>
            </el-table-column>             
        </el-table>
        <div class="pagination-bar">
          <el-pagination
            :current-page="searchData.page"
            @current-change="handleCurrentChange"
            layout="total, prev, pager, next, jumper"
            :total="totalRecord"
            background
            >
          </el-pagination>
        </div>
      </div>
        <el-dialog title="订单详情" :visible.sync="dialogVisible1" height="500">
            <el-form inline label-width="120px">
                <el-form-item v-for="(item,index) in orderDetailData" v-if="item.val" :label="item.text" style="width:45%;margin-bottom: 0;">
                    <span>{{ item.val }}</span>
                </el-form-item>
                <el-divider v-else-if="item.name==='title'" content-position="left">{{item.text}}</el-divider>
                <el-form-item label="订单金额：" style="width:30%;margin-bottom: 0;">
                    <span>{{ orderDetailPrice.orderAmount||0}}元</span>
                </el-form-item>
                <el-form-item label="支付金额：" style="width:30%;margin-bottom: 0;">
                    <span>{{ orderDetailPrice.payAmount||0 }}元</span>
                </el-form-item>
                <el-form-item label="优惠金额：" style="width:30%;margin-bottom: 0;">
                    <span>{{ orderDetailPrice.discountAmount||0 }}元</span>
                </el-form-item>
                <el-form-item label="行驶时间：" style="width:30%;margin-bottom: 0;">
                    <span>{{ orderDetailPrice.minute||0 }}分钟</span>
                </el-form-item>
                <el-form-item label="行驶里程：" style="width:30%;margin-bottom: 0;">
                    <span>{{ orderDetailPrice.mileage||0 }}米</span>
                </el-form-item>
            </el-form>
            <el-table
                v-if="orderDetailPrice.payDetails"
                :data="orderDetailPrice.payDetails"
                :summary-method="getSummaries"
                show-summary
                >
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand" label-width="120px">
                            <el-form-item v-for="item in props.row.payItems" :label="item.itemName">
                                <span>{{ item.itemPrice }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column
                    label="支付方式"
                    width="180">
                    <template slot-scope="scope">
                        <span v-if="scope.row.payWay==0">个人支付</span>
                        <span v-if="scope.row.payWay==1">企业优惠支付</span>
                        <span v-if="scope.row.payWay==2">企业月结支付</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="支付类型"
                    width="180">
                    <template slot-scope="scope">
                        <span v-if="scope.row.payType==1">支付宝</span>
                        <span v-if="scope.row.payType==2">微信</span>
                        <span v-if="scope.row.payType==3">信用卡</span>
                        <span v-if="scope.row.payType==4">现金</span>
                        <span v-if="scope.row.payType==5">二维码</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="支付渠道"
                    width="180">
                    <template slot-scope="scope">
                        <span v-if="scope.row.payChannel==1">线上支付</span>
                        <span v-if="scope.row.payChannel==2">线下支付</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="subTotal"
                    label="小计">
                </el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog title="派工" :visible.sync="dialogVisible2"  width="45%" @close="onDialogClose(2)">
            <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="150px">
                    <el-form-item label="据点">
                        <el-select v-model.number="dataForm.stationId" :popper-append-to-body="false" popper-class="select-popper" @change="handleStationChange" placeholder="请选择" style="width:70%;position: relative;">
                            <el-option
                            v-for="item in stationOptions"
                            :value="item.value"
                            :key="item.value"
                            :label="item.desc"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="车辆升等">
                        <el-select v-model="dataForm.vehicleId" :popper-append-to-body="false" popper-class="select-popper" placeholder="请选择" style="width:70%;position: relative;" @change="handleVehicleChange">
                            <el-option
                            v-for="item in carOptions"
                            :value="item.value"
                            :key="item.value"
                            :label="item.desc"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="升等原因">
                        <el-input v-model="dataForm.reason" placeholder="升等原因" style="width:70%"></el-input>
                    </el-form-item>
                    <el-form-item label="司机" prop="driverName">
                        <el-input v-model="dataForm.driverName" placeholder="司机" style="width:70%;margin-right:5px" readonly></el-input>
                        <el-button plain icon="el-icon-more" @click="handleSelect(0)" style="padding: 12px;"></el-button>
                    </el-form-item>
                    <el-form-item label="车辆" prop="carPlateNumber">
                        <el-input v-model="dataForm.carPlateNumber" placeholder="车辆" style="width:70%;margin-right:5px" readonly></el-input>
                        <el-button plain icon="el-icon-more" @click="handleSelect(1)" style="padding: 12px;"></el-button>
                    </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium" @click="dialogVisible2 = false">取 消</el-button>
                <el-button size="medium" type="primary" @click="onDialogSubmit2()">派工</el-button>
            </div>  
        </el-dialog>
        <el-dialog title="回复完单" :visible.sync="dialogVisible3" @close="onDialogClose(3)">
                <el-table :data="replyTable" border>  
                    <el-table-column 
                        v-for="item in replyData"
                        :prop="item.itemName"
                        :label="item.itemName"
                        align="center"
                        >
                    </el-table-column>
                </el-table><br>
                <el-form ref="replyForm" :model="replyForm" :rules="rules" label-width="100px">
                    <el-form-item label="收款金额：" prop="amount">
                        <el-input v-model="replyForm.amount" placeholder="请输入收款金额" style="width:70%"></el-input>
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input type="textarea" v-model="replyForm.replyRemarks" placeholder="请输入备注" style="width:70%"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="medium" @click="dialogVisible3 = false">取 消</el-button>
                    <el-button size="medium" type="primary" @click="onDialogSubmit3()">保存</el-button>
                </div>
        </el-dialog>
        <el-dialog :title="subdialogTitle" :visible.sync="subdialogVisible" append-to-body width="60%">
            <el-table :data="driverTableData" border fit height="500" :cell-class-name="rowClass">
                <el-table-column label="操作" align="center" width="80px" fixed>
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
                <el-table-column v-if="this.subdialogTitle=='选择车辆'" prop="className" label="车型" fixed align="center">
                </el-table-column>
                <el-table-column prop="sourceName" :label="this.subdialogTitle=='选择车辆'?'车牌号':'姓名'" align="center" fixed>
                </el-table-column>
                <el-table-column v-for="item in rowTimesdata" :label="item" align="center">
                </el-table-column>
            </el-table>
            <div class="pagination-bar">
                <el-pagination
                    :current-page="requestParams.page"
                    @current-change="handleCurrentChange2"
                    layout="total, prev, pager, next, jumper"
                    :total="totalRecord2"
                    hide-on-single-page
                    background>
                </el-pagination>
            </div>
        </el-dialog>
    </el-card>
  </template>
  <script>
      import { optionsList } from '@/api/common'
      import { orderList,orderSubDetail,carOrDriverList,finishReplyList,finishReply,dispatchSaveOne,cancelOrder } from '@/api/order'
      import moment from 'moment'
      export default {
          data() {
              return {
                  totalRecord: 0,
                  totalRecord2:0,
                  tableLoading: false,
                  spanArr:[],
                  searchData: {
                      orderId: null,
                      orderSubId: null,
                      passenger:'',//用车人
                      enterpriseName:'',
                      orderSource:null,
                      startTime:'',
                      endTime:'',
                      page:1
                  },
                  pickerOptions:{ //结束日期——不可选
                    disabledDate:(time)=>{
                      return time.getTime() < new Date(this.searchData.startTime).getTime();
                    }
                  },
                  rowData:[
                    {name:'orderId',text:'订单编号'},
                    {name:'passenger',text:'订车人'},
                    {name:'enterpriseName',text:'企业名称'},
                    {name:'subOrderId',text:'勤务编号'},
                    // {name:'status',text:'勤务状态'},
                    {name:'orderTime',text:'用车时间'},
                    {name:'orderTypeDesc',text:'服务类型'},
                    {name:'driverName',text:'驾驶员'},
                    {name:'vehicleName',text:'车辆类型'},
                    {name:'className',text:'车型'},
                    {name:'carPlateNumber',text:'车牌号'},
                    {name:'startPoint',text:'起点'},
                    {name:'endPoint',text:'终点'},
                    {name:'status',text:'订单状态'},
                  ],    
                  orderDetailData:[
                    {name:'title',text:'订车人信息'},
                    {name:'subOrderId',text:'勤务单编号:',val:''},
                    {name:'subscriper',text:'订车人:',val:''},
                    {name:'subscriperPhone',text:'订车人电话:',val:''},
                    {name:'createTime',text:'下单时间:',val:''},
                    {name:'orderStatusDesc',text:'订单状态:',val:''},
                    {name:'sourceDesc',text:'订单来源:',val:''},
                    {name:'remarkOrder',text:'备注:',val:''},  
                    {name:'title',text:'行程信息'},
                    {name:'orderTypeDesc',text:'服务类型:',val:''},
                    {name:'appointmentTime',text:'用车时间:',val:''},
                    {name:'startPoint',text:'起点:',val:''},  
                    {name:'endPoint',text:'终点:',val:''},
                    {name:'flightNumber',text:'航班号:',val:''},
                    {name:'charterTime',text:'包车时间:',val:''},
                    {name:'duration',text:'时长(h):',val:null},
                    {name:'expStartTime',text:'预计开始时间:',val:''},
                    {name:'expEndTime',text:'预计结束时间:',val:''},
                    {name:'passengerName',text:'乘车人姓名:',val:''},
                    {name:'passengerPhone',text:'乘车人电话:',val:''},
                    {name:'vehicleName',text:'车型:',val:''},
                    {name:'driverName',text:'司机姓名:',val:''},
                    {name:'driverPhone',text:'司机电话:',val:''},
                    {name:'vehicleType',text:'车型:',val:''},
                    {name:'carPlateNumber',text:'车牌号:',val:''},  
                    {name:'remarkTrip',text:'备注:',val:''},
                    {name:'title',text:'付款信息'},
                  ],
                  orderDetailPrice:{},  //订单详情价格
                  tableData: [],    //订单table
                  replyData:[],  //回复数据
                  replyTable:[],    //回复table
                  replyForm:{
                        orderId:null,
                        amount:null,
                        replyRemarks:'',
                  },
                  dialogVisible1: false,//订单详情
                  dialogVisible2: false,//派工
                  dialogVisible3: false,//回复
                  subdialogTitle: '',  //选择司机/车辆
                  subdialogVisible: false,//选择司机/车辆
                  stationOptions:[], //据点下拉框
                  carOptions:[],    //车辆类型下拉框
                  rowTimesdata:[],//选择司机——时间表
                  dataForm: {
                    orderId:'', //订单编号
                    subOrderId:'',//勤务单编号
                    stationId: '',//升等据点
                    vehicleId:'',  //升等车辆类型id
                    reason:'',   //升等原因
                    driverId:'',  //司机编号
                    driverName:'',  //司机名
                    carId:'',    //车辆id
                    carPlateNumber:'',//车牌号
                  },
                  requestParams:{
                    time:'',  //订单时间
                    stationId:'',//订单据点id
                    vehicleId:'',//订单车辆类型id
                    type:'',    
                    page:'',
                  },
                  rules: {
                    driverName: [{required: true,message: '请选择司机',trigger: 'change'}],
                    carPlateNumber: [{required: true,message: '请选择车辆',trigger:'change'}],
                    amount: [{  required: true, message: '请输入金额', trigger: 'blur' }],
                  },   
                  driverTableData:[],
              }
          },
          created() {
              this.initList(1)
          },
          methods: {
            //查询列表
            async initList(val) {
                this.searchData.page = val;
                const data = await orderList(this.searchData)
                if(data){
                    this.tableData = data.list
                    this.getSpanArr(this.tableData)
                    this.totalRecord = data.pageInfo.totalSize
                }else{
                    this.tableData = []
                    this.totalRecord = 0
                }
            },
            //订单详情
            handleShow(index, row){
                this.dialogVisible1 = true
                orderSubDetail(row.subOrderId).then(response => {
                    this.orderDetailData = this.orderDetailData.map(item=>{
                        // if(response[item.name]||item.name=='title'){
                            item.val = response[item.name]
                            return item 
                        // }
                    })  
                    this.orderDetailPrice = response.payInfo
                })
            },
            //取消订单
            handleCancelOrder(index,row){
                this.$confirm(`确定取消订单?`, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    cancelOrder({orderId:row.subOrderId}).then(response => {
                        this.$message({ type: 'success', message: '取消成功！' });
                        this.initList(this.searchData.page)
                    })
                }).catch(() => {});
            },
            //表格新增行——回复
            // addRow() {
            //     this.replyData.items.push({
            //         id:'',
            //         time:'',
            //         type:'',
            //         amount:'',
            //         comment:'',
            //     });
            // },
            //表格删除行——删除--回复
            // handleRemovePay(index,row){
            //     this.$confirm(`确定删除选中数据?`, "提示", {
            //         confirmButtonText: "确定",
            //         cancelButtonText: "取消",
            //         type: "warning"
            //     }).then(() => {
            //         this.replyData.items.splice(index, 1);
            //     }).catch(() => {});
            // },
            //表格行修改
            // celledit(row, column, cell, event){
            //     // if(row[column.property]){
            //     //     row[column.property].edit = true
            //     //     setTimeout(() => {
            //     //         this.$refs[column.property].focus()
            //     //     }, 20)
            //     // }
            // },
            //计算付款金额——订单详情价格
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 1) {
                        sums[index] = '总价';
                        return;
                    }
                    if (index === columns.length-1) {
                        const values = data.map(item => Number(item.subTotal));
                        sums[index] = values.reduce(function(x, y){
                            return x + y;
                        }, 0);;
                        return 
                    }
                    sums[index] = '';
                })
                return sums;
            },            
            //监听据点变化
            handleStationChange(selVal){
                optionsList({dictionaryCodes:["VEHICLE_CLASS"],stationId:selVal}).then(response=>{
                    this.carOptions = response[0].list
                })
            },
            //监听升等车型变化
            handleVehicleChange(selVal){
                if(selVal){
                    this.dataForm.driverName = '';
                    this.dataForm.carPlateNumber = '';
                }
            },
            //重置搜索条件
            handleReset() {
                this.searchData = {
                    orderId: null,
                    orderSubId: null,
                    // stationId:'',
                    passenger:'',
                    enterpriseName:'',
                    orderSource:null,
                    startTime:'',
                    endTime:'',
                    page:this.searchData.page
                }
            },
            //打开派工弹窗
            handleDispatch(index, row) {
                this.dialogVisible2 = true
                this.requestParams.time = row.orderTime
                this.requestParams.stationId = row.stationId
                this.requestParams.vehicleId = row.vehicleId
                this.dataForm.orderId= row.orderId
                this.dataForm.subOrderId = row.subOrderId
                optionsList({dictionaryCodes:["STATION"]}).then(response=>{
                    this.stationOptions = response[0].list
                })
            },
            //派工
            onDialogSubmit2(){
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        dispatchSaveOne(this.dataForm).then(result=>{
                            this.$message({
                                type: 'success',
                                message: '已成功派单！'
                            });
                            this.dialogVisible2 = false
                            this.initList(this.searchData.page)
                        })
                    }
                })
            },
            //打开派工弹窗
            handleSelect(val){
                this.rowTimes()
                this.subdialogTitle = val==0 ? "选择司机" : "选择车辆" 
                this.carOrDriverData(1)
            },
            //司机/车辆数据
            carOrDriverData(page){
                this.requestParams.page = page
                if(this.dataForm.vehicleId){
                    this.requestParams.stationId = this.dataForm.stationId
                    this.requestParams.vehicleId = this.dataForm.vehicleId
                }else{
                    if(!this.requestParams.stationId||!this.requestParams.vehicleId){
                        return this.$message('下单时选择的据点、车辆类型、车型信息发生变更，不可继续使用，请升等')
                    }
                }
                if(this.subdialogTitle === "选择司机"){
                    this.requestParams.type=1
                    
                }else if(this.subdialogTitle = "选择车辆"){
                    this.requestParams.type=2
                }
                carOrDriverList(this.requestParams).then(result=>{
                    this.subdialogVisible = true
                    this.driverTableData = result.list
                    this.totalRecord2 = result.pageInfo.totalSize
                })
            },
            //选择车辆\司机的时间表头
            rowTimes(){
                this.rowTimesdata = []
                for(let i=0;i<24;i++){
                    this.rowTimesdata.push(i+':00')
                }
            },   
            //当天勤务颜色        
            rowClass ({ row, column, rowIndex, columnIndex }) {
                if(row.times){
                    let columnTime = column.label.substr(0,column.label.indexOf(":"))
                    if (columnTime&&row.times.includes(Number(columnTime))) {
                        return 'hasScheduling'
                    }
                }               
            },
            //选择司机/车辆
            handleSubmitDriver(index, row){
                if(this.subdialogTitle=="选择司机"){
                    this.dataForm.driverId = row.sourceId;
                    this.dataForm.driverName = row.sourceName;
                }else{
                    this.dataForm.carId = row.sourceId;
                    this.dataForm.carPlateNumber = row.sourceName;
                }
                this.subdialogVisible = false
            },
            //回复弹窗
            handleReply(index, row){
                this.replyForm.orderId = row.subOrderId
                finishReplyList(row.subOrderId).then(response => {
                    // if(response instanceof Array)
                    // if(JSON.stringify(response) == "{}") response=[]
                    this.dialogVisible3 = true
                    this.replyData = response
                    var obj={}
                    for(var j=0;j<response.length;j++){
                        obj[response[j].itemName]=response[j].itemPrice
                    }
                    this.replyTable = [obj]
                    // let domains= [{
                    //     id:'编号1',
                    //     time:'2014-12-12',
                    //     type:'现金',
                    //     amount:'14',
                    //     comment:'备注',
                    // },{
                    //     id:'编号2',
                    //     time:'2014-12-12',
                    //     type:'现金',
                    //     amount:'14',
                    //     comment:'备注',
                    // }]
                    // this.$set(this.replyData,'items',this.replyData.items)
                })
            },  
            //回复——保存
            onDialogSubmit3() {
                this.$refs['replyForm'].validate((valid) => {
                    if (valid) {
                        finishReply(this.replyForm).then(response => {
                            this.$message({
                                type: 'success',
                                message: '保存成功！'
                            });
                            this.dialogVisible3=false
                            this.initList(this.searchData.page)
                        })
                    } else {
                        return false;
                    }
                });
               
            },
            //关闭弹窗
            onDialogClose(val) {
                if(val==2){//派工
                    this.dataForm={
                        orderId:'', //订单编号
                        subOrderId:'',//勤务单编号
                        stationId: '',//升等据点
                        vehicleId:'',  //升等车辆类型id
                        reason:'',   //升等原因
                        driverId:'',  //司机编号
                        driverName:'',  //司机名
                        carId:'',    //车辆id
                        carPlateNumber:'',//车牌号
                    }
                    this.carOptions = []
                    this.$refs.dataForm.resetFields()
                }else if(val==3){//回复
                    this.replyForm = {
                        orderId:null,
                        amount:null,
                        replyRemarks:'',
                    }
                    this.$refs.replyForm.resetFields()
                }
            },   
            //跳转到指定页
            handleCurrentChange(val) {
                this.initList(val)
            },
            //派工分页
            handleCurrentChange2(val) {
                this.carOrDriverData(val)
            },
            //转化table时间格式
            toDateTime(row, column, cellValue) {
                return cellValue ? moment(cellValue).format('YYYY-MM-DD HH:mm:ss') : ''
            },
            //筛选需要合并单元格的数据
            getSpanArr(data) {
                this.spanArr = [] // 避免表格错乱！
                data.forEach((item, index) => {
                    if (index === 0) {
                        this.spanArr.push(1)
                        this.position = 0
                    } else {
                        if (data[index].orderId === data[index - 1].orderId) { // 这里是要合并行
                            this.spanArr[this.position] += 1
                            this.spanArr.push(0)
                        } else {
                            this.spanArr.push(1)
                            this.position = index
                        }
                    }
                })
            },
            //合并单元格
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0||columnIndex===14) { // 对第一列进行合并
                    const _row = this.spanArr[rowIndex]
                    const _col = _row > 0 ? 1 : 0
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                }
            },
        },
    }
  </script>
  <style lang="scss">
    .demo-table-expand {
        font-size: 0;
        .el-form-item {
            margin-right: 0;
            margin-bottom: 0;
            width: 30%;
            label{
                width: 90px;
                color: #99a9bf;
            }
        }
    }
    .select-popper{
        position: absolute!important;
        top: 35px!important;
        left: 0!important;
    }
    .hasScheduling {
        background-color: #ebf4ffba;
    }
  </style>
