import * as ocore from '@actions/core'
import {wait} from './wait'
import * as IO from 'fp-ts/IO'
import * as T from 'fp-ts/Task'
import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import { pipe, constVoid, flow } from 'fp-ts/function'

import * as core from './fp-actions/core'

async function run(): Promise<void> {
  try {
    const ms: string = ocore.getInput('milliseconds')
    ocore.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    ocore.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))()
    ocore.debug(new Date().toTimeString())

    ocore.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) ocore.setFailed(error.message)
  }
}

const main: T.Task<void> =
  pipe(
    core.getInput('milliseconds'),
    IO.bindTo('msOption'),
    IO.bind('_debugWaiting', ({msOption}) => {
      if (O.isSome(msOption)) {
        return core.debug(`Waiting ${msOption.value} milliseconds ...`)
      } else {
        return constVoid
      }
    }),
    IO.bind('_debugBefore', () => core.debug(new Date().toTimeString())),
    IO.map(({ msOption }) => pipe(
      msOption,
      O.map((ms) => parseInt(ms, 10)),
      E.fromOption(() => new Error('milliseconds arg required'))
    )),
    TE.fromIOEither,
    TE.chain(wait),
    TE.chain(() => pipe(
      core.debug(new Date().toTimeString()),
      IO.chain(() => core.setOutput('time', new Date().toTimeString())),
      (io) => TE.fromIO<void, Error>(io)
    )),
    TE.orElse((e) => TE.fromIO(core.setFailed(e.message))),
    TE.mapLeft(constVoid),
    TE.toUnion
  )



main()
