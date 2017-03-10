/* global imports print */

const Main = imports.ui.main
const Gio = imports.gi.Gio
const Meta = imports.gi.Meta
const Shell = imports.gi.Shell

const defaultKeys = ['area-screenshot', 'area-screenshot-clip', 'screenshot', 'screenshot-clip', 'window-screenshot', 'window-screenshot-clip']

const screenshotSchema = new Gio.Settings({
  schema: 'org.gnome.gnome-screenshot'
})

const shortcutSchema = new Gio.Settings({
  schema: 'org.gnome.settings-daemon.plugins.media-keys'
})

function enable () { // eslint-disable-line no-unused-vars
  defaultKeys.map(key => {
    if (shortcutSchema.set_string(key, '')) {
      Gio.Settings.sync()
    }
  })

  if (Main.wm.addKeybinding && Shell.ActionMode) {
    Main.wm.addKeybinding('screenshot', shortcutSchema, Meta.KeyBindingFlags.NONE, Shell.ActionMode.NORMAL, function () {
      print('This has never, will never, shall never work')
    })
  }
}

function disable () { // eslint-disable-line no-unused-vars
  defaultKeys.map(key => {
    shortcutSchema.reset(key) // Reset all screenshot keys
  })
}
