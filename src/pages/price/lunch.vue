<template>
  <el-card class="box-card">
    <div class="search-bar">
      <el-form :inline="true" size="small">
        <el-form-item label="服务据点" prop="stationId">
          <el-select v-model="searchForm.stationId" clearable placeholder="请选择">
            <el-option
              v-for="item in stationdata"
              :key="item.value"
              :label="item.desc"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="GetLunchList(1)">查询</el-button>
          <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div  class="tools-bar">
      <el-button type="success" icon="el-icon-plus" size="small" @click="addDomain();dialogVisible = true;dialogTitle='新增餐补';disabled=false;AddOrUpdate=1">新增</el-button>
    </div>
    <div>
      <el-table
        :data="tableData"
        :span-method="mergeRows"
        border
        style="width: 100%">
        <el-table-column
          prop="stationName"
          label="服务据点"
          align="center">
        </el-table-column>
        <el-table-column
          label="餐补时间"
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
          @current-change="GetLunchList"
          layout="total, prev, pager, next, jumper"
          :total="totalSize"
          background>
        </el-pagination>
      </div>
    </div>
  <!-- 添加 -->
    <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="50%"
    @closed="DialogClose">
      <el-form ref="lunchForm" :rules="lunchRules" :model="lunchForm" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="服务据点" prop="stationId" style="width:100%">
              <el-select v-model="lunchForm.stationId" :disabled="disabled" clearable placeholder="请选择" style="width:92%">
                <el-option
                  v-for="item in stationdata"
                  :key="item.value"
                  :label="item.desc"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-for="(item,index) in lunchForm.items"  :key="index">
          <el-col :span="8">
            <el-form-item :label="'时间'+(index+1)" :prop="'items.'+index+'.startTimeStamp'" :rules="[{required: true, message: '请选择起始时间！'}]">
              <el-time-select
                placeholder="起始时间"
                v-model="item.startTimeStamp"
                :picker-options="{
                  start: '00:00',
                  step: '00:15',
                  end: '24:00',
                  maxTime:item.endTimeStamp
                }"
                style="width:100%">
              </el-time-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="10px" :prop="'items.'+index+'.endTimeStamp'" :rules="[{required: true, message: '请选择结束时间！'}]">
              <el-time-select
                placeholder="结束时间"
                v-model="item.endTimeStamp"
                :picker-options="{
                  start: '00:00',
                  step: '00:15',
                  end: '24:00',
                  minTime: item.startTimeStamp
                }"
                style="width:100%">
              </el-time-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="'金额'+(index+1)" :prop="'items.'+index+'.price'" label-width="70px" :rules="[{required: true, message: '请填写金额！'}]">
              <!-- <el-input-number v-model="item.price" controls-position="right" style="width:220px;">></el-input-number> -->
              <el-input @input="e=>item.price=FilterNum(e)" v-model="item.price" placeholder="请输入金额" controls-position="right" style="width:100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button  type="danger" style="margin-left: 16px" @click.prevent="removeDomain(index)">删除</el-button>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button style="float:left" @click="addDomain">新增时间</el-button>
        <el-button v-if="AddOrUpdate==1? true:false" type="primary" @click="Add()">确 定</el-button>
        <el-button v-if="AddOrUpdate==2? true:false" type="primary" @click="Update()">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
  </el-dialog>
  </el-card>
