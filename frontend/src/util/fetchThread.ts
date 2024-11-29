export default function fetchThread(id: any) {
    return fetch(`http://localhost:8080/api/v1/threads/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${authToken}` // TODO: auth
        },
    }).then(res => {
        if (res.status === 200) {
            return res.json()
        } else {
            throw new Error('Invalid credentials');
        }})
        .then(data => {
            return data
        })
        .catch(err => {
            console.error(err);
        })
}