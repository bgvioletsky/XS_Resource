let method = 'GET'

function handleUploadFormSubmit() {
    const userName = document.getElementById('userName').value;
    const repo = document.getElementById('repo').value;
    const branch = document.getElementById('branch').value;
    const token = document.getElementById('token').value;

    const jsonData = {
        "key": "github",
        "val": {
            userName: userName,
            repo: repo,
            branch: branch,
            token: token
        }
    };

    fetch('/api/set_github', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Response:', data);
            alert('保存成功');
            window.location.href = getHost(window.location.href);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('保存失败');
        });
}
function getHost(url) {
    return url.slice(0, url.indexOf('/', 8))
}
function handleViewButtonClick() {
    let a = ['userName', 'repo', 'branch', 'token']
    for (let i in a) {
        document.getElementById(a[i]).value = '';
    }
    const jsonData = {
        "key": "github",
        "val": {
            userName: '',
            repo: '',
            branch: '',
            token: ''
        }
    };

    fetch('/api/set_github', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Response:', data);
            alert('删除成功');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('删除失败');
        });
}
function getPath(url) {
    // 如果以`/`结尾, 去掉最后一个`/`
    const end = url.lastIndexOf('/') === url.length - 1 ? -1 : undefined
    // slice第二个参数传 undefined 会直接截到最后
    // indexOf第二个参数用来跳过前面的 "https://"
    return url.slice(url.indexOf('/', 8), end)
}
function get_Github(x) {
    const jsonData = {
        "key": "github"
    };

    fetch('/api/get_github', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (typeof data === 'object' && data !== null && Object.keys(data).length > 0 && data.val['userName'] != "" && data.val['repo'] != "") {
                // 执行相应逻辑

                if (x == '2') {
                    for (const key in data.val) {
                        if (data.val.hasOwnProperty(key)) {
                            document.getElementById(key).value = data.val[key];
                        }
                    }
                } else if (x == '1') {
                    window.userName = data.val['userName']
                    window.repo = data.val['repo']
                    window.branch = data.val['branch']
                    window.token = data.val['token']
                }
            } else {
                if (getPath(window.location.href) == '/html/config.html') {
                    return
                } else {
                    alert('数据为空，请点击确定前往配置页面');
                    window.location.href = '/html/config.html';
                    window.peizi = 1
                }


            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

async function get_Data() {
    var url = document.getElementById('userName').value || 'https://xs.com';
    var headers = document.getElementById('branch').value
    if (headers == '') {
        headers = '{ "user-agent": " Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"}'
    }
    headers = headers.replace(/'/g, '"')
    headers = JSON.parse(headers)
    const jsonData = {
        "url": url,
        'method': method,
        'headers': headers,
    };
    fetch('/query/host', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const textareaElement = document.getElementById('myTextarea');
            textareaElement.value = data.val;
            textareaElement.style.display = 'block';
            console.log('Response:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// 定义一个函数来使用 XPath 选择器
function xpathSelector(xpath) {
    // 使用 document.evaluate 方法进行 XPath 查询
    const result = document.evaluate(
        xpath, // XPath 表达式
        document, // 要搜索的上下文节点
        null, // 命名空间解析器（对于大多数情况可以传 null）
        XPathResult.FIRST_ORDERED_NODE_TYPE, // 返回结果类型
        null // 结果缓存（可以传 null）
    );

    // 获取查询结果
    return result.singleNodeValue; // 返回匹配的第一个节点
}

// 示例用法
// const xpath = "//div[@class='example']"; // XPath 表达式
// const element = xpathSelector(xpath);

// if (element) {
//     console.log('找到元素:', element);
// } else {
//     console.log('没有找到元素');
// }
function handleCheckboxClick(checkbox) {
    const checkboxes = document.querySelectorAll('.single-checkbox');

    checkboxes.forEach(cb => {
        if (cb !== checkbox) {
            cb.checked = false; // 取消其他复选框的选择
        } else {
            method = cb.value
            console.log(method)
        }
    });
}

/**
 * 比较两个版本号的大小
 * @param {string} version1 - 第一个版本号，格式为"数字.数字.数字"
 * @param {string} version2 - 第二个版本号，格式为"数字.数字.数字"
 * @returns {number} - 返回值为1表示version1大于version2，为-1表示version1小于version2，为0表示两个版本号相等
 */
function compareVersion(version1, version2) {
    const v1 = version1.split('.').map(Number);
    const v2 = version2.split('.').map(Number);
    for (let i = 0; i < 3; i++) {
        if (v1[i] > v2[i]) {
            return 1; // version1大于version2
        } else if (v1[i] < v2[i]) {
            return -1; // version1小于version2
        }
    }
    return 0;
}

function get_XBS_data(x) {
    if(x=='config'){
        set_config()
    }else{
        removeElement('.Seting') 
        removeElementById('#bookList','#main')
        let leibie = ''
        if (/^video/.test(x)) {
            leibie = 'video'
        } else if (/^text/.test(x)) {
            leibie = 'text'
        } else if (/^audio/.test(x)) {
            leibie = 'audio'
        } else {
            leibie = 'comic'
        }
        let url = `https://cdn.jsdelivr.net/gh/${userName}/${repo}@v0.0.1/xbs_source/${x}`
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // data=JSON.parse(data)
                let htmlString = `<li>
                    <div class="book-mid-info">
                        <div class="book-title">
                            <span class="book-name">源总数${Object.keys(data).length}</span>
                        </div>
                        
                    </div>
                </li>`
                for (const key in data) {
                    let name = key;
                    let url = data[key].sourceUrl
                    let download_url = `https://cdn.jsdelivr.net/gh/bgvioletsky/XBS_warehouse@v0.0.1/xbs_source/${leibie}/${encodeURIComponent(key)}.xbs`
                    //    console.log(key,data[key])
                    htmlString = htmlString + `
                <li>
                    <div class="book-mid-info">
                        <div class="book-title">
                            <span class="book-name">${name}</span>
                        </div>
                        <p><strong>源URL:</strong> <span class="source-url">${url}</span></p>
                        <p class="btn">
                            <a href="${download_url}">下载</a>
                        </p>
                    </div>
                </li>
            `;
                }
                const bookList = document.getElementById('bookList');
                
                // 插入HTML字符串
                htmlString = `<ul class="book-list">${htmlString}</ul>`
                bookList.innerHTML = '';
                bookList.insertAdjacentHTML('beforeend', htmlString);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
   
}


function get_version() {
    fetch('/api/get_version', {
        method: 'POST',
    })
        .then(response => response.json())
        .then(data => {
            // data=JSON.parse(data)
            let update = data.update
            let version = data.version
            let env = data.env
            if (update) {
                alert('当前版本较低，请更新到最新版')
                if (env == 'Stash') {
                    window.location.href = `stash://install-override?url=https://raw.githubusercontent.com/bgvioletsky/XS_Resource/refs/heads/main/conf/xs.stash.stoverride`
                } else if (env == 'Shadowrocket') {
                    window.location.href = `shadowrocket://install?module=https://raw.githubusercontent.com/bgvioletsky/XS_Resource/refs/heads/main/conf/xs.surge.sgmodule`
                } else if (env == 'Loon') {
                    window.location.href = `loon://import?plugin=https://raw.githubusercontent.com/bgvioletsky/XS_Resource/refs/heads/main/conf/xs.plugin`
                } else if (env == 'Surge') {
                    window.location.href = `surge:///install-module?url=https://raw.githubusercontent.com/bgvioletsky/XS_Resource/refs/heads/main/conf/xs.surge.sgmodule`
                } else if (env == 'Quantumult X') {
                    window.location.href = `quantumult-x:///add-resource?remote-resource={"rewrite_remote":["https://raw.githubusercontent.com/bgvioletsky/XS_Resource/refs/heads/main/conf/xs.conf,tag=xs"]}`
                }

            }

        })
}

function removeElement(selector) {
    var elementToRemove = document.querySelector(selector);

    if (elementToRemove) {
        elementToRemove.remove();
    }
}
function removeElementById(parent,element) {
    var parent = document.querySelector(parent);
    var elementToRemove = document.querySelector(element);

    if (parent && elementToRemove) {
        parent.removeChild(elementToRemove);
    }
}
function set_config() {
    removeElementById('#bookList','#main')
    let headerHtml = `
        <div id="Seting" class="Seting">
        <div id="box_container" class="box_container"">
            <div>
                <h1>github 配置</h1>
            </div>
            <form id=" uploadForm" action="/api/set_github" method="post">
            <div class="item">
                <label><b>用户名</b></label>
                <input type="text" id="userName" name="userName" placeholder="用户名" required autocomplete="of">
            </div>
            <div class="item">
                <label><b>仓库名</b></label>
                <input type="text" id="repo" name="repo"  placeholder="仓库名" required autocomplete="of">
            </div>
            <div class="item">
                <label><b>分支</b></label>
                <input type="text" id="branch" name="branch" placeholder="分支" required autocomplete="of">
            </div>
            <div class="item">
                <label><b>token</b></label>
                <input type="password" id="token" name="token" placeholder="token" required autocomplete="of">
            </div>
            <div class="button">
                <button type="button" id="saveButton" class="bg_mv" onclick="handleUploadFormSubmit()">保存</button>
                <button type="button" id="viewButton" class="bg_mv" onclick="handleViewButtonClick()">清空</button>
            </div>
            <div >如不知如何配置请访问我的<a href="https://github.com/bgvioletsky/XS_Resource" style="background-color: antiquewhite;border-radius: 23px;border: 1px ;padding: 0 12px;">仓库</a></div>
            </div>
            </form>
        </div>

    </div>
    `;
    const bodyElement = document.querySelector('body');
    if (!document.getElementById("Seting")) {
        bodyElement.insertAdjacentHTML('beforeend', headerHtml);
    }
    get_Github('2')
}

function handleheaderClick() {
    let btns = document.querySelectorAll('.nav-item');

    btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            btns.forEach(otherBtn => {
                    if (otherBtn !== btn) {
                        otherBtn.style.backgroundColor = ''; // 恢复原始背景颜色
                    }
                });
           
                btn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
               
            
        });
    });
   
}