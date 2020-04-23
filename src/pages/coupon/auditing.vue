<template lang="html">
    <el-card class="box-card">
        <div class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" size="small">
                <el-form-item label="发放人">
                    <el-input v-model="searchData.sendUserPhone" placeholder="手机号/文件名"></el-input>
                </el-form-item>
                <el-form-item label="模板ID">
                    <el-input v-model="searchData.issueTemplateId" placeholder="模板ID"></el-input>
                </el-form-item>
                <el-form-item label="发放类型">
                    <el-select v-model="searchData.grantType" placeholder="请选择" style="width:120px;">
                        <el-option value="1" label="单张"></el-option>
                        <el-option value="2" label="批量"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="initList(1)">查询</el-button>
                    <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
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
                            <span v-else>{{key.describe}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="是否注册" align="center">
                    <template slot-scope="scope">
                        <div v-for="key in scope.row.grantShowVOList">{{key.status}}</div>
                    </template>
                </el-table-column>
                <el-table-column v-for="item in rowData" :prop="item.name" :label="item.text" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="210">
                <template slot-scope="scope">
                    <div>
                        <el-button type="primary" size="mini" plain @click="handleReason(scope.row)">原因</el-button>
                        <el-button type="primary" size="mini" plain @click="handleDetail(scope.row)">详情</el-button>
                        <el-button type="success" size="mini" plain @click="handleCheck(scope.row)">审核</el-button>
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
            <el-form ref="dataDetail" :model="dataDetail" disabled label-width="150px" style="width: 80%;">
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
                    <el-form-item label="自领取">
                        <el-input v-model="dataDetail.effectiveDelayDay" style="width: 60%;margin-right: 10px;"></el-input>日后开始生效
                    </el-form-item>
                    <el-form-item label="自生效日开始后">
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
                    <span>{{ dataDetail.reviewTypeDesc }}</span>
                </el-form-item>
            </el-form>
            <el-table :data="dataDetail.listCoupon" border>
                <el-table-column v-for="item in subRowData" :prop="item.name" :label="item.text" align="center"></el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog title="审核" :visible.sync="dialogVisible4" @close="onDialogClose()">
            <el-form label-width="120px" :model="dataDetail">
                <el-form-item label="用户名：">
                    <p v-for="item in dataDetail.users">{{ item.describe }}</p>
                </el-form-item>
                <el-form-item label="优惠券名称：">
                    <span>{{ dataDetail.couponName }}</span>
                </el-form-item>
                <el-form-item label="审核：">
                    <el-radio v-model="dataDetail.status" :label=2>通过</el-radio>
                    <el-radio v-model="dataDetail.status" :label=3>拒绝</el-radio>
                </el-form-item>
                <el-form-item v-show="dataDetail.status==3" label="拒绝原因：">
                    <el-radio v-model="dataDetail.refuseReasonType" :label=1>与优惠券规则不符</el-radio>
                    <el-radio v-model="dataDetail.refuseReasonType" :label=2>优惠券规则有疑问</el-radio>
                    <el-radio v-model="dataDetail.refuseReasonType" :label=3>其他</el-radio>
                </el-form-item>
                <el-form-item v-show="dataDetail.status==3">
                    <el-input type="textarea" v-model="dataDetail.refuseReason" placeholder="其他拒绝原因"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium" @click="dialogVisible4 = false">取 消</el-button>
                <el-button size="medium" type="primary" @click="onDialogSubmit()">确定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>
<script>
    import { grantList,templateOne,couponCheck } from '@/api/coupon'
    export default {
        data() {
            return {
                totalRecord: 0,
                pageSize: 10,
                tableLoading: false,
                dialogVisible1: false,//原因
                dialogVisible2: false,//单个优惠券
                dialogVisible3: false,//优惠券礼包
                dialogVisible4: false,//审核
                orderTypeList:[],//订单类型下拉框
                searchData: {
                    issueTemplateId: null,
                    grantType: '',//优惠券类型
                    sendUserPhone:'',//发放人
                    status: 1,//审核状态
                    page:1
                },
                dataDetail: {
                    refuseReasonTypeDesc: '',  //拒绝原因
                    refuseReason:'',//其他拒绝原因
                    reasonIssueTypeDesc: '',  //发放原因
                    reasonIssue:'',//其他发放原因

                    couponName:'',//礼包名称
                    needAudit:'',
                    reviewTypeDesc:'',//是否需要审核
                    listCoupon:[],//礼包列表

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

                    users:[],
                    grantId:'',
                    refuseReasonType:1,
                    refuseReason:'',
                    status:2,
                },
                rowData:[
                    // {name:'templatesId',text:'模板ID'},
                    // {name:'templatesId',text:'用户名'},
                    {name:'specialTypeDesc',text:'类型'},
                    {name:'submitterName',text:'操作人'},
                    {name:'couponName',text:'优惠券名称'},
                    {name:'depreciateTypeDesc',text:'优惠券类型'},
                    {name:'orderTypeDesc',text:'订单类型'},
                    // {name:'sendingTime',text:'开始时间'},
                    // {name:'sendingTime',text:'结束时间'},
                    {name:'submitTimeDesc',text:'提交时间'},
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
                tableData: []
            }
        },
        created() {
            this.initList(1);  
        },
        methods: {
            //查询列表
            async initList(val) {
                this.searchData.page = val
                const data = await grantList(this.searchData)
                this.tableData = data.list
                this.totalRecord = data.pageInfo.totalSize
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
            //审核
            handleCheck(row){
                this.dialogVisible4 = true;
                this.dataDetail.users = row.grantShowVOList
                this.dataDetail.grantId = row.grantId
                this.dataDetail.couponName = row.couponName
            },
            //重置搜索条件
            handleReset() {
                this.searchData={
                    issueTemplateId: null,
                    grantType: '',//优惠券类型
                    sendUserPhone:'',//发放人
                    status: 1,//审核状态,
                    page:this.searchData.page
                }
            },
            //审核
            onDialogSubmit(){
                let params = {
                    grantId:this.dataDetail.grantId,
                    status:this.dataDetail.status,
                }
                if(params.status==3){
                    params.refuseReasonType = this.dataDetail.refuseReasonType
                    params.refuseReason = this.dataDetail.refuseReason
                }
                couponCheck(params).then(result=>{
                    this.$message({type: 'success',message: '审核成功！'});
                    this.dialogVisible4 = false
                    this.initList(this.searchData.page)
                })
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
                    reviewTypeDesc:'',//是否需要审核
                    listCoupon:[],//礼包列表

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

                    users:[],
                    grantId:'',
                    refuseReasonType:1,
                    refuseReason:'',
                    status:2,
                }
            },   
            //跳转到指定页
            handleCurrentChange(val) {
                this.initList(val)
            },
        }
    }
</script>
  