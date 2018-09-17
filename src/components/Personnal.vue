<template>
    <div class="personnal">
        <div class="header_pl">
            <div class="nologin" v-if="!haslogin">
                <img src="https://s.lendx.vip/static/test/images/icon/logo@2x.png" alt=""> 
                <a @touchend="addgooogletotal"><span>{{$t('注册')}}/{{$t('登录')}}</span></a>
            </div>    
            <div class="haslogin" v-if="haslogin">
                <div class="userheader clearfloat">
                    <img src="https://s.lendx.vip/static/test/images/icon/logo@2x.png" alt="">{{nickname?nickname:email}}
                    <img src="https://s.lendx.vip/static/test/images/personnal/messages.png" alt="" srcset="">
                </div>
                <div class="moneytitle clearfloat" style="min-height:1rem;">   
                    <span>{{$t('总资产折合')}}({{$t('lang')=='ch'?'CNY':$t('lang')=='ko'?'KRW':'USDT'}})</span>
                    <img v-show="showTotalAmount" @touchend="toggleAmount()" src="https://s.lendx.vip/static/test/images/personnal/seeassets1.png" alt="show">
                    <img v-show="!showTotalAmount" @touchend="toggleAmount()" src="https://s.lendx.vip/static/test/images/personnal/seeassets0.png" alt="hide">
                </div>
                <div class="moneyval"><span v-show="showTotalAmount">≈</span><span>{{!showTotalAmount?showStar:totalAmount?totalAmount:0}}</span></div>
                <div class="moneyother clearfloat">
                    <p><span>{{$t('昨日收益')}}({{$t('lang')=='ch'?'CNY':$t('lang')=='ko'?'KRW':'USDT'}})</span><span v-show="showTotalAmount">≈</span><span>{{!showTotalAmount?showStar:userInfoData.profit?userInfoData.profit:0}}</span></p>
                    <p @touchend="toWallet()"><span>{{$t('可用余额')}}({{$t('lang')=='ch'?'CNY':$t('lang')=='ko'?'KRW':'USDT'}})</span><span v-show="showTotalAmount">≈</span><span>{{!showTotalAmount?showStar:userInfoData.lastAmount?userInfoData.lastAmount:0}}</span><span><img src="https://s.lendx.vip/static/test/images/icon/pic_nav.png" alt="" srcset=""></span></p>
                </div>
            </div>
        </div>
        <div class="main_pl">
            <div class="asset-manager bigmodule">
                <p>{{$t('资产管理')}}</p>
                <div class="asset-managerbox">
                    <div class="asset-managerboxitem"><router-link :to="!hasloginls?'/Login':'/Wallet'"><img src="https://s.lendx.vip/static/test/images/personnal/wallet.png" alt="My Wallet">{{$t('我的钱包')}}</router-link></div>
                    <div class="asset-managerboxitem"><router-link :to="!hasloginls?'/Login':'/Myinvestment'"><img src="https://s.lendx.vip/static/test/images/personnal/investment.png" alt="My Assets">{{$t('我的投资')}}</router-link></div>
                    <div class="asset-managerboxitem asset-itemnoborder"><router-link :to="!hasloginls?'/Login':'/Logs'"><img src="https://s.lendx.vip/static/test/images/personnal/logs.png" alt="Transaction History">{{$t('资金记录')}}</router-link></div>
                    <div class="asset-managerboxitem asset-itemnoborder"><router-link :to="!hasloginls?'/Login':'/Myborrows'"><img src="https://s.lendx.vip/static/test/images/personnal/borrow.png" alt="Borrowing History">{{$t('我的借款')}}</router-link></div>
                </div>
            </div>
            <div class="account-manager bigmodule">
                <p>{{$t('账户管理')}}</p>
                <div class="asset-managerbox">
                    <div class="asset-managerboxitem"><router-link :to="!hasloginls?'/Login':'/UserCenterSetting'"><img src="https://s.lendx.vip/static/test/images/personnal/user.png" alt="My Account">{{$t('个人中心')}}</router-link></div>
                    <div style="    background-image: url(https://s.lendx.vip/static/test/images/personnal/kycicon.png);
    background-repeat: no-repeat;
    background-size: 1.15rem;
    background-position: top right;"
                     class="asset-managerboxitem"><router-link :to="!hasloginls?'/Login':'/Safe'"><img src="https://s.lendx.vip/static/test/images/personnal/safe.png" alt="Security Certer">{{$t('安全认证')}}</router-link></div>
                                        <div class="asset-managerboxitem"><router-link :to="!hasloginls?'/Login':'/recommendact'"><img src="https://s.lendx.vip/static/test/images/personnal/gift.png" alt="">{{$t('推荐有礼')}}</router-link></div>
                    <div class="asset-managerboxitem"><router-link to="/About"><img src="https://s.lendx.vip/static/test/images/personnal/about.png" alt="">{{$t('关于我们')}}</router-link></div>
                    <!-- <div class="asset-managerboxitem"><router-link :to="!hasloginls?'/Login':'/Gift'"><img src="https://s.lendx.vip/static/test/images/personnal/gift.png" alt="">Invite & Rewards</router-link></div> -->
                    <div class="asset-managerboxitem asset-itemnoborder"><router-link to="/Help"><img src="https://s.lendx.vip/static/test/images/personnal/help.png" alt="">{{$t('帮助中心')}}</router-link></div>
                    <div class="asset-managerboxitem asset-itemnoborder"><router-link to="/Setting"><img src="https://s.lendx.vip/static/test/images/personnal/setting.png" alt="Set Up">{{$t('设置')}}</router-link></div>
                </div>
            </div>
        </div>
  </div>
