let method = 'GET'

function handleUploadFormSubmit(event) {
    event.preventDefault();

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

function handleViewButtonClick(event) {
    event.preventDefault();
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

function get_Github() {
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
            for (const key in data.a) {
                if (data.a.hasOwnProperty(key)) {
                    document.getElementById(key).value = data.a[key];
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