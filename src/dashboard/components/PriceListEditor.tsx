import { Plus, Trash2 } from 'lucide-react';

export interface PriceRow {
  label: string;
  price: number;
}

interface PriceListEditorProps {
  label: string;
  rows: PriceRow[];
  onChange: (rows: PriceRow[]) => void;
  labelPlaceholder: string;
}

/** Éditeur de lignes libellé + prix, utilisé pour les formats et les suppléments. */
export function PriceListEditor({ label, rows, onChange, labelPlaceholder }: PriceListEditorProps) {
  const update = (index: number, patch: Partial<PriceRow>) => {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  return (
    <div>
      <p className="db-label">{label}</p>
      <div className="space-y-2">
        {rows.map((row, index) => (
          <div key={index} className="flex gap-2">
            <input
              className="db-field flex-1"
              placeholder={labelPlaceholder}
              value={row.label}
              onChange={(e) => update(index, { label: e.target.value })}
            />
            <input
              className="db-field w-24"
              type="number"
              step="0.01"
              min={0}
              placeholder="Prix"
              value={Number.isFinite(row.price) ? row.price : ''}
              onChange={(e) => update(index, { price: Number(e.target.value) })}
            />
            <button
              type="button"
              onClick={() => onChange(rows.filter((_, i) => i !== index))}
              className="db-btn db-btn-ghost !px-2"
              aria-label="Retirer cette ligne"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...rows, { label: '', price: 0 }])}
        className="db-btn db-btn-ghost mt-2 !px-2 !py-1 text-xs"
      >
        <Plus size={13} /> Ajouter une ligne
      </button>
    </div>
  );
}
