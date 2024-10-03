/**
 * 保存数据到本地存储
 * @param {string} key - 存储的键名，必须是字符串类型
 * @param {string} value - 存储的键值，必须是字符串类型
 */
function saveData(key, value) {
    // 检查 key 和 value 是否都是字符串类型
    if (typeof key === 'string' && typeof value === 'string') {
        $prefs.setValueForKey(value, key); // 使用 pref 对象的 setValueForKey 方法保存数据
        console.log("保存成功:"+ value); // 输出成功保存的信息
    } else {
        console.log("错误: key 和 value 必须是字符串"); // 输出错误信息，如果 key 或 value 不是字符串类型
    }
}

// 读取数据
/**
 * 从本地存储加载数据
 * @param {string} key - 要加载的键名，必须是有效的字符串类型
 * @returns {string|undefined} - 返回键名对应的值，如果键名不存在则返回 undefined
 */
function loadData(key) {
    var value = $prefs.valueForKey(key); // 使用 pref 对象的 valueForKey 方法读取数据
    // 检查读取的值是否为 undefined
    if (value === undefined) {
        console.log("未找到该键:"+ key); // 如果未找到键，输出信息
    } else {
        console.log("读取到的值:"+ value); // 如果找到键，输出读取到的值
    }
    return value; // 返回读取的值
}

// 删除数据
/**
 * 从本地存储删除指定键的数据
 * @param {string} key - 要删除的键名，必须是有效的字符串类型
 */
function removeData(key) {
    $prefs.removeValueForKey(key); // 使用 pref 对象的 removeValueForKey 方法删除数据
}

// 使用 saveData 函数保存主题为 dark
saveData("theme", "dark");

// 输出当前主题
var theme = loadData("theme");
console.log("当前主题:"+ theme);
// 发送通知
$notify("签到结果", theme, "");
// 完成任务


function set_token(token) {
    saveData("token", token);
    $done();
}

function Env(t,e){
    class s {
        constructor(name, script) {
            this.name = name;
            this.script = script;
        }
    }
    return new class{
        constructor(t, e) {
            this.logLevels = {
              debug: 0,
              info: 1,
              warn: 2,
              error: 3
            }, this.logLevelPrefixs = {
              debug: "[DEBUG] ",
              info: "[INFO] ",
              warn: "[WARN] ",
              error: "[ERROR] "
            }, this.logLevel = "info", this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.encoding = "utf-8", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`)
          }
    }
}