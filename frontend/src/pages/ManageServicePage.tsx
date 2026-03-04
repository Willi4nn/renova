import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X } from 'lucide-react';
import { useEffect } from 'react';
import {
  useForm,
  type FieldError,
  type Resolver,
  type SubmitHandler,
} from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FormField } from '../components/features/FormField';
import { FormSection } from '../components/features/FormSection';
import { SummaryCard } from '../components/features/SummaryCard';
import { Button } from '../components/ui/Button';
import { DetailPageHeader } from '../components/ui/DetailPageHeader';
import { Input } from '../components/ui/Input';
import { Spinner } from '../components/ui/Spinner';
import {
  COST_FIELDS,
  EMPTY_NUM,
  toDateInputValue,
} from '../constants/serviceFormConstants';
import { STATUS_MAP } from '../constants/serviceStatus';
import { useServiceCalculator } from '../hooks/useServiceCalculator';
import { useClientStore } from '../store/useClientStore';
import { useServiceStore } from '../store/useServiceStore';
import type { ServiceStatus } from '../types';
import type { CreateServiceRequest } from '../types/api';
import { cn } from '../utils/cn';
import { formatCurrency } from '../utils/formatters';
import { serviceSchema, type ServiceFormData } from '../utils/validation';

export function ManageServicePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const { addService, editService, getServiceById, isLoading, error } =
    useServiceStore();
  const {
    clients,
    fetchClients,
    isLoading: isLoadingClients,
  } = useClientStore();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(
      serviceSchema,
    ) as unknown as Resolver<ServiceFormData>,
    defaultValues: {
      status: 'IN_PROGRESS',
      fabric_price_per_meter: EMPTY_NUM,
      fabric_meters: EMPTY_NUM,
      cost_foam: EMPTY_NUM,
      cost_labor: EMPTY_NUM,
      cost_shipping: EMPTY_NUM,
      cost_other: EMPTY_NUM,
    },
  });

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    if (isEditing && id) {
      const service = getServiceById(id);
      if (service) {
        reset({
          client_id: service.client_id,
          furniture_name: service.furniture_name,
          fabric_name: service.fabric_name,
          fabric_code: service.fabric_code || '',
          fabric_price_per_meter: service.fabric_price_per_meter,
          fabric_meters: service.fabric_meters,
          cost_foam: service.cost_foam,
          cost_labor: service.cost_labor,
          cost_shipping: service.cost_shipping,
          cost_other: service.cost_other,
          collection_date: toDateInputValue(service.collection_date),
          delivery_date: service.delivery_date
            ? toDateInputValue(service.delivery_date)
            : '',
          status: service.status,
          notes: service.notes || '',
        });
      } else {
        navigate('/services');
      }
    }
  }, [id, isEditing, getServiceById, reset, navigate]);

  const backUrl = isEditing ? `/services/${id}` : '/services';

  const { cost_fabric, total_cost, final_price, net_profit } =
    useServiceCalculator(control);

  const onSubmit: SubmitHandler<ServiceFormData> = async (data) => {
    try {
      const payload: CreateServiceRequest = {
        ...data,
        fabric_code: data.fabric_code?.trim() || undefined,
        delivery_date: data.delivery_date || undefined,
        notes: data.notes?.trim() || undefined,
      };

      if (isEditing) {
        await editService(id!, payload);
      } else {
        await addService(payload);
      }

      toast.success(
        `Serviço ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`,
      );

      setTimeout(() => navigate(backUrl), 10);
    } catch {
      toast.error('Erro ao salvar o serviço.');
    }
  };

  const summaryItems = [
    { title: 'Custo do Tecido', value: formatCurrency(cost_fabric) },
    {
      title: 'Custo (S/ M. de obra)',
      value: formatCurrency(total_cost),
      tooltip: 'Custo Total (S/ Mão de obra)',
    },
    {
      title: 'Lucro Líquido',
      value: formatCurrency(net_profit),
      variant: 'success' as const,
    },
    {
      title: 'Preço Final Sugerido',
      value: formatCurrency(final_price),
      variant: 'primary' as const,
    },
  ];

  if (isLoadingClients && !isEditing) return <Spinner />;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4">
      <DetailPageHeader
        backTo={backUrl}
        title={isEditing ? 'Editar Serviço' : 'Novo Serviço'}
        description={
          isEditing
            ? 'Atualize as informações do serviço'
            : 'Cadastre um novo serviço no sistema'
        }
      />

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <FormSection title="Dados Principais">
          <FormField label="Cliente" required error={errors.client_id?.message}>
            <select
              {...register('client_id')}
              disabled={isEditing}
              className={cn(
                'input-base',
                isEditing && 'cursor-not-allowed bg-slate-100 opacity-60',
              )}
            >
              <option value="">Selecione um cliente...</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Nome do Móvel"
            required
            error={errors.furniture_name?.message}
          >
            <Input
              {...register('furniture_name')}
              placeholder="Ex: Sofá de 3 lugares"
            />
          </FormField>

          <FormField label="Status" required error={errors.status?.message}>
            <select {...register('status')} className="input-base">
              {(Object.keys(STATUS_MAP) as ServiceStatus[]).map((status) => (
                <option key={status} value={status}>
                  {STATUS_MAP[status].label}
                </option>
              ))}
            </select>
          </FormField>
        </FormSection>

        <FormSection title="Especificações de Tecido">
          <FormField
            label="Nome do Tecido"
            required
            error={errors.fabric_name?.message}
          >
            <Input
              {...register('fabric_name')}
              placeholder="Ex: Suede Animale"
            />
          </FormField>

          <FormField
            label="Código do Tecido"
            error={errors.fabric_code?.message}
          >
            <Input {...register('fabric_code')} placeholder="Ex: AZ-204" />
          </FormField>

          <FormField
            label="Preço por Metro (R$)"
            required
            error={errors.fabric_price_per_meter?.message}
          >
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register('fabric_price_per_meter')}
            />
          </FormField>

          <FormField
            label="Metragem (m)"
            required
            error={errors.fabric_meters?.message}
          >
            <Input
              type="number"
              step="0.1"
              placeholder="0.0"
              {...register('fabric_meters')}
            />
          </FormField>
        </FormSection>

        <FormSection
          title="Custos Adicionais & Precificação"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-5"
        >
          {COST_FIELDS.map(({ label, name, step, placeholder }) => (
            <FormField
              key={name}
              label={label}
              error={(errors[name] as FieldError | undefined)?.message}
            >
              <Input
                type="number"
                step={step}
                placeholder={placeholder}
                {...register(name)}
              />
            </FormField>
          ))}
        </FormSection>

        <FormSection
          title="Resumo Financeiro"
          className="grid grid-cols-2 gap-4 md:grid-cols-4"
          isHighlighted
        >
          {summaryItems.map((item) => (
            <SummaryCard key={item.title} {...item} />
          ))}
        </FormSection>

        <FormSection title="Datas e Observações">
          <FormField
            label="Data de Coleta"
            required
            error={errors.collection_date?.message}
          >
            <Input type="date" {...register('collection_date')} />
          </FormField>

          <FormField
            label="Data de Entrega"
            error={errors.delivery_date?.message}
          >
            <Input type="date" {...register('delivery_date')} />
          </FormField>

          <div className="md:col-span-2">
            <FormField label="Observações" error={errors.notes?.message}>
              <textarea
                {...register('notes')}
                rows={4}
                className="input-base resize-none"
                placeholder="Informações adicionais sobre o serviço..."
              />
            </FormField>
          </div>
        </FormSection>

        <div className="flex flex-col-reverse items-center justify-end gap-4 pt-4 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(backUrl)}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed sm:w-auto"
          >
            <X size={18} />
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading || (isEditing && !isDirty)}
            className="flex w-full items-center justify-center gap-2 whitespace-nowrap disabled:cursor-not-allowed sm:w-auto"
          >
            <Save size={18} />
            {isEditing ? 'Salvar Alterações' : 'Cadastrar Serviço'}
          </Button>
        </div>
      </form>
    </div>
  );
}
