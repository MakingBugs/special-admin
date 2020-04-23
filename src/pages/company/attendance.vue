<template lang="html">
  <el-card class="box-card">
    <div class="search-bar">
      <el-form :inline="true" :model="searchData" size="small">
        <el-form-item label="用车日期">
          <el-date-picker
            v-model="searchData.startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:190px;"
            placeholder="选择时间">
          </el-date-picker>
          -
          <el-date-picker
            v-model="searchData.orderEndTime"
            type="datetime"
            placeholder="选择时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width:190px;"
            :picker-options="pickerOptions"
            default-time="23:59:59">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="驾驶员">
          <el-select v-model="searchData.driverId" placeholder="请选择">
            <el-option
            v-for="item in driverOptions"
            :value="item.value"
            :key="item.value"
            :label="item.desc">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="initList(1)" size="small">查询</el-button>
          <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
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
          <!-- hide-on-single-page -->
          <!-- @size-change="handleSizeChange" -->
          <!-- :page-sizes="[10, 25, 50, 100]" -->
        </el-pagination>
      </div>
    </div>
  </el-card>
</template>
<script>
    import { optionsList } from '@/api/common'
    import { attendanceList} from '@/api/company'
    export default {
        data() {
            return {
                totalRecord: 0,
                pageSize: 10,
                driverOptions:[],//驾驶员列表
                searchData: {
                    startTime: '',
                    endTime: '',
                    driverId: '',
                    page:1
                },
                pickerOptions:{ //结束日期——不可选
                  disabledDate:(time)=>{
                    return time.getTime() < new Date(this.searchData.startTime).getTime();
                  }
                },
                tableData: [],
                rowData:[
                  {name:'userName',text:'驾驶员名称'},
                  {name:'appointmentTime',text:'用车日期'},
                  {name:'orderTypeDesc',text:'服务类型'},
                  {name:'companyName',text:'公司名称'},
                  {name:'riderName',text:'乘客姓名'},
                  {name:'riderPhone',text:'乘客手机号'},
                  {name:'startPoint',text:'下单起点'},
                  {name:'endPoint',text:'下单终点'},
                  {name:'carPlateNumber',text:'车牌号'},
                ]
            }
        },
        created() {
            this.initList(1);
            this.selectList();
        },
        methods: {
            async initList(val) {
                this.searchData.page = val;
                const data = await attendanceList(this.searchData)
                this.tableData = data.list
                this.totalRecord = data.pageInfo.totalSize
            },
            //驾驶员下拉框列表
            async selectList() {
                  const data = await optionsList({dictionaryCodes:["DRIVER_NAME"]})
                  this.driverOptions = data[0].list
              },
            //重置搜索条件
            handleReset() {
                this.searchData={
                    startTime: '',
                    endTime: '',
                    driverId: '',
                    page:this.searchData.page
                }
            },
            //切换页
            handleCurrentChange(val) {             
              this.initList(val)
            },
        },
    }
</script>
<style lang="scss">
 
</style>
