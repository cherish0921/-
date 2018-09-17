<template>
    <div id="user">
        <div class="header_pl">
            <div class="headerline">
                <img src="https://s.lendx.vip/static/test/images/icon/pic_navb.png" alt="" @touchend="cancelalert"> 
                <p>{{$t('关于我们')}}</p>
            </div>  
        </div>
        <div class="common">
            <div class="clearfloat" @touchend="aboutLend">
                <span>{{$t('利德是什么')}}</span><img src="https://s.lendx.vip/static/test/images/icon/arrow2.png" alt="What is Lendchain?" srcset="">
            </div>
            <div class="clearfloat"><span>{{$t('当前版本')}}</span><span style="font-size:16px;">v2.0</span></div>
        </div>
        <div class="common">
            <div class="clearfloat"><span>{{$t('官网')}}</span><span><a href="https://www.lendchain.io" target="_blank">www.lendchain.io</a></span></div>
            <div class="clearfloat"><span>{{$t('官公众号')}}</span><span style="color:#509FFF;">利德LendChain</span></div>
            <div class="clearfloat"><span>{{$t('官方微博')}}</span><span><a href="https://weibo.com/lendchain" target="_blank">weibo.com/lendchain</a></span></div>
            <div class="clearfloat"><span>Twitter</span><span><a href="https://twitter.com/lendchain" target="_blank">twitter.com/lendchain</a></span></div>
            <div class="clearfloat"><span>Telegram</span><span><a href="https://t.me/LendChainEnglish" target="_blank">t.me/LendChainEnglish</a></span></div>
            <div class="clearfloat"><span>Facebook</span><span><a href="https://facebook.com/lendchain" target="_blank">facebook.com/lendchain</a></span></div>
            <div class="clearfloat"><span>Instagram</span><span><a href="https://instagram.com/lendchain" target="_blank">instagram.com/lendchain</a></span></div>
        </div>
        <div class="about-lend" v-if="aboutLendState">
            <div class="header_pl">
                <div class="headerline">
                    <img src="https://s.lendx.vip/static/test/images/icon/pic_navb.png" @touchend="cancel()" alt="返回"> 
                    <p>{{$t('whatLend.title')}}</p>
                </div>  
            </div>
            <div class="risk-manage">
                <h4>{{$t('whatLend.contents[0].title')}}</h4>
                <p class="ptitle">{{$t('whatLend.contents[0].content')}}</p>
                 <h4>{{$t('whatLend.contents[1].title')}}</h4>
                <p class="ptitle">{{$t('whatLend.contents[1].content')}}</p>
                 <h4>{{$t('whatLend.contents[2].title')}}</h4>
                 <h3>{{$t('whatLend.contents[2].content[0].title')}}</h3>
                <p class="ptitle">{{$t('whatLend.contents[2].content[0].p')}}</p>
                 <h3>{{$t('whatLend.contents[2].content[1].title')}}</h3>
                <p class="ptitle">{{$t('whatLend.contents[2].content[1].p')}}</p>
                <h3>{{$t('whatLend.contents[2].content[2].title')}}</h3>
                <p class="ptitle">{{$t('whatLend.contents[2].content[2].p')}}</p>
            </div> 
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            act: "",
            aboutLendState: false //是否显示关于我们
        };
    },
    methods: {
        cancelalert() {
            this.$router.go(-1);
        },
        aboutLend() {
            this.aboutLendState = true;
        },
        cancel(){
            this.aboutLendState = false; 
        }
    }
}
</script>
<style scoped>
.about-lend{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    z-index: 1000;
}
.risk-manage{
    font-size: 12px;
    padding: .5rem .4rem;
    margin-top: 10px;
    background-color: #fff;
}
/*.risk-manage p.ptitle{
    margin-top: 10px;
}l*/
.risk-manage p{
    line-height: 18px;
    text-align: left;
}
.risk-manage h4{
    font-size: 18px;
    margin-top: 1rem;
    font-weight: 400;
    color: #262626;
}
.risk-manage h3{
    line-height: 36px;
}


#user .common>div span:last-child a{
    font-size: 14px;
    color: #509FFF;
}
#user{position:absolute;z-index:90;height:100%;width:100%;background-color:#f5f5f5;}
.headerline{position:fixed;top:0;width:100%;border-bottom:0.5px solid #e6e6e6; height:1.17rem;line-height:1.17rem;font-size:16px;color:#262626;background-color:#fff;text-align:center;}
.headerline img{position:absolute;left:0;height: 1.17rem;z-index: 91;padding: 0.4rem;float: left;}
.personnal .header_pl>img{height:2.1rem;margin:0 auto;}
#user .bindtip{height: 1.07rem;line-height: 1.07rem;color:#509fff;background-color:#ebf4ff;}
#user .common{margin-top:10px;text-align: right;}
#user .common:nth-child(2){margin-top:1.5rem;}
#user .common>div{height:1.33rem;line-height: 1.33rem;background-color:#fff;border-bottom:0.5px solid #e5e5e5;padding-right:.4rem;font-size:16px;}
#user .common>div:last-child{border:0;}
#user .common span:first-child{float: left;margin-left:.4rem;}
#user .common img{height:.37rem;vertical-align: text-bottom;}  
#user .confirmbtn{margin:.75rem 2rem;height:1.17rem;line-height:1.17rem;font-size:16px;color:#fff;border-radius:2px;cursor: pointer;
    background: -webkit-gradient(linear, 0% 0%, 100% 0%, from(#509fff), to(#4886FF));
    -webkit-box-shadow: 1px 1px 12px rgba(80,159,255,0.5);
            box-shadow: 1px 1px 12px rgba(80,159,255,0.5)}
#user .nocountbtn{margin:.75rem 2rem;height:1.17rem;line-height:1.17rem;border:0.5px solid #509fff;color:#509fff;}
</style>
