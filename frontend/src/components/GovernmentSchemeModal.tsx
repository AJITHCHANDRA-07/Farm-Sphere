import React from "react";
import Modal from "@/components/ui/Modal"; // Updated import

const GovernmentSchemeModal = ({ isOpen, onClose, scheme }) => {
  if (!scheme) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-foreground">{scheme.name}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Loan Details */}
        <div className="bg-primary/10 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-primary mb-2">💰 Loan/Benefit Details</h3>
          <p className="text-muted-foreground text-base">{scheme.loanDetails}</p>
        </div>

        {/* Eligibility */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">✅ Eligibility Criteria</h3>
          <div className="space-y-2">
            {scheme.eligibility.map((criteria, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">{criteria}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">🎯 Key Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {scheme.benefits.map((benefit, index) => (
              <div key={index} className="bg-green-100 border border-green-200 rounded-lg p-3">
                <span className="text-sm text-green-800 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Required Documents */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">📄 Required Documents</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {scheme.documents.map((doc, index) => (
              <div key={index} className="bg-blue-100 border border-blue-200 rounded-lg p-3 text-center">
                <span className="text-sm text-blue-800 font-medium">{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">ℹ️ Important Information</h3>
          <p className="text-yellow-700 text-sm">
            • Applications can be submitted online through the official government portal
            <br />
            • Processing time: 15-30 days
            <br />
            • Subsidy amount varies based on category and location
            <br />
            • Technical support available at local agriculture offices
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-8">
          <button
            className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            onClick={() => window.open(`https://www.india.gov.in/apply-online?scheme=${scheme.id}`, "_blank")}
          >
            🌐 Apply Online
          </button>
          <button
            className="flex-1 bg-gray-200 text-foreground py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            onClick={() => window.open(`/forms/${scheme.id}-application-form.pdf`, "_blank")}
          >
            📥 Download Form
          </button>
        </div>

        {/* Contact Information */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Contact your local agriculture office or call toll-free: 1800-XXX-XXXX
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default GovernmentSchemeModal;
