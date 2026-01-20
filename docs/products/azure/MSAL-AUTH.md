# MSAL Authentication

## Azure AD Integration

The Azure app uses MSAL (Microsoft Authentication Library) for Azure AD single sign-on.

---

## MSAL Configuration

```typescript
import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
  auth: {
    clientId: 'your-client-id',
    authority: 'https://login.microsoftonline.com/{tenant-id}',
    redirectUri: 'https://analysis.yourcompany.com',
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);
```

---

## Authentication Flow

```
User visits app
       │
       ▼
Check for cached token
       │
       ├─── Token valid ──────▶ Use token, load app
       │
       └─── No token / expired
                │
                ▼
       Redirect to Azure AD
                │
                ▼
       User signs in (SSO)
                │
                ▼
       Redirect back with code
                │
                ▼
       Exchange for tokens
                │
                ▼
       Store in localStorage
                │
                ▼
       Load app
```

---

## Scopes

```typescript
const scopes = [
  'User.Read', // Basic profile
  'Files.ReadWrite.All', // OneDrive access
  'Sites.ReadWrite.All', // SharePoint access
];

async function getToken(): Promise<string> {
  const account = msalInstance.getAllAccounts()[0];

  const response = await msalInstance.acquireTokenSilent({
    scopes,
    account,
  });

  return response.accessToken;
}
```

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Azure overview
- [Deployment](./DEPLOYMENT.md) - Azure setup
