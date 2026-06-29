import React, { useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const InvoicePreviewModal = ({ invoice, loading, onClose }) => {
  const printRef = useRef(null);

  const handleDownload = async () => {
    try {
      if (!printRef.current || !invoice) return;

      const element = printRef.current;

      const canvas = await html2canvas(element, {
        scale: 1.2,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollY: -window.scrollY,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.75);
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${invoice?.invoiceNumber || 'invoice'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to download PDF.');
    }
  };

  // const handleDownload = async () => {
  //   try {
  //     if (!invoice) return;

  //     const pdf = new jsPDF('p', 'mm', 'a4');
  //     const margin = 12;
  //     let y = 16;

  //     pdf.setFontSize(16);
  //     pdf.setFont('helvetica', 'bold');
  //     pdf.text('Invoice Preview', margin, y);

  //     y += 8;
  //     pdf.setFontSize(11);
  //     pdf.setFont('helvetica', 'normal');
  //     pdf.text(`Invoice No: ${invoice?.invoiceNumber || '-'}`, margin, y);
  //     y += 6;
  //     pdf.text(`Invoice Date: ${invoice?.date || '-'}`, margin, y);
  //     y += 6;
  //     pdf.text(`Order Ref: ${invoice?.orderRef || '-'}`, margin, y);
  //     y += 6;
  //     pdf.text(`Customer No: ${invoice?.customerNo || '-'}`, margin, y);
  //     y += 6;
  //     pdf.text(`Salesperson Code: ${invoice?.salespersonCode || '-'}`, margin, y);

  //     y += 10;
  //     pdf.setFont('helvetica', 'bold');
  //     pdf.text('Invoice Items', margin, y);
  //     y += 6;

  //     const rows = (invoice?.lines || []).map(line => ([
  //       line?.itemNo || '-',
  //       String(Number(line?.quantity || 0)),
  //       `₹${Number(line?.unitCost || 0).toFixed(2)}`,
  //       line?.description || '-',
  //       line?.gstGroupCode || '-',
  //       line?.hsnSACCode || '-',
  //       `₹${Number(line?.amount || 0).toFixed(2)}`
  //     ]));

  //     autoTable(pdf, {
  //       startY: y,
  //      head: [['Item Code', 'Item Description', 'Qty', 'Rate', 'GST Code', 'HSN', 'Amount']],
  //       body: rows,
  //       styles: {
  //         fontSize: 8,
  //         cellPadding: 2,
  //         overflow: 'linebreak'
  //       },
  //       headStyles: {
  //         fillColor: [240, 240, 240],
  //         textColor: 20,
  //         fontStyle: 'bold'
  //       },
  //       margin: { left: margin, right: margin },
  //       theme: 'grid',
  //       columnStyles: {
  //         0: { cellWidth: 22 },
  //         1: { cellWidth: 14, halign: 'right' },
  //         2: { cellWidth: 22, halign: 'right' },
  //         3: { cellWidth: 55 },
  //         4: { cellWidth: 24 },
  //         5: { cellWidth: 20, halign: 'center' },
  //         6: { cellWidth: 25, halign: 'right' }
  //       }
  //     });

  //     const finalY = (pdf.lastAutoTable?.finalY || y) + 10;

  //     pdf.setFont('helvetica', 'bold');
  //     pdf.text(
  //       `Line Total: ₹${Number(
  //         (invoice?.lines || []).reduce((sum, line) => sum + Number(line?.amount || 0), 0)
  //       ).toFixed(2)}`,
  //       margin,
  //       finalY
  //     );

  //     pdf.text(
  //       `Invoice Amount: ₹${Number(invoice?.amount || 0).toFixed(2)}`,
  //       margin,
  //       finalY + 7
  //     );

  //     pdf.save(`${invoice?.invoiceNumber || 'invoice'}.pdf`);
  //   } catch (error) {
  //     console.error('Error generating PDF:', error);
  //     alert('Failed to download PDF.');
  //   }
  // };



  const lineTotal = (invoice?.lines || []).reduce(
    (sum, line) => sum + Number(line?.amount || 0),
    0
  );


  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card rounded-xl shadow-warm-xl w-full max-w-7xl max-h-[90vh] overflow-hidden animate-slide-in">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-lg md:text-xl text-foreground">
                Invoice Preview
              </h2>
              <p className="font-caption text-sm text-muted-foreground">
                {loading ? 'Loading...' : invoice?.invoiceNumber || '-'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-smooth"
          >
            <Icon name="X" size={20} color="var(--color-foreground)" />
          </button>
        </div>

        <div className="p-4 md:p-6 overflow-y-auto scrollbar-custom max-h-[calc(90vh-180px)]">
          <div ref={printRef} className="bg-white text-black p-4">
            {loading ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <div className="text-center">
                  <Icon name="Loader2" size={40} className="animate-spin text-primary mx-auto mb-4" />
                  <p className="font-caption text-sm text-muted-foreground">
                    Loading invoice details...
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-muted/30 rounded-lg p-4 md:p-6 mb-6">
                  <div className="flex items-start justify-between mb-6">
                    {/* <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Utensils" size={32} color="var(--color-primary)" />
                      <span className="font-heading font-bold text-2xl text-primary">Veeba Foods</span>
                    </div>
                    <p className="font-caption text-sm text-muted-foreground max-w-xs whitespace-pre-line">
                      Plot No. 92, Sector 3, IMT Manesar
                      {'\n'}Gurugram, Haryana - 122050
                      {'\n'}GSTIN: 06AABCV1234F1Z5
                    </p>
                  </div> */}
                    <div className="text-right">
                      <h3 className="font-heading font-bold text-2xl text-foreground mb-1">
                        {invoice?.type === 'credit_note' ? 'CREDIT NOTE' : 'INVOICE'}
                      </h3>
                      {/* <p className="font-caption text-sm text-muted-foreground">
                      Original for Recipient
                    </p> */}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <h4 className="font-caption font-semibold text-sm text-foreground mb-2">
                        Bill To:
                      </h4>
                      <div className="space-y-1">
                        <p className="font-caption text-sm text-muted-foreground">
                          Customer No: {invoice?.customerNo || '-'}
                        </p>
                        <p className="font-caption text-sm text-muted-foreground">
                          Salesperson Code: {invoice?.salespersonCode || '-'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-caption text-sm text-muted-foreground">Invoice No:</span>
                        <span className="font-data font-semibold text-sm text-foreground">
                          {invoice?.invoiceNumber || '-'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-caption text-sm text-muted-foreground">Invoice Date:</span>
                        <span className="font-caption text-sm text-foreground">
                          {invoice?.date || '-'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-caption text-sm text-muted-foreground">Order Ref:</span>
                        <span className="font-caption text-sm text-foreground">
                          {invoice?.orderRef || '-'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-caption text-sm text-muted-foreground">LR / RR No:</span>
                        <span className="font-caption text-sm text-foreground">
                          {invoice?.lrRRNo || '-'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-caption text-sm text-muted-foreground">Transporter:</span>
                        <span className="font-caption text-sm text-foreground">
                          {invoice?.transporterVendorNo || '-'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-caption text-sm text-muted-foreground">Driver Mobile:</span>
                        <span className="font-caption text-sm text-foreground">
                          {invoice?.driverMobNo || '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-heading font-semibold text-base text-foreground mb-4">
                    Invoice Items
                  </h4>
                  <div className="overflow-x-auto scrollbar-custom">
                    <table className="w-full">
                      <thead className="bg-muted/50 border-y border-border">
                        <tr>
                          <th className="px-4 py-3 text-left font-caption font-semibold text-sm text-foreground">
                            Item Code
                          </th>
                          <th className="px-4 py-3 text-left font-caption font-semibold text-sm text-foreground">
                            Item Description
                          </th>
                          <th className="px-4 py-3 text-right font-caption font-semibold text-sm text-foreground">
                            Qty
                          </th>
                          <th className="px-4 py-3 text-right font-caption font-semibold text-sm text-foreground">
                            Rate
                          </th>
                          <th className="px-4 py-3 text-left font-caption font-semibold text-sm text-foreground">
                            GST Code
                          </th>
                          <th className="px-4 py-3 text-center font-caption font-semibold text-sm text-foreground">
                            HSN
                          </th>
                          <th className="px-4 py-3 text-right font-caption font-semibold text-sm text-foreground">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {invoice?.lines?.length > 0 ? (
                          invoice.lines.map((line, index) => (
                            <tr key={line?.lineNo || index}>
                              <td className="px-4 py-3 font-data text-sm text-foreground">
                                {line?.itemNo || '-'}
                              </td>
                              <td className="px-4 py-3 font-caption text-sm text-foreground">
                                {line?.description || '-'}
                              </td>
                              <td className="px-4 py-3 text-right font-data text-sm text-foreground">
                                {Number(line?.quantity || 0).toLocaleString('en-IN')}
                              </td>
                              <td className="px-4 py-3 text-right font-data text-sm text-foreground">
                                ₹{Number(line?.unitCost || 0).toLocaleString('en-IN', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })}
                              </td>
                              <td className="px-4 py-3 font-data text-sm text-foreground">
                                {line?.gstGroupCode || '-'}
                              </td>
                              <td className="px-4 py-3 text-center font-data text-sm text-muted-foreground">
                                {line?.hsnSACCode || '-'}
                              </td>
                              <td className="px-4 py-3 text-right font-data font-semibold text-sm text-foreground">
                                ₹{Number(line?.amount || 0).toLocaleString('en-IN', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={7}
                              className="px-4 py-6 text-center font-caption text-sm text-muted-foreground"
                            >
                              No line items found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 md:p-6">
                  <div className="space-y-3 max-w-md ml-auto">
                    <div className="flex items-center justify-between">
                      <span className="font-caption text-sm text-muted-foreground">Line Total:</span>
                      <span className="font-data font-semibold text-sm text-foreground">
                        ₹{lineTotal.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </div>
                    <div className="border-t border-border pt-3 flex items-center justify-between">
                      <span className="font-heading font-semibold text-base text-foreground">
                        Invoice Amount:
                      </span>
                      <span className="font-data font-bold text-xl text-primary">
                        ₹{Number(invoice?.amount || 0).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                <h4 className="font-caption font-semibold text-sm text-foreground mb-2">
                  Terms &amp; Conditions:
                </h4>
                <ul className="space-y-1 font-caption text-xs text-muted-foreground">
                  <li>• Payment due within 15 days from invoice date</li>
                  <li>• Interest @18% p.a. will be charged on delayed payments</li>
                  <li>• All disputes subject to Gurugram jurisdiction</li>
                  <li>• Goods once sold will not be taken back</li>
                </ul>
              </div> */}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 md:p-6 border-t border-border">
          <Button
            variant="outline"
            iconName="X"
            iconPosition="left"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            variant="default"
            iconName="Download"
            iconPosition="left"
            onClick={handleDownload}
            disabled={loading || !invoice}
          >
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );

};

export default InvoicePreviewModal;