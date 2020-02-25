import api from '@/services/api'

export default {
    createUser(params) {
        return api().post('users/create', params);
    },

    getAllUsers() {
        return api().get('users/get_all')
    },

    deleteThisUser(id) {
        return api().delete(`users/${id}`);
    },
    updateUser(params) {
        return api().put(`users/${params.id}`, params);
    },
    getOneUser(id) {
        return api().get(`users/${id}`);
    },

}