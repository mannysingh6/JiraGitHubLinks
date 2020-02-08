<template>
  <div>
    <v-app>
      <v-content>
        <div class="bg-overlay" @click="backgroundClicked"></div>
        <div class="d-flex ma-12 pt-12 justify-center" v-observe-visibility="visibilityChanged">
          <v-autocomplete
            class="textbox"
            ref="textbox"
            label="Enter a command"
            :items="listOfCmds"
            filled
            solo
            background-color="white"
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
import { VAutocomplete } from "vuetify/lib";
import { sendRuntimeMessage, Operation } from "../shared/extension-message";

@Component
export default class App extends Vue {
  public searchInput: string | null = "";
  public listOfCmds: string[] = [];

  public async created() {
    const commands = await sendRuntimeMessage<string[]>({
      operation: Operation.GetListOfCommands
    });
    this.listOfCmds = commands || [];
  }

  public backgroundClicked() {
    console.log("background clicked");
    try {
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

      this.searchInput = null;
      (this.$refs["textbox"] as any).setValue("");
      (this.$refs["textbox"] as any).isMenuActive = false;
    });
  }

  public visibilityChanged(
    isVisible: boolean,
    entry: IntersectionObserverEntry
  ) {
    (this.$refs["textbox"] as HTMLInputElement).focus();
  }
}
</script>

<style>
#app {
  font-family: ProximaNova-Regular, "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* color: var(--v-primaryGrey-base); */
  font-size: 14px;
  /* background: none; */
}
.bg-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
}
.textbox {
  max-width: 600px;
}
.v-list-item {
  padding: 0 16px 0 51px;
}
</style>
