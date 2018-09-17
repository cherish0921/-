<template>
	<div id="_borrowinfo">
	    <verification v-if="showGoogle" @getGoogleCode="getGoogleCode" @hideVerification="cancelputty"></verification>	
		<resulttip v-if="zhuijia_status" :_status="zhuijia_status" @canceltip="changestatus"></resulttip>
		<div class="header_pl">
			<div class="headerline">
				<img src="https://s.lendx.vip/static/test/images/icon/pic_navb.png" @touchend="cancelalert" alt=""> 
				 <p style="text-align:center;">{{$t('追加抵押物')}}</p>
			</div>  
			<div class="myinvestlist">
				<div class="myinvesttype">
					<div class="ct_myinvesttype">
						<p><span>{{$t('抵押物市价')}}</span><span>1&nbsp;{{zhuijiaborrowitem.mortgageCryptoCode}} ≈ {{nowPrice}}&nbsp;
									 {{zhuijiaborrowitem.borrowCryptoCode}}</span></p>
						<p><span>{{$t('抵押数量')}}</span><span>{{zhuijiaborrowitem.mortgageAmount}}&nbsp;{{zhuijiaborrowitem.mortgageCryptoCode}}</span></p>
						<p><span>{{$t('抵押价值')}}</span><span>{{alertopt.price}}&nbsp;{{zhuijiaborrowitem.borrowCryptoCode}}</span></p>
						<p><span>{{$t('抵押警戒线')}}</span><span>{{alertopt.highrate}}&nbsp;{{zhuijiaborrowitem.borrowCryptoCode}}(140%)</span></p>
						<p><span>{{$t('抵押平仓线')}}</span><span>{{alertopt.lowrate}}&nbsp;{{zhuijiaborrowitem.borrowCryptoCode}}(110%)</span></p>
						<p><span>{{$t('抵押率')}}</span><span>{{mortgageFull}}%<i v-if="Number(mortgageFull)<=140" style="color:red">（{{$t('低于警戒')}}）</i></span></p>
					</div>
					<div class="ct_myinvesttype">
						<p><span class="titlecolor">{{$t('追加')}}</span><span>&nbsp;</span></p>
						<p class="inputadd titlecolor"><input :placeholder="$t('输入追加数额')" v-model="input_zhuijia"><span class="darkcolor">{{zhuijiaborrowitem.mortgageCryptoCode}}</span></p>
						<p class="afteradd"><span class="darkcolor">{{$t('追加后')}}<i class="blue">{{getmortgageFull(zhuijiaborrowitem,Number(zhuijiaborrowitem.mortgageAmount)+Number(input_zhuijia))}}%</i> </span><span class="blue" @touchend="goToRecharge">{{$t('充值')}}</span></p>
						</div>
					<div class="confirmbtn" style="text-align:center;" @touchend="confirm">{{$t('确定')}}</div>
				</div>
			</div>
	    </div>
	    <recharge v-if="rechargeShow" @cancelputty="cancelputty" :borrowitem="zhuijiaborrowitem"></recharge>	
	</div>
</template>
<script>
import resulttip from '../../common/resulttip'
import verification from '@/components/Personnal/Comm/verification'
import recharge from '@/components/Personnal/Comm/Recharge'

