<template>
    <div id="usercenter">
        <div class="centername">
            <span>{{$t('修改密码')}}</span> 
        </div>
        <div class="inputs">
            <div>
                <img src="https://s.lendx.vip/static/test/images/personnal/module1/cart1.png" alt="">
                <input type="password" v-model="oldpwd" :placeholder="$t('请输入旧密码')" autocomplete="off">
            </div>
            <div>
                <img src="https://s.lendx.vip/static/test/images/personnal/module1/cart1.png" alt="">
                <input type="password" v-model="newpwd" :placeholder="$t('请输入新密码')" autocomplete="off">
            </div> 
            <div>
                <img src="https://s.lendx.vip/static/test/images/personnal/module1/cart1.png" alt="">
                <input type="password" v-model="newpwd2" :placeholder="$t('请再次输入新密码')" autocomplete="off">
            </div>
        </div>
        <div class="confirmbtn" @touchend="confirm">{{$t('确认修改')}}</div>
    </div>
</template>
<script>

export default {
    data() {
        return {
            oldpwd:'',
            newpwd:'',
            newpwd2:'',
            access_token: this.LEND.localStorage('access_token')?this.LEND.localStorage('access_token'):''
        };
    },
    methods: {
        confirmAjax(){
            this.$axios.post('/trade/user/updatepwd', {
                oldpwd: this.oldpwd,
                newpwd: this.newpwd,
                access_token: this.access_token
            }).then(res => {
                if (Number(res.code) !== 2000) {
                    this.$toast(res.message);
                    return;
                }else{
                    this.$toast(this.$t('修改成功'));
                    this.$router.go(-1);    
                }
            });
        },
        confirm() {
            //检测密码是否正确
            if(this.oldpwd && this.newpwd && this.newpwd2){
                let bool1 = this.LEND.checkPass(this.newpwd);
                let bool2 = this.LEND.checkPass(this.newpwd2);  
                if (bool1 < 3 || bool2 < 3) {
                    this.$toast({position:'top',message:this.$t('密码格式错误')+this.$t('密码提示'),duration:15000});
                 return;
               }else{
                    if(this.newpwd !== this.newpwd2){
                        this.$toast(this.$t('两次不一致'));   
                         return;
                    }else{
                        this.confirmAjax(); //调用接口
                    }       
                }
            }else{
               this.$toast(this.$t('信息不完整'));
            }
        }
    }
}
</script>
<style scoped>
#usercenter {
  position: absolute;
  z-index: 90;
  width: 100%;
  height: 100%;
  background-color: #fff;
}
#usercenter >img:first-child {
  position:absolute;
  z-index:91;
  height:.45rem;
  left:.4rem;
  top:.4rem;
  

}
#usercenter > .logobg {
  width: 100%;
}
.centername {
  margin-top: 0.4rem;
}
.centername span {
  font-size: 20px;
  padding-bottom: 0.2rem;
  position: relative;
  border-bottom: 0px;
}
.centername span:after,.centername span::after{
    position: absolute;
    content: "";
    bottom: 0px;
    left: 50%;
    transform: translateX(-50%);
    width:0.43rem;
    height:0.08rem;
    border-radius: 0.08rem;
    background:linear-gradient(-90deg,rgba(72,133,255,1) 0%,rgba(80,159,255,1) 100%);
}
#usercenter .inputs > div {
  margin: 0 1.07rem;
  height: 1.46rem;
  line-height: 1.46rem;
  border-bottom: 0.5px solid #e6e6e6;
  overflow: hidden;
  text-align: left;
}
#usercenter .inputs img:first-child {
  width: 15px;
  vertical-align: middle;
}
#usercenter .inputs > div input {
  display: inline-block;
  font-size: 0.37rem;
  border: 0;
  margin-left: 0.4rem;
  min-width: 80%;
}
.confirmbtn {
  line-height: 1.33rem;
  height: 1.33rem;
  margin: 0.8rem 1.07rem 0 1.07rem;
  font-size: 16px;
  color: #fff;
  border-radius: 36px;
  cursor: pointer;
  background: -webkit-gradient(
    linear,
    0% 0%,
    100% 0%,
    from(#509fff),
    to(#4886ff)
  );
  -webkit-box-shadow: 1px 1px 12px rgba(80, 159, 255, 0.5);
  box-shadow: 1px 1px 12px rgba(80, 159, 255, 0.5);
}
.otheract {
  margin: 0.4rem 1.07rem;
  text-align: left;
  color: #509fff;
  cursor: pointer;
}
.otheract span:nth-child(1) {
  float: right;
  right: 1.07rem;
}
</style>
