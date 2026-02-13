import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { HelpCircle } from 'lucide-react';

interface ValueSliderProps {
  label: string;
  description?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  leftLabel: string;
  rightLabel: string;
  invertColors?: boolean;
  formatValue?: (v: number) => string;
  naoSabe?: boolean;
  onNaoSabeChange?: (v: boolean) => void;
}

export function ValueSlider({
  label,
  description,
  value,
  onChange,
  min,
  max,
  step = 1,
  leftLabel,
  rightLabel,
  invertColors = false,
  formatValue,
  naoSabe = false,
  onNaoSabeChange,
}: ValueSliderProps) {
  const range = max - min;
  const normalizedPosition = range > 0 ? ((value - min) / range) * 100 : 0;

  // Color logic: green = good, red = bad
  const getTrackColor = () => {
    if (naoSabe) return 'bg-muted';
    const pos = invertColors ? 100 - normalizedPosition : normalizedPosition;
    if (pos <= 25) return 'bg-destructive/70';
    if (pos <= 50) return 'bg-orange-500/70';
    if (pos <= 75) return 'bg-yellow-500/70';
    return 'bg-green-500/70';
  };

  const displayValue = naoSabe
    ? 'Não sei informar'
    : formatValue
      ? formatValue(value)
      : String(value);

  return (
    <div className={`p-4 rounded-xl border transition-all ${naoSabe ? 'bg-muted/30 border-border/50 opacity-60' : 'bg-card border-border hover:border-primary/30'}`}>
      <div className="flex items-start justify-between mb-1">
        <div className="flex-1">
          <p className="text-sm font-medium">{label}</p>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
        <span className={`text-sm font-bold ml-3 shrink-0 ${naoSabe ? 'text-muted-foreground italic text-xs' : 'text-primary'}`}>
          {displayValue}
        </span>
      </div>

      <div className="mt-3">
        <Slider
          min={min}
          max={max}
          step={step}
          value={[naoSabe ? min : value]}
          onValueChange={([v]) => {
            if (!naoSabe) onChange(v);
          }}
          disabled={naoSabe}
          className={`w-full ${naoSabe ? 'opacity-40' : ''}`}
        />

        <div className="flex justify-between mt-1.5">
          <span className={`text-[10px] ${invertColors ? 'text-green-600' : 'text-destructive/70'} font-medium`}>
            {leftLabel}
          </span>
          <span className={`text-[10px] ${invertColors ? 'text-destructive/70' : 'text-green-600'} font-medium`}>
            {rightLabel}
          </span>
        </div>
      </div>

      {onNaoSabeChange && (
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/50">
          <Checkbox
            id={`nao-sabe-${label}`}
            checked={naoSabe}
            onCheckedChange={(checked) => onNaoSabeChange(checked === true)}
          />
          <label htmlFor={`nao-sabe-${label}`} className="text-xs text-muted-foreground cursor-pointer flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            Não sei informar
          </label>
        </div>
      )}
    </div>
  );
}
