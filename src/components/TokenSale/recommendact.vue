<template>
    <div id="gift">
        <div class="header_pl">
            <div class="headerline">
                <img src="https://s.lendx.vip/static/test/images/icon/pic_navb.png" @touchend="cancelalert" alt=""> 
                <p>{{$t('recommendact.title')}}</p>
            </div> 
        </div>
        <img id="headbanner" :src="$t('recommendact.hdimg')" alt="">        
        <div class="recommandsquire myrecommand">
            <div class="squireimg">{{$t('recommendact.myrecommand.title')}}</div>
            <div class="pipes clearfloat">
                <div class=" haf_pipes">
                    <p>{{$t('recommendact.myrecommand.id')}}:</p>
                    <div class="haf_pipesflex">
                        <input type="text" readonly :value="invitercode" id="invitationid">
                         <span  ref="copy" data-clipboard-action="copy"  data-clipboard-target="#invitationid" @touchend="copyTxt(1)">{{$t('复制btn')}}</span>
                    </div>
                </div>
                <div class=" haf_pipes">
                    <p>{{$t('recommendact.myrecommand.code')}}:</p>
                    <div id="qrcode"> </div>
                </div>
            </div>
            <div class="investlink">
                <p>{{$t('recommendact.myrecommand.link')}}:</p>
                <div class="investlinkdiv">
                    <input type="text" readonly :value="inviterurl" id="invitationlink">
                    <span  ref="copy2" data-clipboard-action="copy"  data-clipboard-target="#invitationlink" @touchend="copyTxt(2)">{{$t('复制btn')}}</span>
                </div>
            </div>
            <!-- 已邀请用户列表 -->
            <div class="invitationlist-tit" @touchend="getinviterlist">{{$t('recommendact.invitationtit')}}</div>
            <transition name="showinvitationlist">
                <div class="invitationlist" v-show="inviterdeta.show">
                    <div class="mybonus-container">
                        <div class="mybonus-list mybonus-title">
                            <div class="mybonus-subtit" v-html="$t('recommendact.invitationtitarr')[0]"></div>
                            <div class="mybonus-subtit mybonus-middelesubtit" v-html="$t('recommendact.invitationtitarr')[1]"></div>
                            <div class="mybonus-subtit">{{$t('recommendact.invitationtitarr')[2]}}</div>
                            <div class="mybonus-subtit">{{$t('recommendact.invitationtitarr')[3]}}</div>
                            <div class="mybonus-subtit">{{$t('recommendact.invitationtitarr')[4]}}</div>
                        </div>
                        <template v-if="inviterdeta.clonelist.length">
                            <div class="mybonus-list mybonus-contentlist" v-for="(item, index) in inviterdeta.clonelist" :key="index">
                                <div class="mybonus-subtit" v-html="item.email"></div>
                                <div class="mybonus-subtit mybonus-middelesubtit" v-html="filterinvtime(item.time)"></div>
                                <div class="mybonus-subtit"><div class="kycchecked" v-if="item.phone==1"></div></div>
                                <div class="mybonus-subtit"><div class="kycchecked" v-if="item.gIsvalid==1"></div></div>
                                <div class="mybonus-subtit"><div class="kycchecked" v-if="item.kycStatus==1"></div></div>
                            </div>
                        </template>
                        <div class="mybonus-list mybonus-contentlist" style="align-items: center;justify-content: center;" v-else>{{$t('没有更多数据')}}</div>
                    </div>
                    <div class="mybonus-pagetion" v-if="inviterdeta.total">
                        <span class="pagetion-prev" @touchend="pagechange('prev')"><img src="https://s.lendx.vip/static/test/images/icon/pic_navb.png" alt=""/></span>
                        <span class="pagetion-num" v-html="inviterdeta.pageno"></span>
                        <span class="pagetion-next" @touchend="pagechange('next')"><img src="https://s.lendx.vip/static/test/images/icon/pic_navb.png" alt=""/></span>
                    </div>
                </div>
            </transition>
        </div> 
        <div class="recommandsquire myrecommandlist">
            <div class="squireimg">
            {{$t('recommendact.myrecommandlist.title')}}
            </div>
            <div class="mybonusbox">
                <div class="mybonus-container">
                    <div class="mybonus-list mybonus-title">
                        <div class="mybonus-subtit">{{$t('recommendact.myrecommandlist.tabletitle[0]')}}</div>
                        <div class="mybonus-subtit">{{$t('recommendact.myrecommandlist.tabletitle[1]')}}</div>
                    </div>
                    <div class="mybonus-list">
                        <div class="mybonus-subtit">{{$t('recommendact.myrecommandlist.tr[0]')}}</div>
                        <div class="mybonus-subtit">{{myAuthAmount}}LV</div>
                    </div>
                    <div class="mybonus-list">
                        <div class="mybonus-subtit smalltit">
                            <span>{{$t('recommendact.myrecommandlist.tr[1]')}}</span>
                        </div>
                        <div class="mybonus-subtit">{{authAmount}}LV</div>
                    </div>
                    <div class="mybonus-list">
                        <div class="mybonus-subtit">{{$t('recommendact.myrecommandlist.tr[2]')}}</div>
                        <div class="mybonus-subtit">{{inviternumber}}LV</div>
                    </div>
                    <div class="mybonus-list">
                        <div class="mybonus-subtit">{{$t('recommendact.myrecommandlist.tr[3]')}}</div>
                        <div class="mybonus-subtit">{{inviteramount}}LV</div>
                    </div>
                </div>
            </div>
        </div> 
        <div class="recommandsquire myrecommandrule">
            <div class="squireimg">{{$t('recommendact.rules.title')}}</div>
            <div class="rules">
                <p>{{$t('recommendact.rules.rules[0]')}}</p>
                <p>{{$t('recommendact.rules.rules[1]')}}</p>
                <p>{{$t('recommendact.rules.rules[2]')}}</p>
                <p>{{$t('recommendact.rules.rules[3]')}}</p>
                <p>{{$t('recommendact.rules.rules[4]')}}</p>
                <p>{{$t('recommendact.rules.rules[5]')}}</p>
                <p>{{$t('recommendact.rules.rules[6]')}}</p>
            </div>
        </div> 
    </div>
