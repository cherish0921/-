<template>
    <div class="notice" v-show="show">
        <div class="notice-container">
            <div class="notice-head">
                <div class="notice-title" v-html="title"></div>
                <div class="notice-close">
                    <img @touchend="closenotice" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAABg0lEQVRIS7XWQU6EQBAF0F/hAMLEaxhvQ6Ju1L0rlxMTM5kTuIOdM7PiBu5N3HkRDc0FTJkihDBAN9U9PSwh5PGb7qqisiw/mfmKiN7SNH3N8/wPZ7iqqkqMMRsATwC+qSiKHwCXYhHRLk3Tx9i4oHVdvxPRXZfpV+AXAPIl7RUbn0GFWVO3BDsAt7FxC7rPsuyBBDsH7kLlV7ZwbHwJbX/pcAPHSK5BJ/CpybXoLByK+6BW2Bf3RZ2wFg9BF+ElXJ6PKpLcas/pUvU72tW2Ej232wUAkAwLjxZVJXad89GHqpL21dGWcu6+JG+aZs/MN6PnhyzL7peWd/iOaqkVqb3Sei/1zEbqQ/h2NVViy5E5EFEyXHYffBF2nVOJa4wJaqlOWFMcQhuLFdagp7TUWdgHDcUncAgagk8GgdDa64sfjT6noj54P+zFQrV4O97GRjW4DPRbGbAHBdy77roajeWcbwVuAFx0L0dFHcmNwB8Arpm5WK1WG5/WFtBS18z8zMxf/75/zUCnJsiGAAAAAElFTkSuQmCC" alt="">
                </div>
            </div>
            <div class="notice-content">
                <template v-if="content.length">
                    <p v-for="(item, index) in content" :key="index"><span style="font-weight:bloder;color:#509fff;font-size:14px; margin-right:10px;"
                    >{{index+1}}.</span>{{item}}</p>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'notice',
    props:{
        show:{
            type:Boolean,
            default:false
        },
        title:{ //顶部title
            type:String,
            default:''
        },
        titleclass:{ //title自定义class
            type:String,
            default:''
        },
        content:{ //显示内容
            type: Array,
            default:function(){
                return []
            }
        },
        closeicon:{ //是否展示关闭箭头
            type:Boolean,
            default:true
        },
        hanldbtn:{ //底部确定、取消菜单组
            type:Boolean,
            default:false
        }
    },
    watch:{
       show(val,old){
            if(val){
               document.getElementsByTagName('html')[0].style.overflow='hidden'
            }
       } 
    },
    methods:{
        closenotice(){
            this.$emit('closenotice',{show:false})
        }
    }
}
</script>
<style scoped>
.notice{
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 100;
    padding: 0px 0.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
}
.notice-container{
    width: 100%;
    height: 70%;
    background-color: #E6E6E6;
    border-radius: 0.13rem;
    display: flex;
    flex-direction: column;
    padding: 0.51rem 0.6rem 0.83rem;
}
.notice-head{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 0.72rem;
    position: relative;
}
.notice-head .notice-title{
    font-size: 0.43rem;
    color: #509FFF;
    font-weight: 600;
}
.notice-head .notice-close{
    position: absolute;
    right: 0px;
}
.notice-head .notice-close img{
    width: 0.48rem;
}
.notice-container .notice-content{
    flex: 1;
    overflow-y: auto;
}
.notice-container .notice-content p{
    color: #595959;
    font-size: 0.35rem;
    line-height: 0.59rem;
    font-weight: 400;
    text-align: left;
}
</style>