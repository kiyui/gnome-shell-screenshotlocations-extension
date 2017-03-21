/* global imports print */

const Me = imports.misc.extensionUtils.getCurrentExtension()
const Gio = imports.gi.Gio
const GLib = imports.gi.GLib
const Keybinder = Me.imports.keybinder.keybinder.default

const screenshotKeys = [
  {
    name: 'area-screenshot',
    shortcut: '<Shift>Print',
    command: 'gnome-screenshot -a'
  },
  {
    name: 'area-screenshot-clip',
    shortcut: '<Ctrl><Shift>Print',
    command: 'gnome-screenshot -a -c'
  },
  {
    name: 'screenshot',
    shortcut: 'Print',
    command: 'gnome-screenshot'
  },
  {
    name: 'screenshot-clip',
    shortcut: '<Ctrl>Print',
    command: 'gnome-screenshot -c'
  },
  {
    name: 'window-screenshot',
    shortcut: '<Alt>Print',
    command: 'gnome-screenshot -w'
  },
  {
    name: 'window-screenshot-clip',
    shortcut: '<Ctrl><Alt>Print',
    command: 'gnome-screenshot -w -c'
  }
]

const schema = new Gio.Settings({
  schema: 'org.gnome.gnome-screenshot'
})

const shortcutSchema = new Gio.Settings({
  schema: 'org.gnome.settings-daemon.plugins.media-keys'
})

function enable () { // eslint-disable-line no-unused-vars
  const keybinder = new Keybinder('screenshotlocations', GLib.get_tmp_dir())
  screenshotKeys.map(screenshotKey => {
    if (shortcutSchema.set_string(screenshotKey.name, '')) {
      Gio.Settings.sync()
      keybinder.add(screenshotKey.name, screenshotKey.shortcut, function () {
        GLib.spawn_command_line_async(screenshotKey.command)
      })
    }
  })
  keybinder.enable()
}

function disable () { // eslint-disable-line no-unused-vars
  const keybinder = new Keybinder('screenshotlocations', GLib.get_tmp_dir())
  screenshotKeys.map(screenshotKey => {
    shortcutSchema.reset(screenshotKey.name) // Reset all screenshot keys
  })
  keybinder.disable()
}
