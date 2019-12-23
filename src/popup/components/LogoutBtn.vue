<template>
  <v-btn color="primary" depressed large :loading="loading" :disabled="loading" @click="click">
    <v-icon left>mdi-logout-variant</v-icon>Logout
  </v-btn>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Emit } from "vue-property-decorator";
import { VBtn } from "vuetify/lib";

@Component({
  components: {
    VBtn
  }
})
export default class LogoutBtn extends Vue {
  @Prop() public loading = false;

  @Emit()
  click(event: Event) {
    return event;
  }

  public onClick(event: Event) {
    this.click(event);
  }
}
</script>
