<template lang="html">
    <el-card class="box-card">
      <div class="search-bar">
        <el-form :inline="true" :model="searchData" size="small">
            <el-form-item label="订单ID">
                <el-input v-model="searchData.orderId" placeholder="订单ID"></el-input>
            </el-form-item>
            <el-form-item label="订单编号">
                <el-input v-model="searchData.orderNum" placeholder="订单编号"></el-input>
            </el-form-item>
            <el-form-item label="数据回传时间">
                <el-date-picker
                    v-model="searchData.createTimeStart"
                    type="datetime"
                    style="width:190px;"
                    placeholder="选择时间">
                </el-date-picker>
                -
                <el-date-picker
                    v-model="searchData.createTimeEnd"
                    type="datetime"
                    placeholder="选择时间"
                    style="width:190px;"
                    :picker-options="pickerOptions"
                    default-time="23:59:59">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="呼叫类型">
                <el-select v-model="searchData.type" placeholder="请选择" style="width:180px;">
                    <el-option :value=1 label="叫车人与司机"></el-option>
                    <el-option :value=2 label="代叫人与司机"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="initList(1)" size="small">查询</el-button>
                <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>
      </div>
      <div>
        <el-table :data="tableData" border>
          <el-table-column v-for="item in rowData" :prop="item.name" :label="item.text" align="center"></el-table-column>
          <el-table-column label="呼叫时间" align="center" width=250>
            <template slot-scope="scope">
                <div v-if="scope.row.callInTime">呼叫发起时间：{{scope.row.callInTime}}</div>
                <div v-if="scope.row.fwdAlertingTime">呼叫振铃时间：{{scope.row.fwdAlertingTime}}</div>
                <div v-if="scope.row.fwdAnswerTime">呼叫接通时间：{{scope.row.fwdAnswerTime}}</div>
                <div v-if="scope.row.callEndTime">呼叫挂断时间：{{scope.row.callEndTime}}</div>
            </template>
          </el-table-column>
          <el-table-column label="呼叫号码" align="center" width=210>
            <template slot-scope="scope">
                <div v-if="scope.row.callerNum">主叫号码：{{scope.row.callerNum}}</div>
                <div v-if="scope.row.calleeNum">被叫号码：{{scope.row.calleeNum}}</div>
                <div v-if="scope.row.fwdDisplayNum">主显号码：{{scope.row.fwdDisplayNum}}</div>
            </template>
          </el-table-column>
          <el-table-column label="是否录音" align="center" width=100>
            <template slot-scope="scope">
                <div v-if="scope.row.recordFlag===0">未录音</div>
                <div v-if="scope.row.recordFlag===1">有录音</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width=170>
            <template slot-scope="scope">
                <el-button type="primary" plain size="small" @click="handleShowDetail(scope.row)">详情</el-button>
                <!-- <el-button v-if="scope.row.recordFlag===0" type="success" plain disabled>下载录音</el-button> -->
                <el-button v-if="scope.row.recordFlag===1" type="success" plain size="small" @click="handleDownload(scope.row)">下载录音</el-button>
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
            <!-- hide-on-single-page -->
            <!-- @size-change="handleSizeChange" -->
            <!-- :page-sizes="[10, 25, 50, 100]" -->
          </el-pagination>
        </div>
      </div>
      <el-dialog title="通话详情" :visible.sync="dialogVisible" height="500">
        <el-form inline label-width="120px">
            <el-form-item v-for="(item,index) in detailData" :label="item.text" v-if="item.val" style="width:45%;margin-bottom: 0;">
                <span>{{ item.val }}</span>
            </el-form-item>
        </el-form>
    </el-dialog>
    </el-card>
  </template>
  <script>
      import { receiveList,receiveDown} from '@/api/receive'
      import axios from 'axios'
      export default {
          data() {
              return {
                  totalRecord: 0,
                  pageSize: 10,
                  dialogVisible:false,
                  searchData: {
                        orderId: '',
                        orderNum: '',
                        createTimeStart: '',
                        createTimeEnd:'',
                        type:null,
                        page:1
                  },
                  pickerOptions:{ //结束日期——不可选
                    disabledDate:(time)=>{
                        return time.getTime() < new Date(this.searchData.createTimeStart).getTime();
                    }   
                  },
                  tableData: [],
                  rowData:[
                    {name:'orderId',text:'订单ID'},
                    {name:'orderNum',text:'订单编号'},
                    {name:'createTime',text:'数据回传时间'},
                    {name:'bindNum',text:'隐私号码'},
                  ],
                  detailData:[
                    {name:'orderId',text:'订单ID:'},
                    {name:'orderNum',text:'订单编号:'},
                    {name:'createTime',text:'创建时间:'},
                    {name:'typeDesc',text:'呼叫类型:'},
                    {name:'bindNum',text:'隐私号码:'},
                    {name:'callerNum',text:'主叫号码:'},
                    {name:'calleeNum',text:'被叫号码:',val:''},
                    {name:'fwdDstNum',text:'主显号码:',val:''},
                    {name:'callInTime',text:'呼入时间:',val:''},
                    {name:'fwdAlertingTime',text:'振铃时间:',val:''},
                    {name:'fwdAnswerTime',text:'接通时间:',val:''},
                    {name:'callEndTime',text:'挂断时间:',val:''},
                    {name:'recordFlag',text:'是否有录音:',val:''},
                    {name:'recordStartTime',text:'录音开始时间:',val:''},
                  ],
              }
          },
          created() {
              this.initList(1);
          },
          methods: {
              async initList(val) {
                  this.searchData.page = val;
                  const data = await receiveList(this.searchData)
                  this.tableData = data.list
                  this.totalRecord = data.pageInfo.totalSize
              },
              //下载录音
              handleDownload(row){
                axios.get('/api/receive/get/down/'+row.callId).then(response=>{
                    if(response.headers['content-type']==='audio/x-wav'){
                        window.location.href= process.env.VUE_APP_HOST+'/receive/get/down/'+row.callId
                    }else{
                        this.$message({ type: 'warning', message: response.data.message});
                    }
                },error=>{ console.log(error) })
              },
              //通话详情
              handleShowDetail(row){
                    this.dialogVisible = true
                    this.detailData = this.detailData.filter(item=>{
                        item.val = row[item.name]
                        if(item.name==='recordFlag'){
                            item.val = row[item.name]===1 ? '是' : '否'
                        }
                        return item
                    })  
              },
              //重置搜索条件
              handleReset() {
                  this.searchData={
                    orderId: '',
                    orderNum: '',
                    createTimeStart: '',
                    createTimeEnd:'',
                    type:null,
                    page:this.searchData.page
                }
              },
              //切换页
              handleCurrentChange(val) {             
                this.initList(val)
              },
          },
      }
  </script>
  <style lang="scss">
   
  </style>
  