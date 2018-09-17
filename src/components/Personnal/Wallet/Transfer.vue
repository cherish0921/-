<template>
    <div id="coinoperation">
        <div class="header_pl">
            <div class="headerline clearfloat" style="text-align:center;">
                <img id="puttycancel" src="https://s.lendx.vip/static/test/images/icon/pic_navb.png" @touchend="goBack" alt="back"> 
                <p>{{$t('平台转账')}}</p>
            </div>     
        </div>
        <div>
            <form id="my-form" class="form-comm">
                <div>
                    <div class="form_label">
                    <label for="email">{{$t('收款邮箱')}}</label>
                    </div>
                    <input name="email" type="text" v-model.trim="email" :placeholder="$t('请输入收款邮箱')" />
                </div>
                <div>
                    <div class="form_label">
                    <label for="nickname">{{$t('昵称')}}<br v-if="this.$i18n.locale=='en'"><span>({{$t('选填')}})</span></label>
                    </div>
                    <input name="nickname" v-model="nickname" type="text" :placeholder="$t('输入昵称')"/>
                </div>
                <div>
                    <div class="form_label">
                    <label for="phone">{{$t('手机号')}}<br v-if="this.$i18n.locale=='en'"><span>({{$t('选填')}})</span></label>
                    </div>
                    <input name="phone" type="text" v-model="phone" :placeholder="$t('输入手机号')"/>
                </div>
                <div>
                    <div class="form_label">
                    <label for="allmount">{{$t('转账数量')}}</label>
                    </div>
                    <input name="allmount" type="text" :placeholder="$t('请输入数量')" v-model="amount"/>
                    <span style="position: absolute;font-size: 14px;right:.4rem;">{{queryObj.opercoincode}}</span>
                </div>
                <input type="button" :value="$t('确认转账')" @touchend="confirmBtn()"/>
            </form>
            <div class="tips">
                <p>{{$t('transfertip.title')}}</p>
                <p>{{$t('transfertip.tip1')}}</p>
                <p>{{$t('transfertip.tip2')}}</p>
            </div>    
        </div>
        <GemailValidate v-if="verification" @getDate="getDate($event)" :disabled="disabled" :isClear="isClear" @hideValid="hideValid">{{$t('转账验证')}}</GemailValidate>
   </div>
</template>
<script>
import QRCode from 'qrcodejs2'
import GemailValidate from '@/components/Personnal/Comm/GemailValidate'

let endtime=60;
let interval;
let ajax = false; //防止重复点击

