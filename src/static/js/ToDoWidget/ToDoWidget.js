import widget from '@js/widget/widget'
import {createEl} from '@js/utils'
import {postWidget} from '@js/requests'


class toDoWidget extends widget{

    width = '25%'
    taskList = []
    tasksWrapper

    constructor({widget_id, type, position_x, position_y, tasks} = {}) {
        super({widget_id, type, position_x, position_y})
        this.taskList = tasks
        this.widgetControl.insertAdjacentElement('afterend', createEl('div', {'class': 'widget-title'}, 'To-do List'))
        this.tasksWrapper = createEl('ul', {'class': 'tasks'})
        this.newTaskInput = createEl('form', {'class': 'task  addForm'})
        this.newTaskInput.append(createEl('input', {'type': 'text', 'placeholder': 'New task', 'name': 'taskBody', 'required': 'required'}))
        const button = createEl('button', {'type': 'submit', 'name': 'newTask'})
        button.append(createEl('div', {'class': 'button-icon confirm'}))
        this.newTaskInput.append(button)
        this.widgetBody.append(this.tasksWrapper)
        this.widgetBody.append(this.newTaskInput)
        this.setWidgetBodyListeners()
    }

    render(){
        this.clearTasksWrapper()
        this.superRender()
        for (let task of this.taskList){
            const taskWrap = createEl('li', {'class': 'task'})
            const el = createEl('input', {'type': 'checkbox'})
            if (task.state) el.checked = true
            taskWrap.append(el)
            taskWrap.append(createEl('input', {'type': 'text', 'value': task.taskBody}, task.taskBody))
            const colorsInput = createEl('input', {'type': 'color', 'value': task.color})
            taskWrap.append(colorsInput)

            for (let input of taskWrap.childNodes){
                input.addEventListener('change', () => {
                    postWidget(this)
                })
            }

            this.tasksWrapper.append(taskWrap)
        }
    }

    setWidgetBodyListeners(){
        this.newTaskInput.onsubmit = () => {
            if (this.newTaskInput.checkValidity()){
                let newTask = {
                    state: 0,
                    taskBody: this.newTaskInput.taskBody.value,
                    color: '#adb0ff'
                }
                this.taskList.push(newTask)
                this.newTaskInput.taskBody.value = ""
                console.log(this.newTaskInput.taskBody)
                this.newTaskInput.taskBody.blur()
                console.log(this.newTaskInput.taskBody)
                postWidget(this)
                this.render()
            }
            return false
        }
    }

    clearTasksWrapper(){
        while (this.tasksWrapper.firstChild) {
            this.tasksWrapper.removeChild(this.tasksWrapper.firstChild)
        }
    }

    refresh(){
        this.taskList = []
        this.render()
    }

}

export default toDoWidget