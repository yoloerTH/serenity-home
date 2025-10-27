import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, UserCheck } from 'lucide-react';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  return (
    <div className="pt-24 pb-16 min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-16 mb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-16 h-16 text-amber-400 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-300">Last Updated: January 15, 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Icons */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200">
            <Lock className="w-10 h-10 text-amber-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Secure Data</h3>
            <p className="text-sm text-gray-600">SSL encrypted storage</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200">
            <Eye className="w-10 h-10 text-amber-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Transparency</h3>
            <p className="text-sm text-gray-600">Clear data usage</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200">
            <UserCheck className="w-10 h-10 text-amber-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Your Control</h3>
            <p className="text-sm text-gray-600">Manage your data</p>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to Serenity Home. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Serenity Home ("we", "us", or "our") operates www.serenityhome.com. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3 mt-6">Personal Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you place an order or register an account, we collect information including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Name and contact information (email address, phone number, shipping address)</li>
              <li>Payment information (processed securely through our payment providers)</li>
              <li>Order history and preferences</li>
              <li>Account credentials (username and encrypted password)</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">Automatically Collected Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We automatically collect certain information when you visit our website:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Browser type and version</li>
              <li>IP address and device information</li>
              <li>Pages visited and time spent on our site</li>
              <li>Referring website addresses</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the collected information for various purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Order Processing:</strong> To process and fulfill your orders, send order confirmations, and provide customer support</li>
              <li><strong>Account Management:</strong> To create and manage your account, including password resets and account updates</li>
              <li><strong>Communication:</strong> To send you important updates, promotional offers, and newsletters (you can opt-out anytime)</li>
              <li><strong>Improvement:</strong> To analyze website usage and improve our products, services, and user experience</li>
              <li><strong>Security:</strong> To protect against fraud and unauthorized transactions</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Data Sharing and Disclosure</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell your personal information. We may share your data with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Service Providers:</strong> Third-party companies that help us operate our business (e.g., payment processors, shipping companies, email service providers)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              All third-party service providers are required to maintain the confidentiality and security of your personal information and are prohibited from using it for any purpose other than providing services to us.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to enhance your browsing experience. Cookies are small files stored on your device that help us:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Remember your preferences and settings</li>
              <li>Keep you logged in to your account</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Provide personalized content and advertisements</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features of our website.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. Our security measures include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>SSL encryption for all data transmission</li>
              <li>Secure payment processing through PCI-DSS compliant providers</li>
              <li>Regular security audits and updates</li>
              <li>Restricted access to personal data on a need-to-know basis</li>
              <li>Employee training on data protection and privacy</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the following rights regarding your personal data:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal obligations)</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Objection:</strong> Object to processing of your data for marketing purposes</li>
              <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise any of these rights, please contact us at privacy@serenityhome.com. We will respond to your request within 30 days.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our Service is not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal data, please contact us, and we will take steps to delete such information.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>

          {/* Contact Us Section - REPLACE THE EXISTING ONE */}
<section className="mb-12">
  <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
  <p className="text-gray-700 leading-relaxed mb-4">
    If you have any questions about this Privacy Policy, please contact us:
  </p>
  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-2xl border border-amber-200 text-center">
    <p className="text-gray-900 font-medium mb-4">Serenity Home</p>
    <button
      onClick={() => navigate('/contact')}
      className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-6 py-3 rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all"
    >
      Send Us a Message
    </button>
  </div>
</section>
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-8 py-4 rounded-full font-bold hover:shadow-2xl hover:scale-105 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
