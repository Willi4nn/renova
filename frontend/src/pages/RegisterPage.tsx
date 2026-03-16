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
import { useAuthStore } from '../store/useAuthStore';

const registerSchema = z
  .object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    email: z
      .string()
      .min(1, 'O e-mail é obrigatório')
      .email('Formato de e-mail inválido'),
    password: z
      .string()
      .min(1, 'Senha é obrigatória')
      .min(8, 'Senha deve ter pelo menos 8 caracteres')
      .max(20, 'Senha deve ter no máximo 20 caracteres')
      .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
      .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
      .regex(/\d/, 'Senha deve conter pelo menos um número')
      .regex(/[\W_]/, 'Senha deve conter pelo menos um caractere especial'),
    confirmPassword: z.string().min(1, 'Por favor, confirme sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type RegisterFormInputs = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const registerUser = useAuthStore((state) => state.registerUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success('Conta criada com sucesso! Você já pode fazer login.');
      navigate('/login');
    } catch (error: unknown) {
      console.error('Erro completo:', error);

      let errorMessage = 'Erro desconhecido ao tentar registrar.';

      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      }

      toast.error(`Falha no registro: ${errorMessage}`);
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
            Criar Conta
          </h2>
          <p className="text-md mt-2 text-gray-500">
            Preencha os dados abaixo para se registrar.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nome
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              disabled={isSubmitting}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

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
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700"
            >
              Confirmar Senha
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                disabled={isSubmitting}
                className="w-full pr-10"
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isSubmitting}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="mt-6 w-full">
          {isSubmitting ? 'Registrando...' : 'Registrar'}
        </Button>

        <p className="text-md mt-4 text-center text-gray-600">
          Já possui conta?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
