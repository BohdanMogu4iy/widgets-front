import toDoWidget from '@js/ToDoWidget/ToDoWidget'
import timerWidget from '@js/timerWidget/timerWidget'
import swal from 'sweetalert'
import {createEl} from "@js/utils";
import {deleteWidget, getWidgets, postWidget, putWidget} from "@js/requests";

class widgetDesk{

    widgetTypes = [{type: 'tasks', name: 'To-Do List'}]
    widgetDesk
    createWidgetButton
    widgets

    constructor({root, button} = {}) {
        this.widgetDesk = root
        this.createWidgetButton = button
        this.widgets = []
        this.setWidgets(getWidgets())
        this.setButtonsListeners()
    }

    setButtonsListeners = () => {
        this.createWidgetButton.addEventListener('click', event => {
            const widgetsMenuWrap = createEl('div', {'class': 'widgets-menu-wrapper'})
            const widgetsMenu = createEl('div', {'class': 'widgets-menu'})
            for (let w of this.widgetTypes){
                const widgetMenuItem = createEl('div', {'class': 'widgets-menu-item', 'data-type': 'tasks'}, w.name)
                widgetsMenu.append(widgetMenuItem)
            }
            widgetsMenuWrap.append(widgetsMenu)
            widgetsMenu.addEventListener('click', event => {
                console.log(event.path[0].dataset.type)
                if (event.target.classList.contains('widgets-menu-item')){
                    this.createWidget(putWidget({widgetType: event.path[0].dataset.type}))
                    this.removeWidgetMenu()
                }
            })
            document.body.append(widgetsMenuWrap)
        })
    }

    render(){
        this.clearWidgets()
        for (let w of this.widgets){
            if (w !== undefined){
                this.widgetDesk.append(w.widgetWrapper)
                w.render()
            }
        }
    }

    setWidgets(widgetList){
        for (let w of widgetList){
            this.createWidget(w)
        }
    }

    clearWidgets(){
        while (this.widgetDesk.firstChild){
            this.widgetDesk.removeChild(this.widgetDesk.firstChild)
        }
    }

    createWidget(widget){
        let w
        switch (widget['type']) {
            case('tasks'):
                w = new toDoWidget(widget)
                break
            case('timer'):
                w = new timerWidget(widget)
                break
        }
        this.setWidgetsListeners(w)
        this.widgets.push(w)
        this.render()
    }

    removeWidgetMenu(){
        document.body.removeChild(document.body.lastChild)
    }

    setWidgetsListeners(widget){
        widget.deleteButton.addEventListener('click', () => {
            swal({
                title: "Вы точно хотите удалить Widget?",
                icon: "warning",
                buttons: ['Да!', 'Я передумал, оставьте!'],
                dangerMode: true,
            }).then((willDelete) => {
                if (!willDelete) {
                    deleteWidget(widget)
                    console.log(this.widgets, this.widgets.indexOf(widget))
                    this.widgets.splice(this.widgets.indexOf(widget), 1)
                    this.render()
                    swal("Widget удален!", {
                        icon: "success",
                    })
                }
            })
        })

        widget.refreshButton.addEventListener('click', () => {
            swal({
                title: "Вы точно хотите очистить данные Widget?",
                icon: "warning",
                buttons: ['Да!', 'Я передумал, оставьте!'],
                dangerMode: true,
            }).then((willRefresh) => {
                if (!willRefresh) {
                    widget.refresh()
                    postWidget(widget)
                    swal("Widget очисчен!", {
                        icon: "success",
                    })
                }
            })
        })

        widget.moveButton.addEventListener('mousedown', e => {

            document.onselectstart = () => false

            const shiftX = e.pageX - widget.widgetWrapper.getBoundingClientRect().left - pageXOffset
            const shiftY = e.pageY - widget.widgetWrapper.getBoundingClientRect().top - pageYOffset

            widget.widgetWrapper.style.left = e.pageX - shiftX + 'px'
            widget.widgetWrapper.style.top = e.pageY - shiftY + 'px'

            document.onmousemove = e => {
                widget.widgetWrapper.style.left = e.pageX - shiftX + 'px'
                widget.widgetWrapper.style.top = e.pageY - shiftY + 'px'
            }

            widget.moveButton.addEventListener('mouseup', () => {
                document.onselectstart = () => true
                document.onmousemove = null
                widget.moveButton.onmouseup = null
                widget.positionX = widget.widgetWrapper.getBoundingClientRect().left + pageXOffset
                widget.positionY = widget.widgetWrapper.getBoundingClientRect().top + pageYOffset
                putWidget(widget)
            })
        })

        widget.moveButton.ondragstart = () => false
    }
}

export default widgetDesk