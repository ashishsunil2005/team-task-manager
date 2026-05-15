const express = require('express');
const { getUsers } = require('../controllers/userController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticate, isAdmin, getUsers);

module.exports = router;
