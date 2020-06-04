import { sha256 } from 'js-sha256'
import { generate } from 'generate-password'

export function decode (token, part) {
  let base64Url

  if (part === 0) {
    base64Url = token.split('.')[0]
  }
  if (part === 1) {
    base64Url = token.split('.')[1]
  }
  if (part === 2) {
    base64Url = token.split('.')[2]
  }
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const buff = new Buffer(base64, 'base64')
  const tokenInit = buff.toString('ascii')
  return JSON.parse(tokenInit)
}

export function getPassword () {
  return sha256(generate({
    length: 8,
    numbers: true,
    symbols: true,
    lowercase: true,
    uppercase: true,
  }))
}

export function getLogin () {
  return generate({
    length: 12,
    lowercase: true,
    uppercase: true,
  })
}

