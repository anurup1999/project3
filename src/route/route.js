// ================ imports ===========================================================================================//

const express = require('express');

const userController = require('../controllers/userController');

const bookController = require('../controllers/bookController');

const middleware = require('../middleware/middleware');

const router = express.Router();

// ================ user apis ===========================================================================================//

router.post('/register',userController.createUser);

router.post('/login',userController.loginUser);

// ================ book apis ===========================================================================================//

router.post('/books',middleware.authentication,bookController.createBook);

router.get('/books',middleware.authentication,bookController.getBooks);

router.get('/books/:bookId',middleware.authentication,bookController.getBookById);

router.put('/books/:bookId',middleware.authentication,bookController.updateBookById);

router.delete('/books/:bookId',middleware.authentication,bookController.deleteBookById);

// ================ review apis ===========================================================================================//



// =========================== exports =======================================================================================//

module.exports = router;
