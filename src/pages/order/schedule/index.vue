<template lang="html">
  <el-card class="box-card">
    <div class="search-bar">
      <el-form :inline="true" :model="searchData" class="fl" size="small">
        <el-form-item label="据点">
           <el-select v-model="searchData.stationId" clearable placeholder="请选择" style="width: 120px;">
              <el-option
              v-for="item in options"
              :value="item.value"
              :key="item.value"
              :label="item.desc"
              >
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="月份">
            <el-date-picker
                v-model="searchData.time"
                style="width: 120px;"
                type="month"
                placeholder="选择月">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchData.driverName" placeholder="姓名" style="width:120px;"></el-input>
        </el-form-item>
        <el-form-item label="休假">
            <el-select v-model="searchData.holiday" clearable placeholder="请选择" style="width: 120px;">
              <el-option value="1" label="是"></el-option>
              <el-option value="0" label="否"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchList">查询</el-button>
          <el-button type="warning" plain icon="el-icon-brush" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div  class="tools-bar">
        <el-button type="success" icon="el-icon-setting" size="small"><router-link to="/order/schedule/scheduling" style="color: #fff;">设置休假</router-link></el-button>
    </div>
    <el-row :gutter="2" class="row-content">
        <el-col :span="3" class="span-left">
            <div class="grid-content bg-purple">
                <div style="height: 53px;border-bottom:1px solid #EBEEF5;line-height:53px;">杭州</div>
                <el-divider content-position="left"><i class="el-icon-user"></i> 驾驶员</el-divider>
                <div
                    v-for="(item, index) in drivers"
                    :key="index"
                >{{item.sourceName}}</div>
            </div>
        </el-col>
        <el-col :span="21" class="span-right">
            <div class="grid-content bg-purple">
                 <el-calendar v-model="value" id="calendar">
                    <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
                    <template slot="dateCell" slot-scope="{date, data}">
                        <!--date	单元格代表的日期 
                            data	{ type, isSelected, day}，type 表示该日期的所属月份，可选值有 prev-month，current-month，next-month；isSelected 标明该日期是否被选中；day 是格式化的日期，格式为 yyyy-MM-dd -->
                            <div class="">{{ data.day.split('-').slice(2).join('-') }}</div>
                                <div
                                    v-for="(item, index) in formatSchedule(data)"
                                    :key="index"
                                >{{item}}</div>
                    </template>
                </el-calendar>
            </div>
        </el-col>
    </el-row>
  </el-card>
</template>
<script>
    import { scheduleList,carOrDriverList,optionsList} from '@/api/common'
    export default {
        data() {
            return {
                options:'',
                drivers:'',
                lastMonth : new Date().getMonth()+1,
                searchData:{
                    stationId: '',
                    time:new Date().getFullYear()+"-"+new Date().getMonth()+1,
                    driverName: '',
                    holiday:''
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;//如果没有后面的-8.64e7就是不可以选择今天的 
                    }
                },  
                calendarData: '',
                value: new Date()
            }
        },

        computed: {
            formatSchedule() {
                return data => {
                    if(!this.calendarData) return 
                    let driver = this.calendarData.filter(ele => {
                        // return ele.days == data.day.slice(data.day.indexOf('-')+1)//不显示上个月底或下个月初的
                        return ele.days == data.day.split('-').slice(2).join('-')
                    })
                    if(driver.length>0){
                        return driver[0].driver
                    }
                }
            }
        },
        created() {
            this.driverList()
            this.searchList()
            this.selectList();
        },
        watch: {
            value: function() {
                let month = this.value.getMonth() + 1;
                //点击上下月
                if(month!=this.lastMonth){                   
                    this.lastMonth = month
                }
            },
            lastMonth:function(){
                let year = this.value.getFullYear();
                let month = this.value.getMonth() + 1;
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                this.searchData.time = (year+'-'+month)
                this.searchList()
            }
        },
        methods: {
            //司机列表
            async driverList(){
                const data = await carOrDriverList({"type":1})
                this.drivers = data;
            },
            //排班列表
            async searchList() {
                const data = await scheduleList(this.searchData)
                this.calendarData = data.schedules
            },
            //据点下拉框列表
            async selectList() {
                const data = await optionsList({dictionaryCodes:["STATION"]})
                this.options = data[0].list
            },
             //重置搜索条件
            handleReset() {
                this.searchData={
                    stationId: '',
                    time:'',
                    driverName: '',
                    holiday:''
                }
            },
        }
    }
</script>
<style lang="scss" scoped>
  .is-selected {
    color: #1989FA;
  }
  .calendar-day{
        text-align: center;
        color: #202535;
        line-height: 30px;
        font-size: 12px;
    }
    .is-selected{
        color: #F8A535;
        font-size: 10px;
        margin-top: 5px;
    }
    #calendar .el-button-group>.el-button:not(:first-child):not(:last-child):after{
        content: '当月';
    }
    .span-left .grid-content{
        text-align: center;
    }
    

    
    .row-content{
        border:1px solid #EBEEF5;
    }
    .span-left{
        padding: 0 !important;
    }
    .span-right{
        padding: 0 !important;
        border-left:1px solid #EBEEF5;
    }
</style>