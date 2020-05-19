<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="8">
          <v-text-field v-model="directory" placeholder="directory"></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-btn v-on:click="selectDirectory">Browse</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-text-field v-model="port" prefix="http://localhost" suffix="/"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn v-on:click="startServer" v-bind:disabled="startButtonDisabled()" color="light-green" class="mr-4">Start</v-btn>
          <v-btn v-on:click="stopServer" v-bind:disabled="stopButtonDisabled()" color="amber">Stop</v-btn>
        </v-col>
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
 * @param {string} port
 * @returns {boolean}
 */
const validate = (directory, port) => {
  const checkDirectory = (input) => {
    try {
      return input.length > 0 && fs.statSync(input).isDirectory();
    } catch (e) {
      return false;
    }
  };

  const checkPort = (input) => {
    return (/^\d+$/.test(input)) && (80 <= input && input <= 65535)
  };

  return checkDirectory(directory) && checkPort(port);
};

export default {
  name: 'home',
  data: () => ({
    directory: '',
    port: '3000',
    serverIsRunning: false,
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
      if (validate(this.directory, this.port)) {
        ipcRenderer.send('server-start', {
          directory: this.directory,
          port: this.port,
        });
      }
    },
    stopServer() {
      ipcRenderer.send('server-stop');
    },
    startButtonDisabled() {
      return this.serverIsRunning === true;
    },
    stopButtonDisabled() {
      return this.serverIsRunning === false;
    },
  },
  mounted() {
    ipcRenderer.on('server-started', () => {
      this.serverIsRunning = true;
    });
    ipcRenderer.on('server-stopped', () => {
      this.serverIsRunning = false;
    });
  },
};
</script>
