import * as React from "react";
import {Link} from "react-router-dom";

export const NotFound: React.FC<{}> = () => {
    return (
        <div className="mx-auto max-w-3xl p-6">
            <h1 className="text-2xl font-semibold text-gray-900">Страница не найдена</h1>
            <p className="mt-2 text-gray-600">Похоже, вы перешли по неверной ссылке.</p>
            <div className="mt-4">
                <Link
                    to="../"
                    className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-800 ring-1 ring-inset ring-gray-300 hover:bg-gray-200"
                >
                    На главную
                </Link>
            </div>
        </div>
    )
}
