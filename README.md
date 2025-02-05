# @cantoo/node-languagetool

This is a Node.js binding to the [LanguageTool](https://languagetool.org/) (LT)
spellchecker. It is based on a local instance of LT.
As it is a Java based framework, this binding will use
[node-jre](https://github.com/schreiben/node-jre/), which provides an embedded
local Java Runtime Engine.

## Install

```bash
npm i @cantoo/node-languagetool
```

## Usage

The following code

```javascript
const lt = require('@cantoo/node-languagetool')

lt.check('This is wong. Tolt you so.', 'en-US').then(console.log)
```

should print something like this:

```JSON
[
  {
    "offset": 8,
    "length": 4,
    "message": "Possible spelling mistake found",
    "shortMessage": "Spelling mistake",
    "replacements": [
      "Wong",
      "long",
      "won",
      "wing",
      "song",
      "Kong",
      "Long",
      "wrong",
      "Wang",
      "Cong",
      "Yong",
      "gong",
      "pong",
      "bong",
      "tong",
      "wont",
      "wonk",
      "dong",
      "wog",
      "won g"
    ],
    "ruleId": "MORFOLOGIK_RULE_EN_US",
    "ruleDescription": "Possible spelling mistake",
    "ruleIssueType": "misspelling",
    "ruleCategoryId": "TYPOS",
    "ruleCategoryName": "Possible Typo"
  },
  {
    "offset": 14,
    "length": 4,
    "message": "Possible spelling mistake found",
    "shortMessage": "Spelling mistake",
    "replacements": [
      "Told",
      "Toll",
      "Bolt",
      "Colt",
      "Holt",
      "Tilt",
      "Tort",
      "Volt",
      "Molt",
      "Tot",
      "Tout",
      "Jolt",
      "Toot",
      "Dolt",
      "Tole"
    ],
    "ruleId": "MORFOLOGIK_RULE_EN_US",
    "ruleDescription": "Possible spelling mistake",
    "ruleIssueType": "misspelling",
    "ruleCategoryId": "TYPOS",
    "ruleCategoryName": "Possible Typo"
  }
]
```

To get all supported languages you can call the following:

```javascript
lt.languages().then(console.log) // Should print a list of language-locale pairs
```

## API

`lt.check(text, locale)` Spellchecks the provided text.

- `text` (string). The text to be spellchecked.
- `locale` (string). The locale code. Use `lt.languages()` to get a list of supported languages and their locale codes.
- Returns a `Promise` object. It will resolve to an array of the following form:

```javascript
[
  {
    "offset": 8, // offset within the provided text
    "length": 4, // length of the misspelled text fragment
    "message": "Possible spelling mistake found", // long description
    "shortMessage": "Spelling mistake", // short description
    "replacements": [ // replacement options
      "Wong",
      "won g" // [...]
    ],
    "ruleId": "MORFOLOGIK_RULE_EN_US", // key of the underlying rule
    "ruleDescription": "Possible spelling mistake", // description of the rule
    "ruleIssueType": "misspelling", // issue type of the rule
    "ruleCategoryId": "TYPOS", // ID of the category this rule belongs to
    "ruleCategoryName": "Possible Typo" // description of the category this rule belongs to
  } // [...]
]
```

`lt.languages()` Retrieve all supported languages.

- Returns a `Promise` object. It will resolve to an array of the following form:

```javascript
[
  {
    "name": "English (US)", // full name of the language (and variant)
    "locale": "en_US" // locale code of the language variant
  } // [...]
]
```

## License

MIT License

Copyright (c) 2016 schreiben

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
