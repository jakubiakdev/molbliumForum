const api = {
    // TODO: Many of these functions are only used once, so they could be moved back to their respective components
    getThread: function (id: any) {
        return fetch(`${process.env.REACT_APP_API_URL}/threads/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => {
            if (res.status === 200) {
                return res.json()
            } else {
                throw new Error('Thread not found');
            }
        }).then(data => {
            return data
        }).catch(err => {
            console.error(err);
        })
    },
    getAllThreads: function () {
        return fetch(`${process.env.REACT_APP_API_URL}/threads`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => {
            if (res.status === 200) {
                return res.json()
            } else {
                throw new Error('Something went wrong');
            }
        }).then(data => {
            return data
        }).catch(err => {
            console.error(err);
        })
    },
    getUser: function (id: any) {
        return fetch(`${process.env.REACT_APP_API_URL}/users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => {
            if (res.status === 200) {
                return res.json()
            } else {
                throw new Error('User not found');
            }
        }).then(data => {
            return data
        }).catch(err => {
            console.error(err);
        })
    },
    getTags: function () {
        return fetch(`${process.env.REACT_APP_API_URL}/tags`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => {
            if (res.status === 200) {
                return res.json()
            } else {
                throw new Error('Error loading tags');
            }
        }).then(data => {
            return data
        }).catch(err => {
            console.error(err);
        })
    }
}

export default api;