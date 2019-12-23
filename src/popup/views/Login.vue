<template>
  <div class="d-flex flex-grow-1 align-center justify-center pa-3">
    <LoginBtn :loading="loading" @click="onLoginClick" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import LoginBtn from "../components/LoginBtn.vue";
import { getPopupApi } from "../popup-api-util";

@Component({
  components: {
    LoginBtn
  }
})
export default class Login extends Vue {
  public loading = false;

  public async onLoginClick() {
    this.loading = true;
    try {
      const popupAPI = await getPopupApi();
      await popupAPI.login();
      this.$router.replace("/");
    } catch (err) {
      console.error(err);
    }
    this.loading = false;
  }
}
</script>
