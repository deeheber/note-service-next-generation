import { update, operations } from '@aws-appsync/utils/dynamodb'
import { Context, util } from '@aws-appsync/utils'
import { Note } from './types'

export const request = (ctx: Context) => {
  const { id, content } = ctx.args

  const updateObj = {
    content: operations.replace(content),
    updatedAt: operations.replace(util.time.nowISO8601()),
  }

  return update({
    key: { id },
    update: updateObj,
    condition: { id: { attributeExists: true } },
  })
}

export const response = (ctx: Context): Note | void => {
  const { result, error } = ctx

  if (error) {
    return util.appendError(error.message, error.type, result, null)
  }

  return result
}
