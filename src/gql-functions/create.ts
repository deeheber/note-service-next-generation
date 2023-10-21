import * as ddb from '@aws-appsync/utils/dynamodb'
import { Context, util } from '@aws-appsync/utils'

export const request = (ctx: Context) => {
  const { note } = ctx.args

  const id = util.autoId()
  const newNote = {
    id,
    content: note.content,
    author: note.author,
    createdAt: util.time.nowISO8601(),
  }

  return ddb.put({
    item: newNote,
    key: { id },
  })
}

export const response = (ctx: Context) => ctx.result
