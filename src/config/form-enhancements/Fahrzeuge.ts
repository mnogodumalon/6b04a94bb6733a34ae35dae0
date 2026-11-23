// Auto-generated. Per-entity form-enhancements config for "Fahrzeuge".
// Written by the backend form polish (app/services/form_polish.py) from the
// generator's manifest; scripts/parse-formulas.mjs expands the formula strings.
// Schema: see ./types.ts.

import type { FormEnhancements } from './types';

export const formEnhancements: FormEnhancements = {
  fieldOrder: [{"row": ["hersteller", "modell_typ"], "cols": "1fr 1fr"}, "fin", "erstzulassung", "kennzeichen", {"row": ["fahrzeugart", "kraftstoff"], "cols": "1fr 1fr"}, "farbe", {"row": ["leistung_kw", "hubraum_ccm"], "cols": "1fr 1fr"}, "kilometerstand", {"row": ["versicherung", "versicherungsnummer"], "cols": "1fr 1fr"}, "naechste_hu", "notizen"],
  defaults: {},
  computed: {},
};

export const computedDeps: Record<string, string[]> = {};
export const computedApplookupRefs: Record<string, {lookupKey: string}[]> = {};
