<template>
  <div class="d-flex">
    <v-navigation-drawer permanent height="100vh" style="flex-shrink: 0">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            <div>
              <img class="logo" src="@/shared/assets/logo.svg" />
            </div>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list>
        <v-list-item-group color="primary" v-model="selectedNavItem" mandatory>
          <v-list-item :key="0" link to="/settings">
            <v-list-item-icon>
              <v-icon>mdi-settings</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item :key="1" link to="/commands">
            <v-list-item-icon>
              <v-icon>mdi-console</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Commands</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class Home extends Vue {
  public selectedNavItem = 0;
}
</script>
