<template>
    <el-card class="box-card">
        <div class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" size="small">
            <el-form-item label="企业名称">
                <el-input v-model="searchData.companyName" placeholder="企业名称" style="width:160px;"></el-input>
            </el-form-item>
            <el-form-item label="企业类型">
                <el-select v-model="searchData.type" placeholder="请选择">
                <el-option v-for="item in typesoptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="企业税号">
                <el-input v-model="searchData.companyTaxNum" placeholder="企业税号" style="width:160px;"></el-input>
            </el-form-item>
            <el-form-item label="企业电话">
                <el-input v-model="searchData.phone" placeholder="企业电话" style="width:160px;"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="initList()">查询</el-button>
                <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
            </el-form-item>
            </el-form>
        </div>
        <div class="tools-bar">
            <el-button type="success" icon="el-icon-plus" size="small" @click="dialogVisible = true;dialogTitle='新增企业资料'">新增</el-button>
        </div>
        <div>
            <el-table :data="tableData" border fit highlight-current-row stripe style="width: 100%">
                <el-table-column prop="companyName" label="企业名称" align="center"></el-table-column>
                <el-table-column prop="companyTaxNum" label="企业税号" align="center"></el-table-column>
                <el-table-column prop="phone" label="企业电话" align="center"></el-table-column>
                <el-table-column prop="typeDesc" label="企业类型" align="center"></el-table-column>
                <el-table-column prop="address" label="企业地址" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="150">
                    <template slot-scope="scope">
                        <div>
                            <el-button type="primary" size="mini" plain @click="handleEdit(scope.$index, scope.row, 0)">修改</el-button>
                            <el-button size="mini" type="warning" plain @click="handleEdit(scope.$index, scope.row, 1)">查看</el-button>
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

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="65%" @close="onDialogClose()">
            <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="110px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="企业名称" prop="companyName">
                            <el-input v-model="dataForm.companyName" placeholder="请输入企业名称" :disabled="Isdisabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="企业类型" prop="type">
                            <el-select v-model="dataForm.type" placeholder="请选择" :disabled="Isdisabled" style="width:100%">
                                <el-option v-for="item in typesoptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="签约起讫" prop="contractDateStart">
                            <el-date-picker 
                            v-model="dataForm.contractDateStart" 
                            type="date" placeholder="选择日期" 
                            :disabled="Isdisabled">
                            </el-date-picker>
                            -
                            <el-date-picker 
                            v-model="dataForm.contractDateEnd" 
                            type="date" placeholder="选择日期" 
                            :picker-options="pickerOptions"
                            :disabled="Isdisabled">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="企业电话" prop="phone">
                            <el-input v-model="dataForm.phone" placeholder="请输入企业电话" :disabled="Isdisabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="企业传真" prop="fax">
                            <el-input v-model="dataForm.fax" placeholder="请输入企业传真" :disabled="Isdisabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="企业EMail" prop="email">
                            <el-input v-model="dataForm.email" placeholder="请输入企业EMail" :disabled="Isdisabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="企业地址" prop="address">
                            <el-input v-model="dataForm.address" placeholder="请输入企业地址" :disabled="Isdisabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="付款方式" prop="payWays">
                            <el-checkbox-group v-model="dataForm.payWays" :disabled="Isdisabled">
                                <el-checkbox v-for="item in payWaysData" :label="item.value" :key="item.value">{{item.desc}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="发票种类" prop="invoiceType">
                            <el-select v-model="dataForm.invoiceType" placeholder="请选择" style="width:100%" :disabled="Isdisabled">
                                <el-option v-for="item in invoiceTypeoptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="发票抬头" prop="invoiceRise">
                            <el-input v-model="dataForm.invoiceRise" placeholder="请输入发票抬头" :disabled="Isdisabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="企业税号" prop="companyTaxNum">
                            <el-input v-model="dataForm.companyTaxNum" placeholder="请输入企业税号" :disabled="Isdisabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="开户银行" prop="depositBank">
                            <el-input v-model="dataForm.depositBank" placeholder="请输入开户银行" :disabled="Isdisabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="银行账户" prop="bankAccount">
                            <el-input v-model="dataForm.bankAccount" placeholder="请输入银行账户" :disabled="Isdisabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="发票寄送地址" prop="mailingAddress">
                            <el-input v-model="dataForm.mailingAddress" placeholder="请输入邮寄地址" :disabled="Isdisabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="remark">
                            <el-input  type="textarea" v-model="dataForm.remark" placeholder="请输入备注" :disabled="Isdisabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="margin-bottom:20px;">
                    <el-col :span="24">
                        <el-button :disabled="Isbutton" type="success" @click="dialogVisibleContact = true;dialogTitleContact='新增联络人信息'">新增联络人</el-button>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-table :data="tableContactData" border fit highlight-current-row stripe style="width: 100%" v-show="this.tableContactData.length > 0 ? true : false">
                            <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                            <el-table-column prop="phone" label="手机" align="center"></el-table-column>
                            <el-table-column prop="fax" label="传真" align="center"></el-table-column>
                            <el-table-column prop="email" label="Email" align="center"></el-table-column>
                            <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                            <el-table-column label="操作" align="center" width="150">
                                <template slot-scope="scope">
                                    <div>
                                        <el-button :disabled="Isbutton" type="primary" size="mini" plain @click="handleEditContact(scope.$index, scope.row, 0)">修改</el-button>
                                        <el-button size="mini" type="warning" plain @click="handleEditContact(scope.$index, scope.row, 1)">查看</el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium" type="primary" @click="onDialogSubmit()" v-if="dialogTitle=='修改企业资料'">确定</el-button>
                <el-button size="medium" type="primary" @click="onDialogSubmit()" v-else-if="dialogTitle=='新增企业资料'">确定</el-button>
                <el-button size="medium" type="primary" @click="dialogVisible = false" v-else>确定</el-button>
                <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="dialogTitleContact" :visible.sync="dialogVisibleContact" width="45%" @close="onContactDialogClose()">
            <el-form ref="contactForm" :rules="rulesContact"  :model="contactForm" label-width="110px">
                <el-form-item label="联络人姓名" prop="name">
                    <el-input v-model="contactForm.name" placeholder="请输入联络人姓名" :disabled="IsContact"></el-input>
                </el-form-item>
                <el-form-item label="联络人手机" prop="phone">
                    <el-input v-model="contactForm.phone" placeholder="请输入联络人手机" :disabled="IsContact"></el-input>
                </el-form-item>
                <el-form-item label="联络人传真" prop="fax">
                    <el-input v-model="contactForm.fax" placeholder="请输入传真" :disabled="IsContact"></el-input>
                </el-form-item>
                <el-form-item label="联络人Email" prop="email">
                    <el-input v-model="contactForm.email" placeholder="请输入Email" :disabled="IsContact"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="contactForm.remark" placeholder="请输入备注" :disabled="IsContact"></el-input>
                </el-form-item>
                <el-form-item prop="status">
                    <el-checkbox v-model="status" @change="chkstatus" :disabled="IsContact">启用</el-checkbox>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium" type="primary" @click="Update()" v-if="dialogTitleContact=='修改联络人信息'">确定</el-button>
                <el-button size="medium" type="primary" @click="Add()" v-else-if="dialogTitleContact=='新增联络人信息'">确定</el-button>
                <el-button size="medium" type="primary" @click="dialogVisibleContact = false" v-else>确定</el-button>
                <el-button size="medium" @click="dialogVisibleContact = false">取 消</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>
<script>
import { searchList,companySave,companyGetList } from '@/api/company'
import Fun from '../../../public/function'
    export default {
        data(){
            return{
                totalRecord: 0,//分页总条数
                pageSize: 10,//页面显示条数
                dialogVisible:false,//弹框的状态
                dialogVisibleContact:false,//联络人弹框
                dialogTitle:'新增企业资料',
                dialogTitleContact:'新增联络人信息',
                Isdisabled:false,//不可编辑
                IsContact:false,//联络人不可编辑
                Isbutton:false,
                contactindex:null,
                status:0,
                pickerOptions:{ //结束日期不可选开始日期之前的
                  disabledDate:(time)=>{
                    return time.getTime() < new Date(this.dataForm.contractDateStart).getTime();
                  }
                },
                //付款方式
                payWaysData:[
                    {
                        value:1,
                        desc:'企业优惠支付'
                    },
                    {
                        value:2,
                        desc:'企业月结支付'
                    }
                ],
                //企业类型
                typesoptions:[
                    {
                        id:1,
                        name:'一般企业'
                    },
                    {
                        id:2,
                        name:'关系企业'
                    }
                ],
                //发票种类
                invoiceTypeoptions:[
                    {
                        id: 1,
                        name: '普通发票'
                    },{
                        id: 2,
                        name: '增值税发票'
                    }
                ],
                //查询条件
                searchData: {
                    companyName: '',//企业名称
                    type: null,//企业类型
                    companyTaxNum: '',//企业税号
                    phone: '',//企业电话
                    page: 1,
                },
                tableData:[],//table表格
                //弹框的字段
                dataForm:{
                    companyId:null,
                    companyName:'',//企业名称
                    type: '',//企业类型
                    contractDateStart:'',//签约开始时间
                    contractDateEnd:'',//签约结束时间
                    phone:'',//企业电话
                    fax:'',//企业传真
                    email:'',//企业Email
                    address:'',//企业地址
                    payWays:[],//付款方式
                    invoiceType:'',//发票种类
                    invoiceRise:'',//发票抬头
                    companyTaxNum:'',//企业税号
                    depositBank:'',//开户银行
                    bankAccount:'',//银行账户
                    mailingAddress:'',//邮寄地址
                    remark:'',//备注
                    contactsList:[],//联络人
                },
                tableContactData:[],//联络人表格
                //联络人弹框字段
                contactForm:{
                    contactId:null,
                    companyId:null,
                    name:'',
                    phone:'',
                    fax:'',
                    email:'',
                    remark:'',
                    status:0,
                },
                newcontactForm:{},
                //验证
                rules:{
                    companyName:[{
                        required: true,
                        message: '请输入企业名',
                        trigger: 'blur'
                    }],
                    type:[{
                        required: true,
                        message: '请选择企业类型',
                        trigger: 'change'
                    }],
                    contractDateStart:[{
                        required: true,
                        message: '请选择开始时间',
                        trigger: 'change'
                    }],
                    contractDateEnd:[{
                        required: true,
                        message: '请选择结束时间',
                        trigger: 'change'
                    }],
                    phone:[{
                        required: true,
                        message: '请输入企业电话',
                        trigger: 'blur'
                    }
                    // ,{
                    //     pattern:/^\d{3}-\d{8}|\d{4}-\d{7}$/,
                    //     message: '格式错误！示例(0370-6666888)',
                    //     trigger: 'blur'
                    // }
                    ],
                    address:[{
                        required: true,
                        message: '请输入企业地址',
                        trigger: 'blur'
                    }],
                    payWays:[{
                        type: 'array',
                        required: true,
                        message: '请选择付款方式',
                        trigger: 'change'
                    }],
                    invoiceType:[{
                        required: true,
                        message: '请选择发票种类',
                        trigger: 'change'
                    }],
                    invoiceRise:[{
                        required: true,
                        message: '请输入发票抬头',
                        trigger: 'blur'
                    }],
                    companyTaxNum:[{
                        required: true,
                        message: '请输入企业税号',
                        trigger: 'blur'
                    }],
                    depositBank:[{
                        required: true,
                        message: '请输入开户银行',
                        trigger: 'blur'
                    }],
                    bankAccount:[{
                        required: true,
                        message: '请输入银行账户',
                        trigger: 'blur'
                    }],
                    mailingAddress:[{
                        required: true,
                        message: '请输入邮寄地址',
                        trigger: 'blur'
                    }]
                },
                //联络人验证
                rulesContact:{
                    name:[{
                        required: true,
                        message: '请输入姓名',
                        trigger: 'blur'
                    }],
                    phone:[{
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur'
                    }
                    // ,{
                    //     pattern:/^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/,
                    //     message: '手机号格式错误',
                    //     trigger: 'blur'
                    // }
                    ],
                    email:[{
                        required: true,
                        message: '请输入Email',
                        trigger: 'blur'
                    },{
                        pattern:/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                        message: '格式错误！示例(aaa@qq.com)',
                        trigger: 'blur'
                    }]
                }
            } 
        },
        created(){
            this.initList();
        },
        methods:{
            //查询列表
            async initList(val){
                this.searchData.page = val
                await searchList(this.searchData).then(res=>{
                    this.tableData = res.list;
                    this.totalRecord = res.pageInfo.totalSize;
                }).catch(err=>{console.log(err)})
            },
            //重置
            handleReset(){
                this.searchData = {
                    companyName: '',//企业名称
                    type: null,//企业类型
                    companyTaxNum: '',//企业税号
                    phone: '',//企业电话
                    page: 1
                }
            },
            //修改赋值
            async handleEdit(index, row, num) {
                if(num == 1){//查看
                    this.Isdisabled=true;
                    this.Isbutton=true;
                    this.dialogTitle = '企业资料';
                }else{
                    this.Isdisabled=false;
                    this.Isbutton=false;
                    this.dialogTitle = '修改企业资料';
                }
                this.dialogVisible = true;
                this.$nextTick(() => {
                    companyGetList(row.companyId).then(res=>{
                        for (let x of Object.keys(this.dataForm)) {
                            this.dataForm[x] = res[x]
                        }
                        this.tableContactData=res.contactsList;//联络人
                    })
                })
            },
            //保存
            onDialogSubmit() {
                this.$refs.dataForm.validate(valid => {
                    if (valid) {
                        companySave(this.dataForm).then(res => {
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
                this.dataForm.companyId = null;
                this.dataForm.companyName = '';//企业名称
                this.dataForm.type = '';//企业类型
                this.dataForm.contractDateStart = '';//签约开始时间
                this.dataForm.contractDateEnd = '';//签约结束时间
                this.dataForm.phone='';//企业电话
                this.dataForm.fax='';//企业传真
                this.dataForm.email='';//企业Email
                this.dataForm.address='';//企业地址
                this.dataForm.payWays=[];//付款方式
                this.dataForm.invoiceType='';//发票种类
                this.dataForm.invoiceRise='';//发票抬头
                this.dataForm.companyTaxNum='';//企业税号
                this.dataForm.depositBank='';//开户银行
                this.dataForm.bankAccount='';//银行账户
                this.dataForm.mailingAddress='';//邮寄地址
                this.dataForm.remark='';//备注
                this.Isdisabled=false;
                this.Isbutton=false;//新增联络人按钮
                this.IsContact=false;//联络人禁用
                this.tableContactData=[];//联络人列表
                this.$refs.dataForm.resetFields();
            },
            //联络人保存
            Add(){
                this.$refs.contactForm.validate(valid => {
                    if (valid) {
                        for (let x of Object.keys(this.contactForm)) {
                            this.newcontactForm[x] = this.contactForm[x]
                        }
                        var a = Fun.DeepClone(this.newcontactForm);
                        this.tableContactData.push(a);//存联络人
                        this.dataForm.contactsList=this.tableContactData;
                        this.dialogVisibleContact = false;
                    } else {
                        return false
                    }
                })
            },
            //联络人修改
            Update(){
                this.$refs.contactForm.validate(valid => {
                    if (valid) {
                        for (let x of Object.keys(this.contactForm)) {
                            this.newcontactForm[x] = this.contactForm[x]
                        }
                        var a = Fun.DeepClone(this.newcontactForm);
                        this.tableContactData.splice(this.contactindex,1,a);
                        this.dataForm.contactsList=this.tableContactData;
                        this.dialogVisibleContact = false;
                    } else {
                        return false
                    }
                })
            },
            //联络人赋值
            handleEditContact(index,row,num){
                this.contactindex=index;//下标
                if(num == 1){//查看
                    this.IsContact=true;
                    this.dialogTitleContact = '联络人信息';
                }else{
                    this.IsContact=false;
                    this.dialogTitleContact = '修改联络人信息';
                }
                this.dialogVisibleContact = true;
                this.$nextTick(() => {
                    if(row.status==1){
                        this.status=true;
                    }else if(row.status==0){
                        this.status=false;
                    }
                    this.contactForm.contactId=row.contactId;
                    this.contactForm.companyId=row.companyId;
                    this.contactForm.status=row.status;
                    this.contactForm.name=row.name;
                    this.contactForm.phone=row.phone;
                    this.contactForm.fax=row.fax;
                    this.contactForm.email=row.email;
                    this.contactForm.remark=row.remark;
                })
            },
            //关闭联络人弹框
            onContactDialogClose(){
                this.contactForm.name='';
                this.contactForm.phone='';
                this.contactForm.fax='';
                this.contactForm.email='';
                this.contactForm.remark='';
                this.contactForm.status=0;
                this.status=0;
                this.IsContact=false;
                this.$refs.contactForm.resetFields();
            },
            chkstatus(val){
                if(val){
                    this.contactForm.status=1;
                }else{
                    this.contactForm.status=0
                }
            }
        }
    }
</script>