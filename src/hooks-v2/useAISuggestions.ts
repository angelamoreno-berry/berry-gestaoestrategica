import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types-v2/consulting';

interface AISuggestionsState {
  data: Record<string, unknown> | null;
  isLoading: boolean;
  error: string | null;
}

interface CacheEntry {
  data: Record<string, unknown>;
  timestamp: number;
  projectId: string;
  segmento: string;
}

const CACHE_TTL = 1000 * 60 * 30; // 30 minutes
const suggestionCache = new Map<string, CacheEntry>();

export function useAISuggestions(blockId: string, project: Project | null) {
  const [state, setState] = useState<AISuggestionsState>({
    data: null,
    isLoading: false,
    error: null
  });
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasLoadedRef = useRef<string | null>(null);

  const getCacheKey = useCallback((block: string, proj: Project) => {
    return `${block}-${proj.id}-${proj.segmento}`;
  }, []);

  const getFromCache = useCallback((block: string, proj: Project): Record<string, unknown> | null => {
    const key = getCacheKey(block, proj);
    const entry = suggestionCache.get(key);
    
    if (!entry) return null;
    
    const isExpired = Date.now() - entry.timestamp > CACHE_TTL;
    const isDifferentProject = entry.projectId !== proj.id;
    const isDifferentSegmento = entry.segmento !== proj.segmento;
    
    if (isExpired || isDifferentProject || isDifferentSegmento) {
      suggestionCache.delete(key);
      return null;
    }
    
    return entry.data;
  }, [getCacheKey]);

  const setToCache = useCallback((block: string, proj: Project, data: Record<string, unknown>) => {
    const key = getCacheKey(block, proj);
    suggestionCache.set(key, {
      data,
      timestamp: Date.now(),
      projectId: proj.id,
      segmento: proj.segmento
    });
  }, [getCacheKey]);

  const generateSuggestions = useCallback(async (forceRefresh = false) => {
    if (!project || !project.segmento) {
      setState({ data: null, isLoading: false, error: null });
      return;
    }

    const loadKey = `${blockId}-${project.id}-${project.segmento}`;
    
    // Prevent duplicate loads
    if (!forceRefresh && hasLoadedRef.current === loadKey) {
      return;
    }

    // Check cache first
    if (!forceRefresh) {
      const cached = getFromCache(blockId, project);
      if (cached) {
        setState({ data: cached, isLoading: false, error: null });
        hasLoadedRef.current = loadKey;
        return;
      }
    }

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { data, error } = await supabase.functions.invoke('generate-consulting-content', {
        body: {
          blockId,
          project: {
            segmento: project.segmento,
            nomeEmpresa: project.nomeEmpresa,
            faturamentoMedio: project.faturamentoMedio,
            quantidadeColaboradores: project.quantidadeColaboradores
          }
        }
      });

      if (error) {
        throw new Error(error.message || 'Erro ao gerar sugestões');
      }

      if (data?.success && data?.data) {
        setToCache(blockId, project, data.data);
        setState({ data: data.data, isLoading: false, error: null });
        hasLoadedRef.current = loadKey;
      } else {
        throw new Error(data?.error || 'Resposta inválida da IA');
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar sugestões';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
    }
  }, [blockId, project, getFromCache, setToCache]);

  // Auto-generate when project changes
  useEffect(() => {
    if (project?.segmento) {
      const loadKey = `${blockId}-${project.id}-${project.segmento}`;
      if (hasLoadedRef.current !== loadKey) {
        generateSuggestions();
      }
    }
  }, [project?.id, project?.segmento, blockId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const refresh = useCallback(() => {
    hasLoadedRef.current = null;
    generateSuggestions(true);
  }, [generateSuggestions]);

  return {
    suggestions: state.data,
    isLoading: state.isLoading,
    error: state.error,
    refresh,
    generate: generateSuggestions
  };
}

// Clear all cache (useful when switching projects)
export function clearSuggestionsCache() {
  suggestionCache.clear();
}

// Clear cache for a specific project
export function clearProjectCache(projectId: string) {
  for (const [key, entry] of suggestionCache.entries()) {
    if (entry.projectId === projectId) {
      suggestionCache.delete(key);
    }
  }
}
