// @flow
import mime from 'mime/lite'
import type { Attachment } from '../types'

export function isObj(value: any): boolean {
  const type = typeof value
  return value !== null && (type === 'object' || type === 'function')
}

export function isImageAttachment(attachment: Attachment): boolean {
  const mimeType = attachment.type || mime.getType(attachment.id)
  return mimeType && mimeType.split('/')[0] === 'image'
}
