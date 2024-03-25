const play_yt = require('play-dl')

class Song{
    constructor(){
        this.searchInfo = [{
            url: undefined,
            type: undefined,
            title: undefined,
            duration: undefined
        }]
    }

    async play(content){
        if(content.startsWith('https')){
            const data = await play_yt.video_basic_info(content)
            this.searchInfo[0] = {
                url: data.video_details.url,
                type: data.video_details.type,
                title: data.video_details.title,
                duration: data.video_details.durationRaw
            }
        } else {
            const searchResult = await play_yt.search(content, {source: { youtube: "video"}, limit: 20 })
            const result = this.greatestFit(searchResult, content)
            this.searchInfo[0] = {
                url: result[0].url,
                type: result[0].type,
                title: result[0].title,
                duration: result[0].durationRaw
            }
        }

        return this.searchInfo
    }

    greatestFit(searchResult, content){
        let bestMatching = 0
        let bestFittingIndex = -1
        let index = 0
        for(let element of searchResult){
            let length = 0
            for(let i = 0; i < Math.min(element.title.length, content.length); i++){
                if(element.title.includes(content.substring(0, i + 1))){
                    length += 1 
                }
            }
            if(length > bestMatching){
                bestMatching = length
                bestFittingIndex = index
            }
            index++
        }

        return [searchResult[bestFittingIndex]]
    }
}

module.exports = Song