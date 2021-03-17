class Calendar {
    // массив названий месяцев
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    constructor({calendarBody, calendarMonth, calendarDateWrapper, buttonList, dayEventsWrapper} = {}) {
        this.calendarBody = calendarBody
        this.calendarMonth = calendarMonth
        this.calendarDateWrapper = calendarDateWrapper
        this.buttonList = buttonList

        this.dayEvents = new dayEvents(dayEventsWrapper, this)

        this.currentDate = new Date()

        this.days = []
    }

    // создаем Календарь
    create(){
        this.createCalendar()
        this.setCalendarDate()
        this.dayEvents.drawEvents()

        this.setButtonsListeners()
    }

    // устанавливаем дату и месяц
    setCalendarDate(){
        this.calendarDateWrapper.innerHTML = `${this.months[this.currentDate.getMonth()]} ${this.currentDate.getDate()},<br>${this.currentDate.getFullYear()}`
        this.calendarMonth.innerHTML = `${this.months[this.currentDate.getMonth()]}`
    }

    // устанавливаем слушатели на кнопки переключения месяцев
    setButtonsListeners() {
        for (let button of this.buttonList) {
            button.addEventListener('click', this.changeMonth(parseFloat(button.dataset.direction), 0))
        }
    }

    // Функция изменение месяца
    changeMonth(direction, newDay){
        return () => {
            if (newDay === 0) newDay = this.currentDate.getDate()
            if (direction !== 0){
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
                if (nextDay > this.lastDay().getDate()){
                    this.currentDate.setMonth(this.currentDate.getMonth() + direction)
                    this.currentDate.setDate(nextDay)
                }else{
                    this.currentDate.setDate(newDay)
                    this.currentDate.setMonth(this.currentDate.getMonth() + direction)
                }
            }else this.currentDate.setDate(newDay)

            this.createCalendar()
            this.setCalendarDate()
            this.dayEvents.drawEvents()
        }
    }

    // создание элемента с нужными нам параметрами
    

    // создание дня и добавления его в days
    createCell(date, month, classType = '') {
        let cell = createEl('div', {'class': `calendar-cell day ${classType}`, 'role': 'gridcell'})
        cell.append(createEl('span', {'class': 'calendar-day', 'data-direction': month}, date))
        this.days.push(cell)
        return cell
    }

    prevLastDay () {
        return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0)
    }

    nextLastDay () {
        return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 2, 0)
    }

    lastDay () {
        return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0)
    }

    getCurrentDate(){
        return this.currentDate
    }

    // создание календаря
    createCalendar() {
        this.clearCalendar()

        // вводим некоторые переменные
        let row = createEl('div', {'class': 'calendar-week', 'role': 'row'})
        let lastDay = this.lastDay()
        let prevLastDay = this.prevLastDay()

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
        this.setDaysListeners()
    }

    // очистим календарь
    clearCalendar(){
        while (this.calendarBody.firstChild) {
            this.calendarBody.removeChild(this.calendarBody.lastChild)
        }
    }

    // установим слушатели на нажатия на дни
    setDaysListeners(){
        for (let day of this.days){
            day.addEventListener('click', () => {
                let d = day.firstChild
                this.changeMonth(parseFloat(d.dataset.direction), parseInt(d.innerHTML))()
            })
        }
    }
}

function createEl(el, attrs, text = '') {
    let newTag = document.createElement(el)
    if (attrs) {
        for (let key in attrs) {
            newTag.setAttribute(key, attrs[key])
        }
    }
    if (text) newTag.innerHTML = text
    return newTag
}

function roundTo30(time){
    return Math.trunc(time / 30) * 30
}

function positionToTime(position, wrapperHeight){
    return  Math.round((position - 12) * 48 / wrapperHeight) * 30
}

function timeToPosition(time, wrapperHeight){
    return (time / 30) * wrapperHeight / 48 + 12
}

function dateToValueString(date){
    return  date.toLocaleDateString().split('.').reverse().join('-') + 'T' + date.toLocaleTimeString().slice(0,5)
}

function coordsToTime(num){
    return  `${Math.trunc(num / 60)}:${num % 60}`
}