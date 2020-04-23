<template lang="html">
    <el-card class="box-card">
      <!-- <el-page-header @back="$router.back(-1)" content="操作日志"></el-page-header> 
      <el-divider></el-divider>-->
      <div class="search-bar">
        <el-form :inline="true" :model="searchData" size="small">
          <el-form-item label="操作时间">
            <el-date-picker
              v-model="searchData.queryStartTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:190px;"
              placeholder="选择时间">
            </el-date-picker>
            -
            <el-date-picker
              v-model="searchData.queryEndTime"
              type="datetime"
              placeholder="选择时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:190px;"
              :picker-options="pickerOptions"
              default-time="23:59:59">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="操作人">
              <el-input v-model="searchData.operationUserName" placeholder="操作人"></el-input>
            <!-- <el-select v-model="searchData.driverId" placeholder="请选择">
              <el-option
              v-for="item in driverOptions"
              :value="item.value"
              :key="item.value"
              :label="item.desc">
              </el-option>
            </el-select> -->
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
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button type="primary" plain size="small" @click="handleShowDetail(scope.row)">详情</el-button>
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
            <!-- hide-on-single-page -->
            <!-- @size-change="handleSizeChange" -->
            <!-- :page-sizes="[10, 25, 50, 100]" -->
          </el-pagination>
        </div>
      </div>
      <el-dialog title="操作详情" :visible.sync="dialogVisible" @close="detailData={}">
        <el-form label-width="200px">
            <el-form-item label="操作名称：" style="margin-bottom: 0;">
                <span>{{ detailData.operationName }}</span>
            </el-form-item>
            <el-form-item label="操作人：" style="margin-bottom: 0;">
              <span>{{ detailData.operationUserName }}</span>
            </el-form-item>
            <!-- <el-form-item label="手机号：" style="margin-bottom: 0;">
              <span>{{ detailData.phone }}</span>
            </el-form-item> -->
            <el-form-item label="操作时间：" style="margin-bottom: 0;">
              <span>{{ detailData.createTime }}</span>
            </el-form-item>
            <el-form-item label="所属菜单：" style="margin-bottom: 0;">
              <span>{{ detailData.firstLevelMenu }} > > {{ detailData.secondLevelMenu }}</span>
            </el-form-item>
            <el-form-item label="操作内容：" style="margin-bottom: 0;">
              <div v-if="detailData.list">
                <p v-for="item in detailData.list">{{item.descrption}}：{{item.value}}</p>
              </div>
            </el-form-item>
        </el-form>
    </el-dialog>
    </el-card>
  </template>
  <script>
      import { operationLogList,operationLogDetail } from '@/api/common'
      export default {
          data() {
              return {
                  totalRecord: 0,
                  pageSize: 10,
                  dialogVisible:false,
                  searchData: {
                      operationUserName: '',//操作人
                      queryStartTime: '',//开始时间
                      queryEndTime: '',//结束时间
                      secondLevelMenuId:'',
                      page:1
                  },
                  pickerOptions:{ //结束日期——不可选
                    disabledDate:(time)=>{
                      return time.getTime() < new Date(this.searchData.startTime).getTime();
                    }
                  },
                  tableData: [],
                  rowData:[
                    {name:'operationUserName',text:'操作人名称'},
                    // {name:'phone',text:'操作人手机号'},
                    {name:'operationName',text:'操作名称'},
                    {name:'createTime',text:'操作时间'},
                    {name:'secondLevelMenu',text:'所属菜单'},
                  ],
                  detailData:{}
              }
          },
          created() {
              this.initList(1);
              this.searchData.secondLevelMenuId = this.$route.params.id
          },
          methods: {
              async initList(val) {
                  this.searchData.page = val;
                  const data = await operationLogList(this.searchData)
                  this.tableData = data.list
                  this.totalRecord = data.pageInfo.totalSize
                  // this.tableData = [
                  //   {operationUserName:'我啊1',phone:'1526898745',operationName:'修改',createTime:'2020-03-30',secondLevelMenu:'动态折扣管理'},
                  //   {operationUserName:'我啊2',phone:'1526898745',operationName:'修改',createTime:'2020-03-30',secondLevelMenu:'动态折扣管理'},
                  // ]
              },
              //操作详情
              handleShowDetail(row){
                // operationLogDetail({id:row.id}).then(result=>{
                    this.dialogVisible = true
                    this.detailData = row
                    // {
                    //   operationUserName:'我啊1',
                    //   phone:'1526898745',
                    //   operationName:'修改',
                    //   createTime:'2020-03-30',
                    //   secondLevelMenu:'动态折扣管理',
                    //   firstLevelMenu:'策略管理',
                    //   list:[
                    //     {descrption:'模板id',value:'5d909b864c338843eeaee697'},
                    //     {descrption:'模板id',value:'5d909b864c338843eeaee697'},
                    //     {descrption:'模板id',value:'5d909b864c338843eeaee697'},
                    //     {descrption:'模板id',value:'5d909b864c338843eeaee697'},
                    //     {descrption:'模板id',value:'5d909b864c338843eeaee697'},
                    //     {descrption:'模板id',value:'5d909b864c338843eeaee697'},
                    //     {descrption:'模板id',value:'5d909b864c338843eeaee697'},
                    //     {descrption:'模板id',value:'5d909b864c338843eeaee697'},
                    //     {descrption:'模板id',value:'5d909b864c338843eeaee697'},
                    //     {descrption:'模板id',value:'5d909b864c338843eeaee697'}
                    //   ]
                    // }
                // })
              },
              //重置搜索条件
              handleReset() {
                  this.searchData={
                      operationUserName: '',//操作人
                      queryStartTime: '',//开始时间
                      queryEndTime: '',//结束时间
                      secondLevelMenuId:this.searchData.secondLevelMenuId,
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
  