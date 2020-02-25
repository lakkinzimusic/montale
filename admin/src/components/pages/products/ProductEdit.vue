<template>
    <div>
        <el-form :model="product">
            <el-form-item label="Product name" :label-width="formLabelWidth">
                <el-input v-model="product.product_name" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="Product price" :label-width="formLabelWidth">
                <el-input-number v-model="product.price" :precision="2" :step="0.1" :max="1000"></el-input-number>
            </el-form-item>

            <el-form-item label="Product description" :label-width="formLabelWidth">
                <el-input type="textarea" autosize v-model="product.description"></el-input>

            </el-form-item>

            <el-form-item label="Image URL" :label-width="formLabelWidth">
                <el-input v-model="product.imageURL" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="updateThisProduct">Create</el-button>
                <el-button>Cancel</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>

    import ProductsService from '@/services/ProductsService'

    export default {
        name: "ProductEdit",
        props: ['product'],
        data() {
            return {

                formLabelWidth: '140px'
            }
        },
        methods: {
            close() {
                this.$emit('close');
            },
            updateThisProduct() {
                ProductsService.updateProduct({
                    id: this.product.id,
                    product_name: this.product.product_name,
                    price: this.product.price,
                    description: this.product.description,
                    imageURL: this.product.imageURL
                })


            },
        },
        mounted() {

        }
    }
</script>

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal {
        background: #FFFFFF;
        box-shadow: 2px 2px 20px 1px;
        overflow-x: auto;
        display: flex;
        flex-direction: column;
    }

    .modal-header,
    .modal-footer {
        padding: 15px;
        display: flex;
    }

    .modal-header {
        border-bottom: 1px solid #eeeeee;
        color: #4AAE9B;
        justify-content: space-between;
    }

    .modal-footer {
        border-top: 1px solid #eeeeee;
        justify-content: flex-end;
    }

    .modal-body {
        position: relative;
        padding: 20px 10px;
    }

    .btn-close {
        border: none;
        font-size: 20px;
        padding: 20px;
        cursor: pointer;
        font-weight: bold;
        color: #4AAE9B;
        background: transparent;
    }

    .btn-green {
        color: white;
        background: #4AAE9B;
        border: 1px solid #4AAE9B;
        border-radius: 2px;
    }
</style>