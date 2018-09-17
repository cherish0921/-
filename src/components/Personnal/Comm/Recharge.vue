<template>
    <div id="coinoperation">
        <div class="header_pl">
            <div class="headerline clearfloat">
                <img id="puttycancel" src="https://s.lendx.vip/static/test/images/icon/pic_navb.png" @touchend.stop="puttytoggle" alt="返回"> 
                <p  style=" text-align:center;">{{$t('充值')}}</p>
            </div>     
        </div>
        <div class="operaddress">
            <div class="address">
                <div class="address-sub">
                    <div id="qrcode"></div>
                    <p>{{$t('扫获地址')}}</p>
                </div>
                <div class="address-sub2">
                    <p style="">{{$t('充值地址')}}</p>
                    <div>
                        <input id="addressDeposit" type="text"  :value="addr" readonly/>
                        <span  ref="copy1" data-clipboard-action="copy"  data-clipboard-target="#addressDeposit" @touchend="copyOrPasteTxt(1)">{{this.$t('复制btn')}}</span>
                    </div>
                </div>
                <div class="address-sub2" style="padding-top:.2rem;" v-if="memo">
                    <p >备注（Memo）</p>
                    <div>
                        <input id="memo" type="text" :value="memo" readonly/>
                        <span  ref="copy2" data-clipboard-action="copy"  data-clipboard-target="#memo" @touchend="copyOrPasteTxt(2)">{{this.$t('复制btn')}}</span> 
                    </div>
                </div>
                <div v-show="borrowitem.opercoincode=='GXS'||borrowitem.opercoincode=='LV'" style="background-color:#f1d4d0;color:red;padding:.4rem;font-size:12px;line-height:12px;;">
                    {{$t('memo提示')}}
                </div>
            </div>
        </div>   
        <div class="tips">
            <p>{{$t('deposittip.title')}}</p>
            <p>{{$t('deposittip.tip1',{name:borrowitem.opercoincode})}}</p>
            <p>{{$t('deposittip.tip2',{sure:borrowitem.sure,can:borrowitem.can})}}</p>
            <p>{{$t('deposittip.tip3',{minr:borrowitem.minr,name:borrowitem.opercoincode})}}</p>
            <p>{{$t('deposittip.tip4')}}</p>
            <p>{{$t('deposittip.tip5')}}</p>
        </div>
    </div>
</template>
<script>
import QRCode from 'qrcodejs2'

let endtime=60;
let interval;

export default {
    data() {
        return {
            addr:'',
            min:'',
            sure:'',
            can:'',
            memo:'',  //备注
            access_token: this.LEND.localStorage('access_token'),
        }
    },
    props: ['borrowitem'],
    created(){
        switch(this.borrowitem.mortgageCryptoCode){
            case 'USDT':
            this.min=100
            this.sure=1
            this.can=6
            break;
            case 'GXS':
            this.min=10
            this.sure=0
            this.can=0
            break;
            case 'ETH':
            this.min=0.01
            this.sure=15
            this.can=30
            break;
            case 'BTC':
            this.min=0.001
            this.sure=1
            this.can=6
            break;
            case 'LV':
            this.min=100
            this.sure=1
            this.can=6
            break;
            case 'QKC':
            this.min=75
            this.sure=15
            this.can=30
            break;
            default:
            this.min=0
            this.sure=0
            this.can=0
            break;
        }
        this.$axios.get('/trade/deposit/address',{params:{cryptoId:this.borrowitem.mortgageCryptoId}}).then((res) => {
            if (Number(res.code == 2000)) {
                this.addr = res.data.master.addr;
                this.memo = res.data.master.memo;
                this.qrcode();
            } else {
                this.$toast(res.message);
            }
        })
    },
    methods: {
        copyOrPasteTxt(num) { 
            let clipboard = num==1?new this.clipboard(this.$refs.copy1):new this.clipboard(this.$refs.copy2);
            clipboard.on('success', () =>{
                this.$toast(this.$t('复制成功'))
            });
            clipboard.on('error', function() {
                this.$toast(this.$t('请手动'))
            });  
        },
        qrcode() { //生成二维码
            var that = this;
            let qrcode = new QRCode('qrcode', {
                width: 95, //宽度
                height: 95, // 高度  
                text: that.addr // 二维码内容  
            })
        },
        puttytoggle(e) {
            this.$emit('cancelputty');
        }
    }
}
</script>
<style scoped>
#coinoperation{position:fixed;z-index:91;top:0;height:100%;width:100%;background-image:url('https://s.lendx.vip/images/personnal/module2/bg.png');background-size: cover;overflow:hidden;}
.personnal .header_pl,.headerline{background-color: initial;background-color:#fff;}
.headerline{height:1.17rem;line-height:1.17rem;font-size:16px;color:#262626;}
.headerline img{position:absolute;left:0;height: 1.17rem;     position: absolute;padding: 0.4rem;;z-index: 99;}
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
.form-comm input{
    outline: none;
    border:0;
    margin-left: 10px;
    font-size: 14px;
}
.form-comm label{
    font-size: 14px;
    color: #999;
}
.form-comm strong{
    font-size: 12px;
    font-weight: normal;
    color:#509fff;
}
.form-comm>div{
    height: 1.33rem;
    line-height: 1.33rem;
    text-align: left;
    border-top: 0.5px solid #eee;
    padding: 0 .42rem;
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
