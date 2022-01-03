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
        <v-toolbar-title>Producto</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="650px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Agregar producto
            </v-btn>
          </template>
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
                        :rules="enteroRegla"
                        :items="categorias"
                        v-model="editedItem.categoria_id"
                        label="Categoria"
                        item-text="nombre"
                        item-value="id"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        :rules="regla"
                        v-model="editedItem.nombre"
                        label="Nombre del producto"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        :rules="enteroRegla"
                        v-model="editedItem.stock"
                        label="Cantidad disponible"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        :rules="floatRegla"
                        v-model="editedItem.precio_compra"
                        label="Precio compra"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        :rules="floatRegla"
                        v-model="editedItem.precio_venta"
                        label="Precio venta"
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
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">¿Desea eliminar este registro?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">Aceptar</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
     <template v-slot:item.stock="{ item }">
      <v-chip
        :color="getColor(item.stock)"
        dark
      >
        {{ item.stock }}
      </v-chip>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon  class="mr-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon  @click="deleteItem(item)">
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
    valid: true,
    search: '',
    loading: false,
    regla: [(v) => !!v || 'Campo requerido'],
    enteroRegla: [
      (v) => !!v || 'Campo requerido',
      (v) => Number.isInteger(+v) || 'Debe ser un entero',
      (v) => (+v >= 0) || 'Minimo es cero',
    ],
    floatRegla: [
      (v) => !!v || 'Campo requerido',
      (v) => !!+v || 'Debe ser un número',
      (v) => +v > 0 || 'Debe ser mayor que cero',
    ],
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: 'Identificador',
        align: 'start',
        sortable: false,
        value: 'id',
      },
      { text: 'Categoria', value: 'categoria.nombre' },
      { text: 'Nombre', value: 'nombre' },
      { text: 'Precio compra $', value: 'precio_compra' },
      { text: 'Precio venta $', value: 'precio_venta' },
      { text: ' Stock', value: 'stock' },
      { text: 'Acciones', value: 'actions', sortable: false },
    ],
    categorias: [],
    productos: [],
    editedIndex: -1,
    editedItem: {
      categoria_id: '',
      nombre: '',
      precio_compra: '',
      precio_venta: '',
      stock: '',
    },
    defaultItem: {
      categoria_id: '',
      nombre: '',
      precio_compra: '',
      precio_venta: '',
      stock: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo producto' : 'Editar producto';
    },
  },

  watch: {
    dialog(val) {
      // eslint-disable-next-line no-unused-expressions
      val || this.close();
    },
    dialogDelete(val) {
      // eslint-disable-next-line no-unused-expressions
      val || this.closeDelete();
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

    deleteItem(item) {
      this.editedIndex = this.productos.indexOf(item);
      this.editedItem = { ...item };
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      const { id } = this.editedItem;

      // eslint-disable-next-line no-unused-vars
      const { data, error } = await supabase
        .from('producto')
        .delete()
        .match({ id });

      if (error) {
        this.SNACKBAR_UPDATE({ message: `Error en la petición! ${error.message}`, color: 'red' });
      } else {
        this.SNACKBAR_UPDATE({ message: 'Elemento eliminado!', color: 'indigo' });
      }

      this.initialize();
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.$refs.form.reset();
        this.$refs.form.resetValidation();
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.$refs.form.reset();
        this.$refs.form.resetValidation();
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },

    getColor(cantidad) {
      if (cantidad <= 5) return 'red';
      if (cantidad <= 10) return 'orange';
      return 'green';
    },

    async save() {
      if (!this.formIsValid()) return;

      let action = null;

      if (this.editedIndex > -1) {
        const {
          // eslint-disable-next-line camelcase
          id, nombre, precio_venta, precio_compra, categoria_id, stock,
        } = this.editedItem;
        action = await supabase
          .from('producto')
          .update({
            // eslint-disable-next-line camelcase
            nombre, precio_venta: +precio_venta, precio_compra: +precio_compra, categoria_id, stock,
          })
          .match({ id });
      } else {
        action = await supabase.from('producto').insert([this.editedItem]);
      }

      // eslint-disable-next-line no-unused-vars
      const { data, error } = action;

      if (error) {
        this.SNACKBAR_UPDATE({ message: `Error en la petición! ${error.message}`, color: 'red' });
      } else {
        this.SNACKBAR_UPDATE({ message: 'Registros actualizados!', color: 'indigo' });
      }

      this.initialize();
      this.close();
    },
  },
};
</script>

<style lang=""></style>
