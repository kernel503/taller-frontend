<template>
  <v-data-table
    :headers="headers"
    :items="ventas"
    class="elevation-1"
    :loading="loading"
    :search="search"
    no-results-text="No existen registros!"
    no-data-text="No hay datos!"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Registro de ventas</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
        ></v-text-field>
      </v-toolbar>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>
<script>
import { mapMutations } from 'vuex';
import supabase from '../../supabase/index';

export default {
  data: () => ({
    search: '',
    loading: false,
    headers: [
      {
        text: 'Identificador',
        align: 'start',
        sortable: false,
        value: 'id',
      },
      { text: 'Producto', value: 'producto.nombre' },
      { text: 'Cantidad vendido', value: 'cantidad' },
      { text: 'Precio venta', value: 'precio_venta' },
      { text: 'Importe $', value: 'importe' },
      { text: 'Fecha venta', value: 'created_at' },
    ],
    ventas: [],
  }),

  created() {
    this.initialize();
  },

  methods: {
    ...mapMutations(['SNACKBAR_UPDATE']),

    async initialize() {
      this.loading = true;

      const { data, error } = await supabase
        .from('venta')
        .select('producto (nombre), *')
        .order('id', { ascending: true });

      if (error) {
        this.productos = [];
        this.SNACKBAR_UPDATE({ message: `Error en la petición! ${error.message}`, color: 'red' });
      } else {
        console.log(data);
        this.ventas = data;
      }

      this.$nextTick(() => {
        this.loading = false;
      });
    },
  },
};
</script>

<style lang=""></style>
