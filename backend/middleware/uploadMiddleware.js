const multer = require('multer')

const fs = require('fs')

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + '-' + file.originalname,
    )
  },
})

const fileFilter = (
  req,
  file,
  cb,
) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',

    'application/pdf',

    'application/msword',

    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]

  if (
    allowedTypes.includes(file.mimetype)
  ) {
    cb(null, true)
  } else {
    cb(
      new Error(
        'Only Images, PDF, DOC and DOCX files are allowed',
      ),
      false,
    )
  }
}

const upload = multer({
  storage,
  fileFilter,
})

module.exports = upload