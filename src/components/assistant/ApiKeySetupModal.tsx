
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ApiKeySetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ApiKeySetupModal: React.FC<ApiKeySetupModalProps> = ({ 
  open, 
  onOpenChange,
  onSuccess
}) => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('set-openai-key', {
        body: { apiKey: apiKey.trim() }
      });
      
      if (error) throw error;
      
      toast({
        title: "API Key saved",
        description: "Your OpenAI API key has been securely stored.",
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: "Error saving API key",
        description: "There was a problem saving your API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set up OpenAI API Key</DialogTitle>
          <DialogDescription>
            To use Roamie Assistant, you need to provide your OpenAI API key. 
            Your key will be stored securely and used only for the assistant's functionality.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="openai-key" className="text-right col-span-1">
                API Key
              </Label>
              <Input
                id="openai-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="col-span-3"
                autoComplete="off"
              />
            </div>
            <div className="col-span-4 text-xs text-slate-500 mt-2">
              Need an API key? Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-greentrail-600 underline">OpenAI's website</a> to create one.
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={!apiKey.trim() || loading}
              className="bg-greentrail-600 hover:bg-greentrail-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save API Key'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeySetupModal;
