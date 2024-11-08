import { useState } from 'react';
import { 
  Search, Plus, Upload, Filter,
  Mail, Phone, Building, MapPin
} from 'lucide-react';
import { ContactScanner } from './ContactScanner';

export function Contacts() {
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'John Doe',
      company: 'Acme Corp',
      role: 'CEO',
      email: 'john@acme.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      lastContact: '2023-10-15',
      status: 'active'
    },
    // Add more sample contacts...
  ]);

  const [showScanner, setShowScanner] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  const handleScanComplete = (contactData) => {
    setContacts(prev => [...prev, { id: Date.now(), ...contactData }]);
    setShowScanner(false);
  };

  return (
    <div className="h-full flex">
      <div className="w-1/3 border-r border-gray-800">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Contacts</h1>
          
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contacts..."
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowScanner(true)}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400"
              title="Scan Business Card"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400"
              title="Filter"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            {contacts.map(contact => (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`
                  w-full p-4 rounded-lg text-left transition-colors
                  ${selectedContact?.id === contact.id
                    ? 'bg-blue-500/20 hover:bg-blue-500/30'
                    : 'hover:bg-gray-800'}
                `}
              >
                <div className="font-medium text-white mb-1">{contact.name}</div>
                <div className="text-sm text-gray-400">{contact.company}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        {selectedContact ? (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedContact.name}
                </h2>
                <div className="text-gray-400">{selectedContact.role}</div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                  Edit Contact
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <a href={`mailto:${selectedContact.email}`} className="hover:text-blue-400">
                    {selectedContact.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <a href={`tel:${selectedContact.phone}`} className="hover:text-blue-400">
                    {selectedContact.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Building className="w-5 h-5 text-gray-400" />
                  <span>{selectedContact.company}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>{selectedContact.location}</span>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-medium text-white mb-3">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="text-gray-400">Last contacted</div>
                    <div className="text-white">{selectedContact.lastContact}</div>
                  </div>
                  {/* Add more activity items */}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select a contact to view details
          </div>
        )}
      </div>

      {showScanner && (
        <ContactScanner
          onClose={() => setShowScanner(false)}
          onScanComplete={handleScanComplete}
        />
      )}
    </div>
  );
}