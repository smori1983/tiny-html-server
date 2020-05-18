<template>
  <v-form>
    <v-container>
      <v-row>
        <v-text-field v-model="directory" placeholder="directory"></v-text-field>
        <v-btn v-on:click="selectDirectory">Browse</v-btn>
      </v-row>
      <v-row>
        <v-btn v-on:click="startServer">Start</v-btn>
        <v-btn v-on:click="stopServer">Stop</v-btn>
      </v-row>
      <v-row>
        <div v-html="log" class="log"></div>
      </v-row>
    </v-container>
  </v-form>
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
  name: 'home',
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
      ipcRenderer.send('server-stop');
    },
  },
  mounted() {
    // Temporary implementation
    ipcRenderer.on('server-started', () => {
      this.log += 'started<br>';
    });

    ipcRenderer.on('server-stopped', () => {
      this.log += 'stopped<br>';
    });
  },
};
</script>

<style>
.directory {
  width: 300px;
}
</style>
