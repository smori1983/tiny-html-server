<template>
  <div>
    <input v-model="directory" class="directory" type="text" placeholder="directory">
    <button @click="selectDirectory" class="" type="button">Browse</button>
  </div>
</template>

<script>
const { dialog } = require('electron').remote; // eslint-disable-line

export default {
  data: () => ({
    directory: '',
  }),
  methods: {
    selectDirectory() {
      dialog.showOpenDialog({
        properties: ['openDirectory'],
      }, (path) => {
        [this.directory] = path;
      });
    },
  },
};
</script>

<style>
.directory {
  width: 300px;
}
</style>
