import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import EChartsReact from 'echarts-for-react';
import type {RefObject} from "react";
import {FontLoader, FONTS} from './fontUtils';

interface PDFExportOptions {
    title: string;
    margins?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
}

export type ElementForExport = {
    type: 'chart',
    ref: RefObject<EChartsReact | null>,
} | {
    type: 'table' | 'content',
    ref: RefObject<HTMLElement | null>,
}

export class PDFExportService {
    private doc: jsPDF;
    private currentPage: number = 1;
    private totalPages: number = 0;
    private pageHeight: number = 297;
    private pageWidth: number = 210;
    private margin: { top: number; right: number; bottom: number; left: number };
    private currentPosition: { x: number; y: number; };
    private fontLoader: FontLoader;

    constructor(options: PDFExportOptions) {
        const {
            title,
            margins = {top: 20, right: 15, bottom: 20, left: 15}
        } = options;

        this.doc = new jsPDF({
            orientation: 'portrait',
            unit:        'mm',
            format:      'A4',
            compress:    false
        });

        this.margin = margins;
        this.fontLoader = FontLoader.getInstance();
        this.currentPosition = {
            x: this.margin.left,
            y: this.margin.top
        };
        this.addMetadata(title);
    }

    private addMetadata(title: string): void {
        this.doc.setProperties({
            title:    title,
            subject:  'Отчет',
            author:   'Система отчетности',
            keywords: 'отчет, графики, анализ',
            creator:  'React ECharts App'
        });
    }

    private async registerFonts(): Promise<void> {
        try {
            await this.fontLoader.loadAllFonts();
            for (const font of FONTS) {
                const base64Font = this.fontLoader.getLoadedFont(font.path);
                if (base64Font) {
                    const fontName = `Roboto-${font.style}`;
                    this.doc.addFileToVFS(fontName, base64Font);
                    this.doc.addFont(fontName, font.name, font.style);
                }
            }

            this.doc.setFont('Roboto', 'italic');
        } catch (error) {
            console.error('Ошибка регистрации шрифтов:', error);
            this.doc.setFont('helvetica');
        }
    }

    private async captureElement(element: HTMLElement): Promise<HTMLCanvasElement> {
        const scale = 2;
        const options = {
            scale,
            useCORS:         true,
            allowTaint:      true,
            backgroundColor: '#ffffff',
            logging:         false,
            onclone:         (clonedDoc: Document) => {
                const noPrintElements = clonedDoc.querySelectorAll('.no-print');
                noPrintElements.forEach(el => {
                    if (el.parentNode) {
                        el.parentNode.removeChild(el);
                    }
                });

                clonedDoc.body.style.backgroundColor = '#ffffff';
                clonedDoc.body.style.color = '#000000';
            }
        };

        return html2canvas(element, options);
    }

    private async captureECharts(chartRef: React.RefObject<EChartsReact>): Promise<{
        canvas: HTMLCanvasElement,
        title?: string,
    }> {
        const chartTitle = chartRef.current.ele.previousElementSibling?.textContent || '';
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        const chartInstance = chartRef.current.getEchartsInstance();
        const dataURL = chartInstance.getDataURL({
            type:            'png',
            pixelRatio:      2,
            backgroundColor: '#ffffff',
        });
        await new Promise<void>((resolve) => {
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx?.drawImage(img, 0, 0);
                resolve();
            };
            img.onerror = () => {
                console.error('Ошибка при загрузке графика');
                resolve();
            };
            img.src = dataURL;
        });

