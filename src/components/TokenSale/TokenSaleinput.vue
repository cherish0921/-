<template>
<div class="shadebg" @touchmove.prevent v-if="show">
    <transition name="lendchainfade1">
        <div class="inputponent survey-phone-box "  @touchmove.prevent :ref="(type==1)?'google':''">
            <div class="title clearfloat">
                <img @touchend="rollback" 
                src="../../../static/images/icon/cancel_alert.png" alt="">
                {{title}}
            </div>
            <div class="userbuy clearfloat" v-if="type==1">  
                <span>{{$t('tokensale.toast.googlecode')}}</span>
                <input id="userbuyval" v-model="buyval" :placeholder="$t('tokensale.toast.googlecode')" @blur="blur"  @focus="focusinput" readonly/>
            </div>
            <div class="userbuy income clearfloat" v-if="type==0">
                <span>{{$t('TokenSaleinput.amount')}}</span>
                <input id="userbuyval" :placeholder="placeholder" readonly v-model="buyval"/>
                <span v-html="coin"></span>
            </div>
            <div class="userbuy income clearfloat nolineheight" v-if="type==0">
                <span>{{$t('TokenSaleinput.Avaiablebalance')}}</span>
                <input readonly v-model="availamount"/>
                <span v-html="coin"></span>
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
                        <td v-tap="{methods:touchboard,name:'tap',num:'.'}" v-if="isdecimal">.</td>
                        <td v-if="!isdecimal" class="disabled-isdecimal">.</td>
                        <td v-tap="{methods:touchboard,name:'tap',num:0}">0</td>
                        <td @touchend="rollback"><img src="../../../static/images/icon/backspace_slices_alert.png" alt="" srcset=""></td>
                    </tr>
                </table>
                <div class="inputarea-confirm">
                    <div v-tap="{methods:touchboard,name:'tap',num:'d'}"><img src="../../../static/images/icon/backspace@2x.png" alt="" srcset=""></div>
                    <div class="confirmbtn">
                        <button @touchend="confirm" :disabled="disabledbtn" class="Confirmpay">{{$t('tokensale.toast.Confirm')}}</button>
                    </div>
                </div>
            </div>
        </div>
      </transition>
</div>
</template>
<script>
export default {
    name: "shadebg",
    data() {
        return {
            buyval: ""//输入内容
        };
    },
    props:{
        disabledbtn:{ //是否禁用提交按钮
            type:Boolean,
            default:false
        },
        show:{ //是否展示软键盘
            type:Boolean,
            default:false
        },
        type:{ //输入类型 0是认购，1是谷歌验证码，2是余额不足
            type:Number,
            default:0
        },
        coin:{ //币种
            type:String,
            default:''
        },
        placeholder:{ //input提示性文字
            type:String,
            default:''
        },
        title:{ //title说明
            type:String,
            default:'Invest Amount'
        },
        maxiptnum:{ //最大输入余额
            type:Number,
            default:0
        },
        miniptnum:{ //最小输入金额
            type:Number,
            default:0
        },
        isdecimal:{ //是否允许小数输入
            type:Boolean,
            default:true
        },
        availamount:{ //用户剩余可投
            type:String,
            default:null
        }
    },
    watch:{
        type(val,oldval){ //监听类型变化
            this.buyval=''
        },  
        show(val,oldval){ //监听显示变化
            this.buyval=''
        }
    },
    mounted() {
        //阻止手机双击放大
        document.addEventListener("touchstart", function(event) {
            if (event.touches.length > 1) {
                event.preventDefault();
            }
        });
        let lastTouchEnd = 0;
        document.addEventListener("touchend",function(event) {
            var now = new Date().getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        },false);
    },
    methods: {
        rollback(){ //点击叉号关闭键盘
            this.buyval='';
            this.$emit('cancelalert',{
                show:false,
                type:this.type
            })
        },
        blur(e){ //谷歌验证码失去焦点事件
            let dom=this.$refs.google;
            dom.parentNode.style.display='fixed'
            dom.style.display='fixed'
        },
        focusinput(e){ //谷歌验证码聚焦事件
            let dom=this.$refs.google;
            dom.parentNode.style.display='relative'
            dom.style.display='absolute'
        },
        touchboard(data){ //键盘输入事件
            let val=data.num
            if(this.type==0){ //认购模式
                if(this.isdecimal){ //可输入小数
                    if(typeof val==="number"){
                        this.buyval=this.buyval.replace(/^(\-)*(\d+)\.(\d).*$/,'$1$2.$3');
                        if(this.buyval.split().every((v)=>{return (v==='0')})){
                            this.buyval=val.toString()
                        }else if(this.buyval.split().every((v)=>{return (v!=='0')})){
                            this.buyval=this.buyval+val.toString();
                        }else  if(this.buyval.indexOf('.')>=0&&(this.buyval.split().some((v)=>{v!=='0'}))){
                            this.buyval=this.buyval+val.toString();
                        }
                    }else if(this.buyval.indexOf('.')<=0&&(val==='.')&&(this.buyval.length>0)){
                        this.buyval=this.buyval+'.'
                    }else if(val==='d'&&(this.buyval.length>0)){
                        this.buyval= this.buyval.toString().slice(0,this.buyval.length-1);
                    }
                    if(this.maxiptnum>0&&(this.maxiptnum>Number(this.availamount))){ //最大值>用户剩余可投
                        if(parseFloat(this.buyval)>Number(this.availamount)){ //输入金额>用户剩余可投
                            this.buyval=Number(this.availamount).toString()
                        }
                    }else{
                        if(this.maxiptnum>0&&parseFloat(this.buyval)>this.maxiptnum){ //输入大于最大值
                            this.buyval=this.maxiptnum.toString()
                        }
                    }
                }else{ //输入整数
                    if(Number(val)>=0){
                        this.buyval=this.buyval+val.toString();
                        if(this.buyval.startsWith('0')){
                            this.buyval=''
                        }
                    }else{
                        if(val==='d'&&(this.buyval.toString().length>0)){ //去除按钮
                            this.buyval= this.buyval.toString().slice(0,this.buyval.length-1);
                        }
                    }
                    if(this.maxiptnum>0&&(this.maxiptnum>Number(this.availamount))){ //最大值>用户剩余可投
                        if(parseFloat(this.buyval)>Number(this.availamount)){ //输入金额>用户剩余可投
                            this.buyval=Number(this.availamount).toString()
                        }
                    }else{
                        if(this.maxiptnum>0&&parseFloat(this.buyval)>this.maxiptnum){ //输入大于最大值
                            this.buyval=this.maxiptnum.toString()
                        }
                    }
                }
            }else if(this.type==1){ //谷歌验证码
                if(!this.isdecimal){ //输入整数
                    if(Number(val)>=0){
                        this.buyval=this.buyval+val.toString();
                    }else{
                        if(val==='d'&&(this.buyval.toString().length>0)){ //去除按钮
                            this.buyval= this.buyval.toString().slice(0,this.buyval.length-1);
                        }
                    }
                }
            }
        },
        confirm(){ //确认提交
            let illegallist=[undefined,null,false,NaN,Infinity,'','undefined','null','false','NaN','Infinity']
            if(Number(this.type)==0){ //认购
                if(illegallist.includes(this.buyval)){
                    this.$toast(this.$t('TokenSaleinput.enterquantity'))
                    return
                }
                if(parseFloat(this.buyval)==0){
                    this.$toast(this.$t('TokenSaleinput.enterquantity'))
                    this.buyval=''
                    return 
                }
                this.$emit('gopay',{
                    amount:parseFloat(this.buyval),
                    type:this.type,
                    coin:this.coin
                })
            }else if(Number(this.type)==1){ //谷歌认证码
                if((this.buyval).toString().length==6){
                    //emit提醒父组件 调用谷歌验证码检查接口和支付接口
                    this.$emit('gopay',{
                        amount:this.buyval,
                        type:this.type,
                        coin:this.coin
                    })
                }else{
                    this.$toast(this.$t('tokensale.toast.sixdigits'))
                }
            }
        }
    }
};
</script>

