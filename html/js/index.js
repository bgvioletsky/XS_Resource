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
    let a=['userName','repo','branch','token']
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