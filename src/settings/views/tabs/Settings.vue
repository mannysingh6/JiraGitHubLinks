<template>
  <div class="d-block ma-6" style="max-width: 500px; width:100%;">
    <v-row>
      <v-col cols="12">
        <h1>Settings</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field v-model="jiraUrl" @input="onJiraUrlChange()" label="Jira Url" outlined></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { LocalStorageManager } from "@/shared/local-storage-manager";

@Component({
  components: {}
})
export default class Settings extends Vue {
  public jiraUrl = "";

  public async created() {
    this.jiraUrl = await LocalStorageManager.getJiraUrl();
  }

  public onJiraUrlChange() {
    LocalStorageManager.setJiraUrl(this.jiraUrl);
  }
}
</script>
