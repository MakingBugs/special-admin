<template>
    <el-card class="box-card">
        <div class="search-bar">
            <el-form ref="dataForm" :inline="true" :model="dataForm" class="fl" size="small">
                <el-row style="height:70px;">
                    <el-col :span="24">
                        <span style="margin-right:80px;">台湾订单</span>
                        <span>工作日上班时间</span>
                        <el-time-select
                            placeholder="起始时间"
                            v-model="dataForm.wkdStartTime"
                            style="width:200px;margin-left:15px"
                            :picker-options="{
                            start: '00:00',
                            step: '00:15',
                            end: '24:00',
                            }">
                        </el-time-select>
                        ~
                        <el-time-select
                            placeholder="结束时间"
                            v-model="dataForm.wkdEndTime"
                            style="width:200px;margin-right:15px;"
                            :picker-options="{
                            start: '00:00',
                            step: '00:15',
                            end: '24:00',
                            minTime: dataForm.wkdStartTime
                            }">
                        </el-time-select>
                        可预订
                        <el-input v-model="dataForm.wkdAppiontTimeLater" placeholder="请输入天数" style="width:150px;margin-left:15px;margin-right:15px"></el-input>
                        天后行程
                    </el-col>
                </el-row>
                <el-row style="height:60px;">
                    <el-col :span="24">
                        <span style="margin-left:140px;margin-right:50px;">非工作日</span>
                        可预订下个工作日
                        <el-input v-model="dataForm.holidayAppiontTimeLater" placeholder="请输入天数" style="width:150px;margin-left:15px;margin-right:15px;"></el-input>
                        天后行程
                    </el-col>
                </el-row>
            </el-form>
            <el-form ref="dataFormTransfer" :inline="true" :model="dataFormTransfer" class="fl" size="small">
                <el-divider></el-divider>
                <el-row style="height:70px;">
                    <el-col :span="24">
                        <span style="margin-right:25px;">大陆订单—接送机</span>
                        <span>工作日上班时间</span>
                        <el-time-select
                            placeholder="起始时间"
                            v-model="dataFormTransfer.wkdStartTime"
                            style="width:200px;margin-left:15px;"
                            :picker-options="{
                            start: '00:00',
                            step: '00:15',
                            end: '24:00',
                            }">
                        </el-time-select>
                        ~
                        <el-time-select
                            placeholder="结束时间"
                            v-model="dataFormTransfer.wkdEndTime"
                            style="width:200px;margin-right:15px;"
                            :picker-options="{
                            start: '00:00',
                            step: '00:15',
                            end: '24:00',
                            minTime: dataFormTransfer.wkdStartTime
                            }">
                        </el-time-select>
                        <span>可预订</span>
                        <el-input v-model="dataFormTransfer.wkdAppiontTimeLater" placeholder="请输入分钟" style="width:150px;margin-left:15px;margin-right:15px"></el-input>
                        <span>分钟后行程</span>
                    </el-col>
                </el-row>
                <el-row style="height:60px;">
                    <el-col :span="24">
                        <span style="margin-left:140px;margin-right:40px;">非上班时间</span>
                        可预订下个工作日
                        <el-time-select
                            placeholder="时间"
                            v-model="dataFormTransfer.holidayAppiontTimeLater"
                            style="width:200px;margin-left:15px;margin-right:15px;"
                            :picker-options="{
                            start: '00:00',
                            step: '00:15',
                            end: '24:00',
                            }">
                        </el-time-select>
                        后行程
                    </el-col>
                </el-row>
            </el-form>
            <el-form ref="dataFormPeer" :inline="true" :model="dataFormPeer" class="fl" size="small">
                <el-divider></el-divider>
                <el-row style="height:70px;">
                    <el-col :span="24">
                        <span style="margin-right:25px;">大陆订单—点对点</span>
                        <span>工作日上班时间</span>
                        <el-time-select
                            placeholder="起始时间"
                            v-model="dataFormPeer.wkdStartTime"
                            style="width:200px;margin-left:15px;"
                            :picker-options="{
                            start: '00:00',
                            step: '00:15',
                            end: '24:00',
                            }">
                        </el-time-select>
                        ~
                        <el-time-select
                            placeholder="结束时间"
                            v-model="dataFormPeer.wkdEndTime"
                            style="width:200px;margin-right:15px;"
                            :picker-options="{
                            start: '00:00',
                            step: '00:15',
                            end: '24:00',
                            minTime: dataFormPeer.wkdStartTime
                            }">
                        </el-time-select>
                        <span>可预订</span>
                        <el-input v-model="dataFormPeer.wkdAppiontTimeLater" placeholder="请输入分钟" style="width:150px;margin-left:15px;margin-right:15px"></el-input>
                        <span>分钟后行程</span>
                    </el-col>
                </el-row>
                <el-row style="height:60px;">
                   <el-col :span="24">
                        <span style="margin-left:140px;margin-right:40px;">非上班时间</span>
                        可预订下个工作日
                        <el-time-select
                            placeholder="时间"
                            v-model="dataFormPeer.holidayAppiontTimeLater"
                            style="width:200px;margin-left:15px;margin-right:15px;"
                            :picker-options="{
                            start: '00:00',
                            step: '00:15',
                            end: '24:00',
                            }">
                        </el-time-select>
                        后行程
                    </el-col>
                </el-row>
            </el-form>
            <el-form ref="dataFormChartered" :inline="true" :model="dataFormChartered" class="fl" size="small">
                <el-divider></el-divider>
                <el-row style="height:70px;">
                    <el-col :span="24">
                        <span style="margin-right:25px;">大陆订单—包车</span>
                        <span>工作日上班时间</span>
                        <el-time-select
                            placeholder="起始时间"
                            v-model="dataFormChartered.wkdStartTime"
                            style="width:200px;margin-left:15px;"
                            :picker-options="{
                            start: '00:00',
                            step: '00:15',
                            end: '24:00',
                            }">
                        </el-time-select>
                        ~
                        <el-time-select
                            placeholder="结束时间"
                            v-model="dataFormChartered.wkdEndTime"
                            style="width:200px;margin-right:15px;"
                            :picker-options="{
                            start: '00:00',
                            step: '00:15',
                            end: '24:00',
                            minTime: dataFormChartered.wkdStartTime
                            }">
                        </el-time-select>
                        <span>可预订</span>
                        <el-input v-model="dataFormChartered.wkdAppiontTimeLater" placeholder="请输入分钟" style="width:150px;margin-left:15px;margin-right:15px"></el-input>
                        <span>分钟后行程</span>
                    </el-col>
                </el-row>
                <el-row style="height:60px;">
                    <el-col :span="24">
                        <span style="margin-left:140px;margin-right:40px;">非上班时间</span>
                        可预订下个工作日
                        <el-time-select
                            placeholder="时间"
                            v-model="dataFormChartered.holidayAppiontTimeLater"
                            style="width:200px;margin-left:15px;margin-right:15px;"
                            :picker-options="{
                            start: '00:00',
                            step: '00:15',
                            end: '24:00',
                            }">
                        </el-time-select>
                        后行程
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="tools-bar">
            <el-button size="medium" type="primary" @click="onSubmit()">确定</el-button>
        </div>
    </el-card>
