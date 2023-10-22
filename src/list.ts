import { scan } from '@aws-appsync/utils/dynamodb'
import { Context } from '@aws-appsync/utils'
import { ListNotesResult } from './types'

export const request = () => {
  /**
   Note: consider using Query w/ pagination instead of Scan for large tables
   */
  return scan({ select: 'ALL_ATTRIBUTES' })
}

export const response = (ctx: Context): ListNotesResult => {
  const { result } = ctx

  return {
    total: result?.scannedCount ?? 0,
    items: result?.items ?? [],
  }
}
