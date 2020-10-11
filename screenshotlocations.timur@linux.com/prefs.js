/* prefs.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported buildPrefsWidget init */

imports.gi.versions.Gtk = '3.0';
imports.gi.versions.Handy = '0.0';
const {GObject, GLib, Gio, Gtk, Handy} = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

// Register resources
const resource = Me.metadata['data-gresource'];
const resourceFile = Me.dir.get_child(resource);
Gio.resources_register(Gio.Resource.load(resourceFile.get_path()));

var ScreenshotLocationsExtensionPrefs = GObject.registerClass({
    GTypeName: 'ScreenshotLocationsExtensionPrefs',
    Template: 'resource:///org/gnome/shell/extensions/screenshotlocations/ui/prefs.ui',
    InternalChildren: [
        'path_chooser',
    ],
}, class ScreenshotLocationsExtensionPrefs extends Gtk.ListBox {
    _init(preferences) {
        super._init();
        this._preferences = preferences;
        this._sync();

        this._preferences.connect('changed', this._sync.bind(this));
        this._path_chooser.connect('file-set',
            self => this._preferences.set_string('save-directory', self.get_file().get_path()));
    }

    _sync() {
        const p = this._preferences.get_string('save-directory');
        if (GLib.file_test(p, GLib.FileTest.EXISTS)) {
            const file = Gio.File.new_for_path(p);
            this._path_chooser.set_file(file);
        }
    }
});

function buildPrefsWidget() {
    const preferences = ExtensionUtils.getSettings();
    return new ScreenshotLocationsExtensionPrefs(preferences);
}

function init() {
    Gtk.init(null);
    Handy.init(null);
}
