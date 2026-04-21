import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import './CustomDateRangeModal.css'; 

const CustomDateRangeModal = ({ isOpen, onClose, onApply }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    if (!isOpen) return null;

    const handleApply = () => {
        if (startDate && endDate) {
            onApply(startDate, endDate);
            onClose();
        }
    };

    const handleCancel = () => {
        setStartDate(null);
        setEndDate(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-card rounded-xl max-w-2xl w-full p-6 shadow-warm-xl animate-slide-in">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-heading font-semibold text-lg text-foreground">
                        Select Custom Date Range
                    </h3>
                    <button
                        onClick={handleCancel}
                        className="p-2 rounded-lg hover:bg-muted transition-smooth"
                    >
                        <Icon name="X" size={20} color="var(--color-muted-foreground)" />
                    </button>
                </div>

                {/* Date Pickers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* From Date */}
                    <div>
                        <label className="block font-caption text-sm text-muted-foreground mb-2">
                            From Date
                        </label>
                        <div className="custom-datepicker-wrapper">
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                maxDate={endDate || new Date()}
                                inline
                                calendarClassName="custom-datepicker"
                                dateFormat="dd/MM/yyyy"
                            />
                        </div>
                    </div>

                    {/* To Date */}
                    <div>
                        <label className="block font-caption text-sm text-muted-foreground mb-2">
                            To Date
                        </label>
                        <div className="custom-datepicker-wrapper">
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                maxDate={new Date()}
                                inline
                                calendarClassName="custom-datepicker"
                                dateFormat="dd/MM/yyyy"
                            />
                        </div>
                    </div>
                </div>

                {/* Selected Range Display */}
                {startDate && endDate && (
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2">
                            <Icon name="Calendar" size={20} color="var(--color-primary)" />
                            <p className="font-body text-sm text-foreground">
                                Selected Range: {' '}
                                <span className="font-semibold">
                                    {startDate.toLocaleDateString('en-IN')} - {endDate.toLocaleDateString('en-IN')}
                                </span>
                            </p>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="default"
                        iconName="Check"
                        iconPosition="left"
                        onClick={handleApply}
                        disabled={!startDate || !endDate}
                        className="flex-1"
                    >
                        Apply Range
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CustomDateRangeModal;
