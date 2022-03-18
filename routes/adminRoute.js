const express = require('express');
const router = express.Router();

const user = require('../controllers/userController');
const { isAdminLoggedIn } = require('../utils/authMiddlewares');
const { registerationValidation } = require('../utils/validators');

/* ----- /admin/ routes --------------- */

router.route('/')
    .get((req, res) => { res.render('admin/loginform'); })
    .post(user.adminLogin);
router.get('/logout', user.adminLogout);

router.get('/dashboard', isAdminLoggedIn, (req, res) => { res.render('admin/dashboard'); });
router.get('/users', isAdminLoggedIn, (req, res) => { res.render('admin/users'); });
router.get('/coordinators', isAdminLoggedIn, (req, res) => { res.render('admin/coordinators'); });
router.get('/analytics', isAdminLoggedIn, (req, res) => { res.render('admin/analytics'); });

router.post('/addcoordinator', isAdminLoggedIn, registerationValidation, user.register);


module.exports = router;