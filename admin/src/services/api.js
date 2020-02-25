import axios from 'axios'


export default () => {
    return axios.create({
        baseURL: 'http://138.68.125.45:8080',
        withCredentials: true,
    })
}
