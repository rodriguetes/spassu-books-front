<template>
  <div class="wrapper">
    <notifications></notifications>
    <side-bar>
      <template slot="links">
        <sidebar-item
          :link="{
            name: 'Assuntos',
            path: '/assunto',
            icon: 'ni ni-bullet-list-67 text-blue'
          }"
        >
        </sidebar-item>
        <sidebar-item
          :link="{
            name: 'Autores',
            path: '/autor',
            icon: 'ni ni-single-02 text-yellow'
          }"
        >
        </sidebar-item>
        <sidebar-item
          :link="{
            name: 'Livros',
            path: '/livro',
            icon: 'ni ni-books text-orange'
          }"
        >
        </sidebar-item>
        <sidebar-item
          :link="{
            name: 'Relatorio',
            path: '/relatorio',
            icon: 'ni ni-archive-2 text-blue'
          }"
          @click.native.prevent="generateReport"
        >
        </sidebar-item>
      </template>
    </side-bar>
    <div class="main-content">
      <dashboard-navbar :type="$route.meta.navbarType"></dashboard-navbar>

      <div @click="$sidebar.displaySidebar(false)">
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </fade-transition>
      </div>
      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>
<script>
/* eslint-disable no-new */
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

function hasElement(className) {
  return document.getElementsByClassName(className).length > 0;
}

function initScrollbar(className) {
  if (hasElement(className)) {
    new PerfectScrollbar(`.${className}`);
  } else {
    // try to init it later in case this component is loaded async
    setTimeout(() => {
      initScrollbar(className);
    }, 100);
  }
}

import DashboardNavbar from "./DashboardNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import { FadeTransition } from "vue2-transitions";

export default {
  components: {
    DashboardNavbar,
    ContentFooter,
    DashboardContent,
    FadeTransition
  },
  methods: {
    initScrollbar() {
      let isWindows = navigator.platform.startsWith("Win");
      if (isWindows) {
        initScrollbar("sidenav");
      }
    },
    async generateReport() {
      event.preventDefault();
      this.$http
        .get(`/gerarRelatorio`, { responseType: "blob" })
        .then(response => {
          // Cria um URL para o blob recebido
          const fileURL = window.URL.createObjectURL(new Blob([response.data]));
          // Cria um link para download
          const fileLink = document.createElement("a");
          fileLink.href = fileURL;
          fileLink.setAttribute("download", "relatorio.pdf"); // Nome do arquivo para download
          document.body.appendChild(fileLink);

          fileLink.click(); // Simula um clique no link para iniciar o download

          fileLink.remove(); // Remove o link do DOM
          window.URL.revokeObjectURL(fileURL);
        })
        .catch(error => {
          this.showErrorAlert = true;
          console.error(error);
        });
    }
  },
  mounted() {
    this.initScrollbar();
  }
};
</script>
<style lang="scss"></style>
