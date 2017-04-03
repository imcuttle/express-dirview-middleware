/**
 * Created by moyu on 2017/4/1.
 */

class Template {
    constructor() {
        this._compiledViews = {};
    }

    set(key, content) {
        this._compiledViews[key] = this._compile(content);
    }

    render(key, data) {
        const compiled = this._compiledViews[key];
        if (!compiled) {
            throw new Error(`Not Existed: View Named ${key}`);
        }
        return this._compiledViews[key](data);
    }

    _compile(str) {
        let tpl = str;
        var preDeclare = "for (var name in obj) {\n"
            + "eval('var '+name+' = obj[name];');"
            + "\n}\n"
            + "name=obj.name";

        tpl = preDeclare+"\nvar tpl = `" + tpl + "`;\n return tpl;"
        return new Function('obj', tpl);
    }

}

module.exports = Template;