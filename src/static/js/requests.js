

export function getEvents(date){
    console.log(`get Events \n`)
    return [{id: Math.floor(Math.random() * Math.floor(1000)), startTime: 35, duration: 15, title: 'First Event', color: 'Red', repeat: 0, repeatCount:0},
        {id: Math.floor(Math.random() * Math.floor(1000)), startTime: 35, duration: 80, title: 'Second Event', color: 'Green', repeat: 0, repeatCount:0},
        {id: Math.floor(Math.random() * Math.floor(1000)), startTime: 1424, duration: 80, title: 'Third Event', color: 'Blue', repeat: 3, repeatCount:4},
        {id: Math.floor(Math.random() * Math.floor(1000)), startTime: 80, duration: 80, title: 'Fourth Event', color: 'Purple', repeat: 1, repeatCount:2},
        {id: Math.floor(Math.random() * Math.floor(1000)), startTime: 1400, duration: 80, title: 'Fifth Event', color: 'Purple', repeat: 1, repeatCount:2}]
}

export function putEvent(event){
    console.log(`put Event \n ${JSON.stringify(event)}`)
    let data = {
        title: event.title,
        start_date: event.startTime,
        duration: event.duration,
        color: event.color,
        repeated: event.repeat > 0,
        repeat_in_n_days: event.repeatCount * event.repeat
    }
    return  Math.floor(Math.random() * Math.floor(1000))
}

export function pushEvent(event){
    console.log(`push Event \n ${JSON.stringify(event)}`)
    let data = {
        title: event.title,
        start_date: event.startTime,
        duration: event.duration,
        color: event.color,
        repeated: event.repeat > 0,
        repeat_in_n_days: event.repeatCount * event.repeat
    }
}

export function deleteEvent(event){
    console.log(`delete Event \n ${JSON.stringify(event)}`)
}

export function deleteWidget(widget){
    console.log(`delete Widget \n ${JSON.stringify(widget['taskList'])}`)
}

export function putWidget(widget){
    console.log(`put Widget \n ${JSON.stringify(widget['taskList'])}`)
    switch (widget.widgetType){
        case ('tasks'):
            return  {widget_id: Math.floor(Math.random() * Math.floor(1000)), type: widget.widgetType, position_x: 0, position_y: 0, tasks: []}
        case ('timer'):
            return  {widget_id: Math.floor(Math.random() * Math.floor(1000)), type: widget.widgetType, position_x: 0, position_y: 0}
    }
}

export function postWidget(widget){
    console.log(`post Widget \n ${JSON.stringify(widget['taskList'])}`)
    let data = {
        type: widget.widgetType,
        position_x: widget.positionX,
        position_y: widget.positionY,
        tasks: []
    }
    if (widget.widgetType === 'tasks'){
        for (let task of widget['taskList']){
            data['tasks'].push({
                    state: task.state,
                    taskBody: task.taskBody,
                    color: task.color
                }
            )
        }

    }
}

export function getWidgets(){
    console.log(`get Widgets \n`)
    return [
        {
            widget_id: Math.floor(Math.random() * Math.floor(1000)),
            type: 'tasks',
            position_x: 100,
            position_y: 100,
            tasks: [{state: 1, taskBody: 'Privet Misha 1)', color: '#e40101'},
                {state: 0, taskBody: 'Privet Misha 2(', color: '#00eeff'}]
        }]}
