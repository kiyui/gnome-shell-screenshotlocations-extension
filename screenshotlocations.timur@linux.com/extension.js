/* extension.js
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

/* exported init */

const {Gio, GLib} = imports.gi;
const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;

class Extension {
    constructor() {
        this._preferences = ExtensionUtils.getSettings();
    }

    enable() {
        GLib.timeout_add(GLib.PRIORITY_DEFAULT, 0, () => {
            Main.shellDBusService._screenshotService._original_resolveRelativeFilename = Main.shellDBusService._screenshotService._resolveRelativeFilename;
            Main.shellDBusService._screenshotService._resolveRelativeFilename = this._resolveRelativeFilenameOverride.bind(this);
        });
    }

    disable() {
        Main.shellDBusService._screenshotService._resolveRelativeFilename = Main.shellDBusService._screenshotService._original_resolveRelativeFilename;
        delete Main.shellDBusService._screenshotService._original_resolveRelativeFilename;
    }

    *_resolveRelativeFilenameOverride(filename) {
        filename = filename.replace(/\.png$/, '');

        let path = [
            this._preferences.get_string('save-directory'),
            GLib.get_user_special_dir(GLib.UserDirectory.DIRECTORY_PICTURES),
            GLib.get_home_dir(),
        ].find(p => GLib.file_test(p, GLib.FileTest.EXISTS));

        if (!path)
            return null;

        yield Gio.File.new_for_path(
            GLib.build_filenamev([path, `${filename}.png`]));

        for (let idx = 1; ; idx++) {
            yield Gio.File.new_for_path(
                GLib.build_filenamev([path, `${filename}-${idx}.png`]));
        }
    }
}

function init() {
    return new Extension();
}
