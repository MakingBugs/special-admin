<template lang="html">
    <el-card class="box-card">
      <div class="search-bar">
        <el-form :inline="true" :model="searchData" class="fl" size="small">
          <el-form-item label="订单类型">
            <el-select v-model="searchData.orderType" clearable placeholder="请选择" style="width: 120px;">
              <el-option :value=1 label="点对点"></el-option>
              <el-option :value=2 label="包车游"></el-option>
              <el-option :value=3 label="两岸畅行"></el-option>
              <el-option :value=4 label="接机"></el-option>
              <el-option :value=5 label="送机"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单编号">
            <el-input v-model="searchData.orderBatchId" placeholder="订单编号" style="width:150px;"></el-input>
          </el-form-item>
          <el-form-item label="勤务编号">
            <el-input v-model="searchData.orderId" placeholder="勤务编号" style="width:150px;"></el-input>
          </el-form-item>
          <el-form-item label="企业名称">
            <el-input v-model="searchData.companyName" placeholder="企业名称" style="width:120px;"></el-input>
          </el-form-item>
          <el-form-item label="订车人">
            <el-input v-model="searchData.userName" placeholder="订车人" style="width:120px;"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchData.confirmPay" clearable placeholder="请选择" style="width: 120px;">
              <el-option :value=0 label="未确认"></el-option>
              <el-option :value=1 label="已确认"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单日期">
            <el-date-picker
              v-model="searchData.orderStartTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:190px;"
              placeholder="选择时间">
            </el-date-picker>
            -
            <el-date-picker
              v-model="searchData.orderEndTime"
              type="datetime"
              placeholder="选择时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:190px;"
              :picker-options="pickerOptions1"
              default-time="23:59:59">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="确认日期">
            <el-date-picker
              v-model="searchData.confirmStartTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:190px;"
              placeholder="选择时间">
            </el-date-picker>
            -
            <el-date-picker
              v-model="searchData.confirmEndTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择时间"
              style="width:190px;"
              :picker-options="pickerOptions2"
              default-time="23:59:59">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="initList">查询</el-button>
            <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div  class="tools-bar">
        <el-button type="success" size="small" @click="handleOperation(1)">收款确认</el-button>
        <el-button type="success" size="small" @click="handleOperation(2)">打印</el-button>
      </div>
      <div>
        <el-table
          :data="tableData"
          border
          fit
          highlight-current-row
          @select-all="handleSelectionAll"
          @selection-change="handleSelectionChange"
          style="width: 100%"
          >
          <el-table-column
            type="selection"
            align="center"
            width="55">
          </el-table-column>
          <el-table-column 
              v-for="item in rowData"
              :prop="item.name"
              :label="item.text"
              align="center"
              >
          </el-table-column>
          <el-table-column
            label="支付形式"
            align="center"
            >
            <template slot-scope="scope">
              <div>
              <div v-if="scope.row.payChannel==1">线上支付</div>
              <div v-if="scope.row.payChannel==2">线下支付</div></div>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            align="center"
            >
            <template slot-scope="scope">
              <div>
              <div v-if="scope.row.confirmPay==0">未确认</div>
              <div v-if="scope.row.confirmPay==1">已确认</div></div>
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
      <el-dialog title="打印预览" :visible.sync="dialogVisible" width="70%">
        <div id="printTest" title="收款信息">
          <h1 style="text-align: center;margin: -10px 0 20px;">收款确认单</h1>
          <el-table :data="tabSelectedList" border> 
            <el-table-column 
                v-for="item in subRowData"
                :prop="item.name"
                :label="item.text"
                align="center"
                >
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
          <el-button size="medium" type="primary" v-print="'#printTest'">确定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </template>
  <script>
      import { chargeInfoList,confirmCharge} from '@/api/finance'
      export default {
          data() {
              return {
                  totalRecord: 0,
                  pageSize: 10,
                  tableLoading: false,
                  tabSelectedList:[],//table选中数据
                  dialogVisible:false,
                  searchData: {
                      orderType: null,//订单类型
                      orderId: null,  //勤务编号
                      orderBatchId: null,//订单编号
                      companyName: null,//企业名称
                      userName:null,//订车人名称
                      confirmPay: null,//状态
                      orderStartTime: null,//订单开始日期
                      orderEndTime: null,//订单结束日期
                      confirmStartTime: null,//确认开始日期
                      confirmEndTime: null,//确认结束日期
                      page:1,
                  },
                  pickerOptions1:{ //结束日期——不可选
                    disabledDate:(time)=>{
                      return time.getTime() < new Date(this.searchData.orderStartTime).getTime();
                    }
                  },
                  pickerOptions2:{ //结束日期——不可选
                    disabledDate:(time)=>{
                      return time.getTime() < new Date(this.searchData.confirmStartTime).getTime();
                    }
                  },
                  rowData:[
                    {name:'orderBatchId',text:'订单编号'},
                    {name:'orderId',text:'勤务编号'},
                    // {name:'userId',text:'订车人'},
                    {name:'userName',text:'订车人'},
                    {name:'riderName',text:'乘客'},
                    {name:'companyName',text:'企业名称'},
                    {name:'companyTaxNum',text:'企业税号'},
                    {name:'orderType',text:'服务类型'},
                    {name:'carBrand',text:'车型'},
                    {name:'orderTime',text:'订单日期'},
                    {name:'appointmentTime',text:'用车时间'},
                    {name:'payType',text:'收款方式'},
                    {name:'payAmount',text:'收款金额'},
                    {name:'payTime',text:'收款日期'},
                    // {name:'payChannel',text:'支付形式'},
                    {name:'confirmTime',text:'确认日期'},
                    {name:'orderStatusDesc',text:'订单状态'},
                    // {name:'confirmPay',text:'状态'},
                  ],
                  subRowData:[
                    {name:'orderId',text:'勤务编号'},
                    {name:'userName',text:'订车人'},
                    {name:'riderName',text:'乘客'},
                    {name:'orderType',text:'服务类型'},
                    {name:'carBrand',text:'车型'},
                    {name:'appointmentTime',text:'用车时间'},
                    {name:'payType',text:'收款方式'},
                    {name:'payAmount',text:'收款金额'},
                    {name:'payTime',text:'收款日期'},
                    {name:'confirmTime',text:'确认日期'},
                  ],
                  tableData: []
              }
          },
          created() {
              this.initList();
          },
          methods: {
              //查询列表
              async initList() {
                  const data = await chargeInfoList(this.searchData)
                  this.tableData = data.list
                  this.totalRecord = data.pageInfo.totalSize
              },
              //table 全选
              handleSelectionAll(selection){
                this.tabSelectedList=selection
              },
              //table 选中
              handleSelectionChange(selection) {
                this.tabSelectedList=selection
              },
              //收款/打印
              handleOperation(type){
                if(this.tabSelectedList.length<1){
                  this.$message('请选择数据');
                }else{
                  let ids= this.tabSelectedList.map(item=>{
                    return item.payId
                  })
                  let orderIds = this.tabSelectedList.map(item=>{
                    return item.orderId
                  })
                  //是否全是未确认状态————收款
                  let status1= this.tabSelectedList.every(item=>{
                     return item.confirmPay!=1
                  })
                  //是否全是已确认状态————打印
                  let status2= this.tabSelectedList.every(item=>{
                    return item.confirmPay===1
                  })
                  if(type===1){
                    if(status1){
                      confirmCharge({payIdList:ids,orderIdList:orderIds}).then(response=>{
                          this.$message({ message: '收款成功', type: 'success'});
                          this.initList()
                      });
                    }else{
                      this.$message({ message: '请确认是否含有已确认账单', type: 'warning'});
                    }
                  }else{
                    if(status2){
                      this.dialogVisible = true;
                    }else{
                      this.$message({  message: '请确认是否含有未确认账单', type: 'warning'});
                    }
                  }
                }
              },
              //重置搜索条件
              handleReset() {
                  this.searchData= {
                      orderType: null,//订单类型
                      orderId: null,  //勤务编号
                      orderBatchId: null,//订单编号
                      companyName: null,//企业名称
                      userName:null,//订车人名称
                      confirmPay: null,//状态
                      orderStartTime: null,//订单开始日期
                      orderEndTime: null,//订单结束日期
                      confirmStartTime: null,//确认开始日期
                      confirmEndTime: null,//确认结束日期
                      page:1,
                  }
                  // this.initList()
              },
              //跳转到指定页
              handleCurrentChange(val) {
                this.searchData.page = val;
                this.initList()
              },
          }
      }
  </script>
  <style>
    @media print {
      #printTest {
        padding:10px;
      }
    }
    @page{
        size: auto A4 landscape;
        margin: 8mm;
    }
  </style>
  