/* global imports print */

const Me = imports.misc.extensionUtils.getCurrentExtension()
const Main = imports.ui.main
const Gio = imports.gi.Gio
const GLib = imports.gi.GLib
const Meta = imports.gi.Meta
const Shell = imports.gi.Shell
const Keybinder = Me.imports.keybinder.keybinder.default

const defaultKeys = ['area-screenshot', 'area-screenshot-clip', 'screenshot', 'screenshot-clip', 'window-screenshot', 'window-screenshot-clip']

const screenshotSchema = new Gio.Settings({
  schema: 'org.gnome.gnome-screenshot'
})

const shortcutSchema = new Gio.Settings({
  schema: 'org.gnome.settings-daemon.plugins.media-keys'
})

const keybinder = new Keybinder('screenshotlocations', GLib.get_tmp_dir())
keybinder.add('bye-world', '<Super>j', () => print('Goodbye World!'))

function enable () { // eslint-disable-line no-unused-vars
  keybinder.enable()
  defaultKeys.map(key => {
    if (shortcutSchema.set_string(key, '')) {
      Gio.Settings.sync()
    }
  })
}

function disable () { // eslint-disable-line no-unused-vars
  keybinder.disable()
  defaultKeys.map(key => {
    shortcutSchema.reset(key) // Reset all screenshot keys
  })
}
