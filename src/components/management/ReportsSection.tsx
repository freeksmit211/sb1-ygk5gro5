import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, Eye, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

type ReportType = 'sales' | 'fuel' | 'vehicle' | 'sheq';

interface ReportSubtype {
  id: string;
  title: string;
  description: string;
}

interface ReportOption {
  id: ReportType;
  title: string;
  description: string;
  subtypes: ReportSubtype[];
  fields: {
    startDate?: boolean;
    endDate?: boolean;
    salesRep?: boolean;
    vehicle?: boolean;
    company?: boolean;
  };
}

const REPORT_OPTIONS: ReportOption[] = [
  {
    id: 'sales',
    title: 'Sales Performance Report',
    description: 'Detailed sales performance metrics including targets, achievements, and trends',
    subtypes: [
      { id: 'monthly', title: 'Monthly Performance Report', description: 'Monthly sales targets vs achievements' },
      { id: 'ytd', title: 'Year to Date Report', description: 'Cumulative sales performance for the year' },
      { id: 'commission', title: 'Commission Report', description: 'Sales rep commission calculations' },
      { id: 'trends', title: 'Sales Trends Analysis', description: 'Historical sales trends and patterns' }
    ],
    fields: { startDate: true, endDate: true, salesRep: true }
  },
  {
    id: 'fuel',
    title: 'Fuel Usage Report',
    description: 'Comprehensive fuel consumption analysis by vehicle and driver',
    subtypes: [
      { id: 'consumption', title: 'Consumption Analysis', description: 'Detailed fuel usage by vehicle' },
      { id: 'cost', title: 'Cost Analysis', description: 'Fuel expenditure breakdown' },
      { id: 'efficiency', title: 'Efficiency Report', description: 'Fuel efficiency metrics' },
      { id: 'trends', title: 'Usage Trends', description: 'Historical fuel consumption patterns' }
    ],
    fields: { startDate: true, endDate: true, vehicle: true }
  },
  {
    id: 'vehicle',
    title: 'Vehicle Maintenance Report',
    description: 'Vehicle service history, inspections, and upcoming maintenance',
    subtypes: [
      { id: 'service', title: 'Service History', description: 'Complete service records' },
      { id: 'inspection', title: 'Inspection Reports', description: 'Vehicle inspection results' },
      { id: 'maintenance', title: 'Maintenance Schedule', description: 'Upcoming maintenance tasks' },
      { id: 'incidents', title: 'Incident Reports', description: 'Vehicle incidents and damages' }
    ],
    fields: { startDate: true, endDate: true, vehicle: true }
  },
  {
    id: 'sheq',
    title: 'SHEQ Compliance Report',
    description: 'Safety, health, environmental, and quality compliance status',
    subtypes: [
      { id: 'safety', title: 'Safety Compliance', description: 'Safety file status and compliance' },
      { id: 'incidents', title: 'Incident Reports', description: 'Safety incidents and resolutions' },
      { id: 'training', title: 'Training Records', description: 'Staff training and certifications' },
      { id: 'audits', title: 'Audit Reports', description: 'SHEQ audit results and findings' }
    ],
    fields: { startDate: true, endDate: true, company: true }
  }
];

