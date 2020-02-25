<template>

</template>

<script>
    export default {
        name: "managers",
        data() {
            return {
                managers: [],
                count: 0,
                page: 1,
            }
        },
        methods: {
            async loadPage(page) {
                let data = await this.$axios.$get(`/api/users/managers?page=${page}`);
                this.count = data.count;
                this.managers = data.rows;
            }
        },
        mounted() {
            this.loadPage(this.page);
            this.baseUrl = process.env.apiUrl;
        },
        watch: {
            page: function (val) {
                this.loadPage(val);
            }
        }
    }
</script>

<style scoped>

</style>
