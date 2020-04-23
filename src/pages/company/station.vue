<template lang="html">
  <el-card class="box-card">
    <div class="search-bar">
      <el-form :inline="true" :model="searchData" size="small">
        <el-input style="display: none;"></el-input>
        <el-form-item label="据点编号">
          <el-input v-model="searchData.stationId" placeholder="据点编号" style="width:120px;"></el-input>
        </el-form-item>
        <el-form-item label="据点名称">
          <el-input v-model="searchData.stationName" placeholder="据点名称" style="width:120px;"></el-input>
        </el-form-item>
        <el-form-item label="省">
          <el-select v-model="searchData.provinceCode" placeholder="请选择" @change="provinceChange1">
              <el-option
              v-for="item in provinces"
              :key="item.code"
              :label="item.name"
              :value="item.code">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市">
          <el-select v-model="searchData.cityCode" placeholder="请选择" @change="cityChange1">
            <el-option
            v-for="item in citys1"
            :key="item.code"
            :label="item.name"
            :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区">
          <el-select v-model="searchData.areaCode" placeholder="请选择">
            <el-option
            v-for="item in areas1"
            :key="item.code"
            :label="item.name"
            :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="initList(1)" size="small">查询</el-button>
          <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- <div class="">
        <el-button type="text" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="onSearch" size="small">查询</el-button>
      </div> -->
    </div>
    <div  class="tools-bar">
      <el-button type="success" icon="el-icon-plus" size="small" @click="dialogVisible = true;dialogTitle='新增据点'">新增</el-button>
    </div>
    <div>
      <el-table
        v-loading.body="tableLoading"
        ref="singleTable"
        :data="tableData"
        border
        fit
        highlight-current-row
        style="">
        <el-table-column 
            v-for="item in rowData"
            :prop="item.name"
            :label="item.text"
            align="center"
            >
        </el-table-column>
        <el-table-column
          prop="stationStatus"
          label="禁用/启用"
          align="center"
          width="90">
          <template slot-scope="scope">
            <!-- 1正常2禁用 -->
            <!-- <el-tag v-if="scope.row.stationStatus=='1'" color="#13CE66">禁用</el-tag>
            <el-tag v-if="scope.row.stationStatus=='2'" color="#FF4949">启用</el-tag> -->
            <el-switch
              v-model="scope.row.stationStatus"
              active-color="#13ce66"
              :active-value="1"
              :inactive-value="2"
              active-text=""
              inactive-text=""
              @change="handleStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150"
          align="center">
          <template slot-scope="scope">
            <div>
              <el-button
                type="primary"
                size="mini"
                plain
                @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                plain
                @click="handleRemove(scope.$index, scope.row)">删除</el-button>
            </div>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="45%" @close="onDialogClose()">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="150px">
        <el-form-item label="据点名称：" prop="stationName" hide-required-asterisk>
            <el-input v-model="dataForm.stationName" placeholder="具体地址" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="省份：" prop="provinceCode">
          <el-select v-model="dataForm.provinceCode" placeholder="请选择" style="width: 80%;" @change="provinceChange2">
              <el-option
              v-for="item in provinces"
              :key="item.code"
              :label="item.name"
              :value="item.code">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市：" prop="cityCode">
          <el-select v-model="dataForm.cityCode" placeholder="请选择" style="width: 80%;" @change="cityChange2">
            <el-option
            v-for="item in citys2"
            :key="item.code"
            :label="item.name"
            :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区/县：" prop="areaCode">
          <el-select v-model="dataForm.areaCode" placeholder="请选择" style="width: 80%;" @change="areaChange">
            <el-option
            v-for="item in areas2"
            :key="item.code"
            :label="item.name"
            :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="具体地址：" prop="stationAddress">
            <el-input v-model="dataForm.stationAddress" placeholder="具体地址" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="邮政编码：" prop="stationPostalCode">
            <el-input v-model="dataForm.stationPostalCode" placeholder="邮政编码" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="电话：" prop="stationTelephone">
            <el-input v-model="dataForm.stationTelephone" placeholder="电话" style="width: 80%;" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
        </el-form-item>
        <el-form-item label="传真：" prop="stationFax">
            <el-input v-model="dataForm.stationFax" placeholder="传真" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="简介：" prop="stationComment">
            <el-input type="textarea" v-model="dataForm.stationComment" placeholder="简介" style="width: 80%;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="onDialogSubmit()" v-if="dialogTitle=='修改据点'">保存</el-button>
        <el-button size="medium" type="primary" @click="onDialogSubmit()" v-else>立即创建</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
    import { cityList } from '@/api/common'
    import { stationList,stationSave,stationDelete,stationStatus } from '@/api/company'
    export default {
        data() {
            return {
                totalRecord: 0,
                pageSize: 10,
                tableLoading: false,
                dialogVisible: false,
                dialogTitle: '新增据点',
                provinces:[],
                citys1:[],
                areas1:[],//搜索
                citys2:[],
                areas2:[],//表单
                searchData: {
                    stationId: '',
                    stationName: '',
                    provinceCode: '',
                    cityCode: '',
                    areaCode: '',
                    page:1
                },
                dataForm: {
                    stationId: '',
                    stationName: '',
                    provinceCode: '', 
                    provinceName: '',
                    cityCode: '',
                    cityName: '',
                    areaCode: '',
                    areaName: '',
                    stationAddress:'',
                    stationPostalCode:'',
                    stationTelephone:'',
                    stationFax:'',
                    stationComment:''
                },
                rules: {
                    stationName: [{required: true,message: '据点名称不能为空',trigger: 'blur'}],
                    provinceCode: [{required: true,message: '请选择省份',trigger: 'blur'}],
                    cityCode: [{required: true,message: '请选择城市',trigger: 'blur'}],
                    areaCode: [{required: true,message: '请选择区县',trigger: 'blur'}],
                    stationAddress: [{required: true,message: '具体地址不能为空',trigger: 'blur'}],
                },       
                tableData: [],
                rowData:[
                  {name:'stationId',text:'据点编号'},
                  {name:'stationName',text:'据点名称'},
                  {name:'provinceName',text:'省'},
                  {name:'cityName',text:'市'},
                  {name:'areaName',text:'区'},
                  {name:'stationAddress',text:'具体地址'},
                  {name:'stationPostalCode',text:'邮政编码'},
                  {name:'stationTelephone',text:'电话'},
                  {name:'stationFax',text:'传真'}
                ]
            }
        },
        created() {
            this.initList(1);
            this.provinceData();
        },
        methods: {
            async initList(val) {
                this.searchData.page = val;
                const data = await stationList(this.searchData)
                this.tableData = data.list
                this.totalRecord = data.pageInfo.totalSize
            },
            async provinceData() {
                this.provinces = await cityList({queryType:1})
            },
            provinceChange1(selVal){
                this.searchData.cityCode = ''
                this.searchData.areaCode = '' 
                this.areas1 = []
                if(selVal){
                  cityList({queryType:2,provinceCode:selVal}).then(result=>{
                    this.citys1 = result
                  })
                }
            },
            provinceChange2(selVal){
                this.dataForm.cityCode = ''
                this.dataForm.areaCode = ''
                this.areas2 = []
                if(selVal){
                  let obj = this.provinces.find((item)=>{
                    return item.code === selVal;
                  });
                  this.dataForm.provinceName=  obj.name
                  cityList({queryType:2,provinceCode:selVal}).then(result=>{
                    this.citys2 = result
                  })
                }
            },
            cityChange1(selVal){               
                this.searchData.areaCode = ''
                if(selVal){
                  cityList({queryType:3,cityCode:selVal}).then(result=>{
                    this.areas1 = result
                  })
                }
            },
            cityChange2(selVal){               
                this.dataForm.areaCode = ''
                if(selVal){
                  let obj = this.citys2.find((item)=>{
                    return item.code === selVal;
                  });
                  this.dataForm.cityName =  obj.name
                  cityList({queryType:3,cityCode:selVal}).then(result=>{
                    this.areas2 = result
                  })
                }
            },
            areaChange(selVal){
                if(selVal){
                  let obj = this.areas2.find((item)=>{
                    return item.code === selVal;
                  });
                  this.dataForm.areaName=  obj.name
                }
            },            
            //重置搜索条件
            handleReset() {
                this.searchData={
                    stationId: '',
                    stationName: '',
                    provinceCode: '',
                    cityCode: '',
                    areaCode: '',
                    page:this.searchData.page
                }
                this.citys1 = ''
                this.areas1 = ''
                // this.onSearch()
            },
            //修改据点弹窗信息
            handleEdit(index, row) {
                this.dialogVisible = true
                this.dialogTitle = '修改据点'
                cityList({queryType:2,provinceCode:row.provinceCode}).then(result=>{
                    this.citys2 = result
                  })
                cityList({queryType:3,cityCode:row.cityCode}).then(result=>{
                    this.areas2 = result
                })
                this.$nextTick(() => {
                  for (let x of Object.keys(this.dataForm)) {
                      this.dataForm[x] = row[x]
                  }
                })
            },
            //保存据点
            onDialogSubmit() {
              this.$refs.dataForm.validate((valid) => {
                if (valid) {
                  console.log(this.dataForm)
                  stationSave(this.dataForm).then(response => {
                    this.$message({
                      type: 'success',
                      message: '保存成功！'
                    });
                    this.dialogVisible=false
                    this.initList(this.searchData.page)
                  })
                } else {
                  return false;
                }
              });
            },
            //删除据点
            handleRemove(index, row) {
                this.$confirm('确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                  stationDelete({stationId:row.stationId}).then(response=>{
                    this.$message({
                      message: '删除成功',
                      type: 'success',
                      duration:1500,
                    });
                    this.initList(this.searchData.page)
                  });
                }).catch(err => { console.log(err) })
            },
            //禁启用
            handleStatus(row) {
              const tip = row.stationStatus==1?"启用成功":"禁用成功"
              const type = row.stationStatus==1?"success":"info"
              const status = row.stationStatus===1?2:1
              stationStatus({stationId:row.stationId,stationStatus:status}).then(response=>{
                this.$message({
                  message: tip,
                  type: type,
                  duration:1000,
                });
              });
            },
            //关闭弹窗
            onDialogClose() {
                this.dataForm.stationId=""
                this.$refs.dataForm.resetFields()
            },
            //切换页
            handleCurrentChange(val) {             
              this.initList(val)
            },
            // //查询列表
            // onSearch() {
            //   const data = stationList(this.searchData).then(response => {
            //     this.tableData = response.list
            //   })
            // },
            // toDateTime(row, column, cellValue) {
            //     return cellValue
            //         ? moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
            //         : ''
            // },
        },
    }
</script>
<style lang="scss">
 
</style>
