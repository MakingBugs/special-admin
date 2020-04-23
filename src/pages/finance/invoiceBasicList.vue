<template lang="html">
  <el-card class="box-card">
      <el-tabs v-model="searchData.invoiceType" @tab-click="handleClick">
          <el-tab-pane label="个人发票信息" name="1">
              <div class="search-bar">
                  <el-form :inline="true" :model="searchData" class="fl" size="small">
                    <el-form-item label="发票抬头">
                        <el-input v-model="searchData.companyTitle" placeholder="发票抬头"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话">
                        <el-input v-model.number="searchData.phone" placeholder="联系电话" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="initList(1)">查询</el-button>
                        <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
                    </el-form-item>
                  </el-form>
              </div>
              <div  class="tools-bar">
                  <el-button type="success" icon="el-icon-plus" size="small" @click="dialogVisible = true;">新增</el-button>             
              </div>
              <el-table :data="tableData" border>          
                  <el-table-column 
                      v-for="item in rowData1"
                      :prop="item.name"
                      :label="item.text"
                      align="center"
                      >
                  </el-table-column>
                  <el-table-column
                        label="操作"
                        align="center"
                        >
                        <template slot-scope="scope">
                        <div>
                            <el-button
                            type="primary"
                            size="mini"
                            plain
                            @click="handleEdit(scope.$index, scope.row)"
                            >修改</el-button>
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
          </el-tab-pane>
          <el-tab-pane label="企业发票信息" name="2">
              <div class="search-bar">
                <el-form :inline="true" :model="searchData" class="fl" size="small">
                  <el-form-item label="发票抬头">
                      <el-input v-model="searchData.companyTitle" placeholder="发票抬头"></el-input>
                  </el-form-item>
                  <el-form-item label="企业税号">
                      <el-input v-model="searchData.companyTaxNum" placeholder="企业税号"></el-input>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="primary" icon="el-icon-search" @click="initList(1)">查询</el-button>
                      <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div  class="tools-bar">
                  <el-button type="success" icon="el-icon-plus" size="small" @click="dialogVisible = true">新增</el-button>             
              </div>
              <el-table :data="tableData" border>          
                  <el-table-column 
                      v-for="item in rowData1"
                      :prop="item.name"
                      :label="item.text"
                      align="center"
                      >
                  </el-table-column>
                  <el-table-column 
                      v-for="item in rowData2"
                      :prop="item.name"
                      :label="item.text"
                      align="center"
                      >
                  </el-table-column>
                  <el-table-column
                        label="操作"
                        align="center"
                        >
                        <template slot-scope="scope">
                        <div>
                            <el-button
                            type="primary"
                            size="mini"
                            plain
                            @click="handleEdit(scope.$index, scope.row)"
                            >修改</el-button>
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
          </el-tab-pane>
      </el-tabs>  
      <el-dialog :title="searchData.invoiceType==1?'个人发票':'企业发票'" :visible.sync="dialogVisible" @close="onDialogClose()">
        <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="150px" size="small">
            <el-form-item>
                <el-radio disabled v-model="dataForm.invoiceRiseType" :label=1>个人发票</el-radio>
                <el-radio disabled v-model="dataForm.invoiceRiseType" :label=2>企业发票</el-radio>
            </el-form-item>
            <el-form-item label="抬头类型">
                <span v-if="searchData.invoiceType==1">个人</span>
                <span v-else>企业单位</span>
            </el-form-item>
            <el-form-item label="发票抬头" prop="companyTitle">
                <el-input v-model="dataForm.companyTitle" placeholder="发票抬头" style="width:70%;"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
                <el-input v-model="dataForm.phone" placeholder="联系电话" style="width:70%;" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" ></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="dataForm.email" placeholder="邮箱" style="width:70%;"></el-input>
            </el-form-item>
            <el-form-item label="邮寄地址" prop="mailAddress">
                <el-input v-model="dataForm.mailAddress" placeholder="邮寄地址" style="width:70%;"></el-input>
            </el-form-item>
            <div v-if="searchData.invoiceType==2">
                <el-form-item label="企业地址" prop="companyAddress">
                    <el-input v-model="dataForm.companyAddress" placeholder="企业地址" style="width:70%;"></el-input>
                </el-form-item>
                <el-form-item label="企业税号" prop="taxNum">
                    <el-input v-model="dataForm.taxNum" placeholder="税号" style="width:70%;"></el-input>
                </el-form-item>
                <el-form-item label="开户银行" prop="accountBank">
                    <el-input v-model="dataForm.accountBank" placeholder="开户银行" style="width:70%;"></el-input>
                </el-form-item>
                <el-form-item label="银行账号" prop="accountNumber">
                    <el-input v-model="dataForm.accountNumber" placeholder="银行账号" style="width:70%;"></el-input>
                </el-form-item>
            </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
            <el-button size="medium" type="primary" @click="onDialogSubmit()">保存</el-button>
        </div>
      </el-dialog>
  </el-card>
