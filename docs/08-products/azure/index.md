# Azure Team App

VariScout for team collaboration with Microsoft 365 integration.

---

## Overview

The Azure Team App extends the PWA with:

- Microsoft Entra ID (Azure AD) authentication
- OneDrive sync for projects
- Team collaboration features
- SharePoint integration (planned)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      CUSTOMER AZURE TENANT                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    AZURE APP SERVICE                       │  │
│  │              (or Static Web App)                          │  │
│  │                                                           │  │
│  │   ┌─────────────────────────────────────────────────────┐ │  │
│  │   │              VARISCOUT AZURE APP                    │ │  │
│  │   │   (Same as PWA + MSAL + OneDrive)                  │ │  │
│  │   └─────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                 MICROSOFT ENTRA ID                        │  │
│  │              (Authentication via MSAL)                    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                      ONEDRIVE                             │  │
│  │              (Project sync & sharing)                     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Features

| Feature    | Description                       |
| ---------- | --------------------------------- |
| SSO        | Microsoft Entra ID via MSAL       |
| Cloud Sync | Projects saved to OneDrive        |
| Sharing    | Share projects with team members  |
| Offline    | Cached locally, syncs when online |

---

## Deployment

Deploys to customer's Azure tenant via ARM template:

```bash
# 1-click deployment
az deployment group create \
  --resource-group rg-variscout \
  --template-uri https://raw.githubusercontent.com/.../azuredeploy.json
```

---

## Data Location

All data stays in the customer's tenant:

- App hosted in customer's Azure
- Projects stored in user's OneDrive
- No data sent to VariScout servers

---

## See Also

- [MSAL Authentication](msal-auth.md)
- [OneDrive Sync](onedrive-sync.md)
