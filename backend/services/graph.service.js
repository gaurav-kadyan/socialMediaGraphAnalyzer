class GraphService {
    // Find shortest path between two users using BFS
    findShortestPath(graph, startUser, endUser) {
        if (!graph[startUser] || !graph[endUser]) {
            return null;
        }

        const queue = [[startUser]];
        const visited = new Set([startUser]);

        while (queue.length > 0) {
            const path = queue.shift();
            const currentUser = path[path.length - 1];

            if (currentUser === endUser) {
                return path;
            }

            for (const neighbor of graph[currentUser]) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push([...path, neighbor]);
                }
            }
        }

        return null;
    }

    // Find follow suggestions using common connections
    getFollowSuggestions(graph, username, maxSuggestions = 5) {
        if (!graph[username]) {
            return [];
        }

        const suggestions = new Map();
        const directConnections = new Set(graph[username]);
        
        // Check connections of connections
        for (const connection of graph[username]) {
            if (graph[connection]) {
                for (const secondDegreeConnection of graph[connection]) {
                    // Skip if it's the user themselves or already a direct connection
                    if (secondDegreeConnection !== username && 
                        !directConnections.has(secondDegreeConnection)) {
                        
                        suggestions.set(
                            secondDegreeConnection, 
                            (suggestions.get(secondDegreeConnection) || 0) + 1
                        );
                    }
                }
            }
        }

        // Sort suggestions by number of common connections
        return Array.from(suggestions.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, maxSuggestions)
        .map(([user]) => user);
    }
}

export default new GraphService();