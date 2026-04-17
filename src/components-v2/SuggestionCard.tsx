import { useState } from 'react';
import { Check, Sparkles, X, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface SuggestionCardProps {
  suggestion: string | string[];
  onAccept: (value: string | string[]) => void;
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState<string | string[]>(suggestion);

  if (accepted) {
    return null;
  }

  const isArray = Array.isArray(suggestion);

  const handleAccept = () => {
    onAccept(editedValue);
  };

  const handleEditItem = (index: number, value: string) => {
    if (Array.isArray(editedValue)) {
      const newValue = [...editedValue];
      newValue[index] = value;
      setEditedValue(newValue);
    }
  };

  const handleRemoveItem = (index: number) => {
    if (Array.isArray(editedValue)) {
      setEditedValue(editedValue.filter((_, i) => i !== index));
    }
  };
  
  return (
    <Card className="border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-right-2 duration-300">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-primary mb-2">{label}</p>
            
            {isEditing ? (
              <div className="space-y-2">
                {isArray ? (
                  <div className="space-y-2">
                    {(editedValue as string[]).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Input
                          value={item}
                          onChange={(e) => handleEditItem(idx, e.target.value)}
                          className="text-sm h-8"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveItem(idx)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Textarea
                    value={editedValue as string}
                    onChange={(e) => setEditedValue(e.target.value)}
                    className="text-sm resize-none"
                    rows={4}
                  />
                )}
              </div>
            ) : (
              <>
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
              </>
            )}
            
            <div className="flex gap-2 mt-3">
              {isEditing ? (
                <>
                  <Button 
                    size="sm" 
                    variant="default"
                    onClick={handleAccept}
                    className="h-8 text-xs"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Confirmar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedValue(suggestion);
                    }}
                    className="h-8 text-xs text-muted-foreground"
                  >
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    size="sm" 
                    variant="default"
                    onClick={handleAccept}
                    className="h-8 text-xs"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Usar sugestão
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="h-8 text-xs"
                  >
                    <Pencil className="w-3 h-3 mr-1" />
                    Editar
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
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
