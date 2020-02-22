const router = require('express').Router()
const eventController = require('../controller/eventController')
const { checkToken } = require('../middleware/')

// mendaftarkan event
router.post('/create', checkToken, eventController.createEvent)

//menampilkan sebuah event
router.get('/get', checkToken, eventController.getEvent)

//menghapus event dari tabel events
router.delete('/del', checkToken, eventController.delEvent)

module.exports = router