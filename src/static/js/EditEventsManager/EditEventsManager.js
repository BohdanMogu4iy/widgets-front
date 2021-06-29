import eventsManager from "@js/EventsManager/EventsManager";
import {pushEvent} from "@js/requests";
import {dateToTime} from "@js/utils";

class editEventsManager extends eventsManager{

    type = 'saved'

    constructor(event, ...args) {
        super(...args)
        this.event = event
        this.title = this.event.title
        this.starts = this.event.startTime
        this.ends = this.starts + this.event.duration
        this.color = this.event.color
        this.repeat = this.event.repeat
        this.repeatCount = this.event.repeatCount
    }

    setEvent(){
        this.event.setParams({
            startTime: dateToTime(this.eventStartsInput.value),
            duration: dateToTime(this.eventEndsInput.value) - dateToTime(this.eventStartsInput.value),
            title: this.eventTitleInput.value,
            color: this.eventColorInput.value,
            repeat: this.eventRepeatInput.value,
            repeatCount: this.eventRepeatCountInput.value
        })

        pushEvent(this.event)
    }
}

export default editEventsManager