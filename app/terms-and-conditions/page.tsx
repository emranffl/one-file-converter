import { LINKS } from "@/configs/router.config"
import Link from "next/link"
import { Metadata } from "next/types"

export const metadata: Metadata = {
  title: "Terms and Conditions",
  openGraph: {
    images: {
      url: `/api/og-screenshot?view=${LINKS.TERMS_AND_CONDITIONS.home}`,
    },
  },
  twitter: {
    images: {
      url: `/api/og-screenshot?view=${LINKS.TERMS_AND_CONDITIONS.home}`,
    },
  },
}

const Page = () => {
  return (
    <section className="container">
      <div className="max-w-prose">
        <h1 className="mb-6 text-3xl font-bold">Terms and Conditions</h1>

        <p className="mb-4">
          Welcome to {process.env.NEXT_PUBLIC_APP_NAME} ("we," "our," or "us"). By accessing or using our website,{" "}
          <Link href={process.env.NEXT_PUBLIC_APP_URL!} className="text-blue-600">
            the "Site"
          </Link>
          , you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree with these Terms, please
          do not use the Site.
        </p>

        <h2 className="mb-4 text-xl font-bold">1. Acceptance of Terms</h2>
        <p className="mb-4">
          These Terms govern your use of the Site and the services provided therein (the "Services"), including the
          conversion of files you upload. We may update these Terms from time to time by posting the revised version on
          this page. Your continued use of the Site after such changes constitutes your acceptance of the updated Terms.
        </p>

        <h2 className="mb-4 text-xl font-bold">2. Use of the Services</h2>
        <h3 className="mb-2 text-lg font-bold">2.1 Eligibility</h3>
        <p className="mb-4">
          You must be at least 13 years of age to use the Site. By using the Services, you represent and warrant that
          you meet this requirement and have the legal capacity to enter into these Terms.
        </p>
        <h3 className="mb-2 text-lg font-bold">2.2 Permitted Use</h3>
        <p className="mb-4">
          You may use the Site to convert files in accordance with these Terms. The Services are provided for personal,
          non-commercial use unless otherwise agreed in writing by us.
        </p>
        <h3 className="mb-2 text-lg font-bold">2.3 Prohibited Use</h3>
        <p className="mb-4">You agree not to:</p>
        <ul className="mb-4 list-disc pl-6">
          <li>Use the Site for any illegal, harmful, or unauthorized purpose.</li>
          <li>Upload files that contain viruses, malware, or any other harmful code.</li>
          <li>Attempt to interfere with, disrupt, or gain unauthorized access to the Site or its servers.</li>
          <li>Use the Site to infringe on any third-party rights, including intellectual property rights.</li>
          <li>
            Overload or abuse the Site’s infrastructure in a way that affects its performance or availability to other
            users.
          </li>
        </ul>
        <p className="mb-4">
          We reserve the right to suspend or terminate your access to the Site at our sole discretion if we believe you
          have violated these Terms.
        </p>

        <h2 className="mb-4 text-xl font-bold">3. User-Uploaded Content</h2>
        <h3 className="mb-2 text-lg font-bold">3.1 Ownership and Responsibility</h3>
        <p className="mb-4">
          You retain ownership of any files you upload to the Site ("User Content"). You are solely responsible for
          ensuring that your User Content complies with applicable laws and does not violate the rights of any third
          party (e.g., copyright, trademark, privacy).
        </p>
        <h3 className="mb-2 text-lg font-bold">3.2 Processing of User Content</h3>
        <p className="mb-4">
          By uploading files to the Site, you grant us a limited, non-exclusive, royalty-free license to process your
          User Content solely for the purpose of providing the Services (e.g., converting your files). We do not store
          your User Content after the conversion process is complete, as outlined in our Privacy Policy.
        </p>
        <h3 className="mb-2 text-lg font-bold">3.3 Prohibited Content</h3>
        <p className="mb-4">
          You may not upload User Content that is illegal, obscene, defamatory, threatening, or otherwise objectionable,
          or that violates any intellectual property rights or applicable laws. We may refuse to process any User
          Content that violates these Terms or for any other reason at our discretion.
        </p>

        <h2 className="mb-4 text-xl font-bold">4. Intellectual Property</h2>
        <h3 className="mb-2 text-lg font-bold">4.1 Our Rights</h3>
        <p className="mb-4">
          The Site, including its design, code, branding, and content (excluding User Content), is owned by{" "}
          {process.env.NEXT_PUBLIC_APP_NAME} or its licensors and is protected by copyright, trademark, and other
          intellectual property laws. You may not copy, modify, distribute, or create derivative works of the Site
          without our prior written consent.
        </p>
        <h3 className="mb-2 text-lg font-bold">4.2 Your Rights</h3>
        <p className="mb-4">
          We do not claim ownership of your User Content. However, you grant us the necessary permissions to process it
          as described in Section 3.2.
        </p>

        <h2 className="mb-4 text-xl font-bold">5. Disclaimers</h2>
        <h3 className="mb-2 text-lg font-bold">5.1 "As Is" Service</h3>
        <p className="mb-4">
          The Site and Services are provided on an "as is" and "as available" basis without warranties of any kind,
          express or implied, including but not limited to warranties of merchantability, fitness for a particular
          purpose, or non-infringement. We do not guarantee that the Site will be error-free, uninterrupted, or secure.
        </p>
        <h3 className="mb-2 text-lg font-bold">5.2 Conversion Results</h3>
        <p className="mb-4">
          We strive to provide accurate file conversions, but we do not guarantee the quality, compatibility, or
          integrity of converted files. You are responsible for verifying the results of any conversion.
        </p>

        <h2 className="mb-4 text-xl font-bold">6. Limitation of Liability</h2>
        <p className="mb-4">
          To the fullest extent permitted by law, {process.env.NEXT_PUBLIC_APP_NAME}, its affiliates, and its officers,
          directors, employees, or agents shall not be liable for any indirect, incidental, special, consequential, or
          punitive damages arising from your use of the Site or Services, including but not limited to loss of data,
          profits, or business opportunities. Our total liability to you for any claim shall not exceed $50 USD.
        </p>

        <h2 className="mb-4 text-xl font-bold">7. Indemnification</h2>
        <p className="mb-4">
          You agree to indemnify, defend, and hold harmless {process.env.NEXT_PUBLIC_APP_NAME} and its affiliates,
          officers, directors, employees, and agents from any claims, damages, losses, or expenses (including legal
          fees) arising out of your use of the Site, your User Content, or your violation of these Terms or applicable
          laws.
        </p>

        <h2 className="mb-4 text-xl font-bold">8. Termination</h2>
        <p className="mb-4">
          We may suspend or terminate your access to the Site at any time, with or without notice, for any reason,
          including if we believe you have violated these Terms. Upon termination, your right to use the Services will
          cease immediately.
        </p>

        <h2 className="mb-4 text-xl font-bold">9. Governing Law and Dispute Resolution</h2>
        <p className="mb-4">
          These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United
          States, without regard to its conflict of law principles. Any disputes arising from these Terms or your use of
          the Site shall be resolved through binding arbitration in Delaware, except that either party may seek
          injunctive relief in a court of competent jurisdiction.
        </p>

        <h2 className="mb-4 text-xl font-bold">10. Third-Party Links</h2>
        <p className="mb-4">
          The Site may contain links to third-party websites or services. We are not responsible for the content,
          availability, or practices of these third parties, and your use of such links is at your own risk.
        </p>

        <h2 className="mb-4 text-xl font-bold">11. Changes to the Services</h2>
        <p className="mb-4">
          We reserve the right to modify, suspend, or discontinue the Site or Services (or any part thereof) at any
          time, with or without notice. We shall not be liable to you or any third party for any such changes.
        </p>

        <h2 className="mb-4 text-xl font-bold">12. Contact Us</h2>
        <p className="mb-4">If you have any questions about these Terms, please contact us:</p>
        <ul className="mb-4 list-disc pl-6">
          <li>
            By email:{" "}
            <a href={`mailto:support@${process.env.HOST!.replace("www.", "")}`} className="text-blue-600">
              support@{process.env.HOST!.replace("www.", "")}
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}

export default Page
