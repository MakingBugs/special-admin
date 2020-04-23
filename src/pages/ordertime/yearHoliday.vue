<template>
    <el-card class="box-card">
        <div class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" size="small">
            <el-form-item label="年度">
                <el-select v-model="searchData.year" placeholder="请选择" @change="initList">
                    <el-option v-for="item in yearoptions" :key="item.value" :label="item.desc" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            </el-form>
        </div>
        <div class="tools-bar">
            <el-button type="success" icon="el-icon-plus" size="small" @click="addDomain();dialogVisibleyear = true;dialogTitleyear='新增全年度假日'">新增全年度假日</el-button>
            <el-button type="success" icon="el-icon-plus" size="small" @click="dialogVisibleday = true;dialogTitleday='新增假日'">新增假日</el-button>
        </div>
        <div>
            <el-table :data="tableData" border fit highlight-current-row stripe style="width: 100%">
                <el-table-column prop="date" label="日期" align="center"></el-table-column>
                <el-table-column prop="week" label="星期" align="center"></el-table-column>
                <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                <el-table-column
                    prop="status"
                    label="禁用/启用"
                    align="center"
                    >
                    <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.status"
                        active-color="#13ce66"
                        :active-value="1"
                        :inactive-value="0"
                        active-text=""
                        inactive-text=""
                        @change="handleStatus(scope.row)">
                    </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="150">
                    <template slot-scope="scope">
                        <div>
                            <el-button size="mini" type="danger" plain @click="handleRemove(scope.$index, scope.row)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog :title="dialogTitleyear" :visible.sync="dialogVisibleyear" width="65%" @close="onDialogCloseyear()">
            <el-form ref="yeardataForm" :rules="rulesyear" :model="yeardataForm" label-width="70px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="年度" prop="year">
                            <el-input v-model="yeardataForm.year" placeholder="请输入年度"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button size="medium" type="primary" @click="produceYearHoliday()">产生年度假日</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-for="(item,index) in yeardataForm.items" :key="index">
                    <el-col :span="6">
                        <el-form-item :label="'日期'" :prop="'items.'+index+'.date'" :rules="[{required: true, message: '请填写日期！'}]">
                            <el-date-picker 
                                v-model="item.date" 
                                type="date" 
                                placeholder="选择日期" 
                                style="width:100%"
                                value-format="yyyy/MM/dd"
                                :picker-options="pickerOptions"
                                @change="getWeeks">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label="'星期'" :prop="'items.'+index+'.week'">
                            <el-input v-model="item.week" style="width:100%;" readonly></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label="'备注'" :prop="'items.'+index+'.remark'">
                            <el-input v-model="item.remark" style="width:100%;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-button icon="el-icon-minus" style="margin-left: 16px" type="danger" @click.prevent="removeDomain(index)">删除</el-button>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="el-icon-plus" type="success" @click="addDomain" style="float:left">新增</el-button>
                <el-button size="medium" type="primary" @click="onDialogSubmityear()">确定</el-button>
                <el-button size="medium" @click="dialogVisibleyear = false">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="dialogTitleday" :visible.sync="dialogVisibleday" width="45%" @close="onDialogCloseday()">
            <el-form ref="daydataForm" :rules="rulesday" :model="daydataForm" label-width="100px">
                <el-form-item label="日期" prop="date">
                    <el-date-picker 
                        v-model="daydataForm.date" 
                        type="date" 
                        placeholder="选择日期" 
                        style="width:100%" 
                        value-format="yyyy/MM/dd"
                        :picker-options="pickerOptions"
                        @change="getWeek">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="星期" prop="week">
                    <el-input v-model="daydataForm.week" placeholder="请输入星期" readonly></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="daydataForm.remark" placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium" type="primary" @click="onDialogSubmitday()">确定</el-button>
                <el-button size="medium" @click="dialogVisibleday = false">取 消</el-button>
            </div>
        </el-dialog>

    </el-card>
