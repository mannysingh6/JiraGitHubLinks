<template>
  <div class="d-block pa-6" style="max-width: 900px; width:100%; height: 100vh; overflow: scroll">
    <v-data-table
      :headers="headers"
      :items="commands"
      :footer-props="{'items-per-page-options':[5, 10, 25, 50]}"
      :options="{ itemsPerPage: 25 }"
      class="elevation-1 data-table"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <h1>Commands</h1>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialogOpen" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">Add Command</v-btn>
            </template>
            <v-card>
              <v-form ref="form" v-model="validForm" @submit.prevent="saveCommand">
                <v-card-title>
                  <span
                    class="headline"
                  >{{ dialogItemIndex === -1 ? 'New Command' : 'Edit Command' }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="dialogItem.name"
                          :rules="nameRules()"
                          label="Command"
                          autocomplete="off"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="dialogItem.url"
                          :rules="urlRules()"
                          label="Url"
                          autocomplete="off"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="closeDialog">Cancel</v-btn>
                  <v-btn text type="submit" :disabled="!validForm">Save</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.name="{ item }">
        <div class="name-cell" v-line-clamp="1">{{ item.name }}</div>
      </template>
      <template v-slot:item.url="{ item }">
        <div v-line-clamp="2">{{ item.url }}</div>
      </template>
      <template v-slot:item.action="{ item }">
        <div class="actions-cell">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon small class="mr-2" v-on="on" @click="editCommand(item)">mdi-pencil</v-icon>
            </template>
            <span>Edit</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon small v-on="on" @click="deleteCommand(item)">mdi-delete</v-icon>
            </template>
            <span>Delete</span>
          </v-tooltip>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Command } from "@/shared/models/command";
import { LocalStorageManager } from "@/shared/local-storage-manager";
import { Watch } from "vue-property-decorator";
import validate from "validate.js";

@Component
export default class Commands extends Vue {
  public dialogOpen = false;
  public headers = [
    { text: "Command", value: "name" },
    { text: "Url", value: "url" },
    { text: "Actions", value: "action", sortable: false }
  ];
  public commands: Command[] = [];

  public defaultCommand: Command = {
    name: "",
    url: ""
  };
  public dialogItem: Command = Object.assign({}, this.defaultCommand);
  public dialogItemIndex: number = -1;

  public validForm = false;
  public pagination = {
    rowsPerPage: 30
  };

  @Watch("dialogOpen")
  public onDialogOpenChange(newValue: boolean, oldValue: boolean) {
    newValue || this.closeDialog();
  }

  public nameRules() {
    return [
      (v: string) => !!v || "Command name is required",
      (v: string) => {
        const old = this.commands[this.dialogItemIndex];
        return (
          !this.commands.find(
            c => c.name === v && (old ? c.name !== old.name : true)
          ) || "Must be a unique name"
        );
      }
    ];
  }

  public urlRules() {
    return [
      (v: string) => !!v || "Url is required",
      (v: string) =>
        validate.validators.url(v, {
          message: "Must be a valid url",
          schemes: [".+"],
          allowLocal: true
        }) || true
    ];
  }

  public async created() {
    this.commands = (await LocalStorageManager.getCommands()).reverse();
  }

  public editCommand(command: Command) {
    this.dialogItemIndex = this.commands.indexOf(command);
    this.dialogItem = Object.assign({}, command);
    this.dialogOpen = true;
  }

  public deleteCommand(command: Command) {
    const index = this.commands.indexOf(command);
    const result = confirm("Are you sure you want to delete this command?");
    if (result) {
      this.commands.splice(index, 1);
      LocalStorageManager.setCommands(this.commands);
    }
  }

  public closeDialog() {
    this.dialogOpen = false;
    setTimeout(() => {
      this.dialogItem = Object.assign({}, this.defaultCommand);
      (this.$refs.form as HTMLFormElement).reset();
      this.dialogItemIndex = -1;
    }, 300);
  }

  public saveCommand() {
    if (this.dialogItemIndex > -1) {
      Object.assign(this.commands[this.dialogItemIndex], this.dialogItem);
    } else {
      this.commands.unshift(this.dialogItem);
    }
    LocalStorageManager.setCommands(this.commands);
    this.closeDialog();
  }
}
</script>

<style scoped>
.name-cell {
  min-width: 160px;
}
.actions-cell {
  white-space: nowrap;
}
</style>
