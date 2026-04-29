"use client";

import { Users, Shield, UserCheck, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth, UserAccount } from "@/context/AuthContext";

export default function UsuariosPage() {
  const { user, getAllUsers } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState<UserAccount[]>([]);

  useEffect(() => {
    getAllUsers().then(setAllUsers);
  }, [getAllUsers]);

  const usuariosData = allUsers.map((u, i) => ({
    id: u.username,
    nombre: u.displayName,
    usuario: u.username,
    rol: i === 0 ? "Operador" : "Operador",
    rolColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    estado: "Activo",
    estadoColor: "text-green-400",
    isCurrent: user?.username === u.username,
  }));

  const filteredUsers = usuariosData.filter(u =>
    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.rol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-1">GESTIÓN DE USUARIOS</h2>
        <p className="text-gray-400 text-sm">Control de acceso y usuarios registrados en el sistema AEROMETRIX.</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#1e293b] border border-gray-700 rounded-xl p-4 text-center">
          <Users size={22} className="text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{allUsers.length}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Total Usuarios</p>
        </div>
        <div className="bg-[#1e293b] border border-gray-700 rounded-xl p-4 text-center">
          <UserCheck size={22} className="text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{allUsers.length}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Activos</p>
        </div>
        <div className="bg-[#1e293b] border border-gray-700 rounded-xl p-4 text-center">
          <Shield size={22} className="text-emerald-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">1</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">En Línea</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar por nombre o usuario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#1e293b] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent"
        />
      </div>

      {/* Users List (Responsiva en vez de tabla) */}
      <div className="bg-[#1e293b] border border-gray-700 rounded-xl overflow-hidden divide-y divide-gray-700/50">
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-[#0f172a]/50 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          <div className="col-span-6">Usuario</div>
          <div className="col-span-3">Rol</div>
          <div className="col-span-3">Estado</div>
        </div>
        
        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No se encontraron usuarios...</div>
        ) : (
          filteredUsers.map((u) => (
            <div key={u.id} className={`p-4 flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 hover:bg-[#263548] transition-colors ${u.isCurrent ? 'bg-emerald-900/10' : ''}`}>
              <div className="col-span-6 flex items-center gap-3">
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-sm font-bold ${u.isCurrent ? 'bg-emerald-600/30 border border-emerald-500/50 text-emerald-300' : 'bg-gray-700 text-gray-300'}`}>
                  {u.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate flex items-center gap-2">
                    {u.nombre}
                    {u.isCurrent && <span className="shrink-0 text-[9px] text-emerald-400 border border-emerald-500/30 px-1 rounded bg-emerald-900/40">TÚ</span>}
                  </p>
                  <p className="text-gray-500 text-[11px] truncate">@{u.usuario}</p>
                </div>
              </div>
              
              <div className="col-span-3 flex items-center justify-between md:block">
                <span className="md:hidden text-xs text-gray-500 uppercase font-bold tracking-widest">Rol:</span>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${u.rolColor}`}>
                  {u.rol}
                </span>
              </div>

              <div className="col-span-3 flex items-center justify-between md:block">
                <span className="md:hidden text-xs text-gray-500 uppercase font-bold tracking-widest">Est:</span>
                <span className={`text-xs font-semibold ${u.estadoColor} flex items-center gap-1.5`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  {u.estado}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
