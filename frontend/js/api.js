import Config from "./config.js";

const Api = {

    async request(endpoint, options = {}) {

        const token = localStorage.getItem("token");

        const headers = {
            ...(options.headers || {})
        };

        headers["Content-Type"] = "application/json";

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
            `${Config.BASE_URL}${endpoint}`,
            {
                ...options,
                headers
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail || `HTTP ${response.status}`
            );
        }

        return data;

    },

    get(endpoint) {
        return this.request(endpoint, { method: "GET" });
    },

    post(endpoint, data) {
        return this.request(endpoint, {
            method: "POST",
            body: JSON.stringify(data)
        });
    },

    put(endpoint, data) {
        return this.request(endpoint, {
            method: "PUT",
            body: JSON.stringify(data)
        });
    },

    delete(endpoint) {
        return this.request(endpoint, {
            method: "DELETE"
        });
    }

};

export default Api;