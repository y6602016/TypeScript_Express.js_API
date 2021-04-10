import express from 'express';
import controller from '../controllers/user';

// extractJWT middleware needs to work in router
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

// extractJWT middleware should work in protected route
// if the process passes the middleware, it passes next() and goes to the controller
// or it ends execution and not goes into controller
router.get('/validate', extractJWT, controller.validToken);

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/get/all', controller.getAllusers);

export = router;
