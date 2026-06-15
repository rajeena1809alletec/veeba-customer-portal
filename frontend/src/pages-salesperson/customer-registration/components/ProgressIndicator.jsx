import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="w-full mb-8 md:mb-10 lg:mb-12">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-10">
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        {steps?.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={stepNumber} className="flex flex-col items-center gap-2 md:gap-3 bg-background px-2">
              <div
                className={`
                  w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
                  transition-all duration-300 border-2
                  ${isCompleted ? 'bg-primary border-primary' : ''}
                  ${isCurrent ? 'bg-primary/10 border-primary scale-110' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-card border-border' : ''}
                `}
              >
                {isCompleted ? (
                  <Icon name="Check" size={20} color="var(--color-primary-foreground)" />
                ) : (
                  <span className={`font-heading font-semibold text-sm md:text-base ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                    {stepNumber}
                  </span>
                )}
              </div>
              <span className={`
                font-caption text-xs md:text-sm text-center max-w-[80px] md:max-w-none
                ${isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'}
              `}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;