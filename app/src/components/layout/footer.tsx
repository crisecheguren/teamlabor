import Link from "next/link";

const footerLinks = {
  main: [
    { name: "Politicians", href: "/politicians" },
    { name: "Resources", href: "/resources" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
  ],
  resources: [
    { name: "Unionizing Guide", href: "/resources#unionizing" },
    { name: "Know Your Rights", href: "/resources#rights" },
    { name: "Find Your Rep", href: "/politicians" },
    { name: "Grading Methodology", href: "/about#methodology" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Use", href: "/terms" },
    { name: "Data Sources", href: "/about#data-sources" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-labor-navy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">Team</span>
              <span className="text-2xl font-bold text-labor-red">Labor</span>
            </div>
            <p className="text-sm text-gray-300">
              Empowering workers through transparency, accountability, and
              collective action.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Navigate
            </h3>
            <ul className="space-y-2">
              {footerLinks.main.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Resources
            </h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-gray-700 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Team Labor. Built with ✊ for workers
              everywhere.
            </p>
            <p className="text-xs text-gray-500">
              Data sourced from public records. Not affiliated with any
              political party.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
