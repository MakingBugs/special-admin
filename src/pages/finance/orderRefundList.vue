<template>
    <el-card class="box-card">
        <div class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" size="small">
            <el-form-item label="勤务编号">
               <el-input v-model="searchData.orderId" placeholder="请输入勤务编号" style="width: 100%;"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="searchData.refundStatus" clearable placeholder="请选择" style="width: 100%;">
                    <el-option :value=1 label="已退款"></el-option>
                    <el-option :value=2 label="未退款"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="initList">查询</el-button>
                <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
            </el-form-item>
            </el-form>
        </div>
        <div>
            <el-table :data="tableData" border fit highlight-current-row stripe style="width: 100%">
                <el-table-column prop="orderId" label="勤务编号" align="center"></el-table-column>
                <el-table-column prop="userName" label="订车人" align="center"></el-table-column>
                <el-table-column prop="riderName" label="乘客" align="center"></el-table-column>
                <el-table-column prop="orderTypeDesc" label="服务类型" align="center"></el-table-column>
                <el-table-column prop="appointmentTime" label="用车时间" sortable align="center" :formatter="formatDate"></el-table-column>
                <el-table-column prop="payAmount" label="收款金额" align="center"></el-table-column>
                <el-table-column prop="payTime" label="收款日期" align="center" :formatter="formatpayTime"></el-table-column>
                <el-table-column prop="orderStatusDesc" label="订单状态" align="center"></el-table-column>
                <el-table-column prop="actualRefundAmount" label="退款金额" align="center"></el-table-column>
                <el-table-column prop="reasonTypeDesc" label="退款原因" align="center"></el-table-column>
                <el-table-column prop="refundStatusDesc" label="退款状态" sortable align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="100">
                    <template slot-scope="scope">
                        <div>
                            <el-button :disabled="scope.row.refundStatusDesc==='已退款'" type="primary" size="mini" plain @click="handleEdit(scope.$index, scope.row)">退款</el-button>
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
                <el-form-item label="退款金额" prop="actualRefundAmount">
                    <el-input v-model="dataForm.actualRefundAmount" placeholder="请输入退款金额" style="width: 85%;"></el-input>&nbsp;元
                </el-form-item>
                <el-form-item label="退款原因" prop="reasonType">
                    <el-select v-model="reasonType" clearable placeholder="请选择" style="width: 90%;" :rules="[{required: true,message: '请选择退款原因',trigger: 'change'}]">
                        <el-option :value=1 label="空趟"></el-option>
                        <el-option :value=2 label="取消订单"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium" type="primary" @click="onDialogSubmit()" v-if="dialogTitle=='退款'">确定</el-button>
                <el-button size="medium" type="primary" @click="onDialogSubmit()" v-else>确定</el-button>
                <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>
<script>
import {orderRefundList,toRefund} from '@/api/finance'
export default {
    data(){
        return{
            totalRecord: 0,//分页总条数
            pageSize: 10,//页面显示条数
            dialogVisible:false,//弹框的状态
            dialogTitle:'退款',
            reasonType:null,//退款原因
            //查询条件
            searchData: {
                orderId:'',//勤务编号
                refundStatus:null,//状态
                pageNo: 1
            },
            tableData:[],//table表格
            dataForm:{
                refundId:0,//订单退款id
                actualRefundAmount:null,//退款金额
                reasonType:null,//退款原因
            },
            //验证
            rules:{
                actualRefundAmount:[{
                    required: true,
                    message: '请输入退款金额',
                    trigger: 'blur'
                },{
                    pattern: /^[0-9]+\.?[0-9]{0,2}$/,
                    message:'只能输入整数和小数（两位小数）',
                    trigger:'blur'
                }],
                reasonType:[{
                    required: true,
                    message: '请选择退款原因',
                    trigger: 'change'
                }]
            },
        }
    },
    created(){
        this.initList();
    },
    methods:{
        //查询列表
        async initList(){
            await orderRefundList(this.searchData).then(res=>{
                if(res.list!=null){
                    this.tableData = res.list;
                    this.totalRecord = res.pageInfo.totalSize;
                }else{
                    this.tableData = [];
                    this.totalRecord = res.pageInfo.totalSize;
                }
            }).catch(err=>{console.log(err)})
        },
        //重置
        handleReset(){
            this.searchData = {
                orderId: '',//勤务编号
                refundStatus: null,//状态
                pageNo: 1
            }
        },
        //修改赋值
        async handleEdit(index, row) {
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.dataForm.refundId=row.refundId;//订单退款id
                this.dataForm.actualRefundAmount=row.actualRefundAmount;//退款金额
                switch (row.reasonTypeDesc) {
                    case '空趟':
                        this.reasonType=1;
                        break;
                    case '取消订单':
                        this.reasonType=2;
                        break;
                }
                this.dataForm.reasonType=this.reasonType;
            })
        },
        //保存
        onDialogSubmit() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    this.dataForm.reasonType=this.reasonType;
                    toRefund(this.dataForm).then(response => {
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
        //跳转到指定页
        handleCurrentChange(val) {
            this.searchData.pageNo = val
            this.initList()
        },
        //关闭弹窗
        onDialogClose() {
            this.$refs.dataForm.resetFields();
        },
        //用车时间格式转换
        formatDate(row) {
            if(row.appointmentTime!=null){
                return new Date(row.appointmentTime).getFullYear()+'-'+('0'+(new Date(row.appointmentTime).getMonth()+1)).substr(-2)+'-'+('0'+new Date(row.appointmentTime).getDate()).substr(-2)+' '+('0'+new Date(row.appointmentTime).getHours()).substr(-2)+':'+('0'+new Date(row.appointmentTime).getMinutes()).substr(-2);
            }else{
                return '';
            }
        },
        //收款日期格式转换
        formatpayTime(row) {
            if(row.payTime!=null){
                return new Date(row.payTime).getFullYear()+'-'+('0'+(new Date(row.payTime).getMonth()+1)).substr(-2)+'-'+('0'+new Date(row.payTime).getDate()).substr(-2);
            }else{
                return '';
            }
        }
    }
}
</script>