import React from 'react';

const UniversityMarquee = ({ universities = ['UI', 'ITB', 'UGM', 'ITS', 'UNPAD', 'UNDIP', 'UNAIR', 'IPB'] }) => {
  return (
    <section className="py-16 bg-slate-50 border-y border-slate-100 overflow-hidden">
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee-container {
          display: flex;
          overflow: hidden;
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }

        .marquee-content {
          display: flex;
          animation: marquee 25s linear infinite;
          will-change: transform;
        }

        .marquee-container:hover .marquee-content {
          animation-play-state: paused;
        }

        .marquee-item {
          flex-shrink: 0;
          padding: 0 2rem;
          font-size: 1.875rem;
          font-weight: 700;
          color: rgb(203, 213, 225);
          transition: color 0.3s ease;
          cursor: pointer;
          white-space: nowrap;
        }

        .marquee-item:hover {
          color: rgb(148, 163, 184);
        }
      `}</style>

      <div className="text-center mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Dipercayai oleh siswa dari
        </p>
      </div>

      <div className="marquee-container">
        <div className="marquee-content">
          {[...universities, ...universities].map((uni, idx) => (
            <div key={idx} className="marquee-item">
              {uni}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UniversityMarquee;
