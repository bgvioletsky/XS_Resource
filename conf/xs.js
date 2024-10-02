// 创建一个名为'Xsgg'的环境实例
const $ = {}
// 为 eval 准备的上下文环境
const $eval_env = {}

$.version = '0.0.1'
$.versionType = 'beta'

// 发出的请求需要需要 Surge、QuanX 的 rewrite
$.isNeedRewrite = true

/**
 * ===================================
 * 持久化属性: Xsgg 自有的数据结构
 * ===================================
 */

// 存储`用户偏好`
$.KEY_usercfgs = 'bgcode_userCfgs'
// 存储`应用会话`
$.KEY_sessions = 'bgcode_sessions'
// 存储`页面缓存`
$.KEY_web_cache = 'bgcode_web_cache'
// 存储`应用订阅缓存`
$.KEY_app_subCaches = 'bgcode_app_subCaches'
// 存储`全局备份` (弃用, 改用 `bgcode_backups`)
$.KEY_globalBaks = 'bgcode_globalBaks'
// 存储`备份索引`
$.KEY_backups = 'bgcode_backups'
// 存储`当前会话` (配合切换会话, 记录当前切换到哪个会话)
$.KEY_cursessions = 'bgcode_cur_sessions'

/**
 * ===================================
 * 持久化属性: Xsgg 公开的数据结构
 * ===================================
 */

// 存储用户访问`Xsgg`时使用的域名
$.KEY_Xsgg_host = 'xs.com'

// 请求响应体 (返回至页面的结果)
$.json = $.name // `接口`类请求的响应体
$.html = $.name // `页面`类请求的响应体
//https://github.com/bgvioletsky/XS_Resource
// 页面源码地址
$.web = `https://cdn.jsdelivr.net/gh/bgvioletsky/XS_Resource@${
  $.version
}/index.html?_=${new Date().getTime()}`
console.log($.web)
// 版本说明地址 (Release Note)
$.ver = `https://raw.githubusercontent.com/bgvioletsky/XS_Resource/master/conf/release.json`

  !(async () => {
    const url = "https://cdn.jsdelivr.net/gh/bgvioletsky/QX@0.1.16/rewrite_remote/xbs/render.html";
    const myRequest = {
        url: url
    };
    
    $task.fetch(myRequest).then(response => {
        $done({bodyBytes: response.bodyBytes});
    }, reason => {
        $done();
    });
  })()
  .catch((e) => $.logErr(e))
  .finally(() => doneBox())

  function doneBox() {
    // 记录当前使用哪个域名访问
    $done()
  }

