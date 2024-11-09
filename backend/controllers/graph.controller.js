// graph.controller.js
import graphService from '../services/graph.service.js';
import githubService from '../services/github.service.js';

class GraphController {
    async getShortestPath(req, res) {
        try {
            const { startUser, endUser, depth = 4 } = req.query;
            
            // Get the graph data
            const graph = await githubService.getConnectionsGraph(startUser, depth);
            
            // Find the shortest path
            const path = graphService.findShortestPath(graph, startUser, endUser);
            
            if (!path) {
                return res.status(404).json({ 
                    message: 'No path found between these users' 
                });
            }

            res.json({
                path,
                length: path.length - 1
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getSuggestions(req, res) {
        try {
            const { username, depth = 2 } = req.body;
            
            // Get the graph data
            const graph = await githubService.getConnectionsGraph(username, depth);
            
            // Get suggestions
            const suggestions = graphService.getFollowSuggestions(graph, username);
            
            res.json(suggestions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new GraphController();