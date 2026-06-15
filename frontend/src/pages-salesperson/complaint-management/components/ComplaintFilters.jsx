import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const ComplaintFilters = ({ filters, onFilterChange }) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'Open', label: 'Open' },
    { value: 'Under Investigation', label: 'Under Investigation' },
    { value: 'Resolved', label: 'Resolved' },
    { value: 'Closed', label: 'Closed' },
    { value: 'Rejected', label: 'Rejected' }
  ];

  const issueTypeOptions = [
    { value: 'all', label: 'All Issue Types' },
    { value: 'Shortage', label: 'Shortage' },
    { value: 'Leakage', label: 'Leakage' },
    { value: 'Damage', label: 'Damage' },
    { value: 'Expiry', label: 'Expiry' },
    { value: 'Quality Issue', label: 'Quality Issue' },
    { value: 'Wrong Product', label: 'Wrong Product' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'High', label: 'High Priority' },
    { value: 'Medium', label: 'Medium Priority' },
    { value: 'Low', label: 'Low Priority' }
  ];

  return (
    <div className="bg-card rounded-xl p-4 md:p-6 border border-border shadow-warm-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          type="search"
          placeholder="Search complaints..."
          value={filters?.search}
          onChange={(e) => onFilterChange('search', e?.target?.value)}
          className="w-full"
        />
        
        <Select
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => onFilterChange('status', value)}
          placeholder="Filter by status"
        />
        
        <Select
          options={issueTypeOptions}
          value={filters?.issueType}
          onChange={(value) => onFilterChange('issueType', value)}
          placeholder="Filter by issue type"
        />
        
        <Select
          options={priorityOptions}
          value={filters?.priority}
          onChange={(value) => onFilterChange('priority', value)}
          placeholder="Filter by priority"
        />
      </div>
    </div>
  );
};

export default ComplaintFilters;