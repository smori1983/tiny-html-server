<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        Tiny HTML Server
      </div>
    </v-app-bar>

    <v-content>
      <home/>
    </v-content>
  </v-app>
</template>

<script>
import Home from './components/Home'
// import HelloWorld from './components/HelloWorld';

export default {
  name: 'tiny-html-server',

  components: {
    Home,
  },

  data: () => ({
    //
  }),
};
</script>
