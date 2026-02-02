import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Edit2, Phone, Mail, MapPin } from 'lucide-react';
import { contactsAPI } from '../lib/api';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const response = await contactsAPI.getContacts();
      setContacts(response.data);
    } catch (error) {
      toast.error('Failed to load contacts');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    try {
      if (editingContact) {
        await contactsAPI.updateContact(editingContact.id, { ...form, id: editingContact.id, avatar_seed: editingContact.avatar_seed });
        toast.success('Contact updated!');
      } else {
        await contactsAPI.createContact(form);
        toast.success('Contact added!');
      }
      
      setDialogOpen(false);
      resetForm();
      loadContacts();
    } catch (error) {
      toast.error('Failed to save contact');
    }
  };

  const handleDelete = async (id) => {
    try {
      await contactsAPI.deleteContact(id);
      loadContacts();
      toast.success('Contact deleted');
    } catch (error) {
      toast.error('Failed to delete contact');
    }
  };

  const resetForm = () => {
    setEditingContact(null);
    setForm({ name: '', relationship: '', phone: '', email: '', address: '', notes: '' });
  };

  const openEditDialog = (contact) => {
    setEditingContact(contact);
    setForm({
      name: contact.name,
      relationship: contact.relationship || '',
      phone: contact.phone || '',
      email: contact.email || '',
      address: contact.address || '',
      notes: contact.notes || ''
    });
    setDialogOpen(true);
  };

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.relationship?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group contacts alphabetically
  const groupedContacts = filteredContacts.reduce((acc, contact) => {
    const letter = contact.name.charAt(0).toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(contact);
    return acc;
  }, {});

  return (
    <div className="space-y-6" data-testid="contacts-page">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-navy flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-400" />
            Contact Book
          </h1>
          <p className="text-navy-light mt-1">{contacts.length} contacts</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="btn-primary" data-testid="add-contact-btn">
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-warm-white border-sunny/50">
            <DialogHeader>
              <DialogTitle className="font-heading text-navy">
                {editingContact ? 'Edit Contact' : 'New Contact'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Name</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Full name"
                    className="input-cozy"
                    data-testid="contact-name-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Relationship</label>
                  <Input
                    value={form.relationship}
                    onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                    placeholder="e.g., Doctor, Teacher"
                    className="input-cozy"
                    data-testid="contact-relationship-input"
                  />
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Phone</label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Phone number"
                    className="input-cozy"
                    data-testid="contact-phone-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Email</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Email address"
                    className="input-cozy"
                    data-testid="contact-email-input"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Address</label>
                <Input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Full address"
                  className="input-cozy"
                  data-testid="contact-address-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Notes</label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any additional notes"
                  className="input-cozy"
                  data-testid="contact-notes-input"
                />
              </div>
              
              <div className="flex gap-3">
                <Button type="submit" className="btn-primary flex-1" data-testid="save-contact-btn">
                  {editingContact ? 'Update' : 'Save'} Contact
                </Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="border-sunny">
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search contacts..."
        className="input-cozy max-w-md"
        data-testid="contact-search"
      />

      {/* Contacts list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner" />
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="card-cozy text-center py-12">
          <Users className="w-16 h-16 text-sunny mx-auto mb-4" />
          <h3 className="text-xl font-heading font-bold text-navy mb-2">
            {searchTerm ? 'No contacts found' : 'No contacts yet'}
          </h3>
          <p className="text-navy-light font-handwritten text-lg">
            {searchTerm ? 'Try a different search' : 'Add important contacts for your family!'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedContacts)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([letter, letterContacts]) => (
              <div key={letter}>
                <h2 className="font-heading font-bold text-terracotta mb-3 text-lg">{letter}</h2>
                <div className="space-y-2">
                  {letterContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="card-cozy flex items-center gap-4 group"
                      data-testid={`contact-${contact.id}`}
                    >
                      <Avatar className="w-12 h-12 border-2 border-sunny">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.avatar_seed}`} />
                        <AvatarFallback className="bg-indigo-100 text-indigo-600">
                          {contact.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-navy">{contact.name}</h3>
                        {contact.relationship && (
                          <p className="text-sm text-terracotta">{contact.relationship}</p>
                        )}
                        <div className="flex flex-wrap gap-3 mt-1 text-sm text-navy-light">
                          {contact.phone && (
                            <a href={`tel:${contact.phone}`} className="flex items-center gap-1 hover:text-sage">
                              <Phone className="w-3 h-3" />
                              {contact.phone}
                            </a>
                          )}
                          {contact.email && (
                            <a href={`mailto:${contact.email}`} className="flex items-center gap-1 hover:text-sage">
                              <Mail className="w-3 h-3" />
                              {contact.email}
                            </a>
                          )}
                        </div>
                        {contact.address && (
                          <p className="text-sm text-navy-light flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {contact.address}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(contact)}
                          className="h-8 w-8 text-sage hover:bg-sage/10"
                          data-testid={`edit-contact-${contact.id}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(contact.id)}
                          className="h-8 w-8 text-red-500 hover:bg-red-50"
                          data-testid={`delete-contact-${contact.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ContactsPage;
