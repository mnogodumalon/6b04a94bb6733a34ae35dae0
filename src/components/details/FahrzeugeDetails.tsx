import type { Fahrzeuge } from '@/types/app';
import { APP_IDS } from '@/types/app';
import { extractRecordId } from '@/services/livingAppsService';
import {
  RecordSection, RecordField, RecordRelation, RecordAttachments,
} from '@/components/widgets/RecordView';
import { t, appLabel, fieldLabel } from '@/i18n';
import { usePermissions } from '@/lib/permissions';

export interface FahrzeugeDetailsProps {
  /** Der Record — enriched oder roh; alle Felder werden hier gerendert. */
  record: Fahrzeuge;
}

export function FahrzeugeDetails({
  record,
}: FahrzeugeDetailsProps) {
  // attachments are a write to this record — read-only without the platform right
  const perms = usePermissions();
  return (
    <>
      <RecordSection title={t('details')} cols={2}>
        <RecordField label={fieldLabel('fahrzeuge', 'versicherung')} value={record.fields.versicherung} format="text" />
        <RecordField label={fieldLabel('fahrzeuge', 'versicherungsnummer')} value={record.fields.versicherungsnummer} format="text" />
        <RecordField label={fieldLabel('fahrzeuge', 'notizen')} value={record.fields.notizen} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('fahrzeuge', 'naechste_hu')} value={record.fields.naechste_hu} format="date" />
        <RecordField label={fieldLabel('fahrzeuge', 'hersteller')} value={record.fields.hersteller} format="text" />
        <RecordField label={fieldLabel('fahrzeuge', 'modell_typ')} value={record.fields.modell_typ} format="text" />
        <RecordField label={fieldLabel('fahrzeuge', 'fahrzeugart')} value={record.fields.fahrzeugart} format="pill" />
        <RecordField label={fieldLabel('fahrzeuge', 'fin')} value={record.fields.fin} format="text" />
        <RecordField label={fieldLabel('fahrzeuge', 'erstzulassung')} value={record.fields.erstzulassung} format="date" />
        <RecordField label={fieldLabel('fahrzeuge', 'kennzeichen')} value={record.fields.kennzeichen} format="text" />
        <RecordField label={fieldLabel('fahrzeuge', 'farbe')} value={record.fields.farbe} format="text" />
        <RecordField label={fieldLabel('fahrzeuge', 'kraftstoff')} value={record.fields.kraftstoff} format="pill" />
        <RecordField label={fieldLabel('fahrzeuge', 'leistung_kw')} value={record.fields.leistung_kw} format="text" />
        <RecordField label={fieldLabel('fahrzeuge', 'hubraum_ccm')} value={record.fields.hubraum_ccm} format="text" />
        <RecordField label={fieldLabel('fahrzeuge', 'kilometerstand')} value={record.fields.kilometerstand} format="text" />
      </RecordSection>

      <RecordAttachments appId={APP_IDS.FAHRZEUGE} recordId={record.record_id} readOnly={!perms.canWrite('fahrzeuge')} />
    </>
  );
}
