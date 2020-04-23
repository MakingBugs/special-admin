<template lang="html">
    <el-card class="box-card">
        <el-page-header @back="goBack" content="后台下单"></el-page-header>
        <el-divider></el-divider>
        <div class="tbody" style="padding:0 30px;">  
            <el-steps :active="active" finish-status="success">
                <el-step title="订单信息"></el-step>
                <el-step title="勤务信息"></el-step>
                <el-step title="应收明细"></el-step>
            </el-steps>
            <div class="info" v-if="active==1" style="width:50%">
                <el-form ref="dataForm1" :rules="rules" :model="dataForm" label-width="150px" style="margin-top: 30px;">
                    <el-form-item label="订车人" prop="subscriper">
                        <el-autocomplete
                            class="inline-input" 
                            :disabled="isAble"
                            v-model="dataForm.subscriper"
                            :fetch-suggestions="querySearch"
                            placeholder="订车人"
                            :trigger-on-focus="false"
                            style="width:100%;position: relative;"
                            @select="handleSelect1"
                            >
                            <template slot-scope="{ item }">
                                <div v-if="item.nolist">{{item.nolist}}</div>
                                <div v-else>
                                    <div class="name">{{ item.userName }}</div>
                                    <div style="color:#999;">
                                        <span>企业：{{ item.companyName }}</span>
                                        <span style="margin-left:20px;">电话：{{ item.userPhone }}</span>
                                    </div>
                                </div>
                            </template>
                        </el-autocomplete>
                        <el-button style="position:absolute;right: -120px;" type="success" :disabled="isAble">添加订车人</el-button>
                    </el-form-item>                     
                    <el-form-item label="订单来源" prop="source">
                        <el-select v-model="dataForm.source" placeholder="请选择" :disabled="isAble" 
                            style="width:100%">
                            <el-option :value=0 label="电话"></el-option>
                            <el-option :value=1 label="微信"></el-option>
                            <el-option :value=2 label="APP"></el-option>
                        </el-select>
                    </el-form-item>                    
                    <!-- </el-form-item> -->
                    <el-form-item label="支付方式" prop="payWayId">
                        <el-select v-model="dataForm.payWayId" placeholder="请选择" style="width:100%" :disabled="isAble">
                            <el-option :value=0 label="个人支付"></el-option>
                            <el-option :value=1 label="企业优惠支付"></el-option>
                            <el-option :value=2 label="企业月结支付"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注" prop="remarks">
                        <el-input type="textarea" :disabled="isAble" v-model="dataForm.remarks"  placeholder="备注"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="info" v-if="active==2" style="width:65%">
                <el-form ref="dataForm2" :rules="rules" :model="dataSubForm" label-width="150px" style="margin-top: 20px;">
                    <el-row>
                        <el-col :span="14">
                            <el-form-item label="出发城市" prop="provinceCode"> 
                                <el-select v-model="dataSubForm.provinceCode" placeholder="请选择" @change="provinceChange" style="width:100%;"
                                >
                                    <el-option
                                        v-for="item in provinces"
                                        :key="item.code"
                                        :label="item.name"
                                        :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item prop="cityCode" style="margin-left:-120px;"> 
                                <el-select v-model="dataSubForm.cityCode" placeholder="请选择" style="width:100%;" @change="cityChange">
                                    <el-option
                                    v-for="item in citys"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="订单类型" prop="orderTypeValue">
                        <el-cascader
                            style="width: 100%;"
                            v-model="dataSubForm.orderTypeValue"
                            :options="orderTypeOptions"
                            @change="handleOrderTypeChange">
                        </el-cascader>
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="航班号">
                                <el-input :disabled="disabled1" v-model="dataSubForm.flightNumber" placeholder="航班号"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="航站楼">
                                <el-select v-model="dataSubForm.airportData" value-key="terminalId" @change="handleAirportChange" :disabled="disabled1" placeholder="请选择" style="width: 100%;">
                                    <el-option
                                        v-for="item in optionsAirport"
                                        :value="item"
                                        :key="item.terminalId"
                                        :label="item.terminalName"
                                        >
                                    </el-option>
                                </el-select>
                            </el-form-item>       
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="起点" prop="startPoint">
                                <el-input v-model="dataSubForm.startPoint" autocomplete="off" :disabled="disabled3" readonly>
                                    <el-button slot="append" icon="el-icon-search" :disabled="disabled3" @click="openMap(1)"></el-button>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="终点" prop="endPoint">
                                <el-input v-model="dataSubForm.endPoint" autocomplete="off" :disabled="disabled4" readonly>
                                    <el-button slot="append" icon="el-icon-search" :disabled="disabled4" @click="openMap(2)"></el-button>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="车型" prop="vehicleId">
                                <el-select v-model="dataSubForm.vehicleId" placeholder="请选择" style="width: 100%;">
                                    <el-option
                                        v-for="item in optionsCar"
                                        :value="item.vehicleId"
                                        :key="item.vehicleId"
                                        :label="item.vehicleName"
                                        >
                                    </el-option>
                                </el-select>
                            </el-form-item>       
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="时数">
                                <el-select :disabled="disabled2" v-model="dataSubForm.priceDetailId" placeholder="请选择" style="width: 100%;">
                                    <el-option
                                        v-for="item in mileageDurationList"
                                        :value="item.detailId"
                                        :key="item.detailId"
                                        :label="item.duration+'h/'+item.distance+'km'"
                                        >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="用车时间" prop="appointmentTime">
                                <el-date-picker
                                    v-model="dataSubForm.appointmentTime"
                                    type="datetime"
                                    :picker-options="pickerOptions1"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    style="width: 100%;"
                                    placeholder="选择时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="行程预估起始时间" prop="expStartTime">
                                <el-date-picker
                                    v-model="dataSubForm.expStartTime"
                                    type="datetime"
                                    :picker-options="pickerOptions2"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    style="width: 100%;"
                                    placeholder="选择时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="行程预估结束时间" prop="expEndTime">
                                <el-date-picker
                                    v-model="dataSubForm.expEndTime"
                                    type="datetime"
                                    :picker-options="pickerOptions3"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    style="width: 100%;"
                                    placeholder="选择时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>                    
                    <el-form-item label="乘车人" prop="riderName" style="position: relative;">
                        <el-input type="text" v-model="dataSubForm.riderName" autocomplete="off" placeholder="乘车人"></el-input>
                        <el-checkbox v-model="dataSubForm.riderSameSubscriper" @change="handleCheckChange" style="position: absolute;right:-90px;">同订车人</el-checkbox>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="riderPhone">
                        <el-input placeholder="联系电话" v-model="dataSubForm.riderPhone" class="input-with-select" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');">
                            <el-select v-model="dataSubForm.riderCountryCode" slot="prepend" style="width:100px;">
                                <el-option label="+86" value="+86"></el-option>
                                <el-option label="+886" value="+886"></el-option>
                                <el-option label="+852" value="+852"></el-option>
                                <el-option label="+853" value="+853"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="备注" prop="remarks">
                        <el-input type="textarea" v-model="dataSubForm.remarks" placeholder="备注"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="info" v-if="active==3">
                <el-form label-width="200px">
                    <el-form-item 
                        v-if="priceDetail.payItems"
                        v-for="item in priceDetail.payItems"
                        :label="item.itemName"
                        style="margin-bottom:0">：
                        <span>{{item.itemPrice}} 元</span>
                    </el-form-item>
                    <el-form-item label="小计：">:
                        <span v-if="priceDetail.subTotal">{{priceDetail.subTotal}}元</span>
                    </el-form-item>
                </el-form>
            </div>
            </el-form> 
            <el-row style="margin-top: 12px;text-align:center;">
                <el-button @click="pre" v-if="active>1">上一步</el-button> 
                <el-button @click="next" v-if="active<3">下一步</el-button>
                <el-button type="primary" @click="onSubmit" v-if="active==3">下单</el-button>
            </el-row>
        </div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible1" class="map-dialog">
			<el-form inline size="mini">
				  <el-form-item>
                    <el-input id="suggestStart" v-model="searchAdresstext"></el-input>	
				  </el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="dialogVisible1 = false">确认</el-button>
				  </el-form-item>
			</el-form>
			<div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div>
			<div id="XSDFXPage" ref="mapDig" class="XSDFXPage"></div>
        </el-dialog>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible2" @close="onDialogClose()">
			<el-form ref="addressForm" :rules="rules" :model="addressForm" label-width="150px" style="width:80%;">
                <el-form-item label="市" prop="city"> 
                    <el-select v-model="addressForm.city" value-key="code" placeholder="请选择" style="width:100%;" @change="cityChange2">
                        <el-option
                        v-for="item in citys"
                        :key="item.code"
                        :label="item.name"
                        :value="item">
                        </el-option>
                    </el-select>
                </el-form-item> 
                <el-form-item label="区/县" prop="area"> 
                    <el-select v-model="addressForm.area" value-key="code" placeholder="请选择" @change="areaChange" style="width:100%;">
                        <el-option
                        v-for="item in addressForm.areaList"
                        :key="item.code"
                        :label="item.name"
                        :value="item">
                        </el-option>
                    </el-select>
                </el-form-item> 
                <el-form-item label="乡/镇" prop="town"> 
                    <el-select v-model="addressForm.town" clearable value-key="code" placeholder="请选择" @change="addressForm.address='';" style="width:100%;">
                        <el-option
                        v-for="item in addressForm.townList"
                        :key="item.code"
                        :label="item.name"
                        :value="item">
                        </el-option>
                    </el-select>
                </el-form-item> 
                <el-form-item label="具体地址" prop="address">
                    <el-input v-model="addressForm.address"  placeholder="具体地址"></el-input>
                </el-form-item>
                
			</el-form>
			<div slot="footer" class="dialog-footer">
                <el-button size="medium" @click="dialogVisible2 = false">取 消</el-button>
                <el-button size="medium" type="primary" @click="selectedAddress">确认</el-button>
              </div>
		</el-dialog>
    </el-card>
