import { lookupLabel } from '@/i18n';

// AUTOMATICALLY GENERATED TYPES - DO NOT EDIT

export type LookupValue = { key: string; label: string };
/** A raw record URL (applookup reference). NEVER render this directly
 *  in JSX — it is a URL, not a display value. Show the enriched `*Name`
 *  field or resolve it via the entity map instead. Assignable to/from
 *  string everywhere; the `& {}` keeps the alias NAME visible in tsc
 *  error messages (a plain primitive alias gets normalized away). */
export type RecordUrl = string & {};
export type GeoLocation = { lat: number; long: number; info?: string };

export type AttachmentType = 'file' | 'note' | 'url' | 'json';
export interface Attachment {
  id: string;
  type: AttachmentType;
  label: string | null;
  value: string | null;
  active: boolean;
  createdat?: string | null;
  updatedat?: string | null;
}

export interface AttachmentInput {
  type: AttachmentType;
  label?: string;
  value: string;
  active?: boolean;
}

export interface Fahrzeuge {
  record_id: string;
  /** The API field. */
  created_at: string;
  updated_at: string | null;
  /** Alias of created_at, filled by the read helpers. The API sends
   *  snake_case only — reading `createdat` off a raw record yields
   *  undefined, which type-checks and then crashes at runtime. */
  createdat: string;
  updatedat: string | null;
  fields: {
    versicherung?: string;
    versicherungsnummer?: string;
    notizen?: string;
    naechste_hu?: string; // Format: YYYY-MM-DD oder ISO String
    hersteller?: string;
    modell_typ?: string;
    fahrzeugart?: LookupValue;
    fin?: string;
    erstzulassung?: string; // Format: YYYY-MM-DD oder ISO String
    kennzeichen?: string;
    farbe?: string;
    kraftstoff?: LookupValue;
    leistung_kw?: number;
    hubraum_ccm?: number;
    kilometerstand?: number;
  };
}

export const APP_IDS = {
  FAHRZEUGE: '6b04a940c5f14417832d287e',
} as const;


export const LOOKUP_OPTIONS: Record<string, Record<string, {key: string, label: string}[]>> = {
  'fahrzeuge': {
    fahrzeugart: [{ key: "pkw", get label() { return lookupLabel('fahrzeuge', 'fahrzeugart', "pkw") ?? "PKW"; } }, { key: "motorrad", get label() { return lookupLabel('fahrzeuge', 'fahrzeugart', "motorrad") ?? "Motorrad"; } }, { key: "transporter", get label() { return lookupLabel('fahrzeuge', 'fahrzeugart', "transporter") ?? "Transporter"; } }, { key: "wohnmobil", get label() { return lookupLabel('fahrzeuge', 'fahrzeugart', "wohnmobil") ?? "Wohnmobil"; } }, { key: "anhaenger", get label() { return lookupLabel('fahrzeuge', 'fahrzeugart', "anhaenger") ?? "Anhänger"; } }, { key: "sonstiges", get label() { return lookupLabel('fahrzeuge', 'fahrzeugart', "sonstiges") ?? "Sonstiges"; } }],
    kraftstoff: [{ key: "benzin", get label() { return lookupLabel('fahrzeuge', 'kraftstoff', "benzin") ?? "Benzin"; } }, { key: "diesel", get label() { return lookupLabel('fahrzeuge', 'kraftstoff', "diesel") ?? "Diesel"; } }, { key: "elektro", get label() { return lookupLabel('fahrzeuge', 'kraftstoff', "elektro") ?? "Elektro"; } }, { key: "hybrid", get label() { return lookupLabel('fahrzeuge', 'kraftstoff', "hybrid") ?? "Hybrid"; } }, { key: "plugin_hybrid", get label() { return lookupLabel('fahrzeuge', 'kraftstoff', "plugin_hybrid") ?? "Plug-in-Hybrid"; } }, { key: "gas", get label() { return lookupLabel('fahrzeuge', 'kraftstoff', "gas") ?? "Erdgas / LPG"; } }, { key: "sonstiges", get label() { return lookupLabel('fahrzeuge', 'kraftstoff', "sonstiges") ?? "Sonstiges"; } }],
  },
};

// Optimistic LookupValue writes: never re-type a label — resolve the schema
// option instead (its label is a locale-aware getter; falls back to the key).
// WRONG: status: { key: 'offen', label: 'Offen' }   (frozen in one language)
// RIGHT: status: lookupOption('<appKey>', 'status', 'offen')
export function lookupOption(app: string, field: string, key: string): LookupValue {
  return LOOKUP_OPTIONS[app]?.[field]?.find(o => o.key === key) ?? { key, label: key };
}

export const FIELD_TYPES: Record<string, Record<string, string>> = {
  'fahrzeuge': {
    'versicherung': 'string/text',
    'versicherungsnummer': 'string/text',
    'notizen': 'string/textarea',
    'naechste_hu': 'date/date',
    'hersteller': 'string/text',
    'modell_typ': 'string/text',
    'fahrzeugart': 'lookup/select',
    'fin': 'string/text',
    'erstzulassung': 'date/date',
    'kennzeichen': 'string/text',
    'farbe': 'string/text',
    'kraftstoff': 'lookup/select',
    'leistung_kw': 'number',
    'hubraum_ccm': 'number',
    'kilometerstand': 'number',
  },
};

export const HUB_TOPOLOGY: Record<string, { field: string; entity: string }[]> = {
};

type StripLookup<T> = {
  [K in keyof T]: T[K] extends LookupValue | undefined ? string | LookupValue | undefined
    : T[K] extends LookupValue[] | undefined ? string[] | LookupValue[] | undefined
    : T[K];
};

// Helper Types for creating new records (lookup fields as plain strings for API)
export type CreateFahrzeuge = StripLookup<Fahrzeuge['fields']>;