import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Client, Service } from '../types';
import { formatCurrency, formatDate } from './formatters';

type JsPDFWithAutoTable = jsPDF & {
  lastAutoTable: { finalY: number };
};

const COMPANY_INFO = {
  phone: '(34) 99765-9558',
  address: 'Patos de Minas - MG',
};

const COLORS = {
  primary: '#0d9488',
  secondary: '#334155',
  text: '#64748b',
  light: '#f8fafc',
  white: '#ffffff',
  border: '#e2e8f0',
  borderDark: '#cbd5e1',
};

export const generateDocument = (
  type: 'quote' | 'receipt',
  service: Service,
  client: Client | null,
  user: { name: string; email: string },
) => {
  const doc = new jsPDF() as JsPDFWithAutoTable;
  const isQuote = type === 'quote';
  const currentDate = new Date();

  doc.setFillColor(COLORS.primary);
  doc.rect(0, 0, 210, 45, 'F');

  doc.setTextColor(COLORS.white);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(user.name.toUpperCase(), 15, 20);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${COMPANY_INFO.phone} | ${COMPANY_INFO.address}`, 15, 33);
  doc.text(user.email, 15, 38);

  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(isQuote ? 'ORÇAMENTO' : 'RECIBO', 195, 25, {
    align: 'right',
  });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nº: ${service.id.slice(0, 8).toUpperCase()}`, 195, 32, {
    align: 'right',
  });
  doc.text(`Emitido em: ${currentDate.toLocaleDateString('pt-BR')}`, 195, 37, {
    align: 'right',
  });

  let currentY = 60;

  doc.setTextColor(COLORS.primary);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO CLIENTE', 15, currentY);

  doc.setDrawColor(COLORS.border);
  doc.setLineWidth(0.5);
  doc.line(15, currentY + 2, 195, currentY + 2);

  currentY += 10;

  doc.setTextColor(COLORS.secondary);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');

  doc.text('Nome:', 15, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(client?.name || 'Cliente não identificado', 35, currentY);

  doc.setFont('helvetica', 'bold');
  doc.text('Telefone:', 120, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(client?.phone_number || 'Não informado', 140, currentY);

  currentY += 6;

  doc.setFont('helvetica', 'bold');
  doc.text('Endereço:', 15, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(client?.address || 'Não informado', 35, currentY);

  currentY += 15;

  doc.setTextColor(COLORS.primary);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DETALHES DO SERVIÇO', 15, currentY);
  doc.line(15, currentY + 2, 195, currentY + 2);

  currentY += 10;

  autoTable(doc, {
    startY: currentY,
    head: [['Descrição', 'Qtd', 'Preço Unit.', 'Total']],
    body: [
      [
        `Reforma / Estofamento: ${service.furniture_name}`,
        '1',
        formatCurrency(service.final_price),
        formatCurrency(service.final_price),
      ],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontStyle: 'bold',
    },
    styles: { fontSize: 10, cellPadding: 4, textColor: COLORS.secondary },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' },
    },
    foot: [['Total', '', '', formatCurrency(service.final_price)]],
    footStyles: {
      fillColor: COLORS.light,
      textColor: COLORS.secondary,
      fontStyle: 'bold',
      halign: 'right',
    },
  });

  currentY = doc.lastAutoTable.finalY + 15;

  doc.setTextColor(COLORS.primary);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMAÇÕES ADICIONAIS', 15, currentY);
  doc.line(15, currentY + 2, 195, currentY + 2);

  currentY += 10;

  doc.setTextColor(COLORS.secondary);
  doc.setFontSize(10);

  doc.setFont('helvetica', 'bold');
  doc.text('Tecido:', 15, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `${service.fabric_name} (Ref: ${service.fabric_code || 'S/ Cód'})`,
    45,
    currentY,
  );

  currentY += 6;

  doc.setFont('helvetica', 'bold');
  doc.text('Previsão:', 15, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(
    service.delivery_date ? formatDate(service.delivery_date) : 'A combinar',
    45,
    currentY,
  );

  if (isQuote) {
    doc.setFont('helvetica', 'bold');
    doc.text('Validade:', 120, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text('15 dias a partir da emissão', 140, currentY);
  }

  if (service.notes) {
    currentY += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Observações:', 15, currentY);

    doc.setFont('helvetica', 'italic');
    const splitNotes = doc.splitTextToSize(service.notes, 180);
    doc.text(splitNotes, 15, currentY + 5);
  }

  const pageHeight = doc.internal.pageSize.height;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(COLORS.secondary);

  const legalTextY = pageHeight - 55;
  if (isQuote) {
    doc.text(
      'A execução do serviço será iniciada mediante aprovação deste orçamento e pagamento do sinal (quando aplicável).',
      105,
      legalTextY,
      { align: 'center' },
    );
  } else {
    doc.text(
      `Recebemos de ${client?.name || 'Cliente'} a quantia supra de ${formatCurrency(service.final_price)} referente à quitação do serviço prestado por ${user.name}.`,
      105,
      legalTextY,
      { align: 'center' },
    );
  }

  const footerY = pageHeight - 30;

  doc.setDrawColor(COLORS.borderDark);
  doc.line(20, footerY, 90, footerY);
  doc.line(120, footerY, 190, footerY);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.secondary);

  doc.text('De Acordo (Cliente)', 55, footerY + 5, { align: 'center' });
  doc.text(user.name, 155, footerY + 5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(COLORS.text);
  doc.text(
    'Garantia de 90 dias para defeitos de fabricação/mão de obra (Art. 26, II, CDC). Não cobre mau uso ou desgastes naturais do tecido.',
    105,
    pageHeight - 12,
    { align: 'center' },
  );

  const dateStr = currentDate.toISOString().split('T')[0];
  const fileName = `${type === 'quote' ? 'orcamento' : 'recibo'}_${service.id.slice(0, 6)}_${dateStr}.pdf`;
  doc.save(fileName);
};
