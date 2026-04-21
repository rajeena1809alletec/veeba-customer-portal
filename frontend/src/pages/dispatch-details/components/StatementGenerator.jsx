import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const StatementGenerator = ({ onGenerate }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [format, setFormat] = useState('pdf');
  const [loading, setLoading] = useState(false);

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'csv', label: 'CSV File' }
  ];

  const handleGenerate = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    onGenerate({ startDate, endDate, format });
    setLoading(false);
  };

  const setQuickRange = (range) => {
    const today = new Date();
    const end = today?.toISOString()?.split('T')?.[0];
    let start;

    switch (range) {
      case 'month':
        start = new Date(today.getFullYear(), today.getMonth(), 1)?.toISOString()?.split('T')?.[0];
        break;
      case 'quarter':
        const quarter = Math.floor(today?.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1)?.toISOString()?.split('T')?.[0];
        break;
      case 'year':
        start = new Date(today.getFullYear(), 0, 1)?.toISOString()?.split('T')?.[0];
        break;
      default:
        return;
    }

    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="bg-card rounded-xl p-4 md:p-6 border border-border shadow-warm-sm">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="bg-primary/10 rounded-lg p-2">
          <Icon name="FileText" size={24} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="font-heading font-semibold text-base md:text-lg text-foreground">
            Generate Statement
          </h3>
          <p className="font-caption text-xs text-muted-foreground">
            Download account statement for any period
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuickRange('month')}
          >
            This Month
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuickRange('quarter')}
          >
            This Quarter
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuickRange('year')}
          >
            This Year
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e?.target?.value)}
            required
          />
          <Input
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e?.target?.value)}
            required
          />
        </div>

        <Select
          label="Export Format"
          options={formatOptions}
          value={format}
          onChange={setFormat}
        />

        <Button
          variant="default"
          iconName="Download"
          iconPosition="left"
          onClick={handleGenerate}
          loading={loading}
          fullWidth
        >
          Generate Statement
        </Button>
      </div>
    </div>
  );
};

export default StatementGenerator;