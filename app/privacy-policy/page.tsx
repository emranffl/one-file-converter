import { LINKS } from "@/configs/router.config"
import Link from "next/link"
import { Metadata } from "next/types"

export const metadata: Metadata = {
  title: "Privacy Policy",
  openGraph: {
    images: {
      url: `/api/og-screenshot?view=${LINKS.PRIVACY_POLICY.home}`,
    },
  },
  twitter: {
    images: {
      url: `/api/og-screenshot?view=${LINKS.PRIVACY_POLICY.home}`,
    },
  },
}

const Page = () => {
  return (
    <section className="container">
      <div className="max-w-prose">
        <h1 className="mb-6 text-3xl font-bold">Privacy Policy for {process.env.NEXT_PUBLIC_APP_NAME}</h1>
        <p className="mb-4">Last Updated: November 2024</p>

        <p className="mb-4">
          Welcome to {process.env.NEXT_PUBLIC_APP_NAME} ("we," "our," or "us"). Your privacy is important to
          us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
          you visit our website,{" "}
          <Link href={process.env.NEXT_PUBLIC_APP_URL!} className="text-blue-600">
            the "Site"
          </Link>
          .
        </p>

        <h2 className="mb-4 text-xl font-bold">1. Information We Collect</h2>
        <h3 className="mb-2 text-lg font-bold">Personal Data</h3>
        <p className="mb-4">
          We do not collect any personal data directly through the usage of the Site. Any images or files you
          upload for conversion are processed in-memory and deleted immediately after conversion. No data is
          stored permanently on our servers.
        </p>
        <h3 className="mb-2 text-lg font-bold">Usage Data</h3>
        <p className="mb-4">
          We may collect non-personal information that your browser sends whenever you visit our Site ("Usage
          Data"). This may include your IP address, browser type, browser version, the pages you visit on our
          Site, the time and date of your visit, the time spent on those pages, and other diagnostic data.
        </p>

        <h2 className="mb-4 text-xl font-bold">2. How We Use Your Information</h2>
        <p className="mb-4">We use the collected information for the following purposes:</p>
        <ul className="mb-4 list-disc pl-6">
          <li>To operate and maintain the Site</li>
          <li>To monitor and analyze usage and trends to improve user experience</li>
          <li>To ensure the security of our services</li>
        </ul>

        <h2 className="mb-4 text-xl font-bold">3. Sharing Your Information</h2>
        <p className="mb-4">
          We do not sell, trade, or rent your personal information to third parties. We may share non-personal
          data with trusted third-party service providers to help us analyze how our Site is used and improve
          functionality.
        </p>

        <h2 className="mb-4 text-xl font-bold">4. Data Security</h2>
        <p className="mb-4">
          We take the security of your files and data seriously. We implement appropriate technical and
          organizational measures to safeguard your data during upload, processing, and conversion. Uploaded
          files are processed in-memory and not stored on our servers after the conversion is complete.
        </p>

        <h2 className="mb-4 text-xl font-bold">5. Cookies and Tracking Technologies</h2>
        <p className="mb-4">
          We do not use cookies to store any personal data or track users. However, third-party services
          integrated into our Site, such as analytics providers, may use cookies and other tracking
          technologies.
        </p>

        <h2 className="mb-4 text-xl font-bold">6. Third-Party Services</h2>
        <p className="mb-4">
          Our Site may contain links to third-party services. We are not responsible for the content, privacy
          policies, or practices of any third-party services. We encourage users to read the privacy policies
          of any linked websites.
        </p>

        <h2 className="mb-4 text-xl font-bold">7. Children's Privacy</h2>
        <p className="mb-4">
          Our services are not intended for use by children under the age of 13. We do not knowingly collect
          personal data from children. If we become aware that we have inadvertently collected data from a
          child under 13, we will take steps to delete such information promptly.
        </p>

        <h2 className="mb-4 text-xl font-bold">8. Changes to This Privacy Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. We will notify users of any changes by posting
          the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for
          any changes.
        </p>

        <h2 className="mb-4 text-xl font-bold">9. Contact Us</h2>
        <p className="mb-4">If you have any questions about this Privacy Policy, please contact us:</p>
        <ul className="mb-4 list-disc pl-6">
          <li>By email: support@{process.env.HOST!.replace("www.", "")}</li>
        </ul>
        <p className="mb-4">
          Thank you for using {process.env.NEXT_PUBLIC_APP_NAME}. Your privacy and trust are paramount to us.
        </p>
      </div>
    </section>
  )
}

export default Page
