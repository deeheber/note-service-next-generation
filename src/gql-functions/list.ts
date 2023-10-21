import { scan } from '@aws-appsync/utils/dynamodb'
import { Context } from '@aws-appsync/utils'

export const request = () => {
  /**
   Note: consider using Query w/ pagination instead of Scan for large tables
   */
  return scan({ select: 'ALL_ATTRIBUTES' })
}

export const response = (ctx: Context) => {
  const { result } = ctx

  return {
    total: result?.scannedCount ?? 0,
    items: result?.items ?? [],
  }
}
