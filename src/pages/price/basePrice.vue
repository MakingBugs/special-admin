<template>
    <el-card class="box-card">
        <div class="search-bar">
            <el-form :inline="true" :model="searchData" class="fl" size="small">
            <el-form-item label="订单类型">
                <el-select v-model="searchData.orderType" clearable placeholder="请选择">
                <el-option v-for="item in orderTypeoptions" :key="item.value" :label="item.desc" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务据点">
                <el-select v-model="searchData.stationId" clearable placeholder="请选择" @change="stationChange">
                <el-option v-for="item in stationoptions" :key="item.value" :label="item.desc" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="车辆类型">
                <el-select v-model="searchData.vehicleId" clearable placeholder="请选择">
                <el-option v-for="item in vehicleIdoptions" :key="item.value" :label="item.desc" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="initList">查询</el-button>
                <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
            </el-form-item>
            </el-form>
        </div>
        <div class="tools-bar">
            <el-button type="success" icon="el-icon-plus" size="small" @click="dialogVisible = true;disabled=false;dialogTitle='新增基本定价'">新增</el-button>
        </div>
        <div>
            <el-table :data="tableData" :loading="loading" border fit highlight-current-row style="width: 100%">
                <el-table-column v-for="item in rowData" :key="item.name" :prop="item.name" :label="item.text" align="center"></el-table-column>
                <el-table-column label="里程(非包车游)" align="center">  
                    <template slot-scope="scope">
                      <div v-for="item in scope.row.items">{{item.startDistance}} ~ {{item.endDistance}}</div>
                    </template> 
                  </el-table-column>
                 <el-table-column label="包车小时数(包车游)" align="center">
                  <template slot-scope="scope">
                    <div v-for="item in scope.row.items">{{item.startDuration}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="公里数(包车游)" align="center">
                  <template slot-scope="scope">
                    <div v-for="item in scope.row.items">{{item.endDistance}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="金额" align="center">
                  <template slot-scope="scope">
                    <div v-for="item in scope.row.items">{{item.price}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <div>
                            <el-button type="primary" size="mini" plain @click="Edit(scope.$index, scope.row)">编辑</el-button>
                            <el-button type="danger" size="mini" plain @click="Remove(scope.$index, scope.row)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
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
        <!-- 添加 -->
        <el-dialog
          :title="dialogTitle"
          :visible.sync="dialogVisible"
          width="55%"
          @closed="DialogClose()">
            <el-form ref="dataForm" :inline="true" :model="dataForm">
                <el-form-item label="价格配置名称"  prop="vehicleId">
                  <el-input v-model="dataForm.priceName" style="width: 80%;" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="订单类型" prop="orderType">
                    <el-select v-model="dataForm.orderType" placeholder="请选择" style="width: 80%;" :disabled="disabled">
                        <el-option v-for="item in orderTypeoptions" :key="item.value" :label="item.desc" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务据点" prop="stationId">
                    <el-select v-model="dataForm.stationId" clearable placeholder="请选择" style="width: 80%;" :disabled="disabled" @change="stationChange">
                        <el-option v-for="item in stationoptions" :value="item.value" :key="item.value" :label="item.desc"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="车辆类型" prop="vehicleId">
                    <el-select v-model="dataForm.vehicleId" clearable placeholder="请选择" style="width: 80%;" :disabled="disabled">
                        <el-option v-for="item in vehicleIdoptions" :value="item.value" :key="item.value" :label="item.desc">
                        </el-option>
                    </el-select>
                </el-form-item>
              <el-row v-for="(item,index) in dataForm.items"  :key="index">
                <el-col :span="14" v-if="dataForm.orderType!==2">
                  <el-form-item :label="'里程'+(index+1)" :prop="'items.'+index+'.startDistance'" >
                    <el-input-number placeholder="最小值" v-model="item.startDistance" controls-position="right"></el-input-number>
                  </el-form-item>
                  <el-form-item :prop="'items.'+index+'.endDistance'">
                    <el-input-number placeholder="最大值" v-model="item.endDistance" controls-position="right"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="7" v-if="dataForm.orderType===2">
                  <el-form-item :label="'包车时数'+(index+1)" :prop="'items.'+index+'.endDuration'">
                    <el-input-number placeholder="包车时数" v-model="item.startDuration" controls-position="right"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="7" v-if="dataForm.orderType===2">
                  <el-form-item :label="'公里数'+(index+1)" :prop="'items.'+index+'.endDistance'">
                    <el-input-number placeholder="公里数" v-model="item.endDistance" controls-position="right"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item :label="'金额'+(index+1)" :prop="'items.'+index+'.price'" :rules="[{required: true, message: '请填写金额！'}]">
                    <el-input-number v-model="item.price">></el-input-number>
                    <el-button  type="danger" style="margin-left: 15px" @click.prevent="removeDomain(index)">删除</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button style="float:left" @click="addDomain">新增定价</el-button>
              <el-button size="medium" @click="cancel()">取 消</el-button>
              <el-button size="medium" type="primary" @click="Update()" v-if="dialogTitle=='修改基本定价'">保存</el-button>
              <el-button size="medium" type="primary" @click="Add()" v-else>立即创建</el-button>
            </span>
      </el-dialog>
    </el-card>
</template>
<script>
import { optionsList } from '@/api/common'
import PriceApi from '@/api/price'
import DiscountApi from '../../api/discount'
import Fun from '../../../public/function'
import { log } from 'util';
export default {
  data() {
    return {
      loading:true,//列表加载状态
      mergingRows:[],
      tableData: [],
      disabled:false,//是否禁用下拉框
      isdisabled:false,//是否为只读
      dialogTitle:'',//对话框标题
      dialogVisible:false,//对话框状态
      totalRecord: 0,//分页总条数
      pageSize: 10,//页面显示条数
      dialogTitle:'新增基本定价',
      stationoptions:[],//服务据点
      vehicleIdoptions:[],//车辆类型
      orderTypeoptions:[],//订单类型
      //查询条件
      searchData: {
          orderType: '',//订单类型
          stationId: '',//据点
          vehicleId: '',//车辆类型
          page: 1
      },
      rowData:[
          {name:'priceName',text:'价格配置名称'},
          {name:'orderTypeDesc',text:'订单类型'},
          {name:'stationName',text:'服务据点'},
          {name:'vehicleName',text:'车辆类型'}
      ],
      //弹框的字段
      dataForm:{
          priceId:null,//ID
          priceName:'',
          orderType:'',//订单类型
          stationId:'',//服务据点
          vehicleId:'',//车辆类型
          items:[]
      },
    };
  },
  created() {
      this.initList();
      this.selectList();
  },
  methods: {
      cancel(){
        this.dialogVisible = false;
        this.selectList()
      },
      //查询列表
      async initList(){
          this.tableData=[]
          const data = await PriceApi.basePriceList(this.searchData)
          // if(data!==null){
          //    data.list.map(x=>{
          //     if(x.items.length<=0){
          //       var value=Fun.DeepClone(x)
          //       this.tableData.push(value)
          //     }
          //     x.items.map(y=>{
          //       var a=Fun.DeepClone(x)
          //       var b=Fun.DeepClone(y)
          //       var obj=Object.assign(a,b)
          //       this.tableData.push(obj)
          //       })
          //     })
              this.tableData = data.list
              this.totalRecord = data.pageInfo.totalSize
              // this.dataPretreatment()
              this.loading=false
          // }
      },
      //查询下拉框列表
      async selectList(){
          //订单类型
          const data2 = await optionsList({dictionaryCodes:["ORDER_TYPE"]});
          if(data2.length>0){
              this.orderTypeoptions = data2[0].list;
          }
          //据点
          const data = await optionsList({dictionaryCodes:["STATION"],region:1});
          if(data.length>0){
              this.stationoptions = data[0].list;
          }
          //车辆类型
          const data1 = await optionsList({dictionaryCodes:["VEHICLE_CLASS"],region:1});
          if(data1.length>0){
              this.vehicleIdoptions = data1[0].list;
          }
      },
      // //计算出要合并的行
      // dataPretreatment(){
      //   this.mergingRows=[]
      //   let mergingPos=null;
      //   for(let i=0;i<this.tableData.length;i++){
      //     if(i==0){
      //       this.mergingRows.push(1)
      //       mergingPos=0
      //     }else{
      //       if(this.tableData[i].priceId===this.tableData[i-1].priceId){
      //         this.mergingRows[mergingPos] +=1
      //         this.mergingRows.push(0)
      //       }else{
      //         this.mergingRows.push(1)
      //         mergingPos = i
      //       }
      //     }
      //   }
      // },
      // mergeRows({row,column,rowIndex,columnIndex}){
      //     if(columnIndex===0||columnIndex===1||columnIndex===2||columnIndex===3||columnIndex===8){
      //         const _row=this.mergingRows[rowIndex]
      //         const _col=_row>0? 1:0
      //         if(row.stationId){
      //           return[_row,_col]
      //         }
      //     }
      // },
      //重置搜索条件
      handleReset() {
        this.searchData = {
          orderType: '',//区域
          stationId: '',//据点
          vehicleId: '',//车辆类型
          page: 1
        }
        this.selectList();
      },
      //动态添加表单
      addDomain(){
        // if(this.dataForm.items.length>=10){
        //   this.$message({
        //     message: '最多只能添加10个定价！',
        //     type: 'info',
        //     duration:1000,
        //   });
        //   return
        // }
        this.dataForm.items.push({
          startTimeStamp:'',
          endTimeStamp:'',
          price:0,
        })
      },
      //动态删除表单
      removeDomain(index){
        if(this.dataForm.items.length<=1){
          this.$message({
            message: '至少要添加1个定价！',
            type: 'info',
            duration:1000,
          });
        }else{
          this.dataForm.items.splice(index, 1)
        }
      },
      //---------------------------------------------
      //确认添加
      Add(){
        this.$refs.dataForm.validate(async (valid)=>{
          if(valid){
            if (this.dataForm.orderType!==2 && this.dataForm.items.some(x=>x.startDistance>=x.endDistance)) {
                this.$message({
                    type: 'warning',
                    message: '结束里程要大于或等于开始里程'
                })
            }else{
              var data=Fun.DeepClone(this.dataForm)
              PriceApi.basePriceAddUp(data).then(res=>{
                this.$message({
                  message: '添加成功！',
                  type: 'success',
                  duration:1000,
                })
                this.initList()
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
        this.$refs.dataForm.validate(async (valid)=>{
          if(valid){
            if (this.dataForm.orderType!==2 && this.dataForm.items.some(x=>x.startDistance>=x.endDistance)) {
                this.$message({
                    type: 'warning',
                    message: '结束里程要大于或等于开始里程'
                })
            }else{
              var data=Fun.DeepClone(this.dataForm)
              PriceApi.basePriceAddUp(data).then(res=>{
                this.$message({
                  message: '修改成功！',
                  type: 'success',
                  duration:1000,
                })
                this.initList()
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
          PriceApi.basePriceRemove({priceId:row.priceId}).then(res=>{
            this.$message({
              message: '删除成功！',
              type: 'success',
              duration:1000,
            })
            this.initList()
          }).catch(err=>{console.log(err)})
        }).catch(err=>{console.log(err);})
      },
      async stationChange(id) {
          this.dataForm.vehicleId=null;
          this.searchData.vehicleId=null;
          await this.getCarType(id)
      },
      async getCarType(id){
          if(id==''||id==null){
              id=0;
          }
          const data = await DiscountApi.discountGet(id);
          var a=data.map(i=>{
              return{
                  value:i.vehicleId,
                  desc:i.vehicleName
              }
          })
          this.vehicleIdoptions=a;
      },
      //--------------------------------------------------------
      //编辑赋值
      async Edit(index,row){
        this.disabled=true
        this.dialogTitle = '修改基本定价'
        await this.getCarType(row.stationId)
        var newItems=[]
        row.items.map(x=>{
          newItems.push(Fun.DeepClone(x))
        })
        this.dataForm.priceId=Fun.DeepClone(row.priceId)
        this.dataForm.priceName=Fun.DeepClone(row.priceName)
        this.dataForm.orderType=Fun.DeepClone(row.orderType)
        this.dataForm.vehicleId=Fun.DeepClone(row.vehicleId)
        this.dataForm.stationId=Fun.DeepClone(row.stationId)
        this.dataForm.items=newItems

        this.dialogVisible = true
      },
      //关闭对话框
      DialogClose(){
        this.dataForm={
          priceId:null,//ID
          priceName:'',
          orderType:'',//订单类型
          stationId:'',//服务据点
          vehicleId:'',//车辆类型
          items:[]
        }
      },
      //跳转到指定页
      handleCurrentChange(val) {
          this.searchData.page = val
          this.initList()
      },
  }
}
</script>
<style scoped>
</style>