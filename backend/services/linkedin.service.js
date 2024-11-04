import axios from 'axios';

class LinkedinService {
    constructor() {
        this.accessToken = null;
    }

    async authenticate() {
        try {
            const response = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', {
                grant_type: 'client_credentials',
                client_id: process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET
            });
            this.accessToken = response.data.access_token;
        } catch (error) {
            throw new Error('LinkedIn authentication failed');
        }
    }

    async getUserConnections(username) {
        try {
            if (!this.accessToken) {
                await this.authenticate();
            }

            const response = await axios.get(
                `https://api.linkedin.com/v2/connections/${username}`,
                {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`
                    }
                }
            );

            return response.data.elements.map(connection => ({
                username: connection.vanityName,
                name: `${connection.firstName} ${connection.lastName}`,
                profileUrl: `https://www.linkedin.com/in/${connection.vanityName}`
            }));
        } catch (error) {
            throw new Error('Failed to fetch LinkedIn connections');
        }
    }
}

export default new LinkedinService();