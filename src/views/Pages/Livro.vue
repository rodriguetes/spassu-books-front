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
                <h3 class="mb-0">Adicionar/Editar Livro</h3>
              </b-col>
            </b-row>

            <b-form @submit.prevent="validateForm">
              <div class="pl-lg-4">
                <b-row>
                  <b-col md="5">
                    <base-input
                      type="text"
                      maxlength="40"
                      v-model="livro.titulo"
                      label="Titulo"
                      placeholder="Por favor preencha o titulo do Livro"
                    >
                    </base-input>                    
                  </b-col>
                  <b-col md="6" class="pt-10 col-md-6 d-flex align-items-center">                    
                      <a href="#!" class="btn btn-sm btn-default"
                        @click="gerarTituloIA"
                        >Gerar Titulo via IA</a 
                      >                    
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="6">
                    <base-input
                      type="text"
                      maxlength="40"
                      v-model="livro.editora"
                      label="Editora"
                      placeholder="Por favor preencha a editora do Livro"
                    >
                    </base-input>
                  </b-col>
                  <b-col md="6">
                    <base-input
                      type="text"
                      v-model="livro.edicao"
                      label="Edição"
                      v-mask="'#####'"
                      placeholder="Por favor preencha a edição do Livro"
                    >
                    </base-input>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="6">
                    <base-input
                      type="text"
                      v-model="livro.ano_publicacao"
                      maxlength="4"
                      label="Ano Publicação"
                      placeholder="Por favor preencha Ano Publicação do Livro"
                    >
                    </base-input>
                  </b-col>
                  <b-col md="6">
                    <span placeholder="Por favor preencha a edição do Livro"
                      ><fieldset class="form-group" id="__BVID__129">
                        <div
                          tabindex="-1"
                          role="group"
                          class="bv-no-focus-ring"
                        >
                          <label class="form-control-label">
                            Valor
                          </label>
                          <div class="has-label">
                            <money
                              v-model="livro.valor"
                              :config="moneyConfig"
                              placeholder="Por favor preencha a edição do Livro"
                              class="form-control"
                              valid="true"
                            ></money>
                          </div>
                        </div></fieldset
                    ></span>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="6">
                    <!-- Seletor Múltiplo para Autores -->
                    <b-form-group
                      label="Autores"
                      description="Selecione um ou mais autores"
                    >
                      <b-form-select
                        v-model="livro.autores"
                        :options="autoresDisponiveis"
                        multiple
                      ></b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col md="6">
                    <!-- Seletor Múltiplo para Assuntos -->
                    <b-form-group
                      label="Assuntos"
                      description="Selecione um ou mais assuntos"
                    >
                      <b-form-select
                        v-model="livro.assuntos"
                        :options="assuntosDisponiveis"
                        multiple
                        class="seu-form-select"
                      ></b-form-select>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="12" class="text-right">
                    <a
                      href="#!"
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
            <h3 class="mb-0">Livros Cadastrados</h3>
          </b-col>
        </b-row>
        <el-table
          class="table-responsive table"
          header-row-class-name="thead-light"
          :data="livros"
        >
          <el-table-column label="ID" prop="id"> </el-table-column>
          <el-table-column label="TITULO" prop="titulo"> </el-table-column>
          <el-table-column label="EDITORA" prop="editora"> </el-table-column>
          <el-table-column label="EDIÇÃO" prop="edicao"> </el-table-column>
          <el-table-column label="ANO PUBLICAÇÃO" prop="anoPublicacao">
          </el-table-column>
          <el-table-column label="VALOR" prop="valor"> </el-table-column>
          <el-table-column>
            <template slot-scope="{ row }">
              <b-row align-v="center" slot="header">
                <b-col
                  cols="12"
                  sm="12"
                  class="d-flex justify-content-end pr-1"
                >
                  <a
                    href="#!"
                    @click="editLivro(row)"
                    class="btn btn-sm btn-info"
                    >Editar</a
                  >
                  <a
                    href="#!"
                    @click="deleteLivro(row.id)"
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
            @change="fetchLivros"
          ></b-pagination>
        </b-card-footer>
      </b-card>
    </b-container>
  </div>
</template>
<script>
import { Table, TableColumn } from "element-ui";
import { mask } from "vue-the-mask";
import { Money } from "v-money";

