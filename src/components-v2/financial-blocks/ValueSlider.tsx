import { useState, useRef, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { HelpCircle, Pencil } from 'lucide-react';

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
  const [editing, setEditing] = useState(false);
  const [rawInput, setRawInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isCurrency = formatValue ? formatValue(1000).includes('R$') || formatValue(1000).includes('$') : false;

  const range = max - min;
  const normalizedPosition = range > 0 ? ((value - min) / range) * 100 : 0;

  const getTrackColor = () => {
    if (naoSabe) return 'bg-muted';
    const pos = invertColors ? 100 - normalizedPosition : normalizedPosition;
    if (pos <= 25) return 'bg-destructive/70';
    if (pos <= 50) return 'bg-orange-500/70';
    if (pos <= 75) return 'bg-yellow-500/70';
    return 'bg-green-500/70';
  };

  const formatInputNumber = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    if (!digits) return '';
    return Number(digits).toLocaleString('pt-BR');
  };

  const handleStartEdit = () => {
    if (naoSabe) return;
    setRawInput(value > 0 ? value.toLocaleString('pt-BR') : '');
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatInputNumber(e.target.value);
    setRawInput(formatted);
  };

  const handleInputConfirm = () => {
    const digits = rawInput.replace(/\D/g, '');
    let num = digits ? Number(digits) : 0;
    if (num > max) num = max;
    if (num < min) num = min;
    onChange(num);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleInputConfirm();
    if (e.key === 'Escape') setEditing(false);
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
        {editing ? (
          <div className="flex items-center gap-1 ml-3 shrink-0">
            <span className="text-xs text-muted-foreground">R$</span>
            <Input
              ref={inputRef}
              value={rawInput}
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              onKeyDown={handleKeyDown}
              className="w-32 h-7 text-sm font-bold text-right px-2"
              placeholder="0"
            />
          </div>
        ) : (
          <button
            onClick={handleStartEdit}
            className={`text-sm font-bold ml-3 shrink-0 flex items-center gap-1 hover:opacity-70 transition-opacity ${naoSabe ? 'text-muted-foreground italic text-xs cursor-default' : 'text-primary cursor-pointer'}`}
            disabled={naoSabe}
          >
            {displayValue}
            {!naoSabe && isCurrency && <Pencil className="w-3 h-3 opacity-40" />}
          </button>
        )}
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
