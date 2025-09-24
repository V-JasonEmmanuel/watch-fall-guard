import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Phone, Plus, Trash2, MessageSquare } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isActive: boolean;
}

export const EmergencyContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      phone: "+1 (555) 123-4567",
      relationship: "Primary Doctor",
      isActive: true,
    },
    {
      id: "2", 
      name: "Mary Smith",
      phone: "+1 (555) 987-6543",
      relationship: "Daughter",
      isActive: true,
    },
    {
      id: "3",
      name: "Home Care Service",
      phone: "+1 (555) 456-7890", 
      relationship: "Caretaker",
      isActive: true,
    },
  ]);

  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    relationship: "",
  });

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
    }
  };

  const removeContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
  };

  const toggleContact = (id: string) => {
    setContacts(prev => 
      prev.map(contact => 
        contact.id === id ? { ...contact, isActive: !contact.isActive } : contact
      )
    );
  };

  const testWhatsAppAlert = () => {
    // This would normally send actual WhatsApp messages
    alert("🚧 WhatsApp integration requires backend setup. Connect Supabase to enable real alerts!");
  };

  return (
    <Card className="shadow-medical">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-medical-blue-dark" />
            Emergency Contacts
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Emergency Contact</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newContact.name}
                    onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter contact name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newContact.phone}
                    onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input
                    id="relationship"
                    value={newContact.relationship}
                    onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                    placeholder="e.g., Doctor, Family, Caretaker"
                  />
                </div>
                <Button onClick={addContact} className="w-full">
                  Add Contact
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 mb-4">
          {contacts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Phone className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No emergency contacts</p>
              <p className="text-xs mt-1">Add contacts to receive fall alerts</p>
            </div>
          ) : (
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div 
                  key={contact.id}
                  className="p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{contact.name}</span>
                        <Badge 
                          variant={contact.isActive ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {contact.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{contact.phone}</p>
                      <p className="text-xs text-muted-foreground">{contact.relationship}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleContact(contact.id)}
                        className="h-8 w-8 p-0"
                      >
                        {contact.isActive ? "⏸️" : "▶️"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContact(contact.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="pt-4 border-t border-border space-y-3">
          <Button 
            onClick={testWhatsAppAlert}
            className="w-full gap-2"
            variant="outline"
          >
            <MessageSquare className="w-4 h-4" />
            Test WhatsApp Alert
          </Button>
          
          <div className="text-xs text-muted-foreground">
            <p>⚠️ WhatsApp integration requires backend setup</p>
            <p>Connect Supabase to enable real-time alerts</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};