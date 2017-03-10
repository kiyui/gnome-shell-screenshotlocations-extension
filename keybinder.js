(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.keybinder = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  const Gio = imports.gi.Gio;
  const GLib = imports.gi.GLib;
  const Shell = imports.gi.Shell;
  const Main = imports.ui.main;

  /**
   * Manages a set of keybindings identified by an ID.
   *
   * GNOME Shell can only apply new configuration entries from a compiled schema
   * file. When applying the keybinds, a schema is generated and compiled with
   * the "glib-compile-schemas" executable, then loaded and applied.
   *
   * @see {@link add}
   * @see {@link enable}
   * @see {@link disable}
   */

  let Keybinder = function () {

    /**
     * @param {String} id the ID of the keybinding set, should be unique for each
     * extension.
     */
    function Keybinder(id, directory = GLib.get_tmp_dir()) {
      _classCallCheck(this, Keybinder);

      this.id = 'org.gnome.shell.extensions.' + id;
      this.dir = directory;
      this.bindings = [];
    }

    /**
     * Adds a keybinding.
     *
     * @param {String} name the unique name of the binding.
     * @param {String|Array<String>} sequences the key sequence(s).
     * @param {Function} handler the handler.
     */


    _createClass(Keybinder, [{
      key: 'add',
      value: function add(name, sequences, handler) {
        sequences = sequences instanceof Array ? sequences : [sequences];
        this.bindings.push({ name: name, sequences: sequences, handler: handler });
      }
    }, {
      key: 'render',
      value: function render({ name, sequences }) {
        const value = sequences.map(s => GLib.markup_escape_text(s, s.length));
        const markup = '<default>' + JSON.stringify(value) + '</default>';
        return '<key type="as" name="' + name + '"><summary/>' + markup + '</key>';
      }
    }, {
      key: 'build',
      value: function build() {
        const path = this.id.replace(/\./g, '/');
        const entries = this.bindings.map(b => this.render(b)).join('');
        const schema = '<schema id="' + this.id + '" path="/' + path + '/">' + entries + '</schema>';
        const content = '<schemalist>' + schema + '</schemalist>';
        Gio.file_new_for_path(this.dir).get_child(this.id + '.gschema.xml').replace_contents(content, null, false, 0, null);
      }
    }, {
      key: 'compile',
      value: function compile() {
        const exec = ['glib-compile-schemas', this.dir];
        GLib.spawn_sync(this.dir, exec, null, GLib.SpawnFlags.SEARCH_PATH, null);
      }
    }, {
      key: 'load',
      value: function load() {
        const fb = Gio.SettingsSchemaSource.get_default();
        const src = Gio.SettingsSchemaSource.new_from_directory(this.dir, fb, false);
        return new Gio.Settings({ settings_schema: src.lookup(this.id, true) });
      }
    }, {
      key: 'enable',
      value: function enable() {
        this.build();
        this.compile();
        const settings = this.load();
        const modes = Shell.ActionMode.NORMAL | Shell.ActionMode.MESSAGE_TRAY;
        for (let { name, handler } of this.bindings) Main.wm.addKeybinding(name, settings, 0, modes, handler);
      }
    }, {
      key: 'disable',
      value: function disable() {
        for (let { name } of this.bindings) Main.wm.removeKeybinding(name);
      }
    }]);

    return Keybinder;
  }();

  exports.default = Keybinder;
});
