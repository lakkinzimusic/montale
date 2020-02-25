<template>

    <div v-loading="loading">
        <el-button type="success" class="" size="medium" @click="newProduct()" round>Новый товар</el-button>

        <el-table
                stripe
                border
                :data="products"
                style="width: 100%"
                @row-click="rowClick($event)"
                height="80vh">
            <el-table-column
                    prop="id"
                    label="ID"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="product_name"
                    label="Наименование товара"
                    width="80">
            </el-table-column>
            <el-table-column
                    prop="description"
                    label="Описание товара"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="imageURL"
                    label="URL"
                    width="300">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="Operations"
                    width="120">
                <template slot-scope="scope">
                    <el-button
                            @click=editProduct(scope.row.id)
                            type="text"
                            size="small">
                        Edit
                    </el-button>
                    <el-button
                            @click=deleteProduct(scope.row.id)
                            type="text"
                            size="small">
                        Remove
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog width="80%" title='Создать продукт' v-loading="productCreateLoading" :visible.sync="productCreate">
            <product-create :properties="properties"></product-create>
        </el-dialog>
        <el-dialog width="80%" title='Редактировать продукт' v-loading="productEditLoading" @closed="product = {}"
                   :visible.sync="productEdit">
            <product-edit :product="product" :properties="properties"
                          :propertiesValues="propertiesValues"></product-edit>
        </el-dialog>
    </div>

</template>

<script>

    import ProductsService from '@/services/ProductsService'
    import ProductCreate from './ProductCreate'
    import ProductEdit from './ProductEdit'

    export default {
        name: "ProductsPage",
        components: {ProductCreate, ProductEdit},

        data() {
            return {
                products: [],
                properties: {
                    group: {argument_id: [], argument_name: [], value_id: [], value_name: []},
                    season: {argument_id: [], argument_name: [], value_id: [], value_name: []},
                    day_time: {argument_id: [], argument_name: [], value_id: [], value_name: []},
                    zodiak: {argument_id: [], argument_name: [], value_id: [], value_name: []},
                    sex: {argument_id: [], argument_name: [], value_id: [], value_name: []},
                    durability: {argument_id: [], argument_name: [], value_id: [], value_name: []},
                    bestseller: {argument_id: [], argument_name: [], value_id: [], value_name: []},
                    new_product: {argument_id: [], argument_name: [], value_id: [], value_name: []},
                },
                propertiesValues: [],
                loading: false,

                productCreate: false,
                productCreateLoading: false,
                productEdit: false,
                productEditLoading: false,

                focus_product: null,
                product: {},
                formLabelWidth: '120px'
            }
        },
        methods: {
            rowClick(event) {
                this.focus_product = event;
            },

            getProducts() {
                this.loading = true;
                ProductsService.getAllProducts()
                    .then(response => {

                        this.products = response.data.products;
                        // this.properties = response.data.properties;
                        console.log(response.data.properties);
                        for (let i = 0; i < response.data.properties.length; i++) {

                            switch (response.data.properties[i].argument_name) {

                                case 'Группа':

                                    this.properties.group.argument_id.push(response.data.properties[i].argument_id);
                                    this.properties.group.argument_name.push(response.data.properties[i].argument_name);
                                    this.properties.group.value_id.push(response.data.properties[i].value_id);
                                    this.properties.group.value_name.push(response.data.properties[i].value_name);
                                    break;
                                case 'Время года':
                                    this.properties.season.argument_id.push(response.data.properties[i].argument_id);
                                    this.properties.season.argument_name.push(response.data.properties[i].argument_name);
                                    this.properties.season.value_id.push(response.data.properties[i].value_id);
                                    this.properties.season.value_name.push(response.data.properties[i].value_name);
                                    break;
                                case 'Время суток':
                                    this.properties.day_time.argument_id.push(response.data.properties[i].argument_id);
                                    this.properties.day_time.argument_name.push(response.data.properties[i].argument_name);
                                    this.properties.day_time.value_id.push(response.data.properties[i].value_id);
                                    this.properties.day_time.value_name.push(response.data.properties[i].value_name);
                                    break;
                                case 'Знак зодиака':
                                    this.properties.zodiak.argument_id.push(response.data.properties[i].argument_id);
                                    this.properties.zodiak.argument_name.push(response.data.properties[i].argument_name);
                                    this.properties.zodiak.value_id.push(response.data.properties[i].value_id);
                                    this.properties.zodiak.value_name.push(response.data.properties[i].value_name);
                                    break;
                                case 'Пол':
                                    this.properties.sex.argument_id.push(response.data.properties[i].argument_id);
                                    this.properties.sex.argument_name.push(response.data.properties[i].argument_name);
                                    this.properties.sex.value_id.push(response.data.properties[i].value_id);
                                    this.properties.sex.value_name.push(response.data.properties[i].value_name);
                                    break;
                                case 'Стойкость':
                                    this.properties.durability.argument_id.push(response.data.properties[i].argument_id);
                                    this.properties.durability.argument_name.push(response.data.properties[i].argument_name);
                                    this.properties.durability.value_id.push(response.data.properties[i].value_id);
                                    this.properties.durability.value_name.push(response.data.properties[i].value_name);
                                    break;
                                case 'Бестселлер':
                                    this.properties.bestseller.argument_id.push(response.data.properties[i].argument_id);
                                    this.properties.bestseller.argument_name.push(response.data.properties[i].argument_name);
                                    this.properties.bestseller.value_id.push(response.data.properties[i].value_id);
                                    this.properties.bestseller.value_name.push(response.data.properties[i].value_name);
                                    break;
                                case 'Новинка':
                                    this.properties.new_product.argument_id.push(response.data.properties[i].argument_id);
                                    this.properties.new_product.argument_name.push(response.data.properties[i].argument_name);
                                    this.properties.new_product.value_id.push(response.data.properties[i].value_id);
                                    this.properties.new_product.value_name.push(response.data.properties[i].value_name);
                                    break;
                            }
                        }
                        console.log(this.properties.durability.value_id);
                        this.loading = false;
                    });
            },
            newProduct() {
                this.productCreateLoading = false;
                this.productCreate = true;

            },
            deleteProduct(id) {
                ProductsService.deleteThisProduct(id)
                    .then(response => {
                        this.getProducts();
                    })
            },

            editProduct(id) {
                ProductsService.getOneProduct(id)

                    .then(response => {
                        this.product = response.data[0];
                        this.productEdit = true;
                        this.productEditLoading = false;
                    })
            }
        },
        mounted() {
            this.getProducts()
        }
    }
</script>

<style scoped>

</style>