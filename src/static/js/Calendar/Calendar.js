import dayEvents from "@js/DayEvents/DayEvents"
import {createEl} from "@js/utils";
import swal from "sweetalert";

class calendar {
    // массив названий месяцев
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    currentDate
    dayEvents
    calendarSection
    calendarDateWrapper
    buttonList
    calendarMonth
    calendarBody
    dayEventsWrapper

    constructor({root, button} = {}) {
        this.currentDate = new Date()
        this.calendarSection = root
        this.calendarSection.innerHTML =
            (`<div class="day-wrapper">
                <div class="day-info-wrapper" id = 'day-info-wrapper'>
                    <div class="control-buttons-wrapper" id="control-buttons-wrapper">
                       
                    </div>
                </div>
                <div class="calendar-wrapper" id="calendar-wrapper">
                    <div class="calendar" role="grid" id="calendar">
                        <div class="calendar-week" role="row">
                            <span class="calendar-cell day-type" role="columnheader">Mo</span>
                            <span class="calendar-cell day-type" role="columnheader">Tu</span>
                            <span class="calendar-cell day-type" role="columnheader">We</span>
                            <span class="calendar-cell day-type" role="columnheader">Th</span>
                            <span class="calendar-cell day-type" role="columnheader">Fr</span>
                            <span class="calendar-cell day-type" role="columnheader">Sa</span>
                            <span class="calendar-cell day-type" role="columnheader">Su</span>
                        </div>
                    </div>
                </div>
            </div>`)
        this.calendarDateWrapper = createEl('div', {'class': 'day-date'})
        document.getElementById('day-info-wrapper').insertAdjacentElement('afterbegin', this.calendarDateWrapper)

        const calendarButton = (direction) => {
            const el = createEl('div', {
                'class': `calendar-button ${direction ? 'left' : 'right'}`,
                'role': 'button',
                'data-direction': (direction ? -1 : 1)
            })
            el.innerHTML = '<span class="button-icon calendar"></span>'
            return el
        }
        this.buttonList = [calendarButton(true), calendarButton(false)]
        this.calendarMonth = createEl('div', {'class': 'calendar-month'})
        this.calendarNav = createEl('div', {'class': 'calendar-nav'})
        this.calendarNav.append(this.buttonList[0], this.calendarMonth, this.buttonList[1])
        document.getElementById('calendar-wrapper').insertAdjacentElement('afterbegin', this.calendarNav)

        this.createWidgetButton = createEl('div', {'class': "control-button", 'role': "button"})
        this.createWidgetButton.append(createEl('span', {'class': "button-icon create-widget"}))
        this.createEventButton = createEl('div', {'class': "control-button", 'role': "button"})
        this.createEventButton.append(createEl('span', {'class': "button-icon create-event"}))
        document.getElementById("control-buttons-wrapper").append(this.createWidgetButton, this.createEventButton)

        const dayTimeLine = (time) => {
            const el = createEl('div', {'class': 'day-time-line'})
            el.innerHTML = `<span class="day-time">${time ? time : ''}</span>`
            return el
        }
        const dayEventsTimeLines = []
        for (let i = 0; i < 24; i++) {
            dayEventsTimeLines.push(dayTimeLine(`${i > 10 ? i : '0' + i}:00`), dayTimeLine())
        }
        const dayEventsTime = createEl('div', {'class': 'day-events-time'})
        dayEventsTime.append(...dayEventsTimeLines)
        this.dayEventsWrapper = createEl('div', {'class': 'day-events-wrapper', 'role': 'presentation'})
        this.dayEventsWrapper.append(dayEventsTime)

        this.calendarBody = createEl('div', {'class': 'calendar-body', 'role': 'rowgroup'})
        document.getElementById('calendar').append(this.calendarBody)
        this.calendarSection.append(this.dayEventsWrapper)

        this.dayEvents = new dayEvents({
            wrapper: this.dayEventsWrapper,
            button: button,
            context: this
        })
        this.setButtonsListeners()
        this.setDaysListeners()
    }

    render() {
        this.clearCalendar()
        this.createCalendar()
        this.setCalendarDate()
        this.dayEvents.render()
    }

    // устанавливаем дату и месяц
    setCalendarDate() {
        this.calendarDateWrapper.innerHTML = `${this.months[this.currentDate.getMonth()]} ${this.currentDate.getDate()},<br>${this.currentDate.getFullYear()}`
        this.calendarMonth.innerHTML = `${this.months[this.currentDate.getMonth()]}`
    }

