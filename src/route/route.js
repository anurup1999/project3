const express = require('express');
const userController = require('../controllers/userController');
const bookController = require('../controllers/userController');
const mw = require('../middleware/middleware');

const router = express.Router();


// ================ user apis ===========================================================================================//

router.post('/register',userController.createUser);
router.post('/login',userController.loginUser);

// ================ book apis ===========================================================================================//

router.post('/books',mw.authentication,bookController.createBook);
router.get('/books',mw.authentication,bookController.getBooks);

// ================ review apis ===========================================================================================//


// ========================export =======================================================================================//

module.exports = router;
