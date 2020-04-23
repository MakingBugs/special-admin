<template>
    <el-card class="box-card">
        <div class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" size="small">
            <el-form-item label="服务区域">
                <el-select v-model="searchData.zoneType" placeholder="请选择" @change="DialogChangeRegion">
                <el-option v-for="item in zoneTypeoptions" :key="item.value" :label="item.desc" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务据点" v-show="stat">
                <el-select v-model="searchData.stationId" placeholder="请选择" @change="getcarType">
                <el-option v-for="item in stationoptions" :key="item.value" :label="item.desc" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="车辆类型">
                <el-select v-model="searchData.vehicleId" placeholder="请选择">
                <el-option v-for="item in vehicleoptions" :key="item.value" :label="item.desc" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="initList">查询</el-button>
                <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
            </el-form-item>
            </el-form>
        </div>
        <div class="tools-bar">
            <el-button type="success" icon="el-icon-plus" size="small" @click="dialogVisible = true;dialogTitle='新增优惠设定'">新增</el-button>
        </div>
        <div>
            <el-table :data="tableData" border fit highlight-current-row stripe style="width: 100%">
                <el-table-column prop="zoneTypeDesc" label="服务区域" align="center"></el-table-column>
                <el-table-column prop="stationName" label="服务据点" align="center"></el-table-column>
                <el-table-column prop="vehicleName" label="车辆类型" align="center"></el-table-column>
                <el-table-column prop="discountWayDesc" label="优惠方式" align="center"></el-table-column>
                <el-table-column prop="discountPrice" label="优惠值" align="center"></el-table-column>
                <el-table-column prop="startTime" label="开始时间" align="center" :formatter="formatDate"></el-table-column>
                <el-table-column prop="endTime" label="结束时间" align="center" :formatter="formatDateTO"></el-table-column>
                <el-table-column prop="status" label="禁用/启用" align="center" width="90">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" active-color="#13ce66" :active-value="1" :inactive-value="0" active-text inactive-text @change="handleStatus(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="100">
                    <template slot-scope="scope">
                        <div>
                            <el-button :disabled="new Date(scope.row.endTime).valueOf() < new Date(new Date(new Date().toLocaleDateString()).getTime()).valueOf()" type="primary" size="mini" plain @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <!-- <el-button size="mini" type="danger" plain @click="handleRemove(scope.$index, scope.row)">删除</el-button> -->
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

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="45%" @close="onDialogClose()">
            <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="150px">
                <el-form-item label="服务区域" prop="zoneType">
                    <el-select v-model="dataForm.zoneType" placeholder="请选择" style="width: 80%;" @change="DialogChangeRegion" :disabled="isdisabled">
                        <el-option v-for="item in zoneTypeoptions" :key="item.value" :label="item.desc" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务据点" prop="stationId" v-show="stat">
                    <el-select v-model="dataForm.stationId" clearable placeholder="请选择" style="width: 80%;" :disabled="isdisabled" @change="getcarType">
                        <el-option v-for="item in stationoptions" :value="item.value" :key="item.value" :label="item.desc"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="车辆类型" prop="vehicleId">
                    <el-select v-model="dataForm.vehicleId" clearable placeholder="请选择" style="width: 80%;" :disabled="isdisabled">
                        <el-option v-for="item in vehicleoptions" :value="item.value" :key="item.value" :label="item.desc">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开始时间" prop="startTime">
                    <el-date-picker v-model="dataForm.startTime" type="date" placeholder="选择开始时间" style="width: 80%;" format="yyyy/MM/dd" :picker-options="pickerOptions1"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="endTime">
                    <el-date-picker v-model="dataForm.endTime" type="date" placeholder="选择结束时间" style="width: 80%;" format="yyyy/MM/dd" :picker-options="pickerOptions1"></el-date-picker>
                </el-form-item>
                <el-form-item label="优惠方式" prop="discountWay">
                    <el-radio v-model="dataForm.discountWay" label="1">折扣（%）</el-radio>
                    <el-radio v-model="dataForm.discountWay" label="2">折价（元）</el-radio>
                </el-form-item>
                <el-form-item label="优惠值" prop="discountPrice">
                    <el-input v-model="dataForm.discountPrice" placeholder="请输入优惠值" style="width: 80%;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium" type="primary" @click="onDialogSubmit()" v-if="dialogTitle=='修改优惠设定'">确定</el-button>
                <el-button size="medium" type="primary" @click="onDialogSubmit()" v-else>确定</el-button>
                <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>
