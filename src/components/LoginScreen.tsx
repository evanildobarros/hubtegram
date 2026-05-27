/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, Eye, EyeOff, User, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginScreenProps {
  onLogin: (name: string) => void;
  initialNameInput: string;
  onBackToLanding?: () => void;
}

export default function LoginScreen({ onLogin, initialNameInput, onBackToLanding }: LoginScreenProps) {
  const [username, setUsername] = useState(initialNameInput || 'evanildo.barros');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const VALID_PASSWORD = 'tegram2026';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Por favor, informe seu email ou usuário.');
      return;
    }
    if (!password.trim()) {
      setError('Por favor, informe sua senha.');
      return;
    }
    if (password !== VALID_PASSWORD) {
      setError('Senha incorreta. Tente novamente.');
      return;
    }
    setIsLoading(true);
    setError('');

    // Simulate validation and login
    setTimeout(() => {
      setIsLoading(false);
      // Map username to realistic human name if they used a common user format
      let formattedName = "Evanildo de Jesus Campos Barros";
      if (username !== 'evanildo.barros' && username.includes('.')) {
        const parts = username.split('.');
        formattedName = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ') + " (Operador)";
      } else if (username !== 'evanildo.barros') {
        formattedName = username;
      }
      onLogin(formattedName);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] flex flex-col items-center justify-between p-8 select-none relative overflow-hidden font-sans">
      {/* Structural simple line accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#EEEEEE]" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#EEEEEE]" />

      {/* Main Top Header Section */}
      <div className="w-full max-w-md flex flex-col items-center pt-12 z-10">
        {/* Custom High-Fidelity Minimalist Logo */}
        <div className="flex flex-col items-center mb-6">
          <span className="text-3xl font-bold tracking-tighter text-[#1A1A1A]">TEGRAM™</span>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-[#888888] mt-1">
            Port Operations Suite
          </span>
        </div>

        {/* Security protocol tag - Clean Borderless tag style */}
        <div className="inline-flex items-center space-x-2 bg-[#F5F5F5] border border-[#EEEEEE] rounded-full px-4 py-1.5 text-[11px] text-[#888888] font-medium tracking-wider uppercase shadow-none">
          <Shield className="w-3.5 h-3.5 text-[#1A1A1A]" />
          <span>OAuth2 + PKCE Secure</span>
        </div>
      </div>

      {/* Login Card Container - Clean Minimalism Card with light borders, rounded columns */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm bg-white rounded-[24px] border border-[#EEEEEE] p-8 z-10 my-8 shadow-none"
      >
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#1A1A1A] tracking-tight">
            Acessar Sistema
          </h2>
          <p className="text-[13px] text-[#888888] mt-1.5 leading-relaxed">
            Insira suas credenciais corporativas
          </p>
        </div>

        {error && (
          <div className="mb-5 bg-[#FFF5F5] border border-red-200 p-3 text-[12px] text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email or user field */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#AAAAAA] tracking-widest block uppercase">
              Email ou Usuário
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <User className="h-4 w-4 text-[#CCCCCC]" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ex: operador.silva"
                className="w-full pl-10 pr-4 py-3 border border-[#EEEEEE] rounded-xl text-[13px] bg-[#FAFAFA] text-[#1A1A1A] placeholder-[#AAAAAA] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] focus:border-[#1A1A1A] transition-all"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-[#AAAAAA] tracking-widest block uppercase">
                Senha
              </label>
              <button 
                type="button"
                className="text-[11px] font-medium text-[#888888] hover:text-black transition-colors"
                onClick={() => alert("Entre em contato com a equipe de suprimentos e TI para redefinir suas credenciais.")}
              >
                Esqueci a senha
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Lock className="h-4 w-4 text-[#CCCCCC]" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-[#EEEEEE] rounded-xl text-[13px] bg-[#FAFAFA] text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] focus:border-[#1A1A1A] transition-all"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-[#AAAAAA] hover:text-black" />
                ) : (
                  <Eye className="h-4 w-4 text-[#AAAAAA] hover:text-black" />
                )}
              </button>
            </div>
          </div>

          {/* Submit button - Solid Black block block button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-[#1A1A1A] hover:bg-black text-white rounded-xl font-bold text-xs tracking-widest uppercase transition-all duration-150 active:scale-98 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="inline-flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2.5 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Autenticando
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                <span>Entrar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#EEEEEE] text-center space-y-3">
          <p className="text-[12px] text-[#888888]">
            Não possui conta?{" "}
            <button 
              className="font-semibold text-[#1A1A1A] hover:underline"
              onClick={() => {
                const mailto = "mailto:it-tegram@tegram.com.br?subject=Solicitação de Acesso - TEGRAM OS";
                window.open ? window.open(mailto, "_blank") : window.location.assign(mailto);
              }}
            >
              Solicitar Acesso
            </button>
          </p>
          {onBackToLanding && (
            <button 
              type="button"
              className="text-[11px] font-semibold text-[#888888] hover:text-[#1A1A1A] hover:underline flex items-center justify-center gap-1 mx-auto"
              onClick={onBackToLanding}
            >
              ← Voltar para o Portal
            </button>
          )}
        </div>
      </motion.div>

      {/* Footer information bar */}
      <div className="w-full max-w-md flex flex-col items-center space-y-2 pb-6 z-10 text-center">
        <div className="flex items-center space-x-1.5 text-[11px] text-[#AAAAAA] font-medium tracking-wider uppercase">
          <Shield className="w-3.5 h-3.5" />
          <span>Shield Protocol v7.2</span>
        </div>
        <p className="text-[9px] text-[#BBBBBB] tracking-widest uppercase">
          © 2026 TEGRAM OS. COV-A SECURITY AUDITED.
        </p>
      </div>
    </div>
  );
}