</template>
<script>
    import { vehicleUserSearch } from '@/api/order'
    import { invoiceBasicList,saveInvoiceBasic} from '@/api/finance'
    export default {
        data() {
            return {
                totalRecord: 0,
                pageSize: 10,
                tableLoading: false,
                dialogVisible: false,//新增
                searchData: {
                    invoiceType:'1',//发票类型：1个人，2企业
                    companyTitle:'',//抬头
                    phone:null, 
                    companyTaxNum:'',//税号
                },
                dataForm: {
                  invoiceBasicId:null,
                  invoiceRiseType:'',//抬头类型:1个人，2企业
                  companyTitle: '', //抬头
                  phone:null,
                  email: '',
                  mailAddress:'',
                  companyAddress:'',	//企业地址
                  taxNum:'',	//税号
                  accountBank:'',	    //开户银行
                  accountNumber:'',	//银行账号
                },
                rules: {
                  companyTitle: [{ required: true,message: '请输入抬头', trigger: 'blur' }],
                  phone: [{ required: true,message: '请输入联系电话', trigger: 'blur' }],
                  email: [{ required: true,message: '请输入抬头', trigger: 'blur' }],
                  mailAddress: [{ required: true,message: '请输入邮寄地址', trigger: 'blur' }],
                  taxNum: [{ required: true,message: '请输入税号', trigger: 'blur' }],
                  companyAddress: [{ required: true,message: '请输入公司地址', trigger: 'blur' }],
                  accountNumber: [{ required: true,message: '请输入银行账号', trigger: 'blur' }],
                  accountBank: [{ required: true,message: '请输入开户银行', trigger: 'blur' }],
                },
                rowData1:[
                  {name:'companyTitle',text:'发票抬头'},
                  {name:'registerPhone',text:'联系电话'},
                  {name:'emailAddress',text:'邮箱'},
                  {name:'mailAddress',text:'邮寄地址'},
                ],    
                rowData2:[
                  {name:'taxpayerNumber',text:'企业税号'},
                  {name:'registerAddress',text:'企业地址'},
                  {name:'accountBank',text:'开户银行'},
                  {name:'accountNumber',text:'银行账号'},
                ],       
                tableData: [],
            }
        },
        created() {
            this.initList('1');
        },
        methods: {
              //点击选项卡
              handleClick(tab, event) {
                  this.initList(this.searchData.invoiceType);
              },
              //查询发票列表
              async initList(type) {
                  let params = JSON.parse(JSON.stringify(this.searchData))
                  params.invoiceType = Number(params.invoiceType)
                  this.dataForm.invoiceRiseType = params.invoiceType
                  const data = await invoiceBasicList(params)
                  this.tableData = data.invoiceBasicVOList
                  this.totalRecord = data.pageInfo.totalSize
              },
              //修改
              handleEdit(index,row){
                    this.dialogVisible = true;    
                    this.$nextTick(() => {
                        this.dataForm = {
                            invoiceBasicId:row.invoiceBasicId,
                            invoiceRiseType:Number(this.searchData.invoiceType),//抬头类型:1个人，2企业
                            companyTitle:row.companyTitle, //抬头
                            phone:row.registerPhone,
                            email: row.emailAddress,
                            mailAddress:row.mailAddress,
                            companyAddress:row.registerAddress,
                            taxNum:row.taxpayerNumber,
                            accountBank:row.accountBank,
                            accountNumber:row.accountNumber,
                        }
                        // if(this.searchData.invoiceType==2){
                            //  this.dataForm.companyAddress = row.registerAddress
                            //  this.dataForm.taxNum = row.taxpayerNumber
                            //  this.dataForm.accountBank = row.accountBank
                            //  this.dataForm.accountNumber = row.accountNumber
                        // }
                  })
              },
              //重置搜索条件
              handleReset() {
                  this.searchData= {
                    invoiceType:this.searchData.invoiceType,//发票类型：1个人，2企业
                    companyTitle:'',//抬头
                    phone:null, 
                    companyTaxNum:'',//税号
                }
              },
              //发票——保存
              onDialogSubmit() {
                  this.$refs.dataForm.validate((valid) => {
                      if (valid) {
                          saveInvoiceBasic(this.dataForm).then(response => {
                              this.$message({
                                  type: 'success',
                                  message: '保存成功！'
                              });
                              this.dialogVisible=false
                              this.initList('1')
                          })
                      } else { return false;}
                  });
              },
              //关闭弹窗——个人
              onDialogClose() {
                    this.$refs.dataForm.resetFields();
                    this.dataForm={
                        invoiceRiseType:Number(this.searchData.invoiceType),//抬头类型:1个人，2企业
                    }
              },  
              //发票列表——跳转到指定页
              handleCurrentChange(val) {
                  this.searchData.page = val;
                  this.initList(this.searchData.invoiceType) 
              },
        }
    }
</script>
<style lang="scss">
  .my-autocomplete{
      width:auto!important;
  }
</style>