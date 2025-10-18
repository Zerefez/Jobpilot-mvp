'use client';

import { extractTextFromPDF } from '@/lib/pdf-utils';
import { useState } from 'react';

interface InputPanelProps {
  onSubmit: (data: {
    jobDescription: string;
    resume: string;
    coverLetter: string;
  }) => void;
  isLoading: boolean;
}

export function InputPanel({ onSubmit, isLoading }: InputPanelProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{
    jobDescription?: string;
    resume?: string;
    coverLetter?: string;
  }>({});

  const handleFileUpload = async (
    file: File,
    setter: (text: string) => void,
    fieldName: keyof typeof uploadedFiles
  ) => {
    try {
      setUploading(true);
      const text = await extractTextFromPDF(file);
      setter(text);
      setUploadedFiles((prev) => ({
        ...prev,
        [fieldName]: file.name,
      }));
    } catch (error) {
      alert(`Error reading file: ${error}`);
    } finally {
      setUploading(false);
    }
  };

  const handleTextChange = (
    text: string,
    setter: (text: string) => void,
    fieldName: keyof typeof uploadedFiles
  ) => {
    setter(text);
    if (text.trim()) {
      setUploadedFiles((prev) => ({
        ...prev,
        [fieldName]: 'Text input',
      }));
    } else {
      setUploadedFiles((prev) => {
        const updated = { ...prev };
        delete updated[fieldName];
        return updated;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobDescription.trim() || !resume.trim() || !coverLetter.trim()) {
      alert(
        'Please fill in all three fields: Job Description, Resume, and Cover Letter'
      );
      return;
    }

    onSubmit({
      jobDescription,
      resume,
      coverLetter,
    });
  };

  const renderFieldStatus = (fieldName: keyof typeof uploadedFiles) => {
    if (uploadedFiles[fieldName]) {
      return (
        <div className="flex items-center gap-2 text-green-600 text-xs mt-1">
          <span className="text-lg">✓</span>
          <span>
            {uploadedFiles[fieldName] === 'Text input'
              ? 'Text content added'
              : `PDF uploaded: ${uploadedFiles[fieldName]}`}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 overflow-y-auto">
      <div className="sticky top-0 bg-gradient-to-b from-white to-gray-50 border-b border-gray-200 p-4 md:p-6">
        <h2 className="text-xl font-bold text-gray-900">Resume Coach</h2>
        <p className="text-sm text-gray-600 mt-1">
          Upload or paste your job description, resume, and cover letter
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-4 md:p-6 gap-6">
        {/* Job Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Job Description * {uploadedFiles.jobDescription && <span className="text-green-600">✓</span>}
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => handleTextChange(e.target.value, setJobDescription, 'jobDescription')}
            placeholder="Paste the job description here..."
            className="w-full h-24 p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={isLoading || uploading}
          />
          {renderFieldStatus('jobDescription')}
          <label className="block text-xs text-gray-500 mt-2 cursor-pointer hover:text-gray-700">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, setJobDescription, 'jobDescription');
              }}
              disabled={isLoading || uploading}
              className="hidden"
            />
            📄 Upload PDF for Job Description
          </label>
        </div>

        {/* Resume */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your Resume * {uploadedFiles.resume && <span className="text-green-600">✓</span>}
          </label>
          <textarea
            value={resume}
            onChange={(e) => handleTextChange(e.target.value, setResume, 'resume')}
            placeholder="Paste your resume or CV here..."
            className="w-full h-24 p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={isLoading || uploading}
          />
          {renderFieldStatus('resume')}
          <label className="block text-xs text-gray-500 mt-2 cursor-pointer hover:text-gray-700">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, setResume, 'resume');
              }}
              disabled={isLoading || uploading}
              className="hidden"
            />
            📄 Upload PDF for Resume
          </label>
        </div>

        {/* Cover Letter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your Cover Letter * {uploadedFiles.coverLetter && <span className="text-green-600">✓</span>}
          </label>
          <textarea
            value={coverLetter}
            onChange={(e) => handleTextChange(e.target.value, setCoverLetter, 'coverLetter')}
            placeholder="Paste your cover letter here..."
            className="w-full h-24 p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={isLoading || uploading}
          />
          {renderFieldStatus('coverLetter')}
          <label className="block text-xs text-gray-500 mt-2 cursor-pointer hover:text-gray-700">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, setCoverLetter, 'coverLetter');
              }}
              disabled={isLoading || uploading}
              className="hidden"
            />
            📄 Upload PDF for Cover Letter
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors mt-auto"
        >
          {uploading ? 'Processing file...' : isLoading ? 'Sending...' : 'Start Analysis'}
        </button>
      </form>
    </div>
  );
}
