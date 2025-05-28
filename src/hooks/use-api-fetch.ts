
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ApiResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}

interface ApiFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: object;
  headers?: Record<string, string>;
  skipAuth?: boolean;
}

export const useApiFetch = () => {
  const { session } = useAuth();

  const fetchWithAuth = async <T>(
    url: string, 
    options: ApiFetchOptions = {}
  ): Promise<ApiResponse<T>> => {
    const { method = 'GET', body, headers = {}, skipAuth = false } = options;

    try {
      // Add auth headers if user is authenticated and not skipping auth
      if (!skipAuth && session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      // Set content type for POST/PUT requests
      if (body && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data, success: true };
    } catch (error) {
      console.error('API fetch error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast.error(`API Error: ${errorMessage}`);
      
      return { 
        data: null as T, 
        error: errorMessage, 
        success: false 
      };
    }
  };

  return { fetchWithAuth };
};

export const useApiQuery = <T>(
  queryKey: (string | number | object)[],
  url: string,
  options: ApiFetchOptions = {},
  queryOptions: object = {}
) => {
  const { fetchWithAuth } = useApiFetch();

  return useQuery({
    queryKey,
    queryFn: () => fetchWithAuth<T>(url, options),
    ...queryOptions,
  });
};

export const useApiMutation = <T, TVariables = void>(
  url: string,
  options: ApiFetchOptions = {}
) => {
  const { fetchWithAuth } = useApiFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: TVariables) => {
      const requestOptions = { 
        ...options, 
        body: variables as object 
      };
      return fetchWithAuth<T>(url, requestOptions);
    },
    onSuccess: () => {
      // Invalidate relevant queries on successful mutations
      queryClient.invalidateQueries();
    },
  });
};
