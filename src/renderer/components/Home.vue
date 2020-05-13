<template>
  <div>
    <div>
      <input v-model="directory" class="directory" type="text" placeholder="directory">
      <button v-on:click="selectDirectory" class="" type="button">Browse</button>
    </div>
    <div>
      <button v-on:click="startServer" type="button">Start</button>
      <button v-on:click="stopServer" type="button">Stop</button>
    </div>
    <div>
      <div v-html="log" class="log"></div>
    </div>
  </div>
</template>

<script>
const fs = require('fs');
const { ipcRenderer } = require('electron'); // eslint-disable-line
const { dialog } = require('electron').remote; // eslint-disable-line

/**
 * @param {string} directory
 */
const validate = (directory) => {
  try {
    return directory.length > 0 && fs.statSync(directory).isDirectory();
  } catch (e) {
    return false;
  }
};

export default {
  data: () => ({
    directory: '',
    log: '',
  }),
  methods: {
    selectDirectory() {
      dialog.showOpenDialog({
        properties: ['openDirectory'],
      }, (path) => {
        [this.directory] = path;
      });
    },
    startServer() {
      if (validate(this.directory)) {
        ipcRenderer.send('server-start', {
          directory: this.directory,
        });
      }
    },
    stopServer() {
    },
  },
  mounted() {
    // Temporary implementation
    ipcRenderer.on('server-started', () => {
      this.log += 'started<br>';
    });
  },
};
</script>

<style>
.directory {
  width: 300px;
}
</style>
