import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  tokens,
  Card,
  CardHeader,
  Body1,
  Caption1,
  Input,
  Label,
  Button,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
} from '@fluentui/react-components';
import { SlideSettings24Regular, ArrowReset24Regular, Info24Regular } from '@fluentui/react-icons';
import { CPK_THRESHOLDS, validateThresholds, type CpkThresholds } from '@variscout/core';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  thresholdGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: tokens.spacingHorizontalM,
    marginTop: tokens.spacingVerticalM,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  previewRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalS,
    fontSize: tokens.fontSizeBase200,
    padding: `${tokens.spacingVerticalS} 0`,
  },
  previewLabel: {
    fontWeight: tokens.fontWeightSemibold,
    fontFamily: 'monospace',
  },
  arrow: {
    color: tokens.colorNeutralForeground3,
  },
  infoBox: {
    marginTop: tokens.spacingVerticalS,
  },
});

interface CpkThresholdSettingsProps {
  /** Current threshold values */
  thresholds: CpkThresholds;
  /** Callback when thresholds change */
  onThresholdsChange: (thresholds: CpkThresholds) => void;
}

export const CpkThresholdSettings: React.FC<CpkThresholdSettingsProps> = ({
  thresholds,
  onThresholdsChange,
}) => {
  const styles = useStyles();

  // Local state for inputs
  const [localThresholds, setLocalThresholds] = useState<CpkThresholds>(thresholds);
  const [isValid, setIsValid] = useState(true);

  // Sync local state when props change
  useEffect(() => {
    setLocalThresholds(thresholds);
    setIsValid(validateThresholds(thresholds));
  }, [thresholds]);

  // Validate on local changes
  useEffect(() => {
    const valid = validateThresholds(localThresholds);
    setIsValid(valid);

    // Only propagate valid changes
    if (valid) {
      onThresholdsChange(localThresholds);
    }
  }, [localThresholds, onThresholdsChange]);

  const handleReset = () => {
    setLocalThresholds(CPK_THRESHOLDS);
  };

  const handleCriticalChange = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      setLocalThresholds({ ...localThresholds, critical: num });
    }
  };

  const handleWarningChange = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      setLocalThresholds({ ...localThresholds, warning: num });
    }
  };

  const handleCapableChange = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      setLocalThresholds({ ...localThresholds, capable: num });
    }
  };

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.header}>
          <CardHeader
            image={<SlideSettings24Regular />}
            header={<Body1>Cpk Health Thresholds</Body1>}
            description={
              <Caption1>Customize health classification based on capability standards</Caption1>
            }
          />
          <Button
            appearance="subtle"
            size="small"
            icon={<ArrowReset24Regular />}
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>

        <div className={styles.thresholdGrid}>
          <div className={styles.inputGroup}>
            <Label htmlFor="critical-input" size="small">
              Critical (&lt;)
            </Label>
            <Input
              id="critical-input"
              type="number"
              step="0.1"
              min="0.1"
              value={localThresholds.critical.toString()}
              onChange={(_, data) => handleCriticalChange(data.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <Label htmlFor="warning-input" size="small">
              Warning (&lt;)
            </Label>
            <Input
              id="warning-input"
              type="number"
              step="0.1"
              min={(localThresholds.critical + 0.1).toString()}
              value={localThresholds.warning.toString()}
              onChange={(_, data) => handleWarningChange(data.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <Label htmlFor="capable-input" size="small">
              Capable (&lt;)
            </Label>
            <Input
              id="capable-input"
              type="number"
              step="0.1"
              min={(localThresholds.warning + 0.1).toString()}
              value={localThresholds.capable.toString()}
              onChange={(_, data) => handleCapableChange(data.value)}
            />
          </div>
        </div>

        {/* Preview row */}
        <div className={styles.previewRow}>
          <span
            style={{ color: tokens.colorPaletteRedForeground1 }}
            className={styles.previewLabel}
          >
            Critical &lt;{localThresholds.critical.toFixed(2)}
          </span>
          <span className={styles.arrow}>→</span>
          <span
            style={{ color: tokens.colorPaletteMarigoldForeground1 }}
            className={styles.previewLabel}
          >
            &lt;{localThresholds.warning.toFixed(2)}
          </span>
          <span className={styles.arrow}>→</span>
          <span
            style={{ color: tokens.colorPaletteGreenForeground1 }}
            className={styles.previewLabel}
          >
            &lt;{localThresholds.capable.toFixed(2)}
          </span>
          <span className={styles.arrow}>→</span>
          <span
            style={{ color: tokens.colorPaletteGreenForeground1 }}
            className={styles.previewLabel}
          >
            Excellent
          </span>
        </div>

        {/* Validation error */}
        {!isValid && (
          <MessageBar intent="error" className={styles.infoBox}>
            <MessageBarBody>
              <MessageBarTitle>Invalid ordering</MessageBarTitle>
              Thresholds must follow: Critical &lt; Warning &lt; Capable
            </MessageBarBody>
          </MessageBar>
        )}

        {/* Info message */}
        {isValid && (
          <MessageBar intent="info" icon={<Info24Regular />} className={styles.infoBox}>
            <MessageBarBody>
              <Caption1>
                Industry default: 1.0 (critical), 1.33 (warning), 1.67 (capable). Adjust for
                aerospace (1.5/2.0/2.5) or automotive (1.33/1.67/2.0) standards.
              </Caption1>
            </MessageBarBody>
          </MessageBar>
        )}
      </Card>
    </div>
  );
};
