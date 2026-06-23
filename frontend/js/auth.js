import Storage from "./storage.js";

const Auth = {

    isAuthenticated() {
        return !!Storage.getToken();
    },

    requireAuth() {

        if (!this.isAuthenticated()) {
            window.location.href = "login.html";
        }

    },

    logout() {

        Storage.clear();
        window.location.href = "login.html";

    }

};

export default Auth;