</template>
 
<script>
import { mapState,mapActions } from 'vuex'
import { googletotal } from "../util/watch.js";
export default {
    name: 'index',
    data() {
        return {
            nickname: this.LEND.localStorage('nickname') || '',
            email: this.LEND.localStorage('email') || '',
            usercenterAction: 'login', //选择center模块的具体模块 登录 注册 忘记密码等
            userInfoData: '',
            totalAmount: '', //用于传给钱包组件
            showTotalAmount: true,
            showStar:'****',
            hasloginls:this.LEND.localStorage('haslogin')||false,
            access_token:this.LEND.localStorage('access_token')?this.LEND.localStorage('access_token'):'',
        }
    },
    computed: {
        ...mapState(['haslogin','blockchain'])
    },
    created() {
        if(this.access_token){
            this.getUserInfo();  //去获取个人信息 
            // this.$axios.get(`${this.Posturl}/price/latest?symbol=1099`).then(res => {
            //     this.utoc=res.data.price
            // })  
        }
    },
    methods: {
        ...mapActions([
            'changeState'
        ]),
        toggleAmount(){
            this.showTotalAmount = !this.showTotalAmount;
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
                            // this.userInfoData.lastAmount=(this.userInfoData.lastAmount).toFixed(2)
                            // this.userInfoData.profit=(this.userInfoData.profit).toFixed(2)
                            // this.userInfoData.totalAmount=(this.userInfoData.totalAmount).toFixed(2)
                             this.totalAmount = this.userInfoData.totalAmount?(this.userInfoData.totalAmount).toFixed(2):'';
                            break;
                        }
                    default:
                        {
                            this.$toast(res.message);
                        }
                }
                this.changeState({type:'isloading',value:false})
                // this.changeState({type:'isloading',value:false})
            });
        },
        toWallet() {
            this.$router.push({path:'/Wallet'});
        },
        toSetting(){
            if(!this.haslogin){
                this.$router.push({path:'/Login'});
            }else{
                this.$router.push({path:'/Setting'});
            }
        },
        addgooogletotal(){ //添加登录注册谷歌统计
            googletotal('mine_login_signUp',this.$i18n.locale,'点击“注册/登录”');
            this.$router.push({path:'/Login'})
        }   
    }
}
</script>
<style lang="sass" scoped>
@import '../assets/css/MyCenter.scss'
 
</style>
<style>
.personnal{background-color: #f5f5f5;}
.account-manager{margin-bottom:3rem;}
.main_pl{background-color: #f5f5f5;}
.main_pl .bigmodule>p{text-align: left;padding-left: .4rem;line-height: 1.07rem;font-size: 14px;background-color: #fff;border-bottom: 0.5px solid #e6e6e6;color: #999;}
</style>

<!-- <style lang="sass">

@import "@/css/MyCenter.scss"

</style> -->