import { ChevronRight, FileText, Receipt } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from './Modal';

interface PDFGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (type: 'quote' | 'receipt') => void;
}

const DOCUMENT_OPTIONS = [
  {
    type: 'quote' as const,
    title: 'Orçamento Comercial',
    description: 'Proposta detalhada com valores e prazos',
    icon: FileText,
    iconColor: 'text-emerald-600',
  },
  {
    type: 'receipt' as const,
    title: 'Recibo de Pagamento',
    description: 'Comprovante oficial com validade',
    icon: Receipt,
    iconColor: 'text-blue-600',
  },
];

export function PDFGenerationModal({
  isOpen,
  onClose,
  onGenerate,
}: PDFGenerationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Exportar Documento">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-slate-500">
          Selecione o formato para gerar o PDF:
        </p>

        <div className="flex flex-col gap-3">
          {DOCUMENT_OPTIONS.map(
            ({ type, title, description, icon: Icon, iconColor }) => (
              <button
                key={type}
                onClick={() => onGenerate(type)}
                className="group flex w-full items-center gap-4 rounded-lg border border-slate-200 p-4 transition-colors hover:border-teal-300 hover:bg-teal-50"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconColor}`}
                >
                  <Icon size={30} />
                </div>

                <div className="flex-1 text-left">
                  <span className="block text-sm font-medium text-teal-900">
                    {title}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {description}
                  </span>
                </div>

                <ChevronRight
                  size={18}
                  className="text-slate-300 group-hover:text-teal-500"
                />
              </button>
            ),
          )}
        </div>

        <div className="mt-4 flex justify-end pt-2">
          <Button variant="secondary" onClick={onClose} className="text-sm">
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
