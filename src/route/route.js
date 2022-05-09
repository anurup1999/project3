const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')



// ================ user api ===========================================================================================//

router.post('/register',userController.createuser)

router.post('/login',userController.doLogin)



// ========================export =======================================================================================//


module.exports = router;
