
import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Search } from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HelpFAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const generalFaqs = [
    {
      question: "How do I track my order status?",
      answer: "You can track your order status by going to the Orders section and clicking on the specific order. You'll see real-time updates on the order's current status and location."
    },
    {
      question: "How do I update my inventory?",
      answer: "To update your inventory, navigate to the Inventory section, select the product you want to update, and click 'Edit'. From there, you can update stock levels, prices, and other product details."
    },
    {
      question: "How can I view my sales reports?",
      answer: "Sales reports are available in the Analytics section. You can view daily, weekly, or monthly reports, and filter by product category, sales channel, or date range."
    },
    {
      question: "How do I set up notifications?",
      answer: "Go to the Settings page and select the 'Notifications' tab. From there, you can customize which notifications you receive and how you receive them (email, SMS, or app notifications)."
    }
  ];
  
  const accountFaqs = [
    {
      question: "How do I change my password?",
      answer: "To change your password, go to Settings > Account > Security, and select 'Change Password'. You'll need to enter your current password and then your new password twice."
    },
    {
      question: "How can I update my business profile?",
      answer: "Your business profile can be updated in the Business Hub section. Click on 'Edit Profile' to update your business information, contact details, and store hours."
    },
    {
      question: "Can I have multiple users for my account?",
      answer: "Yes, you can add team members with different access levels. Go to Settings > Team Members to invite new users and set their permissions."
    }
  ];
  
  const billingFaqs = [
    {
      question: "How do I view my subscription details?",
      answer: "Your subscription details can be found in Settings > Billing. This shows your current plan, billing cycle, and payment history."
    },
    {
      question: "How do I update my payment method?",
      answer: "To update your payment method, go to Settings > Billing > Payment Methods and select 'Add Payment Method' or edit an existing one."
    },
    {
      question: "Can I get an invoice for my subscription?",
      answer: "Yes, all invoices are available in Settings > Billing > Invoice History. You can download or print any invoice from there."
    }
  ];

  const filteredGeneralFaqs = generalFaqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredAccountFaqs = accountFaqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredBillingFaqs = billingFaqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="h-6 w-6 text-brand" />
        <h1 className="text-3xl font-bold">Help & FAQs</h1>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input 
          placeholder="Search for help..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Need more help?</CardTitle>
          <CardDescription>
            Our support team is available to assist you with any questions or issues.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1">
            <HelpCircle className="mr-2 h-4 w-4" />
            Contact Support
          </Button>
          <Button variant="outline" className="flex-1">
            Watch Tutorial
          </Button>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-4">
          <Accordion type="single" collapsible className="w-full">
            {filteredGeneralFaqs.length > 0 ? (
              filteredGeneralFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))
            ) : (
              <p className="text-center py-4 text-muted-foreground">
                No FAQs found matching your search.
              </p>
            )}
          </Accordion>
        </TabsContent>
        
        <TabsContent value="account" className="mt-4">
          <Accordion type="single" collapsible className="w-full">
            {filteredAccountFaqs.length > 0 ? (
              filteredAccountFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))
            ) : (
              <p className="text-center py-4 text-muted-foreground">
                No FAQs found matching your search.
              </p>
            )}
          </Accordion>
        </TabsContent>
        
        <TabsContent value="billing" className="mt-4">
          <Accordion type="single" collapsible className="w-full">
            {filteredBillingFaqs.length > 0 ? (
              filteredBillingFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))
            ) : (
              <p className="text-center py-4 text-muted-foreground">
                No FAQs found matching your search.
              </p>
            )}
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpFAQ;
