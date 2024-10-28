const bg = new Env('xs');

bg.version = '0.1.6';
bg.json = bg.name // `接口`类请求的响应体
bg.html = bg.name // `页面`类请求的响应体
// bg.url = "http://192.168.1.78:8080/index.html";
bg.url = `https://cdn.jsdelivr.net/gh/bgvioletsky/XS_Resource@${bg.version}/index.html`
bg.ver = 'https://raw.githubusercontent.com/bgvioletsky/XS_Resource/refs/heads/main/conf/release.json'
bg.x = bg.name;
!(
    async () => {
        // await getVersions()
        // bg.setdata("version",bg.version)
        // 为请求URL设置路径
        bg.path = bg.getPath($request.url)
        // 判断请求方法是否为 GET
        bg.isGet = $request.method === 'GET'
        // 判断请求方法是否为 POST
        bg.isPost = $request.method === 'POST'
        // 判断请求方法是否为 OPTIONS
        bg.isOptions = $request.method === 'OPTIONS'
        // 初始化请求类型为 page
        bg.type = 'page'
        // 判断是否为查询请求: /query/xxx
        bg.isQuery = bg.isPost && /^\/query\/.*?/.test(bg.path)
        // 判断是否为接口请求: /api/xxx
        bg.isApi = bg.isPost && /^\/api\/.*?/.test(bg.path)
        // 判断是否为工具请求: /html/xxx
        bg.isTool = bg.isGet && /^\/html\/.*?/.test(bg.path)
        // 判断是否为页面请求: /xxx
        bg.isPage = bg.isGet && !bg.isQuery && !bg.isApi && !bg.isTool
        // 处理OPTIONS请求
        if (bg.isOptions) {
            bg.type = 'options'
            await handleOptions()
        }
        // 处理页面请求
        else if (bg.isPage) {
            bg.type = 'page'
            await handlePage()
        }
        // 处理配置请求
        else if (bg.isTool) {
            bg.type = 'tool'
            await handleTool()
        }
        // 处理查询请求
        else if (bg.isQuery) {
            bg.type = 'query'
            await handleQuery()
        }
        // 处理接口请求
        else if (bg.isApi) {
            bg.type = 'api'
            await handleApi()
        }
    }

)()
// 捕获错误
.catch((e) => bg.log(e))
    // 执行完毕操作
    .finally(() => doneBox())
async function handleQuery() {
    const [, api] = bg.path.split('/query')
    const apiHandlers = {
        '/host': queryHost,
        '/version': getVersions
    }
    for (const [key, handler] of Object.entries(apiHandlers)) {
        if (api === key || api.startsWith(`${key}?`)) {
            await handler()
            break
        }
    }
}

async function handlePage() {
    await bg.http.get(bg.url).then(
        (resp) => {
            bg.html = resp.body
        }
    )
}
async function handleTool() {
    let url = `https://cdn.jsdelivr.net/gh/bgvioletsky/XS_Resource@${bg.version}${bg.path}`
    // let url = `http://192.168.1.78:8080${bg.path}`
    if (/\.png|\.ttf$/.test(bg.path)) {
        const myRequest = {
            url: url
        };
        await $task.fetch(myRequest).then(
            (resp) => {
                bg.html = resp.bodyBytes

            }
        )
    } else if (/\.css|\.js$/.test(bg.path)) {
        const myRequest = {
            url: url
        };
        await $task.fetch(myRequest).then(
            (resp) => {
                bg.html = resp.body
                bg.x = resp.headers['Content-Type']
            }
        )
    } else {
        await bg.http.get(url).then(
            (resp) => {
                bg.html = resp.body
            }
        )
    }
}
async function queryHost() {
    const data = bg.toObj($request.body)
    var url = data.url
   

    var method = data.method || 'GET'
    var headers = data.headers || {
        'user-agent': ' Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'
    };
    const myRequest = {
        url: url,
        method: method, // Optional, default GET.
        headers: headers,
    };
    await bg.http.get(myRequest).then(
        (resp) => {
            // bg.log(JSON.stringify(resp.body))
            bg.json = {
                val: resp.body
            }
        }, reason => {
            bg.x = 'error'
            queryHost()
        }
    )
}
async function handleApi() {
    const [, api] = bg.path.split('/api')
    const apiHandlers = {
        '/set_github': apiSave,
        '/get_github': apiGet,
        '/get_XBS_data':apiGetXBSData,
        '/get_version': getVersion,

    }

    for (const [key, handler] of Object.entries(apiHandlers)) {
        if (api === key || api.startsWith(`${key}?`)) {
            await handler()
            break
        }
    }
}
async function apiSave() {
    const data = bg.toObj($request.body)
    let a = bg.setjson(data.val, data.key)
    bg.json = {
        'a': a
    }
}
async function apiGet() {
    const data = bg.toObj($request.body)
    const key = data.key
    const val = bg.getjson(key)
    bg.json = {
        'val': val
    }
}
async function apiGetXBSData() {
    const data = bg.toObj($request.body)
    await bg.http.get(data.url).then(
        (resp) => {
            bg.json = resp.body
        }
    )
}
function doneBox() {
    if (bg.isOptions) doneOptions()
    else if (bg.isPage) donePage()
    else if (bg.isQuery) doneQuery()
    else if (bg.isApi) doneApi()
    else if (bg.isTool) doneTool()
    else bg.done()
}

