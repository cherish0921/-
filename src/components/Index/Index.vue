<template>

  <div class="index">
    <div class="banner_" style="height:5.6rem;">
      <mt-swipe :auto="6000">
       <!--  <mt-swipe-item v-if="activityinfo.show">
          <router-link to="/tokensale" class="myCountdownbanner">
            <div class="mytokensale-index" :class="{'mytokensaletit-endindex':activityinfo.status==2}">
              <div class="mytokensaletit-index">
                  <div class="subtit-index" v-if="activityinfo.status==0">{{$t('tokensale.Beginin')}}</div>
                  <div class="subtit-index" v-else-if="activityinfo.status==1">{{$t('tokensale.Remaining')}}</div>
                  <div class="subtit-index subtitend" v-else-if="activityinfo.status==2">{{$t('tokensale.Endin')}}</div>
              </div>
              <div class="myCountdown-banner" v-if="activityinfo.status==0||activityinfo.status==1">
                  <div class="myCountdown-banneritem">
                      <div class="Countdown-txt justcenter" v-html="activityinfo.timertxt.d"></div>
                      <div class="Countdown-desc">{{$t('tokensale.Days')}}</div>
                  </div>
                  <div class="myCountdown-bannericon">
                      <span></span>
                      <span></span>
                  </div>
                  <div class="myCountdown-banneritem">
                      <div class="Countdown-txt justcenter" v-html="activityinfo.timertxt.h"></div>
                      <div class="Countdown-desc">{{$t('tokensale.Hours')}}</div>
                  </div>
                  <div class="myCountdown-bannericon">
                      <span></span>
                      <span></span>
                  </div>
                  <div class="myCountdown-banneritem">
                      <div class="Countdown-txt justcenter" v-html="activityinfo.timertxt.m"></div>
                      <div class="Countdown-desc">{{$t('tokensale.Mins')}}</div>
                  </div>
                  <div class="myCountdown-bannericon">
                      <span></span>
                      <span></span>
                  </div>
                  <div class="myCountdown-banneritem">
                      <div class="Countdown-txt justcenter"  v-html="activityinfo.timertxt.s"></div>
                      <div class="Countdown-desc">{{$t('tokensale.Secs')}}</div>
                  </div>
              </div>
              <div class="Countdown-footer justcenter">
                <img :src="'https://s.lendx.vip/static/test/images/tokensale/'+($i18n.locale || 'en')+'notokenstart.png'"
                 class="img-response" alt="" v-if="activityinfo.status==0"/>
                 <img :src="'https://s.lendx.vip/static/test/images/tokensale/'+($i18n.locale || 'en')+'tokenactive.png'" 
                 alt="" srcset="" v-if="activityinfo.status==1"/>
                 <img :src="'https://s.lendx.vip/static/test/images/tokensale/'+($i18n.locale || 'en')+'tokenend.png'" 
                 alt="" srcset="" v-if="activityinfo.status==2"/>
              </div>
            </div>
          </router-link>
        </mt-swipe-item>  -->
        <mt-swipe-item v-for="(item,index) in items" :key="index">
          <a :href="item.href"><img :src="item.url" class="img-response" alt="" srcset=""></a>
        </mt-swipe-item>
      </mt-swipe>
    </div>
    <mt-swipe ref="swipe" class="suggest_" :auto=0> 
      <li is="mt-swipe-item" v-for="(item,index) in suggestList" :key="index">
          <div class="suggestItem font16">
            <div class="header">
               <div class="title">{{item.orderId}}<br><span class="font11 darktipcolor">({{item.nickname?item.nickname:$t('新手')}})</span></div>
            </div>
            <div class="content_">
              <p>{{$t('i_期限',{day:item.borrowDays})}}</p>
              <div class="circleloading circleloadinglg">
                <svg width="2.95rem" height="2.95rem" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="65" stroke-width="10" stroke="#a5ccff" fill="none"></circle> 
                  <circle :id="'sc'+item.id" cx="70" cy="70" r="65" stroke-width="10" stroke="#509fff" fill="none" transform="matrix(0,-1,1,0,0,140)" :stroke-dasharray="circleanimate(70,item.boughtAmount,item.borrowAmount)" ></circle>
                </svg> <div class="circleinfo"><span class="font12 darktipcolor">{{$t('年化')}}</span> <br> <span class="gradient_fontco"><i class="font32 " style="font-size:26px;">{{annualized(item.interestRates)}}</i>%</span></div></div>
              <div class="borrowin font12"><div class="left"><span><i class="blueicon"></i>{{fixFloat(item.borrowAmount)}}&nbsp;{{item.borrowCryptoCode}}</span> <br> <span class="font11 darktipcolor">{{$t('借入资产')}}</span></div> 
                  <div v-if="item.nickname" class="right"><span><i class="blueicon"></i>{{fixFloat(item.mortgageAmount)}}&nbsp;{{item.mortgageCryptoCode}}</span> <br> <span class="font11 darktipcolor">{{$t('抵押资产')}}</span></div>
                  <div v-if="!item.nickname" class="right"><span><i class="blueicon"></i>{{computedlimit(item.borrowCryptoCode,true)}}&nbsp;{{item.borrowCryptoCode}}</span> <br> <span class="font11 darktipcolor">{{$t('i_起购资金')}}</span></div>
                </div>
              <div class="commonbtn gradient_blue" v-tap="{methods:goinverst,name:'tap',id:item.id,borrowCryptoId:item.borrowCryptoId}"><span class="font22">{{$t('立即投资')}}</span></div>
            </div>
          </div>
      </li>
    </mt-swipe> 
    <div class="market">
      <h3 class="font16">{{$t('行情市价')}}</h3>
      <div class="marketnewbox">
        <div class="marketnew-head">
          <div>{{$t('币种')}}</div>
          <div>{{$t('最新价')}}</div>
          <div>{{$t('24h涨幅')}}</div>
        </div>
        <transition-group name="lendflip-list1" tag="div">
          <div class="marketnew-coinlist"  v-if="hackReset" v-for="(item,index) in spList" :key="index" v-tap="{methods:changeshowmore,name:'tap',index:index}">
            <div class="marketnew-coin">
              <div class="marketnew-coinname">
                <img :src="'https://s.lendx.vip/static/images/coin/'+item.pairName+'.png'" :alt="item.pairName"/>
                <div>{{item.pairName}}<span v-html="item.pairType"></span></div>
              </div>
              <div class="marketnew-coinprice">
                <span>{{(item.newprice).toFixed(4)}}</span>
                <span>{{$t('元')}}{{getcnyprice(item.newprice)}}</span>
              </div>
              <div class="marketnew-coinextend" :class="((item.increase>0)?'rise':'fall')"><div class="marketnew-block">{{item.increase>0?'+':''}}{{parseFloat(item.increase*100).toFixed(2)}}%</div></div>
            </div>
            <div class="marketnew-coincurve" v-if="item.showmore">
              <div class="marketnew-coindayprice">
                <div class="marketnew-coinpriceitem">
                  <span>{{$t('24h最高价')}}</span>
                  <span>{{(item.high).toFixed(4)}}</span>
                </div>
                <!-- <div class="marketnew-coinpriceitem">
                  <span>{{$t('24h最低价')}}</span>
                  <span>{{(item.low).toFixed(4)}}</span>
                </div> -->
              </div>
              <div class="marketnew-coindayprice">
                <div class="marketnew-coinpriceitem">
                  <span>{{$t('24h最低价')}}</span>
                  <span>{{(item.low).toFixed(4)}}</span>
                </div>
              </div>
              <div class="marketnew-coindaycurve">
                <div class="marketnew-coindaycurvetit">{{$t('24h曲线')}}</div>
                <div class="marketnew-coindaycurbox">
                  <la-cartesian :width="100" :height="30" autoresize :data="item.chartdata.rows">
                    <defs>
                      <linearGradient id="color-id" x1="0" y1="0" x2="0" y2="1">
                        <stop stop-color="#eec8c3" offset="0%" stop-opacity="1"></stop>
                        <stop stop-color="#eec8c3" offset="20%" stop-opacity="0.8"></stop>
                        <stop stop-color="#eec8c3" offset="40%" stop-opacity="0.6"></stop>
                        <stop stop-color="#eec8c3" offset="60%" stop-opacity="0.4"></stop>
                        <stop stop-color="#eec8c3" offset="80%" stop-opacity="0.2"></stop>
                        <stop stop-color="#ebf4ff" offset="100%" stop-opacity="0.2"></stop>
                      </linearGradient>
                    </defs>
                    <defs>
                      <linearGradient id="color-id2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stop-color="#ff902e"></stop>
                        <stop offset="1" stop-color="#ff6343"></stop>
                      </linearGradient>
                    </defs>
                    <la-area animated fill-color="url(#color-id)"  color="url(#color-id2)" curve prop="price"></la-area>
                  </la-cartesian>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
