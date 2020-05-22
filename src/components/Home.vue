<template>
  <v-form ref="form">
    <v-container>
      <v-row>
        <v-col cols="8">
          <v-text-field
            v-model="directory"
            v-bind:rules="rulesDirectory()"
            placeholder="directory"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-btn
            v-on:click="selectDirectory"
          >Browse</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="port"
            v-bind:rules="rulesPort()"
            prefix="http://localhost:"
            suffix="/"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn
            v-on:click="startServer"
            v-bind:disabled="startButtonDisabled()"
            color="light-green"
            class="mr-4"
          >Start</v-btn>
          <v-btn
            v-on:click="stopServer"
            v-bind:disabled="stopButtonDisabled()"
            color="amber"
          >Stop</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
const fs = require('fs');
const { ipcRenderer } = require('electron'); // eslint-disable-line
const { dialog } = require('electron').remote; // eslint-disable-line

export default {
  name: 'home',
  data: () => ({
    directory: '',
    port: '3000',
    serverIsRunning: false,
    errorCode: '',
  }),
  methods: {
    rulesDirectory() {
      return [
        (value) => {
          return !!value || 'Required';
        },
        (value) => {
          try {
            return value.length > 0 && fs.statSync(value).isDirectory();
          } catch (e) {
            return 'Is not a directory';
          }
        },
      ];
    },
    rulesPort() {
      return [
        () => {
          return this.errorCode === 'EADDRINUSE' ? 'Port is already used.' : true;
        },
        (value) => {
          return !!value || 'Required';
        },
        (value) => {
          return (/^\d+$/.test(value)) && (80 <= value && value <= 65535) || '80 - 65535';
        },
      ];
    },
    selectDirectory() {
      dialog.showOpenDialog({
        properties: ['openDirectory'],
      }, (path) => {
        [this.directory] = path;
      });
    },
    startServer() {
      this.errorCode = '';
      if (this.$refs.form.validate()) {
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
      this.errorCode = '';
    });
    ipcRenderer.on('server-stopped', () => {
      this.serverIsRunning = false;
      this.errorCode = '';
    });
    ipcRenderer.on('server-error', (event, args) => {
      // TODO: Handle unknown error (args.code !== 'EADDRINUSE')
      this.serverIsRunning = false;
      this.errorCode = args.code;
      this.$refs.form.validate();
    });
  },
};
</script>
