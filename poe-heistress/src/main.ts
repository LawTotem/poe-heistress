import { app, BrowserWindow, desktopCapturer, globalShortcut, ipcMain, Menu, safeStorage, Tray, session } from 'electron';
import { closeSync, existsSync, openSync, readSync, writeSync } from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import { ninjaGrab } from './ninjaprices';
import { HeistressSettings, HeistressSettingsType } from './settings';


// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const TRACK_WINDOW_WEBPACK_ENTRY: string;
declare const TRACK_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

declare const SETTINGS_WINDOW_WEBPACK_ENTRY: string;
declare const SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

declare const PRICER_WINDOW_WEBPACK_ENTRY: string;
declare const PRICER_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const APP_PATH = app.getPath('userData')
const SETTINGS_PATH = APP_PATH + '\\settings.json'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}


const createWindow = (): void => {
  session.defaultSession.protocol.registerFileProtocol('static', (request, callback) => {
    const fileUrl = request.url.replace('static://', '');
    const filePath = path.join(app.getAppPath(), '.webpack/renderer', fileUrl);
    callback(filePath);
  });
  
  // Create the browser window.
  const enable_tracker = get_setting('use_tracker', true)
  var toggleTracker = () => {}
  if (enable_tracker)
  {
    const always_on_top = get_setting('tracker_ontop', true) as boolean
    const trackingWindow = new BrowserWindow({
      height: get_setting('tracker_height', 380) as number,
      width: get_setting('tracker_width', 500) as number,
      //icon: 'icons/HeistIcon.png',
      title: "PoE-Heistress Tracker",
      titleBarStyle: 'hidden',
      //titleBarOverlay: true,
      movable: true,
      alwaysOnTop: always_on_top,
      resizable: false,
      //resizable: true,
      webPreferences: {
        nodeIntegration: true,
        preload: TRACK_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
    });

    trackingWindow.loadURL(TRACK_WINDOW_WEBPACK_ENTRY);
    trackingWindow.setAlwaysOnTop(always_on_top, 'normal');
    trackingWindow.setVisibleOnAllWorkspaces(true);
    trackingWindow.setFullScreenable(false);

    trackingWindow.on('close', (event : Electron.Event) => {
      event.preventDefault();
      trackingWindow.hide();
    })
    toggleTracker = () => {
      if (trackingWindow.isVisible())
      {
        trackingWindow.hide()
      }
      else
      {
        trackingWindow.show()
      }
    }
    //trackingWindow.webContents.openDevTools();
  }

  const enable_pricer = get_setting('use_pricer', true)
  var togglePricer = () => {}

  if (enable_pricer) {

    const pricerWindow = new BrowserWindow({
      height: 600,
      width: 800,
      //icon: 'icons/HeistIcon.png',
      title: 'PoE-Heistress Pricer',
      titleBarStyle: 'hidden',
      //titleBarOverlay: true,
      movable: true,
      //alwaysOnTop: true,
      resizable: true,
      webPreferences: {
        nodeIntegration: true,
        preload: PRICER_WINDOW_PRELOAD_WEBPACK_ENTRY,
      }
    });
    pricerWindow.hide();
    pricerWindow.loadURL(PRICER_WINDOW_WEBPACK_ENTRY);
    pricerWindow.on('close', (event : Electron.Event) => {
      event.preventDefault();
      pricerWindow.hide();
    })
    pricerWindow.webContents.openDevTools();
    togglePricer = () => {
      if (pricerWindow.isVisible())
      {
        pricerWindow.hide()
      }
      else
      {
        pricerWindow.show()
      }
    }
    const pricer_shortcut = get_setting('pricer_shortcut', 'Ctrl+U') as string

    globalShortcut.register(pricer_shortcut, () => {
      pricerWindow.webContents.send('PRICE_EVENT')
    })
    ipcMain.handle('resizePricer', (event, args) => {
      pricerWindow.setSize(args[0], args[1])
    })
    ipcMain.handle('showPricer', (event, args) => {
      pricerWindow.hide()
      pricerWindow.show()
    })
  }

  const settingsWindow = new BrowserWindow({
    height: 600,
    width: 800,
    //icon: 'icons/HeistIcon.png',
    title: "PoE-Heistress Settings",
    webPreferences: {
      preload: SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY,
    }
  });

  settingsWindow.loadURL(SETTINGS_WINDOW_WEBPACK_ENTRY);

  settingsWindow.on('close', (event : Electron.Event) => {
    event.preventDefault();
    settingsWindow.hide();
  })

  // Open the DevTools.
  //settingsWindow.webContents.openDevTools();

  const tray = new Tray(path.join(__dirname, 'icons', 'HeistIcon.png'))
  function toggleSettings() {
    if (settingsWindow.isVisible())
    {
      settingsWindow.hide()
    }
    else
    {
      settingsWindow.show()
    }
  }
  function exitApp() {
    app.exit()
  }
  const trayMenu = Menu.buildFromTemplate([
    {label: "Settings", type: 'normal', click: toggleSettings},
    {label: "Tracker", type: 'normal', click: toggleTracker},
    {label: "Pricer", type: 'normal', click: togglePricer},
    {type: 'separator'},
    {label: "Exit", type: 'normal', click: exitApp}
  ])
  tray.setContextMenu(trayMenu)
  tray.setTitle("PoE Heistress")
  tray.setToolTip("Heisting Tool")
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.handle("encryptString", (event, args) => {
  return safeStorage.encryptString(args).toString('base64url')
})

ipcMain.handle("decryptString", (event, args) =>{
  const v = Buffer.from(args, "base64url")
  return safeStorage.decryptString(v).toString()
})

function load_settings() : HeistressSettings {
  if (!existsSync(SETTINGS_PATH))
  {
      return null
  }
  const settings_fh = openSync(SETTINGS_PATH, 'r')
  const b = Buffer.alloc(2048)
  const bytes = readSync(settings_fh, b);
  closeSync(settings_fh)
  const settings_str = b.toString('utf8', 0, bytes)
  return JSON.parse(settings_str)
}
function save_settings(set : HeistressSettings) : void {
  const set_str = JSON.stringify(set)
  const settings_fh = openSync(SETTINGS_PATH, 'w')
  writeSync(settings_fh, set_str)
  closeSync(settings_fh)
}
function get_setting(name : keyof HeistressSettings, default_value : HeistressSettingsType) : HeistressSettingsType {
  var settings = load_settings()
  if (settings[name] != null) {
      return settings[name]
  }
  settings[name] = default_value
  save_settings(settings)
  return default_value
}
function set_setting(name : keyof HeistressSettings, value : HeistressSettingsType) : void {
  var settings = load_settings()
  settings[name] = value
  save_settings(settings)
}

ipcMain.handle("getSetting", (event,args) => {
  return get_setting(args[0], args[1])
})
ipcMain.handle("setSetting", (event, args) => {
  return set_setting(args[0], args[1])
})
ipcMain.handle("fetchInventory", async (event, args) => {
  const league = get_setting("league", "")
  const account = get_setting("account_name", "")
  const character = get_setting("character", "")
  const poesessid_e = get_setting("poesessid", "") as string
  const poesessid_b = Buffer.from(poesessid_e,"base64url")
  const poesessid = safeStorage.decryptString(poesessid_b).toString()
  const url = "https://www.pathofexile.com/character-window/get-items?league=" + league + "&AccountName=" + account + "&character=" + character
  const req = fetch(
    url, {
      method: 'GET',
      headers: {
        'cookie':'POESESSID=' + poesessid
      }
    })
  const reqa = await req
  const inventory = await reqa.text()
  return inventory
})
ipcMain.handle('PoEWindowID', async (event, args) => {
  const screen_name = get_setting("screen_name", "Path of Exile")
  const sources = await desktopCapturer.getSources({types:['window', 'screen'], thumbnailSize: {width:0, height:0}});
  for (const source of sources){
    if (source.name == screen_name){
      return source.id
    }
  }
  return 0;
})
ipcMain.handle('FetchPrices', async (event, args) => {
  return await ninjaGrab(get_setting("league", "") as string)
})