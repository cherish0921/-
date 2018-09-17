<template>
    <div id="coinoperation">
        <div class="header_pl">
            <div class="headerline clearfloat">
                <img id="puttycancel" src="https://s.lendx.vip/static/test/images/icon/pic_navb.png" @touchend.stop="puttytoggle" alt=""> 
                <p style="text-align:center;">{{isTitle}}</p>
            </div>     
        </div>
        <div class="countrycode"  v-if="goToSetState==1" style="width: 10rem;margin-left: 0;height: 1.33rem;line-height: 1.33rem;font-size: 14px;margin-top:10px;
            background-color: #fff;text-align:left;">
            <contryCode :countryCode="countryCode" @excountry="excountry"></contryCode>
        </div>
        <form id="my-form-verif" class="form-comm">
            <div v-if="goToSetState==1">
                <div>
                    <label for="phone" >{{$t('手机号')}}</label>
                    <input type="number" v-model="phone"  :placeholder="$t('手机号')" autocomplete="off">
                </div>
                <div>
                    <label for="phoneCode">{{$t('b短信验证码')}}</label>
                    <input type="phoneCode" v-model="phoneCode"  style="width:4.6rem;" :placeholder="$t('短信验证码')" autocomplete="off">
                    <span v-show="!isgetting" style="position:absolute;right:.4rem;color:#509fff;" @touchend="sendcode">{{$t('发送验证码btn')}}</span>
                    <span v-show="isgetting" style="position:absolute;right:.4rem;color:#999;" id="Countdownvala">{{$t('发送验证码btn')}}</span>
                </div>
            </div>
            <div v-if="!goToSetState">
                <label for="nickname">{{$t('谷歌验证码')}}</label>
                <input autofocus name="nickname" id="addressWithdraw" v-model.trim="googleCode" type="text" :placeholder="$t('请输入谷歌验证码')" autocomplete="off"/>
            </div>
            <p v-if="goToSetState==2" class="bindtip">{{$t('昵称设置提示')}}</p>
            <!-- <div v-if="goToSetState==2" style="border:0;">
                <label for="nickname">{{$t('昵称')}} </label>
                <input name="nickname" id="addressWithdraw" v-model.trim="nickName" type="text" :placeholder="$t('please昵称')" autocomplete="off"/>
            </div> -->
            <div class="setnicknamev2" v-if="goToSetState==2" style="border:0;">
                <label for="nickname">{{$t('昵称')}} </label>
                <input name="nickname" id="addressWithdraw" v-model.trim="nickName" type="text" :placeholder="$t('please昵称')" autocomplete="off"/>
                <div class="setnicknametip">
                    <p v-show="tipState">{{$t('昵称格式')}}</p>
                    <img  src="https://s.lendx.vip/static/test/images/personnal/module1/tip.png" @touchend="tipState=!tipState"  alt="tip">
                </div>
            </div>
        </form>
        <input type="button" :value="$t('确认')" class="confirmbtn" @touchend="confirmBtn()"/>
   </div>
</template>
<script>
import contryCode from '../../../components/common/IntlTelInput/index';
let endtime = 60;
let interval;

