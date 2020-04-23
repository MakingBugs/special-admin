<template>
  <el-card class="box-card">
    <div class="search-bar">
      <el-form :inline="true" size="small">
        <el-form-item label="县/市" prop="twCityCode">
          <el-select v-model="SearchForm.twCityCode" @change="cityChange" clearable placeholder="请选择">
            <el-option
              v-for="item in cityList"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区" prop="twAreaCode">
          <el-select v-model="twAreaCode" @change="areaChange" clearable placeholder="请选择">
            <el-option
              v-for="item in areaList"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="乡镇" prop="twTownCode">
          <el-select v-model="SearchForm.twTownCode" clearable placeholder="请选择">
            <el-option
              v-for="item in townList"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机场" prop="airportId">
          <el-select v-model="SearchForm.airportId" clearable placeholder="请选择">
            <el-option
              v-for="item in airportList"
              :key="item.airportId"
              :label="item.airportName"
              :value="item.airportId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆类型" prop="vehicleId">
          <el-select v-model="SearchForm.vehicleId" clearable placeholder="请选择">
            <el-option
              v-for="item in vehicleclassList"
              :key="item.value"
              :label="item.desc"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="gettwPriceList(1)">查询</el-button>
          <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div  class="tools-bar">
      <el-button type="success" icon="el-icon-plus" size="small" @click="dialogVisible = true;dialogTitle='新增定价';isEdit=false;AddOrUpdate=1">新增</el-button>
    </div>
    <div>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="twCityName"
          label="县/市"
          align="center">
        </el-table-column>
        <el-table-column
          prop="twTownName"
          label="乡镇"
          align="center">
        </el-table-column>
        <el-table-column
          prop="airportName"
          label="机场"
          align="center">
        </el-table-column>
        <el-table-column
          prop="vehicleName"
          label="车辆类型"
          align="center">
        </el-table-column>
        <el-table-column
          prop="price"
          label="费用(RMB)"
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
              :inactive-value="0"
              active-color="#13ce66"
              @change="handleStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="维护"
          width="150"
          align="center">
          <template slot-scope="scope">
            <div>
              <el-button style="width:100%" type="primary" size="mini" plain @click="Edit(scope.$index, scope.row);AddOrUpdate=2">维护</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-bar">
        <el-pagination
          :current-page="SearchForm.page"
          @current-change="gettwPriceList"
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
    width="30%"
    @closed="DialogClose">
    <el-form ref="Form" :rules="Rules" :model="Form" label-width="90px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="县/市" prop="twCityCode">
            <el-select v-if="!isEdit" v-model="Form.twCityCode" clearable placeholder="请选择" @change="dialogcityChange" style="width: 85%;">
              <el-option
                v-for="item in cityList"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
           <span v-if="isEdit">{{Form.twCityName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="!isEdit">
        <el-col :span="24">
          <el-form-item label="区" prop="twAreaCode">
            <el-select v-model="Form.twAreaCode" clearable placeholder="请选择" @change="dialogareaChange" style="width: 85%;">
              <el-option
                v-for="item in dialogareaList"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="乡镇" prop="twTownCode">
            <el-select v-if="!isEdit" v-model="Form.twTownCode" clearable placeholder="请选择" @change="dialogtownChange" style="width: 85%;">
              <el-option
                v-for="item in dialogtownList"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
            <span v-if="isEdit">{{Form.twTownName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="机场" prop="airportId">
            <el-select v-if="!isEdit" v-model="Form.airportId" clearable placeholder="请选择" style="width: 85%;">
              <el-option
                v-for="item in airportList"
                :key="item.airportId"
                :label="item.airportName"
                :value="item.airportId">
              </el-option>
            </el-select>
            <span v-if="isEdit">{{airportName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item  label="车辆类型" prop="vehicleId">
            <el-select v-if="!isEdit" v-model="Form.vehicleId" clearable placeholder="请选择" style="width: 85%;">
              <el-option
                v-for="item in vehicleclassList"
                :key="item.value"
                :label="item.desc"
                :value="item.value">
              </el-option>
            </el-select>
            <span v-if="isEdit">{{vehicleName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="费用(RMB)" prop="price">
            <el-input @input="e=>Form.price=FilterNum(e)" v-model="Form.price" placeholder="请输入费用" controls-position="right" style="width:85%;"></el-input>
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
import { getOssAuthInfo,optionsList,cityList} from '@/api/common'
import { airportDataList} from '@/api/company'
import PriceApi from '../../api/price'
import Fun from '../../../public/function'
export default {
      data() {
        return {

          cityList:[],//县/市列表
          areaList:[],//区列表
          townList:[],//乡镇列表
          airportList:[],//机场列表
          vehicleclassList:[],//车类型列表

          dialogareaList:[],//区列表(对话框)
          dialogtownList:[],//乡镇列表(对话框)
          
          twAreaCode:null,
          SearchForm:{
            twCityCode:null,
            twTownCode:null,
            airportId:null,
            vehicleId:null,
            page:1,
          },

          airportName:'',
          vehicleName:'',
          Form:{
            twCityName:'',
            twCityCode:null,
            twTownCode:null,
            twTownName:'',
            twAreaCode:null,
            twAreaName:'',
            airportId:null,
            vehicleId:null,
            price:null,
            priceId:null
          },
          tableData: [],

          dialogTitle:'',//对话框标题
          AddOrUpdate:1,//指定对话框按钮1：添加 2：更新
          totalSize:null,//数据总条数
          dialogVisible:false,//对话框状态   也用以重新渲染 time-select 控件
          isEdit:false,//是否禁用下拉框

          Rules:{//验证规则
            twCityCode:[Fun.Check.required.select("请选择县/市！")],
            twAreaCode:[Fun.Check.required.select("请选择区！")],
            twTownCode:[Fun.Check.required.select("请选择乡镇！")],
            airportId:[Fun.Check.required.select("请选择服机场！")],
            vehicleId:[Fun.Check.required.select("请选择车辆类型！")],
            price:[Fun.Check.required.req("请输入费用！")]
          },

        }
      },
      async created(){
        await this.getcityList()
        await this.getairportList()
        await this.getvehicleclassList()
        await this.gettwPriceList(1)
      },
      methods: {
        //输入金额时进行过滤
        FilterNum(e){
          return e.replace(/\D/g, '')
        },
        //选择县/市
        async cityChange(citycode){
          this.areaList=[]
          this.townList=[]
          this.SearchForm.twTownCode=null
          if(citycode){
            await this.getareaList(citycode,false)
          }
        },
        //选择县/市(对话框)
        async dialogcityChange(cityCode){
          this.dialogareaList=[]
          this.Form.twAreaCode=null
          this.Form.twAreaName=''
          this.dialogtownList=[]
          this.Form.twTownCode=null
          this.Form.twTownName=''
          if(cityCode){
            this.cityList.map(x=>{
              if(x.code==cityCode)
                this.Form.twCityName=x.name
            })
            await this.getareaList(cityCode,true)
          }
        },
        //选择区
        async areaChange(areaCode){
          this.townList=[]
          this.SearchForm.twTownCode=null
          if(areaCode){
            await this.gettownList(areaCode,false)
          }
        },
        //选择区(对话框)
        async dialogareaChange(areaCode){
          this.dialogtownList=[]
          this.Form.twTownCode=null
          this.Form.twTownName=''
          if(areaCode){
            await this.gettownList(areaCode,true)
          }
        },
        //选择乡镇(对话框)
        async dialogtownChange(townCode){
          if(townCode){
            this.dialogtownList.map(x=>{
              if(x.code===townCode)
                this.Form.twTownName=x.name
            })
          }
        },

        //获取县/市列表
        async getcityList() {
          await cityList({queryType:2,provinceCode:710000}).then(res=>{
            this.cityList = res
          }).catch(err=>{console.log(err);})
        },
        //获取区列表
        async getareaList(citycode,isDialog) {
          await cityList({queryType:3,cityCode:citycode}).then(res=>{
            if(isDialog){
              this.dialogareaList=res
            }else{
              this.areaList = res
            }
          }).catch(err=>{console.log(err);})
        },
        //获取乡镇列表
        async gettownList(areaCode,isDialog) {
          await cityList({queryType:4,areaCode:areaCode}).then(res=>{
            if(isDialog){
              this.dialogtownList=res
            }else{
              this.townList = res
            }
          }).catch(err=>{console.log(err);})
        },
        //获取台湾机场列表
        async getairportList(){
          await airportDataList({provinceCode:710000}).then(res=>{
            this.airportList=res.list
          }).catch(err=>{console.log(err);})
        },
        //获取台湾车型列表
        async getvehicleclassList(){
          await optionsList({dictionaryCodes:["VEHICLE_CLASS"],region:2}).then(res=>{
            this.vehicleclassList=res[0].list
          }).catch(err=>{console.log(err);})
        },
        //获取台湾基础定价列表
        async gettwPriceList(page){
          this.tableData=[]
          this.SearchForm.page=page
          await PriceApi.twPriceList(this.SearchForm).then(res=>{
            this.tableData=res.list
            this.totalSize=res.pageInfo.totalSize
          }).catch(err=>{console.log(err);})
        },
        //启用/禁用
        handleStatus(row){
          const tip = row.status==1?"启用成功":"禁用成功"
          const type = row.status==1?"success":"info"
          PriceApi.twPriceSave({priceId:row.priceId,status:row.status}).then(res=>{
            this.$message({
              message: tip,
              type: type,
              duration:1000,
            });
          });
        },
        //重置搜索条件
        handleReset() {
          this.twAreaCode=null,
          this.SearchForm={
            twCityCode:null,
            twTownCode:null,
            airportId:null,
            vehicleId:null,
            page:1,
          }
        },
        //编辑赋值
        async Edit(index,row){
          this.dialogTitle = '修改定价'
          this.isEdit=true
          await this.dialogcityChange(row.twCityCode)
          await this.dialogareaChange(row.twAreaCode)
          this.airportName=row.airportName
          this.vehicleName=row.vehicleName
          console.log(row);
          this.Form.twCityCode=row.twCityCode
          this.Form.twCityName=row.twCityName
          this.Form.twTownCode=row.twTownCode
          this.Form.twTownName=row.twTownName
          this.Form.airportId=row.airportId
          this.Form.vehicleId=row.vehicleId
          this.Form.price=row.price
          this.Form.priceId=row.priceId
          this.Form.status=row.status

          

          this.dialogVisible = true
        },
 
        //--------------------------------------
        //确认添加
        Add(){
          console.log(this.Form);
          this.$refs.Form.validate(async (valid)=>{
            if(valid){
              var data=Fun.DeepClone(this.Form)
              delete data.twAreaName
              delete data.twAreaCode
              PriceApi.twPriceSave(data).then(res=>{
                this.$message({
                  message: '添加成功！',
                  type: 'success',
                  duration:1000,
                })
                this.gettwPriceList(1)
                this.dialogVisible = false//关闭对话框
              }).catch(err=>{console.log(err)})
            }
            else{
              return
            }
          })
        },
        //确认修改
        Update(){
          this.$refs.Form.validate(async (valid)=>{
            if(valid){
              var data=Fun.DeepClone(this.Form)
              PriceApi.twPriceSave(data).then(res=>{
                this.$message({
                  message: '修改成功！',
                  type: 'success',
                  duration:1000,
                })
                this.gettwPriceList(this.SearchForm.page)
                this.dialogVisible = false//关闭对话框
              }).catch(err=>{console.log(err)})
            }
            else{
              return
            }
          })
        },
        //关闭对话框
        DialogClose(){
          this.airportName='',
          this.vehicleName='',
          this.Form={
            twCityName:'',
            twCityCode:null,
            twTownCode:null,
            twTownName:'',
            twAreaCode:null,
            twAreaName:'',
            airportId:null,
            vehicleId:null,
            price:null,
            priceId:null
          }
          this.$refs.Form.resetFields()
        }
      }
    }
</script>
<style scoped>
</style>