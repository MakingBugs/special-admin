<template lang="html">
  <el-card class="box-card">
    <div class="search-bar">
      <el-form :inline="true" :model="searchData" class="fl" size="small">
        <el-form-item label="城市">
          <el-select v-model="cityCode" placeholder="请选择">
            <el-option label="杭州" value=""></el-option>
              <!-- <el-option
                  v-for="item in carStatusList"
                  :key="item.value"
                  :label="item.desc"
                  :value="item.value">
              </el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
              v-model="searchData.startDay"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
          </el-date-picker>
          -
          <el-date-picker
              v-model="searchData.endDay"
              type="date"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions1"
              placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="initList(1)">查询</el-button>
          <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
        </el-form-item>
        <el-form-item style="float: right;">
          <router-link :to="'/operation/operationLog/'+currentMenuId" style="color: #fff;">
            <el-button type="primary" plain @click="handleReset">操作日志</el-button>
          </router-link>
        </el-form-item>   
      </el-form>
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
        <el-table-column label="里程" align="center">
          <template slot-scope="scope">
              <div v-if="scope.row.discounts">
                  <div v-for="item in scope.row.discounts">{{item.distanceDesc}}</div>
              </div>
          </template>
        </el-table-column>
        <el-table-column label="折扣系数" align="center">
          <template slot-scope="scope">
              <div v-if="scope.row.discounts">
                  <div v-for="item in scope.row.discounts">{{item.discount1}}</div>
              </div>
          </template>
        </el-table-column>
        <el-table-column label="折扣" align="center">
          <template slot-scope="scope">
              <div v-if="scope.row.discounts">
                  <div v-for="item in scope.row.discounts">{{item.discount2}}</div>
              </div>
          </template>
        </el-table-column>
        <el-table-column label="生效时间" prop="time" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width=250>
          <template slot-scope="scope">
            <div>
              <el-button type="success" size="mini" plain @click="handleShow(scope.$index, scope.row)">查看</el-button>
              <el-button type="warning" size="mini" plain @click="handlePass(scope.$index, scope.row)">通过审核</el-button>
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
    <el-dialog title="折扣详情" :visible.sync="dialogVisible">
      <el-form label-width="200px" :model="dataForm">
          <el-form-item label="城市：" style="margin-bottom: 0;">
              <span>{{ dataForm.city }}</span>
          </el-form-item>
          <el-form-item label="车型：" style="margin-bottom: 0;">
            <span>{{ dataForm.vehicle }}</span>
          </el-form-item>
          <el-form-item label="生效日期：" style="margin-bottom: 0;">
            <span>{{ dataForm.time }}</span>
          </el-form-item>
          <!-- <el-form-item label="开始日期：" style="margin-bottom: 0;">
            <span>{{ dataForm.startDay }}</span>
          </el-form-item>
          <el-form-item label="结束日期：" style="margin-bottom: 0;">
            <span>{{ dataForm.endDay }}</span> -->
          </el-form-item>
          <el-form-item label="星期：" style="margin-bottom: 0;">
            <el-tag v-for="tag in tags" :key="tag.name" v-if="tag.type==='primary'" type="info" style="margin-right: 10px;">{{tag.name}}</el-tag>
          </el-form-item>
          <el-form-item label="封顶金额：" style="margin-bottom: 0;">
            <span>{{ dataForm.maxDiscount }} 元</span>
          </el-form-item>
          <el-form-item label="时段：" style="margin-bottom: 0;">
            <div v-for="item in dataForm.times">
              <span>{{ item.startTime }}</span>
              <span> -- </span>
              <span>{{ item.endTime }}</span>
            </div>
          </el-form-item>
          <el-form-item label="折扣：">
            <div v-for="item in dataForm.discounts">
              <span>{{ item.distanceDesc }}</span>
              <span> -- </span>
              <span>{{ item.discount1 }}</span>
            </div>
          </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>
<script>
    import { mapState } from 'vuex'
    import { examineList,examinePass,dynamicDetail} from '@/api/strategy'
    export default {
        data() {
            return {
                totalRecord: 0,
                pageSize: 10,
                tableLoading: false,
                dialogVisible: false,
                cityCode: '',//车牌号
                searchData: {
                    startDay: '',
                    endDay:'',//车辆状态
                    page:1
                },
                dataForm: {
                      id:null, //id
                      city:'杭州',//城市
                      vehicle:'专车',//车型
                      maxDiscount: '',//封顶金额
                      time:'',
                      // startDay:'',//开始日期
                      // endDay:'', //结束日期
                      days: '',//星期id
                      times:[{startTime:'',endTime:''}],//时段
                      discounts:[{startDistance:'',endDistance:''}]//公里折扣
                },
                tags: [
                  { name: '星期一', type: 'info', val:'1' },
                  { name: '星期二', type: 'info', val:'2' },
                  { name: '星期三', type: 'info', val:'3' },
                  { name: '星期四', type: 'info', val:'4' },
                  { name: '星期五', type: 'info', val:'5' },
                  { name: '星期六', type: 'info', val:'6' },
                  { name: '星期日', type: 'info', val:'7' },
                ],
                pickerOptions1:{ //搜索日期
                    disabledDate:(time)=>{
                      return time.getTime() < new Date(this.searchData.startDay).getTime()- 8.64e7;;
                    }
                },
                rowData:[
                  {name:'id',text:'规则ID'},
                  {name:'createTime',text:'配置日期'},
                  {name:'city',text:'城市'},
                  {name:'hours',text:'时段'},
                  {name:'vehicle',text:'车型'},
                  {name:'maxDiscount',text:'封顶金额'},
                ],    
                tableData: [],
            }
        },
        computed: {
            ...mapState( ['currentMenuId'])
        },
        created() {
            this.initList(1)
        },
        methods: {           
            //查询列表
            async initList(val) {
                this.searchData.page = val;
                const data = await examineList(this.searchData)
                this.tableData = data.list
                this.totalRecord = data.pageInfo.totalSize
            },
            //重置搜索条件
            handleReset() {
                this.searchData = {
                    startDay: '',
                    endDay:'',
                    page:this.searchData.page
                }
            },
            //审核
            handlePass(index, row) {
              this.$confirm('是否确认无误,通过动态折扣审核规则', '提示', {
                  confirmButtonText: '是',
                  cancelButtonText: '否',
                  type: 'warning'
              }).then(() => {
                examinePass({id:row.id}).then(response=>{
                  this.$message({
                    message: '审核成功',
                    type: 'success',
                    duration:1500,
                  });
                  this.initList(this.searchData.page)
                });
              }).catch(err => { console.log(err) })
            },
            //折扣详情
            handleShow(index, row) {
                this.dialogVisible = true
                dynamicDetail({id:row.id}).then(result=>{
                    this.$nextTick(() => {
                      for (let x of Object.keys(this.dataForm)) {
                        this.dataForm[x] = result[x]                   
                      }
                      if(result.days){
                        let weekIds = result.days.split(",")
                        this.tags = this.tags.map(item=>{
                            item.type = weekIds.includes(item.val) ? "primary" : "info"
                            return item
                        })
                      }
                    })
                  })
            },
            //跳转到指定页
            handleCurrentChange(val) {
              this.initList(val)
            },
        }
    }
</script>
<style lang="scss">   
</style>