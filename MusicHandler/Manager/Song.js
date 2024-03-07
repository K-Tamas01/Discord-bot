const play_yt = require('play-dl')

class Song{

    async play(content){
        const limit = content.startsWith('https') ? 1 : 20
        const searchInfo = await play_yt.search(content, {source: { youtube: "video"}, limit: limit })
        return searchInfo.length > 1 ? this.greatestFit(searchInfo, content) : searchInfo
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