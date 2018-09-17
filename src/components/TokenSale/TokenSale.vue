<template>
    <div class="tokensale">
        <div class="goback">
            <img src="../../../static/images/icon/pic_nav.png" 
            @touchend="goBack" alt="后退" class="img-response"/>
        </div>
        <div class="tokensaletit tokensaletitpd">
            <img src="https://s.lendx.vip/static/en/images/tokensale/tokenSaletitle.png" alt="Token Sale" class="img-response"/>
        </div>
        <div class="tokensaletit">
            <div class="subtit" v-if="activityinfo.status==0">{{$t('tokensale.Beginin')}}</div>
            <div class="subtit" v-else-if="activityinfo.status==1">{{$t('tokensale.Remaining')}}</div>
            <div class="subtit endin" v-else-if="activityinfo.status==2">{{$t('tokensale.Endin')}}</div>
        </div>
        <!-- 倒计时 -->
        <div class="Countdown" v-if="activityinfo.status!=2">
            <div class="Countdown-item">
                <div class="Countdown-txt justcenter" v-html="activityinfo.timertxt.d"></div>
                <div class="Countdown-desc">{{$t('tokensale.Days')}}</div>
            </div>
            <div class="Countdown-icon">
                <span></span>
                <span></span>
            </div>
            <div class="Countdown-item">
                <div class="Countdown-txt justcenter" v-html="activityinfo.timertxt.h"></div>
                <div class="Countdown-desc">{{$t('tokensale.Hours')}}</div>
            </div>
            <div class="Countdown-icon">
                <span></span>
                <span></span>
            </div>
            <div class="Countdown-item">
                <div class="Countdown-txt justcenter" v-html="activityinfo.timertxt.m"></div>
                <div class="Countdown-desc">{{$t('tokensale.Mins')}}</div>
            </div>
            <div class="Countdown-icon">
                <span></span>
                <span></span>
            </div>
            <div class="Countdown-item">
                <div class="Countdown-txt justcenter"  v-html="activityinfo.timertxt.s"></div>
                <div class="Countdown-desc">{{$t('tokensale.Secs')}}</div>
            </div>
        </div>
        <!-- 活动进行中滚动播放认购进度 -->
        <div class="swiper-box" @touchmove.prevent v-if="activityinfo.status==1&&buytoken.length">
            <div class="swiper-container">
                <swiper :options="swiperOption">
                    <swiper-slide v-for="(item, index) in buytoken" :key="index">
                        <div class="mtswiper-item">
                                <div class="mtswiper-buyuser">
                                    <!-- <span class="mtswiper-buyusertit">User:</span> -->
                                    <span class="mtswiper-ubyusername" v-html="item.email"></span>
                                </div>
                                <div class="mtswiper-investing">
                                    <span class="mtswiper-buyusertit">{{$t('tokensale.Invested')}}</span>
                                    <span class="mtswiper-buynum" v-html="item.amount"></span>
                                    <span class="mtswiper-buycoin" v-html="item.cryptoCode"></span>
                                </div>
                            </div>
                    </swiper-slide>
                </swiper>
            </div>
        </div>
        <!-- 活动结束 -->
        <!-- <div class="swiper-box" @touchmove.prevent v-if="activityinfo.status==2&&LEND.localStorage('haslogin')=='true'">
            <div class="swiper-container">
                <div class="mtswiper-item">
                    <div class="mtswiper-endbuyuser">
                        <span class="mtswiper-endactive">{{$t('tokensale.activityrewards1')}}<span class="lvrewards">{{userico.lvcoin}}LV</span>{{$t('tokensale.activityrewards2')}}</span>
                    </div>
                </div>
            </div>
        </div> -->
        <!-- token购买详情楼层 -->
        <div class="token-body">
            <div class="token-container">
                <div class="token-head">
                    <div class="token-title" v-if="activityinfo.status!=2">
                        <span>{{$t('tokensale.youinvest')}}</span>
                        <i></i>
                    </div>
                    <div class="token-title" v-if="activityinfo.status==2">
                        <span v-if="lvcoinstatus=='0'" class="lvcoinstatus">{{$t('tokensale.Waitingsettlement')}}</span>
                        <span v-else-if="lvcoinstatus=='1'&&lvcoinSettlement.length">{{$t('tokensale.activityrewards1')}}<span class="lvrewards">{{userico.lvcoin}}LV</span>{{$t('tokensale.activityrewards2')}}</span>
                        <span  class="lvcoinstatus" v-else>{{$t('tokensale.noreward')}}</span>
                        <i></i>
                    </div>
                </div>
                <!-- 我的ICO记录 -->
                <div class="myicoinvestment-record" v-if="LEND.localStorage('haslogin')=='true'&&(activityinfo.status==1||activityinfo.status==2)">
                    <div class="myico-btn" @touchend="showinvestment">{{$t('tokensale.investmentrecord')}}</div>
                </div>
                <template v-if="iconborrowlist.length&&activityinfo.status!=2">
                    <div class="token-box" v-for="item in iconborrowlist" :key="item.id">
                        <div class="tokensale-head">
                            <div class="tokensale-coin" v-html="item.cryptoCode"></div>
                            <div class="tokensale-normel">
                                <span class="normal-title">{{$t('tokensale.Raised')}}</span>
                                <!-- <span class="normal-num" v-html="item.availamount"></span> -->
                                <span class="normal-num" v-html="item.lessborrowAmount"></span>
                                <span class="normal-coin" v-html="item.cryptoCode"></span>
                            </div>
                        </div>
                        <div class="tokensale-boby">
                            <div class="tokensale-clinch" :style="{ width: item.process}">
                                <span class="tokensale-progress progressstyle0"></span>
                                <span class="tokensale-progressnum" v-html="item.process" 
                                v-if="item.processresult>0"></span>
                            </div>
                        </div>
                        <div class="tokensale-fotter">
                            <div class="tokensale-btngroup" v-if="activityinfo.status==1">
                                <button class="progressstyle0" @touchend="goInvest(item)">{{$t('tokensale.Investnow')}}</button>
                                <div class="tokensale-shadow progressstyle0"></div>
                            </div>
                            <div class="tokensale-btngroup" v-if="activityinfo.status==2">
                                <button class="endprogressstyle">{{$t('tokensale.Endin')}}</button>
                            </div>
                            <div class="tokensale-btngroup" v-if="activityinfo.status==0">
                                <button class="endprogressstyle">{{$t('tokensale.Investnow')}}</button>
                            </div>
                        </div>
                    </div>
                </template>
                <!-- add 结束后LV发放 -->
                <template v-if="activityinfo.status==2">
                    <div class="endtotalbox" v-if="lvcoinstatus=='1'&&lvcoinSettlement.length">
                        <div class="endtotal-item endtotal-head">
                            <div class="endtotal-subitem">{{$t('tokensale.Time')}}</div>
                            <div class="endtotal-subitem">{{$t('tokensale.Amount')}}</div>
                            <div class="endtotal-subitem endtotal-Range">{{$t('tokensale.Range')}}</div>
                            <div class="endtotal-subitem">{{$t('tokensale.LV')}}</div>
                        </div>
                        <div class="endtotal-item" v-for="(item, index) in lvcoinSettlement" :key="index">
                            <div class="endtotal-subitem" v-html="filterdatetime(item.investTime,true)"></div>
                            <div class="endtotal-subitem" v-html="item.investAmount"></div>
                            <div class="endtotal-subitem endtotal-Range" v-html="item.rank"></div>
                            <div class="endtotal-subitem" v-html="item.lvAmount"></div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <!-- 彻底结束描述 -->
        <div class="activity-desc"  v-if="lvcoinstatus=='1'">
            <div class="activity-content">
                <div class="activity-descttxt" v-for="(item, index) in $t('tokensale.precautionslistend')" :key="index">
                    <div class="activity-num" v-html="item.label"></div>
                    <div class="activity-txt" v-html="item.text"></div>
                </div>
            </div>
        </div>
        <!-- 活动描述 -->
        <div class="activity-desc" v-if="lvcoinstatus!='1'">
            <div class="activity-content">
                <div class="activity-title">{{$t('tokensale.Introduction')}}</div>
                <img :src="'https://s.lendx.vip/static/test/images/tokensale/priceint'+$i18n.locale+'.png'" class="img-response" alt="">
                <div class="activity-descttxt" v-for="(item, index) in $t('tokensale.distributionlist')" :key="index">
                    <div class="activity-num" v-html="item.label"></div>
                    <div class="activity-txt" v-html="item.text"></div>
                </div>
            </div>
        </div>
        <!-- 活动描述2 -->
        <div class="activity-desc"  v-if="lvcoinstatus!='1'">
            <div class="activity-content">
                <div class="activity-title">{{$t('tokensale.Precautions')}}</div>
                <div class="activity-descttxt" v-for="(item, index) in $t('tokensale.precautionslist')" :key="index" v-if="activityinfo.status==0">
                    <div class="activity-num" v-html="item.label"></div>
                    <div class="activity-txt" v-html="item.text"></div>
                </div>
                <div class="activity-descttxt" v-for="(item, index) in $t('tokensale.precautionsliststrat')" :key="index" v-if="activityinfo.status==1||activityinfo.status==2">
                    <div class="activity-num" v-html="item.label"></div>
                    <div class="activity-txt" v-html="item.text"></div>
                </div>
            </div>
        </div>
        <!-- 弹出输入软件盘 -->
        <TokenSaleinput :show="Saleinputopt.show" :type="Saleinputopt.type" 
        :coin="Saleinputopt.coin" :placeholder="Saleinputopt.placeholder" 
        :title="Saleinputopt.title" :maxiptnum="Saleinputopt.maxiptnum"
        :miniptnum="Saleinputopt.miniptnum" :isdecimal="Saleinputopt.isdecimal" 
        :disabledbtn="Saleinputopt.disabledbtn" :availamount="Saleinputopt.availamount"
        @cancelalert="assignSaleinputopt" @gopay="gopay"/>
        <!-- 我的私募详情 -->
        <div class="myicon-recording" v-show="userico.showrecords" ref="myiconrecording">
            <div class="recording-container">
                <div class="recording-head">
                    <div class="recording-close" @touchend="closemyicondialog"><img src="https://s.lendx.vip/static/test/images/icon/pic_navb.png" class="img-response"/></div>
                    <div class="recording-tit">{{$t('tokensale.invest-record')}}</div>
                    <div></div>
                </div>
                <div class="recording-totalbody">
                    <div class="recording-total">
                        <div class="recording-total-title">{{$t('tokensale.totalinvestment')}}(ETH)</div>
                        <div class="recording-total">
                            <i class="recording-Estimate">≈</i>
                            <span class="recording-totalnuum" v-html="ethtotal"></span>
                        </div>
                    </div>
                </div>
                <div class="recording-newcontainer">
                    <div class="recording-coin">
                        <div class="recording-coinitem">
                            <span class="coinitem-name">ETH&nbsp;{{$t('tokensale.totalinvestment')}}</span>
                            <span class="coinitem-price">{{userico.ETH.Amount}}&nbsp;ETH</span>
                        </div>
                        <div class="recording-coinitem">
                            <span class="coinitem-name">QKC&nbsp;{{$t('tokensale.totalinvestment')}}</span>
                            <span class="coinitem-price">{{userico.QKC.Amount}}&nbsp;QKC</span>
                        </div>
                    </div>
                    <div class="recording-cointab">
                        <div class="cointab-item" :class="{selected:cointabname=='ETH'}" @touchend.prevent="dealdistributionlist('ETH')"><span>ETH</span></div>
                        <div class="cointab-item" :class="{selected:cointabname=='QKC'}" @touchend.prevent="dealdistributionlist('QKC')"><span>QKC</span></div>
                    </div>
                    <div class="recording-listcontaier">
                        <template v-if="distributionlist.length">
                            <div class="recording-item" v-for="(item, index) in distributionlist" :key="index">
                                <div class="recording-content">
                                    <div class="recording-time" v-html="filterdatetime(item.ctime)"></div>
                                    <div class="recording-token">
                                        <span class="recording-tokentit">{{$t('tokensale.token')}}</span>
                                        <span class="recording-tokencoinname" v-html="item.cryptoCode"></span>
                                    </div>
                                    <div class="recording-token">
                                        <span class="recording-tokentit">{{$t('tokensale.Amountinvestment')}}</span>
                                        <span class="recording-tokenname" v-html="item.amount"></span>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions } from "vuex";
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import TokenSaleinput from "./TokenSaleinput";
export default {
    name: "tokensale",
    data() {
        return {
            activityinfo: {   //活动信息
                readyday: null,//new Date("2018", "6", "23", "12", "00", "00"), //准备时间
                nowtime: null,//new Date("2018", "8", "24", "14", "08", "00").getTime(), //当前时间
                starttime:null,// new Date("2018", "7", "27", "11", "09", "00").getTime(), //开始时间
                endtime: null,//new Date("2018", "7", "27", "11", "10", "00").getTime(), //结束时间
                status: 2, //活动状态 0 预热 1 活动中 2结束
                timer:null , //计时器ID
                timertxt:{ //倒计时天，时，分，秒
                    d:'',
                    h:'',
                    m:'',
                    s:''
                }
            },
            buytoken: [], //已购买token轮播
            iconborrowlist:[], //ICO投资列表标
            userico:{ //用户ICO投资详情
                QKC:{
                    Amount:0, //已投QKC数量
                    userlastcoinnum:0, //用户剩余该币种可投数量
                    userAvailAmount:0, //用户持有该币种余额
                    placeholder:null, //提示文字
                    min:1, //最小投资额
                    max:50, //最大投资额
                    scale:6000 //比例
                },
                ETH:{
                    Amount:0, //已投ETH数量
                    userlastcoinnum:0, //用户剩余该币种可投数量
                    userAvailAmount:0, //用户持有该币种余额
                    placeholder:null, //提示文字
                    min:1, //最小投资额
                    max:50, //最大投资额
                    scale:1 //比例
                },
                ico:{ 
                    borrowId:null , //标的ID
                    googleCode:null , //谷歌验证码
                    amount:null //投资数量
                },
                showrecords:false,
                lvcoin:0, //LV奖励
                records:[] //我的投资记录
            },
            Saleinputopt:{ //软键盘配置项
                show:false,// 是否展示软键盘
                type:0, //第一步认购
                coin:null, //认购币种
                placeholder:null, //辅助输入框提示性文字
                title:null, //键盘title
                maxiptnum:null, //最大输入金额
                miniptnum:null, //最小输入金额
                isdecimal:true, //是否允许小数输入
                disabledbtn:false, //是否禁用提交按钮
                availamount:null //剩余可投
            },
            swiperOption: { //swiper配置项
                autoplay: true,//可选选项，自动滑动
                direction: 'vertical', //垂直播放
                simulateTouch: false, //禁止触摸
                touchMoveStopPropagation : true //阻止touchmove冒泡事件
            },
            cointabname:'ETH',
            distributionlist:[], //ETH、QKC
            lvcoinstatus:null, //ICO LV活动奖励结算状态
            lvcoinSettlement:[] //ICO LV活动奖励结算
        };
    },
    created() {
        this.changeState({type:'isloading',value:true})
        this.icogettime() //请求ICO准备时间
        if(this.activityinfo.status==1||this.activityinfo.status==2){ 
            this.mergerequest() //进入后合并多个请求
        }
    },
    watch:{
        activityinfo:{
            status(val,old){ //监视活动状态
                if(val==1||val==2){
                    if(val==2&&this.LEND.localStorage('haslogin')=='true'){ //用户已登录且活动结束
                        this.getuserlv() //获取用户LV奖励
                    }
                    this.mergerequest() //进入后合并多个请求
                }
            }
        }
    },
    computed:{
        ethtotal(){
            let faillist=[undefined,false,NaN,Infinity,null,'','undefined','false','NaN','Infinity','null'],ethamount=this.userico.ETH.Amount,qkcamount=this.userico.QKC.Amount,total=0
            if(faillist.includes(ethamount)){
                ethamount=0
            }
            if(faillist.includes(qkcamount)){
                qkcamount=0
            }
            total=(Math.ceil((ethamount+qkcamount/9200)*100)/100).toFixed(2)
            return total
        }
    },
    methods: {
        goBack(){ //回退
            this.$router.push({path:'/'});    
        },
        startCountdown() { //开启倒计时
            let now=new Date().getTime()
            if(now<this.activityinfo.starttime){ // 活动处于准备阶段
                this.activityinfo.status=0
                this.$axios.all([this.geticoborrowlist()]).then(this.$axios.spread( (res1) => {
                        if(res1.code==2000&&res1.data.length){
                            res1.data.forEach((ele,index) => {
                                let keepdecimals=['ETH']
                                let lessborrowAmountnum=Number(ele.borrowAmount)-Number(ele.boughtAmount)
                                if(keepdecimals.includes(ele.cryptoCode.toUpperCase())){
                                    lessborrowAmountnum=lessborrowAmountnum.toFixed(2)
                                }
                                this.$set(ele,'lessborrowAmount',lessborrowAmountnum)
                                let percent=Number(ele.boughtAmount)/Number(ele.borrowAmount)
                                if(percent>=1){
                                    this.$set(ele,'process','100%')
                                }else{
                                    this.$set(ele,'process',this.toPercent(percent))
                                }
                                this.$set(ele,'processresult',percent)
                            })
                            this.iconborrowlist=res1.data
                        }
                        this.changeState({type:'isloading',value:false})
                }));
                this.activityinfo.timer=setInterval(() => {
                    this.leftTimer(this.activityinfo.starttime)
                },1000)
            }else if(now>this.activityinfo.starttime&&now<this.activityinfo.endtime){ //活动处于进行阶段
                this.activityinfo.status=1
                this.mergerequest() //进入后合并多个请求
                this.activityinfo.timer=setInterval(() => {
                    this.leftTimer(this.activityinfo.endtime)
                },1000)
            }else if(now>this.activityinfo.endtime){ //活动结束
                clearInterval(this.activityinfo.timer)
                this.activityinfo.timer=null
                this.activityinfo.status=2
                if(this.LEND.localStorage('haslogin')=='true'){ //用户已登录
                    this.getuserlv() //获取用户LV奖励
                }
                this.mergerequest() //进入后合并多个请求
                this.activityinfo.timertxt.d='00'
                this.activityinfo.timertxt.h='00'
                this.activityinfo.timertxt.m='00'
                this.activityinfo.timertxt.s='00'
            } 
        },
        leftTimer(endtime) { //计算倒计时
            let leftTime=endtime-new Date().getTime()
            let days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
            let hours = parseInt((leftTime / 1000 / 60 / 60) % 24, 10); //计算剩余的小时
            let minutes = parseInt((leftTime / 1000 / 60) % 60, 10); //计算剩余的分钟
            let seconds = parseInt((leftTime / 1000) % 60, 10); //计算剩余的秒数
            days = this.checkTime(days);
            hours = this.checkTime(hours);
            minutes = this.checkTime(minutes);
            seconds = this.checkTime(seconds);
            if (days >= 0 || hours >= 0 || minutes >= 0 || seconds >= 0) { //开启定时器
                this.activityinfo.timertxt.d=days
                this.activityinfo.timertxt.h=hours
                this.activityinfo.timertxt.m=minutes
                this.activityinfo.timertxt.s=seconds
            }
            if (parseInt(days) <= 0 && parseInt(hours) <= 0 && parseInt(minutes) <= 0 && parseInt(seconds) <= 0) { //清除定时器
                this.activityinfo.timertxt.d='00'
                this.activityinfo.timertxt.h='00'
                this.activityinfo.timertxt.m='00'
                this.activityinfo.timertxt.s='00'
                if(this.activityinfo.status==0||this.activityinfo.status==1){ //活动处于进行阶段
                    this.$router.go(0)
                }else{ //活动结束
                    clearInterval(this.activityinfo.timer)
                    this.activityinfo.timer=null
                }
            }
        },
        checkTime(i) {  //处理小于10的时间字段
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        },
        toPercent(val){ //转成百分比
            return (Math.round(val * 10000)/100).toFixed(2) + '%';
        },
        icogettime(){ //获取请求ICO准备时间
            this.$axios.get('/trade/ico/getTime',{}).then((res) => {
                if(res.code==2000){
                    this.activityinfo.nowtime=new Date(parseInt(res.data.now)).getTime()
                    this.activityinfo.starttime=new Date(parseInt(res.data.start)).getTime()
                    this.activityinfo.endtime=new Date(parseInt(res.data.end)).getTime()
                    this.startCountdown()
                    this.changeState({type:'isloading',value:false})
                }
            })
        },
        geticoinvestlist(){ //获取滚动ICO投资列表 最近10条
            return this.$axios.get('/trade/ico/investlist',{page:1,limit:10})
        },
        geticoborrowlist(){ //获取ICO投资标
            return this.$axios.get('/trade/ico/borrowlist',{})
        },
        getuserprofile(){ //获取用户信息
            return this.$axios.get('/trade/user/profile')
        },
        getusericoinvestlist(){ //获取我的投资列表
            this.$axios.get('/trade/ico/user/investlist?page=1&limit=100',{page:1,limit:100}).then((res) => {
                this.userico.records=res.data.page.records
                this.dealdistributionlist(this.cointabname)
            })
        },
        dealdistributionlist(coinname){ //add 切换ICO投资记录选择项
            this.cointabname=coinname
            if(!this.userico.records.length){
                return
            }
            this.distributionlist=this.userico.records.filter((item,index) => {
                if(item.cryptoCode.toUpperCase()==coinname){
                    return item
                }
            })
        },
        getusericobalance(){ //获取ICO投资可用余额
            return this.$axios.get('/trade/ico/user/balance',{})
        },
        mergerequest(){ //合并发送请求
            if(Boolean(this.LEND.localStorage('haslogin'))&&this.LEND.localStorage('haslogin')=='true'){ //用户已登录
                this.$axios.all([this.getuserprofile(),this.geticoinvestlist(),this.geticoborrowlist(),this.getusericobalance()]).then(this.$axios.spread( (res1,res2,res3,res4) => {
                    switch (Number(res1.code)) { //处理用户账户信息
                        case 2000:
                            {
                                this.LEND.localStorage('nickname', res1.data.nickname);
                                break;
                            }
                        default:{this.$toast(res1.message);}
                    }
                    if(res2.data.records.length){
                        this.buytoken=res2.data.records //10条滚动轮播ICO投资列表
                    }
                    if(res3.code==2000&&res3.data.length&&res4.code==2000){ //获取ICO投资标
                        res3.data.forEach((ele,index) => {
                            let keepdecimals=['ETH']
                            let lessborrowAmountnum=Number(ele.borrowAmount)-Number(ele.boughtAmount)
                            if(keepdecimals.includes(ele.cryptoCode.toUpperCase())){
                                lessborrowAmountnum=lessborrowAmountnum.toFixed(2)
                            }
                            this.$set(ele,'lessborrowAmount',lessborrowAmountnum)
                            let percent=Number(ele.boughtAmount)/Number(ele.borrowAmount)
                            if(percent>=1){
                                this.$set(ele,'process','100%')
                            }else{
                                this.$set(ele,'process',this.toPercent(percent))
                            }
                            if(res4.data[ele.cryptoCode.toLowerCase()]){
                                if(ele.cryptoCode.toLowerCase()=='qkc'){
                                    this.$set(ele,'availamount',String(Math.floor(res4.data[ele.cryptoCode.toLowerCase()][`${ele.cryptoCode.toLowerCase()}LastAmount`])))
                                }else{
                                    let mylastamount=String(Number(res4.data[ele.cryptoCode.toLowerCase()][`${ele.cryptoCode.toLowerCase()}LastAmount`]))
                                    if(mylastamount.indexOf('.')>-1){
                                        mylastamount=mylastamount.slice(0,mylastamount.indexOf('.')+3)
                                    }
                                    this.$set(ele,'availamount',mylastamount)
                                }
                            }
                            this.$set(ele,'processresult',percent)
                        })
                        this.iconborrowlist=res3.data
                    }
                    if(res4.code==2000){ //ICO投资可用余额
                        for (let key in res4.data) {
                            if(this.userico[key.toUpperCase()]){
                                this.userico[key.toUpperCase()].Amount=res4.data[key][`${key.toLowerCase()}Amount`]
                                this.userico[key.toUpperCase()].userlastcoinnum=res4.data[key][`${key.toLowerCase()}LastAmount`]
                                this.userico[key.toUpperCase()].userAvailAmount=res4.data[key][`${key.toLowerCase()}AvailAmount`]
                                this.userico[key.toUpperCase()].min=parseFloat(res4.data[key][`${key.toLowerCase()}MinAmount`])
                                this.userico[key.toUpperCase()].max=parseFloat(res4.data[key][`${key.toLowerCase()}MaxAmount`])
                            }
                        }
                    }
                    this.changeState({type:'isloading',value:false})
                })).catch((err) => {
                    console.log(err)
                });
            }else{ //未登录
                if(this.activityinfo.status==1||this.activityinfo.status==2){
                    this.$axios.all([this.geticoinvestlist(),this.geticoborrowlist()]).then(this.$axios.spread( (res1,res2) => {
                        if(res1.data.records.length){
                            this.buytoken=res1.data.records
                        }
                        if(res2.code==2000&&res2.data.length){
                            res2.data.forEach((ele,index) => {
                                let keepdecimals=['ETH']
                                let lessborrowAmountnum=Number(ele.borrowAmount)-Number(ele.boughtAmount)
                                if(keepdecimals.includes(ele.cryptoCode.toUpperCase())){
                                    lessborrowAmountnum=lessborrowAmountnum.toFixed(2)
                                }
                                this.$set(ele,'lessborrowAmount',lessborrowAmountnum)
                                let percent=Number(ele.boughtAmount)/Number(ele.borrowAmount)
                                if(percent>=1){
                                    this.$set(ele,'process','100%')
                                }else{
                                    this.$set(ele,'process',this.toPercent(percent))
                                }
                                this.$set(ele,'processresult',percent)
                            })
                            this.iconborrowlist=res2.data
                        }
                        this.changeState({type:'isloading',value:false})
                    }));
                }
            }
        },
        goInvest(obj){ //点击参与私募认购
            if(this.activityinfo.status==0){ //活动未开始
                this.$toast(this.$t('tokensale.toast.notActivity'));
                return false;
            }
            if(this.activityinfo.status==2){ //活动已结束
                this.$toast(this.$t('tokensale.toast.eventover'));
                return false;
            }
            if( this.LEND.localStorage('haslogin')==''||(typeof this.LEND.localStorage('haslogin')=='undefined')||(this.LEND.localStorage('haslogin')=="false") ){ //未登录
                this.$router.push({ 
                    path:(this.$store.state.blockchain==0)?'/UserCenterNoBind':'/Login',
                    query:{redirect:this.$route.fullPath}
                })
                return false;
            }
            if(
                (Number(this.LEND.localStorage('igoogle')) != 1)||
                ( Number(this.LEND.localStorage('iphone')) != 1)||
                (Number (this.LEND.localStorage('kyc') !=2))
            ){ //未谷歌验证 手机验证
                this.$MessageBox.alert(this.$t('tokensale.toast.certification'),{title:this.$t('提示'),confirmButtonText:this.$t('tokensale.toast.Confirm')}).then(()=>{
                    this.$router.push({ name:'Safe',query:{redirect:this.$route.fullPath}})
                })
                return false;
            }
            if(obj.boughtAmount>=obj.borrowAmount||obj.process=="100%"){ //已售完token
                this.$toast(`${this.$t('tokensale.toast.soldout',{coin: obj.cryptoCode.toUpperCase()})}`);
                return false;
            }
            const isdecimallist=['ETH']
            this.userico.ico.borrowId=obj.id
            let params={
                show:true,
                type:0,
                coin:obj.cryptoCode,
                placeholder:null,
                title:this.$t('tokensale.toast.InvestAmount'),
                maxiptnum:this.userico[obj.cryptoCode.toUpperCase()].max,
                miniptnum:null,
                isdecimal:false,
                availamount:obj.availamount
            }
            if(Number(params.maxiptnum)>Number(obj.borrowAmount-obj.boughtAmount)){ //用户剩余额度》标的剩余额度
                params.maxiptnum=parseFloat((Number(obj.borrowAmount-obj.boughtAmount)).toFixed(2))
            }
            if(isdecimallist.includes(obj.cryptoCode.toUpperCase())){
                params.isdecimal=true
                params.miniptnum=this.userico[obj.cryptoCode.toUpperCase()].min
                params.placeholder=`${this.$t('tokensale.toast.mininput',{min: this.userico[obj.cryptoCode.toUpperCase()].min})}`
            }else{
                params.miniptnum=Math.floor(this.userico[obj.cryptoCode.toUpperCase()].min)
                params.placeholder=`${this.$t('tokensale.toast.mininput',{min: Math.floor(this.userico[obj.cryptoCode.toUpperCase()].min)})}`
            }
            if(this.userico[obj.cryptoCode.toUpperCase()].Amount>0){ //非首次投注
                if(this.userico[obj.cryptoCode.toUpperCase()].userlastcoinnum==0||this.userico[obj.cryptoCode.toUpperCase()].userlastcoinnum<0){
                    params.placeholder=`${this.$t('tokensale.toast.mininput',{min: 0})}`
                }
            }
            this.assignSaleinputopt(params)
        },
        assignSaleinputopt(obj){ //重置软键盘配置项
            this.Saleinputopt=Object.assign(this.Saleinputopt,obj)
        },
        gopay(obj){ //确认支付
            let illegallist=[undefined,null,false,NaN,Infinity,'','undefined','null','false','NaN','Infinity']
            if(Number(obj.type)==0){ //认购阶段
                if(illegallist.includes(parseFloat(obj.amount))){ //输入非法
                    this.$toast(this.$t('tokensale.toast.againenter'));
                    return 
                }
                if(parseFloat(obj.amount)<this.userico[obj.coin.toUpperCase()].min){ //输入数量小于最低输入量
                    this.$toast(`${this.$t('tokensale.toast.coinmininput',{coin:obj.coin.toUpperCase(),min:this.userico[obj.coin.toUpperCase()].min})}`);
                    return
                }
                if(parseFloat(obj.amount)>this.userico[obj.coin.toUpperCase()].userlastcoinnum){ //输入数量大于剩余该币种可投数量
                    this.$toast(`${this.$t('tokensale.toast.coinmaxinput',{coin:obj.coin.toUpperCase(),max:this.userico[obj.coin.toUpperCase()].userlastcoinnum})}`);
                    return
                }
                if(
                    this.userico[obj.coin.toUpperCase()].userAvailAmount<0||
                    this.userico[obj.coin.toUpperCase()].userAvailAmount<this.userico[obj.coin.toUpperCase()].min||
                    this.userico[obj.coin.toUpperCase()].userAvailAmount==''
                ){ //账户余额小于0，为空，用户余额少于最低投资数量，
                    this.assignSaleinputopt({show:false})
                    this.$MessageBox.alert(`${this.$t('tokensale.toast.balanceinsufficient',{coin:obj.coin.toUpperCase()})}`,{
                        title:this.$t('提示'),confirmButtonText:this.$t('tokensale.toast.Confirm'),showCancelButton:true,cancelButtonText:this.$t('tokensale.toast.Cancel')}).then((action)=>{
                        if(action=='confirm'){
                            this.$router.push({ path:'/Wallet',query:{redirect:this.$route.fullPath}})
                        }else{
                            this.assignSaleinputopt({
                                show:false,
                                type:0, 
                                coin:null, 
                                placeholder:null, 
                                title:null, 
                                maxiptnum:null, 
                                miniptnum:null, 
                                isdecimal:true, 
                                disabledbtn:false, 
                                availamount:null
                            })
                        }
                    })
                    return
                }
                if(parseFloat(obj.amount)>parseFloat(this.userico[obj.coin.toUpperCase()].userAvailAmount)){ //输入量>用户余额
                    this.$MessageBox.alert(`${this.$t('tokensale.toast.balanceinsufficient',{coin:obj.coin.toUpperCase()})}`,{
                        title:this.$t('提示'),confirmButtonText:this.$t('tokensale.toast.Confirm'),showCancelButton:true,cancelButtonText:this.$t('tokensale.toast.Cancel')}).then((action)=>{
                        if(action=='confirm'){
                            this.$router.push({ path:'/Wallet',query:{redirect:this.$route.fullPath}})
                        }else{
                            this.assignSaleinputopt({
                                show:false,
                                type:0, 
                                coin:null, 
                                placeholder:null, 
                                title:null, 
                                maxiptnum:null, 
                                miniptnum:null, 
                                isdecimal:true, 
                                disabledbtn:false, 
                                availamount:null
                            })
                        }
                    })
                    return
                }   
                this.userico.ico.amount=obj.amount
                this.assignSaleinputopt({
                    show:true,
                    type:1,
                    placeholder:this.$t('tokensale.toast.googlecode'),
                    title:this.$t('tokensale.toast.entergooglecode'),
                    isdecimal:false
                })
            }else if(Number(obj.type)==1){ //校验谷歌验证码
                if(illegallist.includes(obj.amount)){
                    this.$toast(this.$t('tokensale.toast.sixdigits'))
                    return 
                }
                if(this.activityinfo.status==0){ //活动未开始
                    this.$toast(this.$t('tokensale.toast.notActivity'))
                    return
                }
                if(this.activityinfo.status==2){ //活动已结束
                    this.$toast(this.$t('tokensale.toast.eventover'))
                    return
                }
                this.userico.ico.googleCode=obj.amount
                this.assignSaleinputopt({disabledbtn:true})
                this.$axios.post('/trade/ico/invest',{
                    borrowId:this.userico.ico.borrowId,
                    googleCode:this.userico.ico.googleCode,
                    amount:this.userico.ico.amount,
                    access_token:this.LEND.localStorage('access_token')
                }).then((res) => {
                    switch (Number(res.code)) {
                        case 2000:
                            this.$toast(this.$t('tokensale.toast.success'));
                            this.assignSaleinputopt({
                                show:false,
                                type:0, 
                                coin:null, 
                                placeholder:null, 
                                title:null, 
                                maxiptnum:null, 
                                miniptnum:null, 
                                isdecimal:true,
                                disabledbtn:false
                            });
                            this.userico.ico=Object.assign(this.userico.ico,{ 
                                borrowId:null , 
                                googleCode:null , 
                                amount:null 
                            })
                            if(true){ //this.activityinfo.status==1||this.activityinfo.status==2
                                this.mergerequest() //进入后合并多个请求
                            }
                        break;
                        case -1:this.$toast(res.message);this.assignSaleinputopt({disabledbtn:false});break;
                        default:this.$toast(res.message);this.assignSaleinputopt({disabledbtn:false});break;
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }
        },
        showinvestment(){ //展示投资记录
            this.userico.showrecords=!this.userico.showrecords
            this.getusericoinvestlist()
        },
        closemyicondialog(){ //关闭投资记录
            this.userico.showrecords=false
        },
        filterdatetime(str,isslice=false){ //过滤时间
            if(!str){
                return
            }
            str=parseInt(str)
            if(!isslice){
                return `${new Date(str).getFullYear()}.${this.checkTime(new Date(str).getMonth()+1)}.${this.checkTime(new Date(str).getDate())}  ${this.checkTime(new Date(str).getHours())}:${this.checkTime(new Date(str).getMinutes())}:${this.checkTime(new Date(str).getSeconds())}`
            }else{
                return `${this.checkTime(new Date(str).getMonth()+1)}.${this.checkTime(new Date(str).getDate())}  ${this.checkTime(new Date(str).getHours())}:${this.checkTime(new Date(str).getMinutes())}`
            }
        },  
        getuserlv(){    //获取用户LV奖励
            this.$axios.get(`/trade/ico/user/lv?access_token=${this.LEND.localStorage('access_token')}`,{}).then((res) => {
                this.lvcoinstatus=res.data.balanceFlag
                if(res.data.page){
                    this.lvcoinSettlement=res.data.page.records
                }
                this.userico.lvcoin=res.data.lv||0
            }).catch((f) => {
                console.log(f)
            })
        },
        ...mapActions(['changeState'])
    },
    components: {
        TokenSaleinput,swiper,swiperSlide
    },
    destroyed(){ 
        clearInterval(this.activityinfo.timer)
        this.activityinfo.timer=null
    }
};
</script>
<style lang="sass" scoped>
@import "./TokenSale.scss";
</style>