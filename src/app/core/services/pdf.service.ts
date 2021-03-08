/* import * as jspdf from 'jspdf';
import * as html2canvas from 'html2canvas';
import { LoaderService } from './loader.service';
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { DecimalPipe, DatePipe } from '@angular/common';
// import jsPDF from 'jspdf'
// import jsPDF = require('jspdf') // // typescript without esModuleInterop flag
// import jsPDF from 'yworks-pdf' // using yworks fork
// import jsPDF from 'jspdf/dist/jspdf.node.debug' // for nodejs
require('jspdf-autotable');

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Injectable({
    providedIn: 'root'
})
export class PdfService {
    public canvasHtmlPrivate: any = html2canvas;

    constructor(public loaderService: LoaderService, private _decimalPipe: DecimalPipe, private _datePipe: DatePipe) {

    }
    generatePdf(data: any, fileName: string, hasScroll: boolean = false, headerName: string) {
        let self = this;
        self.loaderService.show();
        this.canvasHtmlPrivate(data, {
            allowTaint: true,
            scrollY: -window.scrollY
        }).then(function (canvas) {
            var totalPagesExp = '{total_pages_count_string}';
            var top_left_margin = 15;
            var PDF_Width = (canvas.width > 300 ? canvas.width : canvas.width * 3) + (top_left_margin * 3);
            var PDF_Height = (PDF_Width * 1.3) + (top_left_margin * 3);
            var canvas_image_width = canvas.width > 300 ? canvas.width : canvas.width * 3;
            var canvas_image_height = canvas.width > 300 || canvas.height > 300 ? canvas.height : canvas.height * 3;

            var totalPDFPages = Math.ceil(canvas.height / PDF_Height) - 1;

            canvas.getContext('2d');

            var imgData = canvas.toDataURL("image/jpeg", 1.0);
            var pdf = new jspdf('p', 'pt', [PDF_Width, PDF_Height]);
            pdf.page = 1; // use this as a counter.
            var totalPages = 10; // define total amount of pages
            // HEADER
            pdf.setFontSize(20)
            pdf.setTextColor(40)
            pdf.setFontStyle('Avenir,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"')
            pdf.addImage('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAgACADAREAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAABQYIAwf/xAAsEAACAQQCAgECBQUBAAAAAAABAgMEBQYRBxIACCETMQkUIkJxFRcyQcTT/8QAGgEAAwADAQAAAAAAAAAAAAAABAUGAgMHAf/EADcRAAECBQMBBAYJBQAAAAAAAAECEQADBAUhBhIxUQdBYZETFhdxgbEUFSJSU1Rk0eKio8HS8f/aAAwDAQACEQMRAD8As29+7PGNk5k/tDNa7tK0VxW0VN2QR/loqssEK9e3YorkqzaBBVtAj5N7T9ntxqLR9bBaQ6d4Rlyln6M5GQOhGQcRLTtW0Umv+gEHnaVYYHj3sDgwu84++Nk4i5Ar+P7Vx7U5DUWrolbUvclo41lZFfqg+lIX0GAJPX5BABA2WGnOzabfKBNfNqBLC3YbdxZ2c/aS3GOcQJd9ZSrZVKpUSt5TyXbPOMH/ABCCPxOo/wB3CLj+MjB/5vHnsg/W/wBv+cLfaCn8v/X/ABg1iP4k+LXjIaG15PxpWWS31Uywy18d1WpFP2IHdkMSbQb2xB2ADoE/Hgdd2TVFPTqm01SFqAcJKSl27gdxz0w3iIIpte082alE6UUpPe7t8GGOsb8r3T0uxLnmbLcqhu1Tltsq46qup7fHK9GK1ArI8i/CtINKSEbqWB7gt2Hgdo9a6uzCkpikSVAgFTbtpcEDvblnDtwWaNF1qtNUd1M6oczUkEgPt3YIJ8erFn5y8KfJueei3LOTzZjk1NlcF2qlRameigki+uVUKrOuyvYKANgDehvfjK00usLLTCkp1IKBwCQWfOOO+F9xumlrpONRO3hR5IBDwKxHA/QfNMhocYtt8zGlrblMtPTfm5GjjeVjpU7/AEyASSAN6Gz9/Cqy760oZCqhaZZSkOWyW7yzxppJGlK2cmQhawpRYPgP0dooHGfRTgHGb9RX+O2Xe4S0EyVEUFdX94TIrBlLKqr2AIH6Sep+xBHx5GVfaJfKuSqQVJSFBiQnLHliSW9/PSK+n0Xa6eamaAotlicfIft1he5a9EMf5Gzm5ZrZM7nsDXiZqqrpXtoq0NQ3y7ofqxlQx2xB7fLHRA0BlatdT7dSopZkrftDA7mwOAcHjjuhTeNASrlVrq5M4y95cjbuyeSMjnnvzHEsv9T+H8Du72DLPaG20FyjUNJSnH2kki2Aw7hKg9CQQQG0SCD9j5SUur7jWy/SyKIlPXf8nTmJCu0ra7bN9BVXFKVjkbHI97LLfGNcC4f9ZsWy+05LefZikutPaquKsFHFZZKUyvGwdVZy76XYGwF2RsAg/PmFdfb1VU65EujKSoEPuBZ8cMM9M+ce2+2afpKlE+bcQoJILBBS7ZGXOOuPiIszHvYHhfKrtT2Kw8i2ipr6txHBAZGjaVz8BV7gAsT8AD5P+vObT7JcKZBmzZRCRyf+R1Ol1PaK2aJEioSVHgcP4B2z4R0LxXD2JC5r9KcrzzkS7ZrieWWlKe8zfmZYLkZkeGQqAyqyK/Zdgkf46BC6Otm2teqpdHSpp5qC6cYbPyjkmo+zysudwmVlJOSyy5CnBB94BceTcQhH8P3ln9uUYgf5qar/AMPGPrnS/cV5D94Rey68fiy/NX+kHcD9Dc+tOYWm75Pltgit1BVxVcv9Olnknf6bhuiho0Ck6127fp3vR+3g9XrCTMkKRKQpyCMs2fifKDrZ2Z3GRWS5tVOQEJIJ2lROC7B0pZ+r45Yx/9k=', 'JPEG',top_left_margin + 26, top_left_margin + 25, 30, 30)
            pdf.text(headerName, 83, 61); // set your margins
            var str = 'Página ' + pdf.internal.getNumberOfPages()
            // Total page number plugin only available in jspdf v1.0+
            if (typeof pdf.putTotalPages === 'function') {
                str = str + ' de ' + totalPagesExp
            }

            // jsPDF 1.4+ uses getWidth, <1.4 uses .width
            var pageSize = pdf.internal.pageSize
            var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
            pdf.setFontSize(10)
            pdf.setTextColor(40)
            pdf.text(str, top_left_margin, pageHeight - 10)
         
            pdf.addImage(imgData, 'JPG', top_left_margin + 25, top_left_margin + 70, canvas_image_width-100, canvas_image_height-100);


            for (var i = 1; i <= totalPDFPages; i++) {
                pdf.addPage(PDF_Width, PDF_Height);
                pdf.addImage(imgData, 'JPG', top_left_margin + 10, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
            }

            self.loaderService.hide();
            if (typeof pdf.putTotalPages === 'function') {
                pdf.putTotalPages(totalPagesExp)
            }
            pdf.save(`${fileName}.pdf`);
        });
    }


    generatePdfbyData(headerConfig: any, dataBody: any, fileName: string, headerName: string) {


        let self = this;
        self.loaderService.show();
        const doc = new jspdf();
        var totalPagesExp = '{total_pages_count_string}';
        var headerTxt = "This is test header";

        doc.autoTable({

            theme: 'grid',
            showHead: 'firstPage',
            columnStyles: this.buildColumnsStyles(headerConfig),
            styles: {},
            headStyles: { fillColor: [16, 36, 102], },
            body: this.formatValues(headerConfig, dataBody),
            columns: headerConfig,
            didDrawCell: (data) => {
                // data.cell.text = 'とうきょう'
            },
            didDrawPage: function (data) {
                // Header
                doc.setFontSize(20)
                doc.setTextColor(40)
                doc.setFontStyle('Avenir,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"')
                // if (base64Img) {
                   doc.addImage('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAgACADAREAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAABQYIAwf/xAAsEAACAQQCAgECBQUBAAAAAAABAgMEBQYRBxIACCETMQkUIkJxFRcyQcTT/8QAGgEAAwADAQAAAAAAAAAAAAAABAUGAgMHAf/EADcRAAECBQMBBAYJBQAAAAAAAAECEQADBAUhBhIxUQdBYZETFhdxgbEUFSJSU1Rk0eKio8HS8f/aAAwDAQACEQMRAD8As29+7PGNk5k/tDNa7tK0VxW0VN2QR/loqssEK9e3YorkqzaBBVtAj5N7T9ntxqLR9bBaQ6d4Rlyln6M5GQOhGQcRLTtW0Umv+gEHnaVYYHj3sDgwu84++Nk4i5Ar+P7Vx7U5DUWrolbUvclo41lZFfqg+lIX0GAJPX5BABA2WGnOzabfKBNfNqBLC3YbdxZ2c/aS3GOcQJd9ZSrZVKpUSt5TyXbPOMH/ABCCPxOo/wB3CLj+MjB/5vHnsg/W/wBv+cLfaCn8v/X/ABg1iP4k+LXjIaG15PxpWWS31Uywy18d1WpFP2IHdkMSbQb2xB2ADoE/Hgdd2TVFPTqm01SFqAcJKSl27gdxz0w3iIIpte082alE6UUpPe7t8GGOsb8r3T0uxLnmbLcqhu1Tltsq46qup7fHK9GK1ArI8i/CtINKSEbqWB7gt2Hgdo9a6uzCkpikSVAgFTbtpcEDvblnDtwWaNF1qtNUd1M6oczUkEgPt3YIJ8erFn5y8KfJueei3LOTzZjk1NlcF2qlRameigki+uVUKrOuyvYKANgDehvfjK00usLLTCkp1IKBwCQWfOOO+F9xumlrpONRO3hR5IBDwKxHA/QfNMhocYtt8zGlrblMtPTfm5GjjeVjpU7/AEyASSAN6Gz9/Cqy760oZCqhaZZSkOWyW7yzxppJGlK2cmQhawpRYPgP0dooHGfRTgHGb9RX+O2Xe4S0EyVEUFdX94TIrBlLKqr2AIH6Sep+xBHx5GVfaJfKuSqQVJSFBiQnLHliSW9/PSK+n0Xa6eamaAotlicfIft1he5a9EMf5Gzm5ZrZM7nsDXiZqqrpXtoq0NQ3y7ofqxlQx2xB7fLHRA0BlatdT7dSopZkrftDA7mwOAcHjjuhTeNASrlVrq5M4y95cjbuyeSMjnnvzHEsv9T+H8Du72DLPaG20FyjUNJSnH2kki2Aw7hKg9CQQQG0SCD9j5SUur7jWy/SyKIlPXf8nTmJCu0ra7bN9BVXFKVjkbHI97LLfGNcC4f9ZsWy+05LefZikutPaquKsFHFZZKUyvGwdVZy76XYGwF2RsAg/PmFdfb1VU65EujKSoEPuBZ8cMM9M+ce2+2afpKlE+bcQoJILBBS7ZGXOOuPiIszHvYHhfKrtT2Kw8i2ipr6txHBAZGjaVz8BV7gAsT8AD5P+vObT7JcKZBmzZRCRyf+R1Ol1PaK2aJEioSVHgcP4B2z4R0LxXD2JC5r9KcrzzkS7ZrieWWlKe8zfmZYLkZkeGQqAyqyK/Zdgkf46BC6Otm2teqpdHSpp5qC6cYbPyjkmo+zysudwmVlJOSyy5CnBB94BceTcQhH8P3ln9uUYgf5qar/AMPGPrnS/cV5D94Rey68fiy/NX+kHcD9Dc+tOYWm75Pltgit1BVxVcv9Olnknf6bhuiho0Ck6127fp3vR+3g9XrCTMkKRKQpyCMs2fifKDrZ2Z3GRWS5tVOQEJIJ2lROC7B0pZ+r45Yx/9k=', 'JPEG', data.settings.margin.left, 15, 10, 10)
                // }
                doc.text(headerName, data.settings.margin.left + 15, 22)
                // doc.text(headerName, data.settings.margin.left + 1, 22)

                // Footer
                var str = 'Página ' + doc.internal.getNumberOfPages()
                // Total page number plugin only available in jspdf v1.0+
                if (typeof doc.putTotalPages === 'function') {
                    str = str + ' de ' + totalPagesExp
                }
                doc.setFontSize(10)

                // jsPDF 1.4+ uses getWidth, <1.4 uses .width
                var pageSize = doc.internal.pageSize
                var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
                doc.text(str, data.settings.margin.left, pageHeight - 10)
            },
            margin: { top: 30 },
        });
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp)
        }
        doc.save(fileName)
        self.loaderService.hide();

    }

    private formatValues(headerConfig: any, dataBody: any): any {
        var auxList: { [k: string]: any } = [];

        for (let index = 0; index < dataBody.length; index++) {
            auxList.push({});
        }
        for (let index1 = 0; index1 < headerConfig.length; index1++) {
            const elementHeader = headerConfig[index1];

            for (let index = 0; index < dataBody.length; index++) {

                if (elementHeader.type) {
                    if (elementHeader.type['number']) {

                        var valueAux = this._decimalPipe.transform(dataBody[index][elementHeader.dataKey].toString(), elementHeader.type['number'].format, elementHeader.type['number'].lang);
                        auxList[index][elementHeader.dataKey] = valueAux;

                    } else if (elementHeader.type['date']) {
                        var valueAux = this._datePipe.transform(dataBody[index][elementHeader.dataKey].toString(), elementHeader.type['date'].format);
                        auxList[index][elementHeader.dataKey] = valueAux;
                    }
                } else {

                    auxList[index][elementHeader.dataKey] = dataBody[index][elementHeader.dataKey];
                }

            }
        }

        return auxList;

    }

    private buildColumnsStyles(headerConfig) {

        var auxList: { [k: string]: any } = {};

        for (let index = 0; index < headerConfig.length; index++) {

            auxList[index.toString()] = { halign: headerConfig[index].type ? 'right' : 'left', cellWidth: 'wrap', minCellWidth: 20 };

        }

        return auxList;

    }






    public exportAsExcelFile(json: any[], excelFileName: string): void {

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        console.log('worksheet', worksheet);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }


} */