// Типы для шрифтов
export interface FontConfig {
    name: string;
    style: 'normal' | 'bold' | 'italic';
    path: string;
}

export const FONTS: FontConfig[] = [
    {
        name:  'Roboto',
        style: 'normal',
        path:  '../fonts/Roboto-Regular.ttf'
    },
    {
        name:  'Roboto',
        style: 'bold',
        path:  '../fonts/Roboto-Bold.ttf'
    },
    {
        name:  'Roboto',
        style: 'italic',
        path:  '../fonts/Roboto-Italic.ttf'
    },
];

export class FontLoader {
    private static instance: FontLoader;
    private loadedFonts: Map<string, string> = new Map();
    private loadingPromises: Map<string, Promise<string>> = new Map();

    private constructor() {
    }

    public static getInstance(): FontLoader {
        if (!FontLoader.instance) {
            FontLoader.instance = new FontLoader();
        }
        return FontLoader.instance;
    }

    private async fetchFontAsBase64(url: string): Promise<string> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Ошибка загрузки шрифта: ${response.status} ${response.statusText}`);
            }

            const blob = await response.blob();
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result as string;
                    // Удаляем префикс data:application/octet-stream;base64,
                    const base64Data = base64.split(',')[1];
                    resolve(base64Data);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error(`Не удалось загрузить шрифт ${url}:`, error);
            throw error;
        }
    }

    public async loadFont(fontPath: string): Promise<string> {
        // Проверяем, загружен ли уже шрифт
        if (this.loadedFonts.has(fontPath)) {
            return this.loadedFonts.get(fontPath)!;
        }

        // Проверяем, идет ли уже загрузка
        if (this.loadingPromises.has(fontPath)) {
            return this.loadingPromises.get(fontPath)!;
        }

        // Начинаем загрузку
        const loadingPromise = this.fetchFontAsBase64(fontPath);
        this.loadingPromises.set(fontPath, loadingPromise);

        try {
            const base64Font = await loadingPromise;
            this.loadedFonts.set(fontPath, base64Font);
            this.loadingPromises.delete(fontPath);
            return base64Font;
        } catch (error) {
            this.loadingPromises.delete(fontPath);
            throw error;
        }
    }

    public async loadAllFonts(): Promise<void> {
        const promises = FONTS.map(font => this.loadFont(font.path));
        await Promise.all(promises);
    }

    public getLoadedFont(fontPath: string): string | undefined {
        return this.loadedFonts.get(fontPath);
    }

    public isFontLoaded(fontPath: string): boolean {
        return this.loadedFonts.has(fontPath);
    }
}

// Преобразование ArrayBuffer в base64
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
