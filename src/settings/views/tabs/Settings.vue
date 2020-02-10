<template>
  <div class="d-block ma-6 body-1" style="max-width: 500px; width:100%;">
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
    <v-row align="center" v-if="spotlightExtCommand">
      <v-col cols="5">Toggle Spotlight Shortcut</v-col>
      <v-col cols="3">{{ spotlightExtCommand.shortcut }}</v-col>
      <v-col cols="4">
        <v-btn text @click="onChangeShortcutBtnClick">Change Shortcut</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { LocalStorageManager } from "@/shared/local-storage-manager";

@Component
export default class Settings extends Vue {
  public jiraUrl = "";
  public spotlightExtCommand: browser.commands.Command | null = null;

  public async created() {
    const [jiraUrl, extCommands] = await Promise.all([
      LocalStorageManager.getJiraUrl(),
      xbrowser.commands.getAll()
    ]);
    this.jiraUrl = jiraUrl;
    this.spotlightExtCommand =
      extCommands.find(cmd => cmd.name === "toggle-spotlight") || null;
  }

  public onJiraUrlChange() {
    LocalStorageManager.setJiraUrl(this.jiraUrl);
  }

  public onChangeShortcutBtnClick() {
    xbrowser.tabs.create({ url: "chrome://extensions/shortcuts" });
  }
}
</script>
