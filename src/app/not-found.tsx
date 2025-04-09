import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-base-100 p-4">
      <div className="text-center max-w-md lg:max-w-2xl">
        {/* Animated 404 text */}
        <div className="relative">
          <h1 className="text-9xl font-bold text-primary opacity-20">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-4xl font-bold text-base-content">Page Not Found</h2>
          </div>
        </div>

        {/* Description */}
        <p className="mt-6 text-lg text-base-content/80">Oops! The page you're looking for doesn't exist or has been moved.</p>

        {/* Illustration */}
        <div className="my-8 flex justify-center">
          <svg
            width="300"
            height="200"
            viewBox="0 0 500 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary"
          >
            <path
              d="M100 150C100 89.452 149.452 40 210 40C270.548 40 320 89.452 320 150C320 210.548 270.548 260 210 260C149.452 260 100 210.548 100 150Z"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray="20 10"
            />
            <path
              d="M210 100L210 150M210 150L240 180M210 150L180 180"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M400 150C400 200 370 250 300 250C230 250 200 200 200 150"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path d="M300 150L300 100" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          </svg>
        </div>

        {/* Back to dashboard button */}
        <Link
          href="/admin/dashboard"
          className="btn btn-primary px-8 flex items-center rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
