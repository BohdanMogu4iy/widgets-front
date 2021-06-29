import {createEl, dateToValueString} from "@js/utils";

class eventsManager {

    repeatList = ['No', 'Day', 'Week', '2 Weeks', 'Month']
    colors = ['Purple', 'Yellow', 'Red', 'Green', 'Blue']
    title
    starts
    ends
    color
    repeat
    repeatCount
    event
    type
    currentDate
    dayEventsWrapper
    dayEventsManagerRoot
    eventControlWrap
    closeButton
    saveButton
    deleteButton
    eventTitleInput
    eventColorInput
    eventStartsInput
    eventEndsInput
    eventRepeatInput
    eventRepeatCountInput

    constructor(currentDate, dayEventsWrapper, dayEventsManagerRoot) {
        this.currentDate = currentDate
        this.dayEventsWrapper = dayEventsWrapper
        this.dayEventsManagerRoot = dayEventsManagerRoot
        // eventControlWrapper
        this.eventControlWrap = createEl('div', {'class': 'event-control-wrapper'})
        // closeButton
        this.closeButton = createEl('div', {'class': 'event-button', 'data-type': 'close'})
        this.closeButton.append(createEl('span', {'class': 'button-icon  close'}))
        // saveButton
        this.saveButton = createEl('div', {'class': 'event-button', 'data-type': 'save'})
        this.saveButton.append(createEl('span', {'class': 'button-icon save'}))
        // deleteButton
        this.deleteButton = createEl('div', {'class': 'event-button', 'data-type': 'delete'})
        this.deleteButton.append(createEl('span', {'class': 'button-icon delete'}))
        // eventTitleInput
        this.eventTitleInput = createEl('input', {'class': 'event-title', 'type': 'text'})
        // eventColorInput
        this.eventColorInput = createEl('select', {'id': 'event-color'})
        for (let color of this.colors) {
            const el = createEl('option')
            this.eventColorInput.append(el)
        }
        //eventStartsInput
        this.eventStartsInput = createEl('input', {
            'id': 'event-starts', 'type': 'datetime-local'
        })
        //eventEndsInput
        this.eventEndsInput = createEl('input', {
            'id': 'event-ends', 'type': 'datetime-local'
        })
        // eventRepeatInput
        this.eventRepeatInput = createEl('select', {'id': 'event-repeat'})
        for (let repeat of this.repeatList) {
            const el = createEl('option')
            this.eventRepeatInput.append(el)
        }
        // eventRepeatCountInput
        this.eventRepeatCountInput = createEl('input', {
            'id': 'event-repeatCount',
            'type': 'number',
        })

        this.setInputsAndSelectsListener()
    }

    render() {
        this.eventTitleInput.value = this.title
        for (let i = 0; i < this.colors.length; i++) {
            this.eventColorInput.childNodes[i].value = this.colors[i]
            this.eventColorInput.childNodes[i].innerHTML = this.colors[i][0].toUpperCase() + this.colors[i].substr(1)
            if (this.colors[i] === this.color) this.eventColorInput.childNodes[i].selected = 'selected'
        }

        const timeMin = dateToValueString(new Date(this.currentDate))
        const timeMax = dateToValueString(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate(), 23, 59))
        this.eventStartsInput.min = timeMin
        this.eventStartsInput.max = timeMax
        this.eventStartsInput.value = dateToValueString(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate(), 0, this.starts))

        this.eventEndsInput.min = timeMin
        this.eventEndsInput.max = timeMax
        this.eventEndsInput.value = dateToValueString(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate(), 0, this.ends))

        for (let i = 0; i < this.repeatList.length; i++) {
            this.eventRepeatInput.childNodes[i].value = this.repeatList.indexOf(this.repeatList[i])
            this.eventRepeatInput.childNodes[i].innerHTML = this.repeatList[i]
            if (this.repeatList[i] === this.repeat) this.eventRepeatInput.childNodes[i].selected = 'selected'
        }
        this.eventRepeatCountInput.min = 0
        this.eventRepeatCountInput.value = this.repeatCount

        const eventTitleInputWrap = createEl('div', {'class': 'event-input'})
        eventTitleInputWrap.append(this.eventTitleInput)

        const eventColorInputWrap = createEl('div', {'class': 'event-input'})
        eventColorInputWrap.append(createEl('label', {'for': 'event-color'}, 'Color:'))
        eventColorInputWrap.append(this.eventColorInput)

        const eventStartsInputWrap = createEl('div', {'class': 'event-input'})
        eventStartsInputWrap.append(createEl('label', {'for': 'event-starts'}, 'Starts:'))
        eventStartsInputWrap.append(this.eventStartsInput)

        const eventEndsInputWrap = createEl('div', {'class': 'event-input'})
        eventEndsInputWrap.append(createEl('label', {'for': 'event-ends'}, 'Ends:'))
        eventEndsInputWrap.append(this.eventEndsInput)

        const eventRepeatInputWrap = createEl('div', {'class': 'event-input'})
        eventRepeatInputWrap.append(createEl('label', {'for': 'event-repeat'}, 'Repeat: '))
        eventRepeatInputWrap.append(this.eventRepeatInput)

        const eventRepeatCountInputWrap = createEl('div', {'class': 'event-input'})
        eventRepeatCountInputWrap.append(createEl('label', {
            'class': 'event-repeatCount',
            'for': 'event-repeatCount'
        }, 'Repeat'))
        eventRepeatCountInputWrap.append(this.eventRepeatCountInput)
        eventRepeatCountInputWrap.append(createEl('label', {
            'class': 'event-repeatCount',
            'for': 'event-repeatCount'
        }, 'times'))


        this.eventControlWrap.append(this.deleteButton, this.saveButton, this.closeButton)

        this.dayEventsManagerRoot.append(
            this.eventControlWrap,
            eventTitleInputWrap,
            eventColorInputWrap,
            eventStartsInputWrap,
            eventEndsInputWrap,
            eventRepeatInputWrap,
            eventRepeatCountInputWrap
        )
    }

    setInputsAndSelectsListener() {
        this.dayEventsManagerRoot.addEventListener('input', event => {
            if (['SELECT', 'INPUT'].indexOf(event.target.tagName) !== -1) {
                this.dayEventsManagerRoot.dataset.type = 'edit'
            }
            if (event.target.type === 'datetime-local') {
                this.eventEndsInput.min = this.eventStartsInput.value
                if (this.eventEndsInput.value < this.eventStartsInput.value) this.eventEndsInput.value = this.eventStartsInput.value
            }
        })
    }

    getEvent() {
        return this.event
    }
}

export default eventsManager