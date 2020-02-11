<template>
  <div class="d-flex flex-grow-1 align-center justify-center pa-3">
    <LoginBtn @login-success="onLoginSuccess" />
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
  public onLoginSuccess() {
    this.$router.replace("/");
  }
}
</script>
