import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSecurity } from '../../context/SecurityContext';
import {
  Webhook,
  ShieldCheck,
  Key,
  Server,
  Activity,
  CheckCircle2,
  Copy,
  Play,
  RefreshCw,
  Lock,
  Database,
  AlertTriangle,
} from 'lucide-react';

export const ProductionGateway: React.FC = () => {
  const { user } = useAuth();
  const { settings, rotateEncryptionKey } = useSecurity();
  const [copied, setCopied] = useState(false);
  const [testPayload, setTestPayload] = useState(`{
  "event": "whatsapp_incoming_lead",
  "phone": "+919876543210",
  "name": "Arjun Singhania",
  "interest": "Master AI & Automation Technologies",
  "timestamp": "${new Date().toISOString()}"
}`);
  const [testLoading, setTestLoading] = useState(false);
  const [testResponse, setTestResponse] = useState<any>(null);

  const webhookEndpoint = `${window.location.origin}/api/v1/webhook/workflow-automation-prod`;
  const userToken = user ? user.token : 'jwt_guest_preview_token_flowpulse';

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText(webhookEndpoint);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestWebhook = async () => {
    setTestLoading(true);
    setTestResponse(null);

    try {
      let parsed = {};
      try {
        parsed = JSON.parse(testPayload);
      } catch (e) {
        parsed = { raw: testPayload };
      }

      const res = await fetch('/api/v1/webhook/workflow-automation-prod', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();
      setTestResponse({
        status: res.status,
        statusText: res.statusText,
        data,
      });
    } catch (err: any) {
      setTestResponse({
        status: 500,
        statusText: 'Network / Client Error',
        error: err?.message,
      });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs uppercase tracking-wider">
              Production Architecture & API Gateway
            </span>
            <span className="text-xs text-slate-400">
              • Token-Secured Webhooks & Isolated Workspaces
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-extrabold text-white">
            Enterprise Cloud Trigger & Security Specifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Production-ready ingress with mandatory Bearer JWT verification, per-user data isolation, and rate-limiting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Zero-Leak Isolation Active
          </span>
        </div>
      </div>

      {/* Production Webhook Trigger Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Endpoint Spec & Interactive Tester (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Webhook className="w-4 h-4 text-indigo-400" />
              Authenticated Ingress Webhook Endpoint
            </h3>

            {/* Endpoint Box */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="px-2 py-0.5 rounded bg-emerald-600/20 text-emerald-400 font-mono text-[11px] font-bold">
                  POST
                </span>
                <span className="text-xs font-mono text-slate-300 truncate">
                  {webhookEndpoint}
                </span>
              </div>
              <button
                onClick={handleCopyEndpoint}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1 shrink-0 transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* Headers Spec */}
            <div className="space-y-1.5 text-xs">
              <p className="text-slate-400 font-medium">Mandatory Request Headers:</p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1">
                <p className="text-slate-300">
                  <span className="text-indigo-400">Content-Type:</span> application/json
                </p>
                <p className="text-slate-300">
                  <span className="text-indigo-400">Authorization:</span> Bearer{' '}
                  <span className="text-amber-300">{userToken.slice(0, 24)}...</span>
                </p>
              </div>
            </div>

            {/* Interactive Webhook Tester */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Test Webhook Request Payload (JSON)
                </label>
                <span className="text-[11px] text-slate-500">Live test runner</span>
              </div>
              <textarea
                rows={6}
                value={testPayload}
                onChange={(e) => setTestPayload(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={handleTestWebhook}
              disabled={testLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
            >
              {testLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Dispatching Webhook...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Send Test Webhook Ingress</span>
                </>
              )}
            </button>

            {/* Test Response Output */}
            {testResponse && (
              <div className="mt-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1.5 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">HTTP Status:</span>
                  <span
                    className={`font-bold ${
                      testResponse.status === 200 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {testResponse.status} {testResponse.statusText}
                  </span>
                </div>
                <pre className="text-[11px] text-indigo-300 overflow-x-auto p-2 bg-slate-900 rounded-lg">
                  {JSON.stringify(testResponse.data || testResponse.error, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right: Security, Architecture & SLA Compliance (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Production Security & Architecture Checklist
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">Stage 1: Verified Request / Response Shape</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Strict JSON validation prevents malformed payloads from consuming worker slots.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">Stage 2: Per-User Data Isolation</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Every incoming request extracts the authenticated user ID from the Bearer JWT. User A can never read or mutate User B records.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">Stage 3: Zero-Credential Exposure</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    No backend API keys or database connection strings are exposed in client bundles. Handled entirely via server-side execution.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">Stage 6: Concurrency & Queue Mode</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Worker thread isolation with asynchronous queuing buffers spikes during high-volume WhatsApp broadcast blasts.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">Stage 9: Rollback & Disaster Recovery</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Versioned workflow plans and Google Sheets append backups ensure zero data loss across reboots.
                  </p>
                </div>
              </div>
            </div>

            {/* Cryptographic Key & Encryption Suite Panel */}
            <div className="mt-5 pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  AES-256-GCM E2EE Suite
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                  ACTIVE
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Algorithm:</span>
                  <span className="text-indigo-400 font-bold">AES-GCM (256-bit)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Derivation:</span>
                  <span className="text-slate-300">PBKDF2 (100k iters)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Key Fingerprint:</span>
                  <span className="text-emerald-400 font-bold">{settings.keyFingerprint}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Last Rotated:</span>
                  <span className="text-slate-300">{settings.lastRotatedAt}</span>
                </div>
              </div>

              <button
                onClick={async () => {
                  await rotateEncryptionKey();
                  alert('Encryption key rotated successfully. New SHA-256 fingerprint derived.');
                }}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                <span>Rotate AES-256 Encryption Key</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
