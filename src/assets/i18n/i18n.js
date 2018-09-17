import Vue from 'vue'
// import locale from 'element-ui/lib/locale';
import VueI18n from 'vue-i18n'
import messages from './lang'
Vue.use(VueI18n)

export function setlang(){
  let lang = 'en'
  lang = (navigator.appName === 'Netscape') ? (navigator.language).substr(0, 2) : (navigator.userLanguage).substr(0, 2)// 获取浏览器配置语言前两位
  if (lang === 'zh') {
    lang = 'ch'
  }else if(lang=='ko'){
    lang = 'ko'
  }else{
    lang = 'en'
  }
  return lang
}

const loadedLanguages = ['ch','en','ko','zh']

function setI18nLanguage (lang) {
  i18n.locale = lang
  return lang
}

export function loadLanguageAsync (lang) {
  if (i18n.locale !== lang) {
    if (!loadedLanguages.includes(lang)) {
      return import(`./lang/${lang}`).then(msgs => {
        i18n.setLocaleMessage(lang, msgs.default)
        loadedLanguages.push(lang)
        return setI18nLanguage(lang)
      })
    } 
    return Promise.resolve(setI18nLanguage(lang))
  }
  return Promise.resolve(lang)
}

const i18n = new VueI18n({
  locale: localStorage.getItem('LENDCHAIN_LANGUAGE') || setlang() || 'en',
  messages
})
localStorage.setItem('LENDCHAIN_LANGUAGE',i18n.locale)
// i18n.t(key, value);
// locale.i18n((key, value) => i18n.t(key, value))
export default i18n
/**
 *
 *
 *  switchLang(targetLang) {
      if (this.lang === targetLang) return;
      localStorage.setItem("ELEMENT_LANGUAGE", targetLang);
      this.$i18n.locale = targetLang;
    },
	computed: {
		lang() {
		return this.$i18n.locale || "en";
		}
  	},
 */
