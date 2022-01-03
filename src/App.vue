<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <!-- <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        /> -->
      </div>

      <v-spacer></v-spacer>
      <v-btn text :to="{ name: 'categoria' }">
        <span class="mr-2">Categoria</span>
        <v-icon>mdi-group</v-icon>
      </v-btn>

      <v-btn text :to="{ name: 'producto' }">
        <span class="mr-2">Producto</span>
        <v-icon>mdi-tools</v-icon>
      </v-btn>

      <v-btn text :to="{ name: 'tienda' }">
        <span class="mr-2">Tienda</span>
        <v-icon>mdi-store</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view />
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
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['snackbarState']),
  },
};
</script>
