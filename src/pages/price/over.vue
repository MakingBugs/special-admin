<template>
  <el-card class="box-card">
    <div class="search-bar">
        <el-form :inline="true" :model="searchData" class="fl" size="small">
          <el-form-item label="服务据点">
            <el-select v-model="searchData.stationId" placeholder="请选择" @change="getcarType">
              <el-option v-for="item in stationoptions" :key="item.value" :label="item.desc" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车辆类型">
            <el-select v-model="searchData.vehicleId" placeholder="请选择">
              <el-option v-for="item in vehicleoptions" :key="item.value" :label="item.desc" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="initList">查询</el-button>
            <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div  class="tools-bar">
        <el-button type="success" icon="el-icon-plus" size="small" @click="dialogVisible = true;dialogTitle='新增包车超额'">新增</el-button>
      </div>
      <div>
        <el-table :data="tableData" border fit highlight-current-row stripe style="width: 100%">
          <el-table-column prop="stationName" label="服务据点" align="center"></el-table-column>
          <el-table-column prop="vehicleName" label="车辆类型" align="center"></el-table-column>
          <el-table-column prop="duration" label="每分钟 超时费" align="center"></el-table-column>
          <el-table-column prop="distance" label="每公里 超时费" align="center"></el-table-column>
          <el-table-column prop="status" label="禁用/启用" align="center" width="90">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" active-color="#13ce66" :active-value="1" :inactive-value="2" active-text="" inactive-text="" @change="handleStatus(scope.row)">
              </el-switch>
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
        <!-- 分页 -->
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
            <el-select v-model="dataForm.stationId" clearable placeholder="请选择" style="width: 80%;" @change="getcarType" :disabled="isdisabled">
                <el-option v-for="item in stationoptions" :value="item.value" :key="item.value" :label="item.desc">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车辆类型" prop="vehicleId">
            <el-select v-model="dataForm.vehicleId" clearable placeholder="请选择" style="width: 80%;" :disabled="isdisabled">
                <el-option v-for="item in vehicleoptions" :value="item.value" :key="item.value" :label="item.desc">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="每分钟 超时费" prop="duration">
            <!-- <el-input v-model="dataForm.duration" placeholder="请输入每分钟超时费" style="width: 80%;"></el-input> -->
            <el-input-number v-model="dataForm.duration" placeholder="请输入每分钟超时费" style="width: 80%;" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="每公里 超里费" prop="distance">
            <!-- <el-input v-model="dataForm.distance" placeholder="请输入每公里超里费" style="width: 80%;"></el-input> -->
            <el-input-number v-model="dataForm.distance" placeholder="请输入每公里超里费" style="width: 80%;" :min="0"></el-input-number>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="medium" type="primary" @click="onDialogSubmit()" v-if="dialogTitle=='修改包车超额'">保存</el-button>
          <el-button size="medium" type="primary" @click="onDialogSubmit()" v-else>确定</el-button>
          <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
        </div>
      </el-dialog>
  </el-card>
  </template>
  <script>
  import { optionsList } from '@/api/common'
  import PriceApi from '@/api/price'
  import DiscountApi from '@/api/discount'
  import Fun from '../../../public/function'
  export default {
    data() {
      return {
        totalRecord: 0, //分页总条数
        pageSize: 10, //页面显示条数
        dialogVisible: false, //弹框的状态
        dialogTitle: '新增包车超额',
        stationoptions:[],//服务据点
        vehicleIdoptions:[],//车辆类型
        vehicleoptions:[],//弹出框中的车辆类型
        isdisabled:false, //设为只读
        mergingRows:[],
        //查询条件
        searchData: {
            stationId: null,//据点id
            vehicleId: null,//车辆类型id
            page:1
        },
        //弹窗（新增修改）
        dataForm: {
            priceId:null,
            stationId:null,
            vehicleId:null,
            duration:null,
            distance:null
        },
        //验证
        rules: {
          stationId: [
              {
                  required: true,
                  message: '请选择服务据点',
                  trigger: 'change'
              },
              
          ],
          vehicleId: [
              {
                  required: true,
                  message: '请选择车辆类型',
                  trigger: 'change'
              },
          ],
          duration: [
              {
                  required: true,
                  message: '每分钟超时费不可为空',
                  trigger: 'blur'
              }
          ],
          distance: [
              {
                  required: true,
                  message: '每公里超里费不可为空',
                  trigger: 'blur'
              },
          ],
        }, 
        tableData: [] //table表格
      };
    },
    created() {
      this.initList();
      this.selectList();
    },
    methods: {
      //查询列表
      async initList() {
        this.tableData=[];
        await PriceApi.overList(this.searchData).then(res=>{
          this.tableData = res.list;
          this.totalRecord = res.pageInfo.totalSize
        }).catch(err=>{console.log(err)})
      }, 
      //查询下拉框列表
      async selectList() {
          //据点
          const data = await optionsList({dictionaryCodes:["STATION"],region:1});
          if(data.length>0){
            this.stationoptions = data[0].list;
          }
      },
      //重置搜索条件
      handleReset() {
          this.searchData={
              stationId: '',
              vehicleId:'',
              page:1
          }
      },
      //修改包车超额——弹窗信息
      async handleEdit(index, row) {
          this.dialogVisible = true; //打开弹框
          this.dialogTitle = '修改包车超额';
          this.isdisabled = true;//只读
          await this.getcarType(row.stationId);
          this.$nextTick(() => {//当dom发生变化，更新后执行的回调
            this.dataForm.priceId=row.priceId;
            this.dataForm.stationId=row.stationId;//据点
            this.dataForm.vehicleId=row.vehicleId;//车辆类型
            this.dataForm.duration=row.duration;//每分钟 超时费
            this.dataForm.distance=row.distance;//每公里 超时费
          })
      },
      //保存包车超额
      onDialogSubmit() {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            PriceApi.overSave(this.dataForm).then(response => {
              this.$message({
                type: 'success',
                message: '保存成功！'
              });
              this.dialogVisible=false
              this.initList()
            })
          } else {
            return false;
          }
        });
      },
      //删除
      handleRemove(index, row) {
          this.$confirm('确认删除？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
            PriceApi.overDelete({priceId:row.priceId}).then(response=>{
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
        const tip = row.status == 1? "启用成功" : "禁用成功";
        const type = row.status == 1 ? "success" : "info";
        const status = row.status === 1 ? 1 : 2
        PriceApi.overStatus({priceId:row.priceId,status:status}).then(response=>{
          this.$message({
            message: tip,
            type: type,
            duration:1000,
          });
        });
      },
      //关闭弹窗
      onDialogClose() {
          this.isdisabled = false;
          this.dataForm.priceId = null;
          this.dataForm.stationId = null;
          this.vehicleoptions=[];//清空车辆类型
          this.$refs.dataForm.resetFields();
      }, 
      //根据服务据点查出车辆类型
      async getcarType(id){
        await DiscountApi.discountGet(id).then(res=>{
          var a=res.map(i=>{
            return{
                value:i.vehicleId,
                desc:i.vehicleName
            }
        })
        this.vehicleoptions=a;
        }).catch(err=>{console.log(err)})
        
      },
      //跳转到指定页
      handleCurrentChange(val) {
        this.searchData.page = val;
        this.initList();
      },
    }
  }
  </script>
  <style scoped>
  </style>