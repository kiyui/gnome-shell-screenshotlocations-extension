/* global imports print */

const gio = imports.gi.Gio
const gnomeScreenshot = new gio.Settings({
  schema: 'org.gnome.gnome-screenshot'
})

const Gettext = imports.gettext
const Gtk = imports.gi.Gtk

Gettext.bindtextdomain('gnome-panel-3.0', '/usr/share/locale')
Gettext.textdomain('gnome-panel-3.0')

Gtk.init(null)

const window = new Gtk.Window({ type: Gtk.WindowType.TOPLEVEL })
const frame = new Gtk.Box({
  orientation: Gtk.Orientation.VERTICAL,
  border_width: 10,
  margin: 20,
  spacing: 20
})

const location = gnomeScreenshot.get_string('auto-save-directory')
const entry = new Gtk.Entry({ text: location })

const save = new Gtk.Button({ label: 'Save' })
save.connect('clicked', function () {
  print(entry.text)
})

frame.add(new Gtk.Label({ label: 'Screenshot Path' }))
frame.add(entry)
frame.add(save)

window.add(frame)
window.show_all()

Gtk.main()
