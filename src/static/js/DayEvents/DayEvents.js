import {createEl, positionToTime, roundTo30, timeToPosition} from "@js/utils"
import {deleteEvent, getEvents} from "@js/requests"
import event from "@js/Event/Event"
import newEventsManager from "@js/NewEventsManager/NewEventsManager"
import editEventsManager from "@js/EditEventsManager/EditEventsManager"

import swal from 'sweetalert'


class dayEvents {

    eventsStructure = {}
    dayEventsWrapper
    calendar
    eventsManager

    constructor({wrapper, button, context} = {}) {
        this.dayEventsWrapper = wrapper
        this.calendar = context
        this.createEventButton = button
        this.createEventButton.addEventListener('click', event => {
            this.createEventsManager(1, event, this.calendar.getCurrentDate(), this.dayEventsWrapper)
        })
        this.setEventsStructure(getEvents(this.calendar.getCurrentDate()))
        this.setClickListenerDayEvents()
    }

    render(){
        this.clearDayEvents()
        for (let line in this.eventsStructure) {
            this.setEventsParams(line)
        }
    }


    // пересчитываем параметры для ивентов и рисуем их
    setEventsParams(line) {
        let events = this.eventsStructure[line]
        for (let e of events) {
            const width = (this.dayEventsWrapper.offsetWidth - 72 - (events.length - 1) * 8) / events.length
            const top = timeToPosition(roundTo30(e.startTime), this.dayEventsWrapper.scrollHeight)
            const left = events.indexOf(e) * (width + 8) + 51
            const height = Math.max(
                Math.min(timeToPosition(e.duration, this.dayEventsWrapper.scrollHeight),
                    timeToPosition(1440 - e.startTime, this.dayEventsWrapper.scrollHeight)),
                this.dayEventsWrapper.scrollHeight / 48)
            const zIndex = Math.trunc(e.startTime / 15).toString()
            e.createEvent({
                width: width,
                top: top,
                left: left,
                height: height,
                zIndex: zIndex
            })
            this.dayEventsWrapper.append(e.eventWrap)
        }
    }

    // заполняем структуру ивентов
    setEventsStructure(events) {
        for (let e of events) {
            e = new event(e)
            let line = roundTo30(e.startTime)
            if (this.eventsStructure[line] === undefined) this.eventsStructure[line] = []
            this.eventsStructure[line].push(e)
        }
    }

    deleteEvent(event){
        const line = roundTo30(event.startTime)
        if (this.eventsStructure[line] !== undefined){
            this.eventsStructure[line].pop(event)
        }
    }

    // достать ивент по айди из eventStructure
    getEvent(event) {
        for (let e of this.eventsStructure[positionToTime(parseInt(event.style.top.slice(0, -2)), this.dayEventsWrapper.scrollHeight)]){
            if (e.eventId === parseInt(event.dataset.eventId)){
                return e
            }
        }
    }

    // очиста ивентов
    clearDayEvents() {
        while (this.dayEventsWrapper.children.length > 1) {
            this.dayEventsWrapper.removeChild(this.dayEventsWrapper.lastChild)
        }
    }

    // создать менеджер ивентов
    createEventsManager(type, ...args){
        this.dayEventsWrapper.style.overflowY = 'hidden'
        
        const daydayEventsManagerRoot = createEl('div', {'class': 'events-manager', 'data-type': this.type, 'style': `top: ${this.dayEventsWrapper.scrollTop + 60}px`})
        this.dayEventsWrapper.insertBefore(daydayEventsManagerRoot, this.dayEventsWrapper.firstChild)
        switch (type) {
            case 0:
                this.eventsManager = new editEventsManager(...args, daydayEventsManagerRoot)
                break
            case 1:
                this.eventsManager = new newEventsManager(...args, daydayEventsManagerRoot)
                break
        }
        this.eventsManager.render()
    }

    // удвлить менеджер ивентов
    removeEventsManager(){
        this.dayEventsWrapper.removeChild(this.dayEventsWrapper.firstChild)
        this.dayEventsWrapper.style.overflowY = 'scroll'
        this.eventsManager = null
        this.render()
    }


    saveEventsManager(){
        if (this.eventsManager instanceof newEventsManager){
            this.eventsManager.setEvent()
            this.setEventsStructure([this.eventsManager.getEvent()])
        }
        if (this.eventsManager instanceof editEventsManager){
            this.deleteEvent(this.eventsManager.getEvent())
            this.eventsManager.setEvent()
            this.setEventsStructure([this.eventsManager.getEvent()])
        }
        this.eventsManager.dayEventsManagerRoot.dataset.type = 'saved'
        this.removeEventsManager()
        swal("Event сохранен!", {
            icon: "success",
        })
    }

    deleteEventsManager(){
        swal({
            title: "Вы точно хотите удалить Event?",
            icon: "warning",
            buttons: ['Да', 'Нет'],
            dangerMode: true,
        }).then((willDelete) => {
            if (!willDelete) {
                if (this.eventsManager.event) {
                    this.deleteEvent(this.eventsManager.event)
                    deleteEvent(this.eventsManager.event)
                }
                this.removeEventsManager()
                swal("Event удален!", {
                    icon: "success",
                })

            }
        })
    }

    closeEventsManager() {
        if (this.eventsManager.dayEventsManagerRoot.dataset.type !== 'edit') {
            this.removeEventsManager()
            return
        }
        swal({
            title: "Продолжить без сохранения?",
            text: "Вы не сохранили изменения для Event!",
            icon: "warning",
            buttons: ['Отменить изменения', 'Сохранить'],
            dangerMode: true,
        }).then((willSave) => {
            if (willSave) {
                this.saveEventsManager()
            }else this.removeEventsManager()
        })
    }

    //установка слушателя на нажатие на вроппер дня ивентов
    setClickListenerDayEvents(){
        this.dayEventsWrapper.addEventListener('click', event => {
            if (this.eventsManager != null) {
                if (this.eventsManagerInList(event.path)){
                    if (event.target.classList.contains('event-button')){
                        switch (event.target.dataset.type){
                            case  'delete':
                                this.deleteEventsManager()
                                break
                            case  'save':
                                this.saveEventsManager()
                                break
                            case 'close':
                                this.closeEventsManager()
                                break
                        }
                    }
                    return
                }
                this.closeEventsManager()
                return
            }
            if (event.target.classList.contains('day-event')) {
                this.createEventsManager(0, this.getEvent(event.target), this.calendar.getCurrentDate(), this.dayEventsWrapper)
                return
            }
            this.createEventsManager(1, event, this.calendar.getCurrentDate(), this.dayEventsWrapper)
        })
    }

    clickDayEventsManager = event => {

    }

    eventsManagerInList(list) {
        for (let el of list){
            if (el.classList){
                if (el.classList.contains('events-manager')) return true
            }
        }
        return false
    }

}

export default dayEvents