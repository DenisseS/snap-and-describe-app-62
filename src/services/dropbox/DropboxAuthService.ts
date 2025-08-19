
import { DropboxConfig } from '../../types/dropbox-auth';

export class DropboxAuthService {
  constructor(private config: DropboxConfig) {}

  // Generate PKCE parameters
  generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, Array.from(array)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(digest))))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  // Start OAuth flow
  async startAuth(): Promise<void> {
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    
    // Store verifier for callback
    localStorage.setItem('dropbox_code_verifier', codeVerifier);
    
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      response_type: 'code',
      redirect_uri: this.config.redirectUri,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      scope: 'files.metadata.write files.content.write files.content.read sharing.read sharing.write',
      token_access_type: 'offline' // Para obtener refresh token
    });

    const authUrl = `https://www.dropbox.com/oauth2/authorize?${params.toString()}`;
    window.location.href = authUrl;
  }
}
