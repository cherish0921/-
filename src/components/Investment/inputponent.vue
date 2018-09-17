<template>
<div class="shadebg">
    <transition name="lendchainfade1">
        <div class="inputponent survey-phone-box " :ref="(type==1)?'google':''">
            <div class="title clearfloat">
                <img v-tap="{methods:rollback,name:'tap'}" src="https://s.lendx.vip/static/test/images/icon/cancel_alert.png" alt="">
               {{$t(Number(type)==1?"支付验证":"输入金额")}}
                <span v-if="Number(type)==0"  v-tap="{methods:allin,name:'tap'}">{{$t('剩余全投')}}</span>
            </div>
            <div class="userbuy clearfloat">
                <span> {{$t(Number(type)==1?"谷歌验证码":"投资金额")}}:</span>
                <input  v-if="Number(type)==0"    id="userbuyval"  readonly    v-model="buyval" :placeholder=" $t('剩余可投')+remaincanbuy"/>
                <input  v-if="Number(type)!=0"    id="userbuyval"      v-model="buyval" :placeholder="$t('谷歌验证码')" @blur="blur"  @focus="focusinput"/>
                 <span>{{(Number(type)==0)?coinname:" "}}</span>
<!--                 <span v-if="Number(type)==1" style="color:#509fff;" @touchend="fastv">粘贴</span> -->
            </div>
            <div v-if="Number(type)==0" class="userbuy income clearfloat">
                <span>{{$t('账户余额')}}:</span>
                <input v-model="userremain"  readonly placeholder="0.000001"/>
                <span>{{(Number(type)==0)?coinname:" "}}</span>
            </div>
            <div v-if="Number(type)==0" class="userbuy income clearfloat">
                <span>{{$t('到期收益')}}:</span>
                <input v-model="incomeval" id="incomeval" readonly placeholder="0.000001"/>
                <span>{{(Number(type)==0)?coinname:" "}}</span>
            </div>
            <div class="inputarea">
                <table class="inputarea-table">
                    <tr class="inputarea-trnobt">
                        <td v-tap="{methods:touchboard,name:'tap',num:1}">1</td>
                        <td v-tap="{methods:touchboard,name:'tap',num:2}">2</td>
                        <td v-tap="{methods:touchboard,name:'tap',num:3}">3</td>
                    </tr>
                    <tr>
                        <td v-tap="{methods:touchboard,name:'tap',num:4}">4</td>
                        <td v-tap="{methods:touchboard,name:'tap',num:5}">5</td>
                        <td v-tap="{methods:touchboard,name:'tap',num:6}">6</td>
                    </tr>
                    <tr>
                        <td v-tap="{methods:touchboard,name:'tap',num:7}">7</td>
                        <td v-tap="{methods:touchboard,name:'tap',num:8}">8</td>
                        <td v-tap="{methods:touchboard,name:'tap',num:9}">9</td>
                    </tr>
                    <tr>
                        <td v-tap="{methods:touchboard,name:'tap',num:'.'}">.</td>
                        <td v-tap="{methods:touchboard,name:'tap',num:0}">0</td>
                        <td @touchend="rollback"><img src="https://s.lendx.vip/static/test/images/icon/backspace_slices_alert.png" alt="" srcset=""></td>
                    </tr>
                </table>
                <div class="inputarea-confirm">
                    <div v-tap="{methods:touchboard,name:'tap',num:'d'}"><img src="https://s.lendx.vip/static/test/images/icon/backspace@2x.png" alt="" srcset=""></div>
                    <div class="confirmbtn"  v-tap="{methods:confirm,name:'tap'}"><p>{{$t('t_确认_cb')}}</p><p>{{$t(Number(type)==1?"t_支付_cb":"t_投资_cb")}}</p></div>
                </div>
            </div>

        </div>
      </transition>
