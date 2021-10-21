import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as T from 'fp-ts/Task'

export const wait = (milliseconds: number): TE.TaskEither<Error, string> => {
  return pipe(
    milliseconds,
    TE.fromPredicate((ms: number) => !isNaN(ms), () => new Error('milliseconds not a number')),
    TE.chain<Error, number, string>(ms => pipe(
      TE.of('done!'),
      T.delay(ms)
    ))
  )
}
