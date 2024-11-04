// services/twitter.service.js
const User = require('../models/User');
const twitterClient = require('../config/twitter.config');

class TwitterService {
    async getConnectionsGraph(username, depth) {
        try {
            const graph = {};
            const visited = new Set();
            await this.buildGraph(username, depth, graph, visited);
            return graph;
        } catch (error) {
            console.error('Error in getConnectionsGraph:', error);
            throw error;
        }
    }

    async buildGraph(username, depth, graph, visited) {
        // If we've reached max depth or already visited this user, return
        if (depth < 0 || visited.has(username)) {
            return;
        }

        visited.add(username);

        try {
            // Check if we have recent data in database
            let userData = await User.findOne({
                username,
                platform: 'twitter',
                lastUpdated: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Data less than 24 hours old
            });

            if (!userData) {
                // Fetch from Twitter API if not in database or too old
                const connections = await this.fetchTwitterConnections(username);
                
                // Save to database
                userData = await User.findOneAndUpdate(
                    { username, platform: 'twitter' },
                    {
                        connections,
                        lastUpdated: new Date()
                    },
                    { upsert: true, new: true }
                );
            }

            // Add to graph
            graph[username] = userData.connections.map(conn => conn.username);

            // Recursively fetch connections of connections
            if (depth > 0) {
                for (const connection of userData.connections) {
                    await this.buildGraph(connection.username, depth - 1, graph, visited);
                }
            }
        } catch (error) {
            console.error(`Error processing user ${username}:`, error);
            graph[username] = []; // Set empty connections on error
        }
    }

    async fetchTwitterConnections(username) {
        try {
            // Get followers/friends from Twitter API
            const response = await twitterClient.get('friends/list', {
                screen_name: username,
                count: 200 // Adjust based on your needs
            });

            return response.users.map(user => ({
                username: user.screen_name,
                name: user.name,
                profileUrl: `https://twitter.com/${user.screen_name}`
            }));
        } catch (error) {
            console.error('Error fetching Twitter connections:', error);
            throw error;
        }
    }
}

module.exports = new TwitterService();