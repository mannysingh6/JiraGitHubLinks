<template>
  <v-app>
    <v-content>
      <div class="main d-flex flex-column flex-grow-1">
        <div
          class="header subtitle-1 font-weight-thin d-flex flex-row px-3 py-1 pt-3 align-center justify-center"
        >
          <img class="logo mr-2" src="@/shared/assets/logo.svg" />
        </div>
        <router-view />
      </div>
    </v-content>
  </v-app>
</template>

<style>
#app {
  height: 170px;
  width: 250px;
}
.main {
  height: 100vh;
}
.logo {
  height: 34px;
}
</style>
