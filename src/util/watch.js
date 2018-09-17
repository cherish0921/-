export function googletotal(targetname,lang,desc){ //  google、百度统计
    gtag('event', targetname, {
        'event_category':targetname, //类别字符串
        'event_label': `${desc},语言版本：${lang}`
    });
    /*
    gtag('event', <action>, { //可选
        'event_category': <category>,
        'event_label': <label>,
        'value': <value>
    });
        <action> 是在 Google Analytics（分析）事件报告中显示为事件操作的字符串。
        <category> 是显示为事件类别的字符串。
        <label> 是显示为事件标签的字符串。
        <value> 是一个显示为事件价值的非负整数。
    */
    _hmt.push(['_trackEvent',targetname,lang,desc]);
}