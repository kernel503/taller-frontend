<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="sidebarMenu = !sidebarMenu"></v-app-bar-nav-icon>
      <v-toolbar-title>Start Biker</v-toolbar-title>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          transition="scale-transition"
          width="200"
        />
      </div>
    </v-app-bar>
    <v-navigation-drawer
      app
      floating
      v-model="sidebarMenu"
      :permanent="sidebarMenu"
      :mini-variant="toggleMini"
      :mini-variant-width="80"
      dark
    >
      <v-list dense>
        <v-list-item>
          <v-list-item-action>
            <v-icon @click.stop="sidebarMenu = !sidebarMenu">mdi-chevron-left</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list-item class="px-2" @click="toggleMini = !toggleMini">
        <v-list-item-avatar>
          <v-icon>mdi-account-outline</v-icon>
        </v-list-item-avatar>
        <v-list-item-content class="text-truncate">
          Nombre Usuario
        </v-list-item-content>
        <v-btn icon small>
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>
      <v-divider></v-divider>
      <v-list class="py-0">
        <v-list-item :to="{ name: 'categoria' }">
          <v-list-item-icon>
            <v-icon dark>mdi-group</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Categorias</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item :to="{ name: 'producto' }">
          <v-list-item-icon>
            <v-icon dark>mdi-tools</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Productos</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item :to="{ name: 'venta' }">
          <v-list-item-icon>
            <v-icon dark>mdi-cash</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Ventas Realizadas</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item :to="{ name: 'tienda' }">
          <v-list-item-icon>
            <v-icon dark>mdi-store</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Tienda</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container class="px-4 py-4 fill-height" fluid>
        <v-row class="fill-height">
          <v-col>
            <transition name="fade">
              <router-view></router-view>
            </transition>
          </v-col>
        </v-row>
      </v-container>

      <v-snackbar
        timeout="3000"
        dark
        right
        bottom
        v-model="snackbarState.show"
        :color="snackbarState.color"
      >
        {{ snackbarState.message }}
      </v-snackbar>
    </v-main>
    <!-- <v-footer v-show="!sidebarMenu">
      <v-col class="text-center py-0 my-1" cols="12">
        {{ new Date().toISOString().slice(0, 10) }} —
        <strong>Aldebaran</strong>
      </v-col>
      <v-col class="text-center py-0 my-0" cols="12">
        <v-btn class="mx-3" @click="sendEmailToAdmin" small>
          Contactar al administrador
          <v-icon color="light-blue darken-4" class="mx-3"
            >mdi-email-send</v-icon
          >
        </v-btn>
      </v-col>
    </v-footer> -->
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      sidebarMenu: false,
      toggleMini: false,
      right: null,
      fab: false,
    };
  },
  computed: {
    ...mapGetters(['snackbarState']),
  },
};
</script>