        return {canvas, title: chartTitle};
    }

    private addPageHeader(title: string): void {
        this.doc.setFontSize(14);
        this.doc.text(title, this.margin.left, this.margin.top);

        this.doc.setLineWidth(0.5);
        this.doc.line(
            this.margin.left,
            this.margin.top + 2,
            this.pageWidth - this.margin.right,
            this.margin.top + 2
        );

        this.currentPosition.y = this.margin.top + 10;
    }

    private addPageFooter(): void {
        if (this.totalPages > 0) {
            const footerY = this.pageHeight - this.margin.bottom + 10;

            this.doc.setFontSize(10);
            this.doc.text(
                `Страница ${this.currentPage} из ${this.totalPages}`,
                this.pageWidth / 2,
                footerY,
                {align: 'center'}
            );

            const date = new Date().toLocaleDateString('ru-RU');
            this.doc.text(
                `Дата экспорта: ${date}`,
                this.pageWidth - this.margin.right,
                footerY,
                {align: 'right'}
            );
        }
    }

    private checkPageBreak(heightNeeded: number): boolean {
        const remainingHeight = this.pageHeight - this.currentPosition.y - this.margin.bottom - 20;

        if (heightNeeded > remainingHeight) {
            this.addPageFooter();
            this.doc.addPage();
            this.currentPage++;
            this.currentPosition.y = this.margin.top + 10;
            this.addPageHeader('Продолжение отчета');
            return true;
        }

        return false;
    }

    public async addHTMLContent(
        element: HTMLElement,
        options?: {
            excludeClasses?: string[];
            includeClasses?: string[];
        }
    ): Promise<void> {
        try {
            const excludeClasses = options?.excludeClasses || ['no-print'];
            excludeClasses.forEach(className => {
                const elements = element.querySelectorAll(`.${className}`);
                elements.forEach(el => el.remove());
            });

            if (options?.includeClasses) {
                const allElements = Array.from(element.children);
                allElements.forEach(child => {
                    const hasIncludedClass = options.includeClasses!.some(className =>
                        child.classList.contains(className)
                    );
                    if (!hasIncludedClass) {
                        child.remove();
                    }
                });
            }

            const canvas = await this.captureElement(element);
            await this.addCanvasToPDF(canvas);

        } catch (error) {
            console.error('Ошибка при добавлении HTML контента:', error);
            throw error;
        }
    }

    public async addEChartsToPDF(
        chartRef: React.RefObject<EChartsReact>
    ): Promise<void> {
        try {
            const {canvas, title} = await this.captureECharts(chartRef);

            if (title) {
                this.doc.setFontSize(14);
                this.checkPageBreak(20);
                this.doc.text(title, this.margin.left, this.currentPosition.y);
                this.currentPosition.y += 10;
            }

            const maxWidth = this.pageWidth - this.margin.left - this.margin.right;
            const canvasRatio = canvas.width / canvas.height;
            const width = Math.min(canvas.width / 5, maxWidth);
            const height = width / canvasRatio;

            this.checkPageBreak(height + 10);

            const imgData = canvas.toDataURL('image/png');
            this.doc.addImage(
                imgData,
                'PNG',
                this.margin.left,
                this.currentPosition.y,
                width,
                height
            );

            this.currentPosition.y += height + 10;


        } catch (error) {
            console.error('Ошибка при добавлении графиков:', error);
            throw error;
        }
    }

    private async addCanvasToPDF(canvas: HTMLCanvasElement): Promise<void> {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = this.pageWidth - this.margin.left - this.margin.right;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let remainingHeight = imgHeight;

        while (remainingHeight > 0) {
            const availableHeight = this.pageHeight - this.currentPosition.y - this.margin.bottom - 20;
            const height = Math.min(availableHeight, remainingHeight);

            this.doc.addImage(
                imgData,
                'PNG',
                this.margin.left,
                this.currentPosition.y,
                imgWidth,
                imgHeight,
                undefined,
                'FAST',
                0
            );

            remainingHeight -= height;
            this.currentPosition.y += height;

            if (remainingHeight > 0) {
                this.addPageFooter();
                this.doc.addPage();
                this.currentPage++;
                this.currentPosition.y = this.margin.top + 10;
                this.addPageHeader('Продолжение отчета');
            }
        }
    }

    public addText(contents: string[], fontSize: number = 11): void {
        for (const content of contents) {
            const lines = this.doc.splitTextToSize(content, this.pageWidth - this.margin.left - this.margin.right);
            this.doc.setFontSize(fontSize);

            for (const line of lines) {
                const lineHeight = fontSize * 0.55;
                this.checkPageBreak(lineHeight);
                this.doc.text(line, this.margin.left, this.currentPosition.y);

                this.currentPosition.y += lineHeight;
            }
        }

        this.currentPosition.y += 10;
    }

    public async generatePDF(
        elements: ElementForExport[],
        title: string
    ): Promise<void> {
        try {
            await this.registerFonts();
            this.addPageHeader(title);
            for (const element of elements) {
                if (!element.ref.current)
                    continue;

                if (element.type === 'chart') {
                    await this.addEChartsToPDF(element.ref as RefObject<EChartsReact>);
                    continue;
                }
                if (element.type === 'table') {
                    const table = element.ref.current.querySelector('table');
                    if (!table)
                        continue;
                    const rows = Array.from(table.querySelectorAll('tbody tr'))
                        .map(tr => Array.from(tr.querySelectorAll('td'))
                            .map(td => td.textContent || ''));
                    this.addTable(rows);
                } else {
                    const contents = Array.from(element.ref.current.querySelectorAll('p, h1, h2, h3, h4, h5, h6'))
                        .map(x => x.textContent || '');
                    this.addText(contents);
                }
            }

            this.totalPages = this.doc.getNumberOfPages();
            for (let i = 1; i <= this.totalPages; i++) {
                this.doc.setPage(i);
                this.currentPage = i;
                this.addPageFooter();
            }

        } catch (error) {
            console.error('Ошибка генерации PDF:', error);
            throw error;
        }
    }

    public save(fileName: string = 'report.pdf'): void {
        this.doc.save(fileName);
    }

    public getBlob(): Blob {
        return this.doc.output('blob');
    }

    public getDataURL(): string {
        return this.doc.output('dataurlstring');
    }

    // Новый метод для добавления таблицы
    public addTable(
        rows: string[][],
        columnWidths?: number[]
    ): void {
        // const tableTop = this.currentPosition.y;
        const columnCount = 2;
        const availableWidth = this.pageWidth - this.margin.left - this.margin.right;

        // Рассчитываем ширины столбцов
        const widths = columnWidths || Array(columnCount).fill(availableWidth / columnCount);

        // Заголовки таблицы
        this.doc.setFontSize(10);

        let currentX = this.margin.left;
        for (let i = 0; i < 2; i++) {
            currentX += widths[i];
        }
        // Данные таблицы
        for (const row of rows) {
            const rowHeight = 10;
            this.checkPageBreak(rowHeight);

            currentX = this.margin.left;
            for (let i = 0; i < row.length; i++) {
                const cellText = this.doc.splitTextToSize(row[i], widths[i] - 2);
                let cellHeight = cellText.length * 5;

                if (cellHeight > rowHeight) {
                    this.checkPageBreak(cellHeight);
                }

                this.doc.text(cellText, currentX, this.currentPosition.y);
                currentX += widths[i];
            }

            this.currentPosition.y += rowHeight;
        }

        this.doc.line(
            this.margin.left,
            this.currentPosition.y,
            this.pageWidth - this.margin.right,
            this.currentPosition.y
        );
        this.currentPosition.y += 10;
    }
}
