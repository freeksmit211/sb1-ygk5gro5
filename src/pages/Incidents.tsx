import React, { useState, useEffect } from 'react';
import { ArrowLeft, AlertTriangle, Plus, Download, Eye, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import IncidentForm from '../components/sheq/IncidentForm';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Incident {
  id: string;
  date: string;
  location: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'investigating' | 'closed';
  photos: string[];
  created_at: string;
  updated_at: string;
}

const Incidents: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const sheqSections = [
    {
      id: 'safety-files',
      title: 'Safety Files',
      icon: AlertTriangle,
      description: 'Manage company safety files and documentation',
      href: '/sheq',
      active: false
    },
    {
      id: 'incidents',
      title: 'Incidents',
      icon: AlertTriangle,
      description: 'Report and track safety incidents',
      href: '/sheq/incidents',
      active: true
    },
    {
      id: 'contractor-packs',
      title: 'Contractor Packs',
      icon: AlertTriangle,
      description: 'Manage contractor safety documentation',
      href: '/sheq/contractor-packs',
      active: false
    }
  ];

  const loadIncidents = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('sheq_incidents')
        .select('*')
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;
      setIncidents(data || []);
    } catch (error: any) {
      console.error('Error loading incidents:', error);
      setError('Failed to load incidents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const getSeverityColor = (severity: Incident['severity']) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Incident['status']) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'investigating':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generatePDF = (incident: Incident) => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text('SHEQ Incident Report', 20, 20);
    
    // Add incident details
    doc.setFontSize(12);
    const details = [
      ['Date:', formatDate(incident.date)],
      ['Location:', incident.location],
      ['Severity:', incident.severity.toUpperCase()],
      ['Status:', incident.status.toUpperCase()],
      ['Description:', incident.description]
    ];

    (doc as any).autoTable({
      startY: 30,
      body: details,
      theme: 'plain',
      styles: { fontSize: 12 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 40 },
        1: { cellWidth: 150 }
      }
    });

    // Add photos section if there are any
    if (incident.photos && incident.photos.length > 0) {
      doc.text('Photos:', 20, (doc as any).lastAutoTable.finalY + 10);
      incident.photos.forEach((photo, index) => {
        doc.setTextColor(0, 0, 255);
        doc.setFontSize(8);
        doc.textWithLink(
          `Photo ${index + 1}`,
          20,
          (doc as any).lastAutoTable.finalY + 20 + (index * 10),
          { url: photo }
        );
      });
    }

    // Save the PDF
    doc.save(`incident-report-${formatDate(incident.date)}.pdf`);
  };

  if (loading && retryCount === 0) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* SHEQ Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sheqSections.map((section) => (
          <Link 
            key={section.id}
            to={section.href}
            className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
              section.active 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-900 hover:bg-gray-50'
            }`}
          >
            <section.icon className={`w-5 h-5 ${section.active ? 'text-white' : 'text-blue-600'}`} />
            <div>
              <span className="font-medium">{section.title}</span>
              <p className="text-sm opacity-75 mt-1">{section.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">SHEQ Incidents</h2>
          </div>
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Report Incident
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">{error}</div>
            <button
              onClick={handleRetry}
              className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Retry
            </button>
          </div>
        )}

        {isFormVisible && (
          <IncidentForm onSubmit={() => {
            loadIncidents();
            setIsFormVisible(false);
          }} />
        )}

        <div className="bg-white rounded-lg overflow-hidden">
          {incidents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {incidents.map((incident) => (
                    <tr key={incident.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(incident.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {incident.location}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <p className="line-clamp-2">{incident.description}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(incident.severity)}`}>
                          {incident.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(incident.status)}`}>
                          {incident.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-4">
                          <button
                            onClick={() => setSelectedIncident(incident)}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => generatePDF(incident)}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No incidents reported yet</p>
            </div>
          )}
        </div>
      </div>

      {/* View Incident Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="px-6 py-4 bg-blue-600 flex justify-between items-center rounded-t-lg">
              <h3 className="text-xl font-bold text-white">Incident Details</h3>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-white hover:text-blue-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Date</label>
                  <p className="mt-1 text-lg text-gray-900">{formatDate(selectedIncident.date)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Location</label>
                  <p className="mt-1 text-lg text-gray-900">{selectedIncident.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Severity</label>
                  <span className={`mt-1 inline-block px-2 py-1 text-sm font-medium rounded-full ${getSeverityColor(selectedIncident.severity)}`}>
                    {selectedIncident.severity}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Status</label>
                  <span className={`mt-1 inline-block px-2 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedIncident.status)}`}>
                    {selectedIncident.status}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-500">Description</label>
                <p className="mt-1 text-gray-900 whitespace-pre-wrap">{selectedIncident.description}</p>
              </div>

              {selectedIncident.photos.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Photos</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedIncident.photos.map((photo, index) => (
                      <a
                        key={index}
                        href={photo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                      >
                        <img
                          src={photo}
                          alt={`Incident photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => generatePDF(selectedIncident)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Incidents;