function doneTool() {
    const headers = getToolDoneHeaders()
    if (bg.isQuanX()) {
        if (/\.png|\.ttf$/.test(bg.path)) {
            bg.done({
                bodyBytes: bg.html
            })
        } else {
            bg.done({
                status: 'HTTP/1.1 200',
                headers,
                body: bg.html
            })
        }

    } else {
        bg.done({
            response: {
                status: 200,
                headers,
                body: bg.html
            }
        })
    }
}

function doneOptions() {
    const headers = getBaseDoneHeaders()
    if (bg.isQuanX()) bg.done({
        headers
    })
    else bg.done({
        response: {
            headers
        }
    })
}

function getToolDoneHeaders() {
    if (/\.js|\.css$/.test(bg.path)) {
        return getBaseDoneHeaders({
            'Content-Type': bg.x
        });
    } else {
        return getBaseDoneHeaders({
            'Content-Type': 'text/html;charset=UTF-8'
        });
    }

}


function getBaseDoneHeaders(mixHeaders = {}) {
    return Object.assign({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DELETE',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        },
        mixHeaders
    )
}

function getHtmlDoneHeaders() {
    return getBaseDoneHeaders({
        'Content-Type': 'text/html;charset=UTF-8'
    })
}

function getJsonDoneHeaders() {
    return getBaseDoneHeaders({
        'Content-Type': 'application/json; charset=utf-8'
    })
}

function donePage() {
    const headers = getHtmlDoneHeaders()
    if (bg.isQuanX()) bg.done({
        status: 'HTTP/1.1 200',
        headers,
        body: bg.html
    })
    else bg.done({
        response: {
            status: 200,
            headers,
            body: bg.html
        }
    })
}

function doneQuery() {
    bg.json = bg.toStr(bg.json)
    const headers = getJsonDoneHeaders()
    if (bg.isQuanX()) bg.done({
        status: 'HTTP/1.1 200',
        headers,
        body: bg.json
    })
    else bg.done({
        response: {
            status: 200,
            headers,
            body: bg.json
        }
    })
}

async function getVersion() {
     await bg.http.get(bg.ver).then(
        (resp) => {
            try {
                let x = bg.toObj(resp.body)
                let o =   bg.compareVersion(bg.version, x.version)
                o = o === 1 ? true : false
                let env= bg.getEnv()
                bg.json = {
                    version: x.version,
                    env: env,
                    update:o
                }
            } catch {
                bg.json = {}
            }
        },
        () => (bg.json = {})
    )
}



function doneApi() {
    bg.json = bg.toStr(bg.json)
    const headers = getJsonDoneHeaders()
    if (bg.isQuanX()) bg.done({
        status: 'HTTP/1.1 200',
        headers,
        body: bg.json
    })
    else bg.done({
        response: {
            status: 200,
            headers,
            body: bg.json
        }
    })
}







function Env(name, opts) {
    class Http {
        constructor(env) {
            this.env = env
        }

        send(opts, method = 'GET') {
            opts = typeof opts === 'string' ? {
                url: opts
            } : opts
            let sender = this.get
            if (method === 'POST') {
                sender = this.post
            }

            const delayPromise = (promise, delay = 1000) => {
                return Promise.race([
                    promise,
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            reject(new Error('请求超时'))
                        }, delay)
                    })
                ])
            }

            const call = new Promise((resolve, reject) => {
                sender.call(this, opts, (err, resp, body) => {
                    if (err) reject(err)
                    else resolve(
                        resp
                    )
                })
            })

            return opts.timeout ? delayPromise(call, opts.timeout) : call
        }

        get(opts) {
            return this.send.call(this.env, opts)
        }

        post(opts) {
            return this.send.call(this.env, opts, 'POST')
        }
    }
    return new(class {
        constructor(name, opts) {
            this.name = name;
            this.logSeparator = '\n'
            this.http = new Http(this)
            this.encoding = 'utf-8'
            this.startTime = new Date().getTime()
            Object.assign(this, opts)
            this.log(`🔔${this.name}, 开始!`)
        }
        getEnv() {
            if ('undefined' !== typeof $environment && $environment['surge-version'])
                return 'Surge'
            if ('undefined' !== typeof $environment && $environment['stash-version'])
                return 'Stash'
            if ('undefined' !== typeof module && !!module.exports) return 'Node.js'
            if ('undefined' !== typeof $task) return 'Quantumult X'
            if ('undefined' !== typeof $loon) return 'Loon'
            if ('undefined' !== typeof $rocket) return 'Shadowrocket'
        }
        isNode() {
            return 'Node.js' === this.getEnv()
        }

        isQuanX() {
            return 'Quantumult X' === this.getEnv()
        }

        isSurge() {
            return 'Surge' === this.getEnv()
        }

        isLoon() {
            return 'Loon' === this.getEnv()
        }

        isShadowrocket() {
            return 'Shadowrocket' === this.getEnv()
        }

        isStash() {
            return 'Stash' === this.getEnv()
        }
        /**
         * 将JSON格式的字符串转换为对象
         * 如果字符串不是有效的JSON，将返回默认值
         * 
         * @param {string} str 待转换的JSON格式字符串
         * @param {any} defaultValue 转换失败时返回的默认值，默认为null
         * @returns {object|any} 转换成功的对象或转换失败时的默认值
         */
        toObj(str, defaultValue = null) {
            try {
                // 尝试将字符串解析为对象
                return JSON.parse(str)
            } catch {
                // 如果解析失败，返回默认值
                return defaultValue
            }
        }
        /**
         * 比较两个版本号的大小
         * @param {string} version1 - 第一个版本号，格式为"数字.数字.数字"
         * @param {string} version2 - 第二个版本号，格式为"数字.数字.数字"
         * @returns {number} - 返回值为1表示version1大于version2，为-1表示version1小于version2，为0表示两个版本号相等
         */
        compareVersion(version1, version2) {
            const v1 = version1.split('.').map(Number);
            const v2 = version2.split('.').map(Number);
            for (let i = 0; i < 3; i++) {
                if (v1[i] < v2[i]) {
                    return 1; // version1小于version2
                } else if (v1[i] > v2[i]) {
                    return -1; // version1大于version2
                }
            }
            return 0;
        }
        /**
         * 将对象转换为字符串
         * 
         * 此函数尝试将给定的对象使用JSON.stringify方法序列化为字符串如果序列化过程中发生错误，
         * 则返回默认值这个设计是为了确保在对象无法被序列化时，有一个备选的返回值，从而避免程序崩溃
         * 
         * @param {any} obj - 任何需要被转换为字符串的JavaScript对象
         * @param {string|null} [defaultValue=null] - 如果对象无法被转换为字符串时返回的默认值
         * @param {...any} args - 允许传递额外的参数给JSON.stringify方法，例如函数或符号
         * @returns {string|null} - 返回成功序列化后的字符串或者默认值
         */
        toStr(obj, defaultValue = null, ...args) {
            try {
                // 尝试使用JSON.stringify将对象转换为字符串
                return JSON.stringify(obj, ...args)
            } catch {
                // 如果转换过程中发生错误，返回默认值
                return defaultValue
            }
        }
        /**
         * 根据键名获取JSON格式的数据
         * 
         * 此函数尝试从缓存中获取与给定键名关联的JSON数据如果数据存在，并且能够被成功解析为JSON对象，则返回该JSON对象；
         * 否则，返回提供的默认值此方法用于处理JSON格式的数据，如果数据不是JSON格式或者无法解析，将返回默认值
         * 
         * @param {string} key - 要检索的数据键名
         * @param {*} defaultValue - 当指定键名的数据不存在或无法解析为JSON时返回的默认值
         * @returns {*} - 解析后的JSON对象或默认值
         */
        getjson(key, defaultValue) {
            // 初始化json为默认值
            let json = defaultValue
            // 尝试从缓存中获取与键名关联的数据
            const val = this.getdata(key)
            // 如果数据存在
            if (val) {
                try {
                    // 尝试将获取到的数据解析为JSON对象
                    json = JSON.parse(this.getdata(key))
                } catch {}
                // 如果解析失败，json将保持为默认值
            }
            // 返回解析后的JSON对象或默认值
            return json
        }

        /**
         * 将给定的JavaScript对象转换为JSON字符串，并设置到指定的键值对存储中
         * 此函数用于存储复杂的JavaScript对象，通过将其序列化为JSON字符串，以便在键值存储中进行保存
         * 这对于需要存储结构化数据而键值存储不直接支持的情况特别有用
         * 
         * @param {any} val - 要存储的JavaScript对象，可以是复杂的数据结构
         * @param {string} key - 存储的键名，用于后续检索数据
         * @returns {boolean} 如果成功存储JSON字符串，则返回true；否则返回false
         */
        setjson(val, key) {
            try {
                // 将JavaScript对象转换为JSON字符串，并尝试将其存储在键值对存储中
                return this.setdata(JSON.stringify(val), key)
            } catch {
                // 如果在序列化过程中发生错误，或者存储操作失败，则返回false
                return false
            }
        }
        getdata(key) {
            let val = this.getval(key)
            // 如果以 @
            if (/^@/.test(key)) {
                const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key)
                const objval = objkey ? this.getval(objkey) : ''
                if (objval) {
                    try {
                        const objedval = JSON.parse(objval)
                        val = objedval ? this.lodash_get(objedval, paths, '') : val
                    } catch (e) {
                        val = ''
                    }
                }
            }
            return val
        }

        setdata(val, key) {
            let issuc = false
            if (/^@/.test(key)) {
                const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key)
                const objdat = this.getval(objkey)
                const objval = objkey ?
                    objdat === 'null' ?
                    null :
                    objdat || '{}' :
                    '{}'
                try {
                    const objedval = JSON.parse(objval)
                    this.lodash_set(objedval, paths, val)
                    issuc = this.setval(JSON.stringify(objedval), objkey)
                } catch (e) {
                    const objedval = {}
                    this.lodash_set(objedval, paths, val)
                    issuc = this.setval(JSON.stringify(objedval), objkey)
                }
            } else {
                issuc = this.setval(val, key)
            }
            return issuc
        }
        lodash_get(source, path, defaultValue = undefined) {
            const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.')
            let result = source
            for (const p of paths) {
                result = Object(result)[p]
                if (result === undefined) {
                    return defaultValue
                }
            }
            return result
        }

        lodash_set(obj, path, value) {
            if (Object(obj) !== obj) return obj
            if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || []
            path
                .slice(0, -1)
                .reduce(
                    (a, c, i) =>
                    Object(a[c]) === a[c] ?
                    a[c] :
                    (a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1] ? [] : {}),
                    obj
                )[path[path.length - 1]] = value
            return obj
        }

        log(...logs) {
            return console.log(`[${new Date().toLocaleTimeString()}]${logs.map((l) => l ?? String(l)).join('\n')}`);
        }
        getPath(url) {
            // 如果以`/`结尾, 去掉最后一个`/`
            const end = url.lastIndexOf('/') === url.length - 1 ? -1 : undefined
            // slice第二个参数传 undefined 会直接截到最后
            // indexOf第二个参数用来跳过前面的 "https://"
            return url.slice(url.indexOf('/', 8), end)
        }
        getHost(url) {
            return url.slice(0, url.indexOf('/', 8))
        }
        getval(key) {
            switch (this.getEnv()) {
                case 'Surge':
                case 'Loon':
                case 'Stash':
                case 'Shadowrocket':
                    return $persistentStore.read(key)
                case 'Quantumult X':
                    return $prefs.valueForKey(key)
                case 'Node.js':
                    this.data = this.loaddata()
                    return this.data[key]
                default:
                    return (this.data && this.data[key]) || null
            }
        }

        setval(val, key) {
            switch (this.getEnv()) {
                case 'Surge':
                case 'Loon':
                case 'Stash':
                case 'Shadowrocket':
                    return $persistentStore.write(val, key)
                case 'Quantumult X':
                    return $prefs.setValueForKey(val, key)
                case 'Node.js':
                    this.data = this.loaddata()
                    this.data[key] = val
                    this.writedata()
                    return true
                default:
                    return (this.data && this.data[key]) || null
            }
        }
        get(request, callback = () => {}) {
            if (request.headers) {
                delete request.headers['Content-Type']
                delete request.headers['Content-Length']

                // HTTP/2 全是小写
                delete request.headers['content-type']
                delete request.headers['content-length']
            }
            if (request.params) {
                request.url += '?' + this.queryStr(request.params)
            }
            // followRedirect 禁止重定向
            if (
                typeof request.followRedirect !== 'undefined' &&
                !request['followRedirect']
            ) {
                if (this.isSurge() || this.isLoon()) request['auto-redirect'] = false // Surge & Loon
                if (this.isQuanX())
                    request.opts ?
                    (request['opts']['redirection'] = false) :
                    (request.opts = {
                        redirection: false
                    }) // Quantumult X
            }
            switch (this.getEnv()) {
                case 'Surge':
                case 'Loon':
                case 'Stash':
                case 'Shadowrocket':
                default:
                    if (this.isSurge() && this.isNeedRewrite) {
                        request.headers = request.headers || {}
                        Object.assign(request.headers, {
                            'X-Surge-Skip-Scripting': false
                        })
                    }
                    $httpClient.get(request, (err, resp, body) => {
                        if (!err && resp) {
                            resp.body = body
                            resp.statusCode = resp.status ? resp.status : resp.statusCode
                            resp.status = resp.statusCode
                        }
                        callback(err, resp, body)
                    })
                    break
                case 'Quantumult X':
                    if (this.isNeedRewrite) {
                        request.opts = request.opts || {}
                        Object.assign(request.opts, {
                            hints: false
                        })
                    }
                    $task.fetch(request).then(
                        (resp) => {
                            const {
                                statusCode: status,
                                statusCode,
                                headers,
                                body,
                                bodyBytes
                            } = resp
                            callback(
                                null, {
                                    status,
                                    statusCode,
                                    headers,
                                    body,
                                    bodyBytes
                                },
                                body,
                                bodyBytes
                            )
                        },
                        (err) => callback((err && err.error) || 'UndefinedError')
                    )
                    break
                case 'Node.js':
                    let iconv = require('iconv-lite')
                    this.initGotEnv(request)
                    this.got(request)
                        .on('redirect', (resp, nextOpts) => {
                            try {
                                if (resp.headers['set-cookie']) {
                                    const ck = resp.headers['set-cookie']
                                        .map(this.cktough.Cookie.parse)
                                        .toString()
                                    if (ck) {
                                        this.ckjar.setCookieSync(ck, null)
                                    }
                                    nextOpts.cookieJar = this.ckjar
                                }
                            } catch (e) {
                                this.logErr(e)
                            }
                            // this.ckjar.setCookieSync(resp.headers['set-cookie'].map(Cookie.parse).toString())
                        })
                        .then(
                            (resp) => {
                                const {
                                    statusCode: status,
                                    statusCode,
                                    headers,
                                    rawBody
                                } = resp
                                const body = iconv.decode(rawBody, this.encoding)
                                callback(
                                    null, {
                                        status,
                                        statusCode,
                                        headers,
                                        rawBody,
                                        body
                                    },
                                    body
                                )
                            },
                            (err) => {
                                const {
                                    message: error,
                                    response: resp
                                } = err
                                callback(
                                    error,
                                    resp,
                                    resp && iconv.decode(resp.rawBody, this.encoding)
                                )
                            }
                        )
                    break
            }
        }

        post(request, callback = () => {}) {
            const method = request.method ?
                request.method.toLocaleLowerCase() :
                'post'

            // 如果指定了请求体, 但没指定 `Content-Type`、`content-type`, 则自动生成。
            if (
                request.body &&
                request.headers &&
                !request.headers['Content-Type'] &&
                !request.headers['content-type']
            ) {
                // HTTP/1、HTTP/2 都支持小写 headers
                request.headers['content-type'] = 'application/x-www-form-urlencoded'
            }
            // 为避免指定错误 `content-length` 这里删除该属性，由工具端 (HttpClient) 负责重新计算并赋值
            if (request.headers) {
                delete request.headers['Content-Length']
                delete request.headers['content-length']
            }
            // followRedirect 禁止重定向
            if (
                typeof request.followRedirect !== 'undefined' &&
                !request['followRedirect']
            ) {
                if (this.isSurge() || this.isLoon()) request['auto-redirect'] = false // Surge & Loon
                if (this.isQuanX())
                    request.opts ?
                    (request['opts']['redirection'] = false) :
                    (request.opts = {
                        redirection: false
                    }) // Quantumult X
            }
            switch (this.getEnv()) {
                case 'Surge':
                case 'Loon':
                case 'Stash':
                case 'Shadowrocket':
                default:
                    if (this.isSurge() && this.isNeedRewrite) {
                        request.headers = request.headers || {}
                        Object.assign(request.headers, {
                            'X-Surge-Skip-Scripting': false
                        })
                    }
                    $httpClient[method](request, (err, resp, body) => {
                        if (!err && resp) {
                            resp.body = body
                            resp.statusCode = resp.status ? resp.status : resp.statusCode
                            resp.status = resp.statusCode
                        }
                        callback(err, resp, body)
                    })
                    break
                case 'Quantumult X':
                    request.method = method
                    if (this.isNeedRewrite) {
                        request.opts = request.opts || {}
                        Object.assign(request.opts, {
                            hints: false
                        })
                    }
                    $task.fetch(request).then(
                        (resp) => {
                            const {
                                statusCode: status,
                                statusCode,
                                headers,
                                body,
                                bodyBytes
                            } = resp
                            callback(
                                null, {
                                    status,
                                    statusCode,
                                    headers,
                                    body,
                                    bodyBytes
                                },
                                body,
                                bodyBytes
                            )
                        },
                        (err) => callback((err && err.error) || 'UndefinedError')
                    )
                    break
                case 'Node.js':
                    let iconv = require('iconv-lite')
                    this.initGotEnv(request)
                    const {
                        url, ..._request
                    } = request
                    this.got[method](url, _request).then(
                        (resp) => {
                            const {
                                statusCode: status,
                                statusCode,
                                headers,
                                rawBody
                            } = resp
                            const body = iconv.decode(rawBody, this.encoding)
                            callback(
                                null, {
                                    status,
                                    statusCode,
                                    headers,
                                    rawBody,
                                    body
                                },
                                body
                            )
                        },
                        (err) => {
                            const {
                                message: error,
                                response: resp
                            } = err
                            callback(
                                error,
                                resp,
                                resp && iconv.decode(resp.rawBody, this.encoding)
                            )
                        }
                    )
                    break
            }
        }
        /**
         * 示例:bg.time('yyyy-MM-dd qq HH:mm:ss.S')
         * bg.time('yyyyMMddHHmmssS')
         * y:年 M:月 d:日 q:季 H:时 m:分 s:秒 S:毫秒
         * 其中y可选0-4位占位符、S可选0-1位占位符，其余可选0-2位占位符
         * 根据指定的类型格式化时间
         * @param {string} fmt - 时间格式类型，支持年、月、日、时、分、秒等格式化选项
         * @param {string|null} t - 可选的时间字符串，默认为当前时间
         * @returns {string} 格式化后的时间字符串
         */
        time(fmt, t = null) {
            // 获取当前时间或指定时间
            const date = t ? new Date(t) : new Date();
            // 定义时间格式化的对象映射
            const o = {
                'M+': (date.getMonth() + 1).toString().padStart(2, '0'),
                'd+': date.getDate().toString().padStart(2, '0'),
                'H+': date.getHours().toString().padStart(2, '0'),
                'm+': date.getMinutes().toString().padStart(2, '0'),
                's+': date.getSeconds().toString().padStart(2, '0'),
                'q+': Math.floor((date.getMonth() + 3) / 3),
                'S': date.getMilliseconds()
            };

            // 处理年份格式化
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(
                    RegExp.$1,
                    (date.getFullYear() + '').substr(4 - RegExp.$1.length)
                );
            }

            // 遍历时间格式化对象，进行时间格式化处理
            for (let k in o) {
                if (new RegExp('(' + k + ')').test(fmt)) {
                    fmt = fmt.replace(
                        RegExp.$1,
                        RegExp.$1.length == 1 ?
                        o[k] :
                        ('00' + o[k]).substr(('' + o[k]).length)
                    );
                }
            }

            // 返回格式化后的时间字符串
            return fmt;
        }
        wait(time) {
            return new Promise((resolve) => setTimeout(resolve, time))
        }
        done(val = {}) {
            const endTime = new Date().getTime()
            const costTime = (endTime - this.startTime) / 1000
            this.log(`🔔${this.name}, 结束! 🕛 ${costTime} 秒`)
            this.log()
            switch (this.getEnv()) {
                case 'Surge':
                case 'Loon':
                case 'Stash':
                case 'Shadowrocket':
                case 'Quantumult X':
                default:
                    $done(val)
                    break
                case 'Node.js':
                    process.exit(1)
            }
        }
    })(name, opts);

}