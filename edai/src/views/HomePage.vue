<template>
    <div class="home">
        <v-item-group selected-class="bg-primary">
            <v-container>
                <v-row>
                    <v-col
                    >
                        <v-item v-slot="{selectedClass, toggle }">
                            <router-link style="text-decoration:none" to="/teacher">
                                <v-card
                                    :class="['d-flex align-center', selectedClass]"
                                    dark
                                    height="200"
                                    @click="toggle"
                                    >            
                                        <div class="text-h3 flex-grow-1 text-center">
                                            Create a room !
                                        </div>
                                </v-card>
                            </router-link>
                        </v-item>
                    </v-col>
                    <v-col
                    >
                    <router-link style="text-decoration:none" to="/studentForm">
                        <v-item v-slot="{selectedClass, toggle}">
                            <v-card
                            :class="['d-flex align-center', selectedClass]"
                            dark
                            height="200"
                            @click="toggle" 
                            >
                            <div class="text-h3 flex-grow-1 text-center">Join a room :)</div>
                            </v-card>
                        </v-item>
                    </router-link>
                    </v-col>
                </v-row>
            </v-container>

        </v-item-group>
    </div>
</template>

<script setup>

</script>

<style scoped>
    .home {
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
router-link{
    text-decoration: none;
}
</style>