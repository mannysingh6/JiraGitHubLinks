<template>
  <v-btn color="primary" depressed large :loading="loading" :disabled="loading" @click="click">
    Sign In With Github
    <v-icon right>mdi-github-circle</v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Emit } from "vue-property-decorator";
import { VBtn, VIcon } from "vuetify/lib";

@Component({
  components: {
    VBtn,
    VIcon
  }
})
export default class LoginBtn extends Vue {
  @Prop() public loading!: boolean;

  @Emit()
  click(event: Event) {
    return event;
  }
}
</script>
