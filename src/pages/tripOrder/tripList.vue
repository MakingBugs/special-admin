<template lang="html">
    <el-card class="box-card">
      <div class="search-bar">
        <el-form :inline="true" :model="searchData" class="fl" size="small">
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
                  placeholder="选择时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width:190px;"
                  :picker-options="pickerOptions1"
                  default-time="23:59:59">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="订车人">
                <el-input v-model="searchData.userName" placeholder="订车人" style="width:120px;"></el-input>
            </el-form-item>
            <el-form-item label="订车人电话">
                <el-input onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" v-model.number="searchData.userPhone" placeholder="订车人电话"></el-input>
            </el-form-item>
            <el-form-item label="乘车人">
                <el-input v-model="searchData.riderName" placeholder="乘车人" style="width:120px;"></el-input>
            </el-form-item>
            <!-- <el-form-item label="乘车人电话">
                <el-input onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" v-model.number="searchData.riderPhone" placeholder="乘车人电话"></el-input>
            </el-form-item> -->
            <el-form-item label="企业名称">
                <el-input v-model="searchData.companyName" placeholder="企业名称" style="width:120px;"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="initList(1)">查询</el-button>
                <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>
      </div>
      <div  class="tools-bar">
        <el-button type="success" size="small" @click="handleOperation">打印</el-button>
      </div>
      <div>
        <el-table
          :data="tableData"
          border
          fit
          highlight-current-row
          @select-all="handleSelectionAll"
          @selection-change="handleSelectionChange"         
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
              v-for="item in rowData2"
              :prop="item.name"
              :label="item.text"
              align="center"
              >
          </el-table-column>
        </el-table>
        <div class="pagination-bar">
          <el-pagination
            @current-change="handleCurrentChange"
            :page-size="pageSize"
            :current-page="searchData.page"
            layout="total, prev, pager, next, jumper"
            :total="totalRecord"
            background
            >
          </el-pagination>
        </div>
      </div>
      <!-- fullscreen -->
      <el-dialog title="打印预览" :visible.sync="dialogVisible">
        <div id="printTest" title="收款信息" style="margin: 20px;position: relative;">
          <div style="position:absolute;top: 10px;"><img style="width: 130px;height: 30px;" src="../../assets/image/logo.png" alt=""></div>
          <h1 style="text-align: center;margin-bottom:30px;font-size: 30px;font-weight: bold;">格上出行-行程单</h1>
          <div class='' style="margin-bottom: 20px;">
            <p>申请日期：{{nowDate}}</p>
            <p>行程总计：共{{tabSelectedList.length}}笔行程，合计{{totalPrice}}元</p>
          </div>
          <el-table :data="tabSelectedList" border> 
            <!-- :cell-style="cellStyle" :header-cell-style="cellStyle" -->
            <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
            <el-table-column 
                v-for="item in rowData"
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
    import { tripList,} from '@/api/tripOrder'
    export default {
        data() {
            return {
                totalRecord: 0,
                pageSize: 10,
                tableLoading: false,
                tabSelectedList:[],//table选中数据
                dialogVisible:false,
                searchData: {
                    startTime: '',//用车开始时间
                    endTime: '',  //用车结束时间
                    userName: '',//订车人
                    userPhone: '',//订车人电话
                    riderName: '',//乘车人
                    // riderPhone: '',//乘车人电话
                    companyName: '',//企业名称
                    page:1,
                },
                pickerOptions1:{ //结束日期——不可选
                  disabledDate:(time)=>{
                    return time.getTime() < new Date(this.searchData.orderStartTime).getTime();
                  }
                },
                totalPrice:'',
                //当前时间
                nowDate:new Date().getFullYear()+"年"+(new Date().getMonth()+1)+"月"+new Date().getDate()+"日",
                rowData:[
                  {name:'orderId',text:'行程编号'},
                  {name:'serviceType',text:'服务类型'},
                  {name:'appointmentTime',text:'用车时间'},
                  {name:'className',text:'车型'},
                  {name:'startPoint',text:'上车地点'},
                  {name:'endPoint',text:'下车地点'},
                  {name:'riderName',text:'乘车人'},
                  {name:'payAmount',text:'费用'},
                ],
                rowData2:[
                  {name:'userName',text:'订车人'},
                  {name:'userPhone',text:'订车人电话'},
                  {name:'companyName',text:'企业名称'},
                ],
                tableData: []
            }
        },
        created() {
            this.initList(1);
        },
        methods: {
            //查询列表
            async initList(val) {
                this.searchData.page=val
                const data = await tripList(this.searchData)
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
            //打印
            handleOperation(){
              if(this.tabSelectedList.length<1){
                this.$message('请选择数据');
              }else{
                this.dialogVisible = true
                if(this.tabSelectedList.length>1){
                  this.totalPrice = this.tabSelectedList.reduce((pre,cur)=>{
                        return pre+cur.payAmount
                    },0)
                }else{
                  this.totalPrice = this.tabSelectedList[0].payAmount
                }
              }
            },
            //table加边框
            cellStyle({row, column, rowIndex, columnIndex}) {//根据测试结果动态调整单元格样式，成功-绿色，失败-红色，不支持-黄色
                let cellStyle = 'border-color:#aaa'
                return cellStyle;
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
                    page:this.searchData.page,
                }
            },
            //跳转到指定页
            handleCurrentChange(val) {
              this.initList(val)
            },
        }
    }
</script>
<style>
  /* @media print {
    #printTest {
      padding:10px;
    }
  } */
  @page{
      size: auto A4 landscape;
      margin: 8mm;
  }
  #printTest .el-table--border{
    border:1px solid #aaa;
  }
  #printTest .el-table--border th,#printTest .el-table--border td{
    border-color:#aaa;
  }
</style>
  