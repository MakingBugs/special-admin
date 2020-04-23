<template lang="html">
    <el-card class="box-card">
        <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="250px" style="width: 60%;">
            <el-form-item label="发放对象：">
                <el-radio-group v-model="dataForm.grantType" @change="handleRadioChange">
                    <el-radio :label=1>单个</el-radio>
                    <el-radio :label=2>批量</el-radio>
                </el-radio-group>
                
            </el-form-item>
            <el-form-item v-if="dataForm.grantType===1" label="手机号：" prop="sendUserPhone">
                <el-input v-model="dataForm.sendUserPhone" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item v-if="dataForm.grantType===2" label="导入名单：" prop="issueFileUrl">
                <el-upload
                    class="upload-demo"
                    action="#"
                    :file-list="fileList"
                    multiple
                    :limit="1"
                    :before-upload="uploadBeforeUpload"
                    :on-exceed="handleExceed"
                    :on-remove="handleRemove"
                    :http-request="uploadSectionFile"
                    >
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
                <div v-if="tipMessage==='正在导入……'" style="color: #409EFF;">{{tipMessage}}</div>
                <div v-if="tipMessage==='导入成功！'" style="color:#67C23A;">{{tipMessage}}</div>
                <div v-if="tipMessage==='导入失败！'" style="color: red;">{{tipMessage}}</div>
            </el-form-item>
            <el-form-item label="模板ID：" prop="issueTemplateId">
                <el-input v-model="dataForm.issueTemplateId" placeholder="模板ID"></el-input>
            </el-form-item>
            <el-form-item label="发放数量：">
                <el-input-number v-model="dataForm.issueNum" controls-position="right" :min="1" :max="100" style="width: 100%;"></el-input-number>
            </el-form-item>
            <el-form-item label="原因：">
                <el-radio v-model="dataForm.reasonIssueType" label="1">优惠活动</el-radio>
                <el-radio v-model="dataForm.reasonIssueType" label="2">客服发放</el-radio>
                <el-radio v-model="dataForm.reasonIssueType" label="3">其他</el-radio>
            </el-form-item>
            <el-form-item>
                <el-input type="textarea" v-model="dataForm.reasonIssue" placeholder="其他原因请填写"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" plain @click="handleReset">重 置</el-button>
                <el-button type="primary" @click="onSubmit">发放优惠券</el-button>
            </el-form-item>
        </el-form>
    </el-card>
  </template>
<script>
    import { grantInsert,grantUpload} from '@/api/coupon'
    import axios from 'axios'

    import {getOssAuthInfo } from '@/api/common'
    import moment from 'moment'
    import Rule from '@/utils/rules';
    let OSS = require('ali-oss');

    export default {
        data() {
            return {
                updateUrl:this.$root.OSSURL,
                fileList: [],
                tipMessage:'',
                dataForm: {
                    grantType:1,//单个/批量
                    sendUserPhone:'',//手机号
                    issueFileUrl:'',//文件url
                    issueFileName:'',//文件名
                    issueTemplateId:'',//模板ID
                    issueNum:'',    //发放数量
                    reasonIssueType:'1',//发放原因类型
                    reasonIssue:'',//其他原因
                },
                rules: {
                    sendUserPhone: [{required: true,message: '手机号不能为空', trigger: 'blur'}],
                    issueTemplateId:[{required: true, message: '模板ID不能为空', trigger: 'blur'}],
                    issueFileUrl:[{required: true, message: '请上传文件'}],
                },   
            }
        },
        computed: {},
        created() {},
        methods: {
            //限制上传
            handleExceed(files, fileList) {
                this.$message.warning(`只能选择 1 个文件`);
            },
            //上传之前
            uploadBeforeUpload(file){
                const isTextComputer = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                if (!isTextComputer) {
                    this.$message.error('请选择Excel文件');
                }
                return isTextComputer
            },
            //移除文件
            handleRemove(file, fileList) {
                this.tipMessage = ''
                this.dataForm.issueFileUrl = ''
                this.dataForm.issueFileName = ''
            },
            //自定义上传
            uploadSectionFile(option){
                this.tipMessage = '正在导入……'
                let formData = new FormData();
                formData.append("file", option.file);
                axios({
                    url:'/dev/grant/upload',
                    method: 'post',
                    data: formData,
                    headers:{'Content-Type':'multipart/form-data'}		
                }).then(result=>{
                    if(result.data.success){
                        this.tipMessage = '导入成功！'
                        this.dataForm.issueFileUrl = result.data.data.url
                        this.dataForm.issueFileName = result.data.data.fileName
                    }else{
                        this.tipMessage = '导入失败！'
                    }
                })
                // getOssAuthInfo().then(res => {
                //     let client = new OSS({
                //         accessKeyId: res.accessKeyId,
                //         accessKeySecret: res.accessKeySecret,
                //         stsToken: res.securityToken,
                //         region: 'oss-cn-hangzhou', // oss地区
                //         bucket: res.bucketName
                //     })
                //     const date = moment(new Date()).format('YYYY-MM-DD')
                //     const namearr = file.name.split(".")
                //     // // 定义上传文件的名字+后缀
                //     const storeAs =date+'/' + this.$md5(Date.parse(new Date())+namearr[0])+'.'+namearr[1];
                //     // 调用上传接口
                //     client.multipartUpload('special-excel-test/'+storeAs, file).then(response=>{
                //         if (response.res.status === 200) {
                //             this.tipMessage = '导入成功！'
                //             // this.fileList = [{"url":this.updateUrl+'special-excel-test/'+storeAs}]
                //             // this.dataForm.userHeader = storeAs
                //             // this.$refs.updatePic.clearValidate();
                //         }else{
                //             this.tipMessage = '导入失败！'
                //         }
                //     }).catch(function (err) { console.error('error: ', err) })
                // })
            },
            //单选框切换
            handleRadioChange(val){
                this.$refs['dataForm'].clearValidate()
            },
            onSubmit(){
                //确定将优惠券，发送审核？
                this.$refs.dataForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确定发放优惠券/发送审核？', '发放优惠券', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            grantInsert(this.dataForm).then(response=>{
                                this.$message({
                                    message: '发放成功/已发送审核',
                                    type: 'success',
                                    duration:1500,
                                });
                            });
                        }).catch(err => { console.log(err) })
                    }
                })
                
            },
            handleReset(){
                this.dataForm = {
                    grantType:1,//单个/批量
                    sendUserPhone:'',//手机号
                    issueFileUrl:'',//文件url
                    issueTemplateId:'',//模板ID
                    issueNum:'',    //发放数量
                    reasonIssueType:'1',//发放原因类型
                    reasonIssue:'',//其他原因
                }
                this.tipMessage = ''
                this.$refs.dataForm.resetFields()
            }
        },
    }
</script>
<style lang="scss">   
</style>