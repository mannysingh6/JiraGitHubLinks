<template>
  <v-app>
    <v-content>
      <div class="main d-flex flex-column flex-grow-1">
        <div
          class="header subtitle-1 font-weight-thin d-flex flex-row px-3 py-1 pt-3 align-center justify-center"
        >
          <img class="logo mr-2" src="./assets/logo.svg" />
        </div>
        <router-view />
      </div>
    </v-content>
  </v-app>
</template>

<style>
#app {
  font-family: ProximaNova-Regular, "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 170px;
  width: 250px;
  color: var(--v-primaryGrey-base);
  font-size: 14px;
  background: white;
  text-align: center;
}
.main {
  height: 100vh;
}
.header {
}
.logo {
  height: 34px;
}
</style>
