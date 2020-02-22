const db= require ('../database')

const createEvent = async (req, res, next) => {
    const id_user = req.user.id_user
    const eventName = req.body.eventName
    const eventDate = req.body.eventDate
    const [rows]= await db.query('select id_user from events where id = ? limit 1',
    [id_user])
    if (rows.length == 0){
        db.query('insert into events(id_user, eventName, eventDate ) values(?,?,?)',[id_user, eventName, eventDate])
       .then(() => {
           res.json({
               "success": true,
               "message": "Event created"
           })
       })
       .catch((err) => {
           res.json({
               "success": false,
               "error": err
           })
       })
    } else{
        const error = new Error("You have registered an event")
        next(error)
    }
}

const getEvent = async(req, res, next) => {
    const id_user = req.user.id
    const [rows] = await db.query('select * from events where id = ?', [id_user
    ])
        if (rows.length != 0) {
            res.json({
                "success": true,
                "event": rows[0]
            })
        } else {
            res.status(404)
            res.json({
                "success": false,
                "message": "Event not found"
            })
        }
}

const delEvent = (req, res, next) => {
    const id_user = req.user.id_user
    db.query('delete from events where id = ?', [id])
    .then(() => {
        res.json({
            "success": true,
            "message": "delete success"
        })
    })
    .catch(() => {
        res.status(404)
        const error = new Error("Event Not Found")
        next(error)
    })
}

const eventController = {
    createEvent,
    getEvent,
    delEvent
}

module.exports = eventController