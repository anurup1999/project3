const express = require('express');
const router = express.Router();
import {createUser,loginUser} from '../controllers/userController';

// ================ user api ===========================================================================================//

router.post('/register',createUser)
router.post('/login',loginUser)

// ========================export =======================================================================================//

module.exports = router;
