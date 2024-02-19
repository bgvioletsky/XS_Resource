# !/bin/bash
# 从 a.json 文件中读取 JSON 数据


xbs xbs2json -i $1 -o ALL/mulShare.json
cat ./ALL/mulShare.json | jq -c 'to_entries | map(select(.key | test("🔞") | not)) | from_entries' > bgcode.json
cat ./ALL/mulShare.json | jq -c 'to_entries | map(select(.key | test("🔞"))) | from_entries' > bgcode🔞.json

cat bgcode.json | jq . > sa.json
cat bgcode🔞.json | jq . > ba.json
use(){
   if [ "$1" = "sa.json" ]; then
      bg=$(cat $1 | jq -r 'keys[]')
      for val in $bg
         do
            k=$(cat $1 | jq -r .\"$val\".sourceType)
            if [ "$k" = "video" ]; then
               cat $1 | jq --arg val "$val" '.[$val]' | jq --arg val "$val" '{ ($val): .}' > video.json
               xbs json2xbs -i video.json -o MovieSources/$val.xbs
            elif [ "$k" = "text" ]; then
                  cat $1 | jq --arg val "$val" '.[$val]' | jq --arg val "$val" '{ ($val): .}' > text.json
                   xbs json2xbs -i text.json -o  StorySources/$val.xbs
            elif [ "$k" = "audio" ]; then
                  cat $1 | jq --arg val "$val" '.[$val]' | jq --arg val "$val" '{ ($val): .}' > audio.json
                    xbs json2xbs -i audio.json -o ListenSources/$val.xbs
            elif [ "$k" = "comic" ]; then
                  cat $1 | jq --arg val "$val" '.[$val]' | jq --arg val "$val" '{ ($val): .}' > comic.json
                    xbs json2xbs -i comic.json -o ComicSources/$val.xbs
            fi
            echo $val
         done
   else
      bg=$(cat $1 | jq -r 'keys[]')
      for val in $bg
         do
            k=$(cat $1 | jq -r .\"$val\".sourceType)
            if [ "$k" = "video" ]; then
                cat $1 | jq --arg val "$val" '.[$val]' | jq --arg val "$val" '{ ($val): .}' > video🔞.json
                xbs json2xbs -i video🔞.json -o 18+/MovieSources/$val.xbs
            elif [ "$k" = "text" ]; then
                cat $1 | jq --arg val "$val" '.[$val]' | jq --arg val "$val" '{ ($val): .}' > text🔞.json
                xbs json2xbs -i text🔞.json -o 18+/StorySources/$val.xbs
            elif [ "$k" = "audio" ]; then
                cat $1 | jq --arg val "$val" '.[$val]' | jq --arg val "$val" '{ ($val): .}' > audio🔞.json
                xbs json2xbs -i audio🔞.json -o 18+/ListenSources/$val.xbs
            elif [ "$k" = "comic" ]; then
                cat $1 | jq --arg val "$val" '.[$val]' | jq --arg val "$val" '{ ($val): .}' > comic🔞.json
                xbs json2xbs -i comic🔞.json -o 18+/ComicSources/$val.xbs
            fi
            echo $val
         done
   fi
}


use sa.json
use ba.json
rm -f ./sa.json bgcode.json   bgcode🔞.json  ba.json video.json video🔞.json
rm -f ./ALL/mulShare.json
