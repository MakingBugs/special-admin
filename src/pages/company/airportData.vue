<template lang="html">
  <el-card class="box-card">
    <div class="search-bar">
      <el-form :inline="true" :model="searchData" size="small">
        <el-form-item label="省">
          <el-select v-model="searchData.provinceCode" placeholder="请选择" @change="provinceChange1">
              <el-option
              v-for="item in provinces"
              :key="item.code"
              :label="item.name"
              :value="item.code">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市">
          <el-select v-model="searchData.cityCode" placeholder="请选择" @change="cityChange1">
            <el-option
            v-for="item in citys1"
            :key="item.code"
            :label="item.name"
            :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区">
          <el-select v-model="searchData.areaCode" placeholder="请选择">
            <el-option
            v-for="item in areas1"
            :key="item.code"
            :label="item.name"
            :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机场名称">
          <el-input v-model="searchData.airportName" placeholder="机场名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="initList(1)" size="small">查询</el-button>
          <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div  class="tools-bar">
      <el-button type="success" icon="el-icon-plus" size="small" @click="dialogVisible = true;dialogTitle='新增机场';disabled = false;disabled2 = false">新增</el-button>
    </div>
    <div>
      <el-table :data="tableData" border fit>
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
          width="100">
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
          width="150"
          align="center">
          <template slot-scope="scope">
            <div>
              <el-button
                type="primary"
                size="mini"
                plain
                @click="handleEdit(scope.$index, scope.row,1)"
              >修改</el-button>
              <el-button
                size="mini"
                type="primary"
                plain
                @click="handleEdit(scope.$index, scope.row,2)">查看</el-button>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="onDialogClose()">
      <el-form ref="addForm" :rules="rules" :model="addForm" label-width="150px" style="width: 80%;" size="small">
        <el-form-item label="省份：" prop="provinceCode">
          <el-select v-model="addForm.provinceCode" :disabled="disabled" placeholder="请选择" @change="provinceChange2" style="width: 100%;">
              <el-option
              v-for="item in provinces"
              :key="item.code"
              :label="item.name"
              :value="item.code">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市：" prop="cityCode">
          <el-select v-model="addForm.cityCode" :disabled="disabled" placeholder="请选择" @change="cityChange2" style="width: 100%;">
            <el-option
            v-for="item in citys2"
            :key="item.code"
            :label="item.name"
            :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区/县：" prop="areaCode">
          <el-select v-model="addForm.areaCode" :disabled="disabled" placeholder="请选择" @change="areaChange" style="width: 100%;">
            <el-option
            v-for="item in areas2"
            :key="item.code"
            :label="item.name"
            :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机场名称" prop="airportName">
            <el-input v-model="addForm.airportName" :disabled="disabled" placeholder="机场名称"></el-input>
        </el-form-item>
        <el-form-item label="具体地址" prop="airportAddress">
          <el-input v-model="addForm.airportAddress" :disabled="disabled" placeholder="具体地址"></el-input>
        </el-form-item>
        <div v-for="(item, index) in addForm.items" style="position: relative;">
          <el-row>
            <el-col :span="12">
              <el-form-item label="航站楼名称"
              :prop="'items.' + index + '.terminalName'"
              :rules="{required: true, message: '名称不能为空', trigger: 'blur'}">
                <el-input v-model="item.terminalName" :disabled="disabled2"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地址":prop="'items.' + index + '.terminalAddress'"
              :rules="{required: true, message: '地址不能为空', trigger: 'change'}" label-width="50px" style="padding-left: 10px;">
                <el-input v-model="item.terminalAddress" :disabled="disabled2" autocomplete="off">
                    <el-button slot="append" icon="el-icon-search" @click="openMap(item)"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row> 
          <el-row>
              <el-col :span="12">
                  <el-form-item label="经度" :prop="'items.' + index + '.lon'"
                  :rules="{required: true, message: '经度不能为空', trigger: 'change'}">
                    <el-input v-model="item.lon" :disabled="disabled2"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item label="纬度" :prop="'items.' + index + '.lat'"
                  :rules="{required: true, message: '纬度不能为空', trigger: 'change'}" label-width="50px" style="padding-left: 10px;">
                    <el-input v-model="item.lat" :disabled="disabled2"></el-input>
                  </el-form-item>
              </el-col>
          </el-row> 
          <el-button v-if="index===0&&dialogTitle!='机场详情'" plain type="primary" @click.prevent="addDomain()" size="small" style="position: absolute;right: -70px;bottom: 18px;" icon="el-icon-plus"></el-button>
          <el-button v-if="index>0&&dialogTitle!='机场详情'" plain type="danger" @click.prevent="removeDomain(item)" size="small" style="position: absolute;right: -70px;bottom: 18px;" icon="el-icon-minus"></el-button>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="dialogTitle!='机场详情'" >
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="onDialogSubmit()" v-if="dialogTitle=='修改机场'">保存</el-button>
        <el-button size="small" type="primary" @click="onDialogSubmit()" v-else>立即创建</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择航站楼" :visible.sync="subdialogVisible">
        <el-form inline size="mini">
            <el-form-item>
                <el-input id="suggestStart" v-model="searchAdresstext"></el-input>	
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="subdialogVisible = false">确认</el-button>
            </el-form-item>
        </el-form>
        <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div>
        <div id="XSDFXPage" ref="mapDig" class="XSDFXPage"></div>
    </el-dialog>
  </el-card>
