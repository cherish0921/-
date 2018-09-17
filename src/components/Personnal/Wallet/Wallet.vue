<template>
    <div id="wallet">
        <div class="personnal">
           <!--  <coinoperation v-if="opercoincode" :maxAmount="maxAmount" :aid="aid" :depositaddr="depositaddr" :fees="fees" @cancelputty="cancelputty" :operName="operName" :opercoincode="opercoincode" :min="min" :sure="sure" :can="can" ></coinoperation> -->
            <div class="header_pl" style="text-align:center;">
                <div class="headerline">
                    <img src="https://s.lendx.vip/static/test/images/icon/pic_nav.png" @touchend.stop="cancelalert"  alt=""> 
                    <p>{{$t('我的钱包')}}</p>
                </div>    
                <div class="haslogin">
                    <div class="moneytitle clearfloat">   
                        <span>{{$t('可用余额')}}({{$t('lang')=='ch'?'CNY':$t('lang')=='ko'?'KRW':'USDT'}})</span>  
                    </div>
                    <div class="moneyval">≈<span>{{lastAmount}}</span></div>
                </div>
                <div class="coinlist">
                    <div class="cointype" v-for="(item,index) in coinlist" :key=index>
                        <div class="tl_cointype" style="line-height:60px;height:60px;border-bottom:0.5px solid #e6e6e6;">
                           <div class="lf_tl_cointype" style="font-size:16px;color:#262626;">
                               <img :src="'https://s.lendx.vip/static/test/images/personnal/module2/'+item.cryptoCode+'icon.png'" alt="" srcset="" style="width:22px;vertical-align: middle;">
                               {{item.cryptoCode}}
                                <span>{{coinshowrule(item.amount,item.cryptoCode)}}</span>
                               </div>
                        </div>
                        <div class="ct_cointype">
                                <span v-if="item.depositStatus" @touchend="toNextPage(item.cryptoId,item.cryptoCode,'/Deposit',item.amount)">{{$t('充值')}}</span>
                                <span v-if="!item.depositStatus"  class="dark">{{$t('充值')}}</span>
                                <span v-if="item.withdrawStatus" @touchend="toNextPage(item.cryptoId,item.cryptoCode,'/Withdraw',item.amount)">{{$t('提现')}}</span>
                                <span v-if="!item.withdrawStatus" class="dark">{{$t('提现')}}</span>
                                <span v-if="item.transferStatus" @touchend="toNextPage(item.cryptoId,item.cryptoCode,'/Transfer',item.amount)">{{$t('转账')}}</span>
                                <span v-if="!item.transferStatus" class="dark">{{$t('转账')}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="noMoreData" style="text-align:center;">{{$t('没有更多数据')}}</div>
        </div>
    </div>
</template>
<style lang="sass" scoped>
@import '../../../assets/css/MyCenter.scss'
</style>
<script>
// import coinoperation from './coinoperation'

export default {
    data() {
        return {
            coinlist:[],  //币种的列表
            toNextData:{},//用于传递到下个路由的数据集, 
            noMoreData:false, //显示暂无更多数据
            lastAmount: '',
            access_token: this.LEND.localStorage('access_token')?this.LEND.localStorage('access_token'):''
        };
    },
    created() {
        this.getUserInfo();
        //获取钱包列表
        this.$axios.get('/trade/asset/index',{params: {page:1,page_size:10}}).then( result => {
            switch (Number(result.code)) {
                case 2000:
                {
                    this.coinlist = result.data;
                    if(!this.coinlist.length){
                        this.noMoreData = true;
                    }
                    break;
                }
                    default:
                {
                }
            }
        });
    },
    methods: {
        getUserInfo() { //获得个人信息
            this.$axios.get(`/trade/user/profile`).then(res => {
                switch (Number(res.code)) {
                    case 2000:
                        {
                            this.lastAmount = res.data.lastAmount;
                            break;
                        }
                    default:
                        {
                            this.$toast(res.message);
                        }
                }
            });
        },
        coinshowrule(mount,coinid){
            let remount=mount
            let decimalpoint=mount.toString().lastIndexOf('.')//小数点位置
            if(decimalpoint!=-1){
                let decimal= mount.toString().slice(decimalpoint,mount.toString().length)//小数点后数值
                let decimalnum= mount.toString().length-decimalpoint//小数点后位数
                if(Number(mount)<1000000000){
                    //console.log(mount,'小于1个亿'+mount.toString().slice(0,decimalpoint),decimal.slice(10-decimalpoint))
                    if(coinid=="LV"||(coinid=="GXS")){
                        remount=mount.toString().slice(0,decimalpoint)+decimal.slice(0,6)
                    }else{
                        remount=mount.toString().slice(0,decimalpoint)+decimal.slice(0,11-decimalpoint)
                    }
                }
            }
            return remount.toString();
        },
        toNextPage (cid,cryptoCode,type,amount){
            if(((this.LEND.localStorage('kyc').toString()!='2')
                ||(this.LEND.localStorage('igoogle').toString()!='1')
                ||(this.LEND.localStorage('iphone').toString()!='1'))&&(type!='/Deposit')){
                 this.$MessageBox.confirm(this.$t('安全认证_资金前'),{confirmButtonText:this.$t('确定'),cancelButtonText:this.$t('取消'),closeOnClickModal:false}).then(action => {
                this.$router.push({ path:'/Safe'})
            }).catch((err)=>{})
                return false;
            }
                        var operitem = {}
            operitem.maxAmount = amount; //保存最大可提现的数量
            operitem.opercoincode = cryptoCode  //对应的是币种 "BTC" "ETH"  "USDT"
            let mapasset = this.$data.coinlist.filter(function(x, index) {
                                return x.cryptoCode === cryptoCode
                            })[0]
            operitem.addr = mapasset.depositAddrs.addr;  //对应的是充值序列号
            operitem.memo = mapasset.depositAddrs.memo;  //对应的是充值序列号
            operitem.aid = type=='/Withdraw'?mapasset.id:mapasset.cryptoId;   //每项币种的id值 提现ID跟转账ID不同
            switch(cryptoCode){
                case 'USDT':
                operitem.minr=100//最小充值数额
                operitem.minw=200//最小提现数额
                operitem.sure=1   //可网络确认次数  
                operitem.can=6    //可提币次数
                operitem.fees=10  //提现手续费
                break;
                case 'GXS':
                operitem.minr=10
                operitem.minw=10
                operitem.sure=0
                operitem.can=0
                operitem.fees=0.3
                break;
                case 'ETH':
                operitem.minr=0.01;
                operitem.minw=0.015;
                operitem.sure=15
                operitem.can=30
                operitem.fees=0.008
                break;
                case 'BTC':
                operitem.minr=0.001;
                operitem.minw=0.01;
                operitem.sure=1
                operitem.can=6
                operitem.fees=0.0005
                break;
                 case 'LV':
                operitem.minr=1;
                operitem.minw=600;
                operitem.sure=0
                operitem.can=0
                operitem.fees=5
                break;
                case 'QKC':
                operitem.minr=75;
                operitem.minw=75;
                operitem.sure=15
                operitem.can=30
                operitem.fees=37.5
                break;
                default:
                operitem.minr=0;
                operitem.minw=0;
                operitem.sure=0
                operitem.can=0
                operitem.fees=0
                break;
            }
            this.$axios.post('/trade/crypto/profile', 
                    {'access_token':this.LEND.localStorage('access_token'),'cryptoId':cid}).then(result=> {
               if (Number(result.code) != 2000) {
                    this.$toast(result.message);
                    return;
                } else { 
                operitem.minr=result.data.minDeposit;
                operitem.minw=result.data.minWithdraw;
                operitem.fees=result.data.withdrawFee;
                operitem.dayWithdraw=result.data.dayWithdraw;
                this.toNextData = operitem ;
                this.$router.push({path:type,query:this.toNextData});
                }
            }).catch((err)=>{
                  console.log(err)
                 this.$toast(this.$t('网络错误'));
            });
        },
        cancelalert(){
            if(this.$route.query.redirect){ //重定向跳转
                this.$router.push({path:this.$route.query.redirect});
            }else{
                this.$router.push({name:'Personnal'});
            }
        }
    }
}
</script>
<style scoped>
#wallet{position:absolute;z-index:90;min-height:100%;;width:100%;background-color:#f5f5f5;overflow:hidden;}
.headerline{height:1.17rem;line-height:1.17rem;font-size:16px;color:#fff;}
.headerline img{position:absolute;left:0;height:1.17rem;float:left;padding: 0.4rem;z-index: 10;}
.coinlist{background-color:#f5f5f5;}
.coinlist .cointype{width:100%;margin-bottom:10px;padding:0rem;background-color:#fff;} 
.coinlist .cointype:last-child{border-bottom:0;} 
.coinlist .cointype .tl_cointype, .coinlist .cointype .ct_cointype{text-align: left;padding:0 .4rem;}
.coinlist .cointype .tl_cointype{font-size:12px;color:#999;border-bottom:0.5px solid #e6e6e6;}
.coinlist .cointype .tl_cointype span:last-child{width:6rem;text-align:center;float: right;}
.coinlist .cointype .ct_cointype{font-size:16px;line-height:40px;height:40px;padding:0;}
.coinlist .cointype .ct_cointype span{display:inline-block;width:3.2rem;text-align:center;color:#509fff;}
.coinlist .cointype .ct_cointype span:nth-child(1),.coinlist .cointype .ct_cointype span:nth-child(2){
    border-right: 0.5px solid transparent;
    position: relative;
}
.coinlist .cointype .ct_cointype span:nth-child(1):after,.coinlist .cointype .ct_cointype span:nth-child(1)::after,.coinlist .cointype .ct_cointype span:nth-child(2):after,.coinlist .cointype .ct_cointype span:nth-child(2)::after{
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-50%);
    content: "";
    width: 1px;
    height:0.53rem;
    background:#dcdcdc;
}
.coinlist .cointype .ct_cointype .dark{color:#e6e6e6;}

/*.coinlist .cointype .tl_cointype span:last-child{float:right;padding-right:.7rem;}*/
</style>
