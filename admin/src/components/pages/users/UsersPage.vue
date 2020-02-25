<template>
    <div v-loading="loading">
        <el-button type="success" class="" size="medium" @click="newUser()" round>Новый пользователь</el-button>

        <el-table
                stripe
                border
                :data="users"
                style="width: 100%"
                @row-click="rowClick($event)"
                height="80vh">
            <el-table-column
                    prop="id"
                    label="ID"
                    width="300">
            </el-table-column>
            <el-table-column
                    prop="username"
                    label="Имя пользователя"
                    width="300">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="Operations"
                    width="120">
                <template slot-scope="scope">
                    <el-button
                            @click = editUser(scope.row.id)
                            type="text"
                            size="small">
                        Edit
                    </el-button>
                    <el-button
                            @click = deleteUser(scope.row.id)
                            type="text"
                            size="small">
                        Remove
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog width="80%" title='1234' v-loading="userCreateLoading" :visible.sync="userCreate">
            <user-create></user-create>
        </el-dialog>
        <el-dialog width="80%" title='123' v-loading="userEditLoading" @closed="user = {}" :visible.sync="userEdit">
            <user-edit :user="user"></user-edit>
        </el-dialog>
    </div>
</template>

<script>
    import UsersService from '@/services/UsersService'
    import UserCreate from './UserCreate'
    import UserEdit from './UserEdit'
    export default {
        name: "UsersPage",
        components: {UserCreate, UserEdit},
        data() {
            return {
                users: [],
                loading: false,
                user: {},

                userCreate: false,
                userCreateLoading: false,
                userEdit: false,
                userEditLoading: false,

                focus_user: null,
                formLabelWidth: '120px'
            }
        },
        methods: {
            rowClick(event){
                this.focus_user = event;
            },
            getUsers() {
                this.loading = true;
               UsersService.getAllUsers()
                   .then(response => {
                       this.users = response.data;
                       this.loading = false;
                   });
            },

            newUser(){
                this.userCreateLoading = false;
                this.userCreate = true;

            },
            deleteUser(id){
                UsersService.deleteThisUser(id)
                    .then(response => {
                        this.getUsers();
                    })
            },

            editUser(id){
                UsersService.getOneUser(id)

                    .then(response => {
                        this.user = response.data[0];
                        this.userEdit = true;
                        this.userEditLoading = false;
                    })
            }



        },
        mounted() {
            this.getUsers();
        }

    }

</script>

<style scoped>

</style>