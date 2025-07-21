import React, { useState, useRef } from 'react';
import styles from './CSVImport.module.css';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import { leadService } from '../../../services/leadService';

export interface CSVLead {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closedWon' | 'closedLost' | 'nurture' | 'optedOut';
  source: 'website' | 'referral' | 'socialMedia' | 'coldOutreach' | 'event' | 'advertising' | 'zillow' | 'realtorCom' | 'homesCom' | 'manualEntry' | 'emailParsing' | 'other';
  notes?: string;
  priority?: 'hot' | 'warm' | 'cold';
  timeline?: 'immediate' | 'one_to_three_months' | 'three_to_six_months' | 'six_to_twelve_months' | 'just_browsing';
}

export interface CSVImportProps {
  onImportComplete?: (importedCount: number) => void;
  onClose?: () => void;
}

const CSVImport: React.FC<CSVImportProps> = ({ onImportComplete, onClose }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewData, setPreviewData] = useState<CSVLead[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (csvText: string): CSVLead[] => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const leads: CSVLead[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const lead: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index] || '';
        
        switch (header) {
          case 'firstname':
          case 'first_name':
          case 'first name':
            lead.firstName = value;
            break;
          case 'lastname':
          case 'last_name':
          case 'last name':
            lead.lastName = value;
            break;
          case 'email':
            lead.email = value;
            break;
          case 'phone':
          case 'telephone':
            lead.phone = value;
            break;
          case 'status':
            lead.status = value.toLowerCase() as CSVLead['status'];
            break;
          case 'source':
            lead.source = value.toLowerCase() as CSVLead['source'];
            break;
          case 'notes':
          case 'note':
            lead.notes = value;
            break;
          case 'priority':
            lead.priority = value.toLowerCase() as CSVLead['priority'];
            break;
          case 'timeline':
            lead.timeline = value.toLowerCase() as CSVLead['timeline'];
            break;
        }
      });
      
      // Validate required fields
      if (lead.firstName && lead.lastName && lead.phone) {
        // Set defaults for missing fields
        lead.status = lead.status || 'new';
        lead.source = lead.source || 'manualEntry';
        lead.priority = lead.priority || 'warm';
        lead.timeline = lead.timeline || 'just_browsing';
        
        leads.push(lead as CSVLead);
      }
    }
    
    return leads;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);
    setSuccess(null);
    setPreviewData([]);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const parsedData = parseCSV(csvText);
        
        if (parsedData.length === 0) {
          setError('No valid leads found in CSV. Please check the format.');
          return;
        }
        
        setPreviewData(parsedData.slice(0, 5)); // Show first 5 rows as preview
      } catch (error) {
        setError('Error parsing CSV file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (previewData.length === 0) return;

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      let importedCount = 0;
      
      for (const lead of previewData) {
        try {
          await leadService.createLead(lead);
          importedCount++;
        } catch (error) {
          console.error('Error importing lead:', lead, error);
        }
      }

      setSuccess(`Successfully imported ${importedCount} leads!`);
      onImportComplete?.(importedCount);
      
      // Reset form
      setPreviewData([]);
      setFileName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setError('Error importing leads. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        if (fileInputRef.current) {
          fileInputRef.current.files = files;
          handleFileSelect({ target: { files } } as any);
        }
      } else {
        setError('Please select a valid CSV file.');
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <Card className={styles.csvImport}>
      <div className={styles.header}>
        <h3>Import Leads from CSV</h3>
        {onClose && (
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.uploadArea}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className={styles.fileInput}
            id="csv-file-input"
          />
          <label
            htmlFor="csv-file-input"
            className={styles.dropZone}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className={styles.dropZoneContent}>
              <div className={styles.uploadIcon}>📁</div>
              <p>Drop your CSV file here or click to browse</p>
              <p className={styles.fileTypes}>Supported format: CSV</p>
            </div>
          </label>
        </div>

        {fileName && (
          <div className={styles.fileInfo}>
            <span>Selected file: {fileName}</span>
            <span>{previewData.length} leads found</span>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className={styles.success}>
            <p>{success}</p>
          </div>
        )}

        {previewData.length > 0 && (
          <div className={styles.preview}>
            <h4>Preview (first 5 rows):</h4>
            <div className={styles.previewTable}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((lead, index) => (
                    <tr key={index}>
                      <td>{lead.firstName} {lead.lastName}</td>
                      <td>{lead.email || '-'}</td>
                      <td>{lead.phone}</td>
                      <td>{lead.status}</td>
                      <td>{lead.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <Button
            onClick={handleImport}
            disabled={previewData.length === 0 || isUploading}
            loading={isUploading}
          >
            {isUploading ? 'Importing...' : `Import ${previewData.length} Leads`}
          </Button>
        </div>

        <div className={styles.help}>
          <h4>CSV Format Requirements:</h4>
          <ul>
            <li><strong>Required columns:</strong> firstName, lastName, phone</li>
            <li><strong>Optional columns:</strong> email, status, source, notes, priority, timeline</li>
            <li><strong>Status values:</strong> new, contacted, qualified, proposal, negotiation, closedWon, closedLost, nurture, optedOut</li>
            <li><strong>Source values:</strong> website, referral, socialMedia, coldOutreach, event, advertising, zillow, realtorCom, homesCom, manualEntry, emailParsing, other</li>
            <li><strong>Priority values:</strong> hot, warm, cold</li>
            <li><strong>Timeline values:</strong> immediate, one_to_three_months, three_to_six_months, six_to_twelve_months, just_browsing</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default CSVImport; 