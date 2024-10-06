function getHost(url) {
  return url.slice(0, url.indexOf('/', 8))
}

function getPath(url) {
  const end = url.lastIndexOf('/') === url.length - 1 ? -1 : undefined
  return url.slice(url.indexOf('/', 8), end)
}

function log(msg) {
  console.log(`[${new Date().toLocaleTimeString()}] ${msg}`)
}
// log(getPath('http://xs.com/app/jd'))


function debug(...logs) {

  if (logs.length > 0) {
    this.logs = [...[], ...logs]
  }
  console.log(
    `[${new Date().toLocaleTimeString()}]${logs.map((l) => l ?? String(l)).join('\n')}`
  )

}
debug('sss', "asa", new Date().getTime())

const now = new Date();
console.log(now.getTime()); // 获取当前时间的时间戳
console.log(now.getFullYear()); // 获取年份
console.log(now.getMonth()); // 获取月份（0-11）
console.log(now.getDate()); // 获取日期（1-31）
console.log(now.getHours()); // 获取小时（0-23）
console.log(now.getMinutes()); // 获取分钟（0-59）
console.log(now.getSeconds()); // 获取秒（0-59）
console.log(now.getMilliseconds()); // 获取毫秒（0-999）
console.log(now.toLocaleString()); // 获取本地时间的字符串表示
console.log(now.toLocaleDateString()); // 获取本地日期的字符串表示
console.log(now.toLocaleTimeString()); // 获取本地时间的字符串表示


