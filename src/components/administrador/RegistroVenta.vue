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
    <template v-slot:item.actions="{ item }">
      <v-icon @click="eliminarRegistro(item)">
        mdi-delete
      </v-icon>
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
      // {
      //   text: 'Identificador',
      //   align: 'start',
      //   sortable: false,
      //   value: 'id',
      // },
      { text: 'Cliente', value: 'nombre_cliente' },
      { text: 'Fecha venta', value: 'fecha_venta' },
      { text: 'Categoria', value: 'categoria' },
      { text: 'Producto', value: 'producto' },
      { text: 'Cantidad vendido', value: 'cantidad' },
      { text: 'Precio venta', value: 'precio_venta' },
      { text: 'Importe $', value: 'importe' },
      { text: 'Eliminar', value: 'actions' },
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
        .from('ventas_realizadas')
        .select();

      if (error) {
        this.productos = [];
        this.SNACKBAR_UPDATE({ message: `Error en la petición! ${error.message}`, color: 'red' });
      } else {
        this.ventas = data;
      }

      this.$nextTick(() => {
        this.loading = false;
      });
    },

    async eliminarRegistro(venta) {
      const { id } = venta;
      // eslint-disable-next-line no-alert
      const eliminar = window.confirm(`¿Desea eliminar el registro ${id}?`);
      if (eliminar) {
        // eslint-disable-next-line no-unused-vars
        const { data, error } = await supabase
          .from('venta')
          .delete()
          .match({ id });

        if (error) {
          this.SNACKBAR_UPDATE({ message: `Error en la petición! ${error.message}`, color: 'red' });
        } else {
          this.initialize();
        }
      }
    },
  },
};
</script>

<style lang=""></style>
