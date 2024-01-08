<template>
  <div>
    <div class="header pb-8 pt-5 d-flex align-items-center profile-header">
      <b-container fluid>
        <span class="mask bg-gradient-success opacity-8"></span>
      </b-container>
    </div>

    <b-container fluid class="mt--6">
      <b-row>
        <b-col xl="12" class="order-xl-1">
          <card>
            <div>
              <b-spinner v-if="isLoading" label="Loading..."></b-spinner>
            </div>

            <b-row align-v="center" slot="header">
              <b-col cols="8">
                <h3 class="mb-0">Adicionar/Editar Assunto</h3>
              </b-col>
            </b-row>

            <b-form @submit.prevent="validateForm">
              <div class="pl-lg-4">
                <b-row>
                  <b-col md="6">
                    <base-input
                      type="text"
                      v-model="assunto.descricao"
                      label="Descriçao"
                      maxlength="20"
                      placeholder="Por favor preencha a descrição do Assunto"
                    >
                    </base-input>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="12" class="text-right">
                    <a
                      href="javascript:void(0);"
                      @click="submitForm"
                      class="btn btn-sm btn-primary"
                      >Salvar</a
                    >
                  </b-col>
                </b-row>
              </div>
            </b-form>
          </card>
        </b-col>
      </b-row>

      <b-card no-body>
        <b-row align-v="center" slot="header">
          <b-col cols="8">
            <h3 class="mb-0">Assuntos Cadastrados</h3>
          </b-col>
        </b-row>
        <el-table
          class="table-responsive table"
          header-row-class-name="thead-light"
          :data="assuntos"
        >
          <el-table-column label="ID" prop="id" min-width="20px">
          </el-table-column>
          <el-table-column label="DESCRIÇÃO" prop="descricao">
          </el-table-column>
          <el-table-column header-align="right" align="right">
            <template slot-scope="{ row }">
              <b-row align-v="center" slot="header">
                <b-col cols="12" sm="12" class="d-flex justify-content-end pr-1">
                  <a
                    href="javascript:void(0);"
                    @click="editAssunto(row)"
                    class="btn btn-sm btn-info"
                    >Editar</a
                  >
               
                  <a
                    href="javascript:void(0);"
                    @click="deleteAssunto(row.id)"
                    class="btn btn-sm btn-warning"
                    >Excluir</a
                  >
                </b-col>
              </b-row>
            </template>
          </el-table-column>
        </el-table>

        <b-card-footer class="py-4 d-flex justify-content-end">
          <b-pagination
            v-model="currentPage"
            :total-rows="totalItems"
            :per-page="perPage"
            @change="fetchAssuntos"
          ></b-pagination>
        </b-card-footer>
      </b-card>
    </b-container></div
></template>
<script>
import { Table, TableColumn } from "element-ui";

export default {
  name: "light-table",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  data() {
    return {
      showSuccessAlert: false,
      showErrorAlert: false,
      showValidationAlert: false,
      isLoading: false,
      assunto: {
        descricao: ""
      },
      assuntos: [],
      fields: ["descricao"],
      currentPage: 1,
      totalItems: 0,
      perPage: 10
    };
  },
  methods: {
    limparCampos() {
      this.assunto = {
        descricao: ""
      }
    },
    fetchAssuntos(page = 1) {
      this.isLoading = true;
      this.$http
        .get(`/assunto?page=${page}`)
        .then(response => {
          this.assuntos = response.data.data;
          this.totalItems = response.data.meta.total; // Total de itens para a paginação
          this.isLoading = false;
        })
        .catch(error => {
          this.showErrorAlert = true;
          console.error(error);
        });
    },
    validateForm() {
      if (!this.assunto.descricao) {
        this.$swal.fire({
          title: "Atenção!",
          icon: "warning",
          text: "Campos Obrigatórios nao preenchidos",
          showConfirmButton: false,
          timer: 1500
        });
        return false;
      }
      return true;
    },
    async submitForm() {
      if (!this.validateForm()) return;

      try {
        const method = this.assunto.id ? "put" : "post";
        const url = this.assunto.id
          ? `/assunto/${this.assunto.id}`
          : "/assunto";

        this.$http[method](url, this.assunto)
          .then(() => {
            this.fetchAssuntos();
            this.assunto = { descricao: "" };
            this.$swal.fire({
              title: "Sucesso!",
              icon: "success",
              text: "Operação realizada com sucesso",
              showConfirmButton: false,
              timer: 1500
            });
            this.limparCampos()
          })
          .catch(error => {
            this.showErrorAlert = true;
          });
      } catch (error) {
        console.error(error);
        this.showErrorAlert = true;
      }
    },
    editAssunto(assunto) {
      this.assunto = { ...assunto };
    },
    deleteAssunto(id) {
      this.$swal({
        title: "Deseja Remover esse registro?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim",
        cancelButtonText: "Não"
      }).then(result => {
        if (result.isConfirmed) {
          this.$http
            .delete(`/assunto/${id}`)
            .then(() => {
              this.$swal.fire({
                title: "Excluído!",
                icon: "success",
                text: "Assunto removido com sucesso.",
                showConfirmButton: false,
                timer: 1500
              });
              this.fetchAssuntos();
            })
            .catch(error => {
              if (error.response && error.response.data) {
                this.$swal.fire({
                  title: "Não foi possivel",
                  icon: "info",
                  text: "Existem livros atribuídos a essse Assunto.",
                  showConfirmButton: true
                });
              } else {
                console.error("Erro ao excluir Assunto:", error);
              }
            })
            .finally(() => {
              this.isLoading = false;
            });
        }
      });
    },
    hideAlerts() {
      setTimeout(() => {
        this.showSuccessAlert = false;
        this.showErrorAlert = false;
      }, 3000);
    }
  },
  mounted() {
    this.fetchAssuntos(); // Carregar os assuntos quando o componente é montado
  }
};
</script>
<style></style>
