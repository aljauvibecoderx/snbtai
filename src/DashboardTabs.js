import React from 'react';
import { Helmet } from 'react-helmet';

// Overview Tab
export const OverviewTab = ({ stats, myQuestions, onViewDetail }) => {
  return (
    <>
      <Helmet>
        <title>Overview - Dashboard SNBT AI</title>
        <meta name="description" content="Lihat ringkasan statistik belajar dan progress SNBT Anda" />
        <link rel="canonical" href={`${window.location.origin}/dashboard/overview`} />
      </Helmet>
      {/* Content will be rendered by DashboardView */}
    </>
  );
};

// AI Lens Tab
export const AILensTab = () => {
  return (
    <>
      <Helmet>
        <title>AI Lens - Generate Soal dari Gambar | SNBT AI</title>
        <meta name="description" content="Upload gambar soal dan generate soal SNBT otomatis menggunakan AI Vision" />
        <link rel="canonical" href={`${window.location.origin}/dashboard/ai-lens`} />
      </Helmet>
      {/* Content will be rendered by DashboardView */}
    </>
  );
};

// Official Tryouts Tab
export const OfficialTryoutsTab = () => {
  return (
    <>
      <Helmet>
        <title>Tryout Resmi SNBT | SNBT AI</title>
        <meta name="description" content="Akses tryout resmi SNBT dengan sistem penilaian IRT dan analisis mendalam" />
        <link rel="canonical" href={`${window.location.origin}/dashboard/official-tryouts`} />
      </Helmet>
      {/* Content will be rendered by DashboardView */}
    </>
  );
};

// My Questions Tab
export const MyQuestionsTab = () => {
  return (
    <>
      <Helmet>
        <title>Soal Saya - Kelola Soal SNBT | SNBT AI</title>
        <meta name="description" content="Kelola dan review soal SNBT yang telah Anda buat dengan AI" />
        <link rel="canonical" href={`${window.location.origin}/dashboard/my-questions`} />
      </Helmet>
      {/* Content will be rendered by DashboardView */}
    </>
  );
};

// Question Bank Tab
export const QuestionBankTab = () => {
  return (
    <>
      <Helmet>
        <title>Bank Soal SNBT Publik | SNBT AI</title>
        <meta name="description" content="Akses ribuan soal SNBT berkualitas dari bank soal publik" />
        <link rel="canonical" href={`${window.location.origin}/dashboard/question-bank`} />
      </Helmet>
      {/* Content will be rendered by DashboardView */}
    </>
  );
};

// History Tab
export const HistoryTab = () => {
  return (
    <>
      <Helmet>
        <title>Riwayat Latihan - Track Progress SNBT | SNBT AI</title>
        <meta name="description" content="Lihat riwayat latihan dan track progress belajar SNBT Anda" />
        <link rel="canonical" href={`${window.location.origin}/dashboard/history`} />
      </Helmet>
      {/* Content will be rendered by DashboardView */}
    </>
  );
};