const ReportsSection: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [selectedSubtype, setSelectedSubtype] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [salesRep, setSalesRep] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [company, setCompany] = useState('');
  const [generating, setGenerating] = useState(false);
  const [reportData, setReportData] = useState<any[] | null>(null);

  const generatePDF = () => {
    if (!reportData) return;

    const doc = new jsPDF();
    const reportOption = REPORT_OPTIONS.find(r => r.id === selectedReport);
    const subtype = reportOption?.subtypes.find(s => s.id === selectedSubtype);

    // Add report header
    doc.setFontSize(20);
    doc.text(reportOption?.title || 'Report', 20, 20);
    
    doc.setFontSize(14);
    doc.text(subtype?.title || '', 20, 30);

    // Add parameters
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40);
    if (startDate) doc.text(`Start Date: ${startDate}`, 20, 50);
    if (endDate) doc.text(`End Date: ${endDate}`, 20, 60);
    if (salesRep) doc.text(`Sales Rep: ${salesRep}`, 20, 70);
    if (vehicle) doc.text(`Vehicle: ${vehicle}`, 20, 80);
    if (company) doc.text(`Company: ${company}`, 20, 90);

    // Add table with report data
    const headers = Object.keys(reportData[0]);
    const data = reportData.map(item => Object.values(item));

    (doc as any).autoTable({
      startY: 100,
      head: [headers],
      body: data,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246] }
    });

    // Save the PDF
    doc.save(`${selectedReport}-${selectedSubtype}-report.pdf`);
  };

  const handleGenerateReport = async () => {
    if (!selectedReport || !selectedSubtype) {
      alert('Please select a report type and subtype');
      return;
    }

    try {
      setGenerating(true);
      
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock data based on report type
      let mockData;
      switch (selectedReport) {
        case 'sales':
          mockData = [
            { month: 'January', target: 1000000, achieved: 850000, percentage: '85%' },
            { month: 'February', target: 1000000, achieved: 920000, percentage: '92%' },
            { month: 'March', target: 1000000, achieved: 1100000, percentage: '110%' }
          ];
          break;
        case 'fuel':
          mockData = [
            { vehicle: 'HXJ 207 MP', liters: 150, cost: 3000, efficiency: '10.5 km/l' },
            { vehicle: 'JDT 129 MP', liters: 180, cost: 3600, efficiency: '9.8 km/l' },
            { vehicle: 'JTC 430 MP', liters: 200, cost: 4000, efficiency: '9.2 km/l' }
          ];
          break;
        default:
          mockData = [];
      }

      setReportData(mockData);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const selectedReportOption = REPORT_OPTIONS.find(r => r.id === selectedReport);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Reports</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {REPORT_OPTIONS.map(option => (
          <button
            key={option.id}
            onClick={() => {
              setSelectedReport(option.id);
              setSelectedSubtype('');
            }}
            className={`p-4 rounded-lg border-2 text-left transition-colors ${
              selectedReport === option.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <h3 className="font-semibold text-gray-900 mb-2">{option.title}</h3>
            <p className="text-sm text-gray-600">{option.description}</p>
          </button>
        ))}
      </div>

      {selectedReport && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Report Type
          </label>
          <select
            value={selectedSubtype}
            onChange={(e) => setSelectedSubtype(e.target.value)}
            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select a report type...</option>
            {selectedReportOption?.subtypes.map(subtype => (
              <option key={subtype.id} value={subtype.id}>
                {subtype.title} - {subtype.description}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedReport && selectedSubtype && (
        <div className="bg-gray-50 rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-2 text-gray-700 mb-4">
            <Filter className="w-5 h-5" />
            <h3 className="font-semibold">Report Parameters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedReportOption?.fields.startDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-10 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {selectedReportOption?.fields.endDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {selectedReportOption?.fields.salesRep && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sales Rep
                </label>
                <select
                  value={salesRep}
                  onChange={(e) => setSalesRep(e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">All Sales Reps</option>
                  <option value="franco">Franco</option>
                  <option value="freek">Freek</option>
                  <option value="jeckie">Jeckie</option>
                </select>
              </div>
            )}

            {selectedReportOption?.fields.vehicle && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle
                </label>
                <select
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">All Vehicles</option>
                  <option value="HXJ 207 MP">HXJ 207 MP</option>
                  <option value="JDT 129 MP">JDT 129 MP</option>
                  <option value="JTC 430 MP">JTC 430 MP</option>
                  <option value="JTC 437 MP">JTC 437 MP</option>
                  <option value="JXZ 199 MP">JXZ 199 MP</option>
                  <option value="KPJ 902 MP">KPJ 902 MP</option>
                  <option value="KPN 084 MP">KPN 084 MP</option>
                  <option value="KPN 089 MP">KPN 089 MP</option>
                  <option value="KRM 836 MP">KRM 836 MP</option>
                  <option value="KRP 201 MP">KRP 201 MP</option>
                  <option value="KWR 435 MP">KWR 435 MP</option>
                  <option value="KZJ 664 MP">KZJ 664 MP</option>
                  <option value="KZW 922 MP">KZW 922 MP</option>
                </select>
              </div>
            )}

            {selectedReportOption?.fields.company && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Enter company name"
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleGenerateReport}
              disabled={generating || !selectedSubtype}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Generate Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {reportData && (
        <div className="mt-6 bg-white rounded-lg border p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Report Preview</h3>
            </div>
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Printer className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(reportData[0]).map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td
                        key={i}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsSection;