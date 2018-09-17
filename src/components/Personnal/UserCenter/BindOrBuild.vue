<template>
<div class="shadebg">
    <transition name="lendchainfade1">
    <div>
        <header class="clearfloat" style="text-align:center;">
            <img @touchend="toBack" src="https://s.lendx.vip/static/test/images/icon/pic_navb.png" alt="back">
            {{type==1?$t('bindAcount'):$t('createAcount')}}
        </header>
        <div style="margin-bottom:.28rem;">
            <p class="bindtip">{{$t('bindtip1')}}</p>
        </div>
        <div style="margin-bottom:.28rem;">
            <p class="bindtip">{{$t('bindtip2')}}</p>
        </div>
        <div class="content_gauth">
            <div class="gcode clearfloat">
                <span>{{$t('邮箱')}}</span>
                <input type="text" v-model="b_email"  :placeholder="$t('请输入邮箱')" autocomplete="off">
            </div>
            <div class="gcode clearfloat" v-if="type==2">
                <span>{{$t('b邮箱验证码')}}</span>
                <input type="text" v-model="b_code"  style="width:inherit;" :placeholder="$t('b邮箱验证码')" maxlength="4" autocomplete="off">
                <span style="color:#509fff;position: absolute;right: .4rem;z-index: 1000;" v-show="!isgetting" @touchend="sendcode">{{$t('发送验证码btn')}}</span>
                <span style="color:#999;position: absolute;right: .4rem;z-index: 1000;" v-show="isgetting" id="CountdownvalaEmail">{{$t('发送验证码btn')}}</span>
            </div>
            <div class="gcode clearfloat">
                <span>{{$t('密码')}}</span>
                <input type="password" v-model="b_pwd"  :placeholder="$t('请输入密码')" autocomplete="off">
            </div>
            <div  v-if="type==1" style="text-align: right;padding-right: .4rem;margin-top:30px;"><router-link  :to="{ name: 'ForgetPass',query:{isBlockLink:true}}"><span style="color:#509fff;">{{$t('忘记密码')}}?</span></router-link></div>
        </div>
        <div class="confirmbtn" @touchend="confirm" style="text-align:center;">{{$t('确定')}}</div>
    </div>
    </transition>
</div>
</template>
<script>
import { mapState,mapGetters,mapActions } from 'vuex'