<script>
import { optionsList } from '@/api/common'
import DiscountApi from '@/api/discount'
    export default {
        data(){
            return{
                totalRecord: 0,//分页总条数
                pageSize: 10,//页面显示条数
                dialogVisible:false,//弹框的状态
                isdisabled:false,//是否为只读
                stat:false,//显示隐藏据点
                dialogTitle:'新增优惠设定',
                stationoptions:[],//服务据点
                vehicleoptions:[],//车辆类型——弹框
                zoneTypeoptions:[],//服务区域
                zoneType:null,//服务区域——弹框
                repetition:0,
                //查询条件
                searchData: {
                    zoneType: null,//区域
                    stationId: null,//据点
                    vehicleId: null,//车辆类型
                    discountScope:0,//优惠面向对象 0个人 1企业
                    type:3,//单趟
                    page: 1
                },
                tableData:[],//table表格
                //弹框的字段
                dataForm:{
                    discountId:null,
                    zoneType:null,
                    stationId:null,//服务据点
                    vehicleId:null,//车辆类型
                    startTime:'',//开始时间
                    endTime:'',//结束时间
                    discountWay:null,//优惠方式
                    discountPrice:null,//优惠值
                    //status:'',
                    type:3,//单趟
                },
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
                    vehicleId:[{
                        required: true,
                        message: '请选择车辆类型',
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
            } 
        },
        created(){
            this.initList();
            this.selectList();
        },
        methods:{
            //查询列表
            async initList(){
                this.searchData.type=3;
                await DiscountApi.discountList(this.searchData).then(res=>{
                    res.list.map(i=>{
                        if(i.discountWay==1){
                            i.discountPrice=i.discountPrice+'（%）'
                        }else if(i.discountWay==2){
                            i.discountPrice=i.discountPrice+'（元）'
                        }
                    })
                    this.tableData = res.list;
                    this.totalRecord = res.pageInfo.totalSize;
                }).catch(err=>{console.log(err)})
            },
            //查询下拉框列表
            async selectList(){
                //据点
                await optionsList({dictionaryCodes:["STATION"],region:1}).then(res=>{
                    this.stationoptions=res[0].list
                }).catch(err=>{console.log(err)});
                //大区（大陆、台湾）
                await optionsList({dictionaryCodes:["REGION"]}).then(res=>{
                    this.zoneTypeoptions = res[0].list;//服务区域
                }).catch(err=>{console.log(err)});
            },
            //重置
            handleReset(){
                this.zoneType=null;
                this.searchData = {
                    zoneType: '',//区域
                    stationId: '',//据点
                    vehicleId: '',//车辆类型
                    page: 1
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
            //修改赋值
            async handleEdit(index, row) {
                this.dialogVisible = true;
                this.isdisabled = true;
                this.dialogTitle = '修改优惠设定';
                if(row.zoneType==1){
                    this.stat=true;
                    await this.getcarType(row.stationId);
                }else{
                    this.stat=false;
                    await this.getCar();
                }
                this.$nextTick(() => {
                    if(row.discountWay==1){//优惠方式
                        this.dataForm.discountWay='1';
                    }else if(row.discountWay==2){
                        this.dataForm.discountWay='2';
                    }
                    this.dataForm.discountId=row.discountId;
                    this.dataForm.zoneType=row.zoneType;
                    this.dataForm.stationId=row.stationId;//据点
                    this.dataForm.vehicleId=row.vehicleId;//车辆类型
                    this.dataForm.startTime=row.startTime;//开始时间
                    this.dataForm.endTime=row.endTime;//结束时间
                    this.dataForm.discountPrice=row.discountPrice.split('（')[0];//优惠值
                    //this.dataForm.status=row.status;//禁用状态
                })
            },
            //保存
            onDialogSubmit() {
                if(this.dataForm.stationId==null){
                    this.dataForm.stationId=0;
                }
                this.$refs.dataForm.validate(valid => {
                    if (valid) {
                        this.repetition=0;
                        if (new Date(this.dataForm.startTime).valueOf() > new Date(this.dataForm.endTime).valueOf()) {
                            this.$message({
                                type: 'warning',
                                message: '结束时间要大于或等于开始时间'
                            })
                        }else{
                            //判断是否重复新增优惠设定
                            this.tableData.map(i=>{
                                if(this.dataForm.discountId==i.discountId){

                                }else{
                                    if((this.dataForm.zoneType==i.zoneType&&this.dataForm.stationId==i.stationId&&this.dataForm.vehicleId==i.vehicleId)&&
                                    (new Date(new Date(this.dataForm.endTime).toLocaleDateString())<=new Date(new Date(i.endTime).toLocaleDateString())&&
                                    new Date(new Date(this.dataForm.endTime).toLocaleDateString())>=new Date(new Date(i.startTime).toLocaleDateString())||
                                    new Date(new Date(this.dataForm.startTime).toLocaleDateString())<=new Date(new Date(i.endTime).toLocaleDateString())&&
                                    new Date(new Date(this.dataForm.startTime).toLocaleDateString())>=new Date(new Date(i.startTime).toLocaleDateString()))){
                                        this.$message({
                                            type:'warning',
                                            message:'该时间内有优惠设定'
                                        })
                                        this.repetition=1;
                                        return false;
                                    }
                                }
                            })
                            if(this.repetition==1){

                            }else{
                                if(this.dataForm.discountWay=='1'){//优惠方式
                                    this.dataForm.discountWay=1;
                                }else if(this.dataForm.discountWay=='2'){
                                    this.dataForm.discountWay=2;
                                }
                                if(this.dataForm.stationId==0){
                                    this.dataForm.stationId=null;
                                }
                                DiscountApi.discountSave(this.dataForm).then(response => {
                                    this.$message({
                                        type: 'success',
                                        message: '保存成功！'
                                    })
                                    this.dialogVisible = false
                                    this.initList()
                                }).catch(err=>{console.log(err)})
                            }
                        }
                    } else {
                        return false
                    }
                })
            },
            //删除
            handleRemove(index, row) {
                this.$confirm('确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    DiscountApi.discountDelete({ids:[row.discountId]}).then(response=>{
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                            duration:1500,
                        });
                        this.initList()
                    });
                }).catch(err => { console.log(err) })
            },
            //服务区域改变
            DialogChangeRegion(callback){
                if(callback==1){
                    this.stat=true;//显示服务据点
                    this.dataForm.stationId=null;
                    this.searchData.stationId=null;//查询的据点
                    this.searchData.vehicleId=null;//查询的车辆类型
                }else{
                    this.stat=false;
                    this.dataForm.stationId=0;
                    this.searchData.stationId=null;//查询的据点
                    this.searchData.vehicleId=null;//查询的车辆类型
                    this.getCar();
                }
            },
            //根据服务据点查出车辆类型
            async getcarType(id){
                this.dataForm.vehicleId=null;
                this.searchData.vehicleId=null;
                if(id==''||id==null){
                    id=0;
                }
                await DiscountApi.discountGet(id).then(res=>{
                    var a=res.map(i=>{
                        return{
                            value:i.vehicleId,
                            desc:i.vehicleName
                        }
                    })
                    this.vehicleoptions=a;
                }).catch(err=>{console.log(err)})
            },
            //获取全部车辆类型
            async getCar(){
                this.vehicleoptions=[];
                this.dataForm.vehicleId=null;
                //车辆类型
                await optionsList({dictionaryCodes:["VEHICLE_CLASS"],region:2}).then(res=>{
                    this.vehicleoptions = res[0].list;//车辆类型————弹框
                }).catch(err=>{console.log(err)});
            },
            //跳转到指定页
            handleCurrentChange(val) {
                this.searchData.page = val
                this.initList()
            },
            //关闭弹窗
            onDialogClose() {
                this.isdisabled = false;
                this.stat=true;//显示据点
                this.zoneType=null;//区域
                this.dataForm.discountId=null;//id
                this.dataForm.stationId = null;//据点
                this.dataForm.vehicleId=null;//车辆类型
                this.vehicleoptions=[];//清空车辆类型
                this.searchData.stationId=null;//服务据点————查询
                this.searchData.zoneType=null;//服务区域————查询
                this.$refs.dataForm.resetFields();
            }, 
            //开始时间格式转换
            formatDate(row) {
                return new Date(row.startTime).toLocaleDateString();
            },
            //结束时间格式转换
            formatDateTO(row){
                return new Date(row.endTime).toLocaleDateString();
            }
        }
    }
</script>