import { remove } from '@aws-appsync/utils/dynamodb'
import { Context } from '@aws-appsync/utils'

export const request = (ctx: Context) => remove({ key: { id: ctx.args.id } })

export const response = (ctx: Context) => ctx.args.id
