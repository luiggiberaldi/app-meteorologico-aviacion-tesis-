"use client";

import { Users, Shield, UserCheck, UserX, Search, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function UsuariosPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Datos base simulados + el usuario real logueado al inicio
  const usuariosData = [
    {
      id: "real-user",
      nombre: user?.displayName || user?.username || "Usuario Actual",
      rol: "Administrador",
      rolColor: "bg-red-500/20 text-red-400 border-red-500/30",
      estado: "Activo",
      estadoColor: "text-green-400",
      ultimaConexion: new Date().toLocaleString("es-VE", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) + " UTC",
      email: user?.username || "sin-usuario",
    },
    { id: "2", nombre: "Tte. Luis Castillo", rol: "Operador", rolColor: "bg-blue-500/20 text-blue-400 border-blue-500/30", estado: "Activo", estadoColor: "text-green-400", ultimaConexion: "12 Mar 2026, 11:30 UTC", email: "l.castillo@amb.mil.ve" },
    { id: "3", nombre: "Cap. Andrea Méndez", rol: "Operador", rolColor: "bg-blue-500/20 text-blue-400 border-blue-500/30", estado: "Activo", estadoColor: "text-green-400", ultimaConexion: "11 Mar 2026, 18:20 UTC", email: "a.mendez@amb.mil.ve" },
    { id: "4", nombre: "Tte. Carlos Pérez", rol: "Observador", rolColor: "bg-gray-500/20 text-gray-400 border-gray-500/30", estado: "Activo", estadoColor: "text-green-400", ultimaConexion: "11 Mar 2026, 15:00 UTC", email: "c.perez@amb.mil.ve" },
    { id: "5", nombre: "Sgto. María López", rol: "Observador", rolColor: "bg-gray-500/20 text-gray-400 border-gray-500/30", estado: "Inactivo", estadoColor: "text-red-400", ultimaConexion: "05 Mar 2026, 09:10 UTC", email: "m.lopez@amb.mil.ve" },
    { id: "6", nombre: "Tte. Jorge Ramírez", rol: "Operador", rolColor: "bg-blue-500/20 text-blue-400 border-blue-500/30", estado: "Activo", estadoColor: "text-green-400", ultimaConexion: "10 Mar 2026, 14:55 UTC", email: "j.ramirez@amb.mil.ve" },
  ];

  const filteredUsers = usuariosData.filter(u =>
    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.rol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-1">GESTIÓN DE USUARIOS</h2>
        <p className="text-gray-400 text-sm">Control de acceso, roles y permisos de los usuarios registrados en el sistema SERMETAVIA.</p>
      </div>

      {/* Sesión actual */}
      {user && (
        <div className="bg-emerald-900/20 border border-emerald-600/30 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-300 text-sm font-bold">
            {(user.displayName || user.username || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              Sesión activa: <span className="text-emerald-300">{user.displayName || user.username}</span>
            </p>
            <p className="text-xs text-gray-400">@{user.username}</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            EN LÍNEA
          </span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#1e293b] border border-gray-700 rounded-xl p-4 text-center">
          <Users size={22} className="text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{usuariosData.length}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Total Usuarios</p>
        </div>
        <div className="bg-[#1e293b] border border-gray-700 rounded-xl p-4 text-center">
          <UserCheck size={22} className="text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{usuariosData.filter(u => u.estado === "Activo").length}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Activos</p>
        </div>
        <div className="bg-[#1e293b] border border-gray-700 rounded-xl p-4 text-center">
          <UserX size={22} className="text-red-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{usuariosData.filter(u => u.estado === "Inactivo").length}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Inactivos</p>
        </div>
        <div className="bg-[#1e293b] border border-gray-700 rounded-xl p-4 text-center">
          <Shield size={22} className="text-red-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{usuariosData.filter(u => u.rol === "Administrador").length}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Admins</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar por nombre, rol o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#1e293b] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="bg-[#1e293b] border border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 bg-[#0f172a]/50">
                <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Usuario</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Rol</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Estado</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest hidden md:table-cell">Última Conexión</th>
                <th className="text-right px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className={`border-b border-gray-700/50 hover:bg-[#263548] transition-colors ${u.id === 'real-user' ? 'bg-emerald-900/10' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${u.id === 'real-user' ? 'bg-emerald-600/30 border border-emerald-500/50 text-emerald-300' : 'bg-gray-700 text-gray-300'}`}>
                        {u.nombre.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{u.nombre} {u.id === 'real-user' && <span className="text-[9px] text-emerald-400 ml-1">(TÚ)</span>}</p>
                        <p className="text-gray-500 text-[11px]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${u.rolColor}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold ${u.estadoColor} flex items-center gap-1.5`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.estado === "Activo" ? "bg-green-400" : "bg-red-400"}`}></span>
                      {u.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-gray-400 text-xs">{u.ultimaConexion}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-[10px] text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 px-2 py-1 rounded transition-colors mr-1">Editar</button>
                    {u.id !== 'real-user' && (
                      <button className="text-[10px] text-red-400/60 hover:text-red-400 border border-red-500/20 hover:border-red-500/40 px-2 py-1 rounded transition-colors">Desactivar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
