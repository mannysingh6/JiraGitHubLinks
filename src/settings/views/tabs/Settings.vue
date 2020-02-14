<template>
  <div class="d-block ma-6 body-1" style="max-width: 500px; width:100%;">
    <v-row>
      <v-col cols="12">
        <h1>Settings</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="jiraUrl"
          @input="onJiraUrlChange()"
          label="Jira Url"
          hint="Base url for your JIRA project"
          persistent-hint
          outlined
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="projectKeys"
          @input="onProjectKeysChange"
          @keypress="onProjectKeysEvent"
          label="Project Keys"
          hint="List of JIRA project keys (separated by comma)"
          persistent-hint
          outlined
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="defaultKey"
          @input="onDefaultKeyChange()"
          @keypress="onDefaultKeyEvent"
          label="Default Project Key"
          hint="Your default JIRA project"
          persistent-hint
          outlined
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field
          :value="spotlightExtCommand && spotlightExtCommand.shortcut"
          label="Toggle Spotlight Shortcut"
          hint="Shortcut used to launch spotlight"
          persistent-hint
          outlined
          readonly
        >
          <template v-slot:append>
            <v-btn class="shortcut-btn" text @click="onChangeShortcutBtnClick">Change Shortcut</v-btn>
          </template>
        </v-text-field>
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
  public projectKeys = "";
  public defaultKey = "";
  public spotlightExtCommand: browser.commands.Command | null = null;

  public async created() {
    const [jiraUrl, projectKeys, defaultKey, extCommands] = await Promise.all([
      LocalStorageManager.getJiraUrl(),
      LocalStorageManager.getProjectKeys(),
      LocalStorageManager.getDefaultKey(),
      xbrowser.commands.getAll()
    ]);
    this.jiraUrl = jiraUrl;
    this.projectKeys = projectKeys;
    this.defaultKey = defaultKey;
    this.spotlightExtCommand =
      extCommands.find(cmd => cmd.name === "toggle-spotlight") || null;
  }

  public onJiraUrlChange() {
    LocalStorageManager.setJiraUrl(this.jiraUrl);
  }

  public onProjectKeysChange() {
    LocalStorageManager.setProjectKeys(this.projectKeys);
  }

  public onDefaultKeyChange() {
    LocalStorageManager.setDefaultKey(this.defaultKey);
  }

  public onProjectKeysEvent(event: KeyboardEvent) {
    const char = String.fromCharCode(event.keyCode);
    if (!/[A-Z,]+/gi.test(char)) {
      event.preventDefault();
    }
  }

  public onDefaultKeyEvent(event: KeyboardEvent) {
    const char = String.fromCharCode(event.keyCode);
    if (!/[A-Z]+/gi.test(char)) {
      event.preventDefault();
    }
  }

  public onChangeShortcutBtnClick() {
    xbrowser.tabs.create({ url: "chrome://extensions/shortcuts" });
  }
}
</script>

<style scoped>
.shortcut-btn {
  margin-top: -6px;
}
</style>
