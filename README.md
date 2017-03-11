# gnome screenshot locations extension
Override GNOME's screenshot functionality to use a custom path as the current gsetting value
does not reflect on the `gnome-screenshot` utility as it used to.

## what it does
Upon enabling the extension, it disables all default screenshot keys defined in
`org.gnome.settings-daemon.plugins.media-keys` and overrides the default screenshot
behavior to respect the save directory path.

The save directory path and extension are defined under `org.gnome.gnome-screenshot`
with the keys `auto-save-directory` and `default-file-type`. You can customize the
save directory with the extension preference tool. A valid example would be
`/home/timur/Pictures/Screenshots` for instance.

The screenshot is saved in UNIX time by default.

## acknowledgement
This extension makes use of the excellent [gnome-shell-keybinder](https://github.com/rliang/gnome-shell-keybinder) library.
