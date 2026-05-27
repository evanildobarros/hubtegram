# Hubtegram - SSO & Gestão de Terceiros

## 🎯 Visão Geral
O Hubtegram é uma solução robusta e integrada de Saúde e Segurança Ocupacional (SSO) e Gestão de Terceiros. O objetivo principal é a automação de fluxos operacionais, eliminando a dependência de processos manuais (planilhas e PowerPoints) e centralizando o compliance de mobilização e inspeções de campo.

## 📋 Escopo Técnico e Funcional

### 1. Gestão de Contratadas e Mobilização
Foco em garantir que apenas profissionais qualificados e com documentação em dia entrem na operação.
- **Portal do Terceiro**: Interface para upload de documentos e certificados.
- **Validação de Conformidade**: Auditoria de documentos para liberação de integração ("Tudo aprovado").
- **Matriz de Treinamentos**: Controle de vencimentos de capacitações e exames.
- **Sistema de Alertas**: Notificações automáticas pré-vencimento.
- **Suporte a NRs**: Módulo de atualização e orientação sobre Normas Regulamentadoras.

### 2. Inspeções de Campo e Planos de Ação
Digitalização da vistoria para gerar inteligência e agilidade na correção de não-conformidades.
- **App de Vistoria**: Registro fotográfico e descrições em tempo real via dispositivo móvel.
- **Relatórios Automatizados**: Geração automática de relatórios de inspeção (substituindo o PowerPoint).
- **Workflow de Notificação**: Envio automático de não-conformidades para os gestores responsáveis.
- **Gestão de Resposta**: Canal para anexo de evidências de resolução e encerramento de planos de ação.

## 🏗️ Estratégia de Desenvolvimento (Orquestração)

- **@Schema (Helena)**: Modelagem de banco de dados para relacionamentos complexos (Empresa $\rightarrow$ Colaborador $\rightarrow$ Certificações $\rightarrow$ Vencimentos).
- **@Pixel (Lucas)**: Design de UX para o Portal do Terceiro e interface de App de Campo focada em alta performance e usabilidade.
- **@Shield (Rafael)**: Implementação de segurança para documentos sensíveis, controle de acesso (RBAC) e conformidade com LGPD (dados de saúde).

---
*Documentação inicial criada em 27/05/2026.*
