<template>
    <div>
        <el-form :model="user">
            <el-form-item label="Username" :label-width="formLabelWidth">
                <el-input v-model="user.username" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="Email" :label-width="formLabelWidth">
                <el-input v-model="user.email" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="Password" :label-width="formLabelWidth">
                <el-input v-model="user.password" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="updateThisUser">Update</el-button>
                <el-button>Cancel</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>

    import UsersService from '@/services/UsersService'

    export default {
        name: "UserEdit",
        props: ['user'],
        data() {
            return {

                formLabelWidth: '140px'
            }
        },
        methods: {
            close() {
                this.$emit('close');
            },
            updateThisUser() {
                UsersService.updateUser({
                    id: this.user.id,
                    username: this.user.username,
                    email: this.user.email,
                    password: this.user.password,
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