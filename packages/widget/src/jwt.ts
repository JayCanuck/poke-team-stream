import { base64url } from 'rfc4648';
import { MAX_LIFE } from './config';

const ALGORITHM_NAME = 'RSASSA-PKCS1-v1_5';
const ALGORITHM_MODULUS_LENGTH = 2048;
const ALGORITHM_PUBLIC_EXPONENT = new Uint8Array([1, 0, 1]);
const ALGORITHM_HASH = 'SHA-256';
const ALGORITHM_JWT = 'RS256';

let privateKey: CryptoKey;
let publicKey: CryptoKey;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const importKey = async (key: JsonWebKey, keyUsages: ReadonlyArray<KeyUsage>) =>
  crypto.subtle.importKey(
    'jwk',
    key,
    {
      name: ALGORITHM_NAME,
      hash: { name: ALGORITHM_HASH }
    },
    false,
    keyUsages
  );

const exportKey = async (key: CryptoKey) => crypto.subtle.exportKey('jwk', key);

export interface JsonWebKeyPair {
  privateKey: JsonWebKey;
  publicKey: JsonWebKey;
}

// Loads JWK pair into memory.
// When existing keys are passed in, imports the keys, otherwise generates a new pair
// When new keys are generated, they will be returned
export const loadKeys = async (existing?: JsonWebKeyPair | null) => {
  if (existing) {
    // future: validate keys are good, for now errors will throw on failure
    privateKey = await importKey(existing.privateKey, ['sign']);
    publicKey = await importKey(existing.publicKey, ['verify']);

    return existing;
  } else {
    const generatedKeyPair = await crypto.subtle.generateKey(
      {
        name: ALGORITHM_NAME,
        modulusLength: ALGORITHM_MODULUS_LENGTH,
        publicExponent: ALGORITHM_PUBLIC_EXPONENT,
        hash: ALGORITHM_HASH
      },
      true,
      ['sign', 'verify']
    );
    privateKey = generatedKeyPair.privateKey;
    publicKey = generatedKeyPair.publicKey;
    const privateJWK = await exportKey(privateKey);
    const publicJWK = await exportKey(publicKey);

    return {
      privateKey: privateJWK,
      publicKey: publicJWK
    } as JsonWebKeyPair;
  }
};

// Creates a signed JWT representation of a JSON value
export const sign = async (data: Record<string, unknown>) => {
  if (!privateKey) throw new Error('Private key not loaded');

  const now = Date.now();
  const header = { alg: ALGORITHM_JWT, typ: 'JWT' };
  const payload = {
    ...data,
    iat: Math.floor(now / 1000),
    exp: Math.floor((now + MAX_LIFE) / 1000)
  };
  const encodedHeader = base64url.stringify(encoder.encode(JSON.stringify(header)), { pad: false });
  const encodedPayload = base64url.stringify(encoder.encode(JSON.stringify(payload)), { pad: false });
  const signature = await crypto.subtle.sign(
    { name: ALGORITHM_NAME },
    privateKey,
    encoder.encode(`${encodedHeader}.${encodedPayload}`)
  );
  const encodedSignature = base64url.stringify(new Uint8Array(signature), { pad: false });

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
};

// Verifies a JWT is valid and not expired
export const verify = async (jwt: string) => {
  if (!publicKey) throw new Error('Public key not loaded');

  const [header, payload, signature] = jwt.split('.');

  const isValid = await crypto.subtle.verify(
    { name: ALGORITHM_NAME },
    publicKey,
    base64url.parse(signature, { loose: true }),
    encoder.encode(`${header}.${payload}`)
  );
  if (isValid) {
    // check expiry
    try {
      const decodedPayload = JSON.parse(decoder.decode(base64url.parse(payload, { loose: true }))) as { exp: number };
      return Date.now() <= decodedPayload.exp * 1000;
    } catch (err) {
      return false;
    }
  } else {
    return false;
  }
};
