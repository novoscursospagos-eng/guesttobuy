// Export utilities for CRM data
import * as XLSX from 'xlsx';

export interface ExportableItem {
  id: string;
  [key: string]: any;
}

export type ExportFormat = 'xlsx' | 'csv';

// Generic export function
export const exportData = (
  data: ExportableItem[],
  filename: string,
  format: ExportFormat = 'xlsx'
) => {
  if (data.length === 0) {
    throw new Error('Nenhum dado para exportar');
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  
  if (format === 'csv') {
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    downloadFile(csv, `${filename}.csv`, 'text/csv');
  } else {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }
};

// Download file helper
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Format funnel data for export
export const formatFunnelsForExport = (funnels: any[], leads: any[]) => {
  return funnels.map(funnel => {
    const funnelLeads = leads.filter(lead => lead.funnelId === funnel.id);
    const wonLeads = funnelLeads.filter(lead => lead.status === 'won');
    const conversionRate = funnelLeads.length > 0 
      ? Math.round((wonLeads.length / funnelLeads.length) * 100) 
      : 0;
    const wonRevenue = wonLeads.reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0);

    return {
      'ID': funnel.id,
      'Nome': funnel.name,
      'Descrição': funnel.description || '',
      'Número de Etapas': funnel.stages?.length || 0,
      'Total de Leads': funnelLeads.length,
      'Leads Ganhos': wonLeads.length,
      'Taxa de Conversão (%)': conversionRate,
      'Receita Ganha (R$)': wonRevenue,
      'Data de Criação': funnel.createdAt ? new Date(funnel.createdAt).toLocaleDateString('pt-BR') : '',
    };
  });
};

// Format leads data for export
export const formatLeadsForExport = (leads: any[], funnels: any[], contacts: any[]) => {
  return leads.map(lead => {
    const funnel = funnels.find(f => f.id === lead.funnelId);
    const stage = funnel?.stages?.find((s: any) => s.id === lead.stageId);
    const contact = contacts.find(c => c.id === lead.contactId);

    return {
      'ID': lead.id,
      'Título': lead.title,
      'Tipo': lead.type,
      'Categoria': lead.category || '',
      'Valor Estimado (R$)': lead.estimatedValue || 0,
      'Status': lead.status === 'won' ? 'Ganho' : lead.status === 'analyzing' ? 'Em Análise' : lead.status === 'lost' ? 'Perdido' : 'Ativo',
      'Funil': funnel?.name || '',
      'Etapa': stage?.name || '',
      'Contato': contact?.name || '',
      'Email do Contato': contact?.email || '',
      'Origem': lead.source || '',
      'Prioridade': lead.priority || 'medium',
      'Observações': lead.notes || '',
      'Data de Criação': lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('pt-BR') : '',
      'Motivo da Perda': lead.lossReason || '',
    };
  });
};

// Format contacts data for export
export const formatContactsForExport = (contacts: any[]) => {
  return contacts.map(contact => ({
    'ID': contact.id,
    'Nome': contact.name,
    'Email': contact.email,
    'Telefone': contact.phone || '',
    'Tipo': contact.type === 'person' ? 'Pessoa Física' : 'Pessoa Jurídica',
    'Empresa': contact.company || '',
    'Cargo': contact.position || '',
    'Endereço': contact.address || '',
    'Bairro': contact.neighborhood || '',
    'Cidade': contact.city || '',
    'Estado': contact.state || '',
    'CEP': contact.zipCode || '',
    'Origem': contact.source || '',
    'Observações': contact.notes || '',
    'Data de Criação': contact.createdAt ? new Date(contact.createdAt).toLocaleDateString('pt-BR') : '',
  }));
};

// Format organizations data for export
export const formatOrganizationsForExport = (organizations: any[]) => {
  return organizations.map(org => ({
    'ID': org.id,
    'Razão Social': org.name,
    'Nome Fantasia': org.tradeName || '',
    'CNPJ': org.cnpj || '',
    'Email': org.email,
    'Telefone': org.phone || '',
    'Website': org.website || '',
    'Setor': org.industry || '',
    'Porte': org.size || '',
    'Endereço': org.address || '',
    'Bairro': org.neighborhood || '',
    'Cidade': org.city || '',
    'Estado': org.state || '',
    'CEP': org.zipCode || '',
    'Origem': org.source || '',
    'Observações': org.notes || '',
    'Data de Criação': org.createdAt ? new Date(org.createdAt).toLocaleDateString('pt-BR') : '',
  }));
};

// Format activities data for export
export const formatActivitiesForExport = (activities: any[], leads: any[], contacts: any[]) => {
  return activities.map(activity => {
    const lead = leads.find(l => l.id === activity.leadId);
    const contact = contacts.find(c => c.id === activity.contactId);

    return {
      'ID': activity.id,
      'Título': activity.title,
      'Tipo': activity.type,
      'Descrição': activity.description || '',
      'Status': activity.status === 'completed' ? 'Concluída' : 'Pendente',
      'Prioridade': activity.priority || 'medium',
      'Lead Relacionado': lead?.title || '',
      'Contato Relacionado': contact?.name || '',
      'Data de Vencimento': activity.dueDate ? new Date(activity.dueDate).toLocaleDateString('pt-BR') : '',
      'Horário': activity.dueTime || '',
      'Local': activity.location || '',
      'Duração (min)': activity.duration || '',
      'Data de Criação': activity.createdAt ? new Date(activity.createdAt).toLocaleDateString('pt-BR') : '',
      'Data de Conclusão': activity.completedAt ? new Date(activity.completedAt).toLocaleDateString('pt-BR') : '',
      'Checklist': activity.checklist?.map((item: any) => `${item.completed ? '✓' : '○'} ${item.text}`).join('; ') || '',
    };
  });
};