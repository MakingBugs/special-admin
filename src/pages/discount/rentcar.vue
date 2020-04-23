<template>
  <el-card class="box-card">
    <div class="search-bar">
      <el-form :inline="true" :model="searchForm" ref="searchForm" size="small">
        <el-form-item label="服务据点" prop="stationId">
          <el-select v-model="searchForm.stationId" clearable placeholder="请选择" @change="SelectPoint">
            <el-option
            v-for="item in stationdata"
            :key="item.value"
            :label="item.desc"
            :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆类型" prop="vehicleId">
          <el-select v-model="searchForm.vehicleId" clearable placeholder="请选择">
            <el-option
            v-for="item in vehicledata"
            :key="item.vehicleId"
            :label="item.vehicleName"
            :value="item.vehicleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="GetRentcarList(1)">查询</el-button>
          <el-button type="warning" plain icon="el-icon-brush" @click="handleReset()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div  class="tools-bar">
      <el-button type="success" icon="el-icon-plus" size="small" @click="dialogVisible = true;dialogTitle='新增优惠设定';disabled=false;AddOrUpdate=1">新增</el-button>
    </div>
    <div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :header-cell-style="headClass">
        <el-table-column
          prop="stationName"
          label="服务据点"
          align="center">
        </el-table-column>
        <el-table-column
          prop="vehicleName"
          label="车辆类型"
          align="center">
        </el-table-column>
        <el-table-column
          prop="endDurationDesc"
          label="用车时数"
          align="center">
        </el-table-column>
        <el-table-column
          prop="discountWayDesc"
          label="优惠方式"
          align="center">
        </el-table-column>
        <el-table-column
          label="优惠值"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.discountWay==1? scope.row.discountPrice+"(%)":scope.row.discountPrice+"(元)"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="开始时间"
          align="center">
            <template slot-scope="scope">
              <span>{{new Date(scope.row.startTime)|FormatDate('yyyy/MM/dd')}}</span>
            </template>
        </el-table-column>
        <el-table-column
          label="结束时间"
          align="center">
            <template slot-scope="scope">
              <span>{{new Date(scope.row.endTime)|FormatDate('yyyy/MM/dd')}}</span>
            </template>
        </el-table-column>
        <el-table-column
          prop="lunchStatus"
          label="禁用/启用"
          align="center"
          width="90">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
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
              <el-button :disabled="new Date(new Date(scope.row.endTime).toLocaleDateString())>=new Date(new Date().toLocaleDateString())? false:true" type="primary" size="mini" plain @click="Edit(scope.$index, scope.row);AddOrUpdate=2">编辑</el-button>
              <!-- <el-button size="mini" type="danger" plain @click="Remove(scope.$index, scope.row)">删除</el-button> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-bar">
        <el-pagination
          :current-page="searchForm.page"
          @current-change="GetRentcarList"
          layout="total, prev, pager, next, jumper"
          :total="totalSize"
          background>
        </el-pagination>
      </div>
    </div>
    <!--添加-->
    
      <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="45%"
      @closed="DialogClose">
        <el-form ref="rentcarForm" :rules="rentcarFormRules" :model="rentcarForm" label-width="150px">
          <el-form-item label="服务据点" prop="stationId">
            <el-select v-model="rentcarForm.stationId" :disabled="disabled" clearable placeholder="请选择" @change="SelectPointDialog" style="width: 80%">
              <el-option
                v-for="item in stationdata"
                :key="item.value"
                :label="item.desc"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车辆类型" prop="vehicleId">
            <el-select v-model="rentcarForm.vehicleId" :disabled="disabled" clearable placeholder="请选择" @change="SelectVehicleDialog" style="width: 80%">
              <el-option
                v-for="item in vehicledataDialog"
                :key="item.vehicleId"
                :label="item.vehicleName"
                :value="item.vehicleId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用车时数" prop="detailId">
            <el-select v-model="rentcarForm.detailId" :disabled="disabled" clearable placeholder="请选择" style="width: 80%">
              <el-option
                v-for="item in durationsdata"
                :key="item.detailId"
                :label="item.duration+'小时'+'('+item.distance+'公里'+')'"
                :value="item.detailId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker
              v-model="rentcarForm.startTime"
              type="date"
              placeholder="选择开始日期"
              style="width: 80%"
              :picker-options="pickerOptionsStart"
              @change="changeEnd"
              :clearable="false"
              format="yyyy/MM/dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              v-model="rentcarForm.endTime"
              type="date"
              placeholder="选择结束日期"
              style="width: 80%"
              :picker-options="pickerOptionsEnd"
              @change="changeStart"
              :clearable="false"
              format="yyyy/MM/dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="优惠方式" prop="discountWay">
            <el-radio @change="rentcarForm.discountPrice=''" v-model="rentcarForm.discountWay" :label="1" style="width: 35%;margin-left:10%">折扣(%)</el-radio>
            <el-radio @change="rentcarForm.discountPrice=''" v-model="rentcarForm.discountWay" :label="2" style="width: 35%">折价(元)</el-radio>
          </el-form-item>
          <el-form-item label="优惠值" prop="discountPrice">
            <el-input @input="e=>rentcarForm.discountPrice=FilterNum(e)" v-model="rentcarForm.discountPrice" placeholder="请输入优惠值"  :maxlength="rentcarForm.discountWay==1? 2:3" controls-position="right" style="width:80%;"></el-input>
            <!-- <el-input-number v-model="rentcarForm.discountPrice" :min="0" :max="rentcarForm.discountWay==1? 100:999" controls-position="right" style="width:80%;">></el-input-number> -->
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button v-if="AddOrUpdate==1? true:false" type="primary" @click="Add()">确 定</el-button>
          <el-button v-if="AddOrUpdate==2? true:false" type="primary" @click="Update()">确 定</el-button>
          <el-button @click="dialogVisible=false">取 消</el-button>
        </span>
      </el-dialog>
    
  </el-card>
