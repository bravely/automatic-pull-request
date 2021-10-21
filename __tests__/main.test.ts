import {wait} from '../src/wait'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'
import * as TE from 'fp-ts/TaskEither'

test('throws invalid number', async () => {
  const input = parseInt('foo', 10)
  const throwable = TE.getOrElse((e) => { throw e})(wait(input))
  await expect(throwable()).rejects.toThrow('milliseconds not a number')
})

test('wait 500 ms', async () => {
  const start = new Date()
  await wait(500)()
  const end = new Date()
  var delta = Math.abs(end.getTime() - start.getTime())
  expect(delta).toBeGreaterThan(450)
})

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_MILLISECONDS'] = '500'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})
