const xxTeaKey = [
    0xe5, 0x87, 0xbc, 0xe8, 0xa4, 0x86, 0xe6, 0xbb, 0xbf, 0xe9, 0x87, 0x91, 0xe6,
    0xba, 0xa1, 0xe5,
];

const delta = 0x9e3779b9;

const xxteaTools = {
    decrypt(data, key, padding, rounds) {
        const dLen = data.length;
        const kLen = key.length;
        let aLen, rc;
        if (kLen !== 16) {
            throw new Error("need a 16-byte key");
        }
        if (!padding && (dLen < 8 || (dLen & 3) !== 0)) {
            throw new Error(
                "data length must be a multiple of 4 bytes and must not be less than 8 bytes"
            );
        }
        if ((dLen & 3) !== 0 || dLen < 8) {
            throw new Error(
                "invalid data, data length is not a multiple of 4, or less than 8"
            );
        }
        aLen = dLen / 4;
        const d = byteTools.bytesToUint32(data, dLen, aLen, false);
        const k = byteTools.bytesToUint32(key, kLen, 4, false);
        this.btea(d, -aLen, k, rounds);
        const refBuf = byteTools.uint32sToBytes(d, aLen, padding);
        rc = refBuf.length;
        if (padding) {
            if (rc >= 0) {
                return refBuf.subarray(0, rc);
            } else {
                throw new Error(
                    "invalid data, illegal PKCS#7 padding. Could be using a wrong key"
                );
            }
        }
        return refBuf;
    },
    encrypt(data, key, padding, rounds) {
        const dLen = data.length;
        const kLen = key.length;
        let paddingValue = 0;

        if (padding) {
            paddingValue = 1;
        }

        if (kLen !== 16) {
            throw new Error("need a 16-byte key");
        }

        if (!padding && (dLen < 8 || (dLen & 3) !== 0)) {
            throw new Error(
                "data length must be a multiple of 4 bytes and must not be less than 8 bytes"
            );
        }

        let aLen;
        if (dLen < 4) {
            aLen = 2;
        } else {
            aLen = (dLen >> 2) + paddingValue;
        }

        const d = byteTools.bytesToUint32(data, dLen, aLen, padding);
        const k = byteTools.bytesToUint32(key, kLen, 4, false);

        return byteTools.uint32sToBytes(this.btea(d, aLen, k, rounds), aLen, false);
    },
    btea(v, n, key, rounds) {
        let i,
            y,
            z,
            p,
            e,
            sum = 0;

        if (n > 1) {
            const un = n >>> 0;
            if (rounds === 0) {
                rounds = Math.floor(6 + 52 / un);
            }
            z = v[un - 1];

            for (i = 0; i < rounds; i++) {
                sum += delta;
                e = (sum >>> 2) & 3;
                for (p = 0; p < un - 1; p++) {
                    y = v[p + 1];
                    const mm = this.mx(y, z, p, e, sum, key);
                    v[p] += mm;
                    z = v[p];
                }

                y = v[0];
                const mn = this.mx(y, z, p, e, sum, key);
                v[un - 1] += mn;
                z = v[un - 1];
            }
        } else if (n < -1) {
            const un = -n >>> 0;
            if (rounds === 0) {
                rounds = Math.floor(6 + 52 / un);
            }

            sum = rounds * delta;
            y = v[0];

            for (i = 0; i < rounds; i++) {
                e = (sum >>> 2) & 3;
                for (p = un - 1; p > 0; p--) {
                    z = v[p - 1];
                    v[p] -= this.mx(y, z, p, e, sum, key);
                    y = v[p];
                }

                z = v[un - 1];
                v[0] -= this.mx(y, z, p, e, sum, key);
                y = v[0];
                sum -= delta;
            }
        }
        return v;
    },
    mx(y, z, p, e, sum, key) {
        return (
            (((z >>> 5) ^ (y << 2)) + ((y >>> 3) ^ (z << 4))) ^
            ((sum ^ y) + (key[(p & 3) ^ e] ^ z))
        );
    },
};

