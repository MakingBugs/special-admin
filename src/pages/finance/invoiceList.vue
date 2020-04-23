<template lang="html">
    <el-card class="box-card">
        <el-tabs v-model="searchData.invoiceState" @tab-click="handleClick">
            <el-tab-pane label="未开票" name="1">
                <div class="search-bar">
                    <el-form :inline="true" :model="searchData" class="fl" size="small">
                    <el-form-item label="订单编号">
                        <el-input v-model="searchData.orderBatchId" placeholder="订单编号"></el-input>
                    </el-form-item>
                    <el-form-item label="勤务编号">
                        <el-input v-model="searchData.orderId" placeholder="勤务编号"></el-input>
                    </el-form-item>
                    <el-form-item label="订车人">
                        <el-autocomplete
                            popper-class="my-autocomplete"
                            v-model="subscriper"
                            :fetch-suggestions="querySearch"
                            placeholder="订车人"
                            :trigger-on-focus="false"
                            style="width:100%"
                            @select="handleSelectUser"
                            >
                            <template slot-scope="{ item }">
                                <div v-if="item.nolist">{{item.nolist}}</div>
                                <div v-else>
                                    <div class="name">{{ item.userName }}</div>
                                    <div style="color:#999;">
                                        <span>企业：{{ item.companyName }}</span>
                                        <span style="margin-left:20px;">电话：{{ item.userPhone }}</span>
                                    </div>
                                </div>
                            </template>
                        </el-autocomplete>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="initList(1)">查询</el-button>
                        <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
                    </el-form-item>
                    </el-form>
                </div>
                <div  class="tools-bar">
                    <el-button type="success" size="small" @click="handleDrawInvoice(1)">个人发票</el-button>
                    <el-button type="success" size="small" @click="handleDrawInvoice(2)">企业发票</el-button>
                </div>
                <el-table
                    :data="tableData"
                    border
                    highlight-current-row
                    @select-all="handleSelectionAll"
                    @selection-change="handleSelectionChange"
                    style="width: 100%"
                    >
                    <el-table-column
                        type="selection"
                        align="center"
                        fixed="left"
                        width="55">
                    </el-table-column>
                    <el-table-column 
                        v-for="item in rowData1"
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
                        layout="total, prev, pager, next, jumper"
                        :total="totalRecord"
                        background
                        >
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="开票中" name="2">
                <el-table
                    :data="tableData"
                    border
                    fit
                    highlight-current-row
                    style="width: 100%"
                    >
                    <el-table-column 
                        v-for="item in rowData2"
                        :prop="item.name"
                        :label="item.text"
                        align="center"
                        >
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        >
                        <template slot-scope="scope">
                        <div>
                            <el-button
                            type="primary"
                            size="mini"
                            plain
                            @click="handleDetail(scope.$index, scope.row)"
                            >详情</el-button>
                        </div>
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
            </el-tab-pane>
            <el-tab-pane label="已开票" name="3">
                <el-table
                    :data="tableData"
                    border
                    fit
                    highlight-current-row
                    style="width: 100%"
                    >
                    <el-table-column 
                        v-for="item in rowData2"
                        :prop="item.name"
                        :label="item.text"
                        align="center"
                        >
                    </el-table-column>
                    <el-table-column prop="companyAddress" label="开票日期" align="center"></el-table-column>
                    <el-table-column prop="invoiceNumber" label="发票号码" align="center"></el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        >
                        <template slot-scope="scope">
                        <div>
                            <el-button
                            type="primary"
                            size="mini"
                            plain
                            @click="handleDetail(scope.$index, scope.row)"
                            >详情</el-button>
                        </div>
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
            </el-tab-pane>
            <el-tab-pane label="开票失败" name="4">
                <el-table
                    :data="tableData"
                    border
                    >
                    <el-table-column 
                        v-for="item in rowData2"
                        :prop="item.name"
                        :label="item.text"
                        align="center"
                        >
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        width="170px;"
                        >
                        <template slot-scope="scope">
                            <div>
                                <!-- <el-button type="success" size="small" @click="handleDrawInvoice(1)">个人发票</el-button> -->
                                <el-button
                                type="success"
                                size="mini"
                                plain
                                @click="handleAgainInvoice(scope.$index, scope.row)"
                                >重新开票</el-button>
                                <el-button
                                type="primary"
                                size="mini"
                                plain
                                @click="handleDetail(scope.$index, scope.row)"
                                >详情</el-button>
                            </div>
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
            </el-tab-pane>
        </el-tabs>  
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="onDialogClose()">
            <el-form ref="dataForm1" :rules="rules" :model="dataForm" label-width="150px" size="small">
                <el-form-item>
                    <el-radio v-model="dataForm.invoiceType" :label=1>电子发票</el-radio>
                    <el-radio v-model="dataForm.invoiceType" :label=2>纸质发票</el-radio>
                </el-form-item>
                <el-form-item label="抬头类型">
                    <span v-if="subSearchData.invoiceType==1">个人</span>
                    <span v-else>企业单位</span>
                </el-form-item>
                <el-form-item label="发票抬头" prop="companyTitle">
                    <el-input v-model="dataForm.companyTitle" placeholder="发票抬头" style="width:70%;margin-right:5px" readonly></el-input>
                    <el-button plain icon="el-icon-more" @click="handleSelect()" style="padding: 9px;"></el-button>
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input v-model="dataForm.registerPhone" placeholder="联系电话" style="width:70%;" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" ></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="dataForm.emailAddress" placeholder="邮箱" style="width:70%;"></el-input>
                </el-form-item>
                <el-form-item label="邮寄地址">
                    <el-input v-model="dataForm.mailAddress" placeholder="邮寄地址" style="width:70%;"></el-input>
                </el-form-item>
                <div v-if="subSearchData.invoiceType==2">
                    <el-form-item label="企业地址">
                        <el-input v-model="dataForm.registerAddress" placeholder="企业地址" style="width:70%;"></el-input>
                    </el-form-item>
                    <el-form-item label="企业税号">
                        <el-input v-model="dataForm.taxpayerNumber" placeholder="税号" style="width:70%;"></el-input>
                    </el-form-item>
                    <el-form-item label="开户银行">
                        <el-input v-model="dataForm.accountBank" placeholder="开户银行" style="width:70%;"></el-input>
                    </el-form-item>
                    <el-form-item label="银行账号">
                        <el-input v-model="dataForm.accountNumber" placeholder="银行账号" style="width:70%;"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
            <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="onDialogSubmit()">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="选取发票抬头" :visible.sync="subdialogVisible" width="55%" append-to-body>
            <div class="search-bar">
                <el-form :inline="true" :model="subSearchData" class="fl" size="small">
                    <el-form-item label="发票抬头" v-if="subSearchData.invoiceType==1">
                        <el-input v-model="subSearchData.companyTitle" placeholder="发票抬头" style="width:120px;"></el-input>
                    </el-form-item>
                    <el-form-item label="联络电话" v-if="subSearchData.invoiceType==1">
                        <el-input v-model.number="subSearchData.phone" placeholder="联系电话" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" ></el-input>
                    </el-form-item>
                    <el-form-item label="企业名称" v-if="subSearchData.invoiceType==2">
                        <el-input v-model="subSearchData.companyTitle" placeholder="企业名称" style="width:150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="企业税号" v-if="subSearchData.invoiceType==2">
                        <el-input v-model="subSearchData.companyTaxNum" placeholder="企业税号" style="width:150px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="subTableList">查询</el-button>
                        <el-button type="warning" plain icon="el-icon-brush" @click="handleSubReset">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table
                :data="subTableData"
                border
                fit
                style="width: 100%"
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
                                @click="handleSelectSubmit(scope.$index, scope.row)"
                            >选取</el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column 
                    v-for="item in subRowData1"
                    :prop="item.name"
                    :label="item.text"
                    align="center"
                    >
                </el-table-column>
                <el-table-column 
                    v-if="subSearchData.invoiceType==2"
                    v-for="item in subRowData2"
                    :prop="item.name"
                    :label="item.text"
                    align="center"
                    >
                </el-table-column>
            </el-table>
            <div class="pagination-bar">
                <el-pagination
                    @current-change="handleCurrentChange1"
                    :page-size="pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="totalRecord"
                    background
                    hide-on-single-page
                    >
                </el-pagination>
            </div>
        </el-dialog>
        <el-dialog title="发票详情" :visible.sync="dialogVisible2" width="40%">
            <el-form label-width="30%">
                <el-form-item v-for="(item,index) in invoiceDetailData" :label="item.text" style="margin-bottom: 0;">
                    <span>{{ item.val }}</span>
                </el-form-item>
            </el-form>
        </el-dialog>
    </el-card>
  </template>
  <script>
      import { vehicleUserSearch } from '@/api/order'
      import { invoiceList,invoiceBasicList,addInvoice,invoiceDetail,againInvoice} from '@/api/finance'
      export default {
          data() {
              return {
                  totalRecord: 0,
                  pageSize: 10,
                  tableLoading: false,
                  tabSelectedList:[],//table选中数据
                  dialogVisible: false,//开发票
                  subdialogVisible: false,//选发票抬头
                  dialogVisible2:false,//详情
                  dialogTitle: '',  
                  subscriper:'',//订车人名称——搜索
                  searchData: {
                      orderId: null,  //勤务编号
                      orderBatchId: null,//订单编号
                      userId:null,//订车人id
                       invoiceState:"1",//发票状态
                  },
                  subSearchData:{
                      invoiceType:null,//发票类型：1个人，2企业
                      companyTitle:'',//抬头
                      phone:null,
                      companyTaxNum:'',//税号
                  },
                  dataForm: {
                    invoiceType:1,//发票类型：1电子，2纸质
                    companyTitle: '',
                    registerPhone:null,
                    emailAddress: '',
                    mailAddress:'',
                    registerAddress:'',	//企业地址
                    taxpayerNumber:'',	//税号
                    accountBank:'',	    //开户银行
                    accountNumber:'',	//银行账号
                  },
                  addParams:{
                    orderIdList:'',
                    invoiceBasicId:''//抬头id
                  },
                  rules: {
                    companyTitle: [{ required: true,message: '请选择抬头', trigger: 'change' }],
                  },
                  rowData1:[
                    {name:'orderBatchId',text:'订单编号'},
                    {name:'orderId',text:'勤务编号'},
                    {name:'userName',text:'订车人'},
                    {name:'passenger',text:'乘客'},
                    {name:'phone',text:'联系电话'},
                    {name:'serviceType',text:'服务类型'},
                    {name:'appointmantTime',text:'用车时间'},
                    {name:'carType',text:'车型'},
                    {name:'carPlateNumber',text:'车牌号'},
                    {name:'orderAmount',text:'订单金额'},
                    {name:'discountAmount',text:'优惠金额'},
                    {name:'payAmount',text:'支付金额'},
                    {name:'payAmount',text:'收款方式'},
                    {name:'confirmTime',text:'收款日期'},
                  ],
                  rowData2:[
                    {name:'orderBatchId',text:'订单编号'},
                    {name:'orderId',text:'勤务编号'},
                    {name:'userName',text:'订车人'},
                    {name:'invoiceAmount',text:'开票金额'},
                    {name:'applyTime',text:'申请时间'},
                    {name:'invoiceType',text:'开票类型'},
                    {name:'invoiceRiseType',text:'发票抬头类型'},
                    {name:'email',text:'邮箱'},
                    {name:'mailAddress',text:'邮寄地址'},
                    {name:'phone',text:'联系电话'},
                    {name:'companyTaxNum',text:'企业税号'},
                    {name:'companyAddress',text:'企业地址'},
                  ],    
                  subRowData1:[
                    {name:'companyTitle',text:'发票抬头'},
                    {name:'registerPhone',text:'联系电话'},
                    {name:'emailAddress',text:'邮箱'},
                    {name:'mailAddress',text:'邮寄地址'},
                  ],    
                  subRowData2:[
                    {name:'taxpayerNumber',text:'企业税号'},
                    {name:'registerAddress',text:'企业地址'},
                    {name:'accountBank',text:'开户银行'},
                    {name:'accountNumber',text:'银行账号'},
                  ],       
                  invoiceDetailData:[
                    {name:'orderBatchId',text:'订单编号：',val:''},
                    {name:'orderId',text:'勤务编号：',val:''},
                    {name:'invoiceAmount',text:'开票金额：',val:''},
                    {name:'applyTime',text:'申请时间：',val:''},
                    {name:'invoiceType',text:'开票类型：',val:''},
                    {name:'invoiceRiseType',text:'抬头类型：',val:''},
                    {name:'invoiceTitle',text:'发票抬头'},
                    {name:'phone',text:'电话号码：',val:''},
                    {name:'email',text:'邮箱：',val:''},
                    {name:'mailAddress',text:'邮寄地址：',val:''},  
                    {name:'companyAddress',text:'企业地址：',val:''},
                    {name:'TaxNum',text:'税号：',val:''},
                    {name:'accountBank',text:'开户银行：',val:''},
                    {name:'accountNumber',text:'银行账号：',val:''},
                ],
                  tableData: [],
                  subTableData: [],
              }
          },
          created() {
              this.initList('1');
          },
          methods: {
                //点击选项卡
                handleClick(tab, event) {
                    this.searchData.page=1
                    this.initList(this.searchData.invoiceState);
                },
                //查询发票列表
                async initList(type) {
                    let params = type=="1"? JSON.parse(JSON.stringify(this.searchData)) :{invoiceState:type}
                    params.invoiceState = Number(params.invoiceState)
                    const data = await invoiceList(params)
                    this.tableData = data.invoiceVOList
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
                //开发票——点击事件
                handleDrawInvoice(val){
                    if(this.tabSelectedList.length<1){
                        this.$message('请选择数据');
                    }else{
                        this.addParams.orderIdList= this.tabSelectedList.map(item=>{
                            return item.orderId
                        })
                        this.subSearchData.invoiceType = val
                        this.dialogVisible = true;    
                        this.dialogTitle = this.subSearchData.invoiceType==1 ? '个人发票' : '企业发票'
                    }
                },
                //搜索抬头列表
                subTableList(){
                    invoiceBasicList(this.subSearchData).then(response=>{
                        this.subTableData = response.invoiceBasicVOList
                    });
                },
                //开票详情
                handleDetail(index, row){
                    let params = {
                        orderBatchId: row.orderBatchId,
                        orderId: row.orderId,
                        invoiceId: row.invoiceId,
                    }
                    invoiceDetail(params).then(response => {
                        this.dialogVisible2=true
                        this.invoiceDetailData = this.invoiceDetailData.filter(item=>{
                            if(response[item.name]){
                                item.val = response[item.name]
                                return item 
                            }
                        })  
                    })
                },
                //重新开票
                handleAgainInvoice(index,row){
                    againInvoice(row.invoiceId).then(response => {
                        this.$message({
                            type: 'success',
                            message: '开票成功！'
                        });
                        this.initList('4')
                    })
                },
                //未开票——订车人搜索
                querySearch(queryString, cb) {
                    if(queryString){
                        vehicleUserSearch({"userName":queryString,"userType":1}).then(response => {
                            var restaurants = response.resultList;
                            var results = restaurants.length>0 ? restaurants : [{nolist:'没有此订车人，请点击右方按钮添加'}];
                            cb(results);
                        })
                    }
                },
                //选择订车人
                handleSelectUser(item) {
                    this.subscriper = item.userName
                    this.searchData.userId= item.userId
                },
                //打开发票抬头列表
                handleSelect(val){
                    this.subdialogVisible = true
                    this.subTableList()
                },
                //选取发票
                handleSelectSubmit(index,row){
                    this.dataForm.companyTitle=row.companyTitle
                    this.dataForm.registerPhone=row.registerPhone
                    this.dataForm.emailAddress=row.emailAddress
                    this.dataForm.mailAddress=row.mailAddress
                    this.addParams.invoiceBasicId = row.invoiceBasicId
                    if(this.subSearchData.invoiceType==2){
                        this.dataForm.taxpayerNumber=row.taxpayerNumber
                        this.dataForm.registerAddress=row.registerAddress
                        this.dataForm.accountBank=row.accountBank
                        this.dataForm.accountNumber = row.accountNumber
                    }
                    this.subdialogVisible = false
                },
                //重置搜索条件
                handleReset() {
                    this.searchData= {
                        orderId: null,  //勤务编号
                        orderBatchId: null,//订单编号
                        userId:null,//订车人id
                        invoiceState:'1',//发票状态
                    }
                },
                //重置搜索发票抬头条件
                handleSubReset() {
                    this.subSearchData={
                        invoiceType:this.subSearchData.invoiceType,//发票类型：1个人，2企业
                        companyTitle:'',//抬头
                        phone:null,
                        companyTaxNum:'',//税号
                    }
                },
                //个人发票——保存
                onDialogSubmit() {
                    this.$refs.dataForm1.validate((valid) => {
                        if (valid) {
                            this.addParams.invoiceType = this.dataForm.invoiceType
                            addInvoice(this.addParams).then(response => {
                                this.$message({
                                    type: 'success',
                                    message: '保存成功！'
                                });
                                this.dialogVisible=false
                                this.initList('1')
                            })
                        } else { return false;}
                    });
                },
                //关闭弹窗——个人
                onDialogClose() {
                    this.$refs.dataForm1.resetFields();
                    this.dataForm={invoiceType:1}
                },  
                //发票列表——跳转到指定页
                handleCurrentChange(val) {
                    this.searchData.page = val;
                    this.initList(this.searchData.invoiceState)
                },
                //抬头列表——跳转到指定页
                handleCurrentChange1(val) {
                    this.subSearchData.page = val
                    this.subTableList()
                },
          }
      }
  </script>
<style lang="scss">
    .my-autocomplete{
        width:auto!important;
    }
</style>