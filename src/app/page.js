import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">

      {/* Main Title */}
      <h1 className="text-4xl font-bold text-gray-800 text-center">
        Applicant Tracking System Dostu
        <br />
        <span className="text-blue-600">Özgeçmiş Oluştur</span>
      </h1>

      {/* Description */}
      <p className="mt-4 text-gray-500 text-center max-w-md">
        ATS uyumlu, metin tabanlı CV'ni kolayca oluştur ve PDF olarak indir.
      </p>

      {/* CTA Button */}
      <Link href="/builder">
        <button className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700">
          CV Oluştur
        </button>
      </Link>

    </div>
  );
}