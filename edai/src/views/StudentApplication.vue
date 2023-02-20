<template>
    <div class="student">
        <v-row>

            <v-col cols="12">
                <h2> Room: </h2>
            </v-col>
            <v-col md="8" sm="12">
                <v-card title="Display" min-height="800">

                    <DisplayTranscription>  </DisplayTranscription>
                    <v-list-item>
                        <v-card title="Text" color="grey" height="700">
                            <v-card-item>
                                body
                            </v-card-item>
                        </v-card>
                     </v-list-item>

                </v-card>

                <br>

                <v-btn class="mr-1"> Summarize </v-btn>
                <v-btn class="ml-1"> Extract Keypoints </v-btn>

            </v-col>
            <v-col md="4" sm="12">
                <v-card title="Flashnotes" min-height="800">
                    <v-list>

                        <v-list-item>
                            <v-card title="Flashnote #1" color="grey" height="200">
                                <v-card-item>
                                    body
                                </v-card-item>
                            </v-card>
                        </v-list-item>

                        <v-list-item>
                            <v-card title="Flashnote #2" color="grey" height="200">
                                <v-card-item>
                                    body
                                </v-card-item>
                            </v-card>
                        </v-list-item>

                    </v-list>
                    
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>




</script>

<style>

</style>