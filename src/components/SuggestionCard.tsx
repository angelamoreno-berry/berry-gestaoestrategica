import { Check, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SuggestionCardProps {
  suggestion: string | string[];
  onAccept: () => void;
  onDismiss?: () => void;
  label?: string;
  accepted?: boolean;
}

export function SuggestionCard({ 
  suggestion, 
  onAccept, 
  onDismiss,
  label = 'Sugestão',
  accepted = false 
}: SuggestionCardProps) {
  if (accepted) {
    return null;
  }

  const isArray = Array.isArray(suggestion);
  
  return (
    <Card className="border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-right-2 duration-300">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-primary mb-2">{label}</p>
            {isArray ? (
              <ul className="text-sm text-muted-foreground space-y-1">
                {(suggestion as string[]).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary/60">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {suggestion as string}
              </p>
            )}
            <div className="flex gap-2 mt-3">
              <Button 
                size="sm" 
                variant="default"
                onClick={onAccept}
                className="h-8 text-xs"
              >
                <Check className="w-3 h-3 mr-1" />
                Usar sugestão
              </Button>
              {onDismiss && (
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={onDismiss}
                  className="h-8 text-xs text-muted-foreground"
                >
                  <X className="w-3 h-3 mr-1" />
                  Ignorar
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
