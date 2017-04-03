'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by moyu on 2017/4/1.
 */
var Template = require('./Template');

var TemplateWithLayout = function (_Template) {
    _inherits(TemplateWithLayout, _Template);

    function TemplateWithLayout(layout) {
        _classCallCheck(this, TemplateWithLayout);

        var _this = _possibleConstructorReturn(this, (TemplateWithLayout.__proto__ || Object.getPrototypeOf(TemplateWithLayout)).call(this));

        _this.layout = layout || TemplateWithLayout.defaultLayout;
        _this._compiledLayout = _get(TemplateWithLayout.prototype.__proto__ || Object.getPrototypeOf(TemplateWithLayout.prototype), '_compile', _this).call(_this, _this.layout);
        return _this;
    }

    _createClass(TemplateWithLayout, [{
        key: 'render',
        value: function render(key, data) {
            var content = _get(TemplateWithLayout.prototype.__proto__ || Object.getPrototypeOf(TemplateWithLayout.prototype), 'render', this).call(this, key, data);
            return this._compiledLayout(Object.assign({ __content__: content }, data));
        }
    }], [{
        key: 'defaultLayout',
        get: function get() {
            return ['<!DOCTYPE html>', '<html>', '<head>', '<title>${title||""}</title>', '<meta name="renderer" content="webkit">', '<meta http-equiv="X-UA-Compatible" content="IE=edge">', '<meta name="viewport" content="width=device-width, initial-scale=1">', '<style>${style||""}</style>', '</head>', '<body>', '<main class="container">', '<div class="page-header"><h1>${title||""}</h1></div>', '${__content__||""}', '</main>', '</body>', '</html>'].join('');
        }
    }]);

    return TemplateWithLayout;
}(Template);

module.exports = TemplateWithLayout;