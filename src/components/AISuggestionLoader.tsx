import { Sparkles, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SuggestionCard } from './SuggestionCard';

interface AISuggestionLoaderProps {
  isLoading: boolean;
  error: string | null;
  suggestion: string | string[] | undefined;
  fieldKey: string;
  label: string;
  onAccept: (value: string | string[]) => void;
  onDismiss?: () => void;
  onRetry?: () => void;
  showWhenHasValue?: boolean;
  currentValue?: string | string[];
}

export function AISuggestionLoader({
  isLoading,
  error,
  suggestion,
  fieldKey,
  label,
  onAccept,
  onDismiss,
  onRetry,
  showWhenHasValue = false,
  currentValue
}: AISuggestionLoaderProps) {
  // Don't show if there's already a value (unless explicitly requested)
  const hasValue = Array.isArray(currentValue) 
    ? currentValue.length > 0 
    : !!currentValue?.trim();
  
  if (hasValue && !showWhenHasValue) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-primary font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Gerando sugestão personalizada...
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Analisando o segmento da empresa para criar conteúdo relevante
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-destructive" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-destructive font-medium">
                Não foi possível gerar a sugestão
              </p>
              <p className="text-xs text-muted-foreground mt-1">{error}</p>
            </div>
            {onRetry && (
              <Button size="sm" variant="outline" onClick={onRetry} className="h-8 gap-1">
                <RefreshCw className="w-3 h-3" />
                Tentar novamente
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!suggestion) {
    return null;
  }

  return (
    <SuggestionCard
      suggestion={suggestion}
      label={`${label} (IA)`}
      onAccept={onAccept}
      onDismiss={onDismiss}
    />
  );
}
