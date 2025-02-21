// src/routes/reviewRoutes.js

import express from 'express';
import { addReview } from '../controllers/reviewController.js';

const router = express.Router();
router.get('/test', (req, res) => {
    res.json({ test: "DATA" })
})
router.post('/reviews', addReview);

export default router;