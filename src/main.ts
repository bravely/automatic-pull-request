import * as ocore from '@actions/core'
import {wait} from './wait'
import * as IO from 'fp-ts/IO'
import * as T from 'fp-ts/Task'
import * as O from 'fp-ts/Option'
import * as TE from 'fp-ts/TaskEither'
import { pipe, flow } from 'fp-ts/function'

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
    IO.chainFirst((ms) => {
      core.debug(`Waiting ${ms} milliseconds ...`)
      return core.debug(new Date().toTimeString())
    }),
    T.fromIO,
    T.chain(flow(
      O.map((ms) => parseInt(ms, 10)),
      TE.fromOption(() => new Error('milliseconds arg required')),
      TE.chain(wait),
      TE.chain(() => {
        core.debug(new Date().toTimeString())
        return TE.fromIO(core.setOutput('time', new Date().toTimeString()))
      }),
      TE.mapLeft((e) => { core.setFailed(e.message) }),
      TE.toUnion
    ))
  )



main()
