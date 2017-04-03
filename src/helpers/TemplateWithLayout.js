/**
 * Created by moyu on 2017/4/1.
 */
const Template = require('./Template');

class TemplateWithLayout extends Template {
    constructor(layout) {
        super();
        this.layout = layout || TemplateWithLayout.defaultLayout;
        this._compiledLayout = super._compile(this.layout);
    }

    render(key, data) {
        let content = super.render(key, data);
        return this._compiledLayout(
            Object.assign({__content__: content}, data)
        );
    }

    static get defaultLayout() {
        return [
            '<!DOCTYPE html>',
            '<html>',
            '<head>',
            '<title>${title||""}</title>',
            '<meta name="renderer" content="webkit">',
            '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
            '<meta name="viewport" content="width=device-width, initial-scale=1">',
            '<style>${style||""}</style>',
            '</head>',
            '<body>',
            '<main class="container">',
            '<div class="page-header"><h1>${title||""}</h1></div>',
            '${__content__||""}',
            '</main>',
            '</body>',
            '</html>'
        ].join('');
    };
}

module.exports = TemplateWithLayout;