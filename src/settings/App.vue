<template>
  <v-app>
    <v-content>
      <v-container class="pa-0" fluid>
        <router-view />
      </v-container>
    </v-content>
  </v-app>
</template>

<style>
#app {
  font-family: ProximaNova-Regular, "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--v-primaryGrey-base);
  font-size: 14px;
  background: white;
}
</style>
