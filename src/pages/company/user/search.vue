<template>
    <el-card class="box-card">
        <div class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" size="small">
            <el-form-item label="用户名称">
                <el-input v-model="searchData.userName" placeholder="用户名称" style="width:160px;"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="searchData.userPhone" placeholder="手机号" style="width:160px;"></el-input>
            </el-form-item>
            <el-form-item label="所属企业">
                <el-input v-model="searchData.companyName" placeholder="所属企业" style="width:160px;"></el-input>
            </el-form-item>
            <el-form-item label="支付方式">
                <el-select v-model="searchData.payWays" placeholder="请选择">
                <el-option v-for="item in payWaysoptions" :key="item.value" :label="item.desc" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="initList()">查询</el-button>
                <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
            </el-form-item>
            </el-form>
        </div>
        <div class="tools-bar">
            <el-button type="success" icon="el-icon-plus" size="small" @click="dialogVisible = true;dialogTitle='新增用户基本信息'">新增</el-button>
        </div>
        <div>
            <el-table :data="tableData" border fit highlight-current-row stripe style="width: 100%">
                <el-table-column prop="userName" label="用户名称" align="center"></el-table-column>
                <el-table-column prop="nickName" label="用户昵称" align="center"></el-table-column>
                <el-table-column prop="userPhone" label="手机号" align="center"></el-table-column>
                <el-table-column prop="companyName" label="所属企业" align="center"></el-table-column>
                <el-table-column prop="payWayDesc" label="支付方式" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="150">
                    <template slot-scope="scope">
                        <div>
                            <el-button type="primary" size="mini" plain @click="handleEdit(scope.$index, scope.row, 0)">修改</el-button>
                            <el-button size="mini" type="warning" plain @click="handleEdit(scope.$index, scope.row, 1)">详情</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-bar">
                <el-pagination
                    @current-change="initList"
                    layout="total, prev, pager, next, jumper"
                    :total="totalRecord"
                    background
                    >
                </el-pagination>
            </div>
        </div>

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="45%" @close="onDialogClose()">
            <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="150px">
                <el-form-item label="用户名称" prop="userName">
                    <el-input v-model="dataForm.userName" placeholder="请输入用户名称" :disabled="Isdisabled"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称" prop="nickName">
                    <el-input v-model="dataForm.nickName" placeholder="请输入用户昵称" :disabled="Isdisabled"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="userPhone">
                    <el-input v-model="dataForm.userPhone" placeholder="请输入手机号" :disabled="Isdisabled"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-radio-group v-model="dataForm.gender" :disabled="Isdisabled">
                        <el-radio :label=1>男</el-radio>
                        <el-radio :label=0>女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="生日" prop="birthday">
                    <el-date-picker v-model="dataForm.birthday" type="date" placeholder="选择日期" style="width:100%" :disabled="Isdisabled"></el-date-picker>
                </el-form-item>
                <el-form-item label="Email" prop="email">
                    <el-input v-model="dataForm.email" placeholder="请输入Email" :disabled="Isdisabled"></el-input>
                </el-form-item>
                <el-form-item label="微信" prop="weChat">
                    <el-input v-model="dataForm.weChat" placeholder="请输入微信" :disabled="Isdisabled"></el-input>
                </el-form-item>
                <el-form-item label="所属企业" prop="companyId">
                    <el-select v-model="dataForm.companyId" clearable placeholder="请选择" style="width:100%" :disabled="Isdisabled" @change="getPayWays">
                        <el-option v-for="item in companyoptions" :key="item.companyId" :label="item.companyName" :value="item.companyId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="支付方式" prop="payWays">
                    <el-checkbox-group v-model="dataForm.payWays" :disabled="Isdisabled">
                        <el-checkbox v-for="item in payWaysData" :label="item.payWay" :key="item.payWay">{{item.desc}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="用户地址" prop="address">
                    <el-input v-model="dataForm.address" placeholder="请输入用户地址" :disabled="Isdisabled"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input  type="textarea" v-model="dataForm.remark" placeholder="请输入备注" :disabled="Isdisabled"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium" type="primary" @click="onDialogSubmit()" v-if="dialogTitle=='修改用户基本信息'">确定</el-button>
                <el-button size="medium" type="primary" @click="onDialogSubmit()" v-else-if="dialogTitle=='新增用户基本信息'">确定</el-button>
                <el-button size="medium" type="primary" @click="dialogVisible = false" v-else>确定</el-button>
                <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>
<script>
import { optionsList } from '@/api/common'
import { userSearchList,userSave,companySearchAll,userGetList,GetPayWay } from '@/api/company'
    export default {
        data(){
            return{
                totalRecord: 0,//分页总条数
                pageSize: 10,//页面显示条数
                dialogVisible:false,//弹框的状态
                dialogTitle:'新增用户基本信息',
                payWaysoptions:[],//支付方式
                companyoptions:[],//所属企业
                Isdisabled:false,//不可编辑
                payWaysData:[],
                //查询条件
                searchData: {
                    userName: '',//用户名称
                    userPhone: '',//手机号
                    companyName: '',//所属企业
                    payWays: null,//支付方式
                    page: 1
                },
                tableData:[],//table表格
                //弹框的字段
                dataForm:{
                    userName:'',//用户名称
                    nickName:'',//用户昵称
                    userPhone: '',//手机号
                    gender:'',//性别
                    birthday: '',//生日
                    email:'',//Email
                    weChat:'',//微信
                    companyId:'',//所属企业
                    payWays:[],//支付方式
                    address:'',//用户地址
                    remark:'',//备注
                    userId:null,
                },
                //验证
                rules:{
                    userName:[{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    }],
                    nickName:[{
                        required: true,
                        message: '请输入用户昵称',
                        trigger: 'blur'
                    }],
                    userPhone:[{
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur'
                    }
                    // ,{
                    //     pattern:/^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/,
                    //     //pattern:/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$|^(886)?09\d{8}$|^(6|9)\d{7}$|6\d{6}$/,
                    //     message: '手机号格式错误',
                    //     trigger: 'blur'
                    // }
                    ]
                },
            } 
        },
        created(){
            this.initList();
            this.selectList();
        },
        methods:{
            //查询列表
            async initList(val){
                this.searchData.page = val;
                await userSearchList(this.searchData).then(res=>{
                    this.tableData = res.resultList;
                    this.totalRecord = res.pageInfo.totalSize;
                }).catch(err=>{console.log(err)})
            },
            //查询下拉框列表
            async selectList(){
                //支付方式
                await optionsList({dictionaryCodes:["PAY_WAY"]}).then(res=>{
                    this.payWaysoptions=res[0].list
                }).catch(err=>{console.log(err)});
                //所属企业
                await companySearchAll().then(res=>{
                    this.companyoptions=res;
                }).catch(err=>{console.log(err)});
            },
            //根据企业ID查询支付方式
            getPayWays(id){
                if(id!=null&&id!=""){
                    GetPayWay(id).then(res=>{
                        this.payWaysData=res;
                    })
                }else{
                    this.payWaysData=[];
                }
            },
            //重置
            handleReset(){
                this.searchData = {
                    userName: '',//用户名称
                    userPhone: '',//手机号
                    companyName: '',//所属企业
                    payWays:null,//支付方式
                    page: 1
                }
            },
            //修改赋值
            async handleEdit(index, row, num) {
                this.payWaysData=[];
                if(num == 1){
                    this.Isdisabled=true;
                    this.dialogTitle = '用户基本信息';
                }else{
                    this.Isdisabled=false;
                    this.dialogTitle = '修改用户基本信息';
                }
                this.dialogVisible = true;
                this.$nextTick(() => {
                    userGetList(row.userId).then(res=>{
                        if(res.companyId!=null&&res.companyId!=""){
                            this.getPayWays(res.companyId);
                        }
                        for (let x of Object.keys(this.dataForm)) {
                            this.dataForm[x] = res[x]
                        }
                    })
                })
            },
            //保存
            onDialogSubmit() {
                this.$refs.dataForm.validate(valid => {
                    if (valid) {
                        userSave(this.dataForm).then(response => {
                            this.$message({
                                type: 'success',
                                message: '保存成功！'
                            })
                            this.dialogVisible = false
                            this.initList()
                        }).catch(err=>{console.log(err)})
                    } else {
                        return false
                    }
                })
            },
            //关闭弹窗
            onDialogClose() {
                this.dataForm.userId = null;
                this.dataForm.userName = '';//用户名称
                this.dataForm.$nextTick = '';//用户昵称
                this.dataForm.userPhone = '';//手机号
                this.dataForm.gender = '';//性别
                this.dataForm.birthday = '';//生日
                this.dataForm.email = '';//Email
                this.dataForm.weChat = '';//微信
                this.dataForm.companyId = '';//所属企业
                this.dataForm.payWays = [];//支付方式
                this.dataForm.address = '';//用户地址
                this.dataForm.remark = '';//备注
                this.payWaysData=[];
                this.Isdisabled=false;
                this.$refs.dataForm.resetFields();
            }, 
        }
    }
</script>