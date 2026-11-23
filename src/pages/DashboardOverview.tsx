import { useMemo, useState } from 'react';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { IconAlertTriangle, IconCar, IconPlus, IconSearch, IconCalendarEvent, IconGauge } from '@tabler/icons-react';
import type { DashboardData } from '@/hooks/useDashboardData';
import { useEntityCrud } from '@/components/EntityCrud';
import type { Fahrzeuge } from '@/types/app';
import { formatDate } from '@/lib/formatters';
import { tx, appLabel } from '@/i18n';
import { useClock, gruss, namen } from '@/lib/polish';
import { DashboardGrid } from '@/components/DashboardGrid';
import { StatCard, StatCardRow } from '@/components/StatCard';
import { WorkList } from '@/components/WorkList';
import { HeroBanner } from '@/components/HeroBanner';
import { ChartWidget, type ChartRow } from '@/components/widgets/ChartWidget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Filter = 'all' | 'soon' | 'missing';

const SOON_DAYS = 90;

function vehicleName(f: Fahrzeuge): string {
  const n = [f.fields.hersteller, f.fields.modell_typ].filter(Boolean).join(' ');
  return n || f.fields.kennzeichen || '—';
}

export default function DashboardOverview({ data }: { data: DashboardData }) {
  const { fahrzeuge } = data;
  const crud = useEntityCrud(data);
  const clock = useClock();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const items = useMemo(() => crud.enriched.fahrzeuge.map(f => {
    const hu = f.fields.naechste_hu;
    const days = hu ? differenceInCalendarDays(parseISO(hu), clock) : null;
    return { rec: f as Fahrzeuge, days };
  }), [crud.enriched.fahrzeuge, clock]);

  const overdue = items.filter(i => i.days !== null && i.days < 0).sort((a, b) => a.days! - b.days!);
  const soon = items.filter(i => i.days !== null && i.days >= 0 && i.days <= SOON_DAYS);
  const missing = items.filter(i => i.days === null);

  const upcoming = useMemo(
    () => items.filter(i => i.days !== null && i.days >= 0).sort((a, b) => a.days! - b.days!),
    [items],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter(i => filter === 'all' || (filter === 'soon' ? soon.includes(i) : missing.includes(i)))
      .filter(i => {
        if (!q) return true;
        const f = i.rec.fields;
        return [f.hersteller, f.modell_typ, f.kennzeichen, f.fin, f.fahrzeugart?.label, f.kraftstoff?.label]
          .some(v => v?.toLowerCase().includes(q));
      })
      .sort((a, b) => (a.days ?? 99999) - (b.days ?? 99999));
  }, [items, filter, query, soon, missing]);

  const chartRows = useMemo<ChartRow<Fahrzeuge>[]>(
    () => fahrzeuge.map(f => ({ id: `fahrzeuge:${f.record_id}`, data: f })),
    [fahrzeuge],
  );

  const huLabel = (days: number | null) => {
    if (days === null) return tx('HU-Termin fehlt');
    if (days < 0) return days === -1 ? tx('HU seit 1 Tag überfällig') : tx`HU seit ${-days} Tagen überfällig`;
    if (days === 0) return tx('HU heute fällig');
    return days === 1 ? tx('HU morgen fällig') : tx`HU in ${days} Tagen`;
  };
  const huTone = (days: number | null) =>
    days === null ? 'text-muted-foreground'
      : days < 0 ? 'text-destructive'
      : days <= 30 ? 'text-amber-600'
      : 'text-muted-foreground';

  let context: string;
  if (fahrzeuge.length === 0) context = tx('Deine Garage ist noch leer — erfasse dein erstes Fahrzeug.');
  else if (overdue.length > 0) context = tx`Bei ${namen(overdue.map(i => vehicleName(i.rec)))} ist die Hauptuntersuchung überfällig.`;
  else if (upcoming.length > 0 && upcoming[0].days! <= SOON_DAYS) context = tx`Als Nächstes steht die HU für ${vehicleName(upcoming[0].rec)} an — ${formatDate(upcoming[0].rec.fields.naechste_hu)}.`;
  else context = tx`In deiner Garage stehen ${namen(items.map(i => vehicleName(i.rec)), 3)} — keine HU in den nächsten Wochen.`;

  const empty = fahrzeuge.length === 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">{gruss(clock)}</h1>
          <p className="text-sm text-muted-foreground mt-1">{context}</p>
        </div>
        {crud.fahrzeuge.canWrite && !empty && (
          <Button onClick={() => crud.fahrzeuge.openCreate({})}>
            <IconPlus size={16} className="shrink-0" />
            <span>{tx('Fahrzeug hinzufügen')}</span>
          </Button>
        )}
      </div>

      <DashboardGrid
        variant="split"
        hero={
          empty ? (
            crud.fahrzeuge.canWrite ? (
              <HeroBanner
                icon={<IconCar size={48} />}
                action={{ label: tx('Erstes Fahrzeug erfassen'), onClick: () => crud.fahrzeuge.openCreate({}) }}
              >
                {tx('Lege dein erstes Fahrzeug mit Hersteller, FIN und Erstzulassung an — wir erinnern dich an die nächste HU.')}
              </HeroBanner>
            ) : undefined
          ) : overdue.length > 0 ? (
            <HeroBanner
              icon={<IconAlertTriangle size={18} />}
              action={{ label: tx('Neuen HU-Termin eintragen'), onClick: () => crud.fahrzeuge.openEdit(overdue[0].rec) }}
            >
              <b>{namen(overdue.map(i => vehicleName(i.rec)))}</b>{' '}
              {tx`— HU war fällig am ${formatDate(overdue[0].rec.fields.naechste_hu)}.`}
            </HeroBanner>
          ) : undefined
        }
        kpis={
          empty ? undefined : (
            <StatCardRow>
              <StatCard
                title={tx('HU in 90 Tagen')}
                value={soon.length}
                description={soon.length > 0 ? tx('Termin vereinbaren') : tx('Nichts in Sicht')}
                icon={<IconCalendarEvent size={18} className="text-muted-foreground" />}
                tone={soon.length > 0 ? 'warning' : 'default'}
                onClick={() => setFilter(f => (f === 'soon' ? 'all' : 'soon'))}
                active={filter === 'soon'}
              />
              <StatCard
                title={tx('Ohne HU-Termin')}
                value={missing.length}
                description={missing.length > 0 ? tx('Termin nachtragen') : tx('Alles erfasst')}
                icon={<IconGauge size={18} className="text-muted-foreground" />}
                onClick={() => setFilter(f => (f === 'missing' ? 'all' : 'missing'))}
                active={filter === 'missing'}
              />
            </StatCardRow>
          )
        }
        aside={
          empty ? undefined : (
            <>
              <WorkList
                title={tx('Nächste Hauptuntersuchungen')}
                items={upcoming.map(i => ({
                  id: i.rec.record_id,
                  title: vehicleName(i.rec),
                  secondLine: (
                    <>
                      <span className={`font-medium ${huTone(i.days)}`}>{huLabel(i.days)}</span>
                      <span className="text-muted-foreground"> · {formatDate(i.rec.fields.naechste_hu)}</span>
                    </>
                  ),
                  action: crud.fahrzeuge.canWrite
                    ? { label: tx('Neuer Termin'), onClick: () => crud.fahrzeuge.openEdit(i.rec) }
                    : undefined,
                }))}
                max={5}
                onItemClick={id => {
                  const r = fahrzeuge.find(f => f.record_id === id);
                  if (r) crud.fahrzeuge.openDetail(r);
                }}
                empty={{ text: tx('Keine anstehende HU erfasst.') }}
              />
              <ChartWidget<Fahrzeuge>
                title={tx('Fahrzeuge je Fahrzeugart')}
                rows={chartRows}
                dimension={{ kind: 'category', accessor: r => r.data.fields.fahrzeugart, label: tx('Fahrzeugart') }}
              />
            </>
          )
        }
        primary={
          empty ? (
            <div />
          ) : (
            <div className="rounded-[27px] bg-card shadow-lg overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 pb-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {appLabel('fahrzeuge')} · {visible.length}
                </h2>
                <div className="relative w-full sm:w-64">
                  <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder={tx('Suchen nach Marke, Kennzeichen, FIN …')}
                    className="pl-9"
                  />
                </div>
              </div>
              {visible.length === 0 ? (
                <p className="px-5 pb-6 text-sm text-muted-foreground">{tx('Keine Fahrzeuge für diese Auswahl.')}</p>
              ) : (
                <ul className="divide-y divide-border">
                  {visible.map(({ rec, days }) => {
                    const f = rec.fields;
                    return (
                      <li key={rec.record_id}>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => crud.fahrzeuge.openDetail(rec)}
                          onKeyDown={e => { if (e.key === 'Enter') crud.fahrzeuge.openDetail(rec); }}
                          className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4 cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <IconCar size={20} />
                          </div>
                          <div className="min-w-0 flex-1 basis-48">
                            <div className="font-medium truncate">{vehicleName(rec)}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {[f.kennzeichen, f.fahrzeugart?.label, f.kraftstoff?.label].filter(Boolean).join(' · ') || '—'}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground min-w-0">
                            <div>{tx('Erstzulassung')}: {formatDate(f.erstzulassung)}</div>
                            <div>
                              {tx('Kilometerstand')}: {f.kilometerstand != null ? `${f.kilometerstand.toLocaleString()} km` : '—'}
                            </div>
                          </div>
                          <div className={`text-xs font-medium sm:w-44 sm:text-right ${huTone(days)}`}>
                            {huLabel(days)}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )
        }
      />
      {crud.surfaces}
    </div>
  );
}
