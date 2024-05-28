import express from 'express';
import { authenticateAgent, getRestrictedPage, get404 } from '../controllers/authController.js';


const router = express.Router();

router.post('/authenticate', authenticateAgent);
router.get('/restricted', getRestrictedPage);

router.get('*', get404);


export default router;
