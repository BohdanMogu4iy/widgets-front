import {createEl} from '@js/utils'

class widget {

    width
    widgetId
    positionX
    positionY
    widgetType
    widgetWrapper
    widgetControl
    deleteButton
    refreshButton
    moveButton

    constructor({widget_id, type, position_x, position_y} = {}) {
        this.widgetId = widget_id
        this.widgetType = type
        this.positionX = position_x
        this.positionY = position_y
        this.widgetWrapper  = createEl('div', {'class': 'widget-wrapper'})
        this.widgetControl = createEl('div', {'class': 'widget-control'})
        const widgetButton = (el, type) => {
            let wrap = createEl('div', {'class': 'widget-button', 'type': type})
            wrap.append(el)
            return wrap
        }
        this.deleteButton = widgetButton(createEl('div', {'class': 'button-icon delete'}), 'delete')
        this.widgetControl.append(this.deleteButton)
        this.refreshButton =  widgetButton(createEl('div', {'class': 'button-icon refresh'}), 'refresh')
        this.widgetControl.append(this.refreshButton)
        this.moveButton =  widgetButton(createEl('div', {'class': 'button-icon move'}), 'move')
        this.widgetControl.append(this.moveButton)
        this.widgetWrapper .append(this.widgetControl)
        this.widgetBody = createEl('div', {'class': 'widget-body'})
        this.widgetWrapper.append(this.widgetBody)
    }

    superRender(){
        this.widgetWrapper.style.top = this.positionY + 'px'
        this.widgetWrapper.style.left = this.positionX + 'px'
        this.widgetWrapper.style.width = this.width
    }

}

export default widget