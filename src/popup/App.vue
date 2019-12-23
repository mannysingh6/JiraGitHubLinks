<template>
  <v-app>
    <v-content>
      <div class="d-flex flex-column flex-grow-1">
        <div class="subtitle-1 font-weight-light header px-3 py-1">Lenovo Internal Extension</div>
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
  height: 200px;
  width: 240px;
  color: var(--v-primaryGrey-base);
  font-size: 14px;
  background: linear-gradient(180deg, #ffffff 0.06%, #e1e2e3 100%);
  text-align: center;
}
.header {
  background-color: var(--v-primaryGrey-base);
  color: white;
}
</style>
