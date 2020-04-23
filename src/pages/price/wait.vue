<template>
    <el-card class="box-card">
        <div class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" size="small">
                <el-form-item label="服务据点">
                  <el-select v-model="searchData.stationId" placeholder="请选择">
                    <el-option v-for="item in stationoptions" :key="item.value" :label="item.desc" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="服务类型">
                    <el-select v-model="searchData.orderType" placeholder="请选择">
                        <el-option v-for="item in orderTypeoptions" :key="item.value" :label="item.desc" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="initList">查询</el-button>
                    <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tools-bar">
            <el-button type="success" icon="el-icon-plus" size="small" @click="dialogVisible = true;dialogTitle='新增等待费'">新增</el-button>
        </div>
        <!-- table表格 -->
        <div>
            <el-table :data="tableData" border fit highlight-current-row stripe style="width: 100%">
                <el-table-column v-for="item in rowData" :key="item.name" :prop="item.name" :label="item.text" align="center"></el-table-column>
                <el-table-column prop="stationName" label="服务据点" align="center"></el-table-column>
                <el-table-column prop="orderTypeDesc" label="服务类型" align="center"></el-table-column>
                <el-table-column prop="freeWaitDuration" label="免费等候时间(分钟)" align="center"></el-table-column>
                <el-table-column prop="rechargebleDuration" label="超时收费时间 (分钟)" align="center"></el-table-column>
                <el-table-column prop="price" label="金额" align="center"></el-table-column>
                <el-table-column prop="status" label="禁用/启用" align="center" width="90">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" active-color="#13ce66" :active-value="1" :inactive-value="2" active-text inactive-text @change="handleStatus(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="150">
                    <template slot-scope="scope">
                        <div>
                            <el-button type="primary" size="mini" plain @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="mini" type="danger" plain @click="handleRemove(scope.$index, scope.row)">删除</el-button>
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
                <el-form-item label="服务据点" prop="stationId">
                    <el-select v-model="dataForm.stationId" clearable placeholder="请选择" style="width: 80%;" :disabled="isdisabled">
                        <el-option v-for="item in stationoptions" :value="item.value" :key="item.value" :label="item.desc"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务类型" prop="orderType">
                    <el-select v-model="dataForm.orderType" placeholder="请选择" style="width: 80%;" :disabled="isdisabled">
                        <el-option v-for="item in orderTypeoptions" :key="item.value" :label="item.desc" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="免费等候时间(分钟)" prop="freeWaitDuration">
                    <el-input v-model="dataForm.freeWaitDuration" placeholder="请输入免费等候时间" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="超时收费时间 (分钟)" prop="rechargebleDuration">
                    <el-input v-model="dataForm.rechargebleDuration" placeholder="请输入超时收费时间" style="width: 80%;"></el-input>
                </el-form-item>
                <el-form-item label="金额" prop="price">
                    <el-input v-model="dataForm.price" placeholder="请输入金额" style="width: 80%;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium" type="primary" @click="onDialogSubmit()" v-if="dialogTitle=='修改等待费'">保存</el-button>
                <el-button size="medium" type="primary" @click="onDialogSubmit()" v-else>确定</el-button>
                <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>