</template>
<script>
import {optionsList} from '@/api/common'
import DiscountApi from '../../api/discount'
import Fun from '../../../public/function'
export default {
  data(){
    return{
      searchForm:{//查询表单
        type:2,//表单类型-点对点
        page:1,//当前页
        discountScope:0,//面向个人
        stationId:null,//所选据点
        vehicleId:null,//所选车辆类型
      },
      stationdata:[],//据点列表
      vehicledata:[],//车辆类型列表
      vehicledataDialog:[],//车辆类型列表(弹出框)
      durationsdata:[],//用车时长列表

      tableData:[],//列表数据
      totalSize:null,

      dialogVisible:false,//对话框状态
      dialogTitle:'',//对话框标题
      disabled:false,//是否禁用下拉框
      AddOrUpdate:1,//指定对话框按钮1：添加 2：更新
      rentcarForm:{//对话框表单
        type:2,//表单类型-包车
        discountId:null,//Id
        stationId:null,//据点
        vehicleId:null,//车辆类型
        detailId:null,//用车时长
        startTime:null,//开始时间
        endTime:null,//结束时间
        discountWay:null,//优惠类型
        discountPrice:null,//优惠值
      },
      //开始日期
      pickerOptionsStart: {
        disabledDate(time) {
          return (time.getTime()+3600 * 1000 * 24) < Date.now();
        }
      },
      //结束日期
      pickerOptionsEnd:{
        disabledDate(time) {
          return (time.getTime()+3600 * 1000 * 24) < Date.now();
        }
      },
      rentcarFormRules:{//验证规则
        stationId:[Fun.Check.required.select("请选择服务据点！")],
        vehicleId:[Fun.Check.required.select("请选择车辆类型！")],
        detailId:[Fun.Check.required.select("请选择用车时数！")],
        startTime:[Fun.Check.required.select("请选择起始时间！")],
        endTime:[Fun.Check.required.select("请选择结束时间！")],
        discountWay:[Fun.Check.required.req("请选择优惠方式！")],
        discountPrice:[Fun.Check.required.req("请输入优惠值！")]
      },
    }
  },
  methods:{
    
    //表头居中
    headClass(){
      return 'text-align: center;'
    },
    //输入优惠值时进行过滤
    FilterNum(e){
      return e.replace(/\D/g, '')
    },
    //重置搜索条件
    handleReset(){
      this.$refs.searchForm.resetFields()
    },
    //结束时间限制开始时间
    changeStart(date){
      this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
        // 可通过箭头函数的方式访问到this
        disabledDate: (time) => {
          var times = '';
          times = this.rentcarForm.endTime < time.getTime() || time.getTime() < new Date(new Date().toLocaleDateString()).getTime();
          return times
        }
      })
    },
    //开始时间 控制结束时间   
    changeEnd(date) {
      this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
        disabledDate: (time) => {
          return time.getTime() < this.rentcarForm.startTime
        }
      })
    },

    //获取据点列表
    async GetStationList(){
      await optionsList({dictionaryCodes:["STATION"],region:1}).then(res=>{
        this.stationdata=res[0].list
      }).catch(err=>{console.log(err);})
    },
    //获取优惠设定列表
    async GetRentcarList(page){
      this.searchForm.page=page
      await DiscountApi.discountList(this.searchForm).then(res=>{
        this.tableData=res.list
        this.totalSize=res.pageInfo.totalSize
      })
    },
    //改变据点获取车类型
    async SelectPoint(stationId){
      this.searchForm.vehicleId=null
      this.vehicledata=[]
      if(stationId>0){
        await DiscountApi.discountGet(stationId).then(res=>{
          this.vehicledata=res
        }).catch(err=>{console.log(err);})
      }
    },
    //改变据点获取车类型(弹出框)
    async SelectPointDialog(stationId){
      this.rentcarForm.vehicleId=null
      this.vehicledataDialog=[]
      this.rentcarForm.detailId=null
      this.durationsdata=[]
      if(stationId>0){
        await DiscountApi.discountGet(stationId).then(res=>{
          this.vehicledataDialog=res
        }).catch(err=>{console.log(err);})
      }
    },
    //改变车型获取用车时数(弹出框)
    async SelectVehicleDialog(vehicleId){
      this.rentcarForm.detailId=null
      this.durationsdata=[]
      if(vehicleId){
        await DiscountApi.discountDurations({stationId:this.rentcarForm.stationId,vehicleId:vehicleId}).then(res=>{
          this.durationsdata=res.filter(x=>{
            return x.duration!=null
          })
          console.log(this.durationsdata);
        }).catch(err=>{console.log(err);})
      }
    },
    //启用/禁用
    handleStatus(row){
      const tip = row.status==1?"启用成功":"禁用成功"
      const type = row.status==1?"success":"info"
      DiscountApi.discountStatus({discountId:row.discountId,status:row.status}).then(response=>{
        this.$message({
          message: tip,
          type: type,
          duration:1000,
        });
      }).catch(err=>{console.log(err);});
    },
    //关闭对话框
    DialogClose(){
      this.rentcarForm={//对话框表单
        type:2,//表单类型-点对点
        discountId:null,//Id
        stationId:null,//据点
        vehicleId:null,//车辆类型
        detailId:null,//用车时长
        startTime:null,//开始时间
        endTime:null,//结束时间
        discountWay:null,//优惠类型
        discountPrice:null,//优惠值
      }
      this.pickerOptionsStart={
        disabledDate(time) {
          return (time.getTime()+3600 * 1000 * 24) < Date.now();
        }
      }
      this.pickerOptionsEnd={
        disabledDate(time) {
          return (time.getTime()+3600 * 1000 * 24) < Date.now();
        }
      }
      this.$refs.rentcarForm.resetFields();
    },
    //编辑赋值
    async Edit(index,row){
      await this.SelectPointDialog(row.stationId)
      this.disabled=true
      this.dialogTitle = '修改优惠设定'
      this.rentcarForm.discountId=row.discountId
      this.rentcarForm.stationId=row.stationId
      this.rentcarForm.vehicleId=row.vehicleId
      this.rentcarForm.detailId=row.detailId
      this.rentcarForm.startTime=new Date(row.startTime)
      this.rentcarForm.endTime=new Date(row.endTime)
      //限制日期范围
      this.changeStart(new Date(row.startTime))
      this.changeEnd(new Date(row.endTime))
      this.rentcarForm.discountWay=row.discountWay
      this.rentcarForm.discountPrice=row.discountPrice
      this.dialogVisible = true
    },
    //---------------------------------------------------------------
    //确认添加
      Add(){
        this.$refs.rentcarForm.validate(async (valid)=>{
          if(valid){
            //判断同居点同车型同时间是否已存在
            DiscountApi.discountList({stationId:this.rentcarForm.stationId,vehicleId:this.rentcarForm.vehicleId,type:2,discountScope:0}).then(res=>{
              var exist1
              var exist2
              //同用车时数是否存在
              exist1=res.list.some(i=>{
                return this.rentcarForm.detailId==i.detailId
              })
              if(exist1){//若存在 判断时间是否冲突
                exist2=res.list.some(i=>{
                  return new Date(new Date(this.rentcarForm.endTime).toLocaleDateString())<=new Date(new Date(i.endTime).toLocaleDateString())&&new Date(new Date(this.rentcarForm.endTime).toLocaleDateString())>=new Date(new Date(i.startTime).toLocaleDateString())||new Date(new Date(this.rentcarForm.startTime).toLocaleDateString())<=new Date(new Date(i.endTime).toLocaleDateString())&&new Date(new Date(this.rentcarForm.startTime).toLocaleDateString())>=new Date(new Date(i.startTime).toLocaleDateString())||new Date(new Date(this.rentcarForm.endTime).toLocaleDateString())>new Date(new Date(i.endTime).toLocaleDateString())&&new Date(new Date(this.rentcarForm.startTime).toLocaleDateString())<new Date(new Date(i.startTime).toLocaleDateString())
                })
              }
              if(exist1&&exist2){
                this.$message({
                  message: '该时间段已存在优惠设定！',
                  type: 'warning',
                  duration:3000,
                })
              }
              else{
                var data=Fun.DeepClone(this.rentcarForm)
                DiscountApi.discountSave(data).then(res=>{
                  this.$message({
                    message: '添加成功！',
                    type: 'success',
                    duration:1000,
                  })
                  this.GetRentcarList(1)
                  this.dialogVisible = false//关闭对话框
                }).catch(err=>{console.log(err)})
              }
            })
          }
          else{
            return
          }
        })
      },
    //确认修改
    Update(){
      //判断同居点同车型同时间是否已存在
      DiscountApi.discountList({stationId:this.rentcarForm.stationId,vehicleId:this.rentcarForm.vehicleId,type:2,discountScope:0}).then(res=>{
        var list=res.list.filter(i=>{
          return i.discountId!=this.rentcarForm.discountId
        })
        console.log(list);
        var exist1
        var exist2
        //同用车时数是否存在
        exist1=list.some(i=>{
          return this.rentcarForm.detailId==i.detailId
        })
        if(exist1){//若存在 判断时间是否冲突
          exist2=list.some(i=>{
            return new Date(new Date(this.rentcarForm.endTime).toLocaleDateString())<=new Date(new Date(i.endTime).toLocaleDateString())&&new Date(new Date(this.rentcarForm.endTime).toLocaleDateString())>=new Date(new Date(i.startTime).toLocaleDateString())||new Date(new Date(this.rentcarForm.startTime).toLocaleDateString())<=new Date(new Date(i.endTime).toLocaleDateString())&&new Date(new Date(this.rentcarForm.startTime).toLocaleDateString())>=new Date(new Date(i.startTime).toLocaleDateString())||new Date(new Date(this.rentcarForm.endTime).toLocaleDateString())>new Date(new Date(i.endTime).toLocaleDateString())&&new Date(new Date(this.rentcarForm.startTime).toLocaleDateString())<new Date(new Date(i.startTime).toLocaleDateString())
          })
        }
        if(exist1&&exist2){
          this.$message({
            message: '该时间段已存在优惠设定！',
            type: 'warning',
            duration:3000,
          })
        }
        else{
          this.$refs.rentcarForm.validate(async (valid)=>{
            if(valid){
              var data=Fun.DeepClone(this.rentcarForm)
              DiscountApi.discountSave(data).then(res=>{
                this.$message({
                  message: '修改成功！',
                  type: 'success',
                  duration:1000,
                })
                this.GetRentcarList(this.searchForm.page)
                this.dialogVisible = false//关闭对话框
              }).catch(err=>{console.log(err)})
            }else{
              return
            }
          })
        }
      })
    },
    //删除
    Remove(index,row){
      console.log(row);
      this.$confirm('确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning' 
      }).then(res=>{
        DiscountApi.discountDelete({ids:[row.discountId]}).then(res=>{
          this.$message({
            message: '删除成功！',
            type: 'success',
            duration:1000,
          })
          this.GetRentcarList(this.searchForm.page)
        }).catch(err=>{console.log(err)})
      }).catch(err=>{console.log(err);})
    },
    //---------------------------------------------------------------
  },
  async created(){
    await this.GetStationList()
    await this.GetRentcarList(1)
  }
}
</script>
<style scoped>

</style>