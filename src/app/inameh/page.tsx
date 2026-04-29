"use client";

import { useState, useRef } from 'react';
import {
  Tv2, RefreshCw, ExternalLink, CloudRain, Eye, Droplets, CloudLightning,
  Play, Pause, Volume2, VolumeX, Maximize2, Clock, Radio
} from 'lucide-react';

const PROXY = 'https://inameh-proxy-jgr7uk.camelai.app';

const VIDEOS = [
  {
    id: 'satir',
    title: 'Infrarrojo + GML',
    description: 'Canal infrarrojo combinado con realce de temperatura de topes nubosos',
    icon: CloudLightning,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    accent: '#f97316',
  },
  {
    id: 'satcos',
    title: 'Visible',
    description: 'Imagen satelital en canal visible — reflectividad solar de la nubosidad',
    icon: Eye,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    accent: '#38bdf8',
  },
  {
    id: 'satva',
    title: 'Vapor de Agua',
    description: 'Distribución del vapor de agua en la tropósfera media y alta',
    icon: Droplets,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    accent: '#60a5fa',
  },
  {
    id: 'centro',
    title: 'Lluvia Estimada',
    description: 'Estimación cuantitativa de precipitación derivada del satélite GOES-16',
    icon: CloudRain,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    accent: '#34d399',
  },
];

function VideoCard({ video, isActive, onClick }: { video: typeof VIDEOS[0]; isActive: boolean; onClick: () => void }) {
  const Icon = video.icon;
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-xl border transition-all ${
        isActive
          ? `${video.bg} ${video.border} ring-1 ring-inset`
          : 'bg-[#1e293b] border-gray-700/50 hover:border-gray-600'
      }`}
      style={isActive ? { '--tw-ring-color': video.accent } as React.CSSProperties : {}}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isActive ? video.bg : 'bg-[#0f172a]'} border ${isActive ? video.border : 'border-gray-700'}`}>
          <Icon size={16} className={isActive ? video.color : 'text-gray-500'} />
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-gray-300'}`}>{video.title}</p>
          <p className="text-[10px] text-gray-500 truncate hidden lg:block">{video.description}</p>
        </div>
      </div>
    </button>
  );
}

