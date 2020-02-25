import api from '@/services/api'

export default {
    createProduct(params) {

        console.log(params.properties);
        return api().post('product/create', params);
    },

    getAllProducts () {
        return api().get('product/get_all')
    },
    getOneProduct (id) {
        console.log(id);
        return api().get(`product/${id}`);
    },

    deleteThisProduct (id) {
        console.log(id);
        return api().delete(`product/${id}`);
    },

    updateProduct (params) {
        console.log(params);
        return api().put(`product/${params.id}`, params);
    },

}