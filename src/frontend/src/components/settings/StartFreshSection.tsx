import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useStartFresh } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Start Fresh section with confirmation dialog that clears all user data
 * and properly resets cached queries following authorization component guidance.
 */
export default function StartFreshSection() {
  const startFresh = useStartFresh();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleStartFresh = async () => {
    setShowSuccess(false);
    try {
      await startFresh.mutateAsync();
      setIsOpen(false);
      setShowSuccess(true);
      toast.success('All data cleared successfully');
      
      // Clear all cached data as per authorization component guidance
      queryClient.clear();
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('Start fresh failed:', error);
      toast.error(error.message || 'Failed to clear data');
    }
  };

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2">
          <Trash2 className="h-5 w-5" />
          Danger Zone
        </CardTitle>
        <CardDescription>
          Permanently delete all your data and start fresh. This action cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showSuccess && (
          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-500">
              All data cleared successfully. Reloading...
            </AlertDescription>
          </Alert>
        )}
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={startFresh.isPending}>
              <Trash2 className="mr-2 h-4 w-4" />
              Start Fresh
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>This action will permanently delete:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>All your trades and journal entries</li>
                  <li>Your settings and preferences</li>
                  <li>Your user profile</li>
                </ul>
                <p className="font-semibold text-destructive mt-3">
                  This action cannot be undone.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={startFresh.isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleStartFresh}
                disabled={startFresh.isPending}
                className="bg-destructive hover:bg-destructive/90"
              >
                {startFresh.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Clearing...
                  </>
                ) : (
                  'Yes, delete everything'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
