import { useState, useEffect } from 'react';
import { 
  Search, Plus, Filter, Building2, Globe,
  Users, DollarSign, MapPin, Trash2, Edit
} from 'lucide-react';
import { useSalesFlowStore } from '../stores/salesflowStore';
import { ClientForm } from './ClientForm';
import toast from 'react-hot-toast';

export function Clients() {
  const { clients, loadClients, deleteClient } = useSalesFlowStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      await deleteClient(id);
      toast.success('Client deleted successfully');
    }
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex">
      <div className="w-1/3 border-r border-gray-800">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Clients</h1>
          
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clients..."
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => {
                setSelectedClient(null);
                setShowForm(true);
              }}
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
              title="Add Client"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400"
              title="Filter"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            {filteredClients.map(client => (
              <button
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className={`
                  w-full p-4 rounded-lg text-left transition-colors
                  ${selectedClient?.id === client.id
                    ? 'bg-blue-500/20 hover:bg-blue-500/30'
                    : 'hover:bg-gray-800'}
                `}
              >
                <div className="font-medium text-white mb-1">{client.name}</div>
                <div className="text-sm text-gray-400">{client.industry}</div>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {client.employeeCount || 'N/A'}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {client.annualRevenue ? `$${client.annualRevenue.toLocaleString()}` : 'N/A'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        {selectedClient ? (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedClient.name}
                </h2>
                <div className="text-gray-400">{selectedClient.industry}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(selectedClient.id)}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <a 
                    href={selectedClient.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-blue-400"
                  >
                    {selectedClient.website}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <span>{selectedClient.employeeCount} employees</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <span>${selectedClient.annualRevenue?.toLocaleString()} annual revenue</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>
                    {selectedClient.address.street}, {selectedClient.address.city},{' '}
                    {selectedClient.address.state} {selectedClient.address.zip},{' '}
                    {selectedClient.address.country}
                  </span>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-medium text-white mb-3">Notes</h3>
                <p className="text-gray-400 text-sm whitespace-pre-wrap">
                  {selectedClient.notes || 'No notes available.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-medium text-white mb-3">Related Contacts</h3>
                {/* Add related contacts list here */}
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-medium text-white mb-3">Active Opportunities</h3>
                {/* Add related opportunities list here */}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select a client to view details
          </div>
        )}
      </div>

      {showForm && (
        <ClientForm
          client={selectedClient}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            loadClients();
          }}
        />
      )}
    </div>
  );
}