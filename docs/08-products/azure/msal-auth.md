# MSAL Authentication

Microsoft Authentication Library (MSAL) integration for Azure AD SSO.

---

## Overview

The Azure app uses MSAL.js for authentication:

- Single Sign-On with Microsoft Entra ID
- Silent token refresh
- Consent for OneDrive access

---

## Configuration

```typescript
// authConfig.ts
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
};

export const loginRequest: PopupRequest = {
  scopes: ['User.Read', 'Files.ReadWrite'],
};
```

---

## Authentication Flow

```
USER                    AZURE APP                 ENTRA ID
  │                         │                         │
  │── Click Sign In ───────▶│                         │
  │                         │── Redirect to login ───▶│
  │                         │                         │
  │◀────────────── User authenticates ───────────────▶│
  │                         │                         │
  │                         │◀── Token + claims ──────│
  │                         │                         │
  │◀── Signed in ───────────│                         │
```

---

## Token Management

```typescript
// hooks/useAuth.ts
export function useAuth() {
  const { instance, accounts } = useMsal();

  const getToken = async () => {
    const account = accounts[0];
    if (!account) return null;

    try {
      const response = await instance.acquireTokenSilent({
        scopes: ['Files.ReadWrite'],
        account,
      });
      return response.accessToken;
    } catch (error) {
      // Silent failed, try interactive
      const response = await instance.acquireTokenPopup({
        scopes: ['Files.ReadWrite'],
      });
      return response.accessToken;
    }
  };

  return { getToken, accounts };
}
```

---

## Required Permissions

| Permission      | Type      | Purpose          |
| --------------- | --------- | ---------------- |
| User.Read       | Delegated | Get user profile |
| Files.ReadWrite | Delegated | OneDrive access  |

---

## See Also

- [OneDrive Sync](onedrive-sync.md)
- [MSAL.js Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-js-initializing-client-applications)
