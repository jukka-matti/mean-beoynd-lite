# Azure Deployment

## Architecture

```
CUSTOMER'S AZURE TENANT
─────────────────────────────────────────────────────────────────

Resource Group: rg-variscout
├── Azure Static Web App (Frontend)
│   • React PWA
│   • Custom domain: analysis.yourcompany.com
│
├── Azure Functions (Backend API)
│   • /api/auth/login
│   • /api/projects/*
│   • /api/templates/*
│
└── App Registration (Azure AD)
    • SSO configuration
    • Graph API permissions
```

---

## Azure Resources

| Resource         | SKU         | Est. Cost      |
| ---------------- | ----------- | -------------- |
| Static Web App   | Free        | €0/month       |
| Azure Functions  | Consumption | ~€5-10/month   |
| App Registration | Free        | €0/month       |
| Custom Domain    | Included    | €0/month       |
| **Total**        |             | **~€10/month** |

---

## Deployment Steps

### 1. Create Resources

```bash
# Create resource group
az group create --name rg-variscout --location westeurope

# Create Static Web App
az staticwebapp create \
  --name variscout-app \
  --resource-group rg-variscout \
  --source https://github.com/your-org/variscout-azure \
  --branch main \
  --app-location "/apps/azure" \
  --api-location "/apps/azure/api"
```

### 2. Configure App Registration

1. Go to Azure Portal → Azure Active Directory → App registrations
2. New registration: "VaRiScout"
3. Add redirect URI: `https://analysis.yourcompany.com`
4. Configure API permissions (Graph API)

### 3. Set Environment Variables

```bash
az staticwebapp appsettings set \
  --name variscout-app \
  --setting-names \
    AZURE_CLIENT_ID=xxx \
    AZURE_TENANT_ID=xxx
```

---

## Custom Domain

```bash
az staticwebapp hostname set \
  --name variscout-app \
  --hostname analysis.yourcompany.com
```

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Azure overview
- [MSAL Auth](./MSAL-AUTH.md) - Authentication
