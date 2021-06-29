import widget from '@js/widget/widget'
import {createEl} from '@js/utils'

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

export default timerWidget