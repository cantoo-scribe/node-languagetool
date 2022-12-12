/* MIT License
 *
 * Copyright (c) 2016 schreiben
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * @typedef {Object} Match
 * @property {number} offset Offset within the provided text
 * @property {number} length Length of the misspelled text fragment
 * @property {string} message Long description
 * @property {string} shortMessage Short description
 * @property {string[]} replacements Replacement options
 * @property {string} ruleId Key of the underlying rule
 * @property {string} ruleDescription Description of the rule
 * @property {string} ruleIssueType Issue type of the rule
 * @property {string} ruleCategoryId ID of the category this rule belongs to
 * @property {string} ruleCategoryName Description of the category this rule belongs to
 */

/**
 * @typedef {Object} CheckResponse
 * @property {number} code
 * @property {Match[]} matches
 */

/**
 * @typedef {Object} Language
 * @property {string} name Full name of the language (and variant)
 * @property {string} locale Locale code of the language variant
 */

/**
 * @typedef {Object} LanguagesResponse
 * @property {number} code
 * @property {Language[]} languages
 */

const path = require('path')
const jre = require('node-jre')

let service
const queue = []

// const kill = () => {
//   if (service) service.kill()
//   service = null
// }

const writeTopCommand = () =>
  service.stdin.write(JSON.stringify(queue[queue.length - 1].cmd) + '\n')

const start = () =>
  new Promise((resolve, reject) => {
    const ltdir = path.resolve(__dirname, 'lt', 'lt')
    if (service) {
      resolve()
    } else {
      service = jre.spawn(
        [ltdir, path.resolve(ltdir, 'languagetool.jar'), 'resources'],
        'Service',
        [],
        { encoding: 'utf8' }
      )
      service.on('error', err => reject(err))
      service.stdout.on('data', line => {
        line = line.toString().trim()
        if (line.length > 0) {
          line = JSON.parse(line)
          const entry = queue.pop()
          if (line.code === 200 && entry.resolve) entry.resolve(line)
          else if (line.code !== 200 && entry.reject) entry.reject(line)
        }
      })
      if (queue.length > 0) writeTopCommand()
      resolve()
    }
  })

// const stop = () =>
//   new Promise((resolve, reject) => {
//     kill()
//     resolve()
//   })

// const restart = () => stop().then((resolve, reject) => start().then(resolve, reject))

const send = cmd =>
  new Promise((resolve, reject) =>
    start().then(() => {
      const entry = {
        cmd: cmd,
        resolve: resolve,
        reject: reject,
      }
      queue.unshift(entry)
      if (queue.length === 1) writeTopCommand()
    })
  )

const check = async (text, locale) => {
  const { matches } = await send({
    command: 'check',
    text: text,
    language: locale.toString(),
  })
  return matches
}

const languages = async () => {
  const { languages } = await send({ command: 'languages' })
  return languages
}

module.exports = { check, languages }
