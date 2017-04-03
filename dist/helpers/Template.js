"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by moyu on 2017/4/1.
 */

var Template = function () {
    function Template() {
        _classCallCheck(this, Template);

        this._compiledViews = {};
    }

    _createClass(Template, [{
        key: "set",
        value: function set(key, content) {
            this._compiledViews[key] = this._compile(content);
        }
    }, {
        key: "render",
        value: function render(key, data) {
            var compiled = this._compiledViews[key];
            if (!compiled) {
                throw new Error("Not Existed: View Named " + key);
            }
            return this._compiledViews[key](data);
        }
    }, {
        key: "_compile",
        value: function _compile(str) {
            var tpl = str;
            var preDeclare = "for (var name in obj) {\n" + "eval('var '+name+' = obj[name];');" + "\n}\n" + "name=obj.name";

            tpl = preDeclare + "\nvar tpl = `" + tpl + "`;\n return tpl;";
            return new Function('obj', tpl);
        }
    }]);

    return Template;
}();

module.exports = Template;