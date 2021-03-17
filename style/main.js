let calendar = new Calendar({
    calendarBody: document.getElementById('calendar-body'),
    calendarMonth: document.getElementById('month'),
    calendarDateWrapper: document.getElementsByClassName('day-date')[0],
    buttonList: document.getElementsByClassName('calendar-button'),
    dayEventsWrapper: document.getElementById('day-events-wrapper')
})

let widgets = new widgetDesk({
    widgetDesk: document.getElementById('widgets-desk'),
    createWidgetButton: document.getElementById('button-create-widget')
})


window.onload = () => {
    calendar.create()
    widgets.create()
}

document.body.addEventListener('resize', () => {
    calendar.create()
    console.log('resize')

})
