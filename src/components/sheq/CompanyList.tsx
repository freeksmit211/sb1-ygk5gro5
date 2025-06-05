import React from 'react';
import { Link } from 'react-router-dom';
import { Company } from '../../types/sheq';
import { AlertTriangle, FileText, Calendar, ArrowRight } from 'lucide-react';

interface CompanyListProps {
  companies: Company[];
}

const CompanyList: React.FC<CompanyListProps> = ({ companies }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getExpiryStatus = (expiryDate: string) => {
    const days = Math.ceil(
      (new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (days < 0) return { color: 'bg-red-100 text-red-800', text: 'Expired' };
    if (days <= 30) return { color: 'bg-yellow-100 text-yellow-800', text: `Expires in ${days} days` };
    return { color: 'bg-green-100 text-green-800', text: 'Valid' };
  };

  if (companies.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No companies registered yet</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-6">
      {companies.map(company => {
        const safetyFile = company.documents.find(doc => doc.type === 'safetyFile');
        const status = safetyFile ? getExpiryStatus(safetyFile.expiryDate) : null;

        return (
          <div key={company.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">{company.name}</h3>
                  {safetyFile && (
                    <div className="flex items-center gap-2 mt-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Safety File</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${status?.color}`}>
                        {status?.text}
                      </span>
                    </div>
                  )}
                </div>
                <Link
                  to={`/sheq/company/${company.id}`}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <span className="text-sm font-medium">View Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid gap-3">
                {/* Safety File Section */}
                {safetyFile && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-blue-900">Safety File Details</h4>
                      <a
                        href={safetyFile.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View File
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-800">
                      <Calendar className="w-4 h-4" />
                      <span>Expires: {formatDate(safetyFile.expiryDate)}</span>
                    </div>
                  </div>
                )}

                {/* Other Documents */}
                <div className="grid md:grid-cols-2 gap-3">
                  {company.documents
                    .filter(doc => doc.type !== 'safetyFile')
                    .map(doc => {
                      const docStatus = getExpiryStatus(doc.expiryDate);
                      return (
                        <div key={doc.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              {doc.type === 'medicals' ? 'Medical Records' : 'Induction Documents'}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${docStatus.color}`}>
                              {docStatus.text}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Expires: {formatDate(doc.expiryDate)}
                          </div>
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
                          >
                            View File
                          </a>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CompanyList;