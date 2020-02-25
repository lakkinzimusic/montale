<template>
    <div>
      <v-card class="elevation-12">
        <v-card-text style="text-align: center">
          <v-img
            class="white--text"
            width="100%"
            height="150px"
            :contain="true"
            src="https://seeklogo.com/images/M/montale-paris-logo-184BE3CDF7-seeklogo.com.png"
          >
          </v-img>
        </v-card-text>
        <v-card-text>
          <v-form @submit="login">
            <v-text-field
              label="Логин"
              name="login"
              v-model="username"
              rounded
              clearable
              outlined
              autocomplete="off"
              prepend-icon="fas fa-user"
              placeholder="Логин"
              color="green"
              type="text"
            ></v-text-field>

            <v-text-field
              id="password"
              label="Пароль"
              v-model="password"
              rounded
              outlined
              clearable
              autocomplete="off"
              name="password"
              color="green"
              prepend-icon="fas fa-key"
              placeholder="Пароль"
              type="password"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green" @click="login" dark class="fw-light letter-space-default">Войти</v-btn>
        </v-card-actions>
      </v-card>
    </div>
</template>

<script>
    export default {
        name: "LoginForm",
        data(){
            return {
                username: null,
                password: null,
            }
        },
        methods: {
            login: function(){
                let self = this;
                this.$auth.loginWith('local', {
                    data: {
                        username: self.username,
                        password: self.password
                    }
                })

            }
        }
    }
</script>

<style scoped>

</style>
