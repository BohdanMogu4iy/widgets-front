class dayEvents {

    eventsStructure = {}

    constructor(dayEventsWrapper, calendar) {
        this.dayEventsWrapper = dayEventsWrapper
        this.calendar = calendar
        this.setClickListenerDayEvents()
    }

    // рисуем все ивенты дня
    drawEvents() {
        this.clearDayEvents()
        this.setEventsStructure(getEvents(this.calendar.getCurrentDate()))
        for (let line in this.eventsStructure) {
            this.setEventsParams(line)
        }
    }

    // пересчитываем параметры для ивентов и рисуем их
    setEventsParams(line) {
        let events = this.eventsStructure[line]
        for (let e of events) {
            let width = (this.dayEventsWrapper.offsetWidth - 72 - (events.length - 1) * 8) / events.length
            let top = timeToPosition(roundTo30(e.startTime), this.dayEventsWrapper.scrollHeight)
            let left = events.indexOf(e) * (width + 8) + 51
            e.setWidth(width)
            e.setPosition(top, left)
            e.setHeight(Math.max(
                Math.min(timeToPosition(e.duration, this.dayEventsWrapper.scrollHeight),
                    timeToPosition(1440 - e.startTime, this.dayEventsWrapper.scrollHeight)),
                this.dayEventsWrapper.scrollHeight / 48))
            e.eventWrap.style.zIndex = Math.trunc(e.startTime / 15).toString()
            this.dayEventsWrapper.append(e.eventWrap)
        }
    }

    // заполняем структуру ивентов
    setEventsStructure(events) {
        this.eventsStructure = reque
        for (let e of events) {
            e = new event(e)
            let line = roundTo30(e.startTime)
            if (this.eventsStructure[line] === undefined) this.eventsStructure[line] = []
            this.eventsStructure[line].push(e)
        }
    }

    // достать ивент по айди из eventStructure
    getEvent(event) {
        let el
        for (el of event.path) {
            if (el.classList.contains('day-event')) break
        }
        for (let e of this.eventsStructure[positionToTime(parseInt(el.style.top.slice(0, -2)), this.dayEventsWrapper.scrollHeight)]) {
            if (el.dataset.eventId == e.eventId) return e
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
        if (type) this.eventManager = new newEventManager(...args)
        else this.eventManager = new editEventManager(...args)

        this.dayEventsWrapper.insertBefore(this.eventManager.createEventsManager(), this.dayEventsWrapper.firstChild)
        this.dayEventsWrapper.style.overflowY = 'hidden'

        this.setButtonsListeners()
    }

    // удвлить менеджер ивентов
    removeEventsManager(){
        this.dayEventsWrapper.removeChild(this.dayEventsWrapper.firstChild)
        this.dayEventsWrapper.style.overflowY = 'scroll'

        this.drawEvents()
    }

    // установим слушателей на кнопочки
    setButtonsListeners(){
        this.eventManager.closeButton.addEventListener('click', () => this.closeEventManager())
        this.eventManager.saveButton.addEventListener('click', () => this.saveEventsManager())
        this.eventManager.deleteButton.addEventListener('click', () => this.deleteEventsManager())
    }

    saveEventsManager(){
        this.eventManager.setEvent()
        this.eventManager.eventsManagerWrapper.dataType = 'saved'
        swal("Event сохранен!", {
            icon: "success",
        })
    }

    deleteEventsManager(){
        swal({
            title: "Вы точно хотите удалить Event?",
            icon: "warning",
            buttons: ['Да!', 'Я передумал, оставьте!'],
            dangerMode: true,
        }).then((willDelete) => {
            if (!willDelete) {
                if (this.eventManager.event){
                    deleteEvent(this.eventManager.event)
                }
                swal("Event удален!", {
                    icon: "success",
                })
                this.removeEventsManager()
            }
        })
    }

    closeEventManager(){
        if (this.eventManager.eventsManagerWrapper.dataType === 'edit'){
            swal({
                title: "Продолжить без сохранения?",
                text: "Вы не сохранили изменения для Event!!!",
                icon: "warning",
                buttons: ['Отменить изменения!', 'Сохраните пожалуйста!'],
                dangerMode: true,
            }).then((willSave) => {
                    if (willSave) {
                        this.saveEventsManager()
                    }
                    this.removeEventsManager()
                })
        }else {
            this.removeEventsManager()
        }

    }

    //установка слушателя на нажатие на вроппер дня ивентов
    setClickListenerDayEvents(){
        this.dayEventsWrapper.addEventListener('click', this.clickEventsWrapper)
    }

    clickEventsWrapper = (event) =>{
        if (!this.eventManagerInList(event.path)){
            if (!this.eventManagerInList(this.dayEventsWrapper.children)){
                if (['day-time', 'day-time-line'].includes(event.path[0].classList[0])) {
                    this.createEventsManager(true, event, this.calendar.getCurrentDate(), this.dayEventsWrapper)
                }
                else this.createEventsManager(false, this.getEvent(event), this.calendar.getCurrentDate(), this.dayEventsWrapper)
            }else  this.closeEventManager()
        }
    }

    eventManagerInList(list) {
        for (let el of list){
            if (el.classList){
                if (el.classList.contains('events-manager')) return true
            }
        }
        return false
    }

}

class eventsManager{

    colors = ['Purple', 'Yellow', 'Red', 'Green', 'Blue']
    title = 'New Event'
    starts = 0
    ends = 0
    color = 'Blue'
    repeat = 0
    repeatCount = 0

    constructor(currentDate, dayEventsWrapper) {
        this.currentDate = currentDate
        this.dayEventsWrapper = dayEventsWrapper
    }

    setInputs(){
        // eventControlWrapper
        this.eventControlWrap = createEl('div', {'class': 'event-control-wrapper'})
        // closeButton
        this.closeButton = createEl('div', {'class': 'event-button'})
        this.closeButton.append(createEl('span', {'class': 'button-icon  close'}))
        // saveButton
        this.saveButton = createEl('div', {'class': 'event-button'})
        this.saveButton.append(createEl('span', {'class': 'button-icon save'}))
        // deleteButton
        this.deleteButton = createEl('div', {'class': 'event-button'})
        this.deleteButton.append(createEl('span', {'class': 'button-icon delete'}))
        // eventTitleInput
        this.eventTitleInput = createEl('input', {'class': 'event-title', 'type': 'text', 'value': this.title})
        // eventColorInput
        this.eventColorInput = createEl('select', {'id': 'event-color'})
        for (let color of this.colors){
            let el = createEl('option', {'value': color}, color[0].toUpperCase() + color.substr(1))
            if (color === this.color) el.selected = 'selected'
            this.eventColorInput.append(el)
        }
        //eventStartsInput
        this.eventStartsInput = createEl('input', {'id': 'event-starts', 'type': 'datetime-local',
            'min': dateToValueString(new Date(this.currentDate)),
            'max': dateToValueString(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate(), 23, 59)),
            'value': dateToValueString(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate(), 0, this.starts))})
        //eventEndsInput
        this.eventEndsInput = createEl('input', {'id': 'event-ends', 'type': 'datetime-local',
            'min': dateToValueString(this.currentDate),
            'max': dateToValueString(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate(), 23, 59)),
            'value': dateToValueString(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate(), 0, this.ends))})
        // eventRepeatInput
        this.eventRepeatInput = createEl('select', {'id': 'event-repeat'})
        let repeatList = ['No', 'Day', 'Week', '2 Weeks', 'Month']
        for (let repeat of repeatList){
            let el = (createEl('option', {'value': repeatList.indexOf(repeat)}, repeat))
            if (repeatList.indexOf(repeat) === this.repeat) el.selected = 'selected'
            this.eventRepeatInput.append(el)
        }
        // eventRepeatCountInput
        this.eventRepeatCountInput = createEl('input', {'id': 'event-repeatCount', 'type': 'number', 'min': 0, 'value': this.repeatCount})
    }

    createEventsManager(){
        this.setInputs()

        let wrapper = createEl('div', {'class': 'events-manager', 'data-type': 'saved', 'style': `top: ${this.dayEventsWrapper.scrollTop + 60}px`})

        let eventTitleInputWrap = createEl('div', {'class': 'event-input'})
        eventTitleInputWrap.append(this.eventTitleInput)

        let eventColorInputWrap = createEl('div', {'class': 'event-input'})
        eventColorInputWrap.append(createEl('label', {'for': 'event-color'}, 'Color:'))
        eventColorInputWrap.append(this.eventColorInput)

        let eventStartsInputWrap = createEl('div', {'class': 'event-input'})
        eventStartsInputWrap.append(createEl('label', {'for': 'event-starts'}, 'Starts:'))
        eventStartsInputWrap.append(this.eventStartsInput)

        let eventEndsInputWrap = createEl('div', {'class': 'event-input'})
        eventEndsInputWrap.append(createEl('label', {'for': 'event-ends'}, 'Ends:'))
        eventEndsInputWrap.append(this.eventEndsInput)

        let eventRepeatInputWrap = createEl('div', {'class': 'event-input'})
        eventRepeatInputWrap.append(createEl('label', {'for': 'event-repeat'}, 'Repeat: '))
        eventRepeatInputWrap.append(this.eventRepeatInput)

        let eventRepeatCountInputWrap = createEl('div', {'class': 'event-input'})
        eventRepeatCountInputWrap.append(createEl('label', {'class': 'event-repeatCount', 'for': 'event-repeatCount'}, 'Repeat'))
        eventRepeatCountInputWrap.append(this.eventRepeatCountInput)
        eventRepeatCountInputWrap.append(createEl('label', {'class': 'event-repeatCount', 'for': 'event-repeatCount'}, 'times'))


        this.eventControlWrap.append(this.deleteButton)
        this.eventControlWrap.append(this.saveButton)
        this.eventControlWrap.append(this.closeButton)

        wrapper.append(this.eventControlWrap)
        wrapper.append(eventTitleInputWrap)
        wrapper.append(eventColorInputWrap)
        wrapper.append(eventStartsInputWrap)
        wrapper.append(eventEndsInputWrap)
        wrapper.append(eventRepeatInputWrap)
        wrapper.append(eventRepeatCountInputWrap)

        this.eventsManagerWrapper = wrapper
        this.setStartsEndsListener()
        this.setInputsAndSelectsListener()

        return wrapper
    }

    setStartsEndsListener(){
        this.eventStartsInput.addEventListener('input', () => {
            this.eventEndsInput.min = this.eventStartsInput.value
            if (this.eventEndsInput.value < this.eventStartsInput.value) this.eventEndsInput.value = this.eventStartsInput.value
        })
    }

    setInputsAndSelectsListener(){
        for (let input of this.eventsManagerWrapper.getElementsByTagName('input')){
            input.addEventListener('input', () => this.eventsManagerWrapper.dataType = 'edit')
        }

        for (let select of this.eventsManagerWrapper.getElementsByTagName('select')){
            select.addEventListener('input', () => this.eventsManagerWrapper.dataType = 'edit')
        }
    }

}

