<template lang="html">
    <el-card class="box-card">
      <div class="search-bar">
        <el-form :inline="true" :model="searchData" class="fl" size="small">
          <el-form-item label="驾驶员名称">
            <el-input v-model="searchData.userName" placeholder="驾驶员名称" style="width:120px;"></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="searchData.userPhone" placeholder="手机号码"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchData.status" placeholder="请选择">
                <el-option :value=0 label="禁用"></el-option>
                <el-option :value=1 label="启用"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="据点">
            <el-select v-model="searchData.stationId" placeholder="请选择" style="width: 100%;">
                <el-option
                v-for="item in options"
                :value="item.value"
                :key="item.value"
                :label="item.desc"
                >
                </el-option>
            </el-select>
        </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="initList(1)">查询</el-button>
            <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div  class="tools-bar">
        <el-button type="success" icon="el-icon-plus" size="small" @click="dialogVisible = true;dialogTitle='新增驾驶员';buttonShow = true">新增</el-button>
      </div>
      <div>
        <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
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
                :inactive-value="0"
                active-text=""
                inactive-text=""
                @change="handleStatus(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <div>
                <el-button v-if="scope.row.status==1" type="primary" size="mini" plain @click="handleEdit(scope.$index, scope.row,1)">编辑</el-button>
                <el-button type="primary" size="mini" plain @click="handleEdit(scope.$index, scope.row,2)">查看</el-button>
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
        <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="150px" style="width: 80%;">
            <el-form-item label="员工编号" prop="empNumber">
                <el-input v-model="dataForm.empNumber" placeholder="员工编号"></el-input>
            </el-form-item>
            <el-form-item label="驾驶员名称" prop="userName">
                <el-input v-model="dataForm.userName" placeholder="驾驶员名称"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="userPhone">
                <el-input v-model="dataForm.userPhone" placeholder="手机号码" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" ></el-input>
            </el-form-item>
            <el-form-item label="其他联系电话" prop="emergePhone">
                <el-input v-model="dataForm.emergePhone" placeholder="其他联系电话" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" ></el-input>
            </el-form-item>
            <el-form-item label="所属据点：" prop="stationId">
                <el-select v-model="dataForm.stationId" placeholder="请选择" style="width: 100%;">
                    <el-option
                    v-for="item in options"
                    :value="item.value"
                    :key="item.value"
                    :label="item.desc"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="头像" ref='updatePic' prop="userHeader">
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
            <el-form-item label="备注">
                <el-input type="textarea" v-model="dataForm.remark" placeholder="备注"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" v-if="buttonShow">
          <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="onDialogSubmit()" v-if="dialogTitle=='修改驾驶员'">保存</el-button>
          <el-button size="medium" type="primary" @click="onDialogSubmit()" v-else>立即创建</el-button>
        </div>
      </el-dialog>
    </el-card>
  </template>
  <script>
      import { optionsList,getOssAuthInfo } from '@/api/common'
      import { driverList,driverSave,driverStatus } from '@/api/company'
      import moment from 'moment'
      let OSS = require('ali-oss');
      export default {
          data() {
              return {
                  totalRecord: 0,
                  pageSize: 10,
                  tableLoading: false,
                  dialogVisible: false,
                  dialogTitle: '',
                  buttonShow:true,
                  options:'',
                  updateUrl:this.$root.OSSURL,
                  imageList: [],
                  searchData: {
                        userName: '',
                        userPhone: '',
                        status:null,
                        stationId:null,
                        page:1
                  },
                  dataForm: {
                    userId: null,
                    empNumber:'',
                    userName: '',
                    userPhone:'',
                    emergePhone:'',
                    stationId:null,
                    userHeader:'',
                    remark:''
                  },
                  rules: {
                    empNumber: [{required: true,message: '请输入员工编号', trigger: 'blur'}],
                    userName: [{required: true,message: '请输入驾驶员名称',trigger: 'blur'}],
                    userPhone: [{required: true,message: '请输入联系电话',trigger: 'blur'}],
                    emergePhone: [{required: true,message: '请输入其他联系电话',trigger: 'blur'}],
                    stationId: [{required: true,message: '请选择所属据点', trigger: 'change'}],
                    userHeader:[{required: true,message: '头像不能为空',trigger: 'change'}],
                  },   
                  rowData:[
                    {name:'empNumber',text:'员工编号'},
                    {name:'userName',text:'姓名'},
                    {name:'userPhone',text:'手机号码'},
                    {name:'emergePhone',text:'其他联络方式'},
                    {name:'stationName',text:'据点'},
                    {name:'remark',text:'备注'},
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
                  const data = await driverList(this.searchData)
                  this.tableData = data.list
                  this.totalRecord = data.pageInfo.totalSize
              },
              //查询据点列表
              async selectList() {
                  const data = await optionsList({dictionaryCodes:["STATION"]})
                  this.options = data[0].list
              },
              //重置搜索条件
              handleReset() {
                  this.searchData = {
                      userName: '',
                      userPhone: '',
                      status:null,
                      page:this.searchData.page
                  }
              },
              //禁启用
              handleStatus(row) {
                const tip = row.status==1?"启用成功":"禁用成功"
                const type = row.status==1?"success":"info"
                driverStatus({userId:row.userId,status:row.status}).then(response=>{
                  this.$message({
                    message: tip,
                    type: type,
                    duration:1000,
                  });
                });
              },
              //修改/查看驾驶员信息
              handleEdit(index, row,type) {
                  this.dialogVisible = true
                  if(type===1){
                    this.dialogTitle = '修改驾驶员'
                    this.buttonShow = true
                    
                  }else{
                    this.dialogTitle = '驾驶员信息'
                    this.buttonShow = false
                  }
                  this.$nextTick(() => {
                      for (let x of Object.keys(this.dataForm)) {
                        if(x=="userHeader"){
                          this.imageList=[{"url":this.updateUrl+'carplusgo-info-img/'+row[x]}]
                        }
                        this.dataForm[x] = row[x]                   
                      }
                  })
              },
              //删除图片
              handleRemovePic(file, fileList) {
                this.dataForm.userHeader = ''
              },
              //放大图片
              handlePictureCardPreview(file) {
                  this.dialogImageUrl = file.url;
                  this.imgdialogVisible = true;
              },
              uploadBeforeUpload(file){
                const isJPG = (file.type === 'image/jpeg')||(file.type === 'image/png');
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
                    const namearr = file.name.split(".")
                    // // 定义上传文件的名字+后缀
                    const storeAs =date+'/' + this.$md5(Date.parse(new Date())+namearr[0])+'.'+namearr[1];
                    // 调用上传接口
                    client.multipartUpload('carplusgo-info-img/'+storeAs, file).then(response=>{
                        if (response.res.status === 200) {
                            this.imageList = [{"url":this.updateUrl+'carplusgo-info-img/'+storeAs}]
                            this.dataForm.userHeader = storeAs
                            this.$refs.updatePic.clearValidate();
                        }
                    }).catch(function (err) { console.error('error: ', err) })
                  })
              },
              //保存驾驶员信息
              onDialogSubmit() {
                this.$refs.dataForm.validate((valid) => {
                  if (valid) {
                    driverSave(this.dataForm).then(response => {
                      this.$message({
                        type: 'success',
                        message: '保存成功！'
                      });
                      this.dialogVisible=false
                      this.initList(this.searchData.page)
                    })
                  } else { return false; }
                });
              },
              //关闭弹窗
              onDialogClose() {
                  this.imageList=[];
                  this.$refs.dataForm.resetFields()
                  this.dataForm.status=1
                  this.dataForm.remark=''
              },   
              //跳转到指定页
              handleCurrentChange(val) {               
                this.initList(val)
              },
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