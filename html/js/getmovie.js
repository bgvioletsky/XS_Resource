/*
 * @Author: bgcode
 * @Date: 2024-10-28 19:15:08
 * @LastEditTime: 2024-10-29 12:02:05
 * @LastEditors: bgcode
 * @Description: 描述
 * @FilePath: /XS_Resource/html/js/getmovie.js
 * 本项目采用GPL 许可证，欢迎任何人使用、修改和分发。
 */
async function get_Data() {
    var keyword = document.getElementById('searchInput').value;
    var pageIndex = document.getElementById('searchpage').value
    url=`http://pzoap.moedot.net/xgapp.php/v2/search?pg=${pageIndex}&text=${encodeURIComponent(keyword)}`
    const jsonData = {
        "url": url,
        "method":"GET"
    };
    fetch('https://xs.com/query/host', {
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
            data=JSON.parse(data.val).data
            let htmlString = ''
            for (const key in data) {
                htmlString+=` <div class="container">
            <h1>${data[key]['vod_name']}</h1>
            <img class="vod-image" src="${data[key]['vod_pic']}" alt="无神世界的神明活动">
            <div class="vod-details">
                <div class="vod-detail"><a onclick="get_movie(${data[key]['vod_id']})"><strong>下载</strong></a></div>
                <div class="vod-detail"><strong>评分:</strong> ${data[key]['vod_score']}</div>
                <div class="vod-detail"><strong>地区:</strong> ${data[key]['vod_area']}</div>
                <div class="vod-detail"><strong>年份:</strong> ${data[key]['vod_year']}</div>
                <div class="vod-detail"><strong>演员:</strong> ${data[key]['vod_actor']}</div>
                <div class="vod-detail"><strong>导演:</strong> ${data[key]['vod_director']}</div>
                <div class="vod-detail"><strong>类型:</strong> ${data[key]['vod_class']}</div>
                <div class="vod-detail"><strong>添加时间:</strong> ${data[key]['vod_remarks']}</div>
            </div>
        </div>`
                
        
            }
        
        const bookList = document.getElementById('results');
                
                // 插入HTML字符串
              
                bookList.innerHTML = '';
                bookList.insertAdjacentHTML('beforeend', htmlString);
            console.log('Response:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

async function get_movie(id) {
    url=`http://pzoap.moedot.net/xgapp.php/v2/video_detail?id=${id}`
    const jsonData = {
        "url": url,
        "method":"GET"
    };
    fetch('https://xs.com/query/host', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        data=JSON.parse(data.val).data.vod_info
        let vedios=data.vod_url_with_player
        let fileContent="#EXTM3U"
        for (const key in vedios) {
           url= vedios[key].url.split('#')
           
        for (const key in url) {
            let   kk=url[key].split('\$')
            fileContent+=`\n#EXTINF:-1 tvg-name="${data.vod_name}" tvg-logo="${data.vod_pic}" group-title="动漫",${kk[0]}\n${kk[1]}`
            }
            console.log(fileContent)    
            const blob = new Blob([fileContent], { type: 'text/plain' });
            const url22 = URL.createObjectURL(blob);

            // 创建下载链接
            const a = document.createElement('a');
            a.href = url22;
            a.download = `${data.vod_name}.m3u`; // 设置下载文件名

            // 触发下载
            document.body.appendChild(a); // 将链接添加到DOM
            a.click(); // 触发点击事件
            document.body.removeChild(a); // 下载后移除链接

            // 释放对象URL
            URL.revokeObjectURL(url22);
        }
    })
}