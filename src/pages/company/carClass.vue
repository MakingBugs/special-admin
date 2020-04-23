<template lang="html">
    <el-card class="box-card">
      <div class="search-bar">
        <el-form :inline="true" :model="searchData" class="fl" size="small">
          <el-form-item label="车型编号">
            <el-input v-model="searchData.classId" placeholder="车型编号" style="width:120px;"></el-input>
          </el-form-item>
          <el-form-item label="车型名称">
            <el-input v-model="searchData.className" placeholder="车型名称" style="width:120px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="initList(1)">查询</el-button>
            <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div  class="tools-bar">
        <el-button type="success" icon="el-icon-plus" size="small" @click="handleEdit">新增</el-button>
      </div>
      <div>
        <el-table
          :data="tableData"
          border
          fit
          highlight-current-row
          style="width: 100%"
          >
          <el-table-column 
              v-for="item in rowData"
              :prop="item.name"
              :label="item.text"
              align="center"
              >
          </el-table-column>
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
                :inactive-value="2"
                active-text=""
                inactive-text=""
                @change="handleStatus(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            >
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
          </el-pagination>
        </div>
      </div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="45%" @close="onDialogClose()">
        <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="150px">
          <el-form-item label="所属据点：" prop="stationId">
            <el-select v-model="dataForm.stationId" placeholder="请选择" style="width: 80%;" @change="handleStationChange">
                <el-option
                v-for="item in stationOptions"
                :value="item.value"
                :key="item.value"
                :label="item.desc"
                >
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车辆类型：" prop="vehicleId">
            <el-select v-model="dataForm.vehicleId" placeholder="请选择" style="width: 80%;">
                <el-option
                  v-for="item in carOptions"
                  :value="item.value"
                  :key="item.value"
                  :label="item.desc"
                  >
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车型名称：" prop="className" hide-required-asterisk>
              <el-input v-model="dataForm.className" placeholder="车型名称" style="width: 80%;"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="onDialogSubmit()" v-if="dialogTitle=='修改车型'">保存</el-button>
          <el-button size="medium" type="primary" @click="onDialogSubmit()" v-else>立即创建</el-button>
        </div>
      </el-dialog>
    </el-card>
  </template>
  <script>
      import { optionsList } from '@/api/common'
      import { carClassList,carClassSave,carClassDelete,carClassStatus } from '@/api/company'
      export default {
          data() {
              return {
                  totalRecord: 0,
                  pageSize: 10,
                  tableLoading: false,
                  dialogVisible: false,
                  dialogTitle: '新增车型',
                  carOptions:'',
                  stationOptions:'',
                  searchData: {
                      classId: null,
                      className: '',
                      page:1
                  },
                  dataForm: {
                      stationId:null,//据点id
                      classId: null,  //车型id
                      vehicleId:null,//车辆类型id
                      className: '',//车型名称
                  },
                  rules: {
                    stationId: [{ required: true,message: '请选择据点', trigger: 'change'}],
                    vehicleId: [{ required: true,message: '请选择车型类型', trigger: 'change'}],
                    className: [{required: true,message: '车型名称不能为空',trigger: 'blur'}],
                  },
                  rowData:[
                    {name:'classId',text:'车型编号'},
                    {name:'className',text:'车型名称'},
                  ],       
                  tableData: []
              }
          },
          created() {
              this.initList(1);  
              this.selectList1();
                        
          },
          methods: {
              //查询列表
              async initList(val) {
                  this.searchData.page = val
                  const data = await carClassList(this.searchData)
                  this.tableData = data.list
                  this.totalRecord = data.pageInfo.totalSize
              },
              //查询据点下拉框列表
              async selectList1() {
                  const data = await optionsList({dictionaryCodes:["STATION"]})
                  this.stationOptions = data[0].list
              },
              //查询车辆类型下拉框列表
              async selectList2() {
                  const data = await optionsList({dictionaryCodes:["VEHICLE_CLASS"],stationId:this.dataForm.stationId})
                  this.carOptions = data[0].list
              },
              //监听据点变化
              handleStationChange(selVal){
                this.dataForm.stationId = selVal;
                this.dataForm.vehicleId = null;
                this.selectList2();
              },
              //重置搜索条件
              handleReset() {
                  this.searchData={
                      classId: '',
                      vehicleId:'',
                      className: '',
                      page:this.searchData.page
                  }
              },
              //修改车型——弹窗信息
              handleEdit(index, row) {
                  this.dialogVisible = true
                  if(row){
                    this.dialogTitle = '修改车型'
                    this.$nextTick(() => {
                      for (let x of Object.keys(this.dataForm)) {
                        this.dataForm[x] = row[x]
                      }
                      this.selectList2();
                    })
                  }else{
                    this.dialogTitle = '新增车型'
                  }
              },
              //保存车型
              onDialogSubmit() {
                this.$refs.dataForm.validate((valid) => {
                  if (valid) {
                    carClassSave(this.dataForm).then(response => {
                      this.$message({
                        type: 'success',
                        message: '保存成功！'
                      });
                      this.dialogVisible=false
                      this.initList(this.searchData.page)
                    })
                  } else {  return false; }
                });
              },
              //删除车型
              handleRemove(index, row) {
                  this.$confirm('确认删除？', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                  }).then(() => {
                    carClassDelete({classId:row.classId}).then(response=>{
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
                const tip = row.status==1?"启用成功":"禁用成功"
                const type = row.status==1?"success":"info"
                const status = row.status===1?2:1
                carClassStatus({classId:row.classId,status:status}).then(response=>{
                  this.$message({
                    message: tip,
                    type: type,
                    duration:1000,
                  });
                });
              },
              //关闭弹窗
              onDialogClose() {
                  this.$refs.dataForm.resetFields()
                  this.dataForm = {
                      stationId:null,//据点id
                      classId: null,  //车型id
                      vehicleId:null,//车辆类型id
                      className: '',//车型名称
                  }
                  this.carOptions =  []
              },   
              //跳转到指定页
              handleCurrentChange(val) {
                this.initList(val)
              },
          }
      }
  </script>
  