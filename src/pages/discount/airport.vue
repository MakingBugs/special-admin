<template>
    <el-card class="box-card">
        <div class="search-bar">
            <el-form :inline="true" :model="searchForm" ref="searchForm" size="small">
                <el-form-item label="服务区域" prop="zoneType">
                    <el-select v-model="searchForm.zoneType" clearable placeholder="请选择" @change="zoneTypeSearchChange">
                        <el-option
                        v-for="item in zoneTypedata"
                        :key="item.value"
                        :label="item.desc"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务据点" prop="stationId"  v-if="searchForm.zoneType===1">
                    <el-select v-model="searchForm.stationId" clearable placeholder="请选择" @change="stationSearchChange">
                        <el-option
                        v-for="item in stationoptions"
                        :key="item.value"
                        :label="item.desc"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订单类型">
                    <el-select v-model="searchForm.orderType" clearable placeholder="请选择">
                        <el-option v-for="item in orderTypeoptions" :key="item.value" :label="item.desc" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务机场">
                    <el-select v-model="searchForm.airportId" clearable placeholder="请选择">
                        <el-option v-for="item in airportOptions" :key="item.airportId" :label="item.airportName" :value="item.airportId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="initList()">查询</el-button>
                <el-button type="warning" plain icon="el-icon-brush" @click="handleReset()">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div  class="tools-bar">
            <el-button type="success" icon="el-icon-plus" size="small" @click="dialogVisible = true;dialogTitle='新增优惠设定';disabled=false;AddOrUpdate=1">新增</el-button>
        </div>
        <!-- table表格 -->
        <div>
            <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
                <el-table-column v-for="item in rowData" :key="item.name" :prop="item.name" :label="item.text" align="center"></el-table-column>
                <el-table-column prop="startTime" label="开始时间" align="center" :formatter="formatDate"></el-table-column>
                <el-table-column prop="endTime" label="结束时间" align="center" :formatter="formatDateTO"></el-table-column>
                <el-table-column prop="status" label="禁用/启用" align="center">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" active-color="#13ce66" :active-value="1" :inactive-value="2" active-text inactive-text @change="handleStatus(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <div>
                            <el-button type="primary" size="mini" :disabled="new Date(scope.row.endTime).valueOf() < new Date(new Date(new Date().toLocaleDateString()).getTime()).valueOf()" plain @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
        </div>
        <!--添加-->
    
        <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="45%"
        @closed="onDialogClose">
            <el-form ref="airportForm" :rules="rules" :model="airportForm" label-width="150px">
            <el-form-item label="服务区域" prop="zoneType">
                <el-select v-model="airportForm.zoneType" :disabled="disabled" clearable placeholder="请选择" style="width: 80%" @change="zoneTypeChange"> 
                <el-option
                    v-for="item in zoneTypedata"
                    :key="item.value"
                    :label="item.desc"
                    :value="item.value">
                </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务据点" prop="stationId" v-if="airportForm.zoneType===1">
                <el-select v-model="airportForm.stationId" :disabled="disabled" clearable placeholder="请选择" style="width: 80%" @change="stationChange">
                <el-option
                    v-for="item in stationoptions"
                    :key="item.value"
                    :label="item.desc"
                    :value="item.value">
                </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="订单类型" prop="orderType">
                <el-select v-model="airportForm.orderType" :disabled="disabled" clearable placeholder="请选择" style="width: 80%">
                    <el-option v-for="item in orderTypeoptions" :key="item.value" :label="item.desc" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务机场" prop="airportId">
                <el-select v-model="airportForm.airportId" :disabled="disabled" clearable placeholder="请选择" style="width: 80%">
                    <el-option v-for="item in airportOptions" :key="item.airportId" :label="item.airportName" :value="item.airportId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="车辆类型" prop="vehicleId">
                <el-select v-model="airportForm.vehicleId" :disabled="disabled" clearable placeholder="请选择" style="width: 80%">
                <el-option
                    v-for="item in vehicledata"
                    :key="item.value"
                    :label="item.desc"
                    :value="item.value">
                </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开始时间" prop="startTime">
                <el-date-picker
                v-model="airportForm.startTime"
                type="date" placeholder="选择开始时间" style="width: 80%;" format="yyyy/MM/dd"
                :picker-options="pickerOptions1">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
                <el-date-picker
                v-model="airportForm.endTime"
                type="date" placeholder="选择开始时间" style="width: 80%;" format="yyyy/MM/dd"
                :picker-options="pickerOptions1">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="优惠方式" prop="discountWay">
                <el-radio v-model="airportForm.discountWay" label="1" style="width: 35%;margin-left:10%">折扣(%)</el-radio>
                <el-radio v-model="airportForm.discountWay" label="2" style="width: 35%">折价(元)</el-radio>
            </el-form-item>
            <el-form-item label="优惠值" prop="discountPrice">
                <el-input v-model="airportForm.discountPrice" placeholder="请输入优惠值" style="width: 80%;"></el-input>
            </el-form-item>
            <el-form-item prop="foldUp">
                <el-checkbox v-model="foldUp">折上折</el-checkbox>
            </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button v-if="dialogTitle=='修改优惠设定'" type="primary" @click="Update()">确 定</el-button>
            <el-button v-else type="primary" @click="Add()">确 定</el-button>
            <el-button @click="dialogVisible=false">取 消</el-button>
            </span>
        </el-dialog>
    </el-card>
