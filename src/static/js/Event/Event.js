import {coordsToTime, createEl} from "@js/utils";

class event{

    //очередной конструктор)))
    constructor({id, startTime, duration, title, color, repeat, repeatCount} = {}) {
        this.eventId = id
        this.startTime = startTime
        this.duration = duration
        this.title = title
        this.color = color
        this.repeat = repeat
        this.repeatCount = repeatCount
    }

    createEvent(...args){
        this.eventWrap = createEl('div', {'class': 'day-event', 'role': 'button', 'style': `background-color: ${this.color}`, 'data-event-id' : `${this.eventId}`})
        this.eventWrap.append(createEl('div', {'class': 'event-info time'}, coordsToTime(this.startTime) + ' - ' + coordsToTime(this.startTime + this.duration)))
        this.eventWrap.append(createEl('div', {'class': 'event-info name'}, this.title))

        this.setSizeAndPos(...args)
    }

    setSizeAndPos({width, top, left, height, zIndex} ={}){
        if (width){
            this.eventWrap.style.width = `${width}px`
        }
        if (top && left){
            this.eventWrap.style.top = `${top}px`
            this.eventWrap.style.left = `${left}px`
        }
        if (height){
            this.eventWrap.style.height =  `${height}px`
        }
        if (zIndex){
            this.eventWrap.style.zIndex = zIndex
        }
    }

    setParams({startTime, duration, title, color, repeat, repeatCount} = {}){
        for (let key in arguments[0]){
            this[key] = arguments[0][key]
        }
    }
}

export default event