// routes/twitter.routes.js
const express = require('express');
const router = express.Router();
const TwitterService = require('../services/twitter.service');

router.post('/graph', async (req, res) => {
    try {
        const { username, depth = 2 } = req.body;
        
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const graph = await TwitterService.getConnectionsGraph(username, depth);
        res.json({ graph });
    } catch (error) {
        console.error('Error in /graph endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;