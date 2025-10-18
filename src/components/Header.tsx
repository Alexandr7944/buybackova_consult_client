import {useState, type FC} from "react";
import {Link, useNavigate} from "react-router-dom";

export const Header: FC = () => {
    const [open, setOpen] = useState(false);
    const closeMobileMenu = () => setOpen(false);

    const navigate = useNavigate();
    const linkList = [
        {name: "Главная", link: "/"},
        {name: "О нас", link: "/about"},
        {name: "Услуги", link: "/services"},
        {name: "Контакты", link: "/contacts"}
    ];

    return (
        <header className="bg-gray-900 text-gray-100 border-b border-gray-800">

            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between md:h-20">
                    {/* Logo */}
                    <a href="/" className="flex items-center gap-3 hover:opacity-90">
                        <span className="sr-only">На главную</span>
                        <span className="font-semibold tracking-tight text-lg sm:text-xl">ВАУbakova</span>
                    </a>

                    {/* Desktop navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        {linkList.map((link) => (
                            <Link
                                key={link.link}
                                to={link.link}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            className="px-3 py-2 rounded-md text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition"
                            onClick={() => navigate('/auth')}
                        >
                            Вход
                        </button>
                        <button
                            className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition"
                            onClick={() => navigate('/auth')}
                        >
                            Регистрация
                        </button>
                    </div>

                    {/* Mobile burger */}
                    <button
                        type="button"
                        className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-controls="mobile-menu"
                        aria-expanded={open}
                        aria-label={open ? "Закрыть меню" : "Открыть меню"}
                        onClick={() => setOpen((v) => !v)}
                    >
                        <svg
                            className={`h-6 w-6 ${open ? "hidden" : "block"}`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden={!open}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                        <svg
                            className={`h-6 w-6 ${open ? "block" : "hidden"}`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden={open}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                id="mobile-menu"
                className={`md:hidden border-t border-gray-800 ${open ? "block" : "hidden"}`}
            >
                <nav className="px-4 py-3 space-y-1">
                    {linkList.map((link) => (
                        <Link
                            key={link.link}
                            to={link.link}
                            onClick={closeMobileMenu}
                            className="block rounded-md px-3 py-2 text-base font-medium text-white/90 hover:bg-white/10"
                        >
                            {link.name}
                        </Link>
                    ))}

                    <div className="pt-2 flex items-center gap-2">
                        <button
                            onClick={closeMobileMenu}
                            className="flex-1 rounded-md px-3 py-2 text-base font-medium text-white/90 hover:bg-white/10"
                        >
                            Вход
                        </button>
                        <button
                            onClick={closeMobileMenu}
                            className="flex-1 rounded-md px-3 py-2 text-base font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition"
                        >
                            Регистрация
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};
