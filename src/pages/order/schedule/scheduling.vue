<template lang="html">
  <el-card class="box-card">
    <el-page-header @back="$router.back(-1);" content="设置司机休假"></el-page-header>
    <el-divider></el-divider>
    <!-- <div class="search-bar">
      <el-form :inline="true" :model="searchData" class="fl" size="small">
        <el-form-item label="姓名">
          <el-input v-model="searchData.driverName" placeholder="姓名" style="width:120px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="srearchList">查询</el-button>
          <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div> -->
    <div  class="tools-bar">
        <el-button type="success" icon="el-icon-setting" size="small" @click="handleSubmit">确认</el-button>
    </div>
    <el-row :gutter="2" class="row-content">
        <el-col :span="3" class="span-left">
            <div class="grid-content bg-purple">
                <div style="height: 53px;border-bottom:1px solid #EBEEF5;line-height:53px;">杭州</div>
                <!-- <el-checkbox v-model="checkAll" @change="handleCheckAllChange" style="margin:20px;">全选</el-checkbox> -->
                <!-- <el-checkbox-group v-model="checkedDrivers" @change="handleCheckedCitiesChange">
                    <el-checkbox style="display:block" v-for="(item,index) in drivers" :label="item.sourceId" :key="index">{{item.sourceName}}</el-checkbox>
                </el-checkbox-group> -->
                <div style="padding: 15px;">
                <el-autocomplete
                    popper-class="my-autocomplete"
                    v-model="state"
                    :fetch-suggestions="querySearch"
                    placeholder="搜索司机"
                    size="mini"
                    @select="handleSelect">
                    <i class="el-icon-search el-input__icon"></i>
                    <template slot-scope="{ item }">
                        <div class="name">{{ item.sourceName}}</div>
                        <span class="addr">{{ item.driverPhone}}</span>
                    </template>
                </el-autocomplete>
                </div>
                <el-radio-group v-model="searchData.driverId" style="width: 100%;text-align: left;">
                    <el-radio v-for="(item,index) in drivers" :label="item.sourceId" :key="index" @change="handleDriverChange(val)" style="margin-bottom: 10px;">{{item.sourceName}}</el-radio>
                </el-radio-group>
            </div>
        </el-col>
        <el-col :span="21" class="span-right">
            <div class="grid-content bg-purple">
                 <el-calendar v-model="value" value-format="yyyy:MM">
                    <template slot="dateCell" slot-scope="{date, data}">
                        <div class="aaa">{{ data.day.split('-').slice(2).join('-') }}</div>
                        <el-checkbox :disabled="isDisable(data.day)" :value="getCheckState(data.day)" @change="handleCheckedTime(data.day,$event)"></el-checkbox>
                    </template>
                </el-calendar>
            </div>
        </el-col>
    </el-row>
  </el-card>
</template>
<script>
    import { carOrDriverList,scheduleList,scheduleRest} from '@/api/common'
    import moment from 'moment'
    // const cityOptions = ['小明', '小兰', '小强', '阿华'];
    export default {
        data() {
            return {
                // checkAll: false,
                // checkedDriver: '',  //选中的司机id
                // restaurants: [],    //司机搜索结果
                drivers:[],         //司机列表
                // timesChecked:[], //选中的休假日期
                checkBoxStatus: {}, //选中的休假日期
                lastMonth : new Date().getMonth()+1,
                searchData:{
                    driverId: '',
                    time: moment(new Date()).format('YYYY-MM')
                },
                state: '',
                calendarData:'',//排班列表
                value: new Date()//当前时间
            }
        },
        computed: {
            isDisable() {
                return data => {
                    var month1 = this.value.getMonth() + 1;
                    var month2 = data.split('-')[1]
                    if(month1!=month2){
                        return true
                    }
                }
            },
        },
        created() {
            this.driverList()
            this.schedulesList()
        },
        watch: {
            value: function() {
                let month = this.value.getMonth() + 1;
                //点击上下月
                if(month!=this.lastMonth){                   
                    this.lastMonth = month
                    this.checkBoxStatus = {}
                    this.searchData.time = moment(this.value).format('YYYY-MM')
                    this.schedulesList()
                }
            },
            "searchData.driverId":function(){
                this.schedulesList()
            }
        },
        mounted () {
        },
        methods: {
            //搜索司机
            querySearch(queryString, cb) {
                var restaurants = this.drivers;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.sourceName.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            //选择搜索结果中的司机
            handleSelect(item) {
                this.state = item.sourceName
                this.searchData.driverId = item.sourceId
            },
            //司机列表
            async driverList(){
                const data = await carOrDriverList({"type":1})
                this.drivers = data;
            },
            //排班列表
            async schedulesList() {
                const data = await scheduleList(this.searchData)
                this.calendarData = data.schedules
                const temp_data = {}
                this.calendarData.forEach(item=>{
                    temp_data[item.day] = true;
                })
                this.checkBoxStatus = temp_data;
            },
            //切换司机——展示休假日历
            handleDriverChange(val){
                // console.log(val)
            },
            //选中状态
            getCheckState(data){
                return this.checkBoxStatus[data] || false;
            },
            //日历单选框状态变化
            handleCheckedTime(current_day, val){
                this.$set(this.checkBoxStatus, current_day, val)

                // const time = current_day.substr(current_day.indexOf("-")+1);
                // if(val){
                //     this.timesChecked.push(time)
                // }else{
                //     this.timesChecked.splice(this.timesChecked.indexOf(time),1)
                // }
            },
            
            //保存
            handleSubmit(){
                if(!this.searchData.driverId){
                    return this.$message({
                        message: '请选择司机',
                        type: 'warning',
                        duration:2000
                    })
                }
                let param = {
                    "driverId":this.searchData.driverId,
                    "days":this.checkBoxStatus,
                }
                if(Object.keys(this.checkBoxStatus).length == 0){
                    param.month = moment(this.value).format('YYYY-MM')
                }
                scheduleRest().then(response => {
                    this.$message({
                      type: 'success',
                      message: '保存成功！'
                    });
                    this.$router.push('/order/schedule');
                })
            },
            // handleCheckAllChange(val) {
            //     let arr = this.drivers.map(item=>{
            //         return item.sourceId
            //     })
            //     this.checkedDrivers = val ? arr : [];
            // },
            // handleCheckedCitiesChange(value) {
            //     let checkedCount = value.length;
            //     this.checkAll = checkedCount === this.drivers.length;
            // },
            //查询列表
            async srearchList() {
                const data = await carClassList()
                this.tableData = data.list
            },
             //重置搜索条件
            handleReset() {
                this.searchData = {
                    driverName: '',
                }
            },
        }
    }
</script>
<style lang="scss" scoped>
    .row-content{
        border:1px solid #EBEEF5;
    }
    .grid-content .el-checkbox:last-child {
        margin-right: 30px;
    }
    .span-left{
        text-align: center;
        padding: 0 !important;
    }
    .span-right{
        padding: 0 !important;
        border-left:1px solid #EBEEF5;
    }
    .my-autocomplete {
        li {
            line-height: normal;
            padding: 7px;
            .name {
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .addr {
                font-size: 12px;
                color: #b4b4b4;
            }
            .highlighted .addr {
                color: #ddd;
            }
        }
    }
</style>