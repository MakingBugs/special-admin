<template>
  <el-card class="box-card">
    <div class="search-bar">
      <el-form :inline="true" size="small">
        <el-form-item label="服务区域" prop="region">
          <el-select v-model="searchForm.region" clearable placeholder="请选择" @change="ChangeRegion">
            <el-option
              v-for="item in regiondata"
              :key="item.value"
              :label="item.desc"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="searchForm.region==1" label="服务据点" prop="stationId">
          <el-select v-model="searchForm.stationId" clearable placeholder="请选择">
            <el-option
              v-for="item in stationdata"
              :key="item.value"
              :label="item.desc"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务类型" prop="orderType">
          <el-select v-model="searchForm.orderType" clearable placeholder="请选择">
            <el-option
              v-for="item in serviceTypedata"
              :key="item.value"
              :label="item.desc"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="GetNightList(1)">查询</el-button>
          <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div  class="tools-bar">
      <el-button type="success" icon="el-icon-plus" size="small" @click="dialogVisible = true;dialogTitle='新增夜间费';disabled=false;AddOrUpdate=1">新增</el-button>
    </div>
    <div>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="regionDesc"
          label="服务区域"
          align="center">
        </el-table-column>
        <el-table-column
          prop="stationName"
          label="服务据点"
          align="center">
          <template slot-scope="scop">
            <span>{{scop.row.region==1? scop.row.stationName:'——'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderTypeDesc"
          label="服务类型"
          align="center">
        </el-table-column>
        <el-table-column
          label="时间"
          align="center">
          <template slot-scope="scop">
            <span>{{scop.row.startTimeStamp}} ~ {{scop.row.endTimeStamp}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="金额"
          align="center">
        </el-table-column>
        <el-table-column
          prop="status"
          label="禁用/启用"
          align="center"
          width="90">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="2"
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
              <el-button type="primary" size="mini" plain @click="Edit(scope.$index, scope.row);AddOrUpdate=2">编辑</el-button>
              <el-button size="mini" type="danger" plain @click="Remove(scope.$index, scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-bar">
        <el-pagination
          :current-page="searchForm.page"
          @current-change="GetNightList"
          layout="total, prev, pager, next, jumper"
          :total="totalSize"
          background>
        </el-pagination>
      </div>
    </div>
  <!-- 添加/修改 -->
    <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="45%"
    @closed="DialogClose">
    <el-form ref="nightForm" :rules="nightRules" :model="nightForm" label-width="150px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="服务区域" prop="region">
            <el-select v-model="nightForm.region" :disabled="disabled" clearable placeholder="请选择" @change="DialogChangeRegion" style="width: 85%;">
              <el-option
                v-for="item in regiondata"
                :key="item.value"
                :label="item.desc"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item v-if="nightForm.region==1" label="服务据点" prop="stationId">
            <el-select v-model="nightForm.stationId" :disabled="disabled" clearable placeholder="请选择" style="width: 85%;">
              <el-option
                v-for="item in stationdataDialog"
                :key="item.value"
                :label="item.desc"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="服务类型" prop="orderType">
            <el-select v-model="nightForm.orderType" :disabled="disabled" clearable placeholder="请选择" style="width: 85%;">
              <el-option
                v-for="item in serviceTypedataDialog"
                :key="item.value"
                :label="item.desc"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="时间" prop="startTimeStamp" style="width:100%">
            <el-time-select
              v-if="dialogVisible"
              placeholder="起始时间"
              v-model="nightForm.startTimeStamp"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '24:00',
                maxTime:nightForm.endTimeStamp
              }"
              style="width:100%">
            </el-time-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="20px" prop="endTimeStamp" style="width:75%">
            <el-time-select
              v-if="dialogVisible"
              placeholder="结束时间"
              v-model="nightForm.endTimeStamp"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '24:00',
                minTime: nightForm.startTimeStamp
              }"
              style="width:100%">
            </el-time-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="金额" prop="price">
            <!--<el-input v-model="nightForm.price" placeholder="金额" type="number" style="width:85%;"></el-input>!-->
            <el-input @input="e=>nightForm.price=FilterNum(e)" v-model="nightForm.price" placeholder="请输入优金额" controls-position="right" style="width:85%;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="AddOrUpdate==1? true:false" type="primary" @click="Add()">确 定</el-button>
      <el-button v-if="AddOrUpdate==2? true:false" type="primary" @click="Update()">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>
  </el-card>
</template>
<script>
import { getOssAuthInfo,optionsList} from '@/api/common'
import NightApi from '../../api/price'
import Fun from '../../../public/function'
export default {
      data() {
        return {
          
          regiondata:[],//地区列表
          stationdata:[],//据点列表
          serviceTypedata:[],//服务类型列表
          totalSize:null,//数据总条数

          AddOrUpdate:1,//指定对话框按钮1：添加 2：更新
          tableData: [],
          dialogTitle:'',//对话框标题
          dialogVisible:false,//对话框状态   也用以重新渲染 time-select 控件
          disabled:false,//是否禁用下拉框
          stationdataDialog:[],//据点列表 下拉框
          serviceTypedataDialog:[],//服务类型列表 对话框

          searchForm:{//查询表单
            page:1,//当前页
            region:null,//所选地区
            stationId:null,//所选据点
            orderType:null,//所选服务类型
          },
          nightForm:{
            priceId:null,//ID
            region:null,//所选地区
            stationId:null,//所选据点
            orderType:null,//所选服务类型
            startTimeStamp:null,
            endTimeStamp:null,
            price:'',
          },

          nightRules:{//验证规则
            region:[Fun.Check.required.select("请选择服务区域！")],
            stationId:[Fun.Check.required.select("请选择服务据点！")],
            orderType:[Fun.Check.required.select("请选择服务类型！")],
            startTimeStamp:[Fun.Check.required.select("请选择起始时间！")],
            endTimeStamp:[Fun.Check.required.select("请选择结束时间！")],
            price:[Fun.Check.required.req("请输入优惠值！")]
          },
        }
      },
      async created(){
        await this.GetRegionList() 
        await this.GetNightList(1)
      },
      methods: {
        //输入优惠值时进行过滤
        FilterNum(e){
          return e.replace(/\D/g, '')
        },
        //获取夜间费列表
        async GetNightList(page){
          this.tableData=[]
          this.searchForm.page=page
          await NightApi.nightList(this.searchForm).then(res=>{
            this.tableData=res.list
            this.totalSize=res.pageInfo.totalSize
          }).catch(err=>{console.log(err);})
        },
        //服务区域改变
        ChangeRegion(callback){
          this.stationdata=[]
          this.searchForm.stationId=null
          this.searchForm.orderType=null
            this.orderType=null
          if(callback==1){
            this.stationdata=this.stationList()
            this.GetQueryList(1,0)
          }else{
            this.GetQueryList(2,0)
          }
        },
        //服务区域改变(对话框)
        async DialogChangeRegion(callback){
          this.stationdataDialog=[]
          this.nightForm.stationId=null
          this.nightForm.orderType=null
          if(callback==1){
            this.stationdataDialog=this.stationDialogList()
            this.GetQueryList(1,1)
          }else{
            this.GetQueryList(2,1)
          }
        },
        //获取服务类型列表
        async GetQueryList(region,Dialog){
          await optionsList({dictionaryCodes:["ORDER_TYPE"],region:region}).then(res=>{
            if(Dialog==0){
              if(region==1){
                this.serviceTypedata=res[0].list.filter(i=>{
                  return i.value!=2
                })
              }else{
                this.serviceTypedata=res[0].list
              }
            }else{//对话框下拉框赋值
              if(region==1){
                this.serviceTypedataDialog=res[0].list.filter(i=>{
                  return i.value!=2
                })
              }else{
                this.serviceTypedataDialog=res[0].list
              }
            }
          })
        },
        //获取区域
        async GetRegionList() {
          await optionsList({dictionaryCodes:["REGION"]}).then(res=>{
            this.regiondata = res[0].list
          }).catch(err=>{console.log(err);})
        },
        //获取据点
        async stationList() {
          await optionsList({dictionaryCodes:["STATION"],region:1}).then(res=>{
            this.stationdata = res[0].list
          }).catch(err=>{console.log(err);})
        },
         //获取据点(对话框)
        async stationDialogList() {
          await optionsList({dictionaryCodes:["STATION"],region:1}).then(res=>{
            this.stationdataDialog = res[0].list
          }).catch(err=>{console.log(err);})
        },
        //重置搜索条件
        handleReset() {
          this.searchForm={
            region:null,//所选地区
            stationId:null,//所选据点
            orderType:null,//所选服务类型
          }
        },
        //启用/禁用
        handleStatus(row){
          const tip = row.status==1?"启用成功":"禁用成功"
          const type = row.status==1?"success":"info"
          NightApi.nightStatus({priceId:row.priceId,status:status}).then(response=>{
            this.$message({
              message: tip,
              type: type,
              duration:1000,
            });
          });
        },
        //编辑赋值
        async Edit(index,row){
          await this.DialogChangeRegion(row.region)
          this.dialogTitle = '修改夜间费'
          this.disabled=true
          this.nightForm.priceId=row.priceId
          this.nightForm.region=row.region
          this.nightForm.stationId=row.stationId
          this.nightForm.orderType=row.orderType
          this.nightForm.startTimeStamp=row.startTimeStamp
          this.nightForm.endTimeStamp=row.endTimeStamp
          this.nightForm.price=row.price
          this.dialogVisible = true
        },
        //--------------------------------------
        //确认添加
        Add(){
          this.$refs.nightForm.validate(async (valid)=>{
            if(valid){
              var exist
              await NightApi.nightList({region:this.nightForm.region,stationId:this.nightForm.stationId,orderType:this.nightForm.orderType}).then(res=>{
                exist=res.list.some(i=>{
                  return new Date("2000/01/01 "+this.nightForm.startTimeStamp)<new Date("2000/01/01 "+i.endTimeStamp)&&new Date("2000/01/01 "+this.nightForm.startTimeStamp)>new Date("2000/01/01 "+i.startTimeStamp)||new Date("2000/01/01 "+this.nightForm.endTimeStamp)<new Date("2000/01/01 "+i.endTimeStamp)&&new Date("2000/01/01 "+this.nightForm.endTimeStamp)>new Date("2000/01/01 "+i.startTimeStamp)||new Date("2000/01/01 "+this.nightForm.endTimeStamp)>new Date("2000/01/01 "+i.endTimeStamp)&&new Date("2000/01/01 "+this.nightForm.startTimeStamp)<new Date("2000/01/01 "+i.startTimeStamp)
                })
              })
              if(exist){
                this.$message({
                  message: '该时间段已存在夜间费设定！',
                  type: 'warning',
                  duration:3000,
                })
              }else{
                var data=Fun.DeepClone(this.nightForm)
                NightApi.nightAddUp(data).then(res=>{
                  this.$message({
                    message: '添加成功！',
                    type: 'success',
                    duration:1000,
                  })
                  this.GetNightList(1)
                  this.dialogVisible = false//关闭对话框
                }).catch(err=>{console.log(err)})
              }
            }
            else{
              return
            }
          })
        },
        //确认修改
        Update(){
          this.$refs.nightForm.validate(async (valid)=>{
            if(valid){
              var data=Fun.DeepClone(this.nightForm)
              NightApi.nightAddUp(data).then(res=>{
                this.$message({
                  message: '修改成功！',
                  type: 'success',
                  duration:1000,
                })
                this.GetNightList(this.searchForm.page)
                this.dialogVisible = false//关闭对话框
              }).catch(err=>{console.log(err)})
            }
            else{
              return
            }
          })
        },
        //删除
        Remove(index,row){
          this.$confirm('确认删除？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(res=>{
            NightApi.nightRemove({priceId:row.priceId}).then(res=>{
              this.$message({
                message: '删除成功！',
                type: 'success',
                duration:1000,
              })
              this.GetNightList(this.searchForm.page)
              this.dialogVisible = false//关闭对话框
            }).catch(err=>{console.log(err)})
          }).catch(err=>{console.log(err);})
        },
        //关闭对话框
        DialogClose(){
          this.nightForm={
            region:null,//所选地区
            stationId:null,//所选据点
            orderType:null,//所选服务类型
            startTimeStamp:null,
            endTimeStamp:null,
            price:'',
          }
          this.$refs.nightForm.resetFields()
        }
      }
    }
</script>
<style scoped>
</style>