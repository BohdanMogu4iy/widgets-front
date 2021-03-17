mainUrl = "http://127.0.0.1/"
currentUser = '1'
usersEnding = 'users/'
eventsEnding = 'events/'
widgetsEnding = 'widgets/'


async function getEvents(day){
    console.log(`get Events \n`)

    // await fetch(mainUrl+eventsEnding+currentUser)
    //     .then( response => {
    //         return response.json()
    //     })
    //     .then( data => {
    //         console.log(data)
    //     })
    //     .catch( err => {
    //         console.log(err)
    //     })
    return [{id: Math.floor(Math.random() * Math.floor(1000)), startTime: 35, duration: 15, title: 'First Event', color: 'Red', repeat: 0, repeatCount:0},
        {id: Math.floor(Math.random() * Math.floor(1000)), startTime: 35, duration: 80, title: 'Second Event', color: 'Green', repeat: 0, repeatCount:0},
        {id: Math.floor(Math.random() * Math.floor(1000)), startTime: 1424, duration: 80, title: 'Third Event', color: 'Blue', repeat: 3, repeatCount:4},
        {id: Math.floor(Math.random() * Math.floor(1000)), startTime: 80, duration: 80, title: 'Fourth Event', color: 'Purple', repeat: 1, repeatCount:2},
        {id: Math.floor(Math.random() * Math.floor(1000)), startTime: 1400, duration: 80, title: 'Fifth Event', color: 'Purple', repeat: 1, repeatCount:2}]
}

async function putEvent(event){
    console.log(`put Event \n ${JSON.stringify(event)}`)
    let data = {
        title: event.title,
        start_date: event.startTime,
        duration: event.duration,
        color: event.color,
        repeated: event.repeat > 0,
        repeat_in_n_days: event.repeatCount * event.repeat
    }
    // await fetch(mainUrl+eventsEnding+event.eventId,{
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data)
    // }).then( response => {
    //         return response.json()
    //     })
    //     .then( data => {
    //         console.log(data)
    //     })
    //     .catch( err => {
    //         console.log(err)
    //     })
    return  Math.floor(Math.random() * Math.floor(1000))
}

async function pushEvent(event){
    console.log(`push Event \n ${JSON.stringify(event)}`)
    let data = {
        title: event.title,
        start_date: event.startTime,
        duration: event.duration,
        color: event.color,
        repeated: event.repeat > 0,
        repeat_in_n_days: event.repeatCount * event.repeat
    }
//     await fetch(mainUrl+eventsEnding+event.eventId,{
//         method: 'PUSH',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     }).then( response => {
//         return response.json()
//     })
//         .then( data => {
//             console.log(data)
//         })
//         .catch( err => {
//             console.log(err)
//         })
}

async function deleteEvent(event){
    console.log(`delete Event \n ${JSON.stringify(event)}`)
    await fetch(mainUrl+eventsEnding+event.eventId,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then( response => {
        return response.json()
    })
        .then( data => {
            console.log(data)
        })
        .catch( err => {
            console.log(err)
        })
}

async function deleteWidget(widget){
    console.log(`delete Widget \n ${JSON.stringify(widget['taskList'])}`)
    // await fetch(mainUrl+widgetsEnding+widget.widgetId,{
    //     method: 'DELETE',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data)
    // }).then( response => {
    //     return response.json()
    // })
    //     .then( data => {
    //         console.log(data)
    //     })
    //     .catch( err => {
    //         console.log(err)
    //     })
}

async function putWidget(widget){
    console.log(`put Widget \n ${JSON.stringify(widget['taskList'])}`)
    let data = {
        type: widget.widgetType,
        position_x: widget.positionX,
        position_y: widget.positionY,
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
    // await fetch(mainUrl+widgetsEnding+widget.widgetId,{
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data)
    // }).then( response => {
    //     return response.json()
    // })
    //     .then( data => {
    //         console.log(data)
    //     })
    //     .catch( err => {
    //         console.log(err)
    // })
    switch (widget.widgetType){
        case ('tasks'):
            return  {widget_id: Math.floor(Math.random() * Math.floor(1000)), type: widget.widgetType, position_x: 0, position_y: 0, tasks: []}
        case ('timer'):
            return  {widget_id: Math.floor(Math.random() * Math.floor(1000)), type: widget.widgetType, position_x: 0, position_y: 0}
    }
}

async function postWidget(widget){
    console.log(`post Widget \n ${JSON.stringify(widget['taskList'])}`)
    let data = {
        type: widget.widgetType,
        position_x: widget.positionX,
        position_y: widget.positionY,
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
    // await fetch(mainUrl+widgetsEnding,{
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data)
    // }).then( response => {
    //     return response.json()
    // })
    //     .then( data => {
    //         console.log(data)
    //     })
    //     .catch( err => {
    //         console.log(err)
    //     })

}

async function getWidgets(){
    console.log(`get Widgets \n`)
    // await fetch(mainUrl+usersEnding+currentUser)
    //     .then( response => {
    //         return response.json()
    //     })
    //     .then( data => {
    //         console.log(data)
    //     })
    //     .catch( err => {
    //         console.log(err)
    //     })
    return [{widget_id: Math.floor(Math.random() * Math.floor(1000)), type: 'tasks', position_x: 100, position_y: 100, tasks: [{state: 1, taskBody: 'Privet Misha 1)', color: '#e40101'}, {state: 0, taskBody: 'Privet Misha 2(', color: '#00eeff'}]}]}
