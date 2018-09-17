<template>
  <div id="Investment">
   <shadebgtip v-if="shadebgtip"  @hideshadebgtip="hideshadebgtip" @touchstart.prevent @touchmove.prevent></shadebgtip>
   <pop v-if="popshow" :title="poptitle()" :type="select_type" :list="poplist()" default=0  @confirmpop="confirmpop" @cancelpop="changepopshow(false)"></pop>
  <div class="Investment iteminfos">
     <inputponent v-show="alertmodule==3" type="1" canmin="200" coinname="USDT" interestRates="3" borrowDays="3" remaincanbuy='100' @cancelalert="cancelalert" @confirmpay="goborrow"></inputponent>
    <!-- <gauthponent v-show="alertmodule==3" type="i" :gtext="gtext" btntext="确认支付" title="谷歌验证" @confirm="goborrow" @cancelalert="cancelalert"/> -->
  </div>  
  <div class="Investment" v-if="module==0">
   <div class="title">
     {{$t('我要借款')}}
   </div>

    <p  class="bindtip">
       {{$t('提示')}}:<br>{{$t('借款提示1')}}
       <br>{{$t('借款提示2')}}
    </p>
    <div class="divs m-borrowtype">
      <div class="borrowtype borrowline selection clearfloat">
        <span>{{$t('借款类型')}}</span>
        <span  @touchend="changepopshow(true,'c')">{{c_type[0].name}}</span>
      </div>
    </div>
    <div class="divs ">
        <div class="borrowline selection clearfloat">
            <span>{{$t('抵押币种')}}</span>
            <span  @touchend="changepopshow(true,'m')">{{mortgage_crypto_code}}</span>
        </div>
        <div class="borrowline selection clearfloat">
            <span>{{$t('借入币种')}}</span>
            <span  @touchend="changepopshow(true,'b')">{{borrow_crypto_code}}</span>
        </div>
    </div>
    <div class="divs ">
        <div class="borrowline  borrowinput clearfloat">
            <span>{{$t('抵押数量')}}</span>
            <input type="Number" v-model="mortgage_amount" @focus="focusinput"  @input="mortgageinput" :placeholder="$t('p_抵押数量')">
        </div>
        <div class="borrowline  borrowinput clearfloat">
            <span>{{$t('借入数量')}}</span>
            <input type="Number" v-model="borrow_amount"   @focus="focusinput" @input="borrowinput" :placeholder="$t('p_借入数量')">
        </div>
    </div>
    <div class="divs">
        <div class="borrowline  clearfloat">
            <span>{{$t('借款利率')}}</span>
        </div>
        <div class="borrowline lilvline clearfloat" style="border:0"> 
            <div class="lendslider" >
                <span v-html="interest_ratesopt[borrow_crypto_code].minrate"></span>
                    <div class="out-slider"> 
                        <p class="value-slider" v-html="interest_ratesopt[borrow_crypto_code].minrate"></p>
                        <i style="width:20px;height:20px
                        padding:20px;
                        border-radius:50%;background-color:#fff;    
                        position: absolute;
                        margin-left:0.038rem;
                        box-shadow: 0px 2px 5px #ccc;
                        margin-top: -10px;" class="value-slidericon" @touchstart="sliderstart"  @touchmove="sliderMove">&nbsp;</i>
                        <span class="in-slider">&nbsp;</span>
                     </div>
                <span v-html="interest_ratesopt[borrow_crypto_code].maxrate"></span>
            </div>
        </div>
    </div>
    <div class="divs  m-borrowdays">
        <div class="borrowline   selection clearfloat">
            <span>{{$t('借款期限')}}</span>
            <span  @touchend="changepopshow(true,'d')">{{borrow_days}}{{$t('天')}}</span>
        </div>
    </div>
    <div class="divs m-income">
        <div class="borrowline income clearfloat">
            <span>{{$t('到期应付利息')}}</span>
            <span class="blue">{{endtimelilv}}&nbsp;{{borrow_crypto_code}}</span>
        </div>
    </div>
        <div class="risk-Notice">
        <div class="mint-cell-wrapper">
            <div class="mint-cell-title">
                <label class="mint-checklist-label">
                    <span class="mint-checkbox">
                        <input type="checkbox" v-model="isreadNotice" class="mint-checkbox-input" value="我已阅读并同意"> 
                        <span class="mint-checkbox-core"></span>
                    </span> 
                    <span class="mint-checkbox-label">{{$t('我已阅读')}}</span>
                </label>
                <div class="Notice-confrim" @touchend="noticeopt.show=true">{{$t('借款须知')}}</div>
            </div> 
        </div>
    </div>
    <notice :show="noticeopt.show" :title="noticeopt.title" :titleclass="noticeopt.titleclass"
    :content="noticeopt.content" :closeicon="noticeopt.closeicon" :hanldbtn="noticeopt.hanldbtn" @closenotice="closenotice"></notice>
    <div class="confirmbtn" @touchend="confirm">{{$t('确认借款')}}</div>
  </div>
  </div>