<script>
import { optionsList } from '@/api/common'
import PriceApi from '@/api/price'
export default {
    data() {
        return {
            totalRecord: 0,//分页总条数
            pageSize: 10,//页面显示条数
            tableLoading: false,
            dialogVisible: false,
            dialogTitle: '新增等待费',
            stationoptions:[],//服务据点下拉框
            orderTypeoptions:[],//服务类型下拉框
            isdisabled:false,
            //查询条件
            searchData: {
                stationId: null,
                orderType: null,
                page: 1
            },
            //弹窗（新增修改）
            dataForm: {
                priceId:null,
                stationId: '',
                orderType: '',
                freeWaitDuration: null,
                rechargebleDuration: null,
                price: null,
            },
            //列表字段
            rowData: [],
            //验证
            rules: {
                stationId: [
                    {
                        required: true,
                        message: '请选择服务据点',
                        trigger: 'change'
                    }
                ],
                orderType: [
                    {
                        required: true,
                        message: '请选择服务类型',
                        trigger: 'change'
                    }
                ],
                freeWaitDuration: [
                    {
                        required: true,
                        message: '免費等候時間不可为空',
                        trigger: 'blur'
                    },{
                        pattern:/^[0-9]*$/,
                        message: '只能输入整数',
                        trigger: 'blur'
                    }
                ],
                rechargebleDuration: [
                    {
                        required: true,
                        message: '超時收費時間不可为空',
                        trigger: 'blur'
                    },{
                        pattern:/^[0-9]*$/,
                        message: '只能输入整数',
                        trigger: 'blur'
                    }
                ],
                price: [
                    {
                        required: true,
                        message: '金额不可为空',
                        trigger: 'blur'
                    },{
                        pattern:/^[0-9]+([.]{1}[0-9]+){0,1}$/,
                        message: '只能输入整数或小数',
                        trigger: 'blur'
                    }
                ]
            },
            tableData: []
        };
    },
    created() {
        this.initList();
        this.selectList();
    },
    methods: {
        //查询列表
        async initList() {
            await PriceApi.waitList(this.searchData).then(res=>{
                    this.tableData = res.list;
                    this.totalRecord = res.pageInfo.totalSize;
                }).catch(err=>{console.log(err)})
        },
        //查询下拉框列表
        async selectList() {
          const data1 = await optionsList({dictionaryCodes:["STATION"],region:1})//据点
          const data2 = await optionsList({dictionaryCodes:["ORDER_TYPE"]})//服务类型
          if(data1.length>0){
            this.stationoptions = data1[0].list
          }
          if(data2.length>0){
            this.orderTypeoptions = data2[0].list
          }
        },
        //重置搜索条件
        handleReset() {
            this.searchData = {
                stationId: null,
                orderType: null,
                page: 1
            }
            // this.initList()
        },
        //修改等待费——弹窗信息
        handleEdit(index, row) {
            this.dialogVisible = true;
            this.isdisabled = true;
            this.dialogTitle = '修改等待费';
            this.$nextTick(() => {//当dom发生变化，更新后执行的回调
                this.dataForm.priceId=row.priceId;
                this.dataForm.stationId=row.stationId;
                this.dataForm.orderType=row.orderType;
                this.dataForm.freeWaitDuration=row.freeWaitDuration;
                this.dataForm.rechargebleDuration=row.rechargebleDuration;
                this.dataForm.price=row.price;
            })
        },
        //保存等待费
        onDialogSubmit() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    var exist=this.tableData.some(i=>{
                        return this.dataForm.stationId==i.stationId&&this.dataForm.orderType==i.orderType&&this.dataForm.priceId!=i.priceId;
                    });
                    if(exist){
                        this.$message({
                            message: '等待费不可重复设置',
                            type: 'warning',
                            duration:3000,
                        })
                    }else{
                        PriceApi.waitSave(this.dataForm).then(response => {
                            this.$message({
                                type: 'success',
                                message: '保存成功！'
                            })
                            this.dialogVisible = false
                            this.initList()
                        })
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
              PriceApi.waitDelete({priceId:row.priceId}).then(response=>{
                this.$message({
                  message: '删除成功',
                  type: 'success',
                  duration:1500,
                });
                this.initList()
              });
            }).catch(err => { console.log(err) })
        },
        //禁启用
        handleStatus(row) {
            const tip = row.status == 1 ? '启用成功' : '禁用成功'
            const type = row.status == 1 ? 'success' : 'info'
            const status = row.status === 1 ? 1 : 2
            PriceApi.waitStatus({ priceId:row.priceId,status:status }).then(
                response => {
                    this.$message({
                        message: tip,
                        type: type,
                        duration: 1000
                    })
                }
            )
        },
        //关闭弹窗
        onDialogClose() {
            this.isdisabled = false;
            this.dataForm.priceId=null;
            this.dataForm.stationId = ''
            this.$refs.dataForm.resetFields()
        },
        //跳转到指定页
        handleCurrentChange(val) {
            this.searchData.page = val
            this.initList()
        },
    }
}
</script>
<style scoped>
</style>