"use client";
import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

export default function ArvanPoliciesPage() {
  const [activeTab, setActiveTab] = useState("privacy");
  const router = useRouter();

  return (
    <>
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 py-12 min-h-screen">
        {/* back to home page */}
        <div className="flex justify-start mb-4">
          <button
            onClick={() => router.back()}
            className="cursor-pointer z-10 left-4 bg-lime-400 text-black font-bold py-1 px-4 rounded">
            Back
          </button>
        </div>

        <header className="mb-10 text-center">
          <h1 className="font-general_sans text-2xl max-sm:text-xl font-semibold whitespace-nowrap">
            Arvan Policies
          </h1>
          <p className="text-gray-600 mt-3 font-montserrat">
            Effective Date: April 16, 2025
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="absolute w-[80vw] h-[40vw] rounded-full bg-lime-600/10 blur-3xl left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-1 pointer-events-none"></div>
          <div className="flex border-b">
            <button
              className={`py-4 px-8 text-lg font-montserrat font-medium transition-all duration-300 ${
                activeTab === "return"
                  ? "bg-[#C2E53A] text-gray-900"
                  : "bg-gray-100 text-gray-700 hover:bg-[#C2E53A]/10"
              }`}
              onClick={() => setActiveTab("return")}>
              Return Policy
            </button>
            <button
              className={`py-4 px-8 text-lg font-montserrat font-medium transition-all duration-300 ${
                activeTab === "privacy"
                  ? "bg-[#C2E53A] text-gray-900"
                  : "bg-gray-100 text-gray-700 hover:bg-[#C2E53A]/10"
              }`}
              onClick={() => setActiveTab("privacy")}>
              Privacy Policy
            </button>
          </div>

          <div className="p-8">
            {activeTab === "return" ? (
              <div className="space-y-8 font-montserrat">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-coluna text-gray-900">
                    Return Policy — Arvan
                  </h2>
                  <p className="text-gray-600 mt-3">
                    At <strong>Arvan</strong>, your satisfaction means
                    everything to us. If you&apos;re not completely happy with your
                    purchase, we&apos;re here to make it right.
                  </p>
                </div>

                <div className="bg-[#C2E53A]/10 p-6 rounded-xl border border-[#C2E53A]/20">
                  <h3 className="flex items-center text-xl font-semibold text-gray-900">
                    <span className="mr-3">✅</span> 7-Day Return Period
                  </h3>
                  <p className="mt-3 text-gray-700">
                    We offer a <strong>7-day return window</strong> from the
                    date your order is delivered.
                  </p>
                </div>

                <div>
                  <h3 className="flex items-center text-xl font-semibold text-gray-900">
                    <span className="mr-3">📦</span> What Can Be Returned
                  </h3>
                  <ul className="mt-3 space-y-2 pl-10 list-disc text-gray-700">
                    <li>
                      Only <strong>men&apos;s sliders</strong> purchased directly
                      from Arvan are eligible.
                    </li>
                    <li>
                      Items must be{" "}
                      <strong>
                        unused, unworn, and in their original packaging
                      </strong>
                      .
                    </li>
                    <li>All original tags and labels must be attached.</li>
                    <li>
                      The product must be in{" "}
                      <strong>resellable condition</strong>.
                    </li>
                  </ul>
                </div>

                <div className="bg-[#C2E53A]/10 p-6 rounded-xl border border-[#C2E53A]/20">
                  <h3 className="flex items-center text-xl font-semibold text-gray-900">
                    <span className="mr-3">❌</span> What Cannot Be Returned
                  </h3>
                  <ul className="mt-3 space-y-2 pl-10 list-disc text-gray-700">
                    <li>Used or worn sliders.</li>
                    <li>
                      Returns made <strong>after 7 days</strong> from the
                      delivery date.
                    </li>
                    <li>
                      Items bought on clearance or as part of special offers (if
                      marked non-returnable).
                    </li>
                    <li>
                      Products returned without proper packaging or missing
                      tags.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="flex items-center text-xl font-semibold text-gray-900">
                    <span className="mr-3">💰</span> Refund Process
                  </h3>
                  <p className="mt-3 text-gray-700">
                    Once your returned item is received and inspected:
                  </p>
                  <ul className="mt-3 space-y-2 pl-10 list-disc text-gray-700">
                    <li>
                      Your <strong>refund will be processed</strong> within{" "}
                      <strong>7–10 business days</strong> to the original
                      payment method.
                    </li>
                    <li>
                      You&apos;ll receive a confirmation email once the refund has
                      been initiated.
                    </li>
                  </ul>
                </div>

                <div className="bg-[#C2E53A]/10 p-6 rounded-xl border border-[#C2E53A]/20">
                  <h3 className="flex items-center text-xl font-semibold text-gray-900">
                    <span className="mr-3">🚚</span> Return Shipping
                  </h3>
                  <ul className="mt-3 space-y-2 pl-10 list-disc text-gray-700">
                    <li>
                      Customers are responsible for{" "}
                      <strong>return shipping charges</strong>, unless the item
                      is defective or wrong.
                    </li>
                    <li>
                      We recommend using a{" "}
                      <strong>trackable shipping service</strong> for secure
                      returns.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="flex items-center text-xl font-semibold text-gray-900">
                    <span className="mr-3">📝</span> How to Request a Return
                  </h3>
                  <p className="mt-3 text-gray-700">
                    To request a return, please email us with the following
                    details:
                  </p>
                  <ul className="mt-3 space-y-2 pl-10 list-disc text-gray-700">
                    <li>
                      Your <strong>Order ID</strong>
                    </li>
                    <li>Reason for return</li>
                    <li>
                      If applicable, <strong>photos of the item</strong> (in
                      case of damage or incorrect product)
                    </li>
                  </ul>
                  <p className="mt-4 text-gray-700">
                    📧 Email: <strong>thearvan77@gmail.com</strong>
                  </p>
                </div>

                <div className="bg-[#C2E53A]/10 p-6 rounded-xl border border-[#C2E53A]/20">
                  <h3 className="flex items-center text-xl font-semibold text-gray-900">
                    <span className="mr-3">📍</span> Return Address
                  </h3>
                  <address className="mt-3 text-gray-700 not-italic">
                    <strong>Arvan</strong>
                    <br />
                    E-120, Sector 7<br />
                    Ground Floor
                    <br />
                    Noida, India
                  </address>
                </div>
              </div>
            ) : (
              <div className="space-y-8 font-montserrat">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-coluna text-gray-900">
                    Privacy Policy — Arvan
                  </h2>
                  <p className="text-gray-600 mt-3">
                    Welcome to <strong>Arvan</strong> — your trusted destination
                    for stylish and comfortable <strong>men&apos;s sliders</strong>{" "}
                    in India. Your privacy is important to us.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    1. Who We Are
                  </h3>
                  <p className="mt-3 text-gray-700">
                    <strong>Arvan</strong> is an Indian eCommerce brand focused
                    on providing high-quality sliders for men.
                  </p>
                  <p className="mt-3 text-gray-700">
                    <strong>Registered Address:</strong>
                    <br />
                    E-120, Sector 7, Noida — Ground Floor
                    <br />
                    <strong>Email:</strong> thearvan77@gmail.com
                  </p>
                </div>

                <div className="bg-[#C2E53A]/10 p-6 rounded-xl border border-[#C2E53A]/20">
                  <h3 className="text-xl font-semibold text-gray-900">
                    2. Information We Collect
                  </h3>
                  <p className="mt-3 text-gray-700">
                    When you use our website, we may collect the following
                    personal information:
                  </p>
                  <ul className="mt-3 space-y-2 pl-10 list-disc text-gray-700">
                    <li>Full Name</li>
                    <li>Shipping and Billing Address</li>
                    <li>Email Address</li>
                    <li>Phone Number</li>
                    <li>
                      Payment Information (processed securely through
                      third-party gateways)
                    </li>
                    <li>
                      Device and browser details (for website optimization)
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    3. How We Use Your Information
                  </h3>
                  <p className="mt-3 text-gray-700">
                    We use your personal data to:
                  </p>
                  <ul className="mt-3 space-y-2 pl-10 list-disc text-gray-700">
                    <li>Process and deliver your orders</li>
                    <li>Provide customer support</li>
                    <li>Send order updates and promotional offers</li>
                    <li>Improve your shopping experience</li>
                    <li>Ensure safe and secure transactions</li>
                  </ul>
                  <p className="mt-4 text-gray-700">
                    We <strong>do not share, rent, or sell</strong> your
                    personal information to third parties for marketing
                    purposes.
                  </p>
                </div>

                <div className="bg-[#C2E53A]/10 p-6 rounded-xl border border-[#C2E53A]/20">
                  <h3 className="text-xl font-semibold text-gray-900">
                    4. Cookies and Tracking
                  </h3>
                  <p className="mt-3 text-gray-700">We use cookies to:</p>
                  <ul className="mt-3 space-y-2 pl-10 list-disc text-gray-700">
                    <li>Remember your preferences</li>
                    <li>Improve site speed and performance</li>
                    <li>Analyze traffic and user behavior</li>
                  </ul>
                  <p className="mt-4 text-gray-700">
                    You can disable cookies through your browser settings, but
                    it may affect the website&apos;s functionality.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    5. Data Security
                  </h3>
                  <p className="mt-3 text-gray-700">
                    We take data protection seriously. Your personal details are
                    stored securely using encrypted servers and trusted payment
                    systems. We constantly update our security protocols to
                    prevent unauthorized access.
                  </p>
                </div>

                <div className="bg-[#C2E53A]/10 p-6 rounded-xl border border-[#C2E53A]/20">
                  <h3 className="text-xl font-semibold text-gray-900">
                    6. Third-Party Services
                  </h3>
                  <p className="mt-3 text-gray-700">
                    We may use reliable third-party services like:
                  </p>
                  <ul className="mt-3 space-y-2 pl-10 list-disc text-gray-700">
                    <li>Payment gateways</li>
                    <li>Shipping/courier partners</li>
                    <li>Marketing or analytics tools</li>
                  </ul>
                  <p className="mt-4 text-gray-700">
                    These services have their own privacy policies, and they
                    only access your data when necessary to perform their
                    functions.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    7. Your Rights
                  </h3>
                  <p className="mt-3 text-gray-700">You have the right to:</p>
                  <ul className="mt-3 space-y-2 pl-10 list-disc text-gray-700">
                    <li>Access your personal information</li>
                    <li>Update or correct your data</li>
                    <li>Request deletion of your data</li>
                    <li>Opt out of marketing emails</li>
                  </ul>
                  <p className="mt-4 text-gray-700">
                    To exercise any of these rights, contact us at{" "}
                    <strong>thearvan77@gmail.com</strong>.
                  </p>
                </div>

                <div className="bg-[#C2E53A]/10 p-6 rounded-xl border border-[#C2E53A]/20">
                  <h3 className="text-xl font-semibold text-gray-900">
                    8. Changes to This Policy
                  </h3>
                  <p className="mt-3 text-gray-700">
                    We may update this Privacy Policy from time to time. All
                    updates will be posted here, along with the new effective
                    date.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    9. Contact Information
                  </h3>
                  <p className="mt-3 text-gray-700">
                    If you have any questions about this policy or how your data
                    is used, feel free to reach out:
                  </p>
                  <p className="mt-4 text-gray-700">
                    📧 <strong>Email:</strong> thearvan77@gmail.com
                    <br />
                    🏢 <strong>Address:</strong> E-120, Sector 7, Noida — Ground
                    Floor
                    <br />
                    📅 <strong>Date:</strong> April 16, 2025
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
