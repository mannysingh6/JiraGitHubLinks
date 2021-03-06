<template>
  <div>
    <v-app>
      <v-content>
        <div class="bg-overlay" @click="close"></div>
        <div class="d-flex ma-12 pt-12 justify-center" v-observe-visibility="visibilityChanged">
          <v-autocomplete
            class="textbox"
            ref="textbox"
            label="Enter a command"
            :items="listOfCmds"
            filled
            solo
            autofocus
            hide-no-data
            prepend-inner-icon="mdi-console"
            :search-input.sync="searchInput"
            :append-icon="null"
            @keyup.enter.prevent="onEnterKeyUp"
          ></v-autocomplete>
        </div>
      </v-content>
    </v-app>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { sendRuntimeMessage, Operation } from "../shared/extension-message";
import { Command } from "../shared/models/command";

@Component
export default class App extends Vue {
  public searchInput: string | null = "";
  public listOfCmds: string[] = [];

  public async created() {
    this.refreshCmds();
  }

  public close() {
    try {
      this.searchInput = null;
      (this.$refs["textbox"] as any).setValue("");
      (this.$refs["textbox"] as any).isMenuActive = false;
      parent.postMessage(
        {
          operation: Operation.ToggleSpotlight
        },
        "*"
      );
    } catch (err) {
      console.error("Failed to dismiss spotlight", err);
    }
  }

  public onEnterKeyUp(event: Event) {
    this.$nextTick(() => {
      sendRuntimeMessage({
        operation: Operation.ExecuteCommand,
        data: { cmd: this.searchInput }
      });
      this.close();
    });
  }

  public visibilityChanged(
    isVisible: boolean,
    entry: IntersectionObserverEntry
  ) {
    this.refreshCmds();
    (this.$refs["textbox"] as HTMLInputElement).focus();
  }

  private async refreshCmds() {
    const commands = await sendRuntimeMessage<Command[]>({
      operation: Operation.GetListOfCommands
    });
    this.listOfCmds = (commands && commands.map(c => c.name)) || [];
    this.listOfCmds = this.listOfCmds.reverse();
  }
}
</script>

<style>
.v-application {
  background: none !important;
}
.bg-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.v-application.theme--light .bg-overlay {
  background: rgba(0, 0, 0, 0.3);
}
.v-application.theme--dark .bg-overlay {
  background: rgba(0, 0, 0, 0.8);
}
.textbox {
  max-width: 600px;
}
.v-list-item {
  padding: 0 16px 0 51px;
}
</style>
