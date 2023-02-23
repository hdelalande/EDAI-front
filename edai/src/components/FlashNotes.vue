<template>
    <v-card class="overflow-y-auto" title="Flashnotes" height="600" >
        <v-container>
            <v-row align="center" justify="center">
            <v-btn-toggle
            v-model="filterFlashnotes"
            color="deep-purple-darken-1"
            mandatory
            @click="changeFilterFlashnotes"
        >
            <v-btn value="all">All</v-btn>
            <v-btn value="keypoints">Key points</v-btn>
            <v-btn value="summary">Summary</v-btn>
            </v-btn-toggle>
            </v-row>   
        </v-container>
        <v-list>
            <v-list-item
                v-for="item in flashnotesFiltered"
                :key="props.flashnotes.indexOf(item)"
            >
                <v-card 
                elevation="6"
                color="deep-purple-darken-1"
                @click="openDialogFlashnote(props.flashnotes.indexOf(item))"
                >
                <v-card-title v-if="studentTitles[props.flashnotes.indexOf(item)] == undefined"> {{ '#'+(props.flashnotes.indexOf(item)+1)+' '+item.title }}</v-card-title>
                <v-card-title v-else>{{ '#'+(props.flashnotes.indexOf(item)+1)+' '+studentTitles[props.flashnotes.indexOf(item)] }}</v-card-title>
                    <v-card-text v-if="item.status === 'loading'"
                    class="center-content"
                    >
                        <v-progress-circular
                            :size="50"
                            indeterminate
                            color=""
                        ></v-progress-circular>
                    </v-card-text>
                    <v-card-text v-if="item.status === 'loaded'">
                        <div v-if="item.title === 'Key Points'">
                        <div v-for="keypoint in item.body" :key=item.body.indexOf(keypoint) class="text-body-1">
                            <p v-if="item.body.indexOf(keypoint) === 0" class="font-weight-bold">
                                {{ keypoint }}
                            </p>
                            <p v-else>
                                {{ keypoint }}
                            </p>
                        </div>
                        </div>
                        <div v-else>
                            <p class="text-body-1">
                                {{ item.body }}
                            </p>
                        </div>
                    </v-card-text>
                </v-card>
            </v-list-item>
        </v-list>
        <v-dialog
            v-model="dialog"
            max-width="80%">
            <v-card
            color="deep-purple-darken-1"
            >
                <v-card-title v-if="modifTitle==false && studentTitles[isSelected] == undefined">
                    {{ '#'+(isSelected+1)+' '+props.flashnotes[isSelected].title}}
                    <v-btn
                        variant="outlined"
                        size="x-small"
                        icon
                        color="white"
                        @click="wantToModifyTitle"
                    >
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-title v-if="modifTitle==false && studentTitles[isSelected] != undefined">
                    {{ '#'+(isSelected+1)+' '+ studentTitles[isSelected] }}
                    <v-btn
                        variant="outlined"
                        size="x-small"
                        icon
                        color="white"
                        @click="wantToModifyTitle"
                    >
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-title v-if="modifTitle==true">
                <v-row>
                    <v-col md="2" sm="20">
                        <v-text-field
                            :suffix= "'#'+(isSelected+1)+' '"
                            v-model="newTitleToEmit"
                            label="New title"
                            max-width="200"
                            outlined
                            dense
                            color="white"
                            class="text-body-1"
                        ></v-text-field>
                    </v-col>
                    <v-col md="1" sm="20" align-self="center">
                        <v-btn
                        variant="outlined"
                        size="x-small"
                        icon
                        color="white"
                        @click="studentModifyTitle"
                    >
                        <v-icon>mdi-check</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
                </v-card-title>
                <v-card-text v-if="props.flashnotes[isSelected].status === 'loading'"
                    class="center-content"
                    >
                        <v-progress-circular
                            :size="50"
                            indeterminate
                            color=""
                        ></v-progress-circular>
                </v-card-text>
                <v-card-text v-if="props.flashnotes[isSelected].status === 'loaded'">
                    <div v-if="props.flashnotes[isSelected].title === 'Key Points'">
                        <div v-for="keypoint in props.flashnotes[isSelected].body" :key=props.flashnotes[isSelected].body.indexOf(keypoint) class="text-body-1">
                            <p v-if="props.flashnotes[isSelected].body.indexOf(keypoint) === 0" class="font-weight-bold">
                                {{ keypoint }}
                            </p>
                            <p v-else>
                                {{ keypoint }}
                            </p>
                        </div>
                        </div>
                        <div v-else>
                            <p class="text-body-1">
                                {{ props.flashnotes[isSelected].body }}
                            </p>
                        </div>
                </v-card-text>

            </v-card>
        <v-container>
            <v-row align="center" justify="center">
                <v-btn-toggle
                v-model="isSelected"
                @click="refreshCard"
                color="deep-purple-darken-1"
                mandatory
            >   
                <v-btn v-for="item in flashnotes" :key="item" :value=flashnotes.indexOf(item)>{{ flashnotes.indexOf(item)+1 }}</v-btn>
                </v-btn-toggle>
            </v-row>
        </v-container>
        </v-dialog>
    </v-card>
</template>

<script setup>
import { defineProps, ref, defineEmits} from 'vue';

const props = defineProps({
    flashnotes: {
        type: Array,
        required: true,
    },
});

const emit = defineEmits(['student-modify-title']);

const modifTitle = ref(false);
const studentTitles = ref(props.flashnotes.map((item) => item.studentTitle));
const flashnotesFiltered = ref(props.flashnotes);
const filterFlashnotes = ref('all');
const isSelected = ref();
const dialog = ref(false);
const newTitleToEmit = ref('');

const changeFilterFlashnotes = () => {
    if (filterFlashnotes.value === 'all') {
        flashnotesFiltered.value = props.flashnotes;
    } else if (filterFlashnotes.value === 'keypoints') {
        flashnotesFiltered.value = props.flashnotes.filter((item) => item.title === 'Key Points');
    } else if (filterFlashnotes.value === 'summary') {
        flashnotesFiltered.value = props.flashnotes.filter((item) => item.title === 'Summary');
    }
}

const openDialogFlashnote = (id) => {
    console.log(id)
    isSelected.value = id;
    dialog.value = true;
}

const refreshCard = () => {
    modifTitle.value = false;
    newTitleToEmit.value = '';

}

const wantToModifyTitle = () => {
    modifTitle.value = true;
}

const studentModifyTitle = () => {
    emit('student-modify-title', isSelected.value, newTitleToEmit.value);
    studentTitles.value[isSelected.value] = newTitleToEmit.value;
    modifTitle.value = false;
    newTitleToEmit.value = '';
    console.log(studentTitles.value[isSelected.value]);
}
</script>

<style scoped>
.center-content {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>