const byteTools = {
    bytesToUint32(data, inLen, outLen, padding) {
        const out = new Array(outLen);
        for (let i = 0; i < inLen; i++) {
            out[i >>> 2] = (out[i >>> 2] || 0) | ((data[i] & 0xff) << ((i & 3) << 3));
        }

        if (padding) {
            let pad = 4 - (inLen & 3);
            if (inLen < 4) {
                pad += 4;
            }

            for (let i = inLen; i < inLen + pad; i++) {
                out[i >>> 2] = out[i >>> 2] | (pad << ((i & 3) << 3));
            }
        }

        return Uint32Array.from(out);
    },
    uint32sToBytes(inArr, inLen, padding) {
        inLen = inLen || inArr.length;
        const out = new Array(inLen * 4);

        for (let i = 0; i < inLen; i++) {
            const idx = i * 4;
            out[idx] = inArr[i] & 0xff;
            out[idx + 1] = (inArr[i] >>> 8) & 0xff;
            out[idx + 2] = (inArr[i] >>> 16) & 0xff;
            out[idx + 3] = (inArr[i] >>> 24) & 0xff;
        }

        let outLen = inLen * 4;

        if (padding) {
            const pad = out[outLen - 1];
            outLen -= pad;

            if (pad < 1 || pad > 8) {
                return -1;
            }

            if (outLen < 0) {
                return -2;
            }

            for (let i = outLen; i < inLen * 4; i++) {
                if (out[i] !== pad) {
                    return -3;
                }
            }
        }

        return Uint8Array.from(out.slice(0, outLen));
    },
    jsonObjToUint8Array(obj) {
        // 关闭斜杠的转义
        const jsonString = JSON.stringify(obj, null).replace(/\//g, "\\/");
        const encoder = new TextEncoder();
        return encoder.encode(jsonString);
    },
    uint8Array2JsonObj(uint8Array) {
        const decoder = new TextDecoder("utf-8");
        const jsonString = decoder.decode(uint8Array);
        return JSON.parse(jsonString);
    },
};

const xbsTools = {
    XBS2Json(buffer) {
        try {
            let out = xxteaTools.decrypt(buffer, xxTeaKey, false, 0);
            let n = buffer.length;
            n = n - 4;
            let m = new DataView(out.buffer, n, 4).getUint32(0, true);
            if (m < n - 3 || m > n) {
                throw new Error("decode error");
            }
            n = m;
            return new Uint8Array(out.buffer, 0, n);
        } catch (error) {
            throw new Error(error);
        }
    },
    Json2XBS(buffer) {
        const buffer_len = buffer.length;
        let n = 0;
        let buffer_enc_len = new Uint8Array();

        if (buffer_len % 4 === 0) {
            n = buffer_len >> 2;
        } else {
            n = (buffer_len >> 2) + 1;
        }

        for (let i = buffer_len; i < n << 2; i++) {
            buffer_enc_len = new Uint8Array([...buffer_enc_len, 0x0]);
        }

        buffer_enc_len = new Uint8Array([
            ...buffer_enc_len,
            ...new Uint8Array(new Uint32Array([buffer_len]).buffer),
        ]);

        buffer = new Uint8Array([...buffer, ...buffer_enc_len]);
        return xxteaTools.encrypt(buffer, xxTeaKey, false, 0);
    },
};

const timeTools = {
    // 将本地时间转换成 unix时间戳并保留后6位
    localTimeToUnixWithSixDecimal(localTime) {
        const unixTime = Math.floor(localTime.getTime() / 1000);
        const unixTimeStr = unixTime.toString();
        const decimalPart = ((localTime.getTime() % 1000) / 1000)
            .toFixed(6)
            .substr(2);
        return `${unixTimeStr}.${decimalPart}`;
    },
    // 解析 unix 时间戳
    UnixWithSixDecimalToLocalTime(unixTimeStr) {
        const date = new Date(unixTimeStr * 1000); // 将时间戳乘以1000转换为毫秒
        // 转换为本地日期和时间格式
        return date.toLocaleString();
    },
};

const Change = {
    show() {
        const xbsFileInput = document.getElementById("xbsFile");
        const file = xbsFileInput.files[0];

        if (!file) {
            alert("请选择一个XBS格式文件");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            try {
                const json = xbsTools.XBS2Json(data);
                let jsondata = byteTools.uint8Array2JsonObj(json)
                const outputDiv = document.getElementById("output");
                if (!outputDiv) {
                    console.error("Element with ID 'output' not found.");
                    return;
                }
                while (outputDiv.firstChild) {
                    outputDiv.removeChild(outputDiv.firstChild);
                }
                for (const key in jsondata) {
                    let info = jsondata[key].password
                    // 检查 password 是否存在且不为空
                    if (info === undefined || info === null || info === "") {
                        info = "无密码";
                    }
                    const p = document.createElement("div");
                    p.addEventListener('click', () => {
                        const textarea = document.createElement('textarea');
                        textarea.value = info;
                        if (info !== "无密码") {
                            document.body.appendChild(textarea);
                            textarea.select();

                            try {
                                const successful = document.execCommand('copy');
                                if (successful) {
                                    alert('密码：' + info + '\n已经复制到剪贴板');
                                } else {
                                    alert('复制到剪贴板失败');
                                }
                            } catch (err) {
                                alert('复制到剪贴板失败');
                                console.error('复制到剪贴板失败: ', err);
                            }

                            document.body.removeChild(textarea);
                        } else {
                            alert(info);
                        }

                    });
                    p.textContent = `${key}`;
                    outputDiv.appendChild(p);
                }




            } catch (error) {
                console.error("转换错误 XBS to JSON:", error);
                alert("转换错误 XBS to JSON");
            }
        };
        reader.readAsArrayBuffer(file);
    },
    convertJsonToXbs() {
        const jsonFileInput = document.getElementById("jsonFile");
        const file = jsonFileInput.files[0];

        if (!file) {
            alert("Please select a JSON file");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);

            try {
                const xbs = xbsTools.Json2XBS(data);
                const xbsBlob = new Blob([xbs], {
                    type: "application/octet-stream"
                });
                const downloadLink = document.createElement("a");
                // 保留原文件名，仅更改扩展名为 .xbs
                downloadLink.href = URL.createObjectURL(xbsBlob);
                downloadLink.download = `${file.name.replace(/\.json$/, '')}.xbs`;
                downloadLink.click();
            } catch (error) {
                console.error("转换错误 JSON to XBS:", error);
                alert("转换错误 JSON to XBS");
            }
        };
        reader.readAsArrayBuffer(file);
    },
    convertXbsToJson() {
        const xbsFileInput = document.getElementById("xbsFile");
        const file = xbsFileInput.files[0];

        if (!file) {
            alert("Please select an XBS file");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            try {
                const json = xbsTools.XBS2Json(data);
                const jsonBlob = new Blob([json], {
                    type: "application/json"
                });
                const downloadLink = document.createElement("a");
                downloadLink.download = `${file.name.replace(/\.xbs$/, '')}.json`;
                downloadLink.href = URL.createObjectURL(jsonBlob);
                downloadLink.click();

            } catch (error) {
                console.error("转换错误 XBS to JSON:", error);
                alert("转换错误 XBS to JSON");
            }
        };
        reader.readAsArrayBuffer(file);
    },
    convertFileBasedOnExtension() {
        const fileInput = document.getElementById('xbsFile');
        const file = fileInput.files[0];

        if (!file) {
            alert("Please select a file");
            return;
        }

        if (!window.FileReader || !window.Blob || !window.URL || !URL.createObjectURL) {
            alert("Your browser does not support the required features.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            alert(e.target.result)
            const extension = file.name.split('.').pop().toLowerCase();

            try {
                let blob, downloadLink, fileName;

                if (extension === 'json') {
                    const xbs = xbsTools.Json2XBS(data);
                    blob = new Blob([xbs], { type: "application/octet-stream" });
                    fileName = file.name.replace(/\.json$/, '') + '.xbs';
                } else if (extension === 'xbs') {
                    const json = xbsTools.XBS2Json(data);
                    blob = new Blob([json], { type: "application/json" });
                    fileName = file.name.replace(/\.xbs$/, '') + '.json';
                } else {
                    throw new Error('Unsupported file format');
                }

                downloadLink = document.createElement("a");
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = fileName;

                // Append link to the body for compatibility with some browsers
                document.body.appendChild(downloadLink);

                // Trigger a click on the link
                downloadLink.click();

                // Clean up
                document.body.removeChild(downloadLink);
                URL.revokeObjectURL(downloadLink.href);

            } catch (error) {
                console.error(`Conversion error:`, error);
                alert(`Conversion error: ${error.message}`);
            }
        };

        reader.onerror = function (error) {
            console.error(`File read error:`, error);
            alert(`File read error: ${error.message}`);
        };

        reader.readAsArrayBuffer(file);





    },
    fenge() {
        const jsonFileInput = document.getElementById("xbsFile");
        const file = jsonFileInput.files[0];

        if (!file) {
            alert("Please select a JSON file");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            try {
                const json = xbsTools.XBS2Json(data);
                let jsondata = byteTools.uint8Array2JsonObj(json);

                // 确保 jsondata 是一个对象
                if (typeof jsondata !== 'object' || jsondata === null) {
                    console.error("JSON 数据格式不正确");
                    return;
                }

                Object.keys(jsondata).forEach(key => {
                    setTimeout(() => {
                        try {
                            // 构建新的 JSON 对象
                            const dd = {};
                            dd[key] = jsondata[key];
                            let info=jsondata[key];
                            if(info['sourceType']==='comic'){
                                const jsonString = JSON.stringify(dd);
                                const blob = new Blob([jsonString], { type: 'application/json' });
    
                                // 创建并配置 FileReader 对象
                                const reader = new FileReader();
                                reader.onload = function (e) {
                                    const arrayBuffer = e.target.result;
                                    const data = new Uint8Array(arrayBuffer);
                                    const xbs = xbsTools.Json2XBS(data);
                                    console.log(`${key} 转换为 XBS 结束`);
                                    // 创建 XBS Blob 并下载文件
                                    const xbsBlob = new Blob([xbs], {
                                        type: "application/octet-stream"
                                    });
                                    const downloadLink = document.createElement("a");
                                    downloadLink.href = URL.createObjectURL(xbsBlob);
                                    downloadLink.download = `${key}.xbs`;
                                    downloadLink.click();
    
                                    // 清理 URL 对象
                                    URL.revokeObjectURL(downloadLink.href);
                                };
    
                                // 开始读取 Blob 数据
                                reader.readAsArrayBuffer(blob);
                            }
                           
                        } catch (error) {
                            console.error(`转换错误 JSON to XBS (${key}):`, error);
                        }
                    }, 1000 * Object.keys(jsondata).indexOf(key)); // 每个 JSON 对象之间延迟 3 秒
                });
            } catch (error) {
                console.error("转换错误 JSON to XBS:", error);
            }
        };
        reader.readAsArrayBuffer(file);
    },
    clean() {
        const xbsFileInput = document.getElementById("xbsFile");
        const file = xbsFileInput.files[0];

        if (!file) {
            alert("请选择一个XBS格式文件");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            try {
                const json = xbsTools.XBS2Json(data);
                let jsondata = byteTools.uint8Array2JsonObj(json)
                for (const key in jsondata) {
                    let info = jsondata[key]
                    delete info["password"]
                }
                const jsonString = JSON.stringify(jsondata);
                const blob = new Blob([jsonString], { type: 'application/json' });
                // 创建并配置 FileReader 对象
                const reader = new FileReader();
                reader.onload = function (e) {
                    const arrayBuffer = e.target.result;
                    const data = new Uint8Array(arrayBuffer);
                    const xbs = xbsTools.Json2XBS(data);
                    console.log(`转换为 XBS 结束`);
                    // 创建 XBS Blob 并下载文件
                    const xbsBlob = new Blob([xbs], {
                        type: "application/octet-stream"
                    });
                    const downloadLink = document.createElement("a");
                    downloadLink.href = URL.createObjectURL(xbsBlob);
                    downloadLink.download = `${file.name}`;
                    downloadLink.click();

                    // 清理 URL 对象
                    URL.revokeObjectURL(downloadLink.href);
                };

                // 开始读取 Blob 数据
                reader.readAsArrayBuffer(blob);



            } catch (error) {
                console.error("转换错误 XBS to JSON:", error);
                alert("转换错误 XBS to JSON");
            }
        };
        reader.readAsArrayBuffer(file);
    },
    addMima() {
        alert("添加成功")
    }
};