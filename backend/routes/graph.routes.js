import express from 'express';
import graphController from '../controllers/graph.controller.js';

const router = express.Router();

router.get('/shortest-path', graphController.getShortestPath);
router.post('/suggestions', graphController.getSuggestions);

export default router;