export default {
    data() {
        return {
            googleCode:'', //谷歌验证码
            phone:'', //手机号
            phoneCode:'',//手机验证码
            nickName:'',//昵称
            countryCode:(this.$i18n.locale=='ch')?'cn':(this.$i18n.locale === 'ko' ? 'kr' : 'kr'),//国别码
            countrynum:(this.$i18n.locale=='ch')?86:82,
            isgetting: false,
            access_token: this.LEND.localStorage('access_token')?this.LEND.localStorage('access_token'):'',
            tipState:false
        }
    },
    props:{
        goToSetState:{
            default: 0 //默认为0只显示谷歌验证
        }
    },
    components:{contryCode},
    computed:{
        isTitle(){
            if(this.goToSetState==1){  
            setTimeout(()=>{
 if (document.querySelectorAll('.country-list')[0])document.querySelectorAll('.country-list')[0].style.display="none";     
            },10)
                return this.$t('手机认证');
            }else if(this.goToSetState==2){
                return this.$t('设置昵称');
            }else{
                return this.$t('谷歌认证');
            }
        }
    },
     mounted() {
         if(this.googleCode==0){
             window.scrollTo(0,0) 
             document.getElementById('addressWithdraw')&& document.getElementById('addressWithdraw').focus()
            
         }
    },
    methods: {
        excountry(item){
            this.countryCode=item.code
            this.countrynum=item.dialCode
        },
        sendcode() {
            if (!this.LEND.checkMobile(this.phone)) {
                this.$toast(this.$t('手机格式错误'));
                return;
            }
            this.$axios.post('/trade/sms/send-code', {
                countryCode: this.countrynum,
                phone: this.phone,
                access_token: this.access_token,
            }).then(res => {
                let ele = document.getElementById('Countdownvala');
                this.sendCommMal(res, ele);
            });
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
        confirmBtn(){
            if(!this.goToSetState){ //谷歌验证码
                if(!(/^[0-9]{6}$/.test(this.googleCode))){
                    this.$toast(this.$t('必须是6位'));
                    return;    
                }
                if(this.googleCode){
                    this.$emit('getGoogleCode',this.googleCode);                
                }else{
                    this.$toast(this.$t('请输入谷歌验证码'));        
                }
            }else if(this.goToSetState==1){ //手机验证码
                this.phone = this.phone.replace(/["+"\u0000-\u001F"+"\u007F-\u00A0" +"]/g, "");
                if(!(/^\d{6,15}$/.test(this.phone))){ //验证6-15位手机号
                    this.$toast(this.$t('手机格式错误'));
                    return;
                }
                if(String(this.phone).length<6){
                     this.$toast(this.$t('手机格式错误'));
                    return;
                }
                this.$axios.post("/trade/sms/auth-phone", {
                    countryCode: this.countrynum,
                    phone: this.phone,
                    code: this.phoneCode,
                    access_token: this.access_token
                }).then((res) => {
                    switch (Number(res.code)) {
                        case 2000:
                             this.$toast(this.$t('操作成功'));
                            let phoneClone = this.phone; //保存一次
                            this.phone = '';
                            this.phoneCode = '';
                            if( document.getElementById('Countdownvala')) document.getElementById('Countdownvala').innerHTML  =this.$t('发送验证码btn');;
                            this.isgetting = false;
                            clearInterval(interval);
                            this.LEND.localStorage('phone',phoneClone);
                            this.$emit('hideVerification',phoneClone,'phone');
                            break;
                        default:
                            this.$toast(res.message.toString())
                            break;
                    }
                })
            }else if(this.goToSetState==2){  //设置昵称
                if(this.nickName){
                    let isemoji = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
                    this.nickName = this.nickName.replace(/["+"\u0000-\u001F"+"\u007F-\u00A0" +"]/g, "");
                    if(isemoji.test(this.nickName)){
                        this.$toast(this.$t('昵称表情'));
                        return
                    }
                    let bool=/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[\uF900-\uFA2D]|[a-zA-Z0-9_]){1,8}$/.test(this.nickName)
                    if(!bool){
                        this.$toast(this.$t('昵称格式提示')+','+this.$t('最多个num',{num:8}));
                        return 
                    }
                    if(this.nickName.length>8){
                        this.$toast(this.$t('最多个num',{num:8}));
                        return;
                    }
                    this.$emit('hideVerification',this.nickName,'nickName');
                }else{
                    this.$toast(this.$t('please昵称'));                
                }       
            }
        },
        puttytoggle(e){
            this.$emit('hideVerification');
        }
    }
}
</script>
<style scoped>
.fixed-box #coinoperation{position: fixed;}
#coinoperation{position:absolute;z-index:100;height:100%;width:100%;top:0;background-color: #f5f5f5;overflow:hidden;}
.personnal #coinoperation .header_pl{background-color:#fff;}
.personnal .header_pl,.headerline{background-color: initial;}
.headerline{height:1.17rem;line-height:1.17rem;font-size:16px;color:#262626;}
.headerline img{position:absolute;left:0;height:1.17rem;float:left;  padding: 0.4rem;z-index: 99;}
.operaddress,.operanum{text-align:left;padding:.4rem;background-color:#fff;margin-top:10px;}
.operaddress>p,.operanum>p{text-align:left;font-size:12px;}
.operanum .fee{padding-top:.4rem;color:#595959;border-top:0.5px solid #e5e5e5;}
.operaddress>div input,.operanum>div input{width:8rem;height:1.33rem;line-height:1.33rem;font-size:14px;color:#595959;border:0;background: #fff;}
.operaddress>div span,.operanum>div span{position: absolute;line-height:1.33rem;right: .4rem;color:#509fff;font-size:14px;background-color: initial;}
.confirmbtn{margin-top: 1.4rem!important;line-height: 1.33rem;height: 1.33rem;margin: 0.8rem 1.07rem 1.5rem 1.07rem;font-size: 16px;color: #fff;border-radius: 4px;cursor: pointer;}
.personnal #coinoperation .header_pl{background-color:#fff;}
.personnal .header_pl,.headerline{background-color: initial;}
.headerline{height:1.17rem;line-height:1.17rem;font-size:16px;color:#262626;background-color:#fff;}
.headerline img{position:absolute;left:0;height:1.17rem;float:left;  padding: 0.4rem;z-index: 99;}
.operaddress,.operanum{text-align:left;padding:.4rem;background-color:#fff;margin-top:10px;}
.operaddress>p,.operanum>p{text-align:left;font-size:12px;}
.operanum .fee{padding-top:.4rem;color:#595959;border-top:0.5px solid #e5e5e5;}
.operaddress>div input,.operanum>div input{width:8rem;height:1.33rem;line-height:1.33rem;font-size:14px;color:#595959;border:0;background: #fff;}
.operaddress>div span,.operanum>div span{position: absolute;line-height:1.33rem;right: .4rem;color:#509fff;font-size:14px;background-color: initial;}
.confirmbtn{line-height: 1.33rem;height: 1.33rem;margin: 0.8rem 1.07rem 1.5rem 1.07rem;font-size: 16px;color: #fff;border-radius: 4px;cursor: pointer;
  background: -webkit-gradient(linear, 0% 0%, 100% 0%, from(#509fff), to(#4886ff));-webkit-box-shadow: 1px 1px 12px rgba(80, 159, 255, 0.5);box-shadow: 1px 1px 12px rgba(80, 159, 255, 0.5);}
.tips{text-align:left;color:#999;margin:.42rem;}
#gxstip{color:#ff1818;}
.address-sub{
    text-align: center;
}
.address-sub div{
    width:2.6rem;
    height:2.6rem;
    margin: 0 auto .5rem;
}
.address-sub p{
    font-size: 12px;
    color: #999;
}
.address-sub2{
    color: #262626;
    padding-top: 1.5rem;
}
.address-sub2>p{
    font-size: 12px;
}
.address-sub2>div span{
    position: static;
    color: #262626;
    font-size: 14px;
}
.address-sub2>div span:last-child{
    color: #509fff;
    float: right;
}
.tips p{
    font-size: 12px;
    line-height: 18px;
}
input{
    outline: none;
    border:0;
    margin-left: 10px;
    font-size: 14px;
}
.form-comm label{
    display: inline-block;
    width: 3.2rem;
    font-size: 14px;
    color: #999;
}
.form-comm strong{
    font-size: 12px;
    font-weight: normal;
    color:#509fff;
}
.form-comm>div{
    line-height: 1.33rem;
    text-align: left;
    border-top: 0.5px solid #eee;
    padding: 0 .42rem;
}
input[type="button"]{
    display: inline-block;
    width: 9.2rem;
    height: 1.17rem;
    margin: 0 .42rem 0;
    font-size: 16px;
    color: #fff;
    background-color: #509FFF; 
}
.form-comm .tips{
    margin-top: .8rem;
}
#my-form-verif{
    margin-top: 0px;
    font-size: 14px;
    background-color:#fff;
}
#my-form-verif span{
    color: #509FFF;
    float: right;
}
#my-form-verif input:not([type="button"]){
    background-color: transparent;
}
.bindtip{
    height: 1.07rem;
    line-height: 1.07rem;
    font-size: 12px;
    color: #509fff;
    background-color: #ebf4ff;
    margin-top: -10px;
    text-align: center;
} 
/*昵称提示*/
.setnicknamev2{
   display: flex;
   height: 1.33rem;
   padding: 0px 0.61rem 0px  0.41rem;
   flex-direction: row;
   align-items: center;
   justify-content: space-between; 
   background-color: #fff;
}
.setnicknamev2 input{
    flex: 1;
    padding-right: 0.26rem;
}
.setnicknametip{
    position: relative;
    height: 100%;
    z-index: 90;
}
.setnicknametip img{
    width:0.35rem;
    height:0.37rem;
}
.setnicknametip p{
    position: absolute;
    width: 3.3rem;
    font-size: 0.3rem;
    color: #509fff;
    background-color: #d6e9ff;
    padding: 0.08rem;
    bottom: 88%;
    right: -0.3rem;
    line-height: normal;
    word-break: break-all;
}
.setnicknametip p:after,.setnicknametip p::after{
    position: absolute;
    bottom: -0.2rem;
    right: 0.29rem;
    content: "";
    border-left: 0.21rem solid transparent;
    border-right: 0.21rem solid transparent;
    border-top: 0.21rem solid #d6e9ff;
}
</style>
