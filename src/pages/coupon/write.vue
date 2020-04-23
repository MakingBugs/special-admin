<template lang="html">
    <el-card class="box-card">
        <div class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" size="small">
                <el-form-item label="发放时间">
                    <el-date-picker
                        v-model="searchData.grantStartTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        style="width:150px;"
                        placeholder="选择时间">
                    </el-date-picker>
                    -
                    <el-date-picker
                        v-model="searchData.grantEndTime"
                        type="date"
                        placeholder="选择时间"
                        value-format="yyyy-MM-dd"
                        style="width:150px;"
                        :picker-options="pickerOptions1">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="用户手机号">
                    <el-input v-model="searchData.userPhone" placeholder="用户手机号"></el-input>
                </el-form-item>
                <el-form-item label="优惠券ID">
                    <el-input v-model="searchData.couponId" placeholder="模板ID"></el-input>
                </el-form-item>
                <el-form-item label="使用时间">
                    <el-date-picker
                        v-model="searchData.useStartTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        style="width:150px;"
                        placeholder="选择时间">
                    </el-date-picker>
                    -
                    <el-date-picker
                        v-model="searchData.useEndTime"
                        type="date"
                        placeholder="选择时间"
                        value-format="yyyy-MM-dd"
                        style="width:150px;"
                        :picker-options="pickerOptions2">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="使用状态">
                    <el-select v-model="searchData.couponStatus" placeholder="请选择" style="width:120px;">
                    <el-option value="1" label="已过期"></el-option>
                    <el-option value="2" label="未过期"></el-option>
                    <el-option value="3" label="已使用"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="initList(1)">查询</el-button>
                    <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
                    <el-button v-if="excelStatus==3" type="success" icon="el-icon-upload2" size="small" @click="handleExport">导出Excel</el-button>
                    <el-button v-if="excelStatus==1" type="success" icon="el-icon-loading" size="small" disabled>正在导出</el-button>
                    <el-button v-if="excelStatus==2" type="success" icon="el-icon-download" size="small" @click="handleDownload">下载Excel</el-button>
                    <el-button v-if="excelStatus==2" type="success" icon="el-icon-download" size="small" @click="handleExport">重新导出</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <el-table :data="tableData" border>
                <el-table-column v-for="item in rowData" :prop="item.name" :label="item.text" align="center"></el-table-column>
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
    </el-card>
</template>
<script>
    import { couponVerifyList,verifyExport } from '@/api/coupon'
    export default {
        data() {
            return {
                totalRecord: 0,
                pageSize: 10,
                tableLoading: false,
                excelUrl:'',
                excelStatus:'',
                searchData: {
                    startTime:'',//发送时间
                    endTime:'',
                    useStartTime:'',//使用时间
                    useEndTime:'',
                    couponId:'',//优惠券id
                    userPhone: '',//用户手机号
                    couponStatus:'',//优惠券使用状态
                    page:1
                },
                rowData:[
                    {name:'grantTimeDesc',text:'发放日期'},
                    {name:'payTimeDesc',text:'使用日期'},
                    {name:'endTimeDesc',text:'到期时间'},
                    {name:'couponMoney',text:'优惠券面额'},
                    {name:'orderType',text:'使用订单类型'},
                    {name:'orderNum',text:'使用订单号'},
                    {name:'actualPayment',text:'订单实付金额'},
                    {name:'userPhone',text:'乘客手机号'},
                    {name:'couponId',text:'券ID'},
                    {name:'couponName',text:'券模板名称'},
                    {name:'statusName',text:'状态'},
                ],  
                tableData: [],
                pickerOptions1:{ //搜索日期
                    disabledDate:(time)=>{
                        return time.getTime() < new Date(this.searchData.startTime).getTime()- 8.64e7;
                    }
                },
                pickerOptions2:{ //搜索日期
                    disabledDate:(time)=>{
                        return time.getTime() < new Date(this.searchData.useStartTime).getTime()- 8.64e7;
                    }
                },
            }
        },
        created() {
            this.initList(1);  
        },
        methods: {
            //查询列表
            async initList(val) {
                this.searchData.page = val
                const data = await couponVerifyList(this.searchData)
                this.tableData = data.list
                this.excelUrl = data.url
                this.excelStatus = data.status
                this.totalRecord = data.pageInfo.totalSize
            },
            //下载excel
            handleDownload(){
                window.location.href = this.excelUrl
            },
            //导出excel
            handleExport(){
                verifyExport(this.searchData).then(()=>{
                    this.initList(this.searchData.page)
                })
            },
            //跳转到指定页
            handleCurrentChange(val) {
                this.initList(val)
            },
            //重置搜索条件
            handleReset() {
                this.searchData = {
                    startTime:'',//发送时间
                    endTime:'',
                    useStartTime:'',//使用时间
                    useEndTime:'',
                    couponId:'',//优惠券id
                    userPhone: '',//用户手机号
                    couponStatus:'',//优惠券使用状态
                    page:this.searchData.page
                }
            },
        }
    }
</script>
  