<template>
  <div class="d-block ma-6" style="max-width: 900px; width:100%;">
    <v-toolbar flat>
      <v-toolbar-title>Commands</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialogOpen" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">Add Command</v-btn>
        </template>
        <v-card>
          <v-form v-model="validForm" @submit.prevent="saveCommand">
            <v-card-title>
              <span class="headline">{{ dialogItemIndex === -1 ? 'New Command' : 'Edit Command' }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="dialogItem.name"
                      :rules="nameRules"
                      label="Command"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="dialogItem.url" :rules="urlRules" label="Url" required></v-text-field>
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
    <v-data-table :headers="headers" :items="commands" class="elevation-1">
      <template v-slot:item.action="{ item }">
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

@Component({
  components: {}
})
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
  public nameRules = [(v: string) => !!v || "Command name is required"];
  public urlRules = [
    (v: string) => !!v || "Url is required",
    (v: string) =>
      validate.validators.url(v, {
        message: "Must be a valid url",
        schemes: [".+"],
        allowLocal: true
      })
  ];

  @Watch("dialogOpen")
  public onDialogOpenChangee(newValue: boolean, oldValue: boolean) {
    newValue || this.closeDialog();
  }

  public async created() {
    this.commands = await LocalStorageManager.getCommands();
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
      this.dialogItemIndex = -1;
    }, 300);
  }

  public saveCommand() {
    if (this.dialogItemIndex > -1) {
      Object.assign(this.commands[this.dialogItemIndex], this.dialogItem);
    } else {
      this.commands.push(this.dialogItem);
    }
    LocalStorageManager.setCommands(this.commands);
    this.closeDialog();
  }
}
</script>
