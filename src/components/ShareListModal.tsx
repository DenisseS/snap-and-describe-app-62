import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Share2, Plus, Trash2, Copy, Users, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { QueueClient } from '@/services/sw/QueueClient';
import { ShoppingList } from '@/types/shoppingList';

interface ShareListModalProps {
  isOpen: boolean;
  onClose: () => void;
  list: ShoppingList;
  folderPath: string;
}

const ShareListModal: React.FC<ShareListModalProps> = ({
  isOpen,
  onClose,
  list,
  folderPath
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [newEmail, setNewEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [removingEmail, setRemovingEmail] = useState<string | null>(null);

  const sharedWith = list.sharedWith || [];
  const isShared = sharedWith.length > 0;

  const generateShareUrl = (listId: string, folderPath: string) => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      listId,
      path: `${folderPath}/shopping-list.json`,
      owner: 'current-user' // This would be replaced with actual user email
    });
    return `${baseUrl}/share/accept?${params.toString()}`;
  };

  const handleCopyShareUrl = async () => {
    try {
      const shareUrl = generateShareUrl(list.id, folderPath);
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: t('linkCopied', 'Enlace copiado'),
        description: t('shareUrlCopied', 'El enlace para compartir ha sido copiado al portapapeles'),
      });
    } catch (error) {
      console.error('Error copying share URL:', error);
      toast({
        title: t('error', 'Error'),
        description: t('failedToCopyLink', 'No se pudo copiar el enlace'),
        variant: 'destructive'
      });
    }
  };

  const handleInviteUser = async () => {
    if (!newEmail.trim()) return;
    
    console.log('🔗 ShareListModal: Inviting user:', newEmail, 'to folder:', folderPath);
    setIsInviting(true);
    
    try {
      // First share the folder if not already shared
      if (!isShared) {
        QueueClient.getInstance().enqueue('dropbox-sharing', list.id, {
          type: 'share_folder',
          folderPath
        });
      }
      
      // Then add the member
      QueueClient.getInstance().enqueue('dropbox-sharing', list.id, {
        type: 'invite',
        folderPath,
        email: newEmail.trim()
      });

      setNewEmail('');
      toast({
        title: t('invitationSent', 'Invitación enviada'),
        description: t('userInvited', 'El usuario ha sido invitado a la lista'),
      });
    } catch (error) {
      console.error('🔗 ShareListModal: Error inviting user:', error);
      toast({
        title: t('error', 'Error'),
        description: t('failedToInvite', 'No se pudo enviar la invitación'),
        variant: 'destructive'
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveUser = async (email: string) => {
    console.log('🔗 ShareListModal: Removing user:', email, 'from folder:', folderPath);
    setRemovingEmail(email);
    
    try {
      QueueClient.getInstance().enqueue('dropbox-sharing', list.id, {
        type: 'remove',
        folderPath,
        email
      });

      toast({
        title: t('userRemoved', 'Usuario eliminado'),
        description: t('userRemovedFromList', 'El usuario ha sido eliminado de la lista'),
      });
    } catch (error) {
      console.error('🔗 ShareListModal: Error removing user:', error);
      toast({
        title: t('error', 'Error'),
        description: t('failedToRemoveUser', 'No se pudo eliminar el usuario'),
        variant: 'destructive'
      });
    } finally {
      setRemovingEmail(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            {t('shareList', 'Compartir Lista')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Share URL Section */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              {t('shareLink', 'Enlace para compartir')}
            </label>
            <div className="flex gap-2">
              <Input
                value={generateShareUrl(list.id, folderPath)}
                readOnly
                className="text-xs"
              />
              <Button onClick={handleCopyShareUrl} size="sm" variant="outline">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t('shareUrlDescription', 'Comparte este enlace para que otros puedan acceder a la lista')}
            </p>
          </div>

          <Separator />

          {/* Invite Section */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              {t('inviteByEmail', 'Invitar por email')}
            </label>
            <div className="flex gap-2">
              <Input
                placeholder={t('enterEmail', 'Ingresa el email')}
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleInviteUser()}
                disabled={isInviting}
              />
              <Button 
                onClick={handleInviteUser}
                disabled={!newEmail.trim() || isInviting}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                {isInviting ? t('inviting', 'Invitando...') : t('invite', 'Invitar')}
              </Button>
            </div>
          </div>

          {/* Shared With Section */}
          {sharedWith.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t('sharedWith', 'Compartido con')} ({sharedWith.length})
              </label>
              <div className="space-y-2">
                {sharedWith.map((email) => (
                  <div key={email} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <Badge variant="secondary" className="flex-1">
                      {email}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveUser(email)}
                      disabled={removingEmail === email}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {removingEmail === email ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              {t('close', 'Cerrar')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareListModal;