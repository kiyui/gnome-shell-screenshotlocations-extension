const gio = imports.gi.Gio
const gnomeScreenshot = new gio.Settings({
  schema: 'org.gnome.gnome-screenshot'
})

function enable () {
  const location = gnomeScreenshot.get_string('auto-save-directory')
  print('Current screenshot location set to: ' + location)
}

function disable () {
}
