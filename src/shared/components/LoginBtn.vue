<template>
  <v-btn color="primary" text large :loading="loading" :disabled="loading" @click="onLoginBtnClick">
    Sign In With Github
    <v-icon right>mdi-github-circle</v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Emit } from "vue-property-decorator";
import { VBtn, VIcon } from "vuetify/lib";
import { getPopupApi } from "../../popup/popup-api-util";

@Component({
  components: {
    VBtn,
    VIcon
  }
})
export default class LoginBtn extends Vue {
  public loading = false;

  @Emit()
  public loginSuccess() {
    return true;
  }

  @Emit()
  public loginFailure() {
    return true;
  }

  public async onLoginBtnClick(event: Event) {
    this.loading = true;
    try {
      const popupAPI = await getPopupApi();
      const success = await popupAPI.login();
      if (success) {
        this.loginSuccess();
      } else {
        this.loginFailure();
      }
    } catch (err) {
      console.error(err);
      this.loginFailure();
    }
    this.loading = false;
  }
}
</script>
