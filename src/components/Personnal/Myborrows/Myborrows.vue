<template>
    <div id="_investment">
        <borrowinfo v-if="pettyshow" :borrowinfo="borrowinfo" @cancelalert="cancelpetty"></borrowinfo>
        <div class="header_pl">
            <div class="headerline">
                <img src="https://s.lendx.vip/static/test/images/icon/pic_navb.png" @touchend="cancelalert" alt=""> 
                <p>{{$t('借款列表')}}</p>
            </div>    
            <div class="myinvestlist" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
                <transition-group name="lendchainfade1">
                <div class="myinvesttype" v-for="(item,index) in borrowList" :key="index">
                    <div class="tl_myinvesttype">
                        <div>
                             <p class="toInvestmentinfo" v-tap="{methods:showpetty,name:'tap',id:item.id}">{{item.orderId}}</p>
                            <p>{{item.createTime}}</p>
                        </div>
                        <p class="investstatus" :class="computedClass(item.status)" >{{getBorrowStatus(item.status)}}</p>
                    </div>
                    <div class="ct_myinvesttype">
                        <p><span>{{$t('借入金额')}}</span><span>{{item.borrowAmount}} {{item.borrowCryptoCode}}</span></p>
                        <p><span>{{$t('利息')}}</span><span>{{item.interest?parseFloat(item.interest.toFixed(6)):''}}&nbsp;{{item.borrowCryptoCode}}</span></p>
                        <p><span>{{$t('到期时间')}}</span><span>{{item.deadline}}</span></p>
                        <p class="oper" v-if="(Number(item.status)==1)"><span>{{$t('操作')}}</span><span style="font-size:12px;" @touchend="gobackmoney(item.id,item.deadline)">{{$t('去还款')}}</span></p>
                    </div>
                    <!-- <div class="ft_myinvesttype" v-tap="{methods:showpetty,name:'tap',id:item.id}">{{$t('查看更多')}}&nbsp;&nbsp;>></div> -->
                </div>
                </transition-group> 
                <div class="more_loading" v-show="loading&&borrowList.length" style="padding: 8px 0;">
                    <mt-spinner type="fading-circle" color="#509fff" :size="20" v-show="loading&&!isLastPage&&page!=1"></mt-spinner>
                    <span v-show="isLastPage" style="color:#999;">{{$t('没有更多数据')}}</span>
                </div>
                <!-- 增加暂无数据背景图 -->
                <div class="norecords-default" v-if="!borrowList.length">
                    <div class="norecords-defaultbg">
                        <img src="../../../../static/images/icon/norecords.png" alt="" srcset="">
                        <div class="norecords-label">{{$t('暂无数据')}}</div>
                    </div>
                </div>
            </div>
            <!-- <div v-if="noMoreData" style="text-align:center;">no more data</div> -->
       </div>
    </div>
</template>
<script>
import borrowinfo from './Myborrowsinfo'

