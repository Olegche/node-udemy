const multer = require('multer')



const storage = multer.diskStorage({
    destination(req, file, callback) {
        
        callback(null, 'public/images')
        

    },
    filename(req, file, callback) {
     
        callback(null, '1' + new Date().toISOString() + '-' + file.originalname) // додаємо дату в назву файлу щоб отримати унікальну назву і зберегти файл без помилок
    }
})

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg' ] // масив дозволених форматів файлу

const fileFilter = (req, file, callback) => {
    if(allowedTypes.includes(file.mimetype)) {
        callback(null, true)
    } 
    else
    callback(null, false)
}

module.exports = multer({
    storage: storage,
    fileFilter: fileFilter
})