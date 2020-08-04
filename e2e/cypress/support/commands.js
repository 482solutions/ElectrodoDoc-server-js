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
    length: 10,
    lowercase: true,
    uppercase: true,
  })
}

export function getCidFromFile (fileName, files) {
  for (let key in files) {
    if (fileName === files[key].name) {
      return files[key].versions[0].cid
    }
  }
}

export function getHashFromFile (filename, files) {
  for (let key in files) {
    if (filename === files[key].name) {
      return files[key].hash
    }
  }
}

export function getHashFromFolder (folderName, folders) {
  for (let key in folders) {
    if (folderName === folders[key].name) {
      return folders[key].hash
    }
  }
}

export function getVoting(fileName, obj) {
  for (let key in obj) {
    if (fileName === obj[key].votingName) {
      return obj[key]
    }
  }
}

export function getVoteOfUser(username, voters) {
  for (let key in voters) {
    if (username === voters[key].name) {
      return voters[key].vote
    }
  }
}
