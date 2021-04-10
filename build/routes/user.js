"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../controllers/user"));
// extractJWT middleware needs to work in router
const extractJWT_1 = __importDefault(require("../middleware/extractJWT"));
const router = express_1.default.Router();
// extractJWT middleware should work in protected route
// if the process passes the middleware, it passes next() and goes to the controller
// or it ends execution and not goes into controller
router.get('/validate', extractJWT_1.default, user_1.default.validToken);
router.post('/register', user_1.default.register);
router.post('/login', user_1.default.login);
router.get('/get/all', user_1.default.getAllusers);
module.exports = router;
