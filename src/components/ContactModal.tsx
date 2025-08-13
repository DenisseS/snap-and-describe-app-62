import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import BaseEditModal from './BaseEditModal';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSave = async () => {
    // URLs de Google Forms según el idioma
    const formUrls = {
      es: 'https://docs.google.com/forms/d/e/1FAIpQLScRZQPSaRiaNxnkljmPcZz_jpY-D18S-uPCFi_u6C4Tv6nwLQ/formResponse',
      en: 'https://docs.google.com/forms/d/e/1FAIpQLSdu-CassiT2wn_hlhpGa2wbybKuwve6ICwiwanOptSdfj2Rag/formResponse'
    };

    // Field IDs específicos extraídos del proceso manual (subfields)
    const fieldIds = {
      name: 'entry.624388280',
      email: 'entry.50122201', 
      reason: 'entry.1209205960' // Este campo será para el asunto y mensaje combinados
    };

    const currentLang = i18n.language.startsWith('en') ? 'en' : 'es';
    const formUrl = formUrls[currentLang];

    // Crear FormData para enviar a Google Forms
    const googleFormData = new FormData();
    googleFormData.append(fieldIds.name, formData.name);
    googleFormData.append(fieldIds.email, formData.email);
    googleFormData.append(fieldIds.reason, `${formData.subject}\n\n${formData.message}`);

    try {
      // Enviar a Google Forms (modo no-cors para evitar CORS)
      await fetch(formUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: googleFormData
      });

      // Mostrar mensaje de éxito y limpiar formulario
      toast({
        title: t('messageSent'),
        description: t('messageSentDescription')
      });
      
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending form:', error);
      toast({
        title: t('errorSendingMessage'),
        variant: "destructive"
      });
      throw error; // Para que BaseEditModal maneje el error
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const texts = {
    title: t('contactUs'),
    description: t('getInTouchText'),
    cancel: t('cancel'),
    save: t('sendMessage'),
    saving: t('sending')
  };

  const canSave = !!(formData.name.trim() && formData.email.trim() && formData.subject.trim() && formData.message.trim());

  return (
    <BaseEditModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      texts={texts}
      canSave={canSave}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">{t('name')}</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="email">{t('email')}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="subject">{t('subject')}</Label>
          <Input
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="message">{t('message')}</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="mt-1"
          />
        </div>
      </div>
    </BaseEditModal>
  );
};

export default ContactModal;