</template>
<script>
import QRCode from 'qrcodejs2';
export default {
       data() {
        return {
            redirect:this.$route.query.redirect,
            inviterurl: '', //我的推荐url
            invitercode:'', //我的推荐ID
            inviteramount:'', //邀请投资奖励金额
            inviternumber:'', //投资奖励金额
            authAmount: '' ,//邀请用户注册奖励金额
            myAuthAmount:'', //认证奖励
            inviterdeta:{
                show:false, //是否展示邀请列表
                list:[], //邀请用户数组
                pageno:1, //当前页数
                pagesize:10,
                clonelist:[], //显示数组
                total:null //总条数
            }
        }
    },
    created(){
        this.getkaohaiinviter()
    },
    mounted(){
        this.copyBtn1 = new this.clipboard(this.$refs.copy);
        this.copyBtn2 = new this.clipboard(this.$refs.copy2);
    },
    methods:{
        getkaohaiinviter(){ //获取靠海用户数据
            this.$axios.get('/trade/inviter/info/kaohai').then((res) => {
                switch (Number(res.code)) {
                    case 2000:
                        this.inviterurl=`https://mobile.lendx.vip/Register?code=${res.data.code}&source=0`; //线上
                        this.invitercode=res.data.code;
                        this.inviteramount=res.data.inviterInvestAmount;//邀请的用户投资奖励
                        this.inviternumber=res.data.investAmount;//投资奖励金额
                        this.authAmount=res.data.authAmount;//邀请用户注册
                        this.myAuthAmount=res.data.myAuthAmount;//认证奖励
                        this.qrcode(`https://mobile.lendx.vip/Register?code=${res.data.code}&source=0`); //线上
                    break;
                    default:this.$toast(res.message.toString());break;
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        copyTxt(query){ //复制链接
            let _this = this;
            let clipboard =query==1? _this.copyBtn1:_this.copyBtn2;
            clipboard.on('success', (e) =>{
              this.$toast(this.$t('复制成功'))
            });
            clipboard.on('error', function(e) {
                 this.$toast(this.$t('请手动'))
            });  
        },
        qrcode(url) { //生成二维码
            let that = this;
            let qrcode = new QRCode('qrcode', {
                width: 60, //宽度
                height: 60, // 高度  
                text: url // 二维码内容  
            });
        },
        cancelalert(e) { //点击顶部返回
            if(this.redirect){
                this.$router.push({path:this.redirect});
            }else{
                this.$router.push({path:'Personnal'});
            }
        },
        getinviterlist(){ //请求邀请人列表
            if(this.inviterdeta.show){
                return
            }
            this.inviterdeta.show=true
            this.$axios.get(`/trade/inviter/list?access_token=${this.LEND.localStorage('access_token')}`).then((res) => {
                if(res.code==2000){
                    if(res.data.length){
                        this.inviterdeta.list=res.data
                        if(res.data.length>this.inviterdeta.pagesize){ //参与分页
                            this.inviterdeta.total=Math.ceil(res.data.length/this.inviterdeta.pagesize)
                            this.pagetion(this.inviterdeta.pageno)
                        }else{
                            this.inviterdeta.clonelist=res.data
                        }
                    }
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        pagechange(str){ //翻页
            if(str=='prev'){
                this.inviterdeta.pageno=this.inviterdeta.pageno-1;
            }else{
                this.inviterdeta.pageno=this.inviterdeta.pageno+1;
            }
            if(this.inviterdeta.pageno<1){
                this.inviterdeta.pageno=1
            }
            if(this.inviterdeta.pageno>this.inviterdeta.total){
                this.inviterdeta.pageno=this.inviterdeta.total
            }
            this.pagetion(this.inviterdeta.pageno)
        },
        pagetion(val){ //邀请人列表分页
            if(val<1){
                return
            }
            this.clonelist=[]
            let start=(Number(val)-1)*this.inviterdeta.pagesize
            let end=start+this.inviterdeta.pagesize
            this.inviterdeta.clonelist=this.inviterdeta.list.slice(start,end)
        },
        filterinvtime(time){ //过滤邀请人注册时间
            if(isNaN(Number(time))){
                return ''
            }else{
                let timestr=new Date(Number(time));
                let month=timestr.getMonth()+1;
                if(month<10){
                    month='0'+month
                }
                let day=timestr.getDate();
                if(day<10){
                    day='0'+day
                }
                return `${month}-${day}`
            }
        }
        /*
        ajaxinviterlist(){ //ajax发送请求
            if(this.inviterdeta.show){
                return
            }
            this.inviterdeta.show=true
            const xmlHttp=new XMLHttpRequest()
            xmlHttp.onreadystatechange = () => {
                if(xmlHttp.readyState==4&&xmlHttp.status==200){
                    let res=JSON.parse(xmlHttp.responseText)
                    if(res.data.length){
                        this.inviterdeta.list=res.data
                        if(res.data.length>this.inviterdeta.pagesize){ //参与分页
                            this.inviterdeta.total=Math.ceil(res.data.length/this.inviterdeta.pagesize)
                            this.pagetion(this.inviterdeta.pageno)
                        }else{
                            this.inviterdeta.clonelist=res.data
                        }
                    }
                    console.log(this.inviterdeta)
                }
            }
            let barseurl='http://apitest.lendx.vip/trade/inviter/list'
            let info=`access_token=${this.LEND.localStorage('access_token')}`
            xmlHttp.open("GET",`${barseurl}?${info}`,true);  
            xmlHttp.send(null); 
        }
        */
    }
}
</script>
<style scoped>
@import "./recommendact.css";
</style>