export default {
  name: "light-table",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    Money
  },
  directives: {
    mask
  },
  data() {
    return {
      showSuccessAlert: false,
      showErrorAlert: false,
      showValidationAlert: false,
      isLoading: false,
      localValue: [],
      moneyConfig: {
        decimal: ".",
        thousands: "",
        prefix: "R$ ",
        suffix: " #",
        precision: 2,
        masked: false /* doesn't work with directive */
      },
      livro: {
        titulo: "",
        editora: "",
        edicao: "",
        ano_publicacao: 2023,
        valor: 0,
        autores: [],
        assuntos: []
      },
      autoresDisponiveis: [],
      assuntosDisponiveis: [],
      livros: [],
      fields: ["descricao"],
      currentPage: 1,
      totalItems: 0,
      perPage: 10
    };
  },
  methods: {
    limparCampos() {
      this.livro = {
        titulo: "",
        editora: "",
        edicao: "",
        ano_publicacao: 2023,
        valor: 0,
        autores: [],
        assuntos: []
      };
    },
    fetchLivros(page = 1) {
      this.isLoading = true;
      this.$http
        .get(`/livro?page=${page}`)
        .then(response => {
          this.livros = response.data.data;
          this.totalItems = response.data.meta.total;
          this.isLoading = false;
        })
        .catch(error => {
          this.showErrorAlert = true;
          console.error(error);
        });
    },
    fetchOpcoes() {
      Promise.all([
        this.$http.get("/autor?paginate=false"),
        this.$http.get("/assunto?paginate=false")
      ])
        .then(([respostaAutores, respostaAssuntos]) => {
          this.autoresDisponiveis = respostaAutores.data.data.map(autor => ({
            value: autor.id,
            text: autor.nome
          }));
          this.assuntosDisponiveis = respostaAssuntos.data.data.map(
            assunto => ({ value: assunto.id, text: assunto.descricao })
          );
        })
        .catch(error => {
          console.error("Erro ao buscar autores e assuntos:", error);
        });
    },
    validateForm() {
      if (
        !this.livro.titulo ||
        !this.livro.editora ||
        !this.livro.ano_publicacao ||
        !this.livro.valor ||
        this.livro.autores.length === 0 ||
        this.livro.assuntos.length === 0
      ) {
        this.$swal.fire({
          title: "Atenção!",
          icon: "warning",
          text: "Campos Obrigatórios não preenchidos",
          showConfirmButton: false,
          timer: 1500
        });
        return false;
      }
      return true;
    },
    formatarValorParaVmoney(valor) {
      // Converta o valor para float
      const valorNumerico = parseFloat(valor);

      // Verifique se 'valorNumerico' é realmente um número
      if (!isNaN(valorNumerico)) {
        // Formate o número para o estilo de moeda desejado
        return valorNumerico
          .toFixed(2)
          .replace(".", ",")
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      } else {
        // Retorne um valor padrão ou lide com o erro de forma adequada
        return "R$ 0,00";
      }
    },
    async submitForm() {
      if (!this.validateForm()) return;

      try {
        const method = this.livro.id ? "put" : "post";
        const url = this.livro.id ? `/livro/${this.livro.id}` : "/livro";

        if (typeof this.livro.valor !== "number" || isNaN(this.livro.valor)) {
          this.livro.valor = Number.parseFloat(this.livro.valor) || 0;
        }

        this.$http[method](url, this.livro)
          .then(() => {
            this.fetchLivros();
            this.livro = { descricao: "" };
            this.$swal.fire({
              title: "Sucesso!",
              icon: "success",
              text: "Operação realizada com sucesso",
              showConfirmButton: false,
              timer: 1500
            });
            this.limparCampos();
          })
          .catch(error => {
            this.showErrorAlert = true;
          });
      } catch (error) {
        console.error(error);
        this.showErrorAlert = true;
      }
    },
    editLivro(livro) {
      this.livro = { ...livro };
      this.livro.ano_publicacao = livro.anoPublicacao;
      this.livro.valor = parseFloat(livro.valor) || 0;
      // this.livro.valor = parseFloat(10.00);

      this.livro.autores = livro.autores.map(autor => autor.id); // Ajuste conforme a estrutura do seu objeto
      this.livro.assuntos = livro.assuntos.map(assunto => assunto.id); // Ajuste conforme a estrutura do seu objeto
    },
    deleteLivro(id) {
      this.$swal({
        title: "Deseja Remover esse registro?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim",
        cancelButtonText: "Não"
      }).then(result => {
        if (result.isConfirmed) {
          this.$swal.fire({
            title: "Excluido!",
            icon: "success",
            text: "Operação realizada com sucesso",
            showConfirmButton: false,
            timer: 1500
          });
          this.$http
            .delete(`/livro/${id}`)
            .then(() => {
              this.fetchLivros();
            })
            .catch(error => {
              this.showErrorAlert = true;
              console.error(error);
            })
            .finally(() => {
              this.isLoading = false;
            });
        }
      });
    },
    gerarTituloIA() {
      try {
        const assuntoSelecionadoId = this.livro.assuntos[0];
        const assuntoSelecionado = this.assuntosDisponiveis.find(
          assunto => assunto.value === assuntoSelecionadoId
        );
        let assunto = assuntoSelecionado
          ? assuntoSelecionado.text
          : "qualquer coisa aleatoria";

        this.$http
          .post(`sugestaoLivro`, { assunto: assunto })
          .then(response => {
            this.livro.titulo = response.data.replace(/"/g, "");
          })
          .catch(error => {
            this.showErrorAlert = true;
          });
      } catch (error) {
        console.error(error);
        this.showErrorAlert = true;
      }
    },
    hideAlerts() {
      setTimeout(() => {
        this.showSuccessAlert = false;
        this.showErrorAlert = false;
      }, 3000);
    }
  },
  mounted() {
    this.fetchLivros();
    this.fetchOpcoes();
  }
};
</script>
