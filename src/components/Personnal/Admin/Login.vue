<template>
<div id="usercenter">
    <div class="centername">
        <span>{{$t('登录')}}</span>
    </div>
    <div class="inputs">
        <div>
            <img src="https://s.lendx.vip/static/test/images/personnal/module1/cart2.png" alt="email">
            <input type="text" v-model="mail" :placeholder="$t('请输入邮箱')" autocomplete="off">
        </div>
        <div>
            <img src="https://s.lendx.vip/static/test/images/personnal/module1/cart1.png" alt="password">
            <input type="password" v-model="pwd" :placeholder="$t('请输入密码')" autocomplete="off">
            <div class="tip-box"  v-show="tipState">
                <p v-show="tipState">{{$t('密码提示')}}</p>
                <img  src="https://s.lendx.vip/static/test/images/personnal/module1/tip.png"  style="opacity: 0;" alt="tips">
            </div>
            <img id="taparea" @touchend="toShowTip" src="https://s.lendx.vip/static/test/images/personnal/module1/tip.png" alt="tips">
        </div>
    </div>
    <div class="confirmbtn" @touchend="Login">{{$t('立即登录')}}</div>
    <div class="otheract">
        <span><router-link to="/Register" style="color:#509fff;">{{$t('去注册')}}</router-link></span>
        <span><router-link to="/ForgetPass" style="color:#509fff;">{{$t('忘记密码')}}</router-link></span>
    </div>
</div>
</template>
<script>
import {mapActions} from 'vuex'
import { googletotal } from "../../../util/watch.js";
export default {
    data() {
        return {
            mail: "",
            pwd: "",
            tipState:false, //默认不显示提示框
            redirect: this.$route.query.redirect //拿到上级路由传过来的地址，用于登录后的重定向
        }
    },
    methods: {
        ...mapActions(['changeState']),
        toShowTip(){
            this.tipState = !this.tipState;
        },
        Login() {
            //检测邮箱密码是否正确
            googletotal('mine_login',this.$i18n.locale,'点击登录');
            if (!this.LEND.checkMail(this.$data.mail)) {
                this.$toast(this.$t('邮箱格式错误'));
                return;
            } 
            let data = {
                username: this.mail,
                password: this.pwd,
                client: 'frontent'
            };
            this.$axios.post('/trade/oauth/token?grant_type=password', data).then(res => {
                switch (Number(res.code)) {
                    case 2000:
                        {
                            this.LEND.localStorage('access_token', res.access_token);
                            this.$toast(this.$t('登录成功'));
                            googletotal('mine_login_success',this.$i18n.locale,'登录成功');
                            this.changeState({
                                type: 'haslogin',
                                 value: true
                             });
                            let toHash = this.redirect?this.redirect:'/Personnal'; //跳转的地址
                            this.$router.replace({path: toHash});
                            break;
                        }
                    default:
                        {
                            this.$toast(res.message);
                        }
                }
            });
        }
    }
}
</script>
<style lang="sass" scoped>
@import '../../../assets/css/MyCenter.scss'
</style>
<style scoped>
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
</style>
