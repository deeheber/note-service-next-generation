import { get } from '@aws-appsync/utils/dynamodb'
import { Context } from '@aws-appsync/utils'
import { Note } from './types'

export const request = (ctx: Context) => get({ key: { id: ctx.args.id } })

export const response = (ctx: Context): Note | void => {
  const { result } = ctx

  if (!result) {
    return util.appendError(
      `No item found with id: ${ctx.args.id}`,
      'NotFound',
      result
    )
  }

  return result
}
