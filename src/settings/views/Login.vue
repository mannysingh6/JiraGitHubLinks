<template>
  <div class="d-flex flex-column flex-grow-1 align-center justify-center ma-5">
    <div class="mb-10">
      <img class="logo" src="@/assets/logo.svg" height="50" />
    </div>
    <LoginBtn @login-success="onLoginSuccess()" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import LoginBtn from "@/shared/components/LoginBtn.vue";

@Component({
  components: {
    LoginBtn
  }
})
export default class Login extends Vue {
  public async onLoginSuccess() {
    this.$router.replace("/");
  }
}
</script>
