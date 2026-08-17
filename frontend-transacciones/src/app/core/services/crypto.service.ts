import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

/**
 * Cifrado simétrico AES-256 ECB compatible con API_A (Java Cipher).
 */
@Injectable({ providedIn: 'root' })
export class CryptoService {
  /**
   * Cifra texto plano con AES-256 ECB y retorna Base64.
   * @param text Secreto en texto plano del formulario
   */
  encryptAES(text: string): string {
    const key = CryptoJS.SHA256(environment.aesSecretKey);
    return CryptoJS.AES.encrypt(text, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
  }
}
