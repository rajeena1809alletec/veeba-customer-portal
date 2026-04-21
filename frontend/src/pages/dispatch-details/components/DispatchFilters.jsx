import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const DispatchFilters = ({
    searchTerm,
    onSearchChange,
    dateRange,
    onDateRangeChange,
    onReset
}) => {
    const dateRangeOptions = [
        { value: 'all', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: 'quarter', label: 'This Quarter' },
        { value: 'year', label: 'This Year' },
        { value: 'custom', label: 'Custom Range' }
    ];

    return (
        <div className="bg-card rounded-xl p-4 md:p-6 border border-border shadow-warm-sm mb-4 md:mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    type="search"
                    placeholder="Search by invoice no, LR no, transporter..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e?.target?.value)}
                    className="w-full"
                />

                <Select
                    placeholder="Date Range"
                    options={dateRangeOptions}
                    value={dateRange}
                    onChange={onDateRangeChange}
                />

                <Button
                    variant="outline"
                    iconName="RotateCcw"
                    iconPosition="left"
                    onClick={onReset}
                    className="w-full"
                >
                    Reset Filters
                </Button>
            </div>
        </div>
    );
};

export default DispatchFilters;