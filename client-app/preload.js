const { ipcRenderer } = require("electron");
const { Socket } = require("net");
const { Observable, fromEvent, Subject } = require("rxjs");

global.socket = new Socket();
