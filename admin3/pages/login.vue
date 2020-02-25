<template>
    <div>
      <login-form/>
    </div>
</template>

<script>
    import LoginForm from "../components/elements/forms/LoginForm";
    export default {
        components: {LoginForm},
        layout: "login",
        name: "login"
    }
</script>

<style scoped>

</style>
