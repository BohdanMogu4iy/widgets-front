import widgetDesk from "@js/WidgetDesk/WidgetDesk";
import calendar from "@js/Calendar/Calendar"
import "@css/style.css"
import {createEl} from "@js/utils";


const createEventButton = createEl('div', {'class': 'control-button', 'role': 'button'})
createEventButton.innerHTML = `<span class="button-icon create-event"></span>`
const cal = new calendar({
    root: document.getElementById('calendar-root'),
    button: createEventButton
})

const createWidgetButton = createEl('div', {'class': 'control-button', 'role': 'button'})
createWidgetButton.innerHTML = `<span class="button-icon create-widget"></span>`
const widgets = new widgetDesk({
    root: document.getElementById('widgets-root'),
    button: cal.createWidgetButton
})

window.onload = () => {
    render({elements: [widgets, cal]})
}

window.addEventListener('resize', () => {
    console.log('resize')
})

function render({elements} = {}){
    for (let element of elements){
        element.render()
    }
}
