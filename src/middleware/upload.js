const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

const buildStorage = (subdir) =>
  multer.diskStorage({
    destination: (_req, _file, cb) => {
      const dest = path.join(__dirname, '..', 'public', 'uploads', subdir);
      fs.mkdirSync(dest, { recursive: true });
      cb(null, dest);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${uuidv4()}${ext}`);
    },
  });

const fileFilter = (_req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) return cb(null, true);
  cb(new Error('Only JPG, PNG and PDF files are allowed'));
};

const expenseUpload = multer({
  storage: buildStorage('expenses'),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const incomeUpload = multer({
  storage: buildStorage('incomes'),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { expenseUpload, incomeUpload };
