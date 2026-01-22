import React from 'react';
import { Helmet } from 'react-helmet';
import BrandHeader from './components/BrandHeader';
import LoginForm from './components/LoginForm';
import TrustBadges from './components/TrustBadges';
import SupportLinks from './components/SupportLinks';

const Login = () => {
  return (
    <>
      <Helmet>
        <title>Login - Veeba Foods Customer Portal</title>
        <meta name="description" content="Sign in to your Veeba Foods B2B customer portal to manage orders, invoices, and business operations" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Column - Login Form */}
            <div className="order-2 lg:order-1">
              <div className="bg-card rounded-2xl shadow-warm-lg border border-border p-6 md:p-8 lg:p-10">
                <BrandHeader />
                <LoginForm />
                
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-center text-sm text-muted-foreground mb-4">
                    Trusted by businesses across India
                  </p>
                  <TrustBadges />
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="font-caption text-xs text-muted-foreground">
                  &copy; {new Date()?.getFullYear()} Veeba Foods. All rights reserved.
                </p>
                <div className="flex items-center justify-center gap-4 mt-2">
                  <a
                    href="https://www.veeba.in/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-caption text-xs text-primary hover:text-primary/80 transition-smooth"
                  >
                    Privacy Policy
                  </a>
                  <span className="text-muted-foreground">•</span>
                  <a
                    href="https://www.veeba.in/terms-conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-caption text-xs text-primary hover:text-primary/80 transition-smooth"
                  >
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Support & Information */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="bg-card rounded-2xl shadow-warm-lg border border-border p-6 md:p-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-6">
                  Welcome Back!
                </h2>
                <p className="font-body text-base text-muted-foreground mb-6">
                  Sign in to access your personalized dashboard with real-time order tracking, financial insights, and seamless business management tools.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-success font-bold text-sm">✓</span>
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-sm text-foreground mb-1">
                        Real-time Order Management
                      </h3>
                      <p className="font-caption text-xs text-muted-foreground">
                        Track orders, view dispatch status, and manage deliveries
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-success font-bold text-sm">✓</span>
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-sm text-foreground mb-1">
                        Financial Transparency
                      </h3>
                      <p className="font-caption text-xs text-muted-foreground">
                        Access invoices, statements, and payment history
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-success font-bold text-sm">✓</span>
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-sm text-foreground mb-1">
                        24/7 Support Access
                      </h3>
                      <p className="font-caption text-xs text-muted-foreground">
                        Raise complaints and track resolution status
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl shadow-warm-lg border border-border p-6 md:p-8">
                <h2 className="font-heading font-bold text-xl text-foreground mb-4">
                  Need Assistance?
                </h2>
                <SupportLinks />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;