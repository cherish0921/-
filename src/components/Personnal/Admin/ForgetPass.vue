<template>
<div id="usercenter">
    <div class="alisc-propup" v-show="showAlisc">
        <div id="alisc"></div>
    </div>
    <div class="centername">
        <span>{{$t('找回密码')}}</span> 
    </div>
    <div class="inputs">
        <div>
            <img src="https://s.lendx.vip/static/test/images/personnal/module1/cart2.png" alt="Enter Email ">
            <input type="text" v-model="mail" :placeholder="$t('请输入邮箱')" autocomplete="off">
        </div>
        <div>
            <img src="https://s.lendx.vip/static/test/images/personnal/module1/cart3.png" alt="Email Code">
            <input type="text" v-model="mailcode"  :placeholder="$t('邮箱验证码')"  autocomplete="off">
            <span v-if="!isgetting" class="to-send-code" @touchend="sendmailcode">{{$t('发送验证码btn')}}</span>
            <span v-if="isgetting" class="to-send-code" id="Countdownvala" >{{$t('发送验证码btn')}}</span>
        </div>
        <div>
            <img src="https://s.lendx.vip/static/test/images/personnal/module1/cart1.png" alt="new password">
            <input type="password" v-model="pwd" :placeholder="$t('请输入新密码')"  autocomplete="off">
            <div class="tip-box"  v-show="tipState">
                <p v-show="tipState">{{$t('密码提示')}}</p>
                <img  src="https://s.lendx.vip/static/test/images/personnal/module1/tip.png"  style="opacity: 0;" alt="tips">
            </div>
            <img id="taparea" @touchend="toShowTip" src="https://s.lendx.vip/static/test/images/personnal/module1/tip.png" alt="tips">
        </div>
    </div>
    <div class="confirmbtn" @touchend="confirm">{{$t('确认修改')}}</div>
    <div class="otheract" v-if="!isBlockLink">
        <span><router-link to="/Register" style="color: #509fff;">{{$t('去注册')}}</router-link></span>
    </div>
</div>
</template>
<script>
import {mapState,mapGetters,mapActions} from 'vuex'

