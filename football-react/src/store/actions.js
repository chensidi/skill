export function changeActive(num){
    return {
        type: 'changeActive',
        num: num
    }
}

export function changeMp3(url){
    return {
        type: 'changeMp3',
        mp3: url
    }
}

export function changePic(pic){
    return {
        type: 'changePic',
        pic: pic
    }
}

