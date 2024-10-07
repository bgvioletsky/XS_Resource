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
                    // console.log(`${key}: ${data.a[key]}`);
                    document.getElementById(key).value = data.a[key];
                }
            }
            // let  userName=data.a['userName']
            // let  repo=data.a['repo']
            // let  branch= data.a['branch']
            // let  token= data.a['token']
            // console.log('Response:', userName);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
function handlessButtonClick(event){
    event.preventDefault();

    const jsonData = {
        "url": "http://cj.lziapi.com/api.php/provide/vod/?ac=videolist&wd=狂飙",
        'method': "get"
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
            console.log('Response:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}