<style scoped>
.shadebg {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.3);
}
.inputponent {
  position: fixed;
  z-index: 90;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  text-align: center;
}
.inputponent .title,
.inputponent .userbuy,
.inputponent .income {
  height: 1.35rem;
  line-height: 1.35rem;
  font-size: 14px;
  border-bottom: 0.5px solid #e6e6e6;
}
.inputponent .nolineheight{
    display: flex;
    align-items: center;
    flex-direction: row;
    line-height: normal;
}
.inputponent .nolineheight span:last-child{
    display: inline-flex;
    align-items: center;
}
.inputponent .title {
  width: 100%;
  font-size: 16px;
  position: relative;
}
.inputponent .title img {
  width: 0.4rem;
  position: absolute;
  left: 0.4rem;
  top: 0.4rem;
}
.inputponent .title span {
  height: 100%;
  font-size: 14px;
  color: #509fff;
  position: absolute;
  right: 0.4rem;
}
.userbuy {
  display: flex;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
}
.userbuy span,
.income span {
  display: inline-block;
  /* width:3.5rem; */
}
.userbuy span:first-child,
.income span:first-child {
  text-align: left;
  padding-left: 0.4rem;
  width: 3.2rem;
}
.userbuy input,
.income input {
  width: 5rem;
  font-size: 14px;
  border: 0;
}
.userbuy span:last-child,
.income span:last-child {
  text-align: right;
  padding-right: 0.4rem;
  height: 1.35rem;
}
.income input {
  color: #ff902e;
}
/*wkx add*/
.inputarea {
  margin-top: -1px;
  width: 100%;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
}
.inputarea .inputarea-table {
  width: 75%;
  box-sizing: border-box;
}
.inputarea .inputarea-confirm {
  width: 25%;
  box-sizing: border-box;
}
.inputarea > table {
  width: 100%;
  margin: 0;
  font-size: 19px;
}
.inputarea > table img {
  height: 0.5rem;
}
.inputarea-table tr {
  width: 100%;
}
.inputarea > table tr td {
  width: 33.3%;
  height: 1.35rem;
  border: 0.5px solid #e6e6e6;
}
.inputarea > table tr td.disabled-isdecimal{background-color:#ccc;}
.inputarea > table tr.inputarea-trnobt td {
  border-top: none;
}
.inputarea .inputarea-confirm > div {
  height: 50%;
  vertical-align: middle;
}
.inputarea > div > .confirmbtn {
  background-color: #509fff;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.inputarea > div > .confirmbtn p {
  display: inline-block;
  width: 100%;
  font-size: 19px;
}
.inputarea > div > div img {
  position: relative;
  top: 1rem;
  vertical-align: middle;
  height: 0.45rem;
}
@media (max-width: 500px) {
  .income span:first-child,
  .userbuy span:first-child {
    font-size: 14px;
  }
  .inputarea > div > .confirmbtn > p {
    font-size: 16px;
    padding: 0;
  }
}
.Confirmpay{
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    background-color: #509fff;
    color: #fff;
    font-size: 0.42rem;
}
/*wkx add*/
</style>
