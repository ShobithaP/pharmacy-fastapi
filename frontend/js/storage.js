const Storage = {

    getToken() {
        return localStorage.getItem("token");
    },

    getName() {
        return localStorage.getItem("name");
    },

    getRole() {
        return localStorage.getItem("role");
    },

    clear() {
        localStorage.clear();
    }

};

export default Storage;