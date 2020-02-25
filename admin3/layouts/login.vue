<template>
    <v-app id="inspire">
        <v-content>
            <v-container
                    fluid
                    fill-height
                    style="
    background-image: url(http://www.scalsys.com/backgrounds/white-vector-background/white-vector-background_472518.jpg);
    background-repeat: repeat;
    padding: 0;
"
            >
                <v-layout
                        align-center
                        justify-center
                        style="background:linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 169, 217, 0.45) 50%, rgba(255, 255, 255, 0.85) 100%)"
                >
                    <v-flex
                            xs12
                            sm8
                            md4
                    >
                        <nuxt/>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
    export default {
        props: {
            source: String,
        },
        data: () => ({
            drawer: null,
        }),
    }
</script>

<style>


    .v-application {
        font-family: 'Source Sans Pro', sans-serif;
    }

</style>
