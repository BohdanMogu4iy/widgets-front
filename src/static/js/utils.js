export function createEl(el, attrs, text = '') {
    let newTag = document.createElement(el)
    if (attrs) {
        for (let key in attrs) {
            newTag.setAttribute(key, attrs[key])
        }
    }
    if (text) newTag.innerHTML = text
    return newTag
}

export function roundTo30(time){
    return Math.trunc(time / 30) * 30
}

export function positionToTime(position, wrapperHeight){
    return  Math.round((position - 12) * 48 / wrapperHeight) * 30
}

export function timeToPosition(time, wrapperHeight){
    return (time / 30) * wrapperHeight / 48 + 12
}

export function dateToValueString(date){
    return  date.toLocaleDateString().split('.').reverse().join('-') + 'T' + date.toLocaleTimeString().slice(0,5)
}

export function dateToTime(date){
    if (typeof date != "object"){
        date = new Date(date)
    }
    return date.getHours()* 60 + date.getMinutes()
}

export function coordsToTime(num){
    return  `${Math.trunc(num / 60)}:${num % 60}`
}