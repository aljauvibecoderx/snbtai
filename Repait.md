Compiled with problems:
×
ERROR in ./src/features/ambisBattle/LiveBattle.js
Module build failed (from ./node_modules/babel-loader/lib/index.js):
SyntaxError: C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\src\features\ambisBattle\LiveBattle.js: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment <>...</>? (1057:18)

  1055 |                     const revealStatus = hasMyAnswer; 
  1056 |                   <p className="text-base text-slate-600 mb-3">Tidak ada opsi jawaban untuk soal ini.</p>
> 1057 |                   <button 
       |                   ^
  1058 |                     onClick={() => {
  1059 |                       console.error('Question with missing options:', currentQuestion);
  1060 |                       alert('Error: Opsi jawaban tidak ditemukan. Lihat console untuk detail.');
    at constructor (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:365:19)
    at FlowParserMixin.raise (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:6599:19)
    at FlowParserMixin.jsxParseElementAt (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:4742:18)
    at FlowParserMixin.jsxParseElement (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:4749:17)
    at FlowParserMixin.parseExprAtom (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:4759:19)
    at FlowParserMixin.parseExprSubscripts (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:11081:23)
    at FlowParserMixin.parseUpdate (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:11066:21)
    at FlowParserMixin.parseMaybeUnary (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:11046:23)
    at FlowParserMixin.parseMaybeUnaryOrPrivate (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:10899:61)
    at FlowParserMixin.parseExprOps (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:10904:23)
    at FlowParserMixin.parseMaybeConditional (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:10881:23)
    at FlowParserMixin.parseMaybeAssign (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:10831:21)
    at C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:3498:39
    at FlowParserMixin.tryParse (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:6907:20)
    at FlowParserMixin.parseMaybeAssign (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:3498:18)
    at FlowParserMixin.parseExpressionBase (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:10784:23)
    at C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:10780:39
    at FlowParserMixin.allowInAnd (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:12421:16)
    at FlowParserMixin.parseExpression (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:10780:17)
    at FlowParserMixin.parseStatementContent (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:12895:23)
    at FlowParserMixin.parseStatementLike (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:12767:17)
    at FlowParserMixin.parseStatementLike (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:2918:24)
    at FlowParserMixin.parseStatementListItem (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:12747:17)
    at FlowParserMixin.parseBlockOrModuleBlockBody (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:13316:61)
    at FlowParserMixin.parseBlockBody (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:13309:10)
    at FlowParserMixin.parseBlock (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:13297:10)
    at FlowParserMixin.parseFunctionBody (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:12100:24)
    at C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:2892:63
    at FlowParserMixin.forwardNoArrowParamsConversionAt (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:3068:16)
    at FlowParserMixin.parseFunctionBody (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:2892:12)
    at FlowParserMixin.parseArrowExpression (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:12075:10)
    at FlowParserMixin.parseParenAndDistinguishExpression (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:11687:12)
    at FlowParserMixin.parseParenAndDistinguishExpression (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:3591:18)
    at FlowParserMixin.parseExprAtom (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:11331:23)
    at FlowParserMixin.parseExprAtom (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:4764:20)
    at FlowParserMixin.parseExprSubscripts (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:11081:23)
    at FlowParserMixin.parseUpdate (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:11066:21)
    at FlowParserMixin.parseMaybeUnary (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:11046:23)
    at FlowParserMixin.parseMaybeUnaryOrPrivate (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:10899:61)
    at FlowParserMixin.parseExprOps (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:10904:23)
    at FlowParserMixin.parseMaybeConditional (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:10881:23)
    at FlowParserMixin.parseMaybeAssign (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:10831:21)
    at FlowParserMixin.parseMaybeAssign (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:3549:18)
    at C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:10800:39
    at FlowParserMixin.allowInAnd (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:12426:12)
    at FlowParserMixin.parseMaybeAssignAllowIn (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:10800:17)
    at FlowParserMixin.parseMaybeAssignAllowInOrVoidPattern (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:12493:17)
    at FlowParserMixin.parseExprListItem (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:12175:18)
    at FlowParserMixin.parseCallExpressionArguments (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:11252:22)
    at FlowParserMixin.parseCoverCallAndAsyncArrowHead (C:\Users\ANONX\Documents\WEBSITE\Production Project\SNBT AI - Competition FInal\node_modules\@babel\parser\lib\index.js:11186:29)
ERROR
[eslint] 
src\features\ambisBattle\LiveBattle.js
  Line 1057:18:  Parsing error: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment <>...</>? (1057:18)
