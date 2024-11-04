import dotenv from 'dotenv';
dotenv.config();

import { Octokit } from '@octokit/rest';
import User from '../models/User.js';

console.log('GITHUB_PERSONAL_ACCESS_TOKEN in GitHubService:', process.env.GITHUB_PERSONAL_ACCESS_TOKEN);

class GitHubService {
    constructor() {
        this.octokit = new Octokit({
            auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
            request: {
                retries: 3,
                retryAfter: 180
            }
        });
    }

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
        if (depth < 0 || visited.has(username)) {
            return;
        }

        visited.add(username);

        try {
            const connections = await this.getCachedOrFetchConnections(username);
            graph[username] = connections.map(conn => conn.username);

            if (depth > 0) {
                for (const connection of connections) {
                    await this.buildGraph(connection.username, depth - 1, graph, visited);
                }
            }
        } catch (error) {
            console.error(`Error processing user ${username}:`, error);
            graph[username] = [];
        }
    }

    async getCachedOrFetchConnections(username) {
        const cachedUser = await User.findOne({
            username,
            platform: 'github',
            lastUpdated: { $gt: new Date(Date.now() - 72 * 60 * 60 * 1000) }
        });

        if (cachedUser) {
            console.log('Using cached data for:', username);
            return cachedUser.connections;
        }

        const connections = await this.fetchGitHubConnections(username);
        
        await User.findOneAndUpdate(
            { username, platform: 'github' },
            {
                connections,
                lastUpdated: new Date()
            },
            { upsert: true, new: true }
        );

        return connections;
    }

    async fetchGitHubConnections(username, maxRetries = 3) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const rateLimit = await this.octokit.rateLimit.get();
                console.log('API Rate Limit Status:', rateLimit.data.rate);

                if (rateLimit.data.rate.remaining < 1) {
                    const resetTime = new Date(rateLimit.data.rate.reset * 1000);
                    const waitTime = resetTime - new Date();
                    console.log(`Rate limit exceeded. Waiting ${waitTime/1000} seconds...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }

                const { data: followers } = await this.octokit.request('GET /users/{username}/followers', {
                    username,
                    per_page: 100
                });

                return followers.map(follower => ({
                    username: follower.login,
                    name: follower.login,
                    profileUrl: follower.html_url
                }));
            } catch (error) {
                if (error.status === 403 && attempt < maxRetries) {
                    const waitTime = Math.pow(2, attempt) * 1000;
                    console.log(`Attempt ${attempt} failed, waiting ${waitTime/1000} seconds...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    continue;
                }
                console.error('Error fetching GitHub connections:', error);
                throw error;
            }
        }
    }
}

export default new GitHubService();