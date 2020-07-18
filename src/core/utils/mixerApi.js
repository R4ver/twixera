import querystring from "query-string";

const API_URL = "https://mixer.com/api/";

const request = (method, path, options = {}) => {
    const dataType = (options.dataType ? options.dataType : "application/json");

    return new Promise((resolve, reject) => {
        fetch(`${API_URL}${options.version ? options.version : "v1"}/${path}${options.qs ? `?${querystring.stringify(options.qs)}` : ''}`, {
            method: method,
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                ...options.headers
            },
            body: options.body ? JSON.stringify(options.body) : undefined
        })
        .then(res => {
            if (res.ok) {
                if ( !res.headers.get("content-type") ) return;
                const contentType = res.headers.get("content-type").match(/(\w+)\/(\w+)(;.+)?/);
                if (contentType[2] === "json") {
                    return res.json();
                } else if (contentType[1] === "image") {
                    return res.blob();
                } else {
                    return res.text();
                }
            }
        })
        .then(data => {
            resolve(data);
        })
        .catch(err => {
            reject(err);
        })
    })

}

export default {
    get(path, options) {
        return request("GET", path, options);
    },

    post(path, options) {
        return request("POST", path, options);
    },

    put(path, options) {
        return request("PUT", path, options);
    },

    patch(path, options) {
        return request("PATCH", path, options);
    },

    delete(path, options) {
        return request("DELETE", path, options);
    }
}