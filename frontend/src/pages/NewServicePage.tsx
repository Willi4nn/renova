import { useParams } from 'react-router-dom';

export function NewServicePage() {
  const { id } = useParams<{ id: string }>();

  const isEditing = !!id;

  return <div>{isEditing ? 'Editando serviço' : 'Novo serviço'}</div>;
}