export default {
    data() {
        return {
            disabled:false, //用于验证码组件按钮的状态
            isClear:false, //是否清除子组件的定时器
            googleCode:'', //谷歌验证码
            emailCode:'',  //手机验证码
            verification:false, //默认不显示验证页面
            access_token: this.LEND.localStorage('access_token')?this.LEND.localStorage('access_token'):'',
            amount:'',  //转账数量
            phone:'',    //手机号
            nickname:'',  //昵称
            email:'',  //账户邮箱
            queryObj:this.$route.query //从上一级路由拿到的数据对象
        }
    },
    components:{
        GemailValidate
    },
    mounted(){
        if(this.queryObj.opercoincode=='ETH'){
            document.getElementsByTagName('body')[0].setAttribute('class','ethmessagebox')
        }else{
            document.getElementsByTagName('body')[0].setAttribute('class','')
        }
        if(this.LEND.localStorage('kyc').toString()!='2'){
                  this.$MessageBox.confirm(this.$t('kyc_转账前'),{confirmButtonText:this.$t('确定'),cancelButtonText:this.$t('取消'),closeOnClickModal:false}).then(action => {
                  this.$router.push({ path:'/Safe'})
                    }).catch(error => {
                });
        }
    },
    methods: {
        hideValid(){
           this.verification = false;
        },
        getDate(data){ //从子组件拿到邮箱验证跟谷歌验证
            this.disabled = true;
            this.googleCode = data.googleCode;
            this.emailCode = data.emailCode;
            this.VerifProp();
        },  
        goBack(){
            this.$router.go(-1);
        },
        confirmBtn(){
            if(!this.LEND.checkMail(this.email)) {
                this.$toast(this.$t('邮箱格式错误'));
                return;
            }else if(Number(this.amount <= 0)){
                 this.$toast(this.$t('必须是数字'));
                 return;
                
            } else if (Number(this.amount) > Number(this.queryObj.maxAmount)) {
                this.$toast(this.$t('余额不足'));
                return;
            } else if (this.phone) {
                if (!this.LEND.checkMobile(this.phone)) {
                    this.$toast(this.$t('手机格式错误'));
                    return;
                }
            } else if(isNaN(this.amount)){
                this.$toast(this.$t('必须是数字'));
                return;
            }
            var hasIphone = parseInt(this.LEND.localStorage('iphone'));
            var hasIgoogle = parseInt(this.LEND.localStorage('igoogle'));
            if (!hasIphone || !hasIgoogle) {
                this.$router.push({name: 'Safe',query: {redirect: this.$route.fullPath}});
                return;
            }else{
                this.verification = true;
            }
        },
        VerifProp() { //谷歌和手机验证码页面
            let formData = {
                    cryptoId: this.queryObj.aid,
                    cryptoCode: this.queryObj.opercoincode,
                    nickname: this.nickname,
                    email: this.email,
                    phone: this.phone,
                    amount: this.amount,
                    access_token: this.access_token,
                    googleCode: this.googleCode,
                    emailCode: this.emailCode,
            }
            this.$axios.post('/trade/asset/transfer', formData).then(result => {
                if (Number(result.code) !== 2000) {
                    this.$toast(result.message);
                    this.disabled = false;
                    return;
                } else {
                    this.isClear = true;
                    setTimeout(()=>{  //做一个延迟不然子组件监听不到isClear的值
                        this.$toast(this.$t('操作成功'));
                        this.verification = false; //成功才隐藏验证页面
                        this.disabled = false;
                        this.$router.replace({path:'/Wallet'});
                    },20);
                }
            }).catch((err) => {
                this.disabled = false;
                this.$toast(this.$t('网络错误'));
            });
        }
    }
}
</script>
<style scoped>
#coinoperation{position:absolute;z-index:91;height:100%;width:100%;background-image:url('https://s.lendx.vip/images/personnal/module2/bg.png');background-size: cover;overflow:hidden;}
.personnal #coinoperation .header_pl{background-color:#fff;}
.personnal .header_pl,.headerline{background-color: initial;}
.headerline{height:1.17rem;line-height:1.17rem;font-size:16px;color:#262626;background-color:#fff;}
.headerline img{position:absolute;left:0;height: 1.17rem;float:left;padding:.4rem;z-index: 50;}
.operaddress,.operanum{text-align:left;padding:.4rem;background-color:#fff;margin-top:10px;}
.operaddress>p,.operanum>p{text-align:left;font-size:12px;}
.operanum .fee{padding-top:.4rem;color:#595959;border-top:0.5px solid #e5e5e5;}
.operaddress>div input,.operanum>div input{width:8rem;height:1.33rem;line-height:1.33rem;font-size:14px;color:#595959;border:0;background: #fff;}
.operaddress>div span,.operanum>div span{position: absolute;line-height:1.33rem;right: .4rem;color:#509fff;font-size:14px;background-color: initial;}
.confirmbtn{text-align:center;line-height: 1.33rem;height: 1.33rem;margin: 0.8rem 1.07rem 1.5rem 1.07rem;font-size: 16px;color: #fff;border-radius: 4px;cursor: pointer;
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
.form-comm{margin-top: 10px;}
.form_label{display:flex;align-items: center;;width:3.4rem;line-height:.6rem;}
.form-comm input{
    outline: none;
    border:0;
    margin-left: 0.13rem;
    font-size: 14px;
    background-color: transparent;
    padding-left: 0.13rem;
}
.form-comm label{
    font-size: 14px;
    color: #999;
}
.form_label span{
    color:#509fff;
}
.form-comm>div{
    display: flex;
    height: 1.33rem;
    line-height: 1.33rem;
    text-align: left;
    border-top: 0.5px solid #eee;
    padding: 0 .42rem;
    background-color:#fff;
}
.form-comm input[type="button"]{
    display: inline-block;
    width: 9.2rem;
    height: 1.17rem;
    margin: .71rem .42rem 0;
    font-size: 16px;
    color: #fff;
    background-color: #509FFF; 
}
.form-comm .tips{
    margin-top: .8rem;
}
#my-form-verif{
    font-size: 14px;
}
#my-form-verif span{
    color: #509FFF;
    float: right;
}
</style>
<style>
.ethmessagebox .mint-msgbox{top:30%;}
</style>

