import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Phone, Plus, Trash2, MessageSquare, User, AlertCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isActive: boolean;
}

export const EmergencyContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: "1", name: "Dr. Sarah Johnson", phone: "+1 (555) 123-4567", relationship: "Primary Doctor", isActive: true },
    { id: "2", name: "Mary Smith", phone: "+1 (555) 987-6543", relationship: "Daughter", isActive: true },
    { id: "3", name: "Home Care Service", phone: "+1 (555) 456-7890", relationship: "Caretaker", isActive: true },
  ]);

  const [newContact, setNewContact] = useState({ name: "", phone: "", relationship: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addContact = () => {
    if (newContact.name && newContact.phone && newContact.relationship) {
      const contact: Contact = {
        id: Date.now().toString(),
        ...newContact,
        isActive: true,
      };
      setContacts(prev => [...prev, contact]);
      setNewContact({ name: "", phone: "", relationship: "" });
      setIsDialogOpen(false);
      toast({ title: "Contact Added", description: `${newContact.name} has been added to emergency contacts.` });
    }
  };

  const removeContact = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    setContacts(prev => prev.filter(c => c.id !== id));
    toast({ title: "Contact Removed", description: `${contact?.name} has been removed.`, variant: "destructive" });
  };

  const toggleContact = (id: string) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const testWhatsAppAlert = () => {
    toast({
      title: "Backend Required",
      description: "Connect to Lovable Cloud to enable WhatsApp alerts via Twilio or Meta Cloud API.",
      variant: "default",
    });
  };

  const getRelationshipIcon = (relationship: string) => {
    if (relationship.toLowerCase().includes("doctor")) return "🩺";
    if (relationship.toLowerCase().includes("daughter") || relationship.toLowerCase().includes("son") || relationship.toLowerCase().includes("family")) return "👨‍👩‍👧";
    if (relationship.toLowerCase().includes("caretaker") || relationship.toLowerCase().includes("care")) return "🏥";
    return "👤";
  };

  return (
    <Card className="border-0 shadow-large bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-lg font-display">Emergency Contacts</span>
              <p className="text-xs text-muted-foreground font-normal">{contacts.filter(c => c.isActive).length} active</p>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 bg-gradient-medical text-primary-foreground shadow-glow hover:shadow-large">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 font-display">
                  <User className="w-5 h-5 text-primary" />
                  Add Emergency Contact
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newContact.name}
                    onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter contact name"
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newContact.phone}
                    onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input
                    id="relationship"
                    value={newContact.relationship}
                    onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                    placeholder="e.g., Doctor, Family, Caretaker"
                    className="bg-muted/50"
                  />
                </div>
                <Button onClick={addContact} className="w-full bg-gradient-medical text-primary-foreground">
                  Add Contact
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <ScrollArea className="h-52">
          {contacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="p-4 rounded-full bg-muted/50 mb-3">
                <Phone className="w-6 h-6 text-muted-foreground/50" />
              </div>
              <p className="font-medium text-foreground text-sm">No emergency contacts</p>
              <p className="text-xs text-muted-foreground mt-1">Add contacts to receive alerts</p>
            </div>
          ) : (
            <div className="space-y-2">
              {contacts.map((contact) => (
                <div 
                  key={contact.id}
                  className={cn(
                    "p-3 rounded-xl border transition-all",
                    contact.isActive 
                      ? "bg-card border-border hover:border-primary/30" 
                      : "bg-muted/50 border-border/50 opacity-60"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-xl">{getRelationshipIcon(contact.relationship)}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{contact.name}</span>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-[10px] px-1.5 py-0",
                              contact.isActive ? "bg-success/10 text-success border-success/30" : "bg-muted text-muted-foreground"
                            )}
                          >
                            {contact.isActive ? "Active" : "Paused"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{contact.phone}</p>
                        <p className="text-[10px] text-muted-foreground/70">{contact.relationship}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleContact(contact.id)}
                        className="h-7 w-7"
                      >
                        {contact.isActive ? "⏸️" : "▶️"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeContact(contact.id)}
                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="pt-3 border-t space-y-3">
          <Button 
            onClick={testWhatsAppAlert}
            variant="outline"
            className="w-full gap-2"
          >
            <Send className="w-4 h-4" />
            Test WhatsApp Alert
          </Button>
          
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-dashed">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-0.5">Backend Required</p>
              <p>Connect to Lovable Cloud for WhatsApp alerts via Twilio or Meta Cloud API.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
