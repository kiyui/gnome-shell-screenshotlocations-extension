/* global imports print */

const Gio = imports.gi.Gio
const Gtk = imports.gi.Gtk

function buildPrefsWidget () { // eslint-disable-line no-unused-vars
  // Get screenshot save location
  const schema = new Gio.Settings({
    schema: 'org.gnome.gnome-screenshot'
  })

  const location = schema.get_string('auto-save-directory')

  const vbox = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    border_width: 10,
    margin: 20,
    spacing: 20
  })

  // Create children objects
  const entry = new Gtk.Entry({ text: location })

  const save = new Gtk.Button({ label: 'Save' })

  // Add objects to frame
  vbox.add(new Gtk.Label({ label: 'Screenshot Path' }))
  vbox.add(entry)
  vbox.add(save)

  // Handle events
  save.connect('clicked', function () {
    const newLocation = entry.text
    print('Changing screenshot location to: ' + newLocation)

    if (schema.set_string('auto-save-directory', newLocation)) {
      Gio.Settings.sync()
      print('Updated screenshot location to: ' + newLocation)
      Gtk.main_quit()
    }
  })

  vbox.show_all()
  return vbox
}

function init () { // eslint-disable-line no-unused-vars
  print('Initilize screenshot location extension configuration window')
}
