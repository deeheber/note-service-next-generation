import * as ddb from '@aws-appsync/utils/dynamodb'
import { Context } from '@aws-appsync/utils'

export const request = (ctx: Context) => {
  return ddb.get({ key: { id: ctx.args.id } })
}

export const response = (ctx: Context) => {
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