</template>
<script>
    import { cityList } from '@/api/common'
    import { airportDataList,airportDataStatus,airportDataSave,airportDataUpdate} from '@/api/company'
    import BaiduMap from '@/utils/map/baidu-map';
    export default {
        data() {
            return {
                totalRecord: 0,
                pageSize: 10,
                tableLoading: false,
                dialogVisible: false,
                dialogTitle: '',
                subdialogVisible:false,
                searchAdresstext:'',//搜索地址回显
                disabled:false,
                disabled2:false,
                provinces:[],
                citys1:[],
                areas1:[],//搜索
                citys2:[],
                areas2:[],//表单
                searchData: {
                    airportName: '',
                    provinceCode: '',
                    cityCode: '',
                    areaCode: '',
                    page:1
                },
                addForm: {
                    airportId:null,
                    provinceCode: null, 
                    provinceName: '',
                    cityCode: null,
                    cityName: '',
                    areaCode: null,
                    areaName: '',
                    airportName:'', //机场名称
                    airportAddress:'',//机场地址
                    items:[{terminalName:'',terminalAddress:'',lon:'',lat:'',terminalId:''}],
                    deletedIds:'',
                },
                rules: {
                    stationName: [{required: true,message: '据点名称不能为空',trigger: 'blur'}],
                    provinceCode: [{required: true,message: '请选择省份',trigger: 'blur'}],
                    cityCode: [{required: true,message: '请选择城市',trigger: 'blur'}],
                    areaCode: [{required: true,message: '请选择区县',trigger: 'blur'}],
                    airportName: [{required: true,message: '机场名称不能为空',trigger: 'blur'}],
                    airportAddress: [{required: true,message: '具体地址不能为空',trigger: 'blur'}],
                },       
                tableData: [],
                rowData:[
                  {name:'provinceName',text:'省'},
                  {name:'cityName',text:'市'},
                  {name:'areaName',text:'区'},
                  {name:'airportName',text:'机场名称'},
                  {name:'airportAddress',text:'地址'},
                ]
            }
        },
        created() {
            this.initList(1);
            this.provinceData();
        },
        methods: {
            async initList(val) {
                this.searchData.page = val;
                const data = await airportDataList(this.searchData)
                this.tableData = data.list
                this.totalRecord = data.pageInfo.totalSize
            },
            async provinceData() {
                this.provinces = await cityList({queryType:1})
            },
            //删除航站楼
            removeDomain(item) {
              if(item.terminalId){
                if(this.addForm.deletedIds){
                  this.addForm.deletedIds += (','+item.terminalId)
                }else{
                  this.addForm.deletedIds = item.terminalId
                }
              }
              let index = this.addForm.items.indexOf(item)
              this.addForm.items.splice(index, 1)
            },
            //添加航站楼
            addDomain() {
              this.$refs.addForm.validate((valid) => {
                if (valid) {
                   this.addForm.items.push({terminalName:'',terminalAddress:'',lon:'',lat:''});
                }
              })
            },
            //打开地图——搜索起点/终点
            openMap(item){
                // if(this.dataSubForm.provinceCode===710000){//台湾省
                // }
                this.subdialogVisible = true
                let that = this;
                BaiduMap.init().then((BMap) => {
                    var map = new BMap.Map("XSDFXPage",{enableMapClick:false});//
                    // 初始化地图,设置中心点坐标和地图级别
                    map.centerAndZoom(new BMap.Point(120.20000,30.26667), 14);
                    // 添加地图类型控件
                    // map.addControl(new BMap.MapTypeControl());  
                    // 设置地图显示的城市 此项是必须设置的
                    let cityName = that.addForm.cityName ? that.addForm.cityName : "杭州"
                    map.setCurrentCity("杭州");    
                    // 开启鼠标滚轮缩放      
                    map.enableScrollWheelZoom(true);
                    var ac = new BMap.Autocomplete({//建立一个自动完成的对象
                        "input" : "suggestStart"
                        ,"location" : map
                    });
                    ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
                        clickList(e)
                    });
                    var myValue;
                    function clickList(e){
                          var _value = e.item.value;
                          myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                          document.getElementById("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
                          map.clearOverlays();    //清除地图上所有覆盖物
                          function myFun(){
                              if(local.getResults().getPoi(0)){
                                  var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                                  map.centerAndZoom(pp, 14);
                                  map.addOverlay(new BMap.Marker(pp));    //添加标注
                                  item.terminalAddress = myValue
                                  item.lon = pp.lng
                                  item.lat = pp.lat
                              }
                          }
                          var local = new BMap.LocalSearch(map, { //智能搜索
                              onSearchComplete: myFun
                          });
                          local.search(myValue);
                      }
                  })
            },
            provinceChange1(selVal){
                this.searchData.cityCode = ''
                this.searchData.areaCode = '' 
                this.areas1 = []
                if(selVal){
                  cityList({queryType:2,provinceCode:selVal}).then(result=>{
                    this.citys1 = result
                  })
                }
            },
            provinceChange2(selVal){
                this.addForm.cityCode = ''
                this.addForm.areaCode = ''
                this.areas2 = []
                if(selVal){
                  let obj = this.provinces.find((item)=>{
                    return item.code === selVal;
                  });
                  this.addForm.provinceName=  obj.name
                  cityList({queryType:2,provinceCode:selVal}).then(result=>{
                    this.citys2 = result
                  })
                }
            },
            cityChange1(selVal){               
                this.searchData.areaCode = ''
                if(selVal){
                  cityList({queryType:3,cityCode:selVal}).then(result=>{
                    this.areas1 = result
                  })
                }
            },
            cityChange2(selVal){               
                this.addForm.areaCode = ''
                if(selVal){
                  let obj = this.citys2.find((item)=>{
                    return item.code === selVal;
                  });
                  this.addForm.cityName =  obj.name
                  cityList({queryType:3,cityCode:selVal}).then(result=>{
                    this.areas2 = result
                  })
                }
            },
            areaChange(selVal){
                if(selVal){
                  let obj = this.areas2.find((item)=>{
                    return item.code === selVal;
                  });
                  this.addForm.areaName=  obj.name
                }
            },            
            //重置搜索条件
            handleReset() {
                this.searchData={
                    stationId: '',
                    stationName: '',
                    provinceCode: '',
                    cityCode: '',
                    areaCode: '',
                    page:this.searchData.page
                }
                this.citys1 = ''
                this.areas1 = ''
                // this.onSearch()
            },
            //修改机场弹窗信息
            handleEdit(index, row,type) {
                this.dialogVisible = true
                if(type===1){
                  this.dialogTitle = '修改机场'
                  this.disabled2 = false
                }else if(type===2){
                  this.dialogTitle = '机场详情'
                  this.disabled2 = true
                }
                this.disabled = true
                cityList({queryType:2,provinceCode:row.provinceCode}).then(result=>{
                    this.citys2 = result
                  })
                cityList({queryType:3,cityCode:row.cityCode}).then(result=>{
                    this.areas2 = result
                })
                this.$nextTick(() => {
                  for (let x of Object.keys(this.addForm)) {
                    if(x==='items'){
                      this.addForm[x] = JSON.parse(JSON.stringify(row[x]))
                    }else{
                      this.addForm[x] = row[x]
                    }
                  }
                  if(!row.items||row.items.length<1){
                    this.addForm.items = [{terminalName:'',terminalAddress:'',lon:'',lat:'',terminalId:''}]
                  }
                })
            },
            //保存机场
            onDialogSubmit() {
              this.$refs.addForm.validate((valid) => {
                if (valid) {
                  if(this.dialogTitle == '新增机场'){
                    airportDataSave(this.addForm).then(response => {
                      this.$message({type: 'success',message: '保存成功！'});
                      this.dialogVisible=false
                      this.initList(this.searchData.page)
                    })
                  }else{
                    airportDataUpdate(this.addForm).then(response => {
                      this.$message({ type: 'success',message: '修改成功！'});
                      this.dialogVisible=false
                      this.initList(this.searchData.page)
                    })
                  }
                }
              });
            },
            //禁启用
            handleStatus(row) {
              const tip = row.status==1?"启用成功":"禁用成功"
              const type = row.status==1?"success":"info"
              const status = row.status===1?2:1
              airportDataStatus({airportId:row.airportId,status:status}).then(response=>{
                this.$message({
                  message: tip,
                  type: type,
                  duration:1000,
                });
              });
            },
            //关闭弹窗
            onDialogClose() {
                this.addForm = {
                    airportId:null,
                    provinceCode: null, 
                    provinceName: '',
                    cityCode: null,
                    cityName: '',
                    areaCode: null,
                    areaName: '',
                    airportName:'', //机场名称
                    airportAddress:'',//机场地址
                    items:[{terminalName:'',terminalAddress:'',lon:'',lat:'',terminalId:''}],
                }
                this.citys2 = ''
                this.areas2 = ''
                this.$refs.addForm.resetFields()
            },
            //切换页
            handleCurrentChange(val) {             
              this.initList(val)
            },
        }
    }
</script>
