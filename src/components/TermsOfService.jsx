import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Scale, CheckCircle } from 'lucide-react';

const TermsOfService = () => {
  const navigate = useNavigate();
  return (
    <div className="pt-24 pb-16 min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-16 mb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FileText className="w-16 h-16 text-amber-400 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-300">Last Updated: January 15, 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Icons */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200">
            <Scale className="w-10 h-10 text-amber-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Fair Terms</h3>
            <p className="text-sm text-gray-600">Transparent policies</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200">
            <CheckCircle className="w-10 h-10 text-amber-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Your Rights</h3>
            <p className="text-sm text-gray-600">Protected purchases</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200">
            <FileText className="w-10 h-10 text-amber-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Clear Rules</h3>
            <p className="text-sm text-gray-600">Easy to understand</p>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to Serenity Home. By accessing or using our website and services, you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access our service.
            </p>
            <p className="text-gray-700 leading-relaxed">
              These Terms apply to all visitors, users, and others who access or use the Service. Please read these Terms carefully before using our website.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Use of Service</h2>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3 mt-6">Eligibility</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You must be at least 18 years old to use our Service. By using our Service, you represent and warrant that you are at least 18 years of age and have the legal capacity to enter into this agreement.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">Account Registration</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you create an account with us, you must provide accurate, complete, and current information. You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Maintaining the confidentiality of your account and password</li>
              <li>Restricting access to your account</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Products and Orders</h2>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3 mt-6">Product Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We strive to provide accurate product descriptions, images, and pricing. However:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Colors may vary slightly due to monitor settings</li>
              <li>We reserve the right to correct errors in product information</li>
              <li>Product availability is subject to change without notice</li>
              <li>All prices are in USD and subject to change</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">Order Acceptance</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to refuse or cancel any order for any reason, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Product availability or stock issues</li>
              <li>Errors in product or pricing information</li>
              <li>Suspected fraudulent or unauthorized transactions</li>
              <li>Orders that violate our policies</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pricing and Payment</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All prices displayed on our website are in US Dollars and include applicable taxes unless otherwise stated. By placing an order, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Provide current, complete, and accurate purchase information</li>
              <li>Pay all charges at the prices in effect when charges are incurred</li>
              <li>Pay applicable taxes and shipping fees</li>
              <li>Maintain valid payment method information</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We use secure third-party payment processors. We do not store your complete credit card information on our servers.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shipping and Delivery</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Shipping times are estimates and not guaranteed. We are not responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Delays caused by shipping carriers</li>
              <li>Customs delays for international orders</li>
              <li>Incorrect addresses provided by customers</li>
              <li>Force majeure events beyond our control</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Risk of loss passes to you upon delivery to the shipping carrier. We recommend purchasing shipping insurance for valuable items.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Returns and Refunds</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our 30-day return policy allows you to return unused products in original packaging. To be eligible for a return:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Items must be unused and in original condition</li>
              <li>Original packaging must be intact</li>
              <li>Proof of purchase is required</li>
              <li>Return request must be initiated within 30 days of delivery</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Non-returnable items:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Opened aromatherapy products and essential oils</li>
              <li>Personalized or custom-made items</li>
              <li>Items marked as final sale</li>
              <li>Gift cards</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Service and its original content, features, and functionality are owned by Serenity Home and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You may not copy, modify, distribute, sell, or lease any part of our Service without our express written permission. Unauthorized use may result in legal action.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Prohibited Activities</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to engage in any of the following prohibited activities:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Using the Service for any illegal purpose or in violation of any laws</li>
              <li>Attempting to gain unauthorized access to our systems</li>
              <li>Interfering with or disrupting the Service</li>
              <li>Impersonating another person or entity</li>
              <li>Harvesting or collecting information about other users</li>
              <li>Transmitting spam, viruses, or malicious code</li>
              <li>Creating multiple accounts to abuse promotions</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To the maximum extent permitted by law, Serenity Home shall not be liable for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Indirect, incidental, special, or consequential damages</li>
              <li>Loss of profits, revenue, data, or use</li>
              <li>Damages resulting from third-party products or services</li>
              <li>Damages exceeding the amount you paid for the product or service</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Some jurisdictions do not allow the exclusion of certain warranties or limitations on liability, so these limitations may not apply to you.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Dispute Resolution</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Any disputes arising from these Terms or your use of the Service shall be resolved through:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700">
              <li><strong>Good Faith Negotiation:</strong> First, we'll try to resolve disputes informally through good faith negotiations</li>
              <li><strong>Mediation:</strong> If negotiation fails, disputes may be submitted to mediation</li>
              <li><strong>Arbitration:</strong> If mediation is unsuccessful, disputes will be resolved through binding arbitration</li>
            </ol>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice before new terms take effect. Your continued use of the Service after changes become effective constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions. Any legal action or proceeding shall be brought exclusively in the federal or state courts located in San Francisco County, California.
            </p>
          </section>

          {/* Contact Information - REPLACE THE EXISTING ONE */}
<section className="mb-12">
  <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Information</h2>
  <p className="text-gray-700 leading-relaxed mb-4">
    If you have any questions about these Terms of Service, please contact us:
  </p>
  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-2xl border border-amber-200 text-center">
    <p className="text-gray-900 font-medium mb-4">Serenity Home</p>
    <button
      onClick={() => navigate('/contact')}
      className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-6 py-3 rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all"
    >
      Get In Touch
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

export default TermsOfService;
