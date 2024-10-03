/*
 * ===================================
 * 持久化属性: Xsgg 公开的数据结构
 * ===================================
 */
const bg=new Evn('xs');
const url = "http://192.168.1.78:8080/index.html";
const myRequest = {
    url: url
};

$task.fetch(myRequest).then(response => {
    $done({bodyBytes: response.bodyBytes});
}, reason => {
    $done();
});
const response = $response;

// 存储用户访问`Xsgg`时使用的域名
let version='1.0.0'
//https://github.com/bgvioletsky/XS_Resource
// 页面源码地址
let web = `https://cdn.jsdelivr.net/gh/bgvioletsky/XS_Resource@${version
    }/index.html?_=${new Date().getTime()}`
// 版本说明地址 (Release Note)
let ver = `https://raw.githubusercontent.com/bgvioletsky/XS_Resource/master/conf/release.json`

bg.setval("xs_web",web)
let ss=bg.getval("xs_web")


function Evn(t,e){
    return new class{
        getval(t) {
           return $prefs.valueForKey(t);
          }
        setval(t,e) {
            console.log(t+e)
            $prefs.setValueForKey(t,e);
          }
        removeval(t) {
            $prefs.removeValueForKey(t);
          }
    }(t,e)
}