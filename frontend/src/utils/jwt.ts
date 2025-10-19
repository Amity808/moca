import * as jose from "jose";

export const EXAMPLE_JWKS_URL =
  "https://static.air3.com/.well-known/example-jwks.json";

export interface JwtPayload {
  partnerId: string;
  scope: string;
  [key: string]: unknown;
}

const signJwt = async ({
  payload,
  privateKeyPem,
  kid,
  jwtAlgorithm = "RS256",
}: {
  payload: JwtPayload;
  privateKeyPem: string;
  kid?: string;
  jwtAlgorithm?: "ES256" | "RS256";
}): Promise<string> => {
  try {
    let privateKey;

    // Check if it's a hex string (starts with 0x)
    if (privateKeyPem.startsWith('0x')) {
      // Convert hex to Uint8Array
      const hexString = privateKeyPem.slice(2); // Remove 0x prefix
      const keyBytes = new Uint8Array(hexString.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

      // Import raw private key using importJWK
      privateKey = await jose.importJWK({
        kty: "EC",
        crv: "P-256",
        d: Buffer.from(keyBytes).toString('base64url'),
      }, jwtAlgorithm, {
        extractable: true,
      });
    } else {
      // Handle PEM format
      const formattedKey = privateKeyPem.replace(/\\n/g, "\n");

      if (formattedKey.includes("-----BEGIN PRIVATE KEY-----")) {
        // Use PKCS#8 format
        privateKey = await jose.importPKCS8(formattedKey, jwtAlgorithm, {
          extractable: true,
        });
      } else {
        throw new Error("Unsupported private key format. Please provide either a hex string (0x...) or PKCS#8 PEM format.");
      }
    }

    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({
        alg: jwtAlgorithm,
        kid: kid || "6386cb4d-c0de-4629-a412-8dcf6f50f805",
      })
      .setExpirationTime("1h")
      .sign(privateKey);

    return jwt;
  } catch (error: unknown) {
    throw new Error(`Failed to import private key. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const generateJwt = async ({
  partnerId,
  privateKey,
  kid,
  jwtAlgorithm = "RS256",
}: {
  partnerId: string;
  privateKey: string;
  kid?: string;
  jwtAlgorithm?: "ES256" | "RS256";
}): Promise<string | null> => {
  try {
    const jwt = await signJwt({
      payload: getJwtPayload(partnerId),
      privateKeyPem: privateKey,
      kid,
      jwtAlgorithm,
    });
    return jwt;
  } catch (error) {
    console.error("Error generating JWT:", error);
    return null;
  }
};

export const getJwtPayload = (partnerId: string): JwtPayload => {
  return {
    partnerId,
    scope: "issue verify",
  };
};

export const validatePrivateKey = (privateKey: string): { isValid: boolean; format?: string; error?: string } => {
  if (!privateKey || privateKey.trim() === "") {
    return { isValid: false, error: "Private key is required" };
  }

  // Check if it's a hex string (starts with 0x)
  if (privateKey.startsWith('0x')) {
    const hexString = privateKey.slice(2); // Remove 0x prefix
    if (hexString.length === 64 && /^[0-9a-fA-F]+$/.test(hexString)) {
      return { isValid: true, format: "Hex" };
    } else {
      return { isValid: false, error: "Invalid hex format. Expected 64 hex characters after 0x" };
    }
  }

  const formattedKey = privateKey.replace(/\\n/g, "\n");

  // Check for PKCS#8 format
  if (formattedKey.includes("-----BEGIN PRIVATE KEY-----")) {
    return { isValid: true, format: "PKCS#8" };
  }

  // Check for PKCS#1 format (RSA) - not supported, but we can detect it
  if (formattedKey.includes("-----BEGIN RSA PRIVATE KEY-----")) {
    return {
      isValid: false,
      error: "PKCS#1 RSA format detected. Please convert to PKCS#8 format. You can use OpenSSL: openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in rsa_key.pem -out pkcs8_key.pem"
    };
  }

  // Check for EC format - not supported, but we can detect it
  if (formattedKey.includes("-----BEGIN EC PRIVATE KEY-----")) {
    return {
      isValid: false,
      error: "EC format detected. Please convert to PKCS#8 format. You can use OpenSSL: openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in ec_key.pem -out pkcs8_key.pem"
    };
  }

  return {
    isValid: false,
    error: "Invalid private key format. Expected hex format (0x...) or PKCS#8 format (-----BEGIN PRIVATE KEY-----)"
  };
};