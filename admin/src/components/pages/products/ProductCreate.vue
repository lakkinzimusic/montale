<template>
    <div>

        <el-form enctype="multipart/form-data">

            <el-form-item label="Product name" :label-width="formLabelWidth">
                <el-input v-model="product_name" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="Product price" :label-width="formLabelWidth">
                <el-input-number v-model="price" :precision="2" :step="0.1" :max="1000"></el-input-number>
            </el-form-item>

            <el-form-item label="Product description" :label-width="formLabelWidth">
                <el-input type="textarea" autosize v-model="description"></el-input>

            </el-form-item>

            <el-form-item label="Image URL" :label-width="formLabelWidth">
                <input multiple type="file" name="file" @change="onFileSelected">
            </el-form-item>

            <el-form-item label="Группа" :label-width="formLabelWidth">
                <el-select v-model="prop[properties.group.argument_id[0]]" multiple placeholder="Группа">
                    <el-option
                            v-for="(item, index) in properties.group.value_name"
                            :key="index"
                            :label="item"
                            :value="properties.group.value_id[index]">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="Сезоны" :label-width="formLabelWidth">
                <el-select v-model="prop[properties.season.argument_id[0]]" multiple placeholder="Сезоны">
                    <el-option
                            v-for="(item, index) in properties.season.value_name"
                            :key="item"
                            :label="item"
                            :value="properties.season.value_id[index]">
                    </el-option>
                </el-select>

            </el-form-item>

            <el-form-item label="Время суток" :label-width="formLabelWidth">
                <el-select v-model="prop[properties.day_time.argument_id[0]]" multiple placeholder="Время суток">
                    <el-option
                            v-for="(item, index) in properties.day_time.value_name"
                            :key="item"
                            :label="item"
                            :value="properties.day_time.value_id[index]">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="Знак Зодиака" :label-width="formLabelWidth">
                <el-select v-model="prop[properties.zodiak.argument_id[0]]" multiple placeholder="Знак Зодиака">
                    <el-option
                            v-for="(item, index) in properties.zodiak.value_name"
                            :key="item"
                            :label="item"
                            :value="properties.zodiak.value_id[index]">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="Пол" :label-width="formLabelWidth">
                <el-select v-model="prop[properties.sex.argument_id[0]]" multiple placeholder="Пол">
                    <el-option
                            v-for="(item, index) in properties.sex.value_name"
                            :key="item"
                            :label="item"
                            :value="properties.sex.value_id[index]">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="Стойкость" :label-width="formLabelWidth">
                <el-radio-group v-model="prop[properties.durability.argument_id[0]]">
                    <el-radio

                            v-for="(item, index) in properties.durability.value_name"
                            :key="index"
                            :value="properties.durability.value_id[index]"
                            :label="properties.durability.value_id[index]"
                    > {{properties.durability.value_name[index]}}
                    </el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="Бестселлер" :label-width="formLabelWidth">

                <el-switch
                        v-model="prop[properties.bestseller.argument_id[0]]"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        :active-value="properties.bestseller.value_id[0]"
                >{{properties.bestseller.value_name[index]}}

                </el-switch>

            </el-form-item>
            <el-form-item label="Новинка" :label-width="formLabelWidth">
                <el-switch
                        v-model="prop[properties.new_product.argument_id[0]]"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        :active-value="properties.new_product.value_id[0]"
                >{{properties.new_product.value_name[index]}}

                </el-switch>

            </el-form-item>
            <el-form-item>

                <el-button type="primary" @click="addNewProduct">Создать</el-button>
                <el-button>Отмена</el-button>
            </el-form-item>

        </el-form>
    </div>
</template>
<script>

    import ProductsService from '@/services/ProductsService'

    export default {
        name: "ProductCreate",
        props: ['properties'],
        data() {
            return {
                id: '',
                product_name: '',
                price: 0,
                description: '',
                file: null,
                prop: {},
                formLabelWidth: '140px',
            }
        },
        methods: {

            onFileSelected(event) {
                this.file = event.target.files[0]
            },

            close() {
                this.$emit('close');
            },
            addNewProduct() {
                let proper = JSON.stringify(this.prop);
                const fd = new FormData();
                fd.append('id', this.id);
                fd.append('product_name', this.product_name);
                fd.append('price', this.price);
                fd.append('description', this.description);
                fd.append('file', this.file);
                fd.append('properties', proper);
                // fd.append('group', this.group);
                // fd.append('Время года', this.seasons);
                // fd.append('Время суток', this.day_time);
                // fd.append('Знак зодиака', this.zodiak);
                // fd.append('Пол', this.sex);
                // fd.append('Стойкость', this.durability);
                // fd.append('Бестселлер', this.bestseller);
                // fd.append('Новинка', this.new_product);
                ProductsService.createProduct(fd);

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