// import { swiper, swiperSlide } from 'vue-awesome-swiper';
import { mapState,mapGetters,mapActions } from 'vuex'
import { Cartesian, Line } from 'laue'   
import { googletotal } from "../../util/watch.js";
var startX = 0;
var animateArr = [];
export default {
  name: "index",
  data() {
    var self=this
    return {
      swiperOption: { //swiper配置项
                // autoplay: true,//可选选项，自动滑动
                // simulateTouch: false, //禁止触摸
                touchMoveStopPropagation : true, //阻止touchmove冒泡事件
                 loop : true,
                 autoplay: {
                  delay: 6000,
                  stopOnLastSlide: false,
                  disableOnInteraction: true,
                },
                on:{
                  init: function(){//Swiper初始化了
                  }, 
/*                   slideChangeTransitionStart: function(){
                    if(this.activeIndex==5){
                      self.startCountdown()
                    }
                  },
                  slideChange: function(){
                    if(this.activeIndex==5){
                      self.startCountdown()
                    }
                  } */
              }
            },
      huilv:1,
      msg: "lendchain",
      suggestList:[],
      spList:[],
     items: [
        {
          title: '靠海',
          // href: 'https://info.lendx.vip/h5event/lend_a0713/index.html?lang='+(this.$i18n.locale || 'en')+'&env=webapp',
          href:  this.LEND.localStorage('haslogin')?'/recommendact':'/Login',
          url: 'https://s.lendx.vip/static/test/images/index/banner1_'+(this.$i18n.locale || 'en')+'.png?t=20180713'
          // url: '../../../static/images/index/banner1_'+(this.$i18n.locale || 'en')+'.png'
        },{
          title: '安全披露',
          href: 'https://info.lendx.vip/h5event/lend_a0713/index.html?lang='+(this.$i18n.locale || 'en')+'&env=webapp',
          url: 'https://s.lendx.vip/static/test/images/index/banner2_'+(this.$i18n.locale || 'en')+'.png?t=20180713'
          // url: '../../../static/images/index/banner2_'+(this.$i18n.locale || 'en')+'.png'
        }],
        /*add wkx */
      activityinfo: {   //活动信息
                readyday: null,//new Date("2018", "6", "23", "12", "00", "00"), //准备时间
                nowtime:  null,//new Date("2018", "6", "24", "14", "08", "00").getTime(), //当前时间
                starttime: null,//new Date("2018", "6", "24", "14", "16", "40").getTime(), //开始时间
                endtime: null,//new Date("2018", "6", "24", "14", "17", "00").getTime(), //结束时间
                status: 0, //活动状态 0 预热 1 活动中 2结束
                timer:null , //计时器ID
                show:false, //是否展示ICO公募
                timertxt:{ //倒计时天，时，分，秒
                    d:'',
                    h:'',
                    m:'',
                    s:''
                }
            },
            hackReset:true//强制重新渲染用
    };
  },
  created(){
        //0-走邀请；2-比特派；3-麦子钱包；4-APP下载
     let sourcelist=[0,2,3,4]
    if(this.getQueryString('source')&&sourcelist.includes(Number(this.getQueryString('source')))){
      this.LEND.localStorage('source',Number(this.getQueryString('source')))
    }
    if(this.$i18n.locale=='ch'){
       if (!this.LEND.localStorage('uuid_b')){  
              this.$data.items.push({
                title: '下载',
                href: 'https://info.lendx.vip/h5event/lend_a0628/index.html?lang=ch&env=webapp',
                url: 'https://s.lendx.vip/static/test/images/index/banner3_ch.png?t=20180713'
                // url: '../../../static/images/index/banner3_ch.png'
              })
       }
    }else if(this.$i18n.locale=='ko'){
               this.$data.items.push({
                title: '下载',
                href: 'https://info.lendx.vip/h5event/lend_a0628/index.html?lang=ko&env=webapp',
                url: 'https://s.lendx.vip/static/test/images/index/banner3_ko.png?t=20180713'
                // url: '../../../static/images/index/banner3_ko.png'
              }) 
    }else{
      this.$data.items.push({
          title: '下载',
          href: 'https://info.lendx.vip/h5event/lend_a0628/index.html?lang=en&env=webapp',
          url: 'https://s.lendx.vip/static/test/images/index/banner3_en.png?t=20180713'
          // url: '../../../static/images/index/banner3_en.png'
        })
    }
  
   /*   let icowhitelist=['en','ko']
     if(icowhitelist.includes(this.$i18n.locale)){
       this.activityinfo.show=true
       let faillist=[undefined,false,true,NaN,Infinity,null,'','undefined','false','true','NaN','Infinity','null']
      if(
        faillist.includes(this.LEND.localStorage('tokensalestarttime'))||
        faillist.includes(this.LEND.localStorage('tokensaleendtime'))
      ){
        this.icogettime() //请求ICO准备时间
      }else{
        let startime=parseInt(this.LEND.localStorage('tokensalestarttime')),endtime=parseInt(this.LEND.localStorage('tokensaleendtime'))
        this.activityinfo.starttime=startime
        this.activityinfo.endtime=endtime
        this.startCountdown()
      }
     }else{
       this.activityinfo.show=false
     } */
  },
  mounted(){
    //    获取汇率
     let symbol=1099;
    if(this.$i18n.locale=='ko'){
      symbol=1100
       this.$axios.get(this.Posturl+'/price/latest',{params:{'symbol':symbol}}).then((result2) =>{
          if((result2.code)==='ok'){
            this.$data.huilv=result2.data.price
            }
        }) 
    }else if(this.$i18n.locale=='ch'){
      symbol=1099
        this.$axios.get(this.Posturl+'/price/latest',{params:{'symbol':symbol}}).then((result2) =>{
          if((result2.code)==='ok'){
            this.$data.huilv=result2.data.price
            }
        }) 
    } 
        this.changeState({type:'isloading',value:true})
    //获取推荐标
         this.$axios.get('/trade/invest/recommends').then( res => {
            if(res.data){
                var suggestList = res.data;
                this.suggestList = suggestList;
            }
        }) 
        //获取实时价格
                  this.$axios.post(this.Posturl+'/price/market',{}).then((result) =>{
           if((result.code)==='ok'){
            for(let k=0;k<result.data.length;k++){
               let obj=result.data[k]
               obj.increase=((obj.close-obj.open)/obj.open).toFixed(4)
               obj.showmore=false
               obj.pairName=obj.pairCode.slice(0,obj.pairCode.indexOf('/')).toUpperCase()
               obj.pairType=obj.pairCode.slice(obj.pairCode.indexOf('/')).toUpperCase()
               //
            // pairId
             this.$axios.get(this.Posturl+'/price/fullPrice',{params:{symbol:obj.pairId}}).then((result1) =>{
              if((result1.code)==='ok'){
                obj.chartdata={columns: ['price', 'price'], rows:result1.data.reverse()} }
                this.$axios.get(this.Posturl+'/price/latest',{params:{symbol:obj.pairId}}).then((result2) =>{
                  if((result2.code)==='ok'){
                    obj.newprice=result2.data.price
                    this.spList.push(obj)
                    }
                }).catch((err) => {
                   this.changeState({type:'isloading',value:false})
                })
                
             }).catch((err) => {
               this.changeState({type:'isloading',value:false})
             })
             }
           }
           this.changeState({type:'isloading',value:false})
         }).catch((err) => {
           this.changeState({type:'isloading',value:false})
         });
  },
   components:{
        LaCartesian: Cartesian,
      LaLine: Line
      // swiper,swiperSlide
  },
  computed:{
    lang() {
		return this.$i18n.locale || "en";
		},
    ishaslogin(){
        let faillist=[undefined,false,NaN,Infinity,null,'','undefined','false','NaN','Infinity','null']
        if(faillist.includes(this.LEND.localStorage('haslogin'))){
          return false
        }else{
          return true
        }
    }
  },
  destroyed(){  //add wkx
        clearInterval(this.activityinfo.timer)
        this.activityinfo.timer=null
    },
  methods: {
        getQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        },
      /*   icogettime(){ //获取请求ICO准备时间 add wkx
            this.$axios.get('/trade/ico/getTime',{}).then((res) => {
                if(res.code==2000){
                    this.activityinfo.nowtime=new Date(parseInt(res.data.now)).getTime()
                    this.activityinfo.starttime=new Date(parseInt(res.data.start)).getTime()
                    this.activityinfo.endtime=new Date(parseInt(res.data.end)).getTime()
                    this.LEND.localStorage('tokensalestarttime',this.activityinfo.starttime)
                    this.LEND.localStorage('tokensaleendtime',this.activityinfo.endtime)
                    this.startCountdown()
                }
            })
        }, */
/*         startCountdown() { //开启倒计时 add wkx
            let now=new Date().getTime()
            if(now<this.activityinfo.starttime){ // 活动处于准备阶段
                this.activityinfo.status=0
                this.activityinfo.timer=setInterval(() => {
                    this.leftTimer(this.activityinfo.starttime)
                },1000)
            }else if(now>this.activityinfo.starttime&&now<this.activityinfo.endtime){ //活动处于进行阶段
                this.activityinfo.status=1
                this.activityinfo.timer=setInterval(() => {
                    this.leftTimer(this.activityinfo.endtime)
                },1000)
            }else if(now>this.activityinfo.endtime){ //活动结束
                clearInterval(this.activityinfo.timer)
                this.activityinfo.timer=null
                this.activityinfo.status=2
                this.activityinfo.timertxt.d='00'
                this.activityinfo.timertxt.h='00'
                this.activityinfo.timertxt.m='00'
                this.activityinfo.timertxt.s='00'
            } 
        }, */
     /*    leftTimer(endtime) { //计算倒计时 addwkx
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
                    this.startCountdown()
                }else{ //活动结束
                    clearInterval(this.activityinfo.timer)
                    this.activityinfo.timer=null
                }
            }
        }, */
        checkTime(i) {  //处理小于10的时间字段 add wkx
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        },
            circleanimate: function(cx, had,all) {
            //  circleanimate(document.querySelector('.circleloadinglg svg circle:last-child'), 35.8); //调用示例
            let percent = Number(had) / Number(all);
             return (Math.PI * 2 * cx*percent+ " " + Math.PI * 2 * cx*(1-percent))
        },
        annualized:function(interest){
      //根据天数来分别发挥年化或者日利率
         return (interest*100*360).toFixed(2)
    },
        getcnyprice:function(val){
      return Number(this.LEND.fixFloat(Number(this.$data.huilv)*Number(val))).toFixed(4)
    },
    fixFloat: function fixFloat(val) {
          return this.LEND.fixFloat(val);
    },
    changeshowmore(param){
      let i=param.index
      this.$data.spList[i].showmore=! this.$data.spList[i].showmore
    },
   gogift:function(){
        let blockchain = this.$store.state.blockchain;
        if(blockchain==-1){  //布洛克城外没登录的话允许后退到原来的路由
            if(this.$store.state.haslogin){
                this.$router.push({ name:'Gift',query:{redirect:'/Index'}});
            }else{
                this.$router.push({ name:'Login'});   
            }
        }else if(blockchain == 0){  //布洛克城内没绑定的话去绑定页面
          this.$router.push({ name:'UserCenterNoBind'});
        }else if(blockchain == 1){  //布洛克城内绑定过的话去推荐页面
          this.$router.push({ name:'Gift',query:{redirect:'/Index'}});
        } 
    },
    goinverst:function(params){
        googletotal('home_detail',this.$i18n.locale,'首页推荐立即投资');
        this.$router.push({ name:'Investmentinfo', query:{id:params.id,borrowCryptoId:params.borrowCryptoId}});
    },
    computedlimit(cointype,ismin){
        //ismin 不获取新手标最大投资额度 ，即要获取新手标最小投资额度
        switch(cointype){
          case 'BTC':
            return  ismin?0.01:0.2
          break;
          case 'GXS':
            return ismin?20:500
          break;
          case 'ETH':
            return ismin?0.1:2
          break;
          case 'USDT':
            return ismin?100:1000
          break;
          default:
          break;
        }
      },
    ...mapActions(['changeState'])
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass">
@import "./Index.scss";
</style>