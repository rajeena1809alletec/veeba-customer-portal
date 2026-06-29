import React from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const CustomerFilters = ({ searchTerm, onSearchChange, onReset }) => {
    return (
        <div className="bg-card border border-border rounded-lg p-4 md:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                    <Input
                        type="search"
                        placeholder="Search by code, name, contact, email, city, state, payment term, salesperson..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full"
                    />
                </div>

                <div className="flex items-end">
                    <Button
                        variant="outline"
                        iconName="RotateCcw"
                        iconPosition="left"
                        onClick={onReset}
                    >
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CustomerFilters;