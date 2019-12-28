<template>
  <div class="align-center mt-auto">
    <v-list class dense>
      <v-list-item-group>
        <v-list-item dense :key="0" @click="onSettingsClick()">
          <v-list-item-content>Settings</v-list-item-content>
          <v-list-item-icon>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item dense :key="1" @click="onLogoutClick()">
          <v-list-item-content>Logout</v-list-item-content>
          <v-list-item-icon>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { getPopupApi } from "../popup-api-util";

@Component({
  components: {}
})
export default class Home extends Vue {
  public loading = false;

  public async onSettingsClick() {
    const response: xbrowser.tabs.Tab = await xbrowser.tabs.create({
      url: xbrowser.runtime.getURL("settings.html"),
      active: true
    });

    if (response) {
      window.close();
    }
  }

  public async onLogoutClick() {
    this.loading = true;
    try {
      const popupAPI = await getPopupApi();
      await popupAPI.logout();
      this.$router.replace("/login");
    } catch (err) {
      console.error(err);
    }
    this.loading = false;
  }
}
</script>
