<template lang="html">
    <el-card class="box-card">
        <div class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" size="small">
                <el-form-item label="发放人">
                    <el-input v-model="searchData.phoneOrFileName" placeholder="手机号/文件名"></el-input>
                </el-form-item>
                <el-form-item label="审核需求">
                    <el-select v-model="searchData.reviewType" placeholder="请选择" style="width:110px;">
                        <el-option value="1" label="是"></el-option>
                        <el-option value="2" label="否"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="模板ID">
                    <el-input v-model="searchData.issueTemplateId" placeholder="模板ID"></el-input>
                </el-form-item>
                
                <el-form-item label="审核状态">
                <el-select v-model="searchData.status" placeholder="请选择" style="width:150px;">
                    <el-option value="0" label="无需审核"></el-option>
                    <el-option value="2" label="成功"></el-option>
                    <el-option value="3" label="拒绝"></el-option>
                    <el-option value="1" label="待审核"></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="发放类型">
                <el-select v-model="searchData.grantType" placeholder="请选择" style="width:120px;">
                    <el-option value="1" label="单张"></el-option>
                    <el-option value="2" label="批量"></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="提交时间">
                    <el-date-picker
                        v-model="searchData.submitTimeStart"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        style="width:190px;"
                        placeholder="选择时间">
                    </el-date-picker>
                    -
                    <el-date-picker
                        v-model="searchData.submitTimeEnd"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        style="width:190px;"
                        placeholder="选择时间"
                        :picker-options="pickerOptions1"
                        default-time="23:59:59">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="发放时间">
                    <el-date-picker
                        v-model="searchData.sendingTimeStart"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        style="width:190px;"
                        placeholder="选择时间">
                    </el-date-picker>
                    -
                    <el-date-picker
                        v-model="searchData.sendingTimeEnd"
                        type="datetime"
                        placeholder="选择时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        style="width:190px;"
                        :picker-options="pickerOptions2"
                        default-time="23:59:59">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="initList(1)">查询</el-button>
                <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
                <el-button v-if="excelStatus==3" type="success" icon="el-icon-upload2" size="small" @click="handleExport">导出Excel</el-button>
                <el-button v-if="excelStatus==1" type="success" icon="el-icon-loading" size="small" disabled>正在导出</el-button>
                <el-button v-if="excelStatus==2" type="success" icon="el-icon-download" size="small" @click="handleDownload(excelUrl)">下载Excel</el-button>
                <el-button v-if="excelStatus==2" type="success" icon="el-icon-download" size="small" @click="handleExport">重新导出</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <el-table :data="tableData" border>
                <el-table-column label="模板ID" prop="issueTemplateId" align="center"></el-table-column>
                <el-table-column label="用户" align="center">
                    <template slot-scope="scope">
                        <div v-for="key in scope.row.grantShowVOList">
                            <el-link v-if="key.url" type="primary" :underline="false" @click="handleDownload(key.url)">{{key.describe}}</el-link>
                            <p v-else>{{key.describe}}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="是否注册" align="center">
                    <template slot-scope="scope">
                        <div v-for="key in scope.row.grantShowVOList">{{key.status}}</div>
                    </template>
                </el-table-column>
                <el-table-column v-for="item in rowData" :prop="item.name" :label="item.text" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="150">
                    <template slot-scope="scope">
                        <div>
                        <el-button type="primary" size="mini" plain @click="handleReason(scope.row)">原因</el-button>
                        <el-button type="primary" size="mini" plain @click="handleDetail(scope.row)">详情</el-button>
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
        <el-dialog title="原因" :visible.sync="dialogVisible1" @close="onDialogClose()" width="40%">
            <el-form label-width="120px" :model="dataDetail">
                <div v-if="dataDetail.reasonIssueTypeDesc||dataDetail.reasonIssue">
                    <el-form-item label="发放原因："></el-form-item>
                    <el-form-item v-if="dataDetail.reasonIssue"><span>{{dataDetail.reasonIssue}}</span></el-form-item>
                    <el-form-item v-if="dataDetail.reasonIssueTypeDesc"><span>{{dataDetail.reasonIssueTypeDesc}}</span></el-form-item>
                </div>
                <div v-if="dataDetail.refuseReasonTypeDesc||dataDetail.refuseReason">
                    <el-form-item label="拒绝原因：" style="color:red"></el-form-item>
                    <el-form-item v-if="dataDetail.refuseReason"><span>{{dataDetail.refuseReason}}</span></el-form-item>
                    <el-form-item v-if="dataDetail.refuseReasonTypeDesc"><span>{{dataDetail.refuseReasonTypeDesc}}</span></el-form-item>
                </div>
            </el-form>
        </el-dialog>
        <el-dialog title="发放详情" :visible.sync="dialogVisible2" @close="onDialogClose()">
            <el-form ref="dataDetail" :rules="rules" :model="dataDetail" disabled label-width="150px" style="width: 80%;">
                <el-form-item label="优惠券名称">
                    <el-input v-model="dataDetail.couponName" placeholder="优惠券名称"></el-input>
                </el-form-item>
                <el-form-item label="有效期类型">
                    <el-select v-model="dataDetail.effectiveType" placeholder="请选择" style="width: 100%;">
                        <el-option :value=0 label="指定日期"></el-option>
                        <el-option :value=1 label="指定有效期限"></el-option>
                    </el-select>
                </el-form-item>
                <div v-show="dataDetail.effectiveType===0">
                    <el-form-item label="日期" required>
                        <el-col :span="11">
                            <el-form-item prop="effectiveStartTime">
                                <el-date-picker
                                    v-model="dataDetail.effectiveStartTime"
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
                            <el-form-item prop="effectiveEndTime">
                                <el-date-picker
                                    v-model="dataDetail.effectiveEndTime"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%;"
                                    placeholder="选择时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-form-item>  
                </div>
                <div v-show="dataDetail.effectiveType===1">
                    <el-form-item label="自领取" prop="effectiveDelayDay">
                        <el-input v-model="dataDetail.effectiveDelayDay" style="width: 60%;margin-right: 10px;"></el-input>日后开始生效
                    </el-form-item>
                    <el-form-item label="自生效日开始后" prop="effectiveLastDay">
                        <el-input v-model="dataDetail.effectiveLastDay" style="width: 60%;margin-right: 10px;"></el-input>天内有效
                    </el-form-item>
                </div>
                <el-form-item v-for="(item, index) in dataDetail.timeInterval" :label="'分时 ' + (index+1)">
                    <el-col :span="11">
                        <el-time-select
                            v-model="item.startTime"
                            style="width: 100%;"
                            :picker-options="{start:'00:00',step:'00:30',end:'23:30'}"
                            placeholder="选择时间">
                        </el-time-select>
                    </el-col>
                    <el-col style="text-align: center;" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-time-select
                            style="width: 100%;"
                            v-model="item.endTime"
                            :picker-options="{start:'00:00',step:'00:30',end:'23:30',minTime: item.startTime}"
                            placeholder="选择时间"
                            >
                        </el-time-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="优惠方式">
                    <el-select v-model="dataDetail.depreciateType" placeholder="请选择" style="width: 100%;">
                        <el-option :value=1 label="满减金额"></el-option>
                        <el-option :value=2 label="折扣券"></el-option>
                    </el-select>
                </el-form-item>
                <div v-show="dataDetail.depreciateType==1">
                    <el-form-item label="满额设定">
                        <el-input v-model="dataDetail.discount" placeholder="满额设定"></el-input>
                    </el-form-item>
                    <el-form-item label="减额设定">
                        <el-input v-model="dataDetail.discountType" placeholder="减额设定"></el-input>
                    </el-form-item>
                </div>
                <div v-show="dataDetail.depreciateType==2">
                    <el-form-item label="折扣优惠">
                        <el-input v-model="dataDetail.rebate" placeholder="折扣优惠" style="width: 60%;margin-right: 10px;"></el-input>折
                    </el-form-item>
                    <el-form-item label="最高折扣金额">
                        <el-input v-model="dataDetail.rebateAmount" placeholder="最高折扣金额" style="width: 60%;margin-right: 10px;"></el-input>元
                    </el-form-item>
                </div>
                <el-form-item label="订单类型">
                    <el-checkbox-group v-model="dataDetail.orderType">
                        <el-checkbox v-for="item in orderTypeList" :label="item.value">{{item.desc}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="模板内容">
                    <el-input v-model="dataDetail.content" placeholder="模板内容"></el-input>
                </el-form-item>
                <el-form-item label="是否需要审核">
                    <el-radio v-model="dataDetail.needAudit" label="1">是</el-radio>
                    <el-radio v-model="dataDetail.needAudit" label="2">否</el-radio>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="发放详情" :visible.sync="dialogVisible3" @close="onDialogClose()" width="70%">
            <el-form inline label-width="120px" :model="dataDetail">
                <el-form-item label="礼包名称：">
                    <span>{{ dataDetail.couponName }}</span>
                </el-form-item>
                <el-form-item label="是否需要审核：">
                    <span>{{ dataDetail.needAuditDesc }}</span>
                </el-form-item>
            </el-form>
            <el-table :data="dataDetail.listCoupon" border>
                <el-table-column v-for="item in subRowData" :prop="item.name" :label="item.text" align="center"></el-table-column>
            </el-table>
        </el-dialog>
    </el-card>
</template>
<script>
    import { optionsList } from '@/api/common'
    import { grantList,templateOne,grantExport} from '@/api/coupon'
    export default {
        data() {
            return {
                totalRecord: 0,
                pageSize: 10,
                tableLoading: false,
                dialogVisible1: false,//原因
                dialogVisible2: false,//单个优惠券详情
                dialogVisible3: false,//礼包详情
                orderTypeList:[],//订单类型
                excelUrl:'',
                excelStatus:'',
                searchData: {
                    issueTemplateId: null,
                    reviewType: '',//审核需求
                    status: '',//审核状态
                    phoneOrFileName: '',//手机号/文件名
                    grantType:'',//发放类型
                    submitTimeStart: '',//提交时间
                    submitTimeEnd: '',
                    sendingTimeStart: '',//发放时间
                    sendingTimeEnd	: '',
                    page:1
                },
                dataDetail: {
                    refuseReasonTypeDesc: '',  //拒绝原因
                    refuseReason:'',//其他拒绝原因
                    reasonIssueTypeDesc: '',  //发放原因
                    reasonIssue:'',//其他发放原因
                    couponName:'',//礼包名称
                    needAudit:'',
                    needAuditDesc:'',//是否需要审核
                    listCoupon:[],//礼包列表

                    couponName: '',  //优惠券名称
                    effectiveType:null,//有效期类型
                    effectiveStartTime: '',//有效开始时间
                    effectiveEndTime:'',//有效结束时间
                    effectiveDelayDay:'',//自领取x天开始生效
                    effectiveLastDay:'',//自领取x天内有效
                    depreciateType:null,//优惠券类型
                    conditionType:'',//折扣/满减
                    condition:'',//满减条件
                    discountType:'',//满减类型
                    discount:'',//满减金额
                    orderType:[],//订单类型
                    content:'',//模板内容
                    timeInterval:[
                        {startTime:'',endTime:''},
                        {startTime:'',endTime:''},
                        {startTime:'',endTime:''},
                    ],//时段
                    rebate:'',//折扣
                    rebateAmount:'',//最大折扣金额
                },
                rules: {
                    stationId: [{ required: true,message: '请选择据点', trigger: 'change'}],
                    vehicleId: [{ required: true,message: '请选择车型类型', trigger: 'change'}],
                    className: [{required: true,message: '车型名称不能为空',trigger: 'blur'}],
                },
                rowData:[
                    // {name:'issueTemplateId',text:'模板ID'},
                    // {name:'grantShowVOList',text:'用户名'},
                    // {name:'registerStatusDesc',text:'是否注册'},
                    {name:'specialTypeDesc',text:'类型'},
                    {name:'submitterName',text:'操作人'},
                    {name:'issueNum',text:'预发放数量'},
                    {name:'submitTimeDesc',text:'提交时间'},
                    {name:'sendingTimeDesc',text:'发放时间'},
                    {name:'reviewTypeDesc',text:'审核需求'},
                    {name:'reviewTimeDesc',text:'审核时间'},
                    {name:'statusDesc',text:'审核状态'},
                ],  
                subRowData:[
                    {name:'id',text:'模板ID'},
                    {name:'couponName',text:'优惠券名称'},
                    {name:'bindingNum',text:'绑定数量'},
                    {name:'depreciateTypeDesc',text:'优惠券类型'},
                    {name:'rebate',text:'折扣优惠'},
                    {name:'rebateAmount',text:'最高折扣'},
                    {name:'condition',text:'满额设定'},
                    {name:'discount',text:'减额设定'},
                    {name:'orderTypeDesc',text:'订单类型'},
                    {name:'effectiveStartTimeDesc',text:'开始时间'},
                    {name:'effectiveEndTimeDesc',text:'结束时间'},
                ],        
                tableData: [],
                pickerOptions1:{ //搜索提交日期
                    disabledDate:(time)=>{
                        return time.getTime() < new Date(this.searchData.submitTimeStart).getTime();
                    }   
                },
                pickerOptions2:{ //搜索发放日期
                    disabledDate:(time)=>{
                        return time.getTime() < new Date(this.searchData.sendingTimeStart).getTime();
                    }   
                },
            }
        },
        created() {
            this.initList(1); 
            this.selectList()
        },
        methods: {
            //查询列表
            async initList(val) {
                this.searchData.page = val
                const data = await grantList(this.searchData)
                this.tableData = data.list
                this.totalRecord = data.pageInfo.totalSize
                this.excelUrl = data.url
                this.excelStatus = data.status
            },
            //查询下拉框列表
            async selectList() {
                this.orderTypeList = (await optionsList({dictionaryCodes:["COUPON_TYPE"]}))[0].list
            },
            //导出excel
            handleExport(){
                grantExport(this.searchData).then(()=>{
                    this.initList(this.searchData.page)
                })
            },
            //下载excel
            handleDownload(url){
                window.location.href = url
            },
            //原因
            handleReason(row){
                this.dialogVisible1 = true;
                this.$nextTick(() => {
                    for (let x of Object.keys(this.dataDetail)) {
                        this.dataDetail[x] = row[x]
                    }
                })
            },
            //发放详情
            handleDetail(row) {
                templateOne(row.issueTemplateId).then(result=>{
                    if(row.specialType==1){
                        this.dialogVisible2 = true
                        this.$nextTick(() => {
                            for (let x of Object.keys(this.dataDetail)) {
                                this.dataDetail[x] = result[x]
                            }
                        })
                    }else if(row.specialType==2){
                        this.dialogVisible3 = true
                        this.$nextTick(() => {
                            for (let x of Object.keys(this.dataDetail)) {
                                this.dataDetail[x] = result[x]
                            }
                        })
                    }else{
                        this.$message({message: '缺少优惠券类型',type: 'error'});
                    }
                })
            },
            //重置搜索条件
            handleReset() {
                this.searchData={
                    issueTemplateId: null,
                    reviewType: '',//审核需求
                    status: '',//审核状态
                    phoneOrFileName: '',//手机号/文件名
                    grantType:'',//发放类型
                    submitTimeStart: '',//提交时间
                    submitTimeEnd: '',
                    sendingTimeStart: '',//发放时间
                    sendingTimeEnd	: '',
                    page:this.searchData.page
                }
            },
            
            //关闭弹窗
            onDialogClose() {
                this.dataDetail = {
                    refuseReasonTypeDesc: '',  //拒绝原因
                    refuseReason:'',//其他拒绝原因
                    reasonIssueTypeDesc: '',  //发放原因
                    reasonIssue:'',//其他发放原因
                    couponName:'',//礼包名称
                    needAudit:'',
                    needAuditDesc:'',//是否需要审核
                    listCoupon:[],//礼包列表

                    couponName: '',  //优惠券名称
                    effectiveType:null,//有效期类型
                    effectiveStartTime: '',//有效开始时间
                    effectiveEndTime:'',//有效结束时间
                    effectiveDelayDay:'',//自领取x天开始生效
                    effectiveLastDay:'',//自领取x天内有效
                    depreciateType:null,//优惠券类型
                    conditionType:'',//折扣/满减
                    condition:'',//满减条件
                    discountType:'',//满减类型
                    discount:'',//满减金额
                    orderType:[],//订单类型
                    content:'',//模板内容
                    timeInterval:[
                        {startTime:'',endTime:''},
                        {startTime:'',endTime:''},
                        {startTime:'',endTime:''},
                    ],//时段
                    rebate:'',//折扣
                    rebateAmount:'',//最大折扣金额
                }
            },   
            //跳转到指定页
            handleCurrentChange(val) {
                this.initList(val)
            },
        }
    }
</script>
  