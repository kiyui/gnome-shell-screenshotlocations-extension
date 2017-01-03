const gio = imports.gi.Gio
const gnomeScreenshot = new gio.Settings({
  schema: 'org.gnome.gnome-screenshot'
})

function _setScreenshotLocation (location) {
  if (gnomeScreenshot.set_string('auto-save-directory', location)) {
    gio.Settings.sync()
    print('Updated screenshot location to: ' + location)
  }
}

function enable () {
  const location = gnomeScreenshot.get_string('auto-save-directory')
  print('Current screenshot location set to: ' + location)
  _setScreenshotLocation(new Date().toLocaleString())
}

function disable () {
}
