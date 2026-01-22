import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const SupportLinks = () => {
  const supportOptions = [
    {
      icon: 'UserPlus',
      title: 'New Customer?',
      description: 'Register your business account',
      link: '/customer-registration',
      linkText: 'Create Account'
    },
    {
      icon: 'HelpCircle',
      title: 'Need Help?',
      description: 'Contact our support team',
      link: 'mailto:support@veeba.in',
      linkText: 'Get Support',
      external: true
    },
    {
      icon: 'Phone',
      title: 'Call Us',
      description: 'Mon-Sat, 9 AM - 6 PM IST',
      link: 'tel:+911234567890',
      linkText: '+91 123 456 7890',
      external: true
    }
  ];

  return (
    <div className="space-y-4">
      {supportOptions?.map((option, index) => (
        <div
          key={index}
          className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg border border-border/50 transition-smooth hover:bg-muted hover:border-border"
        >
          <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name={option?.icon} size={20} color="var(--color-primary)" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-heading font-semibold text-sm text-foreground mb-1">
              {option?.title}
            </h4>
            <p className="font-caption text-xs text-muted-foreground mb-2">
              {option?.description}
            </p>
            {option?.external ? (
              <a
                href={option?.link}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-smooth"
              >
                {option?.linkText}
                <Icon name="ExternalLink" size={14} />
              </a>
            ) : (
              <Link
                to={option?.link}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-smooth"
              >
                {option?.linkText}
                <Icon name="ArrowRight" size={14} />
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SupportLinks;