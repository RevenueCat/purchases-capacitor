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
} from '@ionic/react';
import { addOutline, createOutline, trashOutline, codeSlashOutline } from 'ionicons/icons';

interface CustomVariablesEditorProps {
  variables: Record<string, string>;
  onVariablesChanged: (variables: Record<string, string>) => void;
}

const VARIABLE_NAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]*$/;

const CustomVariablesEditor: React.FC<CustomVariablesEditorProps> = ({
  variables,
  onVariablesChanged,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const sortedEntries = Object.entries(variables).sort(([a], [b]) => a.localeCompare(b));

  const addVariable = (name: string, value: string) => {
    if (!name || !VARIABLE_NAME_REGEX.test(name)) return;
    if (name in variables) return;
    onVariablesChanged({ ...variables, [name]: value });
  };

  const editVariable = (oldKey: string, newKey: string, value: string) => {
    if (!newKey || !VARIABLE_NAME_REGEX.test(newKey)) return;
    if (newKey !== oldKey && newKey in variables) return;
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
              <IonButton onClick={() => setShowAddAlert(true)}>
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
              {sortedEntries.map(([key, value]) => (
                <IonItemSliding key={key}>
                  <IonItem>
                    <IonLabel>
                      <h2 style={{ fontFamily: 'monospace' }}>{key}</h2>
                      <p>{value}</p>
                    </IonLabel>
                    <IonBadge color="medium" slot="end" style={{ marginRight: 8 }}>
                      String
                    </IonBadge>
                    <IonButton fill="clear" slot="end" onClick={() => setEditingKey(key)}>
                      <IonIcon icon={createOutline} />
                    </IonButton>
                  </IonItem>
                  <IonItemOptions side="end">
                    <IonItemOption color="danger" onClick={() => deleteVariable(key)}>
                      <IonIcon icon={trashOutline} slot="icon-only" />
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              ))}
            </IonList>
          )}

          {/* Add Variable Alert */}
          <IonAlert
            isOpen={showAddAlert}
            onDidDismiss={() => setShowAddAlert(false)}
            header="Add Variable"
            inputs={[
              {
                name: 'name',
                type: 'text',
                placeholder: 'e.g., player_name',
              },
              {
                name: 'value',
                type: 'text',
                placeholder: 'e.g., John',
              },
            ]}
            buttons={[
              { text: 'Cancel', role: 'cancel' },
              {
                text: 'Add',
                handler: (data) => {
                  addVariable(data.name?.trim(), data.value ?? '');
                },
              },
            ]}
          />

          {/* Edit Variable Alert */}
          <IonAlert
            isOpen={editingKey !== null}
            onDidDismiss={() => setEditingKey(null)}
            header="Edit Variable"
            inputs={[
              {
                name: 'name',
                type: 'text',
                value: editingKey ?? '',
              },
              {
                name: 'value',
                type: 'text',
                value: editingKey ? variables[editingKey] ?? '' : '',
              },
            ]}
            buttons={[
              { text: 'Cancel', role: 'cancel' },
              {
                text: 'Save',
                handler: (data) => {
                  if (editingKey) {
                    editVariable(editingKey, data.name?.trim(), data.value ?? '');
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