export default {
    data() {
        return {
            pettyshow: false,
            borrowList: [], //用于当前页的列表渲染
            borrowinfo: {}, //用于传给子组件的对象
            page: 1, //默认第一页
            page_size: 10, //默认每页10条数据
            isLastPage: false, //是否是最后一页,默认为false
            loading: false, //默认开始允许下拉
            // noMoreData:false, //显示暂无更多数据
            access_token: this.LEND.localStorage('access_token')?this.LEND.localStorage('access_token'):''
        }
    },
    components: {
        borrowinfo
    },
    methods: {
        loadMore() { //页面刚加载默认会加载一次
            this.loading = true;
            this.initialFun(this.page, this.page_size);
        },
        initialFun(page,page_size){
            if(this.isLastPage){
                setTimeout(()=>{
                    this.loading = false;    
                },500);
                return; 
            } 
            let formData = {
                page: page || 1,
                page_size: this.page_size
            }
            this.$axios.get('/trade/user/borrows', {
                params: formData
            }).then(res => {
                if (Number(res.code) == 2000) {
                    // if(this.page==1 && !res.data.length){
                    //     this.noMoreData = true;   
                    // }
                    let list = res.data;
                    list.forEach((item) => {
                        item.createTime = item.createTime ? this.LEND.timeToLocal(item.createTime) : ''; //出借时间
                         item.sourceDeadline=Number(item.deadline);//保存原始時間
                        item.deadline = Number(item.deadline) ? this.LEND.timeToLocal(Number(item.deadline)) : '' //到期时间
                        
                   });
                    this.borrowList = this.borrowList.concat(list);
                    this.loading = false;
                    if (res.data.length < this.page_size) { //返回的条数小于默认的条数
                        this.isLastPage = true; //已经是最后一页 
                    } else {
                        this.page++;
                    }
                } else {
                }
            });
        },
        gobackmoney: function(id,deadline) {
            let alertstring = ''
            let _borrnow = {};
            let layerid1;
            deadline = String(new Date(deadline).getTime()).slice(0,10);
            let nowTime = String(new Date().getTime()).slice(0,10);
            if (nowTime < deadline){
                alertstring = this.$t('alert提前还款')
            } else if (nowTime == deadline) {
                alertstring =this.$t('alert还款')
            } else {
                alertstring = this.$t('alert逾期还款')
            }

            layerid1 = this.$MessageBox.alert( alertstring, {
                title: this.$t('提示'),showCancelButton:true,confirmButtonText:this.$t('确定'),cancelButtonText:this.$t('取消')
            }).then(action => {
                if(action=="cancel"){
                    return;
                }
                this.$axios.post('/trade/borrow/payback', {
                    borrowId: id,
                    access_token: this.access_token
                }).then((result) => {
                    switch (Number(result.code)) {
                        case 2000:
                            this.$toast( this.$t('还款成功'));
                            this.$router.go(0);
                            break;
                        case 2010:
                             this.$toast( this.$t('余额不足'));
                        default:
                            this.$toast(result.message);
                            break;
                    }
                })
               // this.$layer.close(layerid1);
            })
        },
        computedClass: function(status) {
            if (Number(status) == 0) {
                return 'active';
            } else if (Number(status) > 10) {
                return 'darkcolor';
            } else {
                return 'common'
            }
        },
        getBorrowStatus: function(code) {
            return this.LEND.getBorrowStatus(code);
        },
        showpetty: function(data) {
            let id=data.id            
            window.scrollTo(0,0);
            this.$axios.get(`/trade/borrow/detail?borrowId=${id}`).then(res => {
                if (Number(res.code) == 2000) {
                    let curobj = res.data;
                    let oldobj = this.borrowList.find((item) => {
                        return item.id == id
                    })
                    curobj = Object.assign(curobj,oldobj); //传入到子组件之前提前先格式化好相关的数据
                    curobj.borrowAmount = this.LEND.fixFloat(curobj.borrowAmount);
                    curobj.interest = curobj.interest;
                    curobj.quotaFullTime = Number(curobj.quotaFullTime) ? this.LEND.timeToLocal(curobj.quotaFullTime) : '';
                    curobj.realPaybackTime = Number(curobj.realPaybackTime) ? this.LEND.timeToLocal(curobj.realPaybackTime) : '';
                   curobj.deadline=oldobj.sourceDeadline;//添加deadline
                    curobj.mortgageAmount = curobj.mortgageAmount;
                    if(curobj.borrowAmount && Number(curobj.boughtAmount)){ //募集百分比
                        curobj.boughtPercent = curobj.boughtAmount/Number(curobj.borrowAmount)
                        if(curobj.boughtPercent>=1)curobj.boughtPercent = 1
                    }else{
                        curobj.boughtPercent=0
                    }
                    curobj.id=id;
                    this.borrowinfo = curobj;
                } else {
                    $.toast(res.message);
                }
            })
            this.pettyshow = true;
        },
        cancelpetty() {
            this.pettyshow = false
            this.$router.go(0);
        },
        cancelalert(e) {
            this.$router.push({name:'Personnal'});
        }
    }
}
</script>
<style scoped>
#_investment{position:absolute;z-index:90;min-height:100%;width:100%;background-color:#f5f5f5;overflow-x:hidden;}
.personnal .header_pl{background-color:#f5f5f5;}
.headerline{position: fixed;z-index:1000;top:0;text-align:center;width:100%;height:1.17rem;line-height:1.17rem;font-size:16px;color:#262626;background-color:#fff;margin-bottom:10px;border-bottom:0.5px solid #e6e6e6;}
.headerline img{position:absolute;left:0;height:1.17rem;z-index:91;padding: 0.4rem;float:left;}
.myinvesttype{margin-bottom:10px;}
.myinvesttype .tl_myinvesttype{font-size:16px;color:#262626;text-align:left;height:1.75rem;padding:.4rem;background-color:#fff;border-bottom:0.5px solid #e6e6e6;position: relative;}
.myinvesttype .tl_myinvesttype div{display: inline-block;width:70%;}
.myinvesttype .tl_myinvesttype div p:nth-child(2){font-size:12px;color:#999;margin:.27rem 0 .4rem 0;}
.myinvesttype .tl_myinvesttype >.investstatus{display:inline-block;position: absolute;right: .4rem;top:50%;transform: translateY(-50%);}
.myinvesttype .tl_myinvesttype >.active{color:#509fff;}
.myinvesttype .tl_myinvesttype >.darkcolor{color:#999;}
.myinvesttype .ct_myinvesttype{padding:.4rem;font-size:14px;color:#262626;text-align:left;background-color:#fff;}
.myinvesttype .ct_myinvesttype p{margin-bottom:.2rem;color:#999;}
.myinvesttype .ct_myinvesttype p span:nth-child(2){position:absolute;right:.4rem;color:#595959;}
.myinvesttype .ct_myinvesttype .oper span:nth-child(2){width:1.47rem;height:0.64rem;line-height:0.64rem;text-align:center;color:#fff;background-color:#509fff;border-radius:2px;    margin-top: -0.1rem;}
.myinvesttype .ft_myinvesttype{height:1.07rem;line-height:1.07rem;font-size:12px;text-align:center;color:#509fff;background-color:#ebf4ff;}
.myinvestlist{margin-top:1.5rem;}
.more_loading{
  text-align: center;
}
.more_loading span{
    display: inline-block;
    text-align: center;
}
.myinvesttype .tl_myinvesttype div .toInvestmentinfo{
    color: #509FFF;
    text-decoration: underline;
}
</style>
