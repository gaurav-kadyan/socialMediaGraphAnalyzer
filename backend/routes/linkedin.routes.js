import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.get('/network/:username/:depth', async (req, res) => {
    try {
        const { username, depth } = req.params;
        const graph = await userController.getNetworkGraph(username, parseInt(depth));
        res.json(graph);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;