    // устанавливаем слушатели на кнопки переключения месяцев
    setButtonsListeners() {
        this.calendarNav.addEventListener('click', event => {
            if (event.target.classList.contains('calendar-button')) {
                this.changeMonth(parseFloat(event.target.dataset.direction), 0)
            }
        })

        this.createEventButton.addEventListener('click', event => {
            if (!this.dayEvents.eventsManager){
                this.dayEvents.createEventsManager(1, event, this.getCurrentDate(), this.dayEvents.dayEventsWrapper)
            }else swal("Завершите работу с открытым event!", {
                icon: "warning",
            })
        })
    }

    // Функция изменение месяца
    changeMonth(direction, newDay) {
        if (newDay === 0) newDay = this.currentDate.getDate()
        if (direction !== 0) {
            let nextDay = newDay
            switch (direction) {
                case -1:
                    nextDay = this.prevLastDay().getDate()
                    break
                case 1:
                    nextDay = this.nextLastDay().getDate()
                    break
            }
            newDay = Math.min(newDay, nextDay)
            if (nextDay > this.lastDay().getDate()) {
                this.currentDate.setMonth(this.currentDate.getMonth() + direction)
                this.currentDate.setDate(nextDay)
            } else {
                this.currentDate.setDate(newDay)
                this.currentDate.setMonth(this.currentDate.getMonth() + direction)
            }
        } else this.currentDate.setDate(newDay)

        this.render()
    }

    // создание дня
    createCell(date, month, classType = '') {
        let cell = createEl('div', {'class': `calendar-cell day ${classType}`, 'role': 'gridcell'})
        cell.append(createEl('span', {'class': 'calendar-day', 'data-direction': month}, date))
        return cell
    }

    prevLastDay() {
        return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0)
    }

    nextLastDay() {
        return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 2, 0)
    }

    lastDay() {
        return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0)
    }

    // создание календаря
    createCalendar() {
        // вводим некоторые переменные
        let row = createEl('div', {'class': 'calendar-week', 'role': 'row'})
        const lastDay = this.lastDay()
        const prevLastDay = this.prevLastDay()

        // вносим в календарь дни из последней недели предыдущего месяца
        for (let i = prevLastDay.getDay() - 1; i >= 0; i--) {
            row.append(this.createCell(prevLastDay.getDate() - i, '-1', 'other-month'))
        }

        // вносим в календарь дни из этого месяца
        for (let i = 1; i <= lastDay.getDate(); i++) {
            if (row.children.length === 7) {
                this.calendarBody.append(row)
                row = createEl('div', {'class': 'calendar-week', 'role': 'row'})
            }
            row.append((i === this.currentDate.getDate()) ? this.createCell(i, '0', 'chosen') : this.createCell(i, '0'))
        }

        // вносим в календарь дни из первой недели следующего месяца
        for (let i = 1; i <= 7 - lastDay.getDay(); i++) {
            if (row.children.length === 7) {
                this.calendarBody.append(row)
                row = createEl('div', {'class': 'calendar-week', 'role': 'row'})
            }
            row.append(this.createCell(i, '1', 'other-month'))
        }

        // Если получилось что в календаре 5 строк, то вносим в календарь дни из 2 недели слудющего месяца
        if (this.calendarBody.children.length === 4) {
            for (let i = 1; i <= 7; i++) {
                if (row.children.length === 7) {
                    this.calendarBody.append(row)
                    row = createEl('div', {'class': 'calendar-week', 'role': 'row'})
                }
                row.append(this.createCell(7 - lastDay.getDay() + i, '1', 'other-month'))
            }
        }

        // добавим остаточные дни
        this.calendarBody.append(row)
    }

    getCurrentDate(){
        return this.currentDate
    }

    // очистим календарь
    clearCalendar() {
        while (this.calendarBody.firstChild) {
            this.calendarBody.removeChild(this.calendarBody.lastChild)
        }
    }

    // установим слушатели на нажатия на дни
    setDaysListeners() {
        this.calendarBody.addEventListener('click', event => {
            let d = event.target.firstChild
            this.changeMonth(parseFloat(d.dataset.direction), parseInt(d.innerHTML))
        })
    }

}

export default calendar

