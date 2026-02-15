/**
 * Custom Jest transformer that replaces import.meta.env references
 * with process.env equivalents before passing to ts-jest.
 *
 * This is needed because import.meta is ESM-only syntax
 * and Jest runs in CJS mode by default.
 */
const { TsJestTransformer } = require('ts-jest')

class ImportMetaTransformer extends TsJestTransformer {
  constructor() {
    super({
      diagnostics: false,
      tsconfig: 'tsconfig.jest.json',
    })
  }

  process(sourceText, sourcePath, options) {
    const transformed = sourceText
      .replace(/import\.meta\.env\.DEV/g, '(process.env.NODE_ENV !== "production")')
      .replace(/import\.meta\.env\.PROD/g, '(process.env.NODE_ENV === "production")')
      .replace(/import\.meta\.env\.MODE/g, '"test"')
      .replace(/import\.meta\.env\.SSR/g, 'false')
      .replace(/import\.meta\.env/g, '({DEV:false,PROD:true,MODE:"test",SSR:false})')
    return super.process(transformed, sourcePath, options)
  }
}

module.exports = new ImportMetaTransformer()
