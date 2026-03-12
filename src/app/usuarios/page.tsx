"use client";

import { Users, Shield, UserCheck, UserX, Search } from "lucide-react";
import { useState } from "react";

const usuariosData = [
  { id: 1, nombre: "Cnel. Marcos Rodríguez", rol: "Administrador", rolColor: "bg-red-500/20 text-red-400 border-red-500/30", estado: "Activo", estadoColor: "text-green-400", ultimaConexion: "12 Mar 2026, 10:45 UTC", email: "m.rodriguez@amb.mil.ve" },
  { id: 2, nombre: "Tte. Luis Castillo", rol: "Operador", rolColor: "bg-blue-500/20 text-blue-400 border-blue-500/30", estado: "Activo", estadoColor: "text-green-400", ultimaConexion: "12 Mar 2026, 11:30 UTC", email: "l.castillo@amb.mil.ve" },
  { id: 3, nombre: "Cap. Andrea Méndez", rol: "Operador", rolColor: "bg-blue-500/20 text-blue-400 border-blue-500/30", estado: "Activo", estadoColor: "text-green-400", ultimaConexion: "11 Mar 2026, 18:20 UTC", email: "a.mendez@amb.mil.ve" },
  { id: 4, nombre: "Tte. Carlos Pérez", rol: "Observador", rolColor: "bg-gray-500/20 text-gray-400 border-gray-500/30", estado: "Activo", estadoColor: "text-green-400", ultimaConexion: "11 Mar 2026, 15:00 UTC", email: "c.perez@amb.mil.ve" },
  { id: 5, nombre: "Sgto. María López", rol: "Observador", rolColor: "bg-gray-500/20 text-gray-400 border-gray-500/30", estado: "Inactivo", estadoColor: "text-red-400", ultimaConexion: "05 Mar 2026, 09:10 UTC", email: "m.lopez@amb.mil.ve" },
  { id: 6, nombre: "Tte. Jorge Ramírez", rol: "Operador", rolColor: "bg-blue-500/20 text-blue-400 border-blue-500/30", estado: "Activo", estadoColor: "text-green-400", ultimaConexion: "10 Mar 2026, 14:55 UTC", email: "j.ramirez@amb.mil.ve" },
];

export default function UsuariosPage() {
  const [searchTerm, setSearchTerm] = useState("");

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
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-700/50 hover:bg-[#263548] transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-white text-sm font-medium">{user.nombre}</p>
                    <p className="text-gray-500 text-[11px]">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${user.rolColor}`}>
                      {user.rol}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold ${user.estadoColor} flex items-center gap-1.5`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.estado === "Activo" ? "bg-green-400" : "bg-red-400"}`}></span>
                      {user.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-gray-400 text-xs">{user.ultimaConexion}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-[10px] text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 px-2 py-1 rounded transition-colors mr-1">Editar</button>
                    <button className="text-[10px] text-red-400/60 hover:text-red-400 border border-red-500/20 hover:border-red-500/40 px-2 py-1 rounded transition-colors">Desactivar</button>
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
