<template lang="html">
    <el-card class="box-card">
      <div class="search-bar">
        <el-form :inline="true" :model="searchData" class="fl" size="small">
          <el-form-item label="车辆类型编号">
            <el-input v-model="searchData.vehicleId" placeholder="车辆类型编号" style="width:120px;"></el-input>
          </el-form-item>
          <el-form-item label="车辆类型名称">
            <el-input v-model="searchData.vehicleName" placeholder="车辆类型名称" style="width:120px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="initList(1)">查询</el-button>
            <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div  class="tools-bar">
        <el-button type="success" icon="el-icon-plus" size="small" @click="dialogVisible = true;dialogTitle='新增车型类型'">新增</el-button>
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
          <el-form-item label="所属据点：" prop="stationId" hide-required-asterisk>
            <el-select v-model="dataForm.stationId" clearable placeholder="请选择" style="width: 80%;">
                <el-option
                v-for="item in options"
                :value="item.value"
                :key="item.value"
                :label="item.desc"
                >
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车辆类型名称：" prop="vehicleName">
              <el-input v-model="dataForm.vehicleName" placeholder="车辆类型名称" style="width: 80%;"></el-input>
          </el-form-item>
  
          <el-form-item label="车辆类型图片：" ref='updatePic' prop="vehiclePic">
              <el-upload
                  :action="updateUrl"
                  ref="upload"
                  list-type="picture-card"
                  :file-list="imageList"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemovePic"
                  :before-upload="uploadBeforeUpload"
                  :http-request="uploadSectionFile"
                  >
                  <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="imgdialogVisible" append-to-body class="sub-dialog">
                  <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
          </el-form-item>
          <el-form-item label="可容乘客：" prop="seats">
              <el-input type="text" v-model="dataForm.seats" style="width: 80%;"></el-input>
          </el-form-item>
          <el-form-item label="可容行李：" prop="luggage">
              <el-input type="text" v-model="dataForm.luggage" style="width: 80%;"></el-input>
          </el-form-item>          
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="onDialogSubmit()" v-if="dialogTitle=='修改车型类型'">保存</el-button>
          <el-button size="medium" type="primary" @click="onDialogSubmit()" v-else>立即创建</el-button>
        </div>
      </el-dialog>
    </el-card>
  </template>
  <script>
      import { optionsList } from '@/api/common'
      import { vehicleList,vehicleSave,vehicleDelete,vehicleStatus } from '@/api/company'
      import moment from 'moment'
      import { getOssAuthInfo } from '@/api/common'
      let OSS = require('ali-oss');
      export default {
          data() {
              return {
                  totalRecord: 0,
                  pageSize: 10,
                  tableLoading: false,
                  dialogVisible: false,
                  dialogTitle: '新增车辆类型',
                  options:'',
                  updateUrl:this.$root.OSSURL,
                  imageList: [],
                  searchData: {
                      vehicleId: '',
                      vehicleName: '',
                      page:1
                  },
                  dataForm: {
                      vehicleId: '',
                      vehicleName: '',
                      stationId:'',
                      vehiclePic:'',
                      seats:'',
                      luggage:''
                  },
                  rules: {
                    stationId: [{required: true,message: '请选择所属据点', trigger: 'change'}],
                    vehicleName: [{required: true,message: '车辆类型名称不能为空',trigger: 'blur'}],
                    vehiclePic:[{required: true,message: '车辆类型图片不能为空',trigger: 'change'}],
                    seats: [{required: true,message: '可容乘客不能为空',trigger: 'blur'}],
                    luggage: [{required: true,message: '可容行李不能为空',trigger: 'blur'}],
                  },   
                  rowData:[
                    {name:'vehicleId',text:'车辆类型编号'},
                    {name:'stationName',text:'据点名称'},
                    {name:'vehicleName',text:'车辆类型名称'},
                  ],    
                  tableData: [],
  
                  dialogImageUrl: '',
                  imgdialogVisible: false,
  
                  
              }
          },
          created() {
              this.initList(1)
              this.selectList()
          },
          methods: {
              //查询列表
              async initList(val) {
                  this.searchData.page = val;
                  const data = await vehicleList(this.searchData)
                  this.tableData = data.list
                  this.totalRecord = data.pageInfo.totalSize
              },
              //查询下拉框列表
              async selectList() {
                  const data = await optionsList({dictionaryCodes:["STATION"]})
                  this.options = data[0].list
              },
              //重置搜索条件
              handleReset() {
                  this.searchData = {
                      vehicleId: '',
                      vehicleId:'',
                      vehicleName: '',
                      page:this.searchData.page
                  }
              },
              //修改车型类型——弹窗信息
              handleEdit(index, row) {
                console.log(row)
                  this.dialogVisible = true
                  this.dialogTitle = '修改车辆类型'
                  this.$nextTick(() => {
                    for (let x of Object.keys(this.dataForm)) {
                      if(x=="vehiclePic"){
                        this.imageList=[{"url":this.updateUrl+'carplusgo-info-img/'+row[x]}]
                      }
                      this.dataForm[x] = row[x]                   
                    }
                  })
              },
     
              //删除图片
              handleRemovePic(file, fileList) {
                this.dataForm.vehiclePic = ''
                
                // if(file && file.status==="success"){
                //   this.dataForm.vehiclePic = ''
                //   //  this.fileList.splice(this.fileList.findIndex(item => item.url === file.url), 1)
                // }
                
              },
              //放大图片
              handlePictureCardPreview(file) {
                  this.dialogImageUrl = file.url;
                  this.imgdialogVisible = true;
              },
              uploadBeforeUpload(file){
                // if(this.imageListFinal!=''){
                //   this.$message.error('请先删除原有车型图片');
                //   return false
                // }
                const isJPG = (file.type === 'image/jpeg')||(file.type === 'image/png');
                // const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error('图片格式不正确');//图片只能是 JPG/PNG 格式!
                }else{
                    this.imageList = []
                }
                return isJPG
              },
              //自定义上传
              uploadSectionFile(option){
                  let file = option.file
                  getOssAuthInfo().then(res => {
                    let client = new OSS({
                        accessKeyId: res.accessKeyId,
                        accessKeySecret: res.accessKeySecret,
                        stsToken: res.securityToken,
                        region: 'oss-cn-hangzhou', // oss地区
                        bucket: res.bucketName
                    })
                    const date = moment(new Date()).format('YYYY-MM-DD')
                    // const uid = JSON.parse(localStorage.getItem("account"))
                    const namearr = file.name.split(".")
                    // // 定义上传文件的名字+后缀
                    const storeAs =date+'/' + this.$md5(Date.parse(new Date())+namearr[0])+'.'+namearr[1];
                    // 调用上传接口
                    client.multipartUpload('carplusgo-info-img/'+storeAs, file).then(response=>{
                        if (response.res.status === 200) {
                            this.$refs.updatePic.clearValidate();
                            console.log(this.updateUrl)
                            this.imageList = [{"url":this.updateUrl+'carplusgo-info-img/'+storeAs}]
                            this.dataForm.vehiclePic = storeAs
                        }
                    }).catch(function (err) {
                        console.error('error: ', err)
                    })
                  })
                  // if (!isLt2M) {
                  //     this.$message.error('上传头像图片大小不能超过 2MB!');
                  // }&& isLt2M
                  // this.$refs.upload.submit();
                  
              },
              //保存车型类型
              onDialogSubmit() {
                this.$refs.dataForm.validate((valid) => {
                  if (valid) {
                    vehicleSave(this.dataForm).then(response => {
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
              //删除车型类型
              handleRemove(index, row) {
                  this.$confirm('确认删除？', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                  }).then(() => {
                    vehicleDelete({vehicleId:row.vehicleId}).then(response=>{
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
                vehicleStatus({vehicleId:row.vehicleId,status:status}).then(response=>{
                  this.$message({
                    message: tip,
                    type: type,
                    duration:1000,
                  });
                });
              },
              //关闭弹窗
              onDialogClose() {
                  this.imageList=[];
                  this.dataForm.vehicleId = '';
                  this.$refs.dataForm.resetFields()
              },        
              //跳转到指定页
              handleCurrentChange(val) {                
                this.initList(val)
              },
              // onSearch() {
              //   vehicleList(this.searchData).then(response => {
              //     this.tableData = response.list
              //   })
              // },
          },
      }
  </script>
  <style lang="scss">   
      .sub-dialog{
        .el-dialog{
          .el-dialog__header{
              border:none;
          }
          .el-dialog__body{
              text-align: center;
              img{
                  width: auto;
                  max-width:100%;
                  height:600px;
              }
          }
        }     
      }
      .el-dialog{
        .el-form-item__content{
          .el-upload-list__item,.el-upload--picture-card{
              width: 100px;
              height: 100px;
              line-height: 100px;
          }
        }
      }
  </style>