let endtime=60
let interval
export default {
    data() {
        return {
            isBlockLink:this.$route.query.isBlockLink, //存在就说明是布洛克城进来的,不显示去注册按钮
            mail: "",
            pwd: "",
            mailcode: "",
            isgetting: false, //true代表正在发送验证码
            tipState:false,
            redirect: this.$route.query.redirect, //拿到上级路由传过来的地址，用于登录后的重定向
             showAlisc:false
        };
    },
    mounted() {
                    let that=this
        var nc_token = ["FFFF0N0000000000649D", (new Date()).getTime(), Math.random()].join(':');
    var nc=NoCaptcha.init({
        renderTo: '#alisc',
        appkey: 'FFFF0N0000000000649D', 
        scene: 'nc_message_h5',
        token: nc_token,
        trans: {"key1": "code200"},
        elementID: ["usernameID"],
        is_Opt: 0,
        language: "config",
        timeout: 10000,
        retryTimes: 5,
        errorTimes: 5,
        inline:false,
        apimap: {
            // 'analyze': '//a.com/nocaptcha/analyze.jsonp',
            // 'uab_Url': '//aeu.alicdn.com/js/uac/909.js',
        },
        bannerHidden:false,
        initHidden:false,
        callback: function (data) {
            that.showAlisc=false;
            nc.reset()
             that.successSend('FFFF0N0000000000649D','nc_message_h5',nc_token,data.csessionid,data.sig)
        },
        error: function (s) {
        }
    });
    NoCaptcha.setEnabled(true);
    nc.reset();//请务必确保这里调用一次reset()方法

    NoCaptcha.upLang('config', {
        'LOADING':this.$t('加载中'),//加载
        'SLIDER_LABEL': this.$t('向右滑'),//等待滑动
        'CHECK_Y': this.$t('验证通过'),//通过
        'ERROR_TITLE': this.$t('出错了'),//拦截
        'CHECK_N': this.$t('验证未通过'), //准备唤醒二次验证
        'OVERLAY_INFORM': this.$t('环境风险'),//二次验证
        'TIPS_TITLE': this.$t('错_重输入')//验证码输错时的提
    });
     /*  */
    },
    methods: {
        ...mapActions(['changeState']),
        cancelalert(e) {
            this.$router.push({
                path: '/Personnal'
            });
        },
        toShowTip(){
            this.tipState = !this.tipState;
        },
         hideAlisc(){
            this.showAlisc = false;
        },
        confirm() {
            //检测邮箱密码是否正确
            if (!this.LEND.checkMail(this.mail)) {
                this.$toast(this.$t('邮箱格式错误'));
                return;
            }else if (!(/^[0-9]{4}$/.test(this.mailcode))) {
                this.$toast(this.$t('必须是4位e'));
                return;
            }else if (this.LEND.checkPass(this.pwd) < 3) {
                this.$toast({position:'top',message:this.$t('密码格式错误')+this.$t('密码提示'),duration:15000});
                return;
            }
            let data = {
                email: this.mail,
                emailCode: this.mailcode,
                pwd: this.pwd
            };
            this.$axios.post('/trade/account/resetpwd', data).then(res => {
                switch (Number(res.code)) {
                    case 2000:
                        {
                            this.mailcode = '';
                            if( document.getElementById('Countdownvala')) document.getElementById('Countdownvala').innerHTML  = "Send Email";
                            this.$data.isgetting = false;
                            clearInterval(interval);
                            this.$toast(this.$t('修改成功'));
                            if(this.isBlockLink){
                                this.$router.push({
                                    path: '/BindBlockOrBuild?type=1',
                                });
                            }else{
                                this.$router.push({
                                    path: '/Login'
                                });
                            }
                            break;
                        }
                    default:
                        {
                            this.$toast(res.message);
                        }
                }
            })
        },
            successSend(appKey,scene,token,sessionId,sig){
            this.$axios.post('/trade/mail/send', {
                    email: this.mail,
                    type: 1,
                    appKey:appKey,
                    scene:scene,
                    token: token,
                    sessionId: sessionId,
                    sig: sig,
                }).then(res => {
                    if (Number(res.code) !== 2000) {
                        this.$toast(res.message);
                        return;
                    }
                    this.isgetting = true;
                    endtime = 60;
                    this.showAlisc = false;
                    if (this.isgetting) {
                        interval = setInterval(() => {
                            if (endtime >= 0) {
                                  if( document.getElementById('Countdownvala')) document.getElementById('Countdownvala').innerHTML  = this.$t('重新发送')+"(" + endtime + ")";
                                endtime--;
                            } else {
                                this.isgetting = false;
                                endtime = 60;
                                 if(document.getElementById('Countdownvala'))document.getElementById('Countdownvala').innerHTML = this.$t('发送验证码');
                                clearInterval(interval);
                            }
                        }, 1000)
                    }
                });
        },
        sendmailcode() {
            if (!this.LEND.checkMail(this.$data.mail)) {
                this.$toast(this.$t('邮箱格式错误'));
                return;
            } else {
                 this.showAlisc = true;
            }
        }
    }
}
</script>
<style lang="sass" scoped>
@import '../../../assets/css/MyCenter.scss'
</style>
<style scoped>
.to-send-code{
    position:absolute;
    right:1.07rem;
    color:#509fff;
    font-size:14px;
    z-index:91;
}
#Countdownvala{
   color:#999;
}
.tip-box{
    position: absolute;
    text-align: right;
    display: inline-block;
    margin-top: -70px;
    right: .4rem;
    z-index: 92;
}
.tip-box p{
    height: 75px;
    line-height: initial;
    color: #509fff;
    background-color: #D6E9FF;
    padding: 3px;
    text-align: left;
    width: 180px;
    font-size: 12px;
}
.tip-box p:after{
    content: '';
    position: absolute;
    top: 70px;
    right:1rem;
    display: inline-block;
    width: 0;
    border: .12rem solid #D6E9FF;
    border-bottom-color: transparent;
    border-left-color: transparent;
    border-right-color: transparent;
}
.tip-box .p2{
    background-color: transparent;
}
.tip-box .p2:after{
    border-color: transparent;
}
.tip-box img{    width:15px;margin-right: .4rem;}
#taparea{position: absolute;width: 15px;margin-right: .4rem;margin-top: .4rem;z-index:99;}
#usercenter {
  position: absolute;
  z-index: 90;
  width: 100%;
  height: 100%;
  background-color: #fff;
}
#usercenter >img:first-child {
  position:absolute;
  z-index:91;
  height:.45rem;
  left:.4rem;
  top:.4rem;
  

}
#usercenter > .logobg {
  width: 100%;
}
.centername {
  margin-top: 0.4rem;
}
.centername span {
  font-size: 20px;
  padding-bottom: 0.2rem;
  position: relative;
  border-bottom: 0px;
}
.centername span:after,.centername span::after{
    position: absolute;
    content: "";
    bottom: 0px;
    left: 50%;
    transform: translateX(-50%);
    width:0.43rem;
    height:0.08rem;
    border-radius: 0.08rem;
    background:linear-gradient(-90deg,rgba(72,133,255,1) 0%,rgba(80,159,255,1) 100%);
}
#usercenter .inputs > div {
  margin: 0 1.07rem;
  height: 1.46rem;
  line-height: 1.46rem;
  border-bottom: 0.5px solid #e6e6e6;
  overflow: hidden;
  text-align: left;
}
#usercenter .inputs img:first-child {
    line-height: 1.17rem;
}
#usercenter .inputs > div input {
  display: inline-block;
  font-size: 0.37rem;
  border: 0;
  margin-left: 0.4rem;
  min-width: 80%;
}
.confirmbtn {
  line-height: 1.33rem;
  height: 1.33rem;
  margin: 0.8rem 1.07rem 0 1.07rem;
  font-size: 16px;
  color: #fff;
  border-radius: 36px;
  cursor: pointer;
  background: -webkit-gradient(
    linear,
    0% 0%,
    100% 0%,
    from(#509fff),
    to(#4886ff)
  );
  -webkit-box-shadow: 1px 1px 12px rgba(80, 159, 255, 0.5);
  box-shadow: 1px 1px 12px rgba(80, 159, 255, 0.5);
}
.otheract {
    font-size: 14px;
  margin: 0.4rem 1.07rem;
  text-align: left;
  color: #509fff;
  cursor: pointer;
}
.otheract span:nth-child(1) {
  float: right;
  right: 1.07rem;
}
.alisc-propup{
    position: absolute;
    width: 9.2rem;
    margin: 0 .4rem;
    top: 3.8rem;
    font-size: 16px;
    background-color: #fff;
    z-index: 1000;
}
.alisc-propup p{
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    border:0.5px solid #ddd;
    border-bottom: 0;
    position: relative;
}
.alisc-propup p img{
    position: absolute;
    width: 12px;
    top: 5px;
    right: 5px;
    z-index: 1001
}
</style>