var timeout_cp;
export default {
	data() {
		return {
			act: "",
			input_zhuijia:'',
			zhuijia_borrowItem:{},
			zhuijia_status:0,//追加成功1，追加失败2
			mortgageFull:150,
			nowPrice:'', //市价格
			symbol:'', //币种的换算参数symbol
			showGoogle:false,  //默认谷歌验证弹窗不显示
			rechargeShow:false, //默认充值页面不显示
			userremain:'',
			access_token:this.LEND.localStorage('access_token')
		};
	},
	props:["zhuijiaborrowitem"],
	created(){
       
	},
	mounted() {
		//  this.getPriceFun(this.zhuijiaborrowitem.mortgageCryptoCode,this.zhuijiaborrowitem.borrowCryptoCode);
		 this.getPriceFun(this.zhuijiaborrowitem.mortgageCryptoId,this.zhuijiaborrowitem.borrowCryptoId);
	},
	computed:{
		alertopt(){ //警戒线说明
			let obj=Object.create(null)
			if(this.nowPrice){
				obj.lowrate=this.LEND.fixFloat(Number(this.zhuijiaborrowitem.borrowAmount)*1.1)
				obj.highrate=this.LEND.fixFloat(Number(this.zhuijiaborrowitem.borrowAmount)*1.4)
				obj.price=parseFloat((Number(this.nowPrice)*Number(this.zhuijiaborrowitem.mortgageAmount)).toFixed(8))
			}
			return obj
		}
	},
	components:{
		resulttip,
		verification,
		recharge
	},
	methods: {
		goToRecharge(){
            this.rechargeShow = true;
		},
		cancelputty(){
            this.showGoogle = false;
            this.rechargeShow = false;
		},
		getGoogleCode(googleCode){
            this.toAppendFun(googleCode);
		},
		changestatus:function(boo){
			if(boo){
				 this.$emit('cancelalert')
			}else{
				this.$data.zhuijia_status=0
			}
		},
		getPriceFun:async function(mid,bid){//抵押币种id,借入币种id
                let that = this,price;
                  	this.$axios.get(`/trade/crypto/price?mortgageCryptoId=${mid}&borrowCryptoId=${bid}`).then(res=>{
						switch(Number(res.code)){
							case 2000:
							price=res.data.price;
							that.$data.nowPrice=res.data.price;
							that.mortgageFull = that.getmortgageFull(that.zhuijiaborrowitem, Number(that.zhuijiaborrowitem.mortgageAmount));
							break;
							default:
							this.$toast(res.message)
							break;
						}
					}).catch(err=>{
						
					});  
        },
		getmortgageFull:function(zhuijia_borrowItem, allval) {
			//  抵押充足率= 当前抵押品价格*追加后的抵押品总数量/借款币种数量
			return Number(this.nowPrice* (allval) /zhuijia_borrowItem.borrowAmount *100).toFixed(2);
		},
		cancelalert(e){
			this.$emit('cancelalert')
		},
		confirm:function (){
			if (isNaN(this.input_zhuijia)) {
				this.$toast(this.$t('必须是数字'));
				return;
			}
			if (Number(this.$data.input_zhuijia) <= 0) {
				this.$toast(this.$t('数量')+this.$t('必须是数字'));
				return;
			}
			this.$axios.get('/trade/asset/amount', {params: {'cryptoId':this.zhuijiaborrowitem.mortgageCryptoId}}).then( result => {
                switch (Number(result.code)) {
                    case 2000:
                        {
							if(Number(this.input_zhuijia)>Number(result.data.amount)){
								this.$toast(this.$t('余额不足'))
								return;
							}else{
							this.showGoogle = true;
							}
								
                            break;
						}
				}
			})
		},
		toAppendFun(googleCode){
			this.$axios.post('/trade/append/mortgate', {
				borrowId: this.zhuijiaborrowitem.borrowId,
				amount: this.input_zhuijia,
				googleCode: googleCode,
				access_token: this.access_token
			}).then((res) => {
				switch (Number(res.code)) {
					case 2000:
					this.$toast(this.$t('追加成功'))
					    this.showGoogle = false;
						this.zhuijia_status = 1;
						this.$emit('cancelalert')
						break;
					case 2010:
						this.zhuijia_status = 2;
					default:
						this.$toast(res.message);
				}
			})
		}
	}
};
</script>
<style scoped>
#_borrowinfo{position:absolute;top: 0;z-index:9999;height:100%;width:100%;background-color:#f5f5f5;overflow:hidden;}
.personnal .header_pl{background-color:#f5f5f5;}
.headerline{height:1.17rem;line-height:1.17rem;font-size:16px;color:#262626;background-color:#fff;margin-bottom:10px;}
.headerline img{position:absolute;left:0;height:1.17rem;z-index:91;padding:.4rem;float:left;}


.myinvesttype .ct_myinvesttype{color:#262626;text-align:left;background-color:#fff;padding:.4rem;margin-bottom:10px;}
.myinvesttype .ct_myinvesttype p{margin-bottom:.2rem;color:#999;}
.myinvesttype .ct_myinvesttype:first-child p span:nth-child(1){display: inline-block;width:3rem;color:#999;}
.myinvesttype .ct_myinvesttype:first-child  p span:last-child{color:#595959;}
.myinvesttype .ct_myinvesttype:nth-child(2){padding:.4rem 0 0 0;}
.myinvesttype .ct_myinvesttype:nth-child(2) p span:nth-child(1),.myinvesttype .ct_myinvesttype:nth-child(2) p input{padding-left: .4rem;width: inherit;}
.myinvesttype .ct_myinvesttype:nth-child(2)  p:nth-child(1) span{color:#262626;}
.myinvesttype  .inputadd,.myinvesttype  .inputadd input,.myinvesttype  .inputadd span {height:1.33rem;line-height:1.33rem;}
.myinvesttype  .inputadd input{width:8rem;border:0;color:#262626;}
.myinvesttype  .inputadd span{position: absolute;right:.4rem;}
.myinvesttype .afteradd{border-top:0.5px solid #e5e5e5;height:1.1rem;line-height:1.1rem;margin:0;}
.myinvesttype .afteradd span:last-child{position:absolute;right:.4rem;color:#509fff;cursor: pointer;}
.myinvesttype .confirmbtn{margin:.4rem;height:1.17rem;line-height:1.17rem;font-size:16px;color:#fff;border-radius:2px;cursor: pointer;
		background: -webkit-gradient(linear, 0% 0%, 100% 0%, from(#509fff), to(#4886FF));
		-webkit-box-shadow: 1px 1px 12px rgba(80,159,255,0.5);
						box-shadow: 1px 1px 12px rgba(80,159,255,0.5)}
.myinvesttype .ct_myinvesttype p .blue{color: #509fff}
.titlecolor{color:#262626;}
.darkcolor{color:#595959}
.myinvesttype .ct_myinvesttype:first-child p span.highrate{color: red;}
</style>