</template>
<script>
import { optionsList } from '@/api/common'
import { yearHolidayList,yearHolidaySave,yearHolidayCreate,yearHolidayDelete } from '@/api/ordertime'
import Fun from '../../../public/function'
    export default {
        data(){
            return{
                dialogVisibleyear:false,//弹框的状态——全年度假日
                dialogVisibleday:false,//弹框的状态——假日
                dialogTitleyear:'新增全年度假日',
                dialogTitleday:'新增假日',
                yearoptions:[],//年度
                tableData:[],
                searchData: {//查询条件
                    year: null,//年度
                },
                yeardataForm:{//弹框的字段——全年假日
                    seqId:null,
                    year:null,//年度
                    items:[],//明细
                },
                daydataForm:{//弹框的字段——假日
                    //seqId:null,
                    date:'',//日期
                    week:'',//星期
                    remark:'',//备注
                    status:1
                },
                pickerOptions:{ //只能选择今天和今天之后的日期
                  disabledDate:(time)=>{
                    return time.getTime() < Date.now() - 8.64e7;
                  }
                },
                rulesyear:{//验证——全年假日
                    year:[{
                        required: true,
                        message: '请输入年度',
                        trigger: 'blur'
                    },{
                        pattern: /^[+]{0,1}(\d+)$/, 
                        message: '必须为正整数',
                        trigger: 'blur'
                    }]
                },
                rulesday:{//验证——假日
                    date:[{
                        required: true,
                        message: '请输入日期',
                        trigger: 'blur'
                    }]
                },
            } 
        },
        async created(){
            await this.getNewYear();
            await this.initList();
        },
        methods:{
            getNewYear(){
                //获取当前年份的后二十年
                var newYear=new Date().getFullYear();
                for (var i=newYear; i <= newYear + 20; i++) {
                    this.yearoptions.push({
                        value:i,
                        desc:i
                    })
                }
                this.searchData.year=newYear;//默认为今年
            },
            getWeek(date){
                //根据日期获取星期几
                var weekDay = ["日", "一", "二", "三", "四", "五", "六"];
                if(new Date(date).getTime()==0){
                    this.daydataForm.week='';
                }else{
                    var myDate = new Date(Date.parse(date)); 
                    this.daydataForm.week=weekDay[myDate.getDay()];
                }
            },
            getWeeks(){
                var weekDay = ["日", "一", "二", "三", "四", "五", "六"];
                this.yeardataForm.items.map(res=>{
                    if(new Date(res.date).getTime()==0){
                        res.week='';
                    }else{
                        var myDate = new Date(Date.parse(new Date(res.date).toLocaleDateString()));
                        res.week=weekDay[myDate.getDay()];
                    }
                })
            },
            //查询列表
            async initList(){
                await yearHolidayList({year:this.searchData.year}).then(res=>{
                    this.tableData = res;
                }).catch(err=>{console.log(err)})
            },
            //产生年度假日
            produceYearHoliday(){
                if(this.yeardataForm.year==''||this.yeardataForm.year==null){
                    this.$message({
                        type: 'warning',
                        message: '请填写年度'
                    })
                }else{
                    //需判断已存在的是否有输入的年度资料，有的话显示警告信息 ，不可新增此年度资料
                    yearHolidayCreate({year:this.yeardataForm.year}).then(res=>{
                        if(res!=null){
                            this.yeardataForm.items=res;
                        }
                    })
                }
                
            },
            //保存——全年假日
            onDialogSubmityear() {
                this.$refs.yeardataForm.validate(valid => {
                    if (valid) {
                        var exist=this.tableData.some(i=>{
                            var a=this.yeardataForm.items.map(x=>{
                                return x.date;
                            })
                            return a==i.date;
                        })
                        if(exist){
                            this.$message({
                                type: 'warning',
                                message: '假日不可重复设置！'
                            })
                        }else{
                            yearHolidaySave(this.yeardataForm.items).then(response => {
                                this.$message({
                                    type: 'success',
                                    message: '保存成功！'
                                })
                                this.dialogVisibleyear = false;
                                this.initList()
                            }).catch(err=>{console.log(err)})
                        }
                    } else {
                        return false
                    }
                })
            },
            //保存——假日
            onDialogSubmitday() {
                var newDay=[];
                this.$refs.daydataForm.validate(valid => {
                    if (valid) {
                        var exist=this.tableData.some(i=>{
                            return this.daydataForm.date==i.date;
                        })
                        if(exist){
                            this.$message({
                                type: 'warning',
                                message: '假日不可重复设置！'
                            })
                        }else{
                            var a = Fun.DeepClone(this.daydataForm);
                            newDay.push(a);
                            yearHolidaySave(newDay).then(response => {
                                this.$message({
                                    type: 'success',
                                    message: '保存成功！'
                                })
                                this.dialogVisibleday = false;
                                this.initList()
                            }).catch(err=>{console.log(err)})
                        }   
                    } else {
                        return false
                    }
                })
            },
            //禁启用 0:禁用，1：启用
            handleStatus(row) {
                const tip = row.status == 1 ? '启用成功' : '禁用成功'
                const type = row.status == 1 ? 'success' : 'info'
                const status = row.status === 1 ? 1 : 0
                yearHolidaySave([{ seqId:row.seqId,status:status }]).then(
                    response => {
                        this.$message({
                            message: tip,
                            type: type,
                            duration: 1000
                        })
                    }
                ).catch(err=>{console.log(err)})
            },
            //删除
            handleRemove(index, row) {
                this.$confirm('确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                yearHolidayDelete(row.seqId).then(response=>{
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        duration:1500,
                    });
                    this.initList()
                });
                }).catch(err => { console.log(err) })
            },
            //跳转到指定页
            handleCurrentChange(val) {
                this.searchData.page = val
                this.initList()
            },
            //关闭弹窗——全年假日
            onDialogCloseyear() {
                this.yeardataForm={
                    seqId:null,
                    year:null,//年度
                    items: [],//明细
                }
                this.$refs.yeardataForm.resetFields();
            }, 
            //关闭弹窗——假日
            onDialogCloseday() {
                this.daydataForm.Id=null;
                this.daydataForm.date='';//日期
                this.daydataForm.week='';//星期
                this.daydataForm.remark='';//备注
                this.$refs.daydataForm.resetFields();
            },
            //动态添加表单
            addDomain(){
                if(this.yeardataForm.items.length>=365){
                    this.$message({
                        message: '最多只能添加365个假日！',
                        type: 'info',
                        duration:1000,
                    });
                    return
                }
                this.yeardataForm.items.push({
                    date:'',
                    week:'',
                    remark:'',
                })
            },
            //动态删除表单
            removeDomain(index){
                if(this.yeardataForm.items.length<=1){
                    this.$message({
                        message: '至少要添加1个节假日！',
                        type: 'info',
                        duration:1000,
                    });
                }else{
                    this.yeardataForm.items.splice(index, 1)
                }
            }, 
        }
    }
</script>