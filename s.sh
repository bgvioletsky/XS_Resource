###
 # @Author: bgcode
 # @Date: 2024-10-12 02:51:04
 # @LastEditTime: 2024-10-12 02:51:07
 # @LastEditors: bgcode
 # @Description: 描述#!/bin/bash

# 定义要替换的旧版本号和新版本号
OLD_VERSION="0.0.17"
NEW_VERSION="0.0.18"

# 遍历仓库下的所有文件
find . -type f -name '*.js' -o -name '*.html' -o -name 'xs.*' -o -name '*.json'| while read file; do
  # 使用 sed 命令替换文件中的版本号
  sed -i '' "s/$OLD_VERSION/$NEW_VERSION/g" "$file"
done

echo "所有文件中的 $OLD_VERSION 已经替换为 $NEW_VERSION"
 # @FilePath: /XS_Resource/s.sh
 # 本项目采用GPL 许可证，欢迎任何人使用、修改和分发。
### 