</template>
<script>
import {optionsList} from '@/api/common'
import DiscountApi from '../../api/discount'
import Fun from '../../../public/function'
export default {
    data() {
        return {
            disabled:false,
            dialogVisible: false,
            dialogTitle: '新增优惠设定',
            totalRecord: 0,//分页总条数
            pageSize: 10,//页面显示条数
            tableData: [],
            foldUp: false,
            searchForm: {
                type:5,
                discountScope:0,//面向个人
                zoneType: '',//区域
                stationId: '',//据点
                orderType: '',//订单类型
                airportId: '',//服务机场
                page: 1
            },            
            //列表字段
            rowData: [
                { name: 'zoneTypeDesc', text: '服务区域' },
                { name: 'stationName', text: '服务据点' },
                { name: 'orderTypeDesc', text: '订单类型' },
                { name: 'airportName', text: '服务机场' },
                { name: 'vehicleName', text: '车辆类型' },
                { name: 'discountWayDesc', text: '优惠方式' },
                { name: 'discountPrice', text: '优惠值' },
                { name: 'foldUpDesc', text: '折上折' },
            ],
            airportForm:{//对话框表单
                type:5,//表单类型-指定机场
                discountId:null,//Id
                zoneType:null,//服务区域
                stationId:null,//据点
                orderType:null,//订单类型
                vehicleId:null,//车辆类型
                airportId:null,//服务机场
                startTime:null,//开始时间
                endTime:null,//结束时间
                discountWay:null,//优惠类型
                discountPrice:null,//优惠值
                foldUp:null,//折上折
            },
            stationoptions:[],//服务据点
            orderTypeoptions:[],//订单类型
            airportOptions:[],//服务机场
            zoneTypedata:[],//地区列表
            vehicledata:[],//车辆类型列表
            //验证
            rules:{
                zoneType:[{
                    required: true,
                    message: '请选择服务区域',
                    trigger: 'change'
                }],
                stationId:[{
                    required: true,
                    message: '请选择服务据点',
                    trigger: 'change'
                }],
                orderType:[{
                    required: true,
                    message: '请选择订单类型',
                    trigger: 'change'
                }],
                vehicleId:[{
                    required: true,
                    message: '请选择车辆类型',
                    trigger: 'change'
                }],
                airportId:[{
                    required: true,
                    message: '请选择服务机场',
                    trigger: 'change'
                }],
                startTime:[{
                    required: true,
                    message: '请选择开始时间',
                    trigger: 'date'
                }],
                endTime:[{
                    required: true,
                    message: '请选择结束时间',
                    trigger: 'date'
                }],
                discountWay:[{
                    required: true,
                    message: '请选择优惠方式',
                    trigger: 'radio'
                }],
                discountPrice:[{
                    required: true,
                    message: '请输入优惠值',
                    trigger: 'blur'
                },{
                    pattern:/^[0-9]\d{0,2}?$/,
                    message: '只能输入整数，最大值为999',
                    trigger: 'blur'
                }]
            },
            //今天之前的日期禁用
            pickerOptions1: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                },
            }
        };
    },
    created() {
      this.initList();
      this.selectList();
    },
    methods: {
        //查询列表
        async initList() {
            const data = await DiscountApi.discountList(this.searchForm)
            data.list.map(i=>{
                if(i.discountWay==1){
                    i.discountPrice=i.discountPrice+'（%）'
                }else if(i.discountWay==2){
                    i.discountPrice=i.discountPrice+'（元）'
                }
            })
            this.tableData = data.list
            this.totalRecord = data.pageInfo.totalSize
        },
        async selectList() {
          const data1 = await optionsList({dictionaryCodes:["STATION"],region:1})//据点
          const data2 = await optionsList({dictionaryCodes:["DISCOUNT_ORDER_TYPE"]})//服务类型
          const data3 = await optionsList({dictionaryCodes:["REGION"]})//大区
          const data4 = await DiscountApi.discountAirport({zoneType:2})//服务机场
          const date5 = await optionsList({dictionaryCodes:["VEHICLE_CLASS"],region:2})//车辆类型
          if(data1.length>0){
            this.stationoptions = data1[0].list
          }
          if(data2.length>0){
            this.orderTypeoptions = data2[0].list
          }
          if(data3.length>0){
            this.zoneTypedata = data3[0].list
          }
          if(data4.length>0){
            this.airportOptions = data4
          }
          if(date5.length>0){
            this.vehicledata = date5[0].list
          }
        },
        handleReset(){
            this.searchForm = {
                type:5,
                zoneType: '',//区域
                stationId: '',//据点
                orderType: '',//订单类型
                airportId: '',//服务机场
                page: 1
            }
        },
        //跳转到指定页
        handleCurrentChange(val) {
            this.searchForm.page = val
            this.initList()
        },
        zoneTypeSearchChange(){
            this.searchForm.stationId=null;
            this.searchForm.airportId=null;
            if(this.searchForm.zoneType===2){
                this.getCar();
            }
        },
        async stationSearchChange(id) {
            this.searchForm.airportId=null;
            if(this.searchForm.zoneType===1 && (!!id)){
                await this.getCarType(id)
            }else{
                await this.getCar()
            }
        },
        zoneTypeChange(){
            this.airportForm.stationId=null;
            this.airportForm.airportId=null;
            this.airportForm.vehicleId=null;
            if(this.airportForm.zoneType===2){
                this.getCar();
            }
        },
        //获取全部车辆类型
        async getCar(){
            const data4 = await DiscountApi.discountAirport({zoneType:2})//服务机场
            const date5 = await optionsList({dictionaryCodes:["VEHICLE_CLASS"],region:2})//车辆类型
            if(data4.length>0){
                this.airportOptions = data4
            }
            if(date5.length>0){
                this.vehicledata = date5[0].list
            }
        },
        async getCarType(id){
            if(id==''||id==null){
                id=0;
            }
            const data = await DiscountApi.discountGet(id);
            var a=data.map(i=>{
                return{
                    value:i.vehicleId,
                    desc:i.vehicleName
                }
            })
            this.vehicledata=a;
            const data4 = await DiscountApi.discountAirport({zoneType:1,stationId:id})//服务机场
            if(data4.length>0){
                this.airportOptions = data4
            }
        },
        async stationChange(id) {
            this.airportForm.airportId=null;
            this.airportForm.vehicleId=null;
            if(this.airportForm.zoneType===1 && (!!id)){
                await this.getCarType(id)
            }else{
                await this.getCar()
            }
        },
        //禁启用 0:禁用，1：启用
        handleStatus(row) {
            const tip = row.status == 1 ? '启用成功' : '禁用成功'
            const type = row.status == 1 ? 'success' : 'info'
            const status = row.status === 1 ? 1 : 0
            DiscountApi.discountStatus({ discountId:row.discountId,status:status }).then(
                response => {
                    this.$message({
                        message: tip,
                        type: type,
                        duration: 1000
                    })
                }
            ).catch(err=>{console.log(err)})
        },
        //关闭弹窗
        onDialogClose() {
            this.disabled = false;
            this.vehicledata=[];//清空车辆类型
            this.$refs.airportForm.resetFields();
            this.foldUp=false;
        },
        //修改赋值
        async handleEdit(index, row) {
            this.dialogVisible = true;
            this.disabled = true;
            this.dialogTitle = '修改优惠设定';
            if(row.zoneType===1){
                await this.getCarType(row.stationId);
            }else{
                await this.getCar();
            }
            this.$nextTick(() => {
                if(row.discountWay==1){//优惠方式
                    this.airportForm.discountWay='1';
                }else if(row.discountWay==2){
                    this.airportForm.discountWay='2';
                }
                this.airportForm.discountId=row.discountId;
                this.airportForm.zoneType=row.zoneType;
                this.airportForm.stationId=row.stationId;//据点
                this.airportForm.vehicleId=row.vehicleId;//车辆类型
                this.airportForm.startTime=row.startTime;//开始时间
                this.airportForm.endTime=row.endTime;//结束时间
                this.airportForm.discountPrice=row.discountPrice.split('（')[0];//优惠值
                this.airportForm.orderType=row.orderType;
                this.airportForm.airportId=row.airportId;
                this.foldUp=(row.foldUp===1);
            })
        },
        //开始时间格式转换
        formatDate(row) {
            return new Date(row.startTime).toLocaleDateString();
        },
        //结束时间格式转换
        formatDateTO(row){
            return new Date(row.endTime).toLocaleDateString();
        },
        //---------------------------------------------------------------
        //确认添加
        Add(){
            this.$refs.airportForm.validate(async (valid)=>{
                if(valid){
                    if (new Date(this.airportForm.startTime).valueOf() > new Date(this.airportForm.endTime).valueOf()) {
                        this.$message({
                            type: 'warning',
                            message: '结束时间要大于或等于开始时间'
                        })
                    }else{
                        this.airportForm.foldUp=this.foldUp?1:0;
                        var data=Fun.DeepClone(this.airportForm)
                        DiscountApi.discountSave(data).then(res=>{
                        this.$message({
                            message: '添加成功！',
                            type: 'success',
                            duration:1000,
                        })
                        this.initList()
                        this.dialogVisible = false//关闭对话框
                        }).catch(err=>{console.log(err)})
                    }
                }
                else{
                    return
                }
            })
        },
        //确认修改
        Update(){
            this.$refs.airportForm.validate(async (valid)=>{
                if(valid){
                    if (new Date(this.airportForm.startTime).valueOf() > new Date(this.airportForm.endTime).valueOf()) {
                        this.$message({
                            type: 'warning',
                            message: '结束时间要大于或等于开始时间'
                        })
                    }else{
                        this.airportForm.foldUp=this.foldUp?1:0;
                        var data=Fun.DeepClone(this.airportForm)
                        DiscountApi.discountSave(data).then(res=>{
                            this.$message({
                            message: '修改成功！',
                            type: 'success',
                            duration:1000,
                            })
                            this.initList()
                            this.dialogVisible = false//关闭对话框
                        }).catch(err=>{console.log(err)})
                    }
                }else{
                    return
                }
            })
        },
    }
}
</script>
<style scoped>

</style>