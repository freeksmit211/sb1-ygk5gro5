import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FuelEntry } from '../types/fuel';
import { VehicleInspection } from '../types/vehicleInspection';
import { VehicleIncident } from '../types/vehicleIncident';

export const generateFuelEntryPDF = (entry: FuelEntry) => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text('Fuel Entry Form', 20, 20);
  
  // Add form details
  doc.setFontSize(12);
  const details = [
    ['Date:', new Date(entry.date).toLocaleDateString()],
    ['Slip Number:', entry.slipNumber],
    ['Vehicle:', entry.vehicle],
    ['Driver:', entry.driver],
    ['Odometer:', entry.odometer.toString()],
    ['Pump Reading Before:', entry.pumpReadingBefore.toString()],
    ['Pump Reading After:', entry.pumpReadingAfter.toString()],
    ['Liters:', entry.liters.toString()]
  ];

  (doc as any).autoTable({
    startY: 30,
    body: details,
    theme: 'plain',
    styles: { fontSize: 12 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { cellWidth: 100 }
    }
  });

  doc.save(`fuel-entry-${entry.slipNumber}.pdf`);
};

export const generateVehicleInspectionPDF = (inspection: VehicleInspection) => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text('Vehicle Inspection Form', 20, 20);
  
  // Add basic details
  doc.setFontSize(12);
  const details = [
    ['Date:', new Date(inspection.date).toLocaleDateString()],
    ['Vehicle:', inspection.vehicle],
    ['Driver:', inspection.driver],
    ['Mileage:', inspection.mileage.toString()]
  ];

  (doc as any).autoTable({
    startY: 30,
    body: details,
    theme: 'plain',
    styles: { fontSize: 12 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { cellWidth: 100 }
    }
  });

  // Add inspection items
  const itemsData = Object.entries(inspection.items).map(([key, value]) => [
    key.replace(/([A-Z])/g, ' $1').trim(), // Convert camelCase to spaces
    value ? '✓' : '✗'
  ]);

  (doc as any).autoTable({
    startY: (doc as any).lastAutoTable.finalY + 10,
    head: [['Item', 'Status']],
    body: itemsData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] }
  });

  // Add notes if any
  if (inspection.notes) {
    doc.text('Notes:', 20, (doc as any).lastAutoTable.finalY + 20);
    doc.setFontSize(10);
    const splitNotes = doc.splitTextToSize(inspection.notes, 170);
    doc.text(splitNotes, 20, (doc as any).lastAutoTable.finalY + 30);
  }

  doc.save(`vehicle-inspection-${inspection.vehicle}-${inspection.date}.pdf`);
};

export const generateVehicleIncidentPDF = (incident: VehicleIncident) => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text('Vehicle Incident Report', 20, 20);
  
  // Add incident details
  doc.setFontSize(12);
  const details = [
    ['Date:', new Date(incident.date).toLocaleDateString()],
    ['Vehicle:', incident.vehicle],
    ['Driver:', incident.driver],
    ['Location:', incident.location],
    ['Status:', incident.status]
  ];

  (doc as any).autoTable({
    startY: 30,
    body: details,
    theme: 'plain',
    styles: { fontSize: 12 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { cellWidth: 100 }
    }
  });

  // Add description
  doc.text('Description:', 20, (doc as any).lastAutoTable.finalY + 20);
  doc.setFontSize(10);
  const splitDescription = doc.splitTextToSize(incident.description, 170);
  doc.text(splitDescription, 20, (doc as any).lastAutoTable.finalY + 30);

  // Add photo references if any
  if (incident.damagePhotos.length > 0) {
    doc.text('Photos:', 20, doc.internal.pageSize.height - 40);
    incident.damagePhotos.forEach((photo, index) => {
      doc.setTextColor(0, 0, 255);
      doc.setFontSize(8);
      doc.textWithLink(`Photo ${index + 1}`, 20, doc.internal.pageSize.height - 30 + (index * 10), { url: photo });
    });
  }

  doc.save(`vehicle-incident-${incident.vehicle}-${incident.date}.pdf`);
};