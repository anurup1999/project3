const express = require('express');
const userController = require('../controllers/userController');
//const mw = require('../middleware/middleware');

const router = express.Router();


// ================ user api ===========================================================================================//

router.post('/register',userController.createUser);
router.post('/login',userController.loginUser);

router.post('/books',mw.authentication,bookController.createBook);


// ========================export =======================================================================================//

module.exports = router;
