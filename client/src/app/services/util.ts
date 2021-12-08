import { environment } from '@env/environment';

export function redirectForOIDC() {
  document.location.href = `${environment.serverURL}/oauth/login`;
}
