'use client'
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from "@/app/hook";

const schema = z.object({
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

export default function Login() {
    const { login } = useAuth();
    const { register, reset, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        await login(data);
        console.log(data)
        reset();
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] dark:bg-white">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <div className="font-[sans-serif]">
                    <div className="h-screen flex flex-col items-center justify-center py-6 px-4">
                        <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full">
                            <div className="border border-gray-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
                                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                                    <div className="mb-8">
                                        <h3 className="text-gray-800 text-3xl font-extrabold">Sign in</h3>
                                        <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                                            Sign in to your account and explore a world of possibilities. Your journey begins here.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-gray-800 text-sm mb-2 block">Email</label>
                                        <div className="relative flex items-center">
                                            <input
                                                {...register('email')}
                                                type="email"
                                                className={`w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600 ${errors.email ? 'border-red-500' : ''}`}
                                                placeholder="Enter your email"
                                            />
                                            {errors.email && (
                                                <span className="absolute right-4 text-red-500 text-xs">{errors.email.message}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-gray-800 text-sm mb-2 block">Password</label>
                                        <div className="relative flex items-center">
                                            <input
                                                {...register('password')}
                                                type="password"
                                                className={`w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600 ${errors.password ? 'border-red-500' : ''}`}
                                                placeholder="Enter your password"
                                            />
                                            {errors.password && (
                                                <span className="absolute right-4 text-red-500 text-xs">{errors.password.message}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="!mt-8">
                                        <button
                                            type="submit"
                                            className="w-full shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                        >
                                            Log in
                                        </button>
                                    </div>

                                    <p className="text-sm !mt-8 text-center text-gray-800">
                                        Don't have an account? <a href="/register" className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap">Register here</a>
                                    </p>
                                </form>
                            </div>
                            <div className="lg:h-[400px] md:h-[300px] max-md:mt-8">
                                <img
                                    src="https://readymadeui.com/login-image.webp"
                                    className="w-full h-full max-md:w-4/5 mx-auto block object-cover"
                                    alt="Dining Experience"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