</template>
<script>
    import { cityList } from '@/api/common'
    import { orderDetail,vehicleUserSearch,vehicleList,priceQuery,mileageDuration,createOrder,getSubscriperInfo,terminalList } from '@/api/order'
    import BaiduMap from '@/utils/map/baidu-map';
    export default {
        data() {
            return {
                active: 1,
                isAble:false,  //大单信息
                disabled1:true,//航班号禁止输入
                disabled2:true,//包车时数禁止选择
                disabled3:false,//起点——接机时禁用
                disabled4:false,//终点——送机时禁用
                provinces:[],//省份下拉框选项
                citys:[],   //城市下拉框选项
                dialogTitle: '',
                dialogVisible1: false,//地图
                dialogVisible2: false,//台湾手输弹窗
                optionsCar:[],   //车型下拉框选项
                optionsAirport:[],   //航站楼下拉框选项
                searchAdresstext:'',//搜索地址回显，没什么用一定要有
                priceDetail:{},     //价格查询
                mileageDurationList:[],//里程下拉框选项
                orderTypeOptions: [{
                        value: 0,
                        label: '接送机',
                        children: [{value: 'a1',label: '接机'}, { value:'b1',label: '送机'}]
                    }, {
                        value: 1,
                        disabled:false,
                        label: '点对点',
                    }, {
                        value: 2,
                        label: '包车',
                    }, {
                        value: 3,
                        label: '两岸畅行',
                        children: [{value: 'a2',label: '接机'}, {value: 'b2',label: '送机'}]
                    }],
                dataForm: {
                    subscriper: '',  //订车人
                    subscriperId:'', //订车人id
                    source:'',  //订单来源                   
                    payWayId:'',    //支付方式
                    remarks:'',  //备注
                },
                dataSubForm:{
                    orderTypeValue:[],
                    provinceCode:'',  //省份id  
                    cityCode:'',    //城市id
                    orderType:'', //订单类型
                    orderSubType:'', //子订单类型
                    flightNumber:'',//航班号
                    airportId:'',//航站楼
                    vehicleId:null,   //车型
                    priceDetailId:'',//包车时数id
                    appointmentTime:'',   //接送日期
                    expStartTime:'',//预计起始时间
                    expEndTime:'',//预计结束时间
                    riderName : '',  //乘车人
                    riderSameSubscriper:false,//乘车人同订车人
                    riderCountryCode:'+86',//国码
                    riderPhone: null,   //联系电话
                    startPoint:'',//起点
                    startPointLon:'',//起点经度
                    startPointLat:'',//起点纬度
                    startCityName:'',//起点城市
                    endPoint:'',//终点
                    endPointLon:'',//终点经度
                    endPointLat:'',//终点纬度   
                    endCityName:'',//终点城市                       
                    remarks:'',  //备注
                },
                addressForm:{//台湾选择地址数据
                    city:'',
                    area:'',
                    town:'',
                    address:'',
                    areaList:[],
                    townList:[],
                },
                pickerOptions1:{ //接送日期——不可选
                    disabledDate:(time)=>{
                      return time.getTime() < Date.now() - 8.64e7;//如果没有后面的-8.64e7就是不可以选择今天的 
                    }
                },
                pickerOptions2:{ //起始日期——不可选
                    disabledDate:(time)=>{
                      return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                pickerOptions3:{ //结束日期——不可选
                    disabledDate:(time)=>{
                        let startTime = this.dataSubForm.expStartTime
                        return time.getTime() < new Date(startTime.substring(0,startTime.indexOf(" "))).getTime() - 8.64e7;
                    }
                },
                rules: {
                    subscriper: [{required: true,message: '请选择订车人',trigger: 'blur'}],
                    source: [{required: true,message: '请选择订单来源',trigger: 'change'}],
                    provinceCode: [{required: true,message: '请选择省份',trigger: 'change'}],
                    cityCode: [{required: true,message: '请选择城市',trigger: 'change'}],
                    payWayId: [{required: true,message: '请选择支付方式',trigger: 'change'}],
                    orderTypeValue:[{required: true,message: '请选择订单类型',trigger: 'change'}],
                    vehicleId: [{required: true,message: '请选择车型',trigger: 'change'}],
                    appointmentTime: [{required: true,message: '请选择用车时间',trigger: 'change'}],
                    expStartTime: [{required: true,message: '请选择预计开始时间',trigger: 'blur'}],
                    expEndTime: [{required: true,message: '请选择预计结束时间',trigger: 'blur'}],
                    startPoint: [{required: true,message: '请选择起点',trigger: ['change','blur']}],
                    endPoint: [{required: true,message: '请选择终点',trigger: ['change','blur']}],
                    riderName: [{required: true,message: '请输入乘车人',trigger: ['change','blur']}],
                    riderPhone: [{required: true,message: '请输入乘车人电话',trigger: ['change','blur']}],
                    city: [{required: true,message: '请选择城市',trigger: 'change'}],
                    area: [{required: true,message: '请选择区/县',trigger: 'change'}],
                    town: [{required: true,message: '请选择乡/镇',trigger: 'change'}],
                    address:[{required: true,message: '请输入详细地址',trigger: 'change'}],
                },   
            }
        },
        computed: {
        },
        created() {
            this.init();
            this.provinceData()
        },
        watch: {
            //监听车型
            "dataSubForm.vehicleId":function(val){
                if(val&&this.dataSubForm.orderType==2){
                    this.disabled2 = false;
                    this.dataSubForm.priceDetailId=null;
                    mileageDuration({vehicleId:val,cityCode:this.dataSubForm.cityCode}).then(result=>{
                        this.mileageDurationList = result
                    })
                }
            },
        },
        mounted () {
        },
        destroyed () {
        },
        methods: {
            goBack() {
                this.$router.push('/order/list');
            },
            init(){
                if(this.$route.params.id){
                    this.active = 2
                    this.isAble = true
                    orderDetail(this.$route.params.id).then(response => {
                        for (let x of Object.keys(this.dataForm)) {
                            this.dataForm[x] = response[x]
                        }
                        this.dataForm.subscriperName= response.subscriperName  //订车人
                        // this.dataForm.subscriperId= response.subscriperId  //订车人
                        // this.dataForm.source=response.source  //订单来源
                        // this.dataForm.payWayId=response.payWayId    //支付方式
                        // this.dataForm.remarks=response.remarks  //备注
                        if(response.cityCode){
                            this.dataSubForm.provinceCode=response.provinceCode  //省份id  
                            this.dataSubForm.cityCode=response.cityCode    //城市id
                            this.cityData(this.dataSubForm.provinceCode);//城市列表
                            this.selectTerminalList();//航站楼列表
                            this.selectCarList({cityCode:response.cityCode});//车型列表
                        }
                    })
                }
            },
            next() {
                //新建勤务单进来-无需验证
                if(this.active ==1){
                    if(this.$route.params.id){
                        this.active++
                    }else{
                        //后台下单进来-需要验证
                        this.$refs.dataForm1.validate((valid) => {
                            if (valid) {
                                this.active++
                            }
                        })
                    }
                }else if(this.active ==2){
                    //勤务单——验证
                    this.$refs.dataForm2.validate((valid) => {
                        if (valid) {
                            if(this.$route.params.id){
                                this.dataForm.orderBatchId = this.$route.params.id;
                            }
                            this.dataForm.subOrder = JSON.parse(JSON.stringify(this.dataSubForm))
                            if(this.dataSubForm.airportData){
                                this.dataForm.subOrder.airportId= this.dataSubForm.airportData.airportId
                            }
                            //查询价格
                            priceQuery(this.dataForm).then(response => {
                                this.priceDetail = response
                                this.active++
                            })
                        }
                    })
                }
            },
            pre() {
                if (this.active-- < 2) this.active = 1;
                if(this.active == 1){
                    this.$refs.dataForm2.clearValidate();
                }
            },
            //订车人搜索
            querySearch(queryString, callback) {
                if(queryString){
                    vehicleUserSearch({"userName":queryString,"userType":1}).then(response => {
                        let restaurants = response.resultList;
                        var results = restaurants.length>0 ? restaurants : [{nolist:'没有此订车人，请点击右方按钮添加'}];
                        // 调用 callback 返回建议列表的数据
                        callback(results);
                    })
                }
            },
            //选择订车人
            handleSelect1(item) {
                this.dataForm.subscriper = item.userName
                this.dataForm.subscriperId= item.userId
            },
            //同订车人
            handleCheckChange(val){
                if(val){
                    getSubscriperInfo(this.dataForm.subscriperId).then(response=>{
                        this.dataSubForm.riderName = response.subscriperName
                        this.dataSubForm.riderPhone= response.subscriperPhone
                        this.dataSubForm.riderCountryCode= response.countryCode
                    })
                }else{
                    this.dataSubForm.riderName = ''
                    this.dataSubForm.riderPhone= ''
                    this.dataSubForm.riderCountryCode= "+86"
                }
            },
            //监听订单类型
            handleOrderTypeChange(selVal){
                this.dataSubForm.orderType = selVal[0]
                //接送机
                if(selVal[1]){
                    this.disabled1 = false;     //航班号、航站楼    
                    let airportData = this.dataSubForm.airportData          
                    if(selVal[1].indexOf('a')!=-1){
                        this.dataSubForm.orderSubType=1//接机——起点禁用
                        this.disabled3 = true   
                        this.disabled4 = false  //终点打开
                        if(airportData){
                            this.dataSubForm.startPoint = airportData.terminalAddress+airportData.terminalName//起点
                            this.dataSubForm.startPointLon = airportData.lon//经度
                            this.dataSubForm.startPointLat = airportData.lat//纬度
                            this.dataSubForm.startCityName = airportData.cityName//城市
                            this.dataSubForm.endPoint = ''
                        }
                    }else{
                        this.dataSubForm.orderSubType=2//送机——终点禁用
                        this.disabled4 = true
                        this.disabled3 = false  //起点打开
                        if(airportData){
                            this.dataSubForm.endPoint = airportData.terminalAddress+airportData.terminalName//终点
                            this.dataSubForm.endPointLon = airportData.lon//经度
                            this.dataSubForm.endPointLat = airportData.lat//纬度
                            this.dataSubForm.endCityName = airportData.cityName//城市
                            this.dataSubForm.startPoint = ''
                        }
                    }
                }else{
                    this.disabled1 = true;//航班号、航站楼
                    this.disabled3 = false//接机
                    this.disabled4 = false//送机
                    this.dataSubForm.flightNumber=''//航班号
                    this.dataSubForm.airportData=''//机场id
                    this.dataSubForm.orderSubType=0 // 子订单类型
                }
                //包车
                if(selVal[0]==2){
                    this.disabled2 = false;
                    if(this.dataSubForm.vehicleId){
                        mileageDuration({vehicleId:this.dataSubForm.vehicleId,cityCode:this.dataSubForm.cityCode}).then(result=>{
                            this.mileageDurationList = result
                        })
                    }
                }else{
                    this.disabled2 = true;
                }
            },
            //监听航站楼
            handleAirportChange(item){
                //接机——替换起点
                if(this.dataSubForm.orderSubType==1){
                    this.dataSubForm.startPoint = item.terminalAddress+item.terminalName//起点
                    this.dataSubForm.startPointLon = item.lon//起点经度
                    this.dataSubForm.startPointLat = item.lat//起点纬度
                    this.dataSubForm.startCityName = item.cityName//起点城市
                //送机——替换终点
                }else if(this.dataSubForm.orderSubType==2){
                    this.dataSubForm.endPoint = item.terminalAddress+item.terminalName//终点
                    this.dataSubForm.endPointLon = item.lon//终点经度
                    this.dataSubForm.endPointLat = item.lat//终点纬度
                    this.dataSubForm.endCityName = item.cityName//终点城市
                }
            },
            //查询车型下拉框列表
            async selectCarList(params) {                
                this.optionsCar = await vehicleList(params)
            },
            //航站楼下拉框列表
            async selectTerminalList() {
                this.optionsAirport = await terminalList(this.dataSubForm.cityCode)
            },
            //省份
            async provinceData() {
                const data = await cityList({queryType:1})
                this.provinces = data
            },
            //城市
            async cityData(selVal){
                const data = await cityList({queryType:2,provinceCode:selVal})
                this.citys = data
            },
            //监听省份变化
            provinceChange(selVal){
                this.dataSubForm.cityCode = ''
                this.citys = ''
                if(selVal){
                    this.cityData(selVal);
                    if(selVal===710000){//台湾省没有点对点、包车服务，禁用掉
                        this.dataSubForm.orderTypeValue = ''
                        this.orderTypeOptions[1].disabled = true
                        this.orderTypeOptions[2].disabled = true
                    }else{
                        this.orderTypeOptions[1].disabled = false
                        this.orderTypeOptions[2].disabled = false
                    }
                }
            },      
            //监听下单城市变化 
            cityChange(selVal){
                if(selVal){
                    if(this.dataSubForm.provinceCode!==710000){
                        this.dataSubForm.vehicleId = null
                        this.selectCarList({cityCode:selVal});
                    }
                    this.dataSubForm.airportData=''//机场
                    this.selectTerminalList();
                }
            },  
            //监听台湾城市变化 
            cityChange2(selVal){
                if(selVal){
                    this.addressForm.area = ''
                    cityList({queryType:3,cityCode:selVal.code}).then(result=>{
                        this.addressForm.areaList = result
                    })
                }
            },
            //监听台湾区县变化 
            areaChange(selVal){
                if(selVal){
                    this.addressForm.town = ''
                    cityList({queryType:4,areaCode:selVal.code}).then(result=>{
                        this.addressForm.townList = result
                    })
                }
            },   
            //打开地图——搜索起点/终点
            openMap(type){
                if(type==1){
                    this.dialogTitle = '选择起点'
                }else if(type==2){
                    this.dialogTitle = '选择终点'
                }
                if(this.dataSubForm.provinceCode===710000){//台湾省
                    this.dialogVisible2 = true
                }else{
                    this.dialogVisible1 = true
                    let that = this;
                    BaiduMap.init().then((BMap) => {
                    var map = new BMap.Map("XSDFXPage",{enableMapClick:false});//
                    // 初始化地图,设置中心点坐标和地图级别
                    map.centerAndZoom(new BMap.Point(120.20000,30.26667), 14);
                    // 添加地图类型控件
                    // map.addControl(new BMap.MapTypeControl());  
                    // 设置地图显示的城市 此项是必须设置的
                    map.setCurrentCity("杭州");    
                    // 开启鼠标滚轮缩放      
                    map.enableScrollWheelZoom(true);
                    var ac = new BMap.Autocomplete({//建立一个自动完成的对象
                        "input" : "suggestStart"
                        ,"location" : map
                    });
                    // ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
                    //     hoverList(e)
                    // });
                    ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
                        clickList(e)
                    });
                    var myValue;
                    function hoverList(e){
                        var str = "";
                        var _value = e.fromitem.value;
                        var value = "";
                        if (e.fromitem.index > -1) {
                            value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                        }    
                        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
                        value = "";
                        if (e.toitem.index > -1) {
                            _value = e.toitem.value;
                            value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                        }    
                        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
                        document.getElementById("searchResultPanel").innerHTML = str;
                    }
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
                                if(type==1){//起点
                                    that.dataSubForm.startPoint = myValue
                                    that.dataSubForm.startPointLon = pp.lng
                                    that.dataSubForm.startPointLat = pp.lat
                                    that.dataSubForm.startCityName = _value.city
                                }else if(type==2){//终点
                                    that.dataSubForm.endPoint = myValue
                                    that.dataSubForm.endPointLon = pp.lng
                                    that.dataSubForm.endPointLat = pp.lat
                                    that.dataSubForm.endCityName = _value.city
                                }
                            }
                        }
                        var local = new BMap.LocalSearch(map, { //智能搜索
                            onSearchComplete: myFun
                        });
                        local.search(myValue);
                    }
                })
                }
            },
            //确认起点/终点——台湾
            selectedAddress(){
                this.$refs.addressForm.validate((valid) => {
                    if (valid) {
                        let startPoint = "台湾省"+this.addressForm.city.name+this.addressForm.area.name+(this.addressForm.town.name||'')+this.addressForm.address
                        if(this.dialogTitle == '选择起点'){
                            this.dataSubForm.startPoint = startPoint
                            this.dataSubForm.startPointLon = 0
                            this.dataSubForm.startPointLat = 0
                            this.dataSubForm.startCityName = this.addressForm.city.name
                        }else{
                            this.dataSubForm.endPoint = startPoint
                            this.dataSubForm.endPointLon = 0
                            this.dataSubForm.endPointLat = 0
                            this.dataSubForm.endCityName = this.addressForm.city.name
                        }
                        this.dataSubForm.areaCode = this.addressForm.area.code
                        this.dataSubForm.townCode = this.addressForm.town.code
                        this.dialogVisible2=false
                        this.selectCarList({
                            cityCode:this.addressForm.city.code,
                            townCode:this.addressForm.town.code,
                            airportId:this.dataSubForm.airportData.airportId,
                        });//车型列表
                    }
                })
            },
            //下单
            onSubmit(){
                createOrder(this.dataForm).then(result=>{
                    this.$router.push('/order/list');
                })
            },
            //关闭弹窗
            onDialogClose() {
                this.addressForm = {//台湾选择地址数据
                    city:'',
                    area:'',
                    town:'',
                    address:'',
                    areaList:[],
                    townList:[],
                }
                this.$refs.addressForm.resetFields()
            }
        }
    }
</script>
<style lang="scss">
    .XSDFXPage{
        width: 100%;
        height: 490px;
        overflow: hidden;
        margin: 0;
        font-family: "微软雅黑";
    }
    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }
</style>