class newEventManager extends eventsManager{

    constructor(clickEvent,  ...args) {
        super(...args)
        this.setAttributes(clickEvent)
    }

    setAttributes(clickEvent){
        this.eventPos = clickEvent.clientY + this.dayEventsWrapper.scrollTop - this.dayEventsWrapper.offsetTop
        this.starts = positionToTime(this.eventPos, this.dayEventsWrapper.scrollHeight)
        this.ends = this.starts + 30
    }

    setEvent(){
        this.event = new event({
            id: null,
            startTime: this.eventStartsInput.value,
            duration: this.eventEndsInput.value,
            title: this.eventTitleInput.value,
            color: this.eventColorInput.value,
            repeat: this.eventRepeatInput.value,
            repeatCount: this.eventRepeatCountInput.value
        })

        this.event.eventId = putEvent(this.event)
    }


}

class editEventManager extends eventsManager{

    constructor(event, ...args) {
        super(...args)
        this.setAttributes(event)
    }

    setAttributes(event){
        this.event = event
        this.title = this.event.title
        this.starts = this.event.startTime
        this.ends = this.starts + this.event.duration
        this.color = this.event.color
        this.repeat = this.event.repeat
        this.repeatCount = this.event.repeatCount
    }

    setEvent(){
        this.event.startTime = this.eventStartsInput.value
        this.event.duration = this.eventEndsInput.value
        this.event.title = this.eventTitleInput.valu
        this.event.color = this.eventColorInput.value
        this.event.repeat = this.eventRepeatInput.value
        this.event.repeatCount = this.eventRepeatCountInput.value

        pushEvent(this.event)
    }
}

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
        this.createEvent()
    }

    createEvent(){
        let event = createEl('div', {'class': 'day-event', 'role': 'button', 'style': `background-color: ${this.color}`, 'data-event-id' : `${this.eventId}`})
        event.append(createEl('div', {'class': 'event-info time'}, coordsToTime(this.startTime) + ' - ' + coordsToTime(this.startTime + this.duration)))
        event.append(createEl('div', {'class': 'event-info name'}, this.title))
        this.eventWrap =  event
    }

    setWidth(width){
        this.eventWrap.style.width = `${width}px`
    }

    setPosition(top, left){
        this.eventWrap.style.top = `${top}px`
        this.eventWrap.style.left = `${left}px`
    }

    setHeight(height){
        this.eventWrap.style.height =  `${height}px`
    }
}