import * as ocore from '@actions/core'
import * as IO from 'fp-ts/IO'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'

export const getInput = (name: string): IO.IO<O.Option<string>> => IO.of(pipe(
  ocore.getInput(name),
  O.fromPredicate(s => s !== '')
))

export const debug = (message: string): IO.IO<void> => IO.of(ocore.debug(message))

export const setOutput = (name: string, value: any): IO.IO<void> => IO.of(ocore.setOutput(name, value))

export const setFailed = (message: string | Error): IO.IO<void> => IO.of(ocore.setFailed(message))
