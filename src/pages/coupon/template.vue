<template lang="html">
    <el-card class="box-card">
        <div class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" size="small">
            <el-form-item label="模板ID">
                <el-input v-model="searchData.templateId" placeholder="模板ID"></el-input>
            </el-form-item>
            <el-form-item label="订单类型">
                <el-select v-model="searchData.orderType" placeholder="请选择" style="width:150px;">
                    <el-option
                        v-for="item in orderTypeList"
                        :value="item.value"
                        :key="item.value"
                        :label="item.desc"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="类型">
                <el-select v-model="searchData.specialType" placeholder="请选择" style="width:120px;">
                <el-option :value=1 label="单张"></el-option>
                <el-option :value=2 label="礼包"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否需要审核">
                <el-select v-model="searchData.needAudit" placeholder="请选择" style="width:120px;">
                <el-option value="1" label="是"></el-option>
                <el-option value="2" label="否"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="优惠券名称">
                <el-input v-model="searchData.couponName" placeholder="优惠券名称"></el-input>
            </el-form-item>
            <el-form-item label="优惠券类型">
                <el-select v-model="searchData.depreciateType" placeholder="请选择" style="width:120px;">
                    <el-option :value=1 label="满减金额"></el-option>
                    <el-option :value=2 label="折扣券"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="日期">
                <el-date-picker
                    v-model="searchData.effectiveStartTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width:170px;"
                    placeholder="选择时间">
                </el-date-picker>
                -
                <el-date-picker
                    v-model="searchData.effectiveEndTime"
                    type="date"
                    placeholder="选择时间"
                    value-format="yyyy-MM-dd"
                    style="width:160px;"
                    :picker-options="pickerOptions1"
                    >
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="initList(1)">查询</el-button>
                <el-button type="warning" plain icon="el-icon-brush" @click="handleReset1">重置</el-button>
                <el-button v-if="excelStatus==3" type="success" icon="el-icon-upload2" size="small" @click="handleExport">导出Excel</el-button>
                <el-button v-if="excelStatus==1" type="success" icon="el-icon-loading" size="small" disabled>正在导出</el-button>
                <el-button v-if="excelStatus==2" type="success" icon="el-icon-download" size="small" @click="handleDownload">下载Excel</el-button>
                <el-button v-if="excelStatus==2" type="success" icon="el-icon-download" size="small" @click="handleExport">重新导出</el-button>
            </el-form-item>
            </el-form>
        </div>
        <div  class="tools-bar">
            <el-button type="success" icon="el-icon-plus" size="small" @click="handleAddCommon(1)">添加优惠券模板</el-button>
            <el-button type="success" icon="el-icon-plus" size="small" @click="handleAddCommon(2)">添加优惠券礼包</el-button>
        </div>
        <div>
            <el-table :data="tableData" border>
                <el-table-column v-for="item in rowData" :prop="item.name" :label="item.text" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="150">
                    <template slot-scope="scope">
                    <div>
                        <el-button type="primary" size="mini" plain @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button v-if="scope.row.canDelete" type="danger" size="mini" plain @click="handleRemove(scope.row)">删除</el-button>
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
        <el-dialog :title="dialogTitle1" :visible.sync="dialogVisible1" @close="onDialogClose()">
            <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="150px" style="width: 80%;">
                <el-form-item label="优惠券名称" prop="couponName">
                    <el-input v-model="dataForm.couponName" placeholder="优惠券名称"></el-input>
                </el-form-item>
                <el-form-item label="有效期类型">
                    <el-select v-model="dataForm.effectiveType" placeholder="请选择" style="width: 100%;">
                        <el-option :value=0 label="指定日期"></el-option>
                        <el-option :value=1 label="指定有效期限"></el-option>
                    </el-select>
                </el-form-item>
                <div v-if="dataForm.effectiveType===0">
                    <el-form-item label="日期" required>
                        <el-col :span="11">
                            <el-form-item prop="effectiveStartTime">
                                <el-date-picker
                                    v-model="dataForm.effectiveStartTime"
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
                                    v-model="dataForm.effectiveEndTime"
                                    type="date"
                                    :picker-options="pickerOptions3"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%;"
                                    placeholder="选择时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-form-item>  
                </div>
                <div v-if="dataForm.effectiveType===1">
                    <div>
                        <el-form-item label="自领取" prop="effectiveDelayDay">
                            <el-input v-model="dataForm.effectiveDelayDay" style="width: 60%;margin-right: 10px;"></el-input>日后开始生效
                        </el-form-item>
                        <el-form-item label="自生效日开始后" prop="effectiveLastDay">
                            <el-input v-model="dataForm.effectiveLastDay" style="width: 60%;margin-right: 10px;"></el-input>天内有效
                        </el-form-item>
                    </div>
                </div>
                <el-form-item v-for="(item, index) in dataForm.timeInterval" :label="'分时 ' + (index+1)">
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
                <!-- <el-form-item label="分时2">
                    <el-col :span="11">
                        <el-time-select
                            v-model="dataForm.time"
                            style="width: 100%;"
                            :picker-options="{start:'00:00',step:'00:30',end:'23:30'}"
                            placeholder="选择时间">
                        </el-time-select>
                    </el-col>
                    <el-col style="text-align: center;" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-time-select
                            style="width: 100%;"
                            v-model="dataForm.time"
                            :picker-options="{start:'00:00',step:'00:30',end:'23:30'}"
                            placeholder="选择时间">
                        </el-time-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="分时3">
                    <el-col :span="11">
                        <el-time-select
                            v-model="dataForm.time"
                            style="width: 100%;"
                            :picker-options="{start:'00:00',step:'00:30',end:'23:30'}"
                            placeholder="选择时间">
                        </el-time-select>
                    </el-col>
                    <el-col style="text-align: center;" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-time-select
                            style="width: 100%;"
                            v-model="dataForm.time"
                            :picker-options="{start:'00:00',step:'00:30',end:'23:30'}"
                            placeholder="选择时间">
                        </el-time-select>
                    </el-col>
                </el-form-item> -->
                <el-form-item label="优惠方式">
                    <el-select v-model="dataForm.depreciateType" placeholder="请选择" style="width: 100%;">
                        <el-option :value=1 label="满减金额"></el-option>
                        <el-option :value=2 label="折扣券"></el-option>
                    </el-select>
                </el-form-item>
                <div v-if="dataForm.depreciateType==1">
                    <div>
                        <el-form-item label="满额设定" prop="condition">
                            <el-input v-model="dataForm.condition" placeholder="满额设定"></el-input>
                        </el-form-item>
                        <el-form-item label="减额设定" prop="discount">
                            <el-input v-model="dataForm.discount" placeholder="减额设定"></el-input>
                        </el-form-item>
                    </div>
                </div>
                <div v-if="dataForm.depreciateType==2">
                    <el-form-item label="折扣优惠" prop="rebate">
                        <el-input v-model="dataForm.rebate" placeholder="折扣优惠" style="width: 60%;margin-right: 10px;"></el-input>折
                    </el-form-item>
                    <el-form-item label="最高折扣金额" prop="rebateAmount">
                        <el-input v-model="dataForm.rebateAmount" placeholder="最高折扣金额" style="width: 60%;margin-right: 10px;"></el-input>元
                    </el-form-item>
                </div>
                <el-form-item label="订单类型" prop="orderType">
                    <el-checkbox-group v-model="dataForm.orderType">
                        <el-checkbox v-for="item in orderTypeList" :label="item.value">{{item.desc}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="模板内容" prop="content">
                    <el-input v-model="dataForm.content" placeholder="模板内容"></el-input>
                </el-form-item>
                <el-form-item label="是否需要审核">
                    <el-radio v-model="dataForm.needAudit" label="1">是</el-radio>
                    <el-radio v-model="dataForm.needAudit" label="2">否</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium" @click="dialogVisible1 = false">取 消</el-button>
                <el-button size="medium" type="primary" @click="onDialogSubmit1()" v-if="dialogTitle1=='修改优惠券模板'">保存</el-button>
                <el-button size="medium" type="primary" @click="onDialogSubmit1()" v-else>立即创建</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="dialogTitle2" :visible.sync="dialogVisible2" @close="onDialogClose()" width="70%">
            <el-form inline ref="dataForm2" :rules="rules" :model="dataForm" class="fl" size="small">
                <el-form-item label="礼包名称" prop="couponName">
                    <el-input v-model="dataForm.couponName" placeholder="礼包名称"></el-input>
                </el-form-item>
                <el-form-item label="是否需要审核">
                    <el-select v-model="dataForm.needAudit" placeholder="请选择" style="width:120px;">
                        <el-option value="1" label="是"></el-option>
                        <el-option value="2" label="否"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="模板ID" prop="templateId">
                    <el-input v-model="dataForm.templateId" placeholder="模板ID"></el-input>
                </el-form-item>
                <el-form-item label="绑定数量">
                    <el-input-number v-model="dataForm.bindingNum" controls-position="right" :min="1" :max="20"></el-input-number>
                </el-form-item>
                <el-form-item>
                    <el-button type="warning" plain icon="el-icon-brush" @click="handleReset2">重置</el-button>
                    <el-button type="success" icon="el-icon-upload2" size="small" @click="handleAdd">添加至礼包</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="subTableData" border>
                <el-table-column v-for="item in subRowData" :prop="item.name" :label="item.text" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <div>
                    <el-button type="danger" size="mini" plain @click="handleRemove(scope.row,scope.$index)">删除</el-button>
                    </div>
                </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium" @click="dialogVisible2 = false">取 消</el-button>
                <el-button size="medium" type="primary" @click="onDialogSubmit2()" v-if="dialogTitle2=='修改优惠券礼包'">保存</el-button>
                <el-button size="medium" type="primary" @click="onDialogSubmit2()" v-else>立即创建</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>
<script>
    import { optionsList } from '@/api/common'
    import { templateList,templateExport,templateOne,templateDelete,templateSave } from '@/api/coupon'
    export default {
        data() {
            return {
                totalRecord: 0,
                pageSize: 10,
                tableLoading: false,
                dialogVisible1: false,//单个优惠券
                dialogVisible2: false,//优惠券礼包
                dialogTitle1: '',//单个优惠券
                dialogTitle2: '',//优惠券礼包
                orderTypeList:[],//订单类型下拉框
                excelUrl:'',
                excelStatus:'',
                searchData: {
                    templateId: null,
                    couponName: '',//优惠券模板名称
                    orderType:'',//订单类型
                    depreciateType:null,//优惠券类型
                    specialType:null,//类型
                    needAudit:'',//是否审核
                    effectiveStartTime:'',//开始时间
                    effectiveEndTime:'',//结束时间
                    page:1
                },
                dataForm: {
                    id:'',
                    updateType:0,//类型-添加/修改
                    specialType:1,//优惠券类型 1模板2礼包
                    couponName: '',  //优惠券名称
                    effectiveType:0,//有效期类型
                    effectiveStartTime: '',//有效开始时间
                    effectiveEndTime:'',//有效结束时间
                    effectiveDelayDay:'',//自领取x天开始生效
                    effectiveLastDay:'',//自领取x天内有效
                    depreciateType:1,//优惠券类型
                    condition:'',//满减条件
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
                    needAudit:'1',//是否需要审核 1：需要审核；2：无需审核
                    couponIdList:[],//优惠券礼包id
                    templateId:'',//模板id，用来查询列表
                    bindingNum:'',//绑定数量
                },
                rules: {
                    couponName: [{required: true,message: '优惠券名称不能为空',trigger: 'blur'}],
                    effectiveStartTime:[{required: true,message: '开始日期不能为空',trigger: 'change'}],
                    effectiveEndTime:[{required: true,message: '结束日期不能为空',trigger: 'change'}],
                    effectiveDelayDay:[{required: true,message: '天数111不能为空',trigger: 'blur'}],
                    effectiveLastDay:[{required: true,message: '天数不能为空',trigger: 'blur'}],
                    condition:[{required: true,message: '满额不能为空',trigger: 'blur'}],//满减条件
                    discount:[{required: true,message: '减额不能为空',trigger: 'blur'}],//满减金额
                    rebate:[{required: true,message: '折扣不能为空',trigger: 'blur'}],//折扣
                    rebateAmount:[{required: true,message: '折扣金额不能为空',trigger: 'blur'}],//最大折扣金额
                    orderType:[{required: true,message: '请选择订单类型',trigger: 'change'}],
                    content:[{required: true,message: '模板内容不能为空',trigger: 'blur'}],
                    templateId: [{required: true,message: '模板ID不能为空',trigger: 'blur'}],
                },
                rowData:[
                    {name:'id',text:'模板ID'},
                    {name:'needAuditDesc',text:'审核需求'},
                    {name:'couponName',text:'优惠券名称'},
                    {name:'specialTypeDesc',text:'类型'},
                    {name:'rebateDesc',text:'折扣优惠'},
                    {name:'rebateAmount',text:'最高折扣'},
                    {name:'condition',text:'满额设定'},
                    {name:'discount',text:'减额设定'},
                    {name:'depreciateTypeDesc',text:'优惠券类型'},
                    {name:'effectiveStartTimeDesc',text:'开始时间'},
                    {name:'effectiveEndTimeDesc',text:'截止时间'},
                    {name:'createIdName',text:'添加人'},
                ],  
                subRowData:[
                    {name:'id',text:'模板ID'},
                    {name:'couponName',text:'优惠券名称'},
                    {name:'bindingNum',text:'绑定数量'},
                    {name:'depreciateTypeDesc',text:'优惠券类型'},
                    {name:'rebateDesc',text:'折扣优惠'},
                    {name:'rebateAmount',text:'最高折扣'},
                    {name:'condition',text:'满额设定'},
                    {name:'discount',text:'减额设定'},
                    {name:'orderTypeDesc',text:'订单类型'},
                    {name:'effectiveStartTimeDesc',text:'开始时间'},
                    {name:'effectiveEndTimeDesc',text:'结束时间'},
                ],                   
                tableData: [],
                subTableData:[],
                pickerOptions1:{ //搜索日期
                    disabledDate:(time)=>{
                        return time.getTime() < new Date(this.searchData.effectiveStartTime).getTime()- 8.64e7;
                    }
                },
                pickerOptions2:{ //起始日期——不可选
                    disabledDate:(time)=>{
                    return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                pickerOptions3:{ //结束日期——不可选
                    disabledDate:(time)=>{                        
                        return time.getTime() < new Date(this.dataForm.effectiveStartTime).getTime()- 8.64e7;
                    }
                },
            }
        },
        created() {
            this.initList(1);  
            this.selectList();
        },
        methods: {
            //查询列表
            async initList(val) {
                this.searchData.page = val
                const data = await templateList(this.searchData)
                this.tableData = data.list
                this.totalRecord = data.pageInfo.totalSize
                this.excelUrl = data.url
                this.excelStatus = data.status
            },
            //查询下拉框列表
            async selectList() {
                this.orderTypeList = (await optionsList({dictionaryCodes:["COUPON_TYPE"]}))[0].list
            },
            //下载excel
            handleDownload(){
                window.location.href = this.excelUrl
            },
            //导出excel
            handleExport(){
                templateExport(this.searchData).then(()=>{
                    this.initList(this.searchData.page)
                })
            },
            //添加模板或礼包
            handleAddCommon(type){
                if(type===1){
                    this.dialogVisible1 =true;
                    this.dialogTitle1='添加优惠券模板';
                    this.dataForm.specialType = 1
                }else{
                    this.dialogVisible2=true;
                    this.dialogTitle2='添加优惠券礼包';
                    this.dataForm.specialType = 2
                }
                this.dataForm.updateType = 0    //新增
            },
            //添加到礼包
            handleAdd(){
                this.$refs['dataForm2'].validateField('templateId', errMsg => {
                    if(!errMsg){
                        if(this.subTableData.length>0){
                            let isReaplce = this.subTableData.some(item=> {
                                return item.id === this.dataForm.templateId
                            });
                            if(isReaplce) {
                                return this.$message({message: '此优惠券已在列表中！',type: 'error'});
                            }
                        }
                        templateOne(this.dataForm.templateId).then(result=>{
                            if(result.specialType==2){
                                return this.$message({message: '不能添加优惠券礼包ID！',type: 'error'});
                            }
                            let addTable = {
                                id:'',
                                couponName:'',
                                bindingNum:'',
                                depreciateType:null,
                                rebate:'',
                                rebateAmount:'',
                                condition:'',
                                discount:'',
                                orderTypeDesc:'',
                                effectiveStartTimeDesc:'',
                                effectiveEndTimeDesc:'',
                            }
                            for (let x of Object.keys(addTable)) {
                                addTable[x] = result[x]
                            }
                            addTable.bindingNum = this.dataForm.bindingNum
                            this.subTableData.push(addTable) 
                            this.dataForm.templateId = ''
                        })
                    }
                })
            },
            //重置搜索条件
            handleReset1() {
                this.searchData={
                    templateId: null,
                    couponName: '',//优惠券模板名称
                    orderType:'',//订单类型
                    depreciateType:null,//优惠券类型
                    specialType:null,//类型
                    needAudit:'',//是否审核
                    effectiveStartTime:'',//开始时间
                    effectiveEndTime:'',//结束时间
                    page:this.searchData.page
                }
            },
            //重置礼包添加条件
            handleReset2() {
                this.dataForm.templateId = ''//模板id，用来查询列表
                this.dataForm.bindingNum = ''//绑定数量
                this.dataForm.couponName = ''//礼包名称
                this.dataForm.needAudit = '1'//礼包名称
            },
            //弹窗信息——修改
            handleEdit(row) {
                this.dataForm.updateType = 1
                templateOne(row.id).then(result=>{
                    if(row.specialType==1){
                        this.dialogVisible1 = true
                        this.dialogTitle1 = '修改优惠券模板'
                        this.$nextTick(() => {
                            for (let x of Object.keys(this.dataForm)) {
                                this.dataForm[x] = result[x]
                            }
                        })
                    }else if(row.specialType==2){
                        this.dialogVisible2 = true
                        this.dialogTitle2 = '修改优惠券礼包'
                        this.subTableData = result.listCoupon.map((item,index)=>{
                            item.bindingNum = result.couponIdList[index].number
                            return item
                        })
                        this.$nextTick(() => {
                            for (let x of Object.keys(this.dataForm)) {
                                this.dataForm[x] = result[x]
                            }
                        })
                    }else{
                        this.$message({message: '缺少优惠券类型',type: 'error'});
                    }
                })
            },
            //保存优惠券模板
            onDialogSubmit1() {
                this.$refs.dataForm.validate((valid) => {
                    if (valid) {
                        let isEmpty= this.dataForm.timeInterval.some(item=> {
                            return !item.startTime && !item.endTime
                        });
                        if(isEmpty){
                            return this.$message({message: '请选择有效时分段！',type: 'error'});
                        }
                        if(this.isReaplce()){
                            templateSave(this.dataForm).then(response => {
                                this.$message({type: 'success',message: '保存成功！'});
                                this.dialogVisible1 = false
                                this.initList(this.searchData.page)
                            })
                        }else{
                            return this.$message({type: 'error',message: '存在重复时段'});
                        }
                    } else {  return false; }
                });
            },
            //保存优惠券礼包
            onDialogSubmit2() {
                let params = {
                    couponName:this.dataForm.couponName,
                    needAudit:this.dataForm.needAudit,
                    couponIdList:[],
                    updateType:this.dataForm.updateType,
                    id : this.dataForm.id,
                    specialType:2,//类型
                }
                this.subTableData.forEach(element => {
                    params.couponIdList.push({templateId:element.id,number:element.bindingNum})
                });
                
                this.$refs['dataForm2'].validateField('couponName', errMsg => {
                    if(!errMsg){
                        if(params.couponIdList.length>1){
                            templateSave(params).then(response => {
                                this.$message({type: 'success', message: '保存成功！'});
                                this.dialogVisible2=false
                                this.initList(this.searchData.page)
                            })
                        }else{
                            this.$message({type: 'error',message: '优惠礼包，至少需两条优惠券ID!'});
                        }
                    }
                })
            },
            //删除优惠
            handleRemove(row,index) {
                if(index){
                    //礼包内的删除
                    this.subTableData.splice(index, 1)
                }else{
                    this.$confirm('确定删除此优惠券？', '删除', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        templateDelete(row.id).then(response=>{
                            this.$message({message: '删除成功',type: 'success',duration:1500});
                            this.initList(this.searchData.page)
                        });
                    }).catch(err => { console.log(err) })
                }
            },
            //判断时段
            isReaplce(){
                for (let k in this.dataForm.timeInterval) {
                  if (!this.judege(k)) {
                    return false
                  }
                }
                return true
            },
            judege(idx) {
                let timeInterval = this.dataForm.timeInterval
                  for (let k in timeInterval) {
                    if (idx !== k && timeInterval[idx].startTime && timeInterval[idx].startTime) {
                        if (timeInterval[k].startTime <= timeInterval[idx].startTime && timeInterval[k].endTime > timeInterval[idx].startTime) {
                            return false
                        }
                        if (timeInterval[k].startTime < timeInterval[idx].endTime && timeInterval[k].endTime >= timeInterval[idx].endTime ) {
                            return false
                        }
                    }
                  }
                  return true
            },
            //关闭弹窗
            onDialogClose() {
                if(this.dataForm.specialType===1){
                    this.$refs.dataForm.resetFields()
                }else{
                    this.$refs.dataForm2.resetFields()
                    this.subTableData = []
                }
                this.dataForm = {
                    id:'',
                    couponName: '',  //优惠券名称
                    effectiveType:0,//有效期类型
                    effectiveStartTime: '',//有效开始时间
                    effectiveEndTime:'',//有效结束时间
                    effectiveDelayDay:'',//自领取x天开始生效
                    effectiveLastDay:'',//自领取x天内有效
                    depreciateType:1,//优惠券类型
                    condition:'',//满减条件
                    discount:'',//满减金额
                    orderType:[],//订单类型
                    content:'',//模板内容
                    needAudit:'1',//是否需要审核 1：需要审核；2：无需审核
                    timeInterval:[
                        {startTime:'',endTime:''},
                        {startTime:'',endTime:''},
                        {startTime:'',endTime:''},
                    ],//时段
                    rebate:'',//折扣
                    rebateAmount:'',//最大折扣金额
                    couponIdList:[],//优惠券礼包id
                    specialType:1,//优惠券类型 1模板2礼包
                    
                    templateId:'',//模板id，用来查询列表
                    bindingNum:'',//绑定数量
                }
            },   
            //跳转到指定页
            handleCurrentChange(val) {
                this.initList(val)
            },
        }
    }
</script>
  