import {type FC, type FormEvent, useState} from "react";
import {httpJson} from "@/shared/api.ts";
import {redirect} from "react-router-dom";

export const Authorisation: FC<{}> = () => {
    const [formData, setFormData] = useState({username: '', password: ''});

    const handleSubmit = async (e: FormEvent, action: string) => {
        e.preventDefault();

        try {
            const result = await httpJson<{
                user: { id: number, username: string },
                token: string
            }>('/auth/' + action, {
                method:  'POST',
                body:    JSON.stringify(formData),
                headers: {'Content-Type': 'application/json'}
            })

            if (result.token)
                localStorage.setItem('token', result.token);

            redirect('/');
        } catch (e) {
            console.warn(e);
        }
    };

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Войдите в свой аккаунт
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Логин
                        </label>
                        <div className="mt-2">
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                autoComplete="username"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                className="input"
                                placeholder="Введите логин"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Пароль
                        </label>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="input"
                                placeholder="Введите пароль"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                        <button type="button"
                                className="button"
                                onClick={e => handleSubmit(e, 'login')}
                        >
                            Войти
                        </button>
                        <button type="button"
                                className="button text-white  bg-indigo-600 hover:bg-indigo-500"
                                onClick={e => handleSubmit(e, 'registration')}
                        >
                            Регистрация
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
