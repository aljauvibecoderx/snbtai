import { Helmet } from 'react-helmet';

export const SEOHelmet = ({ 
  title = "SNBT AI - Platform Belajar SNBT Berbasis AI",
  description = "Platform pembelajaran SNBT terlengkap dengan AI Generator, Tryout Profesional, IRT Scoring, dan Bank Soal 10K+. Gratis untuk siswa Indonesia!",
  keywords = "snbt, utbk, belajar snbt, tryout snbt, soal snbt, ai generator soal, irt scoring, ptn, universitas",
  image = "https://snbtai.xyz/og-image.jpg",
  url = "https://snbtai.xyz"
}) => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Bagaimana AI membantu belajar SNBT?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AI Generator SNBT AI dapat membuat soal berkualitas dari teks atau gambar yang kamu upload. Sistem AI menganalisis materi dan menghasilkan soal sesuai kisi-kisi SNBT resmi dengan 5 level kesulitan."
        }
      },
      {
        "@type": "Question",
        "name": "Apakah soal yang dihasilkan akurat?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ya! Soal dibuat mengikuti kisi-kisi SNBT resmi dengan 7 subtes (TPS, Literasi Indonesia, Literasi Inggris, Penalaran Matematika) dan menggunakan IRT Scoring profesional (200-800) seperti SNBT asli."
        }
      },
      {
        "@type": "Question",
        "name": "Bagaimana cara top-up koin Mayar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pilih paket koin di halaman Pricing, klik 'Mulai Sekarang', lalu ikuti instruksi pembayaran melalui Mayar. Koin akan otomatis masuk ke akun kamu setelah pembayaran berhasil."
        }
      },
      {
        "@type": "Question",
        "name": "Apakah SNBT AI benar-benar gratis?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ya! Kamu bisa generate 19 soal/hari gratis dengan login. Tanpa login tetap dapat 1 soal/hari. Akses bank soal, tryout, dan fitur dasar lainnya juga gratis."
        }
      },
      {
        "@type": "Question",
        "name": "Apa itu IRT Scoring?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Item Response Theory adalah sistem penilaian profesional (200-800) yang digunakan SNBT asli. Lebih akurat dari scoring biasa karena mempertimbangkan tingkat kesulitan soal dan kemampuan peserta."
        }
      }
    ]
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "SNBT AI",
    "description": "Platform pembelajaran SNBT berbasis AI",
    "url": url,
    "logo": `${url}/logo.png`,
    "sameAs": [
      "https://instagram.com/snbtai",
      "https://twitter.com/snbtai",
      "https://facebook.com/snbtai"
    ]
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="SNBT AI" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
    </Helmet>
  );
};