</template>
<script>
import { appoTimeList,appoTimeSave } from '@/api/ordertime'
export default {
    data(){
        return{
            dataForm:{
                cfId:null,//唯一Id
                type:1,//类型 1,台湾订单，2大陆-接送机，3-大陆-点对点，4-大陆-包车
                wkdStartTime:'',//工作日上班時間开始时间
                wkdEndTime: '',//工作日上班時間结束时间
                wkdAppiontTimeLater:'',//可预定几天/分钟后的行程
                holidayAppiontTimeLater: '',//非工作日可預定下個工作日几天/时间点后的行程
            },
            dataFormTransfer:{
                cfId:null,//唯一Id
                type:2,//类型 1,台湾订单，2大陆-接送机，3-大陆-点对点，4-大陆-包车
                wkdStartTime:'',//工作日上班時間开始时间
                wkdEndTime: '',//工作日上班時間结束时间
                wkdAppiontTimeLater:'',//可预定几天/分钟后的行程
                holidayAppiontTimeLater: '',//非工作日可預定下個工作日几天/时间点后的行程
            },
            dataFormPeer:{
                cfId:null,//唯一Id
                type:3,//类型 1,台湾订单，2大陆-接送机，3-大陆-点对点，4-大陆-包车
                wkdStartTime:'',//工作日上班時間开始时间
                wkdEndTime: '',//工作日上班時間结束时间
                wkdAppiontTimeLater:'',//可预定几天/分钟后的行程
                holidayAppiontTimeLater: '',//非工作日可預定下個工作日几天/时间点后的行程
            },
            dataFormChartered:{
                cfId:null,//唯一Id
                type:4,//类型 1,台湾订单，2大陆-接送机，3-大陆-点对点，4-大陆-包车
                wkdStartTime:'',//工作日上班時間开始时间
                wkdEndTime: '',//工作日上班時間结束时间
                wkdAppiontTimeLater:'',//可预定几天/分钟后的行程
                holidayAppiontTimeLater: '',//非工作日可預定下個工作日几天/时间点后的行程
            },
        } 
    },
    created(){
        this.initList();
    },
    methods:{
        //查询数据
        async initList(){
            await appoTimeList().then(res=>{
                res.map(i=>{
                    if(i.type==1){
                        for (let x of Object.keys(this.dataForm)) {
                            this.dataForm[x] = i[x]
                        }
                    }else if(i.type==2){
                        for (let x of Object.keys(this.dataFormTransfer)) {
                            this.dataFormTransfer[x] = i[x]
                        }
                    }else if(i.type==3){
                        for (let x of Object.keys(this.dataFormPeer)) {
                            this.dataFormPeer[x] = i[x]
                        }
                    }else if(i.type==4){
                        for (let x of Object.keys(this.dataFormChartered)) {
                            this.dataFormChartered[x] = i[x]
                        }
                    }
                })
            }).catch(err=>{console.log(err)})
        },
        //保存
        onSubmit() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    var newlist=[];
                    newlist.push(this.dataForm,this.dataFormTransfer,this.dataFormPeer,this.dataFormChartered);
                    appoTimeSave(newlist).then(response => {
                        this.$message({
                            type: 'success',
                            message: '保存成功！'
                        })
                    }).catch(err=>{console.log(err)})
                } else {
                    return false
                }
            })
        }
    }
}
</script>