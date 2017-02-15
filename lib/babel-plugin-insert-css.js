var resolve = require('resolve').sync
var nodePath = require('path')
var fs = require('fs')
var rework = require('rework')
var reworkImport = require('rework-import')

module.exports = function ({types: t}) {
  return {
    visitor: {
      CallExpression: function (path, state) {
        const callee = path.get('callee')
        const arg = path.get('arguments.0')

        if (callee.isIdentifier() &&
          callee.node.name === 'require' &&
          arg && !arg.isGenerated() &&
          /\.css$/.test(arg.node.value)) {
          const srcPath = nodePath.dirname(nodePath.resolve(state.file.opts.filename))
          const requireText = arg.node.value
          const absolutePath = resolve(requireText, {basedir: srcPath})

          const css = rework(fs.readFileSync(absolutePath, 'utf8'))
            .use(reworkImport({path: nodePath.dirname(absolutePath)}))
            .toString({compress: true})

          // replace with `require('insert-css')(/* css string */)`
          path.replaceWith(
            t.expressionStatement(
              t.callExpression(
                t.callExpression(t.identifier('require'), [t.stringLiteral('insert-css')]),
                [t.stringLiteral(css)]
              )
            )
          )
        }
      }
    }
  }
}
