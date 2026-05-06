/**
 * Generates a Convex local backend admin key without cloud API access.
 *
 * Algorithm (from convex-backend/crates/keybroker):
 *   1. KBKDF-CTR-HMAC-SHA256(instanceSecret, "admin key") → 16-byte AES key
 *   2. Encode AdminKeyProto { issued_s, identity: System }
 *   3. AES-128-GCM-SIV encrypt(proto, aad=[version=1], nonce=12 random bytes)
 *   4. adminKey = instanceName + "|" + hex([version | nonce | ciphertext | tag])
 */

import { createHmac, randomBytes } from 'node:crypto'
import { gcmsiv } from './node_modules/@noble/ciphers/aes.js'

const INSTANCE_NAME = process.env.INSTANCE_NAME ?? 'anonymous-agent'
const INSTANCE_SECRET = process.env.INSTANCE_SECRET ??
  '4361726e697461732c206c69746572616c6c79206d65616e696e6720226c6974'
const ADMIN_KEY_VERSION = 1

// KBKDF-CTR-HMAC-SHA256: K(1) = HMAC-SHA256(secret, [0x00000001] || info)
function kbkdfCtrHmac(secretBytes, info, outLen) {
  const counter = Buffer.alloc(4)
  counter.writeUInt32BE(1, 0)
  const input = Buffer.concat([counter, Buffer.from(info, 'utf8')])
  const k1 = createHmac('sha256', secretBytes).update(input).digest()
  return k1.subarray(0, outLen)
}

// Encode a 64-bit unsigned integer as a protobuf varint
function encodeVarint(value) {
  const bytes = []
  let v = BigInt(value)
  while (v > 0x7fn) {
    bytes.push(Number((v & 0x7fn) | 0x80n))
    v >>= 7n
  }
  bytes.push(Number(v))
  return Buffer.from(bytes)
}

// Build AdminKeyProto bytes:
//   field 2 (issued_s): uint64 varint
//   field 4 (identity.system): Empty message (length 0)
function buildAdminKeyProto(timestampSecs) {
  return Buffer.concat([
    Buffer.from([0x10]),            // tag: field 2, wire type 0 (varint)
    encodeVarint(timestampSecs),
    Buffer.from([0x22, 0x00]),      // tag: field 4, wire type 2 (msg), length 0
  ])
}

const secretBytes = Buffer.from(INSTANCE_SECRET, 'hex')
const derivedKey = kbkdfCtrHmac(secretBytes, 'admin key', 16)

const timestamp = Math.floor(Date.now() / 1000)
const protoBytes = buildAdminKeyProto(timestamp)

const nonce = randomBytes(12)
const aad = new Uint8Array([ADMIN_KEY_VERSION])
const cipher = gcmsiv(derivedKey, nonce, aad)
const encryptedWithTag = cipher.encrypt(protoBytes)

const payload = Buffer.concat([
  Buffer.from([ADMIN_KEY_VERSION]),
  nonce,
  Buffer.from(encryptedWithTag),
])

const adminKey = `${INSTANCE_NAME}|${payload.toString('hex')}`
console.log(adminKey)
