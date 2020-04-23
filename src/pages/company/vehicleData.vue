<template lang="html">
  <el-card class="box-card">
    <div class="search-bar">
      <el-form :inline="true" :model="searchData" class="fl" size="small">
        <el-form-item label="车牌号">
          <el-input v-model="searchData.carPlateNumber" placeholder="车牌号"></el-input>
        </el-form-item>
        <el-form-item label="车辆品牌">
          <el-input v-model="searchData.carBrand" placeholder="车辆品牌"></el-input>
        </el-form-item>
        <el-form-item label="车辆状态">
          <el-select v-model="searchData.carStatus" placeholder="请选择">
              <el-option
                  v-for="item in carStatusList"
                  :key="item.value"
                  :label="item.desc"
                  :value="item.value">
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
      <el-button type="success" icon="el-icon-plus" size="small" @click="addEdit">新增</el-button>
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
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div>
              <el-button
                type="primary"
                size="mini"
                plain
                @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button>                
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
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="150px" style="width: 80%;" size="small">
          <el-form-item label="车辆编号" prop="carNumber">
            <el-input v-model="dataForm.carNumber" placeholder="车辆编号"></el-input>
          </el-form-item>
          <el-form-item label="车牌" prop="carPlateNumber">
            <el-input v-model="dataForm.carPlateNumber" placeholder="车牌"></el-input>
          </el-form-item>
          <el-form-item label="车辆颜色" prop="carColor">
            <el-input v-model="dataForm.carColor" placeholder="车辆颜色"></el-input>
          </el-form-item>
          <!-- <el-form-item label="车辆型号">
            <el-input v-model="dataForm.carModel" placeholder="车辆型号"></el-input>
          </el-form-item> -->
          <el-form-item label="据点" prop="stationId">
            <el-select v-model="dataForm.stationId" @change="stationChange" placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in stationList"
                  :value="item.id"
                  :key="item.id"
                  :label="item.name"
                  :disabled="item.status==2 ? true : false"
                >
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车辆类型" prop="vehicleId">
            <el-select v-model="dataForm.vehicleId" @change="vehicleChange" placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in vehicleList"
                  :value="item.id"
                  :key="item.id"
                  :label="item.name"
                  :disabled="item.status==2 ? true : false"
                >
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车型" prop="vehicleClassId">
            <el-select v-model="dataForm.vehicleClassId" placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in vehicleClassList"
                  :value="item.id"
                  :key="item.id"
                  :label="item.name"
                  :disabled="item.status==2 ? true : false"
                >
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车辆品牌" prop="carBrand">
              <el-input v-model="dataForm.carBrand" placeholder="车辆品牌"></el-input>
          </el-form-item>
          <el-form-item label="注册时间" prop="carRegisterDate">
              <el-date-picker
                v-model="dataForm.carRegisterDate"
                value-format="yyyy-MM-dd"
                type="date" style="width: 100%;"
                placeholder="选择日期">
              </el-date-picker>
          </el-form-item>
          <el-form-item label="车架号" prop="calssno">
              <el-input type="text" v-model="dataForm.calssno"></el-input>
          </el-form-item> 
          <el-form-item label="发动机号" prop="engineno">
            <el-input type="text" v-model="dataForm.engineno"></el-input>
          </el-form-item> 
          <el-form-item label="车辆状态" prop="carStatus">
            <el-select v-model="dataForm.carStatus" placeholder="请选择" style="width: 100%;">
                <el-option
                    v-for="item in carStatusList"
                    :key="item.value"
                    :label="item.desc"
                    :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>         
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="onDialogSubmit()" v-if="dialogTitle=='修改车辆'">保存</el-button>
        <el-button size="medium" type="primary" @click="onDialogSubmit()" v-else>立即创建</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
    import { optionsList } from '@/api/common'
    import { vehicleDataList,vehicleDataSave,vehicleRelation} from '@/api/company'
    export default {
        data() {
            return {
                totalRecord: 0,
                pageSize: 10,
                tableLoading: false,
                dialogVisible: false,
                dialogTitle: '',
                carStatusList:'',//车辆状态下拉框
                stationList:[],//据点下拉框
                vehicleList:[],//车型下拉框
                vehicleClassList:[],//车辆类型下拉框
                searchData: {
                    carPlateNumber: '',//车牌号
                    carBrand: '',
                    carStatus:null,//车辆状态
                    page:1
                },
                dataForm: {
                    carId:null, //车辆id
                    carNumber:'',//车辆编号
                    carPlateNumber:'',//车牌
                    carColor: '',//颜色
                    // carModel:'',//型号
                    stationId:null,
                    vehicleId:null, //车型id
                    vehicleClassId: null,//车辆类型id
                    carBrand:'',//品牌
                    carRegisterDate:'',//注册时间
                    calssno:'',  //车架号
                    engineno:'',  //发动机号
                    carStatus:null  //车辆状态
                },
                rules: {
                  carNumber: [{required: true,message: '车辆编号不能为空', trigger: 'blur'}],
                  carPlateNumber: [{required: true,message: '车牌不能为空', trigger: 'blur'}],
                  carColor: [{required: true,message: '颜色不能为空',trigger: 'blur'}],
                  stationId: [{required: true,message: '请选择据点', trigger: 'change'}],
                  vehicleId: [{required: true,message: '请选择车辆类型', trigger: 'change'}],
                  vehicleClassId:[{required: true,message: '请选择车型',trigger: 'change'}],
                  carBrand: [{required: true,message: '车辆品牌不能为空',trigger: 'blur'}],
                  carRegisterDate:[{required: true,message: '注册时间不能为空',trigger: 'blur'}],//注册时间
                  calssno:[{required: true,message: '车架号不能为空',trigger: 'blur'}],//车架号
                  engineno:[{required: true,message: '发动机号不能为空',trigger: 'blur'}],  //发动机号
                  carStatus: [{required: true,message: '请选择车辆状态',trigger: 'change'}],
                },   
                rowData:[
                  {name:'carPlateNumber',text:'车牌号'},
                  {name:'carBrand',text:'车辆品牌'},
                  {name:'carNumber',text:'车辆编号'},
                  {name:'carStatusDesc',text:'车辆状态'},
                  {name:'carColor',text:'车辆颜色'},
                ],    
                tableData: [],
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
                const data = await vehicleDataList(this.searchData)
                this.tableData = data.list
                this.totalRecord = data.pageInfo.totalSize
            },
            //查询下拉框列表
            async selectList() {
                this.carStatusList = (await optionsList({dictionaryCodes:["CAR_STATUS"]}))[0].list//车辆状态列表
                this.stationList = await vehicleRelation({queryType:1})
            },
            //重置搜索条件
            handleReset() {
                this.searchData = {
                    carPlateNumber: '',//车牌号
                    vehicleName: '',
                    carStatus:null,//车辆状态
                    page:this.searchData.page
                }
            },
            //新增
            addEdit(){
              this.dialogVisible = true;
              this.dialogTitle='新增车辆';
            },
            //修改车辆——弹窗信息
            handleEdit(index, row) {
                this.dialogVisible = true
                this.dialogTitle = '修改车辆'
                if(row.stationId){
                  vehicleRelation({queryType:2,stationId:row.stationId}).then(result=>{
                    this.vehicleList = result
                  })
                }
                if(row.vehicleId){
                  vehicleRelation({queryType:3,vehicleId:row.vehicleId}).then(result=>{
                    this.vehicleClassList = result
                  })
                }
                this.$nextTick(() => {
                  for (let x of Object.keys(this.dataForm)) {
                    this.dataForm[x] = row[x]                   
                  }
                })
              //   vehicleRelation({queryType:1}).then(result=>{
              //     this.stationList = result
              //     if(row.stationId){
              //       //判断是否含有当前据点
              //       let isContain1 = this.stationList.some(item=>{
              //         return (row.stationId === item.id);
              //       });
              //       //据点在列表里
              //       if(isContain1){
              //           vehicleRelation({queryType:2,stationId:row.stationId}).then(result=>{
              //             this.vehicleList = result
              //             //如果有车辆类型
              //             if(row.vehicleId){
              //               //判断是否含有当前车辆类型
              //               let isContain2 = this.vehicleList.some(item=>{
              //                 return (row.vehicleId === item.id);
              //               });
              //               //如果有当前车辆类型，就去加载车型
              //               if(isContain2){
              //                 // this.vehicleClassData(row.vehicleId)
              //                 vehicleRelation({queryType:3,vehicleId:vehicleId}).then(result=>{
              //                   this.vehicleClassList = result
              //                   //判断是否含有当前车型
              //                   let isContain3 = this.vehicleClassList.some(item=>{
              //                     return (row.vehicleClassId === item.id);
              //                   });
              //                   //如果有车型并且车型不在列表内
              //                   if(row.vehicleClassId&&!isContain3){
              //                     console.log(this.vehicleClassList);
              //                     this.vehicleClassList.push({id: row.vehicleClassId,name: row.className})
              //                   }
              //                 })
              //               }else{
              //                 this.vehicleList.push({id: row.vehicleId,name: row.vehicleName})
              //               }                            
              //             }else{//如果二级id不在列表，三级列表直接push一个
              //                 this.vehicleClassList = [{id: row.vehicleClassId,name: row.className}]
              //             }
              //           })
              //       }else{//禁用据点
              //           this.stationList.push({id: row.stationId,name: row.stationName})
              //           if(row.vehicleId){
              //               this.vehicleList = [{id: row.vehicleId,name: row.vehicleName}]
              //           }
              //           if(row.vehicleClassId){
              //               this.vehicleClassList = [{id: row.vehicleClassId,name: row.className}]
              //           }
              //       }
              //     }else{//没有据点
              //       if(row.vehicleId){
              //           this.vehicleList = [{id: row.vehicleId,name: row.vehicleName}]
              //       }
              //       if(row.vehicleClassId){
              //           this.vehicleClassList = [{id: row.vehicleClassId,name: row.className}]
              //       }
              //     }
              //   })
            },
            //监听据点变化
            stationChange(selVal){
                this.dataForm.vehicleId = ''
                vehicleRelation({queryType:2,stationId:selVal}).then(result=>{
                  this.vehicleList = result
                })
            },
            //监听车型变化
            vehicleChange(selVal){
                this.dataForm.vehicleClassId = ''
                vehicleRelation({queryType:3,vehicleId:selVal}).then(result=>{
                  this.vehicleClassList = result
                })
            },
            //保存车辆
            onDialogSubmit() {
              this.$refs.dataForm.validate((valid) => {
                if (valid) {
                  vehicleDataSave(this.dataForm).then(response => {
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
            //关闭弹窗
            onDialogClose() {
                this.dataForm = {
                    carId:null, //车辆id
                    carNumber:'',//车辆编号
                    carPlateNumber:'',//车牌
                    carColor: '',//颜色
                    // carModel:'',//型号
                    stationId:null,
                    vehicleId:null, //车型id
                    vehicleClassId: null,//车辆类型id
                    carBrand:'',//品牌
                    carRegisterDate:'',//注册时间
                    calssno:'',  //车架号
                    engineno:'',  //发动机号
                    carStatus:null  //车辆状态
                }
                this.$refs.dataForm.resetFields()
            },   
            //跳转到指定页
            handleCurrentChange(val) {
              this.initList(val)
            },
        },
    }
</script>
<style lang="scss">   
</style>