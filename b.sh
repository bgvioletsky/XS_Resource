#!/bin/bash

process_json() {
    local input_file="$1"
    local output_dir="MovieSources"
    local prefix=""

    if [[ "$input_file" == "ba.json" ]]; then
        output_dir="18+/MovieSources"
        prefix="🔞"
    fi

    keys=$(jq -r 'keys[]' "$input_file")
    for val in $keys; do
        k=$(jq -r .\"$val\".sourceType "$input_file")
        output_file="${k}${prefix}.json"
        jq --arg val "$val" '.[$val]' "$input_file" | jq --arg val "$val" '{ ($val): .}' > "$output_file"
        ./xbs json2xbs -i "$output_file" -o "$output_dir/$val.xbs"
        echo "$val"
    done
}

# 从 a.json 文件中读取 JSON 数据
./xbs xbs2json -i $1 -o ALL/mulShare.json
cat ./ALL/mulShare.json | jq -c 'to_entries | map(select(.key | test("🔞") | not)) | from_entries' > bgcode.json
cat ./ALL/mulShare.json | jq -c 'to_entries | map(select(.key | test("🔞"))) | from_entries' > bgcode🔞.json

cat bgcode.json | jq . > sa.json
cat bgcode🔞.json | jq . > ba.json

process_json "sa.json"
process_json "ba.json"

# 删除文件时无需额外的检查
rm -f sa.json bgcode.json bgcode🔞.json ba.json video.json video🔞.json ALL/mulShare.json audio.json audio🔞.json comic.json comic🔞.json  text.json text🔞.json 
