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
        })
        .catch(error => {
            console.error('Error:', error);
            alert('保存失败');
        });
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
            if(x=='2'){
                for (const key in data.val) {
                    if (data.val.hasOwnProperty(key)) {
                        document.getElementById(key).value = data.val[key];
                    }
                }
            }else if (x=='1') {
                window.userName = data.val['userName']||'bgvioletsky'
                window.repo = data.val['repo']||'XBS_warehouse'
                window.branch = data.val['branch']
                window.token = data.val['token']
            } 
            
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

async function get_Data() {
    var url = document.getElementById('userName').value || 'https://xs.com';
    var headers = document.getElementById('branch').value
    if (headers==''){
        headers='{ "user-agent": " Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"}'
    }
    headers=headers.replace(/'/g,'"')
    headers=JSON.parse(headers)
    const jsonData = {
        "url": url,
        'method': method,
        'headers':  headers,
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
    let leibie=''
    if(/^video/.test(x)){
        leibie='video'
    }else if(/^text/.test(x)){
        leibie='text'
    }else if(/^audio/.test(x)){
        leibie='audio'
    }else{
        leibie='comic'
    }
    let url=`https://cdn.jsdelivr.net/gh/${userName}/${repo}@v0.0.1/xbs_source/${x}`
   

    const jsonData = {
        "url": url,
    };
    fetch('/api/get_XBS_data', {
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
        data=JSON.parse(data)
        let htmlString=`<li>
                <div class="book-mid-info">
                    <div class="book-title">
                        <span class="book-name">源总数${Object.keys(data).length}</span>
                    </div>
                    
                </div>
            </li>`
        for (const key in data) {
            let name=key;
            let url=data[key].sourceUrl
            let download_url=`https://cdn.jsdelivr.net/gh/bgvioletsky/XBS_warehouse@v0.0.1/xbs_source/${leibie}/${encodeURIComponent(key)}.xbs`
               console.log(key,data[key])
               htmlString = htmlString+`
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
        htmlString=`<ul class="book-list">${htmlString}</ul>`
        bookList.innerHTML = '';
        bookList.insertAdjacentHTML('beforeend', htmlString);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

