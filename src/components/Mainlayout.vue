<style>
.alertmodule{position: fixed;width:100%;min-height:100%;top:0;background-color: rgba(0,0,0,.7);z-index: 888;}
.bg_alertmodule{position: absolute;margin-top: 30%;}
.bg_alertmodule>div{width:73%;margin:-4px auto 0 auto;border-bottom-left-radius: 10px;border-bottom-right-radius: 10px;background-color:#fff;}
.bg_alertmodule>div h3{font-size: 24px;padding:25px 0;color:#FF7C1B;}
.bg_alertmodule>div p{margin-bottom:16px;padding:0 30px;font-size: 14px;text-align: left;}
.bg_alertmodule>div p span{color:#509fff;}
.alertmodule #hd_am{width:73%;}
.alertmodule #btn_am{width:70%;margin-bottom:20px;}
.alertmodule #close_am{width:10%;margin-top:30px;}
</style>

<template>
    <div class="footernav">
        <div v-if="showalertmodule" class="alertmodule" @touchmove.prevent>
           <div class="bg_alertmodule">
                <img id="hd_am" src="../../static/images/index/alertmodule/hd_am.png" alt="" srcset="">
                <div>
                    <h3>新人专属奖励</h3>
                    <p>
                        1.注册后完成手机认证和谷歌认证，<span>80LV </span> 轻松到手。
                    </p>
                    <p> 2.邀请好友更能获得双份奖励。</p>
                    <img id="btn_am" @click.prevent="goDosafe" src="../../static/images/index/alertmodule/btn_am.png" alt="" srcset="">
                </div>
                <img id="close_am"  v-tap.self="{methods:cancelmodule,name:'tap'}" src="../../static/images/index/alertmodule/close_am.png" alt="" srcset="">
           </div>

        </div>
        <div class="indexfooterMenu font12 darktipcolor">
            <!-- @touchend="footMenutap(1)" -->
            <ul>
                <router-link :to="{ path: '/Index'}" active-class="active">
                    <li  class="unconfig">
                        <img :src="'https://s.lendx.vip/static/test/images/icon/'+(this.$i18n.locale || 'en')+'_footnav1a@2x.png'" alt="home" class="noactiveicon"/>
                        <img :src="'https://s.lendx.vip/static/test/images/icon/'+(this.$i18n.locale || 'en')+'_footnav1b@2x.png'" alt="home" class="activeicon"/>
                    </li>
                </router-link>
                <router-link :to="{ path: '/Investment'}" active-class="active">
                    <li>
                        <img :src="'https://s.lendx.vip/static/test/images/icon/'+(this.$i18n.locale || 'en')+'_footnav2a@2x.png'"  alt="Loan" class="noactiveicon"/>
                        <img :src="'https://s.lendx.vip/static/test/images/icon/'+(this.$i18n.locale || 'en')+'_footnav2b@2x.png'"   alt="Loan" class="activeicon"/>
                    </li>
                </router-link>
               <router-link :to="{ path: '/Borrow'}" active-class="active">
                    <li>
                        <img :src="'https://s.lendx.vip/static/test/images/icon/'+(this.$i18n.locale || 'en')+'_footnav3a@2x.png'"   alt="Borrow" class="noactiveicon"/>
                        <img :src="'https://s.lendx.vip/static/test/images/icon/'+(this.$i18n.locale || 'en')+'_footnav3b@2x.png'"   alt="Borrow" class="activeicon"/>
                    </li>
                 </router-link> 
                <router-link :to="{ path: mineLink}" active-class="active">
                    <li>
                        <img :src="'https://s.lendx.vip/static/test/images/icon/'+(this.$i18n.locale || 'en')+'_footnav4a@2x.png'"   alt="Me" class="noactiveicon"/>
                        <img :src="'https://s.lendx.vip/static/test/images/icon/'+(this.$i18n.locale || 'en')+'_footnav4b@2x.png'" alt="Me" class="activeicon"/>
                    </li>
                </router-link>
            </ul>
        </div>
        <router-view/>
    </div>
</template>

<script>
import {mapState,mapGetters,mapActions} from 'vuex'
import shadebgtip from './common/shadebgtip'

let initworked=false;//是否已经初始化

export default {
    name: "App",
    data() {
        return {
           alertmodule:true,
            shadebgtip: false,
            mineLink:'/Personnal' //点击我的按钮链接到的路由
        }
    },
    // computed:{
    //     ...mapState(['blockchain'])
    // },
    mounted() {
        this.initfn()
        var pagesArr = ["", "Index", "Investment", "Borrow", "Personnal"];
        let index = Math.abs(pagesArr.findIndex((page) => {
            return location.href.indexOf(page) > 0
        })); //index 下标
        if (this.$store.state.blockchain == 0) { //在应用内但未绑定
            this.mineLink = '/UserCenterNoBind';
        } else {
            this.mineLink = '/Personnal';
        }
    },
    updated() {
        var pagesArr = ["", "Index", "Investment", "Borrow", "Personnal"];
        let index = Math.abs(pagesArr.findIndex((page) => {
            return location.href.indexOf(page) > 0
        })); //index 下标
    },
    computed: {
        ...mapState({
            'mainmodule': 'mainmodule'
        }),
        ...mapGetters(['showfootMenu']),
        computequery() {
            return {
                module: (this.LEND.localStorage('haslogin') ? 1 : 0),
                buyId: 0
            }
        },
        showalertmodule:function(){
            console.log(!this.LEND.localStorage('haslogin'),!this.alertmodule)
            if((this.$store.state.blockchain ==0)||(!this.LEND.localStorage('haslogin'))||(this.LEND.localStorage('haslogin')&&(this.$store.state.blockchain ==-1))){
                  return false //在布洛克且未绑定 /已登录未认证 /未登录 三种情况下都不显示
            }else if(!this.alertmodule){
                    return false//默认不显示
                }else{
                    return (((this.LEND.localStorage('igoogle')!=1)||(this.LEND.localStorage('iphone')!=1))&&!this.LEND.localStorage('showalertmodule'))
                }
        }
    },
    methods: {
        goDosafe(){
            this.alertmodule=false;
             localStorage.setItem('showalertmodule',false)
             this.$router.push({path:'/Safe'})
        },
        cancelmodule(){
           this.alertmodule=false;
           localStorage.setItem('showalertmodule',false)

        },
            getUserInfo() { //获得个人信息
            // this.changeState({type:'isloading',value:true})
            this.$axios.get(`/trade/user/profile`).then(res => {
                switch (Number(res.code)) {
                    case 2000:
                        {
                            this.LEND.localStorage('nickname', res.data.nickname);
                            this.LEND.localStorage('email', res.data.email);
                            let phone = res.data.phone == 'null'?'':res.data.phone;
                            this.LEND.localStorage('phone',phone);
                            this.nickname = res.data.nickname?res.data.nickname:res.data.email;
                            this.changeState({
                                type: 'haslogin',
                                value: true
                            });
                            this.userInfoData = res.data;
                            this.totalAmount = this.userInfoData.totalAmount?this.userInfoData.totalAmount.toFixed(2):'';
                            break;
                        }
                    default:
                        {
                            this.$toast(res.message);
                        }
                }
                // this.changeState({type:'isloading',value:false})
            });
        },
        initfn: function() {
            if (initworked) {
                return false;
            }
            initworked = true
            if ((this.LEND.getQueryString('agent') || '').indexOf('block') != -1) {
                this.$store.dispatch("changeState", {type: 'blockchain',value: -1}); //通过UA是否在blockchain内，如果是，则blockchain=-1
                    this.LEND.localStorage("haslogin",false)
                    this.LEND.removeLocalStorage("igoogle")
                    this.LEND.removeLocalStorage("iphone")
                    this.LEND.removeLocalStorage("nickname")
                    this.LEND.removeLocalStorage("phone")
                    this.LEND.removeLocalStorage("email")
               if (this.LEND.getQueryString('uuid')) {
                    //  alert('uuid_b '+this.LEND.getQueryString('uuid'))
                    this.LEND.localStorage('uuid_b', this.LEND.getQueryString('uuid'))
                }
                if (this.LEND.getQueryString('access_token')) {
                    this.LEND.localStorage('access_token_b', this.LEND.getQueryString('access_token'))
                }
                if (this.LEND.localStorage('uuid_b') && this.LEND.localStorage('access_token_b')) {
                    //   alert('曾经已经授权过'+' '+this.LEND.localStorage('uuid_b'))
                    //uuid和access_token存在，默认已授权请求授权
                    this.$axios.post('/trade/oauth/token?grant_type=password', {
                        username: this.LEND.localStorage('uuid_b'),
                        password: this.LEND.localStorage('access_token_b'),
                        client: 'frontend'
                    }).then(res => {
                        if (Number(res.code) === 2000) {

                            this.getUserInfo()
                            this.$store.dispatch("changeState", {type: 'blockchain',value: res.data.identif.email == '' ? 0 : 1});
                           // alert('blockchain'+this.$store.state.blockchain)
                            if (res.data.identif.email == '') { //在应用内但未绑定
                                this.mineLink = '/UserCenterNoBind';
                            } else {
                                this.mineLink = '/Personnal';
                            }
                        } else if (Number(res.code) === 1006) {
                            //   alert('授权失效')
                            //登录时返回状态是1006  请求重新授权
                            location.href = this.Posturl+"/trade/gxb/authorize"
                        } else {
                            this.$toast(this.$t('网络错误'))
                        }
                    })
                } else {
                    // alert('未授权过')
                     location.href = this.Posturl+"/trade/gxb/authorize"
                    //uuid access_token不存在，则为未授权==>重新请求授权
                }
            }
        },
        fetchData: function() {}
    }
}
</script>

<style lang="scss">
html,body{font:12px/1.14 San Francisco,-apple-system, BlinkMacSystemFont, "PingFang SC","Helvetica Neue",STHeiti,"Microsoft Yahei",Tahoma,Simsun,sans-serif;
    background-color: #f5f5f5; }
#app {
  font-family: San Francisco,-apple-system, BlinkMacSystemFont, "PingFang SC","Helvetica Neue",STHeiti,"Microsoft Yahei",Tahoma,Simsun,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #262626;
}
body:lang(zh-CN),#app {
    font-family: "SF Pro SC","SF Pro Text","SF Pro Icons","PingFang SC","Helvetica Neue","Helvetica","Arial",sans-serif;
}
html,body{font-family: "SF Pro Text","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;}
.indexfooterMenu {
  position: fixed;
  bottom: 0;
  background-color: #fff;
  width: 100%;
  border-top: 0.5px solid #e6e6e6;
  z-index: 70;
  ul{ width: 100%;
  display: flex;
  height: 1.32rem;
  line-height: 1.32rem;
  flex-direction: row;
  a{
    flex: 1;
    display: inline-flex;
    align-items: center;
    li{display: inline-block;width: 100%;background-color:#fff;
        img{
            height: 1rem;
            vertical-align:middle;
            margin: 0px auto;
            &.noactiveicon{
                display: block;
            }
            &.activeicon{display: none;}
        }
    }
    &.active{
       li img.noactiveicon{display: none;}
       li img.activeicon{display: block;}
    }
  }
}}
.lendchainfade0-enter-active, .lendchainfade0-leave-active {transition: all 1s;}
.lendchainfade0-enter, .lendchainfade0-leave-active {opacity: 0;}
.lendchainfade0-enter ,.lendchainfade0-leave-to{transform: translateX(10rem);}
.lendchainfade1-enter-active, .lendchainfade1-leave-active {transition: all .6s;}
.lendchainfade1-enter, .lendchainfade1-leave-active {opacity: 0;}
.lendchainfade1-enter,.lendchainfade1-leave-to {transform: translateY(10rem);}

.lendchainfade2-enter-active {transition: all .6s ease;}
.lendchainfade2-leave-active {transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);}
.lendchainfade2-enter, .lendchainfade2-leave-to{ transform: translateY(-1.33rem); opacity: 0;}
.lendchainfade3-leave-active{transform: translateY(1.33rem)}
.lendchainfade3-enter-active, .lendchainfade3-leave-active {transition: opacity .5s;}
.lendchainfade3-enter, .lendchainfade3-leave-active { opacity: 0;}

.lendflip-list1-move {transition: transform .6s;}
.vl-notify-content input{display: block;width: 100%;height: 36px;margin: 0 auto;line-height: 30px;padding-left: 10px; border: 0.5px solid #e6e6e6;color: #333;}
</style>
