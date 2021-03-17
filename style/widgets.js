class widgetDesk{

    widgetTypes= [{type: 'tasks', name: 'To-Do List'}, {type: 'timer', name: 'Timer'}]

    widgets = []

    constructor({widgetDesk, createWidgetButton} = {}) {
        this.widgetDesk = widgetDesk
        this.createWidgetButton = createWidgetButton
    }

    create(){
        this.widgets = []
        let widgetList = getWidgets()

        for (let w of widgetList){
            this.createWidget(w)
        }

        this.createWidgetButton.addEventListener('click', (event) => {
            let wrap = createEl('div', {'class': 'widgets-menu-wrapper'})
            let widgetsMenu = createEl('div', {'class': 'widgets-menu'})
            for (let w of this.widgetTypes){
                w.widgetMenuItem = createEl('div', {'class': 'widgets-menu-item'}, w.name)
                w.widgetMenuItem.onclick = () => {
                    let res  = putWidget({widgetType: w.type})
                    this.createWidget(res)
                    this.removeWidgetMenu()
                }
                widgetsMenu.append(w.widgetMenuItem)
            }
            wrap.append(widgetsMenu)
            document.body.append(wrap)
        })
    }

    createWidget(widget){
        console.log(widget)
        let w
        switch (widget['type']) {
            case('tasks'):
                w = new toDoWidget(widget)
                break
            case('timer'):
                w = new timerWidget(widget)
                break
        }
        this.widgets.push(w)
        this.widgetDesk.append(w.widgetWrapper)
        this.setWidgetsListeners(w)
    }

    removeWidgetMenu(){
        document.body.removeChild(document.body.lastChild)
    }

    setWidgetsListeners(widget){
        widget.deleteButton.onclick = () => {
            swal({
                title: "Вы точно хотите удалить Widget?",
                icon: "warning",
                buttons: ['Да!', 'Я передумал, оставьте!'],
                dangerMode: true,
            }).then((willDelete) => {
                if (!willDelete) {
                    deleteWidget(widget)
                    this.widgets.slice(this.widgets.indexOf(widget), 1)
                    this.widgets.removeWidget(widget)
                    swal("Widget удален!", {
                        icon: "success",
                    })
                }
            })
        }

        widget.refreshButton.onclick = () => {
            swal({
                title: "Вы точно хотите очистить данные Widget?",
                icon: "warning",
                buttons: ['Да!', 'Я передумал, оставьте!'],
                dangerMode: true,
            }).then((willRefresh) => {
                if (!willRefresh) {
                    widget.removeWidgetBody()
                    postWidget(widget)
                    swal("Widget очисчен!", {
                        icon: "success",
                    })
                }
            })
        }

        widget.moveButton.onmousedown = e => {

            document.onselectstart = () => false

            let shiftX = e.pageX - widget.widgetWrapper.getBoundingClientRect().left - pageXOffset
            let shiftY = e.pageY - widget.widgetWrapper.getBoundingClientRect().top - pageYOffset

            widget.widgetWrapper.style.left = e.pageX - shiftX + 'px'
            widget.widgetWrapper.style.top = e.pageY - shiftY + 'px'

            document.onmousemove = e => {
                widget.widgetWrapper.style.left = e.pageX - shiftX + 'px'
                widget.widgetWrapper.style.top = e.pageY - shiftY + 'px'

            }

            widget.moveButton.onmouseup = () => {
                document.onselectstart = () => true
                document.onmousemove = null
                widget.moveButton.onmouseup = null
                this.positionX = widget.widgetWrapper.getBoundingClientRect().left + pageXOffset
                this.positionY = widget.widgetWrapper.getBoundingClientRect().top + pageYOffset
                putWidget(widget)
            }
        }

        widget.moveButton.ondragstart = () => false
    }


}

class widget {
    constructor() {
        this.createWidgetWrapper()
    }

    createWidgetWrapper(){
        let wrapper = createEl('div', {'class': 'widget-wrapper'})
        let widgetControl = createEl('div', {'class': 'widget-control'})
        let widgetButton = (el) => {
            let wrap = createEl('div', {'class': 'widget-button'})
            wrap.append(el)
            return wrap
        }
        this.deleteButton = createEl('div', {'class': 'button-icon delete'})
        widgetControl.append(widgetButton(this.deleteButton))
        this.refreshButton = createEl('div', {'class': 'button-icon refresh'})
        widgetControl.append(widgetButton(this.refreshButton))
        this.moveButton = createEl('div', {'class': 'button-icon move'})
        widgetControl.append(widgetButton(this.moveButton))
        wrapper.append(widgetControl)

        this.widgetWrapper = wrapper

    }

    setInputsListeners(){

    }

    removeWidgetBody(){
        this.widgetWrapper.removeChild(this.widgetWrapper.lastChild)
    }

}

class toDoWidget extends widget{

    width = '25%'
    priorityColors = {Red: 'red', Green: 'green', Blue: 'blue'}

    constructor({widget_id, type, position_x, position_y, tasks} = {}, ...args) {
        super(...args)
        this.widgetId = widget_id
        this.widgetType = type
        this.positionX = position_x
        this.positionY = position_y
        this.taskList = tasks
        this.widgetWrapper.append(createEl('div', {'class': 'widget-title'}, 'To-do List'))
        this.widgetWrapper.style.top = this.positionY + 'px'
        this.widgetWrapper.style.left = this.positionX + 'px'
        this.widgetWrapper.style.width = this.width
        this.createWidgetBody()
    }

    createWidgetBody(){
        let widgetBody = createEl('ul', {'class': 'tasks'})
        for (let task of this.taskList){
            task.taskWrapper = createEl('li', {'class': 'task'})
            let el = createEl('input', {'type': 'checkbox'})
            if (task['state']) el.checked = true
            task.taskWrapper.append(el)
            task.taskWrapper.append(createEl('input', {'type': 'text', 'value': task['taskBody']}, task['taskBody']))
            let colorsInput = createEl('select', {})
            for (let color in this.priorityColors){
                let el = createEl('option', {'value': this.priorityColors[color]}, color)
                if (task['color'] === this.priorityColors[color]) el.selected = 'selected'
                colorsInput.append(el)
            }
            task.taskWrapper.append(colorsInput)
            widgetBody.append(task.taskWrapper)
        }
        this.widgetWrapper.append(widgetBody)
    }


}

class timerWidget extends widget{

    width = '10%'

    constructor({widget_id, type, position_x, position_y} = {}, ...args) {
        super(...args)
        this.widgetId = widget_id
        this.widgetType = type
        this.positionX = position_x + 'px'
        this.positionY = position_y + 'px'
        this.widgetWrapper.append(createEl('div', {'class': 'widget-title'}, 'Timer'))
        this.widgetWrapper.style.top = this.positionY
        this.widgetWrapper.style.left = this.positionX
        this.widgetWrapper.style.width = this.width
        this.createWidgetBody()
    }

    createWidgetBody(){}
}