</div>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<script>
export default {
  name:"inputponent",
  data() {
    return {
      buyval:'',
      incomeval:'000'
  }},
  props: ['type','canmin','coinname','remaincanbuy',"interestRates","borrowDays","userremain","lessamount"],//type=0是确认投资,type=1是确认支付,
    mounted(){  //阻止手机双击放大
        document.addEventListener('touchstart',function (event) {  
            if(event.touches.length > 1){  
                event.preventDefault();  
            }  
        })  
        let lastTouchEnd = 0;  
        document.addEventListener('touchend',function (event) {  
            var now = (new Date()).getTime();  
            if(now-lastTouchEnd <= 300){  
                event.preventDefault();  
            }  
            lastTouchEnd = now;  
        },false) 
  },
  methods:{
      focusinput:function(e){
           let dom=this.$refs.google;
           dom.parentNode.style.display='relative'
            dom.style.display='absolute'
         // this.buyval=this.remaincanbuy
      },
      blur:function(e){
           let dom=this.$refs.google;
            dom.parentNode.style.display='fixed'
            dom.style.display='fixed'
      },
      touchboard:function(data){
let val = data.num;
          if(this.type==1) {
                if(Number(val)>=0){
                this.buyval=this.buyval+val.toString();
                }else{
                    if(val==='d'&&(this.buyval.length>0)){
                    this.buyval= this.buyval.toString().slice(0,this.buyval.length-1);
                }
                }
                return false;
              }else if((typeof val==="number")&&(this.type==0)){
                this.buyval=this.buyval.replace(/^(\-)*(\d+)\.(\d\d\d\d\d).*$/,'$1$2.$3');
              }
          if(typeof val==="number"){
              if(this.buyval.split().every((v)=>{return (v==='0')})){
                    this.buyval=val.toString()
              }else if(this.buyval.split().every((v)=>{return (v!=='0')})){
                    this.buyval=this.buyval+val.toString();
              }else  if(this.buyval.indexOf('.')>=0&&(this.buyval.split().some((v)=>{v!=='0'}))){
                    this.buyval=this.buyval+val.toString();
              }
          }else if(this.buyval.indexOf('.')<=0&&(val==='.')&&(this.buyval.length>0)&&(Number(this.type)===0) ){//type==0是输入验证码不可输入.
               this.buyval=this.buyval+'.'
          }else if(val==='d'&&(this.buyval.length>0)){
             this.buyval= this.buyval.toString().slice(0,this.buyval.length-1);
          }
          if((Number(this.buyval)>Number(this.remaincanbuy))&&this.type==0){ //输入额>账户余额
            //   this.$MessageBox({title:this.$t('提示'),message:this.$t('最大可投资num',{num:this.remaincanbuy+this.coinname}),closeOnClickModal:false,confirmButtonText:this.$t('确定')})
            //   .then(()=>{
            //       this.buyval=''
            //       this.incomeval=''
            //   })
                this.buyval=this.remaincanbuy.toString()
          }
          this.incomeval=this.LEND.fixFloat(Number(this.buyval)*Number(this.interestRates)*Number(this.borrowDays))
      },
      allin:function(){
        this.buyval=this.lessamount.toString();
        this.incomeval=this.LEND.fixFloat(Number(this.buyval)*Number(this.interestRates)*Number(this.borrowDays))
      },
      rollback:function(){
        this.buyval='';
        document.getElementById('userbuyval').value=''
        // this.incomeval=this.LEND.fixFloat(Number(this.buyval)*Number(this.interestRates)*Number(this.borrowDays))
        this.incomeval='0'
        document.getElementById('incomeval').value='0'
        this.$emit('cancelalert')
      },
      confirm:function(){
          if(Number(this.type)==0){
                if(Number(this.buyval)>=this.canmin){
                    this.$emit('gopay',this.buyval,this.incomeval);
                    if(Number(this.buyval)>this.lessamount){
                        this.buyval=''
                        this.incomeval='0'
                    }
                }else if(this.remaincanbuy<this.canmin&&this.remaincanbuy>0){
                    if(this.buyval>=this.remaincanbuy){
                         this.$emit('gopay',this.buyval,this.incomeval);
                    }else{
                         this.$toast(this.$t('剩余小于起购'))
                    }
                }else{
                     this.$toast(this.$t('输入必大于起购num',{num:this.canmin}))
                }
          }else if(Number(this.type)==1){
              if((this.buyval).toString().length==6){
                  this.$emit('confirmpay',this.buyval)
                 //emit提醒父组件 调用谷歌验证码检查接口和支付接口
              }else{
                   this.$toast(this.$t('必须是6位'))
              }
             
          }
      }
  }
}
</script>

<style scoped>
.shadebg{position: fixed;width: 100%;height:100%;top:0;left:0;right:0;z-index:100;background-color:rgba(0,0,0,.3)}
.inputponent{position: fixed;z-index: 90;bottom:0;width:100%;background-color:#fff;}
.inputponent .title,.inputponent .userbuy,.inputponent .income{height:1.35rem;line-height:1.35rem;font-size:0.37rem;border-bottom:0.5px solid #e6e6e6;}
.inputponent .title{width:100%;font-size:16px;position:relative;}
.inputponent .title img{width:.4rem;position: absolute;left:.4rem;top:.4rem;}
.inputponent .title span{height:100%;font-size:14px;color:#509fff;position:absolute;right:.4rem;}
.userbuy{
    display: flex;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
}
.userbuy span,.income span{
    display:inline-block;
    /* width:3.5rem; */
}
.userbuy span:first-child,.income span:first-child{
    text-align:left;
    padding-left: 0.38rem;
    width:3.5rem;
}
.userbuy input,.income input{
    width: 5rem;
    font-size:14px;
    border:0;
}
.userbuy span:last-child,.income span:last-child{
    text-align:right;
    padding-right: .4rem;
    height:1.35rem;
}
.income input{color:#FF902E;}
/*wkx add*/
.inputarea{
    margin-top: -1px;
    width: 100%;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
}
.inputarea .inputarea-table{
    width: 75%;
    box-sizing: border-box;
}
.inputarea .inputarea-confirm{flex:1;box-sizing: border-box;align-items: stretch;height: 5.4rem;}
.inputarea>table{width:100%;margin:0;font-size:19px;}
.inputarea>table img{height:.5rem;}
.inputarea-table tr{
    width:100%;
}
.inputarea>table tr td{
    width: 33.3%;
    height:1.35rem;
    border:0.5px solid #e6e6e6;  
}
.inputarea>table tr.inputarea-trnobt td{border-top:none;}
.inputarea .inputarea-confirm>div{
    height: 50%;
    vertical-align: middle;
}


.inputarea>div>.confirmbtn{
    /* padding:.8rem.7rem; */
    display: flex;
    align-items: center;
    justify-content: center;
    background-color:#509fff;
    color:#fff;
}
.inputarea>div>.confirmbtnp{display:inline-block;width:100%;font-size:19px;}
.inputarea>div>div img{position:
relative;top:1rem;vertical-align:middle;height:.45rem;}
@media(max-width:500px){
.incomespan:first-child,.userbuyspan:first-child{font-size:14px;}
.inputarea>div>.confirmbtn>p{font-size:16px;padding:0;}
}
</style>
