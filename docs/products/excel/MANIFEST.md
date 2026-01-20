# Excel Add-in Manifest

## Manifest Type

The add-in uses the **unified manifest** format (JSON) for modern Office add-ins.

---

## Key Configuration

### Identity

```json
{
  "id": "variscout-excel-addin",
  "version": "1.0.0",
  "name": {
    "default": "VaRiScout",
    "short": "VaRiScout"
  },
  "description": {
    "default": "Variation analysis for Excel"
  },
  "publisher": "RDMAIC Oy"
}
```

### Permissions

```json
{
  "authorization": {
    "permissions": {
      "resourceSpecific": [
        {
          "name": "Document.ReadWrite.All",
          "type": "Delegated"
        }
      ]
    }
  }
}
```

### Extension Points

```json
{
  "extensions": [
    {
      "type": "taskPane",
      "id": "variscout-taskpane",
      "label": "VaRiScout",
      "icon": {
        "size": 16,
        "file": "assets/icon-16.png"
      },
      "action": {
        "type": "showTaskPane",
        "taskPaneId": "variscout-taskpane"
      }
    },
    {
      "type": "contentAddIn",
      "id": "variscout-content",
      "resources": {
        "content": {
          "source": "https://localhost:3000/content.html"
        }
      }
    }
  ]
}
```

### Ribbon Configuration

```json
{
  "ribbon": {
    "tabs": [
      {
        "id": "VaRiScoutTab",
        "label": "VaRiScout",
        "groups": [
          {
            "id": "analysisGroup",
            "label": "Analysis",
            "controls": [
              {
                "type": "button",
                "id": "openTaskPane",
                "label": "Open VaRiScout",
                "icon": "assets/icon-32.png",
                "action": {
                  "type": "showTaskPane",
                  "taskPaneId": "variscout-taskpane"
                }
              }
            ]
          }
        ]
      }
    ]
  }
}
```

---

## AppSource Requirements

| Requirement         | Value             |
| ------------------- | ----------------- |
| Min Office Version  | 16.0.0            |
| Supported Hosts     | Excel             |
| Supported Platforms | Windows, Mac, Web |
| Privacy Policy URL  | Required          |
| Support URL         | Required          |
| Screenshots         | 3-10 images       |

---

## See Also

- [Overview](./OVERVIEW.md) - Product summary
- [Development](./DEVELOPMENT.md) - Development setup
