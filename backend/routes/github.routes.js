import express from 'express';
import GitHubService from '../services/github.service.js';

const router = express.Router();

router.post('/graph', async (req, res) => {
    try {
        const { username, depth = 2 } = req.body;
        //console.log("username: ",username,"and depth: ",depth);
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const graph = await GitHubService.getConnectionsGraph(username, depth);
        //console.log(graph);
        res.json(graph);
    } catch (error) {
        console.error('Error in /graph endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;