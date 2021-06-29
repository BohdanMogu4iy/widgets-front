import eventsManager from "@js/EventsManager/EventsManager"
import event from "@js/Event/Event"
import {dateToTime, positionToTime} from "@js/utils";
import {putEvent} from "@js/requests";

class newEventsManager extends eventsManager{
    title = 'New Event'
    starts = 0
    ends = 0
    color = 'Blue'
    repeat = 'No'
    type = 'edit'

    constructor(clickEvent,  ...args) {
        super(...args)
        this.eventPos = clickEvent.clientY + this.dayEventsWrapper.scrollTop - this.dayEventsWrapper.offsetTop
        this.starts = positionToTime(this.eventPos, this.dayEventsWrapper.scrollHeight)
        this.ends = this.starts + 30
    }

    setEvent(){
        this.event = new event({
            id: null,
            startTime: dateToTime(this.eventStartsInput.value),
            duration: dateToTime(this.eventEndsInput.value) - dateToTime(this.eventStartsInput.value),
            title: this.eventTitleInput.value,
            color: this.eventColorInput.value,
            repeat: this.eventRepeatInput.value,
            repeatCount: this.eventRepeatCountInput.value
        })

        this.event.eventId = putEvent(this.event)
    }


}

export default newEventsManager