let endtime = 60;
let interval;
export default {
    data() {
        return {
            b_email: '', //邮箱
            b_code: '', //邮箱验证码 
            b_pwd: '', //密码
            isgetting: false,
            ajaxbusy:false,
            type: this.$route.query.type,  //1表示绑定LendChain账号 2生成LendChain账号
            access_token: this.LEND.localStorage('access_token')?this.LEND.localStorage('access_token'):''
        }
    },
    mounted() {
    },
    methods: {
        ...mapActions(['changeState']),   
        toBack(){
            this.$router.go(-1); //回退
        },
        sendCommMal(res,ele){ //发送验证码统一的操作
            if (Number(res.code) !== 2000) {
                this.$toast(res.message);
                return;
            }
            this.isgetting = true;
            endtime = 60;
            if (this.isgetting) {
                interval = setInterval(() => {
                    if (endtime >= 0) {
                        ele.innerHTML = this.$t('重新发送')+"(" + endtime + ")";
                        endtime--;
                    } else {
                        this.isgetting = false;
                        endtime = 60;
                        ele.innerHTML = this.$t('发送验证码btn')
                        clearInterval(interval);
                    }
                }, 1000)
            }
        },
        quitapp() { //退出登录
            this.$axios.get(`/trade/logout`).then(res => {
                if (Number(res.code) !== 2000) {
                    this.ajaxbusy=false;
                    this.$toast(this.$t('网络错误'));         
                } else {
                    this.changeState({type:'blockchain',value:-1});
                    this.changeState({type:'haslogin',value:false});
                    this.LEND.clearLocalStorage(); //清空所有缓存
                    this.getUserInfo(); //使用用户输入进行登录
                    
                }

                
            }).catch(err=>{
                this.ajaxbusy=false
                this.$toast(this.$t('网络错误'))
            });
        },
        getUserInfo(){  //通过账号密码方式登录并父组件回调调用用户信息接口存进缓存
            this.$axios.post("/trade/oauth/token?grant_type=password", {
                username: this.b_email,
                password: this.b_pwd,
                client:'frontend'
            }).then((res) => {
                this.ajaxbusy=false
                switch (Number(res.code)) {
                    case 2000:
                        {
                            this.LEND.localStorage('access_token', res.access_token);
                            this.changeState({type: 'haslogin',value: true}); //改为登录状态
                            this.changeState({type: 'blockchain',value: 1}); // 改为在应用中
                            this.$toast(this.$t('操作成功'));
                            this.$router.push({path:'/Personnal'});
                            break;
                        }
                    default:
                        {
                            this.ajaxbusy=false;
                            this.$toast(this.$t('登录失败'));
                        }
                }
            }).catch(err=>{
                this.ajaxbusy=false;
                this.$toast(this.$t('网络错误'))
            })
        },
        sendcode() {
            if (!this.LEND.checkMail(this.b_email)) {
                this.$toast(this.$t('邮箱格式错误'));
                return;
            }
             let ele = document.getElementById('CountdownvalaEmail');  //发送验证码统一的操作
            this.isgetting = true;
            endtime = 60;
            if (this.isgetting) {
                interval = setInterval(() => {
                    if (endtime >= 0) {
                        ele.innerHTML = this.$t('重新发送')+"(" + endtime + ")";
                        endtime--;
                    } else {
                        this.isgetting = false;
                        endtime = 60;
                        ele.innerHTML = this.$t('发送验证码btn')
                        clearInterval(interval);
                    }
                }, 1000)
            }
            this.$axios.post('/trade/mail/blocksend', {
                email: this.b_email,
                type: 1,
            }).then(res => {
                if (res.code != 2000) {
                    this.$toast(res.message);
                }else{
                    this.$toast(this.$t('操作成功'));
                }
            }).catch((err)=>{
                this.ajaxbusy=false;
                this.$toast(this.$t('网络错误'));
            });
        },
        confirm() {
            if(this.ajaxbusy){return}
            if (!this.LEND.checkMail(this.$data.b_email)) {
                this.$toast(this.$t('邮箱格式错误'));
                return;
            } else if (this.LEND.checkPass(this.$data.b_pwd) < 3) {
                 this.$toast({position:'top',message:this.$t('密码格式错误')+this.$t('密码提示'),duration:15000});
                return;
            } else if (this.type == 2 && isNaN(this.b_code) && /^[0-9]{4}$/.test(this.b_code)) {
                this.$toast(this.$t('必须是4位'));
                return;
            }
            let url = this.type == 1 ? "/trade/gxb/bind" : "/trade/gxb/create"; //1为绑定LendChain账号  2为生成LendChain账号
            let params = {};
            if (this.type == 2) { //生成LendChain账号
                params = {
                    email: this.b_email,
                    emailCode: this.b_code,
                    pwd: this.b_pwd,
                    access_token: this.access_token
                };
            } else if (this.type == 1) {
                params = {
                    email: this.b_email,
                    pwd: this.b_pwd,
                    access_token: this.access_token
                };
            }
            this.ajaxbusy=true
            this.$axios.post(url, params).then((res) => {
                switch (Number(res.code)) {
                    case 2000:
                        {   break;  }
                    default:
                    this.ajaxbusy=false
                        {  this.$toast(res.message); }
                }
                return res;
            }).catch((err)=>{
                this.ajaxbusy=false;
                this.$toast(this.$t('网络错误'));
            }).then((res) => {
                if(res.code){
                    if(Number(res.code) == 2000) {
                        this.quitapp(res); //先退出登录并重新用邮箱密码登录    
                    }else{
                        this.ajaxbusy = false;
                    }
                }else{
                    this.ajaxbusy = false;
                }
            })
        }
    }
}
</script>

<style scoped>
p{
    text-align: center;
}
.shadebg{ position: fixed;width: 100%;min-height:100%;top:0;left:0;right:0;z-index:100;background-color:#f5f5f5;}
header{margin-bottom:.28rem;height:1.17rem;line-height:1.17rem;font-size: 16px;color:#000;background-color: #fff;box-shadow:1px 0px 0px rgba(0,0,0,0.1)}
header img{position:absolute;left:0;height:1.17rem;z-index:91;padding:.4rem;;float:left;}
header span{line-height: 1.17rem;height:1.17rem;}
.content_gauth >div>span:first-child{display: inline-block;width:2.6rem;text-align: left;color:#999;float: left; padding-left: .4rem;}
.content_gauth .gcode{height:1.33rem;line-height:1.33rem;font-size: 14px;background-color: #fff;border-bottom:0.5px solid #e6e6e6;}
.content_gauth .gcode:last-child{border:0;}
.content_gauth .gcode input{width:7rem;font-size: 16px;background-color: inherit;border: 0;padding-left:5px;}

.confirmbtn{margin:.5rem .4rem .8rem .4rem;height:1.17rem;line-height:1.17rem;font-size:16px;border-radius:4px;background-color:#509fff;color:#fff; }

.bindtip{height: 1.07rem;line-height: 1.07rem;color:#509fff;background-color:#ebf4ff;margin-top:-10px;}
.toumingshade{position:fixed;width:100%;height:100%;top:0;left:0;right:0;z-index: 110;background-color: rgba(0,0,0,0.3)}
.toumingshade img{position: relative;z-index:111;top:5rem;;width:2.4rem;}
</style>