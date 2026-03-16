import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { z } from 'zod';
import AuthLayout from '../components/layout/AuthLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ApiClientError } from '../services/api/httpClient';
import { useAuthStore } from '../store/useAuthStore';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'O e-mail é obrigatório')
    .email('Formato de e-mail inválido'),
  password: z.string().min(1, 'A senha é obrigatória'),
  rememberMe: z.boolean().optional(),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login(data);
      toast.success('Login efetuado com sucesso!');
      navigate('/dashboard');
    } catch (error: unknown) {
      let errorMessage = 'Erro no login. Verifique as credenciais.';

      if (error instanceof ApiClientError) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="auth-card mx-auto max-w-md"
      >
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Bem-vindo de volta
          </h2>
          <p className="text-md mt-2 text-gray-500">
            Insira os seus dados de acesso.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Seu e-mail"
              disabled={isSubmitting}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                disabled={isSubmitting}
                className="w-full pr-10"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              disabled={isSubmitting}
              className="h-4 w-4 cursor-pointer rounded border-gray-300"
              {...register('rememberMe')}
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-700">
              Lembrar-me
            </label>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="mt-6 w-full">
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>

        <p className="text-md mt-4 text-center text-gray-600">
          Não tem uma conta?{' '}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Registre-se aqui
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
