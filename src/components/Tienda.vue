<template>
  <v-data-table
    :headers="headers"
    :items="productos"
    class="elevation-1"
    :loading="loading"
    :search="search"
    no-results-text="No existen registros!"
    no-data-text="No hay datos!"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Realizar Venta</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
        ></v-text-field>
        <v-dialog v-model="dialog" max-width="650px">
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
              <v-spacer></v-spacer>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-autocomplete
                        :items="categorias"
                        disabled
                        v-model="editedItem.categoria_id"
                        label="Categoria"
                        item-text="nombre"
                        item-value="id"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        disabled
                        :rules="regla"
                        v-model="editedItem.nombre"
                        label="Nombre del producto"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        :rules="regla"
                        v-model="editedItem.nombre_cliente"
                        label="Nombre del cliente"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.cantidad"
                        label="Cantidad a vender"
                        :rules="enteroRegla"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6" md="6">
                      <v-text-field
                        disabled
                        v-model="editedItem.precio_venta"
                        label="Precio venta"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6" md="6">
                      <v-text-field
                        disabled
                        :value="importeCalculado"
                        label="Importe"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Cancelar
              </v-btn>
              <v-btn color="blue darken-1" text @click="save">
                Guardar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.stock="{ item }">
      <v-chip :color="getColor(item.stock)" dark>
        {{ item.stock }}
      </v-chip>
    </template>
    <template v-slot:item.actions="{ item }">
      <template v-if="item.stock">
        <v-icon class="mr-2" @click="editItem(item)">
          mdi-cart
        </v-icon>
      </template>
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
import supabase from '../supabase/index';

export default {
  name: 'Tienda',
  data: () => ({
    valid: true,
    search: '',
    loading: false,
    regla: [(v) => !!v || 'Campo requerido!', (v) => (!!v && !!v.trim()) || 'Debe ser un texto!'],
    enteroRegla: [
      (v) => !!v || 'Campo requerido!',
      (v) => Number.isInteger(+v) || 'Debe ser un entero!',
      (v) => +v > 0 || 'Debe ser mayor a cero!',
    ],
    dialog: false,
    headers: [
      {
        text: 'Identificador',
        align: 'start',
        sortable: false,
        value: 'id',
      },
      { text: 'Categoria', value: 'categoria.nombre' },
      { text: 'Nombre', value: 'nombre' },
      { text: 'Precio venta $', value: 'precio_venta' },
      { text: ' Stock', value: 'stock' },
      {
        text: 'Acciones',
        value: 'actions',
        sortable: false,
        align: 'center',
      },
    ],
    categorias: [],
    productos: [],
    editedIndex: -1,
    editedItem: {
      producto_id: '',
      cantidad: '',
      precio_unitario: '',
      importe: '',
      nombre_cliente: '',
    },
    defaultItem: {
      producto_id: '',
      cantidad: '',
      precio_unitario: '',
      importe: '',
      nombre_cliente: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? '' : 'Agregar venta';
    },

    importeCalculado() {
      if (!this.editedItem.cantidad) return 0;

      const importe = this.editedItem.precio_venta * this.editedItem.cantidad;

      return Number.isNaN(importe) ? 0 : importe.toFixed(2);
    },
  },

  watch: {
    dialog(val) {
      // eslint-disable-next-line no-unused-expressions
      val || this.close();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    ...mapMutations(['SNACKBAR_UPDATE']),

    async initialize() {
      this.loading = true;
      this.fetchCategorias();

      const { data, error } = await supabase
        .from('producto')
        .select('categoria (nombre), *')
        .order('id', { ascending: true });

      if (error) {
        this.productos = [];
        this.SNACKBAR_UPDATE({ message: `Error en la petición! ${error.message}`, color: 'red' });
      } else {
        this.productos = data;
      }

      this.$nextTick(() => {
        this.loading = false;
      });
    },

    async fetchCategorias() {
      const { data, error } = await supabase
        .from('categoria')
        .select()
        .order('id', { ascending: true });

      if (error) {
        this.categorias = [];
        this.SNACKBAR_UPDATE({ message: `Error en la petición! ${error.message}`, color: 'red' });
      } else {
        this.categorias = data;
      }
    },

    formIsValid() {
      return this.$refs.form.validate();
    },

    editItem(item) {
      this.editedIndex = this.productos.indexOf(item);
      this.editedItem = { ...item };
      this.dialog = true;
    },

    close() {
      this.dialog = false;

      this.$nextTick(() => {
        // this.editedItem = { ...this.defaultItem };
        this.$refs.form.reset();
        this.$refs.form.resetValidation();
        this.editedIndex = -1;
      });
    },

    getColor(cantidad) {
      if (cantidad <= 5) return 'red';
      if (cantidad > 5 && cantidad <= 15) return 'orange';
      return 'green';
    },

    async save() {
      if (!this.formIsValid()) return;

      const {
        // eslint-disable-next-line camelcase
        id,
        stock,
        cantidad,
        // eslint-disable-next-line camelcase
        precio_venta,
        // eslint-disable-next-line camelcase
        nombre_cliente,
      } = this.editedItem;

      const stockCalculado = stock - cantidad;
      // eslint-disable-next-line camelcase
      const importe = (+precio_venta * +cantidad).toFixed(2);

      if (cantidad > stock) {
        this.SNACKBAR_UPDATE({
          message: 'No hay suficiente producto en inventario!',
          color: 'red',
        });
      } else {
        // eslint-disable-next-line no-unused-vars
        const { data, error } = await supabase
          .from('producto')
          .update({ stock: stockCalculado })
          .match({ id });
        // eslint-disable-next-line no-unused-vars
        const { data: dataInsert, error: errorInsert } = await supabase.from('venta').insert([
          {
            producto_id: id,
            cantidad,
            precio_venta,
            importe,
            nombre_cliente: nombre_cliente.trim(),
          },
        ]);

        if (error || errorInsert) {
          this.SNACKBAR_UPDATE({
            message: 'Error al guardar el registro',
            color: 'red',
          });
        } else {
          this.SNACKBAR_UPDATE({ message: 'Registros actualizados!', color: 'indigo' });
          this.initialize();
          this.close();
        }
      }
    },
  },
};
</script>

<style lang=""></style>
