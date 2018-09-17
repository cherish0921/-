<template>
    <div id="language">
        <div class="header_pl">
            <div class="headerline">
                <img src="https://s.lendx.vip/static/test/images/icon/pic_navb.png" @touchend="goBack" alt="返回"> 
                <p>{{$t('语言')}}</p>
            </div>  
        </div>
        <div  class="common">
            <div class="clearfloat" @touchend="toggleLang(0)">
                <span>{{$t('中文')}}</span><span v-show="nowLang==0">√</span>
            </div>
        </div>
       <div   class="common">
            <div class="clearfloat" @touchend="toggleLang(1)">
                <span>{{$t('英文')}}</span><span v-show="nowLang==1">√</span>
            </div>
        </div>
        <div   class="common">
            <div class="clearfloat" @touchend="toggleLang(2)">
                <span>{{$t('韩文')}}</span><span v-show="nowLang==2">√</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return{
        }
    },
    computed: {
		nowLang() {
            let nowlang=0
            switch (this.$i18n.locale) {
                case 'ch':
                    nowlang=0;
                    break;
                case 'en':
                    nowlang=1;
                    break;
                case 'ko':
                     nowlang=2;
                    //nowlang=ko;
                    break;
            
                default:
                    break;
            }
		return nowlang||0;
		}
  	},
    methods:{
        goBack() {
           this.$router.push({path:'/Setting'});
        },
        toggleLang(val){
            let targetLang='';
            if(this.nowLang==val){
                return false;
            }
            switch (val) {
                case 0:
                    targetLang='ch';
                    break;
                case 1:
                    targetLang='en';
                    break;
                case 2:
                    targetLang='ko';
                    break;
            
                default:
                    break;
            }
            localStorage.setItem("LENDCHAIN_LANGUAGE", targetLang);
            this.$i18n.locale = targetLang;
            console.log( this.$i18n.locale)
        }
    }
}
</script>
<style scoped>
.headerline{height:1.17rem;line-height:1.17rem;font-size:16px;color:#262626;background-color:#fff;text-align:center;}
.headerline img{position:absolute;left:0;height:1.17rem;z-index:91;padding: 0.4rem;float:left;}
#language{background-color:#f5f5f5;}
#language .common{margin-top:10px;text-align: right;}
#language .common>div{height:1.33rem;line-height: 1.33rem;background-color:#fff;border-bottom:0.5px solid #e5e5e5;padding-right:.4rem;}
#language .common span:first-child{float: left;margin-left:.4rem;font-size:16px;}
#language .common span:last-child{height:.37rem;font-weight: bolder;vertical-align:text-bottom;color:#509fff;}
#language .common img{height:.37rem;vertical-align: text-bottom;transform: rotate(-90deg);}  
</style>