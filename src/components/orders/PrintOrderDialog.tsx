import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Order } from "@/lib/data";

interface PrintOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export function PrintOrderDialog({
  isOpen,
  onClose,
  order,
}: PrintOrderDialogProps) {
  const [includePrices, setIncludePrices] = useState(true);
  const [includeCustomerDetails, setIncludeCustomerDetails] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const printFrameRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  const handlePrint = () => {
    if (!order) return;

    if (printFrameRef.current) {
      try {
        const iframe = printFrameRef.current;
        const iframeDoc =
          iframe.contentDocument || iframe.contentWindow?.document;

        if (iframeDoc) {
          iframeDoc.open();
          iframeDoc.write(`
            <html>
              <head>
                <title>Order #${order.id} - Print</title>
                <style>
                  body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; }
                  h1 { font-size: 24px; }
                  h2 { font-size: 18px; margin-top: 20px; }
                  table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                  th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                  th { background-color: #f3f4f6; }
                  .footer { margin-top: 40px; font-size: 14px; color: #666; text-align: center; }
                  @media print {
                    body { padding: 0; }
                    button { display: none; }
                  }
                </style>
              </head>
              <body>
                <h1>Order #${order.id}</h1>
                <div>Date: ${new Date(order.date).toLocaleDateString()}</div>
                <div>Status: ${order.status}</div>
                
                ${
                  includeCustomerDetails
                    ? `
                <h2>Customer Information</h2>
                <div>Name: ${order.customerName}</div>
                <div>Shipping Method: ${order.shippingMethod}</div>
                `
                    : ""
                }
                
                <h2>Order Items</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      ${includePrices ? "<th>Price</th><th>Total</th>" : ""}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Sample Item 1</td>
                      <td>1</td>
                      ${
                        includePrices
                          ? `<td>GHS ${(order.total * 0.6).toFixed(
                              2
                            )}</td><td>GHS ${(order.total * 0.6).toFixed(
                              2
                            )}</td>`
                          : ""
                      }
                    </tr>
                    <tr>
                      <td>Sample Item 2</td>
                      <td>2</td>
                      ${
                        includePrices
                          ? `<td>GHS ${(order.total * 0.2).toFixed(
                              2
                            )}</td><td>GHS ${(order.total * 0.4).toFixed(
                              2
                            )}</td>`
                          : ""
                      }
                    </tr>
                  </tbody>
                </table>
                
                ${
                  includePrices
                    ? `
                <h2>Order Summary</h2>
                <table>
                  <tr>
                    <td>Subtotal</td>
                    <td>GHS ${(order.total * 0.85).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Shipping</td>
                    <td>GHS ${(order.total * 0.1).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Tax</td>
                    <td>GHS ${(order.total * 0.05).toFixed(2)}</td>
                  </tr>
                  <tr style="font-weight: bold;">
                    <td>Total</td>
                    <td>GHS ${order.total.toFixed(2)}</td>
                  </tr>
                </table>
                `
                    : ""
                }
                
                ${
                  includeNotes
                    ? `
                <h2>Notes</h2>
                <p>Thank you for your order! If you have any questions, please contact us.</p>
                `
                    : ""
                }
                
                <div class="footer">
                  <p>Printed on ${new Date().toLocaleString()}</p>
                </div>
                
                <script>
                  window.onload = function() {
                    window.print();
                  }
                </script>
              </body>
            </html>
          `);
          iframeDoc.close();

          // Wait for iframe content to load before printing
          setTimeout(() => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
          }, 500);

          toast({
            title: "Printing Order",
            description: "Your order is being sent to the printer.",
          });

          onClose();
        }
      } catch (error) {
        console.error("Printing error:", error);
        toast({
          title: "Printing failed",
          description: "There was a problem sending the order to your printer.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Print Order #{order?.id}</DialogTitle>
          <DialogDescription>
            Choose what information to include in the printed order.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-prices"
              checked={includePrices}
              onCheckedChange={(checked) => setIncludePrices(checked === true)}
            />
            <Label htmlFor="include-prices">Include prices</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-customer"
              checked={includeCustomerDetails}
              onCheckedChange={(checked) =>
                setIncludeCustomerDetails(checked === true)
              }
            />
            <Label htmlFor="include-customer">Include customer details</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-notes"
              checked={includeNotes}
              onCheckedChange={(checked) => setIncludeNotes(checked === true)}
            />
            <Label htmlFor="include-notes">Include notes</Label>
          </div>
        </div>

        <iframe ref={printFrameRef} style={{ display: "none" }} />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handlePrint}>Print</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
