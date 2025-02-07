import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.

async function toggleWindowType(type) {
  return await ipcRenderer.invoke('toggleWindowType', type)
}

async function setPosition(params) {
  return await ipcRenderer.invoke("setPosition",params)
}
const api = {
  toggleWindowType,
  setPosition
}
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
