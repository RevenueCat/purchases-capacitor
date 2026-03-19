import React, { useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
  IonBadge,
  IonAlert,
  IonActionSheet,
} from '@ionic/react';
import { addOutline, createOutline, trashOutline, codeSlashOutline } from 'ionicons/icons';

type VariableValue = string | number | boolean;
type VariableType = 'string' | 'number' | 'boolean';

interface CustomVariablesEditorProps {
  variables: Record<string, VariableValue>;
  onVariablesChanged: (variables: Record<string, VariableValue>) => void;
}

const VARIABLE_NAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]*$/;

function getVariableType(value: VariableValue): VariableType {
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  return 'string';
}

function badgeColor(type: VariableType): string {
  switch (type) {
    case 'boolean': return 'tertiary';
    case 'number': return 'secondary';
    default: return 'medium';
  }
}

function displayValue(value: VariableValue): string {
  return String(value);
}

function parseValue(raw: string, type: VariableType): VariableValue | null {
  switch (type) {
    case 'boolean':
      if (raw.toLowerCase() === 'true') return true;
      if (raw.toLowerCase() === 'false') return false;
      return null;
    case 'number': {
      const n = Number(raw);
      return isNaN(n) ? null : n;
    }
    default:
      return raw;
  }
}

const CustomVariablesEditor: React.FC<CustomVariablesEditorProps> = ({
  variables,
  onVariablesChanged,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [addType, setAddType] = useState<VariableType>('string');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [showEditTypePicker, setShowEditTypePicker] = useState(false);
  const [showEditAlert, setShowEditAlert] = useState(false);
  const [editType, setEditType] = useState<VariableType>('string');

  const sortedEntries = Object.entries(variables).sort(([a], [b]) => a.localeCompare(b));

  const addVariable = (name: string, rawValue: string, type: VariableType) => {
    if (!name || !VARIABLE_NAME_REGEX.test(name)) return;
    if (name in variables) return;
    const value = parseValue(rawValue, type);
    if (value === null) return;
    onVariablesChanged({ ...variables, [name]: value });
  };

  const editVariable = (oldKey: string, newKey: string, rawValue: string, type: VariableType) => {
    if (!newKey || !VARIABLE_NAME_REGEX.test(newKey)) return;
    if (newKey !== oldKey && newKey in variables) return;
    const value = parseValue(rawValue, type);
    if (value === null) return;
    const updated = { ...variables };
    delete updated[oldKey];
    updated[newKey] = value;
    onVariablesChanged(updated);
    setEditingKey(null);
  };

  const deleteVariable = (key: string) => {
    const updated = { ...variables };
    delete updated[key];
    onVariablesChanged(updated);
  };

  const variableCount = Object.keys(variables).length;

  return (
    <>
      <IonButton size="small" onClick={() => setIsOpen(true)}>
        Custom Variables
        {variableCount > 0 && (
          <IonBadge color="primary" style={{ marginLeft: 8 }}>
            {variableCount}
          </IonBadge>
        )}
      </IonButton>

      <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Custom Variables</IonTitle>
            <IonButtons slot="start">
              <IonButton onClick={() => setIsOpen(false)}>Done</IonButton>
            </IonButtons>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowTypePicker(true)}>
                <IonIcon icon={addOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {sortedEntries.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#888',
            }}>
              <IonIcon icon={codeSlashOutline} style={{ fontSize: 64, marginBottom: 16 }} />
              <p style={{ fontSize: 18 }}>No custom variables</p>
              <p style={{ fontSize: 14 }}>Tap + to add a variable</p>
              <p style={{ fontSize: 12, fontFamily: 'monospace', marginTop: 16 }}>
                {'Use {{ custom.variable_name }} in paywalls'}
              </p>
            </div>
          ) : (
            <IonList>
              {sortedEntries.map(([key, value]) => {
                const type = getVariableType(value);
                return (
                  <IonItemSliding key={key}>
                    <IonItem>
                      <IonLabel>
                        <h2 style={{ fontFamily: 'monospace' }}>{key}</h2>
                        <p>{displayValue(value)}</p>
                      </IonLabel>
                      <IonBadge color={badgeColor(type)} slot="end" style={{ marginRight: 8 }}>
                        {type}
                      </IonBadge>
                      <IonButton fill="clear" slot="end" onClick={() => {
                        setEditType(type);
                        setEditingKey(key);
                        setShowEditTypePicker(true);
                      }}>
                        <IonIcon icon={createOutline} />
                      </IonButton>
                    </IonItem>
                    <IonItemOptions side="end">
                      <IonItemOption color="danger" onClick={() => deleteVariable(key)}>
                        <IonIcon icon={trashOutline} slot="icon-only" />
                      </IonItemOption>
                    </IonItemOptions>
                  </IonItemSliding>
                );
              })}
            </IonList>
          )}

          {/* Step 1: Pick type for new variable */}
          <IonActionSheet
            isOpen={showTypePicker}
            onDidDismiss={() => setShowTypePicker(false)}
            header="Select variable type"
            buttons={[
              { text: 'String', handler: () => { setAddType('string'); setShowAddAlert(true); } },
              { text: 'Number', handler: () => { setAddType('number'); setShowAddAlert(true); } },
              { text: 'Boolean', handler: () => { setAddType('boolean'); setShowAddAlert(true); } },
              { text: 'Cancel', role: 'cancel' },
            ]}
          />

          {/* Step 2: Input name & value for new variable */}
          <IonAlert
            isOpen={showAddAlert}
            onDidDismiss={() => setShowAddAlert(false)}
            header={`Add ${addType} variable`}
            inputs={[
              {
                name: 'name',
                type: 'text',
                placeholder: 'e.g., player_name',
              },
              {
                name: 'value',
                type: addType === 'number' ? 'number' : 'text',
                placeholder: addType === 'boolean' ? 'true or false' : addType === 'number' ? 'e.g., 42' : 'e.g., John',
              },
            ]}
            buttons={[
              { text: 'Cancel', role: 'cancel' },
              {
                text: 'Add',
                handler: (data) => {
                  addVariable(data.name?.trim(), data.value ?? '', addType);
                },
              },
            ]}
          />

          {/* Step 1: Pick type for editing variable */}
          <IonActionSheet
            isOpen={showEditTypePicker}
            onDidDismiss={() => { if (!showEditAlert) { setEditingKey(null); } setShowEditTypePicker(false); }}
            header="Select variable type"
            buttons={[
              { text: 'String', handler: () => { setEditType('string'); setShowEditAlert(true); } },
              { text: 'Number', handler: () => { setEditType('number'); setShowEditAlert(true); } },
              { text: 'Boolean', handler: () => { setEditType('boolean'); setShowEditAlert(true); } },
              { text: 'Cancel', role: 'cancel' },
            ]}
          />

          {/* Step 2: Input name & value for editing variable */}
          <IonAlert
            isOpen={showEditAlert && editingKey !== null}
            onDidDismiss={() => { setShowEditAlert(false); setEditingKey(null); }}
            header={`Edit ${editType} variable`}
            inputs={[
              {
                name: 'name',
                type: 'text',
                value: editingKey ?? '',
              },
              {
                name: 'value',
                type: editType === 'number' ? 'number' : 'text',
                value: editingKey ? displayValue(variables[editingKey]) : '',
              },
            ]}
            buttons={[
              { text: 'Cancel', role: 'cancel' },
              {
                text: 'Save',
                handler: (data) => {
                  if (editingKey) {
                    editVariable(editingKey, data.name?.trim(), data.value ?? '', editType);
                  }
                },
              },
            ]}
          />
        </IonContent>
      </IonModal>
    </>
  );
};

export default CustomVariablesEditor;
