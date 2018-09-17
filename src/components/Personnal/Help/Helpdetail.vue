<template>
    <div id="usercenter">
        <template v-if="selected==1">
        <div class="header_pl">
            <div class="headerline">
                <img src="https://s.lendx.vip/static/test/images/icon/pic_navb.png" @touchend="cancelalert" alt=""> 
                <p>{{$t('help[0].title')}}</p>
            </div>  
        </div>
            <div class="trans-rate">
                <p>{{$t('help[0].contents[0]')}}</p>
                <p>{{$t('help[0].contents[1]')}}<b>{{$t('help[0].contents[2]')}}</b></p>
                <p>{{$t('help[0].contents[3]')}}</p>
                <p>{{$t('help[0].contents[4]')}}</p>
                <div class="payinfo">
                    <ul>
                        <li>{{$t('help[0].contents[5]')}}</li><li>BTC</li><li>ETH</li><li>EOS</li><li>GXS</li><li>USDT</li></ul><ul><li>{{$t('help[0].contents[6]')}}</li><li>Bitcoin</li><li>Ethereum</li><li>EOS</li><li>GXS</li><li>TetherUS</li></ul><ul><li style="padding: 0;text-align: center;">{{$t('help[0].contents[7]')}}</li><li>0.0005 BTC</li><li>0.008 ETH</li><li>0.3 EOS</li><li>0.3 GXS</li><li>10 USDT</li>
                    </ul>
                </div>
            </div>
        </template>
        <template v-if="selected==2">
            <div class="header_pl">
                <div class="headerline">
                    <img src="https://s.lendx.vip/static/test/images/icon/pic_navb.png" @touchend="cancelalert" alt=""> 
                    <p>{{$t('help[1].title')}}</p>
                </div>  
            </div>
            <div class="risk-manage">
                <h4>{{$t('help[1].contents[0].title')}}</h4>
                <p class="ptitle">{{$t('help[1].contents[0].p')}}</p>
                <h4>{{$t('help[1].contents[1].title')}}</h4>
                <p class="ptitle">{{$t('help[1].contents[0].p')}}</p>
                <h4>{{$t('help[1].contents[2].title')}}</h4>
                <p class="ptitle">{{$t('help[1].contents[2].p')}}</p>
            </div>
        </template>
        <template v-if="selected==3">
            <div class="header_pl">
                <div class="headerline">
                    <img src="https://s.lendx.vip/static/test/images/icon/pic_navb.png" @touchend="cancelalert" alt=""> 
                    <p>{{$t('help[2].title')}}</p>
                </div>  
            </div>
            <div class="risk-manage">
                <h4>{{$t('help[2].contents.riskmanagetit1')}}</h4>
                 <p class="ptitle">{{$t('help[2].contents.riskmanagetit2')}}</p>
                <img v-lazy="$t('help[2].contents.riskmanagepic1')" alt="" srcset="">
                <p class="ptitle">{{$t('help[2].contents.riskmanagetit3')}}</p>
                <img v-lazy="$t('help[2].contents.riskmanagepic2')" alt="" srcset="">
                 <p class="ptitle">{{$t('help[2].contents.riskmanagetit4')}}</p>
                <img v-lazy="$t('help[2].contents.riskmanagepic3')" alt="" srcset=""> 
                <h4>{{$t('help[2].contents.riskmanagetit5')}}</h4>
                <p class="ptitle">IOS</p>
                <p class="ptitle">{{$t('help[2].contents.riskmanagetit6')}}</p>
                <p class="ptitle">{{$t('help[2].contents.riskmanagetit7')}}</p>
                <p class="ptitle">{{$t('help[2].contents.riskmanagetit8')}}</p>
                 <img v-lazy="$t('help[2].contents.riskmanagepic4')" alt="" srcset="">
                <p class="ptitle">{{$t('help[2].contents.riskmanagetit9')}}</p>
                 <img v-lazy="$t('help[2].contents.riskmanagepic5')" alt="" srcset="" >
                <p class="ptitle">{{$t('help[2].contents.riskmanagetit10')}}</p>
                <img v-lazy="$t('help[2].contents.riskmanagepic6')" alt="" srcset="">
                <p class="ptitle">{{$t('help[2].contents.riskmanagetit11')}}</p>
                 <img v-lazy="$t('help[2].contents.riskmanagepic7')" alt="" srcset="">
                <p class="ptitle">{{$t('help[2].contents.riskmanagetit12')}}</p>
                <p class="ptitle">{{$t('help[2].contents.riskmanagetit13')}}</p>
                <p class="ptitle">{{$t('help[2].contents.riskmanagetit14')}}</p>
                <img v-lazy="$t('help[2].contents.riskmanagepic8')" alt="" srcset="" >
                <img v-lazy="$t('help[2].contents.riskmanagepic9')" alt="" srcset="" >
                <p class="ptitle">{{$t('help[2].contents.riskmanagetit15')}}</p>
                <img v-lazy="$t('help[2].contents.riskmanagepic10')" alt="" srcset="">
                <p class="ptitle">{{$t('help[2].contents.riskmanagetit16')}}</p>
                <img v-lazy="$t('help[2].contents.riskmanagepic11')" alt="" srcset="" >
                <p class="ptitle">{{$t('help[2].contents.riskmanagetit17')}}</p>
                <img v-lazy="$t('help[2].contents.riskmanagepic12')" alt="" srcset="" >
                <h4>{{$t('help[2].contents.riskmanagetit18')}}</h4>
                <p class="ptitle">{{$t('help[2].contents.riskmanagetit19')}}</p>
                <img v-lazy="$t('help[2].contents.riskmanagepic13')" alt="" srcset="">
                <p class="ptitle">{{$t('help[2].contents.riskmanagetit20')}}</p>
                <img v-lazy="$t('help[2].contents.riskmanagepic14')" alt="" srcset="">
                <p class="ptitle">{{$t('help[2].contents.riskmanagetit21')}}</p>
                <img v-lazy="$t('help[2].contents.riskmanagepic15')" alt="" srcset="">
                <p class="ptitle">{{$t('help[2].contents.riskmanagetit22')}}</p>
                <img v-lazy="$t('help[2].contents.riskmanagepic16')" alt="" srcset="">
                <h4>{{$t('help[2].contents.riskmanagetit23')}}</h4>
                <p class="ptitle">{{$t('help[2].contents.riskmanagetit24')}}</p>
                <img v-lazy="$t('help[2].contents.riskmanagepic17')" alt="" srcset="">
                <p class="ptitle">{{$t('help[2].contents.riskmanagetit25')}}</p>
                <img v-lazy="$t('help[2].contents.riskmanagepic18')" alt="" srcset="">
                <p class="ptitle">{{$t('help[2].contents.riskmanagetit26')}}</p>
                <p class="ptitle">{{$t('help[2].contents.riskmanagetit27')}}</p>
                <img v-lazy="$t('help[2].contents.riskmanagepic19')" alt="" srcset="">
            </div>
        </template>
        <template v-if="selected==4">
            <div class="header_pl">
                <div class="headerline">
                    <img src="https://s.lendx.vip/static/test/images/icon/pic_navb.png" @touchend="cancelalert" alt=""> 
                    <p>{{$t('help[3].title')}}</p>
                </div>  
            </div>
            <div class="risk-manage">
                <h4>{{$t('help[3].title')}}</h4>
                <p class="ptitle">{{$t('help[3].contents[0]')}}</p>
                <p class="ptitle">{{$t('help[3].contents[1]')}}</p>
                <p class="ptitle">{{$t('help[3].contents[2]')}}</p>
                <p class="ptitle">{{$t('help[3].contents[3]')}}</p>
                <p class="ptitle">{{$t('help[3].contents[4]')}}</p>
                <p class="ptitle">{{$t('help[3].contents[5]')}}</p>
                <p class="ptitle">{{$t('help[3].contents[6]')}}</p>
                <p class="ptitle">{{$t('help[3].contents[7]')}}</p>
            </div>
        </template>
        <template v-if="selected==5">
            <div class="header_pl">
                <div class="headerline">
                    <img src="https://s.lendx.vip/static/test/images/icon/pic_navb.png" @touchend="cancelalert" alt=""> 
                    <p>{{$t('help[4].title')}}</p>
                </div>  
            </div>
            <div class="risk-manage">
                <h4 style="padding-bottom: .4rem;">{{$t('help[4].subtile')}}</h4>
                <img v-if="lang=='ch'" :src="$t('help[4].imgarr[0]')" alt="" srcset="">
                <img v-if="lang=='ch'" :src="$t('help[4].imgarr[1]')" alt="" srcset="">
                <img v-if="lang=='ch'" :src="$t('help[4].imgarr[2]')" alt="" srcset="">
               <div v-if="lang!='ch'">
               <h5>{{$t('help[4].contents[0].theme')}}</h5>
               <p>{{$t('help[4].contents[0].dialogue[0]')}}</p>
               <p>{{$t('help[4].contents[0].dialogue[1]')}}</p>
               <p>{{$t('help[4].contents[0].dialogue[2]')}}</p>
               <p>{{$t('help[4].contents[0].dialogue[3]')}}</p>
               <p>{{$t('help[4].contents[0].dialogue[4]')}}</p>
               </div>
               <div v-if="lang!='ch'">
               <h5>{{$t('help[4].contents[1].theme')}}</h5>
               <p>{{$t('help[4].contents[1].dialogue[0]')}}</p>
               <p>{{$t('help[4].contents[1].dialogue[1]')}}</p>
               <p>{{$t('help[4].contents[1].dialogue[2]')}}</p>
               <p>{{$t('help[4].contents[1].dialogue[3]')}}</p>
               <p>{{$t('help[4].contents[1].dialogue[4]')}}</p>
               </div>
                <div v-if="lang!='ch'">
               <h5>{{$t('help[4].contents[2].theme')}}</h5>
               <p>{{$t('help[4].contents[2].dialogue[0]')}}</p>
               <p>{{$t('help[4].contents[2].dialogue[1]')}}</p>
               <p>{{$t('help[4].contents[2].dialogue[2]')}}</p>
               <p>{{$t('help[4].contents[2].dialogue[3]')}}</p>
               <p>{{$t('help[4].contents[2].dialogue[4]')}}</p>
               </div>
                <div v-if="lang!='ch'">
               <h5>{{$t('help[4].contents[3].theme')}}</h5>
               <p>{{$t('help[4].contents[3].dialogue[0]')}}</p>
               <p>{{$t('help[4].contents[3].dialogue[1]')}}</p>
               <p>{{$t('help[4].contents[3].dialogue[2]')}}</p>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  props: ["selected"],
  computed: {
        lang() {
        return this.$i18n.locale || "en";
        }
  },
  methods: {
    cancelalert() {
      this.$emit("cancelalert");
    }
  }
};
</script>
<style scoped>
.header_pl {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
}
.headerline {
  height: 1.17rem;
  line-height: 1.17rem;
  font-size: 16px;
  background-color: #fff;
  margin-bottom: 10px;
  border-bottom: 0.5px solid #e6e6e6;
}
.headerline img {
  position: absolute;
  left: 0;
  height: 1.17rem;
  z-index: 91;
  padding: 0.4rem;
  float: left;
}
.risk-manage img {
  max-width: 100%;
}
.risk-manage {
  font-size: 12px;
  padding: 0.5rem 0.4rem;
  background-color: #fff;
}
.risk-manage h4 {
  font-size: 18px;
  margin-top: 1rem;
  font-weight: 400;
  color: #262626;
}
.risk-manage p.ptitle {
  margin-top: 10px;
}
.risk-manage p {
  line-height: 18px;
  text-align: left;
}

.trans-rate > p {
  text-align: center;
  font-size: 16px;
  padding: 0.5rem 0 0 0;
}
.payinfo {
  margin-top: 10px;
  overflow: hidden;
}
.payinfo ul {
  width: 33.3%;
  border-top: 0.5px solid #ccc;
  border-bottom: 0.5px solid #ccc;
  float: left;
}
.payinfo li {
  border: 0.5px solid #e6e6e6;
  margin: -1px;
  text-align: left;
}
.payinfo ul li {
  font-size: 14px;
  line-height: 40px;
  padding-left: 20px;
}
#usercenter {
  position: absolute;
  z-index: 1000;
  width: 100%;
  min-height: 100%;
  top: 0;
  background-color: #f5f5f5;
}
#usercenter > img:first-child {
  position: absolute;
  z-index: 91;
  height: 0.45rem;
  left: 0.4rem;
  top: 0.4rem;
}
.trans-rate {
  background-color: #fff;
  text-align: right;
}
image[lazy="loading"] {
  width: 40px;
  height: 300px;
  margin: auto;
}
</style>
