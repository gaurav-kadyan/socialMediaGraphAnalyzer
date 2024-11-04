import User from '../models/User.js';
import linkedinService from '../services/linkedin.service.js';

class UserController {
    async getNetworkGraph(username, depth) {
        try {
            const visited = new Set();
            const graph = {};

            async function traverseConnections(currentUsername, currentDepth) {
                if (currentDepth > depth || visited.has(currentUsername)) {
                    return;
                }

                visited.add(currentUsername);

                // Check if user exists in database
                let user = await User.findOne({ username: currentUsername });

                if (!user || Date.now() - user.lastUpdated > 24 * 60 * 60 * 1000) {
                    // Fetch new data if user doesn't exist or data is older than 24 hours
                    const connections = await linkedinService.getUserConnections(currentUsername);
                    user = await User.findOneAndUpdate(
                        { username: currentUsername },
                        {
                            username: currentUsername,
                            platform: 'linkedin',
                            connections,
                            lastUpdated: new Date()
                        },
                        { upsert: true, new: true }
                    );
                }

                graph[currentUsername] = user.connections;

                // Recursively get connections for each connection
                if (currentDepth < depth) {
                    for (const connection of user.connections) {
                        await traverseConnections(connection.username, currentDepth + 1);
                    }
                }
            }

            await traverseConnections(username, 0);
            return graph;
        } catch (error) {
            throw error;
        }
    }
}

export default new UserController();