import { pbkdf2 } from 'crypto';
import { promisify } from 'util';

const hashPassword = promisify(pbkdf2);

export async function calculatePasswordHash(
  plainTextPassword: string,
  passwordSalt: string
): Promise<string> {
  const passwordHash = await hashPassword(plainTextPassword, passwordSalt, 1000, 64, 'sha512');

  return passwordHash.toString('hex');
}
