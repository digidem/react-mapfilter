// @flow
import mime from 'mime/lite'
import type { Observation } from 'mapeo-schema'

import { getFields as getFieldsFromTags } from '../lib/data_analysis'
import type {
  PresetWithAdditionalFields,
  Attachment,
  Statistics
} from '../types'

export function isObj(value: any): boolean {
  const type = typeof value
  return value !== null && (type === 'object' || type === 'function')
}

export function isImageAttachment(attachment: Attachment): boolean {
  const mimeType = attachment.type || mime.getType(attachment.id)
  return mimeType && mimeType.split('/')[0] === 'image'
}

export function getLastImage(observation: Observation): Attachment | void {
  const imageAttachments = (observation.attachments || []).filter(
    isImageAttachment
  )
  if (!imageAttachments) return
  return imageAttachments[imageAttachments.length - 1]
}

export function defaultGetPreset(
  observation: Observation,
  stats?: Statistics
): PresetWithAdditionalFields {
  return {
    id: observation.id,
    geometry: ['point'],
    name: (observation.tags && observation.tags.name) || '',
    tags: {},
    fields: [],
    additionalFields: getFieldsFromTags(observation.tags, stats)
  }
}

export function leftPad(str: string, len: number, char: string): string {
  // doesn't need to pad
  len = len - str.length
  if (len <= 0) return str

  var pad = ''
  while (true) {
    if (len & 1) pad += char
    len >>= 1
    if (len) char += char
    else break
  }
  return pad + str
}