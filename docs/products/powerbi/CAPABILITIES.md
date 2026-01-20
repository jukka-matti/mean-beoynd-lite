# Power BI Capabilities

## Data Roles

### VaRiScout Dashboard

```json
{
  "dataRoles": [
    {
      "name": "measureValue",
      "displayName": "Value (Y)",
      "kind": "Measure",
      "requiredTypes": [{ "numeric": true }]
    },
    {
      "name": "timestamp",
      "displayName": "Timestamp / Sequence",
      "kind": "Grouping",
      "requiredTypes": [{ "dateTime": true }, { "integer": true }]
    },
    {
      "name": "factors",
      "displayName": "Factors (Categories)",
      "kind": "Grouping",
      "requiredTypes": [{ "text": true }]
    },
    {
      "name": "specLSL",
      "displayName": "Lower Spec Limit",
      "kind": "Measure",
      "requiredTypes": [{ "numeric": true }]
    },
    {
      "name": "specUSL",
      "displayName": "Upper Spec Limit",
      "kind": "Measure",
      "requiredTypes": [{ "numeric": true }]
    },
    {
      "name": "specTarget",
      "displayName": "Target",
      "kind": "Measure",
      "requiredTypes": [{ "numeric": true }]
    }
  ]
}
```

---

## Data View Mappings

```json
{
  "dataViewMappings": [
    {
      "conditions": [
        {
          "measureValue": { "max": 1 },
          "timestamp": { "max": 1 },
          "factors": { "max": 3 }
        }
      ],
      "categorical": {
        "categories": {
          "for": { "in": "timestamp" },
          "dataReductionAlgorithm": { "top": { "count": 10000 } }
        },
        "values": {
          "select": [
            { "bind": { "to": "measureValue" } },
            { "bind": { "to": "specLSL" } },
            { "bind": { "to": "specUSL" } }
          ]
        }
      }
    }
  ]
}
```

---

## Objects (Settings)

```json
{
  "objects": {
    "controlLimits": {
      "displayName": "Control Limits",
      "properties": {
        "show": { "type": { "bool": true }, "displayName": "Show" },
        "color": { "type": { "fill": { "solid": { "color": true } } } }
      }
    },
    "specLimits": {
      "displayName": "Specification Limits",
      "properties": {
        "show": { "type": { "bool": true }, "displayName": "Show" },
        "color": { "type": { "fill": { "solid": { "color": true } } } }
      }
    }
  }
}
```

---

## See Also

- [OVERVIEW](./OVERVIEW.md) - Power BI overview
- [Visual Implementation](./VISUAL-IMPLEMENTATION.md) - Visual code