</template>
<script>
import { getOssAuthInfo,optionsList} from '@/api/common'
import PriceApi from '@/api/price'
import Fun from '../../../public/function'
export default {
      data() {
        return {
          searchForm:{//查询表单
            page:1,//当前页
            stationId:null,//所选据点
          },

          AddOrUpdate:1,//指定对话框按钮1：添加 2：更新
          stationdata:[],//据点列表
          totalSize:null,//数据总条数
          mergingRows:[],

          tableData: [],
          disabled:false,//是否禁用下拉框
          dialogTitle:'',//对话框标题
          dialogVisible:false,//对话框状态

          lunchRules: {
            stationId:[Fun.Check.required.select("请选择服务据点！")],
          },//对话框验证规则
          
          lunchForm:{
            priceId:null,//餐补配置表ID
            stationId:null,//据点ID
            items: [],//明细
          }
        }
      },
    methods: {
      //输入优惠值时进行过滤
      FilterNum(e){
        return e.replace(/\D/g, '')
      },
      //获取据点列表
      async GetStationList(){
        await optionsList({dictionaryCodes:["STATION"],region:1}).then(res=>{
          this.stationdata=res[0].list
        }).catch(err=>{console.log(err);})
      },
      //获取餐补列表数据
      async GetLunchList(page){
        this.tableData=[];
        this.searchForm.page=page
        await PriceApi.lunchList(this.searchForm).then(data=>{
          data.list.map(x=>{
            x.items.map(y=>{
              var a=Fun.DeepClone(x)
              var b=Fun.DeepClone(y)
              var obj=Object.assign(a,b)
              this.tableData.push(obj)
            })
          })
          this.dataPretreatment()
          this.totalSize=data.pageInfo.totalSize
        }).catch(err=>{console.log(err);})
      },
      //计算出要合并的行
      dataPretreatment(){
        this.mergingRows=[]
        let mergingPos=null;
        for(let i=0;i<this.tableData.length;i++){
          if(i==0){
            this.mergingRows.push(1)
            mergingPos=0
          }else{
            if(this.tableData[i].priceId===this.tableData[i-1].priceId){
              this.mergingRows[mergingPos] +=1
              this.mergingRows.push(0)
            }else{
              this.mergingRows.push(1)
              mergingPos = i
            }
          }
        }
      },
      //合并行
      mergeRows({row,column,rowIndex,columnIndex}){
        if(columnIndex===0||columnIndex===3||columnIndex===4){
          const _row=this.mergingRows[rowIndex]
          const _col=_row>0? 1:0
            if(row.stationId){
              return[_row,_col]
            }
          }
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      //启用/禁用
      handleStatus(row){
        const tip = row.status==1?"启用成功":"禁用成功"
        const type = row.status==1?"success":"info"
        const status = row.status
        PriceApi.lunchStatus({priceId:row.priceId,status:status}).then(response=>{
          this.$message({
            message: tip,
            type: type,
            duration:1000,
          });
        });
      },


      //重置搜索条件
      handleReset(){
        this.searchForm.stationId=null
      },
      //动态添加表单
      addDomain(){
        if(this.lunchForm.items.length>=10){
          this.$message({
            message: '最多只能添加10个时间段！',
            type: 'info',
            duration:1000,
          });
          return
        }
        this.lunchForm.items.push({
          startTimeStamp:'',
          endTimeStamp:'',
          price:'',
        })
      },
      //动态删除表单
      removeDomain(index){
        if(this.lunchForm.items.length<=1){
          this.$message({
            message: '至少要添加1个时间段！',
            type: 'info',
            duration:1000,
          });
        }else{
          this.lunchForm.items.splice(index, 1)
        }
      },
      //---------------------------------------------
      //确认添加
      Add(){
        this.$refs.lunchForm.validate(async (valid)=>{
          if(valid){
            PriceApi.lunchList({stationId:this.lunchForm.stationId}).then(res=>{
              if(res.list.length>0){
                this.$message({
                  message: '该据点已存在餐补设定！',
                  type: 'warning',
                  duration:3000,
                })
              }else{
                var exist
                var data=Fun.DeepClone(this.lunchForm)
                data.items.map(i=>{
                  var list=data.items.filter(n=>{//去除本身返回新数组
                    return data.items.indexOf(i)!=data.items.indexOf(n)
                  })
                  list.map(x=>{//将每一项与其他项比较
                    var i_timestar=new Date("2000/01/01 "+i.startTimeStamp)
                    var i_timeend=new Date("2000/01/01 "+i.endTimeStamp)
                    var x_timestar=new Date("2000/01/01 "+x.startTimeStamp)
                    var x_timeend=new Date("2000/01/01 "+x.endTimeStamp)
                    if((i_timestar<x_timeend&&i_timestar>x_timestar)||(i_timeend<x_timeend&&i_timeend>x_timestar)||(i_timestar<x_timestar&&i_timeend>x_timeend)){//判断时间范围是否重叠
                      exist=true
                    }else{
                      exist=false
                    }
                  })
                })
                if(exist){
                  this.$message({
                    message: '时间段重叠！',
                    type: 'warning',
                    duration:3000,
                  })
                }else{
                  PriceApi.lunchAddUp(data).then(res=>{
                    this.$message({
                      message: '添加成功！',
                      type: 'success',
                      duration:1000,
                    })
                    this.GetLunchList(1)
                    this.dialogVisible = false//关闭对话框
                  }).catch(err=>{console.log(err)})
                }
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
        this.$refs.lunchForm.validate(async (valid)=>{
          if(valid){
            var exist
            var data=Fun.DeepClone(this.lunchForm)
            data.items.map(i=>{//去除本身返回新数组
              var list=data.items.filter(n=>{
                return data.items.indexOf(i)!=data.items.indexOf(n)
              })
              list.map(x=>{//将每一项与其他项比较
                var i_timestar=new Date("2000/01/01 "+i.startTimeStamp)
                var i_timeend=new Date("2000/01/01 "+i.endTimeStamp)
                var x_timestar=new Date("2000/01/01 "+x.startTimeStamp)
                var x_timeend=new Date("2000/01/01 "+x.endTimeStamp)
                if((i_timestar<x_timeend&&i_timestar>x_timestar)||(i_timeend<x_timeend&&i_timeend>x_timestar)||(i_timestar<x_timestar&&i_timeend>x_timeend)){//判断时间范围是否重叠
                  exist=true
                }else{
                  exist=false
                }
              })
            })
            if(exist){
              this.$message({
                message: '时间段重叠！',
                type: 'warning',
                duration:3000,
              })
            }else{
              PriceApi.lunchAddUp(data).then(res=>{
                this.$message({
                  message: '修改成功！',
                  type: 'success',
                  duration:1000,
                })
                this.GetLunchList(this.searchForm.page)
                this.dialogVisible = false//关闭对话框
              }).catch(err=>{console.log(err)})
            }
          }else{
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
          PriceApi.lunchRemove({priceId:row.priceId}).then(res=>{
            this.$message({
              message: '删除成功！',
              type: 'success',
              duration:1000,
            })
            this.GetLunchList(this.searchForm.page)
          }).catch(err=>{console.log(err)})
        }).catch(err=>{console.log(err);})
      },
      //--------------------------------------------------------
      //编辑赋值
      Edit(index,row){
        console.log(row);
        this.disabled=true
        this.dialogTitle = '修改餐补'
        var newItems=[]
        this.lunchForm.priceId=Fun.DeepClone(row.priceId)
        this.lunchForm.stationId=Fun.DeepClone(row.stationId)
        this.lunchForm.items=Fun.DeepClone(row.items)

        this.dialogVisible = true
      },
      //关闭对话框
      DialogClose(){
        this.lunchForm={
          priceId:null,//餐补配置表ID
          stationId:null,//据点ID
          items: [],//明细
        }
        this.$refs.lunchForm.resetFields()
      }
    },
    async created(){
        await this.GetStationList()
        await this.GetLunchList(1)
      }
    }
</script>
<style scoped>
</style>