</template>
<script>
let busy_axios = false;
import { mapState, mapGetters, mapActions } from "vuex";
import { googletotal } from "../util/watch.js";
import inputponent from "./Investment/inputponent";
import shadebgtip from "./common/shadebgtip";
import notice from './common/notice'
import pop from "./common/pop";
var timeout_cp, timeout_m, timeout_b;
export default {
  name: "Investment",
  data() {
    return {
      shadebgtip: false,
      popshow: false,
      select_type: "",
      limodule: 0,
      log_module: [0],
      alertmodule: 0,
      c_days: ["3", "7", "14", "30", "90"],
      c_type: ["Mortgage loan"],
      c_b: ["USDT"],
      c_m: ["BTC", "ETH", "GXS"],
      borrow_pairs: [], //抵押跟借入币种的关系列表
      borrow_type_id: 1,
      borrow_crypto_id: 0, //当前的借入币种id
      borrow_crypto_code: "USDT", //当前的借入币种名称
      borrow_amount: "", //借入数量
      mortgage_crypto_id: 0, //当前的抵押币种id
      mortgage_crypto_code: "", //当前的抵押币种名称
      mortgage_amount: "", //抵押数量
      borrow_days: 3,
      mortgage_rates: 0.5,
      nowPrice: "",
      interest_rates: 0.0005,
      endtimelilv: "0",
      userremain: "",
      createtime: "",
      gtext: "",
      startX: 0,
      interest_ratesopt: {
        //借款利率配置项
        USDT: {
          min: 0.5,
          max: 10,
          minrate: "0.05%",
          maxrate: "1.00%",
          interest_rates: 0.0005
        },
        BTC: {
          min: 0.3,
          max: 10,
          minrate: "0.03%",
          maxrate: "1.00%",
          interest_rates: 0.0003
        },
        ETH: {
          min: 0.3,
          max: 10,
          minrate: "0.03%",
          maxrate: "1.00%",
          interest_rates: 0.0003
        },
        GXS: {
          min: 0.3,
          max: 10,
          minrate: "0.03%",
          maxrate: "1.00%",
          interest_rates: 0.0003
        },
        QKC: {
          min: 0.3,
          max: 10,
          minrate: "0.03%",
          maxrate: "1.00%",
          interest_rates: 0.0003
        },
        LV: {
          min: 0.3,
          max: 10,
          minrate: "0.03%",
          maxrate: "1.00%",
          interest_rates: 0.0003
        } 
      },
      isreadNotice:false, //addwkx 0817 是否阅读借款须知
        noticeopt:{
            show:false,
            title:this.$t('knowBorrow.title'),
            content:[
                this.$t('knowBorrow.contents[0]'),
                this.$t('knowBorrow.contents[1]'),
                this.$t('knowBorrow.contents[2]')
            ],
            titleclass:'',
            closeicon:true,
            hanldbtn:false
        }
    };
  },
  watch: {
    mortgage_crypto_id: function(val, old) {
      document.querySelector(
        ".Investment .lendslider .out-slider .value-slidericon"
      ).style.marginLeft =
        "0.038rem";
      document.querySelector(
        ".Investment .lendslider .out-slider .in-slider"
      ).style.width =
        "5%";
      document.querySelector(
        ".Investment .lendslider .out-slider .value-slider"
      ).innerHTML =
        (val / 10).toFixed(2) + "%";
      document.querySelector(
        ".Investment .lendslider .out-slider .value-slider"
      ).innerHTML = this.interest_ratesopt[this.borrow_crypto_code].minrate;
      var _c_b = [];
      for (var i = 0; i < this.$data.borrow_pairs.length; i++) {
        let vars = {
          crypto_id: this.$data.borrow_pairs[i].borrowCryptoId,
          crypto_code: this.$data.borrow_pairs[i].borrowCryptoCode
        };
        if (
          this.$data.borrow_pairs[i].mortgageCryptoId ==
          this.$data.mortgage_crypto_id
        ) {
          _c_b.push(vars);
        }
      }
      function unique(arr, key) {
        let hash = {};
        arr = arr.reduce(function(item, next) {
          hash[next[key]] ? "" : (hash[next[key]] = true && item.push(next));
          return item;
        }, []);
        return arr;
      }
      _c_b = unique(_c_b, "crypto_id"); //去重
      this.$data.borrow_crypto_id = _c_b[0].crypto_id;
      this.$data.borrow_crypto_code = _c_b[0].crypto_code;
      this.$data.c_b = _c_b;
      for (var i = 0; i < this.$data.c_m.length; i++) {
        if (this.$data.c_m[i].crypto_id == this.$data.mortgageCryptoId) {
          this.$data.mortgageRyptoCode = this.$data.c_m[i].crypto_code;
        }
      }
      this.$data.borrow_amount = "";
      this.$data.mortgage_amount = "";
    },
    borrow_amount: function(val, oldval) {
      if (
        Number(this.$data.borrow_amount) <= 0 ||
        this.$data.mortgage_amount <= 0
      ) {
        this.$data.endtimelilv = "0";
        return false;
      }
      if (timeout_cp) {
        clearTimeout(timeout_cp);
      }
      timeout_cp = setTimeout(() => {
        // this.Q2(this.$data.mortgage_crypto_code.toString(), this.$data.borrow_crypto_code.toString())
        this.$data.endtimelilv = this.LEND.fixFloat(
          this.LEND.m(
            Number(this.$data.borrow_amount),
            this.LEND.m(this.$data.interest_rates, this.$data.borrow_days)
          ).toString()
        );
        if(this.$data.endtimelilv.indexOf('e')!== -1){
          this.$data.endtimelilv=(Number(this.$data.endtimelilv)).toFixed(18).replace(/\.?0+$/, "")
        }
      }, 1000);
    },
    borrow_crypto_id(val, old) {
        this.mortgage_amount = "";
        this.borrow_amount = "";
    },
    borrow_crypto_code(val, old) {
      //币种名称变化
      document.querySelector(
        ".Investment .lendslider .out-slider .value-slidericon"
      ).style.marginLeft =
        "0.038rem";
      document.querySelector(
        ".Investment .lendslider .out-slider .in-slider"
      ).style.width =
        "5%";
      document.querySelector(
        ".Investment .lendslider .out-slider .value-slider"
      ).innerHTML = this.interest_ratesopt[val].minrate;
      this.interest_rates = this.interest_ratesopt[val].interest_rates;
    },
    borrow_days(val, old) {
      //监听借款日期变化
      if (
        Number(this.$data.borrow_amount) <= 0 ||
        this.$data.mortgage_amount <= 0
      ) {
        this.$data.endtimelilv = "0";
        return false;
      }
      if (timeout_cp) {
        clearTimeout(timeout_cp);
      }
      timeout_cp = setTimeout(() => {
        // this.Q2(this.$data.mortgage_crypto_code.toString(), this.$data.borrow_crypto_code.toString())
        this.$data.endtimelilv = this.LEND.fixFloat(
          this.LEND.m(
            Number(this.$data.borrow_amount),
            this.LEND.m(this.$data.interest_rates, this.$data.borrow_days)
          ).toString()
        );
        if(this.$data.endtimelilv.indexOf('e')!== -1){
          this.$data.endtimelilv=(Number(this.$data.endtimelilv)).toFixed(18).replace(/\.?0+$/, "")
        }
      }, 1000);
    }
  },
  mounted() {
    document.getElementsByTagName('html')[0].style.overflow='visible' //addwkx 0817
    this.changeState({ type: "isloading", value: true });
    //获取借款类型
    this.$axios.get("/trade//borrow/types", {}).then(result => {
      switch (Number(result.code)) {
        case 2000: {
          this.$data.c_type = result.data;
          break;
        }
        default: {
          this.$toast(result.message.toString());
        }
      }
    });
    //获取抵押键值对
    this.$axios
      .get("/trade/crypto/borrow-pairs", { params: { type_id: 1 } })
      .then(result => {
        switch (Number(result.code)) {
          case 2000: {
            var unique5 = function(arr, key) {
              let hash = {};
              arr = arr.reduce(function(item, next) {
                hash[next[key]]
                  ? ""
                  : (hash[next[key]] = true && item.push(next));
                return item;
              }, []);
              return arr;
            };
            var _c_m = [];
            for (var i = 0; i < result.data.length; i++) {
              _c_m.push({
                crypto_id: result.data[i].mortgageCryptoId,
                crypto_code: result.data[i].mortgageRyptoCode
              });
            }
            _c_m = unique5(_c_m, "crypto_id");
            this.$data.borrow_pairs = result.data;
            this.$data.mortgage_crypto_code = result.data[0].mortgageRyptoCode;
            this.$data.mortgage_crypto_id = result.data[0].mortgageCryptoId;
            this.$data.c_m = _c_m;

            break;
          }
          default: {
            this.$toast(result.message.toString());
          }
        }
        this.changeState({ type: "isloading", value: false });
      });
  },
  updated() {},
  computed: {
    module() {
      return this.$store.state.module;
    }
  },
  methods: {
      closenotice(obj){ //关闭借款须知 addwkx 0817
        this.noticeopt=Object.assign(this.noticeopt,obj)
        document.getElementsByTagName('html')[0].style.overflow='visible'
      },
    hideshadebgtip: function() {
      this.$data.shadebgtip = false;
    },
    focusinput: function() {
      this.usercan_canuse();
      this.getPriceFun(this.$data.mortgage_crypto_id, this.$data.borrow_crypto_id).then( (res) => {
                this.$data.mortgage_amount=''
                this.$data.mortgage_amount=this.LEND.fixFloat(this.LEND.d(Number(this.$data.borrow_amount),this.LEND.m(Number(this.$data.nowPrice),Number(this.$data.mortgage_rates))))    
                this.$data.nowPrice=res
            })
    },
    mortgageinput: function() {
      if (parseFloat(this.mortgage_amount) < 0) {
        this.mortgage_amount = 0;
        return this.$toast($t('必须大于0'));
      }
      let decimal = this.mortgage_amount.indexOf(".");
      if (decimal != -1 && this.mortgage_amount.slice(decimal + 1).length > 6) {
        this.mortgage_amount = "";
        this.borrow_amount = "";
        return this.$toast(this.$t('最多位小数num',{num:6}));
      }
      this.$data.borrow_amount = this.LEND.fixFloat(
        this.LEND.m(Number(this.$data.nowPrice),this.LEND.m(Number(this.$data.mortgage_amount),Number(this.$data.mortgage_rates)))
      );
      if(this.$data.borrow_amount.indexOf('e')!== -1){
        this.$data.borrow_amount=(Number(this.$data.borrow_amount)).toFixed(18).replace(/\.?0+$/, "")
      }
      this.$data.endtimelilv = this.LEND.fixFloat(this.LEND.m(Number(this.$data.borrow_amount),this.LEND.m(this.$data.interest_rates, this.$data.borrow_days)).toString());
      if(this.$data.endtimelilv.indexOf('e')!== -1){
        this.$data.endtimelilv=(Number(this.$data.endtimelilv)).toFixed(18).replace(/\.?0+$/, "")
      }
    },
    borrowinput: function() {
      if (parseFloat(this.borrow_amount) < 0) {
        this.borrow_amount = 0;
        return this.$toast($t('必须大于0'));
      }
      let decimal = this.borrow_amount.indexOf(".");
      if (decimal != -1 && this.borrow_amount.slice(decimal + 1).length > 6) {
        this.borrow_amount = 0;
        this.mortgage_amount = 0;
        return this.$toast(this.$t('最多位小数num',{num:6}));
      }
      this.$data.mortgage_amount = this.LEND.fixFloat(
        this.LEND.d(
          Number(this.$data.borrow_amount),
          this.LEND.m(
            Number(this.$data.nowPrice),
            Number(this.$data.mortgage_rates)
          )
        )
      );
      if(this.$data.mortgage_amount.indexOf('e')!== -1){
        this.$data.mortgage_amount=(Number(this.$data.mortgage_amount)).toFixed(18).replace(/\.?0+$/, "")
      }
      this.$data.endtimelilv = this.LEND.fixFloat(
        this.LEND.m(
          this.$data.borrow_amount,
          this.LEND.m(this.$data.interest_rates, this.$data.borrow_days)
        ).toString()
      );
      if(this.$data.endtimelilv.indexOf('e')!== -1){
        this.$data.endtimelilv=(Number(this.$data.endtimelilv)).toFixed(18).replace(/\.?0+$/, "")
      }
    },
    /*
       getPriceFun: function(mn,bn){
                let symbolObj = {
                "BTC": 1000,
                "ETH": 1001,
                "GXS": 1002,
                "QKC":1003,
            };
            let symbol1 = '';
            let symbol2 = '';
            let flag = '' ;
            let price = 0;
            if(mn!="USDT"){ //当抵押币种不是USDT需请求
                flag = false;
                symbol1 = symbolObj[mn];
                if(bn!="USDT"){   //当借入币种不是USDT需请求
                    symbol2 = symbolObj[bn];
                }
            }else{  //当抵押币种是USDT则需要比率需要求反  flag作为求反的标识符
                flag = true;
                symbol2 = symbolObj[bn];
            }
            let gerArr = [];
            if(symbol1){
                gerArr.push(this.$axios.get(`${this.Posturl}/price/latest?symbol=${symbol1}`)); 
            }
            if(symbol2){
                gerArr.push(this.$axios.get(`${this.Posturl}/price/latest?symbol=${symbol2}`)); 
            }
            if(gerArr.length == 1){
                gerArr[0].then((res)=>{   //单个请求完成时
                    if(res.code=='ok'){
                        if(flag){
                            this.nowPrice = 1/res.data.price;
                        }else{
                            this.nowPrice = res.data.price;
                        }
                        price = this.nowPrice;
                        this.createtime = res.data.timestamp;
                    }else{
                        this.$toast(res.message);
                    }    
                })
            }else{
                let that = this;
                this.$axios.all(gerArr).then(this.$axios.spread(function (acct, perms) {
                    //两个请求现在都执行完成
                    if(acct.code=='ok' && perms.code=='ok'){
                        that.nowPrice = acct.data.price/perms.data.price;
                        price = that.nowPrice;
                        that.createtime = acct.data.timestamp;
                    }else{
                        that.$toast(acct.message || perms.message);
                    }
                }));  
            }
            return Number(price);
    },
    */
    getPriceFun:async function(mid,bid){//抵押币种id,借入币种id
                let that = this,price;
                const result=await new Promise((reslove,reject) => {
                    this.$axios.get(`/trade/crypto/price?mortgageCryptoId=${mid}&borrowCryptoId=${bid}`).then(res=>{
                        switch(Number(res.code)){
                            case 2000:
                            price=res.data.price;
                            // this.$data.mortgage_amount=''
                            that.$data.nowPrice=res.data.price;
                            that.$data.createtime = res.data.timestamp;
                            reslove(Number(price));
                            break;
                            default:
                            this.$toast(res.message)
                            break;
                        }
                    }).catch(err=>{
                        
                    });  
                });
                return result
        },
    usercan_canuse: function usercan_canuse() {
      //获取用户输入的押品品比对
      this.$axios
        .get("/trade/asset/amount", {
          params: { cryptoId: this.$data.mortgage_crypto_id }
        })
        .then(result => {
          switch (Number(result.code)) {
            case 2000: {
              this.$data.mortgage_amount=''
              this.$data.userremain = Number(result.data.amount);
              break;
            }
            default: {
              this.$toast(result.message.toString());
            }
          }
        });
    },
    cancelalert() {
      this.$data.alertmodule = 0;
    },
    sliderstart(e) {
      e.preventDefault();
      this.$data.startX = e.changedTouches[0].pageX;
    },
    sliderMove(e) {
      e.preventDefault();
      let outleft = document
        .querySelector(".Investment .lendslider .out-slider")
        .getBoundingClientRect().left;
      let outwidth = document.querySelector(
        ".Investment .lendslider .out-slider"
      ).clientWidth;
      if (
        e.changedTouches[0].pageX - e.target.clientWidth / 2 > outleft &&
        e.changedTouches[0].pageX - e.target.clientWidth / 2 <
          outleft + outwidth
      ) {
        let hasmove =
          (e.changedTouches[0].pageX - e.target.clientWidth / 2 - outleft) /
            (document.body.clientWidth / 10) +
          0.1;

        let val = Number(
          hasmove / (outwidth / document.body.clientWidth)
        ).toFixed(1);
        if (val <= this.interest_ratesopt[this.borrow_crypto_code].min) {
          val = this.interest_ratesopt[this.borrow_crypto_code].min;
        } else if (val >= this.interest_ratesopt[this.borrow_crypto_code].max) {
          val = this.interest_ratesopt[this.borrow_crypto_code].max;
        }
        e.target.style.marginLeft = hasmove - 0.2 + "rem";
        this.$data.interest_rates = Number(this.LEND.d(Number(val), 1000));
        this.$data.endtimelilv = this.LEND.fixFloat(
          this.LEND.m(
            Number(this.$data.borrow_amount),
            this.LEND.m(this.$data.interest_rates, this.$data.borrow_days)
          ).toString()
        );
        document.querySelector(
          ".Investment .lendslider .out-slider .in-slider"
        ).style.width =
          hasmove - 0.1 + "rem";
        document.querySelector(
          ".Investment .lendslider .out-slider .value-slider"
        ).innerHTML =
          (val / 10).toFixed(2) + "%";
        // e.target.nextSibling.style=hasmove+"rem"
      }
    },
    confirmpop(val) {
      switch (this.$data.select_type) {
        case "c":
          this.$data.borrow_type_id = 1;
          break;
        case "b":
          this.$data.borrow_crypto_id = val;
          this.$data.borrow_crypto_code = this.$data.c_b.find(ele => {
            if (ele.crypto_id == val) {
              return ele;
            }
          }).crypto_code;
          break;
        case "d":
          this.$data.borrow_days = this.$data.c_days[val];
          this.$data.endtimelilv = this.LEND.fixFloat(
            this.LEND.m(
              Number(this.$data.borrow_amount),
              this.LEND.m(this.$data.interest_rates, this.$data.borrow_days)
            ).toString()
          );
          break;
        case "m":
          this.$data.mortgage_crypto_id = val;

          this.$data.mortgage_crypto_code = this.$data.c_m.find(ele => {
            if (ele.crypto_id == val) {
              return ele;
            }
          }).crypto_code;
          break;
        default:
          break;
      }
    },
    poptitle() {
      let title;
      switch (this.$data.select_type) {
        case "c":
          title = this.$t('借款类型');
          break;
        case "b":
          title = this.$t('借入币种');
          break;
        case "m":
          title = this.$t('抵押币种');
          break;
        case "d":
          title = this.$t('期限');
          break;
        default:
          break;
      }
      return title;
    },
    poplist() {
      let list;
      switch (this.$data.select_type) {
        case "c":
          list = this.$data.c_type;
          break;
        case "b":
          list = this.$data.c_b;
          break;
        case "m":
          list = this.$data.c_m;
          break;
        case "d":
          list = this.$data.c_days;
          break;
        default:
          break;
      }
      return list;
    },
    changepopshow(val, type) {
      type = type || "";
      this.$data.select_type = type;
      this.$data.popshow = val;
    },
    confirm() {
      if (this.LEND.localStorage("haslogin") &&this.LEND.localStorage("haslogin").toString() == "false") {
        this.$router.push({path:this.$store.state.blockchain == 0 ? "/UserCenterNoBind" : "/Login"});
        return;
      }
      //TODO:判断是否登录而已认证  否shadebgtip=true
      if (
        Number(this.LEND.localStorage("igoogle")) != 1 ||
        Number(this.LEND.localStorage("iphone")) != 1
      ) {
        this.$data.shadebgtip = true;
        return false;
      }
      if (this.LEND.localStorage("nickname") == "") {
        this.$MessageBox
          .alert(
           this.$t('设置昵称_借款前'),
            { title:this.$t('提示'), confirmButtonText:this.$t('确定')}
          )
          .then(() => {
            this.$router.push({ path: "/UserCenterSetting" });
          });
        return false;
      }
      if (this.LEND.localStorage("kyc").toString() != "2") {
        this.$MessageBox.alert(this.$t('安全认证_借款前'),
            { title:this.$t('提示'), confirmButtonText:this.$t('确定')})
          .then(() => {
            this.$router.push({ path: "/Safe" });
          });
        return false;
      }
        if(!this.isreadNotice){ //addwkx 0817
            this.$toast(this.$t('knowBorrow.firstRead'));
            return false;
        }
      let min_borrowLimit = { BTC: 0.2, GXS: 200, ETH: 2, USDT: 1000 }; //最小借入数量
      let getp = async () => {
        await this.getPriceFun(this.$data.mortgage_crypto_id,this.$data.borrow_crypto_id);
        return "ok3";
      };
      if (Number(this.$data.userremain) < Number(this.$data.mortgage_amount)) {
        this.$toast(this.$t('抵押物不足num',
        {num:this.$data.mortgage_amount +" " +this.$data.mortgage_crypto_code}));
        return false;
      } else if (
        Number(this.$data.borrow_amount) <min_borrowLimit[this.$data.borrow_crypto_code]) {
        this.$toast(this.$t('起借数量') +min_borrowLimit[this.$data.borrow_crypto_code] +this.$data.borrow_crypto_code);
      } else {
        getp().then(v => {
          // this.$data.borrow_amount=this.LEND.fixFloat(this.LEND.m(Number(this.$data.nowPrice),this.LEND.m(Number(this.$data.mortgage_amount),Number(this.$data.mortgage_rates))))
          //   this.$data.endtimelilv =this.LEND.fixFloat(this.LEND.m(Number(this.$data.borrow_amount),this.LEND.m(this.$data.interest_rates,this.$data.borrow_days)).toString())
          googletotal('loan_confirm',this.$i18n.locale,'点击“确认借款”');
          this.$data.alertmodule = 3;
        });
      }
    },
    goborrow: function(gcode) {
      if (busy_axios) {
        return false;
      }
      googletotal('loan_submit_googleCode',this.$i18n.locale,'点击提交谷歌验证码');
      let getp = async () => {
        await this.getPriceFun(this.$data.mortgage_crypto_id,this.$data.borrow_crypto_id);
        return "ok3";
      };
      getp().then(v => {
        if (gcode.toString().length != 6) {
          this.$toast($t('谷歌验证码错误'));
          return false;
        }
        let symbol =
          this.$data.mortgage_crypto_code + this.$data.borrow_crypto_code;
        //获取symbol
        if (symbol == "BTCUSDT") {
          symbol = 1000;
        } else if (symbol == "ETHUSDT") {
          symbol = 1001;
        } else if (symbol == "GXSUSDT") {
          symbol = 1002;
        } else if (symbol == "QKCUSDT") {
          symbol = 1003;
        } else {
          symbol = 2000;
        }
        let p_data = {
          access_token: this.LEND.localStorage("access_token"),
          borrowAmount: this.$data.borrow_amount,
          borrowCryptoId: this.$data.borrow_crypto_id,
          borrowCryptoCode: this.$data.borrow_crypto_code, //监听用户选择
          borrowDays: this.$data.borrow_days,
          // 'borrow_type_id': this.$data.borrow_type_id,
          // 'mortgage_rates': this.$data.mortgage_rates, //目前定死50%
          interestRates: this.$data.interest_rates,
          mortgageAmount: this.$data.mortgage_amount,
          mortgageCryptoId: this.$data.mortgage_crypto_id,
          mortgageCryptoCode: this.$data.mortgage_crypto_code, //监听用户选择
          mortgagePrice: this.$data.nowPrice,
          time: this.$data.createtime,
          googleCode: gcode,
          symbol: symbol
        };
        busy_axios = true;
        this.$axios.post("/trade/borrow/create", p_data).then(result => {
          switch (Number(result.code)) {
            case 2000: {
              this.$toast(this.$t('借款成功'));
              googletotal('loan_successful',this.$i18n.locale,'借款成功');
              this.$router.push({ path: "myborrows" });
              break;
            }
            default: {
              this.$toast(result.message.toString());
            }
          }
          busy_axios = false;
        });
      });
    },
    ...mapActions(["changeState"])
  },
  components: {
    'inputponent':inputponent,
    'shadebgtip':shadebgtip,
    'pop':pop,
    notice 
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
@import '../assets/css/mixin.scss'
@import "../components/Borrow/Borrow.scss"

</style>