function VideoPlayer({ video }: { video: typeof VIDEOS[0] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [key, setKey] = useState(0);

  const src = `${PROXY}/${video.id}.mp4`;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) { videoRef.current.play(); setPlaying(true); }
    else { videoRef.current.pause(); setPlaying(false); }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  const fullscreen = () => videoRef.current?.requestFullscreen?.();

  const reload = () => {
    setError(false);
    setLoading(true);
    setPlaying(false);
    setKey(k => k + 1);
  };

  const Icon = video.icon;

  return (
    <div className="flex flex-col h-full">
      {/* Header del video */}
      <div className={`flex items-center gap-3 p-4 border-b border-gray-700/50 ${video.bg}`}>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${video.bg} border ${video.border}`}>
          <Icon size={18} className={video.color} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-bold text-sm">{video.title}</h2>
          <p className="text-gray-400 text-xs truncate">{video.description}</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 shrink-0">
          <Radio size={10} className="text-emerald-400 animate-pulse" />
          <span>INAMEH · GOES-16</span>
        </div>
      </div>

      {/* Video */}
      <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px]">
        {loading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0a0f1a] z-10">
            <div className="w-10 h-10 border-2 border-gray-700 border-t-emerald-400 rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Cargando animación satelital...</p>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0a0f1a] z-10">
            <div className="w-12 h-12 rounded-full bg-red-900/30 border border-red-500/30 flex items-center justify-center">
              <Icon size={22} className="text-red-400" />
            </div>
            <div className="text-center">
              <p className="text-red-400 text-sm font-medium">Error al cargar el video</p>
              <p className="text-gray-500 text-xs mt-1">El servidor INAMEH puede estar temporalmente inactivo</p>
            </div>
            <button onClick={reload} className="flex items-center gap-2 bg-[#1e293b] hover:bg-[#263548] border border-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors">
              <RefreshCw size={14} /> Reintentar
            </button>
          </div>
        )}
        <video
          key={key}
          ref={videoRef}
          className="w-full h-full object-contain"
          muted={muted}
          loop
          autoPlay
          playsInline
          preload="auto"
          onCanPlay={() => setLoading(false)}
          onError={() => { setLoading(false); setError(true); }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src={src} type="video/mp4" />
        </video>

        {/* Controles overlay */}
        {!loading && !error && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex items-center gap-2">
            <button onClick={togglePlay} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              {playing ? <Pause size={14} className="text-white" /> : <Play size={14} className="text-white ml-0.5" />}
            </button>
            <button onClick={toggleMute} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              {muted ? <VolumeX size={14} className="text-white" /> : <Volume2 size={14} className="text-white" />}
            </button>
            <div className="flex-1" />
            <a href={src} target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <ExternalLink size={13} className="text-white" />
            </a>
            <button onClick={fullscreen} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <Maximize2 size={13} className="text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InamehPage() {
  const [activeId, setActiveId] = useState('satir');
  const activeVideo = VIDEOS.find(v => v.id === activeId)!;

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Tv2 size={18} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">DATOS INAMEH</h2>
            <p className="text-gray-400 text-xs">Satélite GOES-16 · Instituto Nacional de Meteorología e Hidrología</p>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-center gap-3 bg-[#1e293b] border border-gray-700/50 rounded-xl p-3">
        <Clock size={15} className="text-yellow-400 shrink-0" />
        <p className="text-xs text-gray-400">
          Las animaciones son publicadas por INAMEH aproximadamente <span className="text-white font-medium">4 veces al día</span>. El contenido se actualiza automáticamente desde el servidor de INAMEH.
        </p>
      </div>

      {/* Layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

        {/* Selector de canales */}
        <div className="lg:col-span-1 space-y-2">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Canales disponibles</p>
          {VIDEOS.map(v => (
            <VideoCard key={v.id} video={v} isActive={activeId === v.id} onClick={() => setActiveId(v.id)} />
          ))}

          {/* Fuente */}
          <div className="mt-4 p-3 bg-[#0f172a] rounded-xl border border-gray-800">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Fuente</p>
            <a
              href="http://www.inameh.gob.ve/web/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <ExternalLink size={12} />
              www.inameh.gob.ve
            </a>
            <p className="text-[10px] text-gray-600 mt-1">Satélite GOES-16 / NOAA</p>
          </div>
        </div>

        {/* Reproductor principal */}
        <div className="lg:col-span-3 bg-[#1e293b] border border-gray-700/50 rounded-xl overflow-hidden" style={{ minHeight: 420 }}>
          <VideoPlayer key={activeId} video={activeVideo} />
        </div>
      </div>

      {/* Grid de miniaturas de los otros videos */}
      <div>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Vista rápida — todos los canales</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {VIDEOS.map(v => {
            const Icon = v.icon;
            return (
              <button
                key={v.id}
                onClick={() => setActiveId(v.id)}
                className={`relative rounded-xl overflow-hidden border transition-all group ${
                  activeId === v.id ? `${v.border} ring-1` : 'border-gray-700/50 hover:border-gray-600'
                }`}
                style={activeId === v.id ? { '--tw-ring-color': v.accent } as React.CSSProperties : {}}
              >
                <video
                  muted
                  loop
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="w-full aspect-video object-cover bg-black"
                >
                  <source src={`${PROXY}/${v.id}.mp4`} type="video/mp4" />
                </video>
                <div className={`absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 to-transparent`}>
                  <div className="flex items-center gap-1.5">
                    <Icon size={11} className={v.color} />
                    <span className="text-white text-[11px] font-semibold">{v.title}</span>
                  </div>
                </div>
                {activeId === v.id && (
                  <div className={`absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse`} style={{ background: v.accent }} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
