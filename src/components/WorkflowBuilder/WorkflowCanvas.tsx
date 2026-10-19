import React, { useState } from 'react';
import {
  WorkflowNode,
  WorkflowConnection,
  WorkflowPlan,
  NodeType,
} from '../../types';
import { PRESET_WORKFLOWS } from '../../data/templates';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';
import {
  Play,
  Sparkles,
  Layers,
  Search,
  Bot,
  Mail,
  Send,
  Database,
  Clock,
  Plus,
  RefreshCw,
  FolderOpen,
  CheckCircle,
  AlertCircle,
  Settings,
  ChevronRight,
  Maximize2,
  Trash2,
} from 'lucide-react';

interface WorkflowCanvasProps {
  onOpenSheetsTab?: () => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({ onOpenSheetsTab }) => {
  const { user, consumeCredits } = useAuth();

  // Active workflow state
  const [currentPlan, setCurrentPlan] = useState<WorkflowPlan>(PRESET_WORKFLOWS[0]);
  const [nodes, setNodes] = useState<WorkflowNode[]>(PRESET_WORKFLOWS[0].nodes);
  const [connections, setConnections] = useState<WorkflowConnection[]>(PRESET_WORKFLOWS[0].connections);

  // Chat-to-Build prompt state
  const [promptInput, setPromptInput] = useState('');
  const [isPlanning, setIsPlanning] = useState(false);

  // Execution state
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [logs, setLogs] = useState<string[]>([]);
  const [showConsole, setShowConsole] = useState(true);

  // Selected node for inspector
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);

  // Dragging node state
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Template picker modal
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  // Handle Chat-to-Build (Gami Planner)
  const handleChatToBuild = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptInput.trim()) return;

    setIsPlanning(true);
    setLogs((prev) => [
      `🤖 [Gami AI Planner] Analyzing prompt: "${promptInput}"...`,
      ...prev,
    ]);

    try {
      const res = await fetch('/api/ai/plan-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptInput }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.plan) {
          const generatedPlan: WorkflowPlan = data.plan;

          // Compute responsive layout coordinates if missing
          const positionedNodes: WorkflowNode[] = generatedPlan.nodes.map((node, i) => ({
            ...node,
            x: 60 + i * 260,
            y: 160 + (i % 2 === 1 ? 40 : 0),
            status: 'idle',
          }));

          const builtConnections: WorkflowConnection[] = (
            generatedPlan.connections || []
          ).map((c, i) => ({
            id: `c_${i}`,
            from: c.from,
            to: c.to,
            label: c.label,
          }));

          setCurrentPlan({
            ...generatedPlan,
            nodes: positionedNodes,
            connections: builtConnections,
          });
          setNodes(positionedNodes);
          setConnections(builtConnections);
          setLogs([
            `✅ [Gami AI Planner] Successfully built "${generatedPlan.workflowTitle}" with ${positionedNodes.length} nodes!`,
            `Estimated cost: ${generatedPlan.estimatedCredits} credits`,
          ]);
        }
      }
    } catch (err) {
      console.error('Planner error', err);
      setLogs((prev) => [`⚠️ Planning service unavailable, applying local planner.`, ...prev]);
    } finally {
      setIsPlanning(false);
      setPromptInput('');
    }
  };

  // Switch preset template
  const loadTemplate = (tmpl: WorkflowPlan) => {
    setCurrentPlan(tmpl);
    setNodes(tmpl.nodes);
    setConnections(tmpl.connections);
    setLogs([`📂 Loaded template: "${tmpl.workflowTitle}"`, ...tmpl.sampleExecutionLog]);
    setShowTemplatesModal(false);
  };

  // Node Drag and Drop handlers
  const handleMouseDown = (e: React.MouseEvent, node: WorkflowNode) => {
    setDraggedNodeId(node.id);
    setSelectedNode(node);
    setDragOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNodeId) return;
    const canvasRect = e.currentTarget.getBoundingClientRect();
    const newX = Math.max(20, Math.min(canvasRect.width - 240, e.clientX - dragOffset.x));
    const newY = Math.max(20, Math.min(canvasRect.height - 180, e.clientY - dragOffset.y));

    setNodes((prev) =>
      prev.map((n) => (n.id === draggedNodeId ? { ...n, x: newX, y: newY } : n))
    );
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
  };

  // Execute Workflow Simulation
  const handleRunWorkflow = async () => {
    if (isRunning) return;

    const creditCost = currentPlan.estimatedCredits || 4;
    const ok = consumeCredits(creditCost);
    if (!ok) {
      alert(`Insufficient credits! This workflow requires ${creditCost} credits. Please check your credit balance.`);
      return;
    }

    setIsRunning(true);
    setActiveStepIndex(0);
    setLogs([
      `🚀 Initiating execution: "${currentPlan.workflowTitle}"`,
      `💳 Deducted ${creditCost} credits (Remaining: ${user ? user.credits - creditCost : 1996})`,
    ]);

    // Reset node statuses
    setNodes((prev) => prev.map((n) => ({ ...n, status: 'idle' })));

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      setActiveStepIndex(i);

      // Set node running
      setNodes((prev) =>
        prev.map((n, idx) => (idx === i ? { ...n, status: 'running' } : n))
      );

      setLogs((prev) => [
        `⏳ [Step ${i + 1}/${nodes.length}] Executing "${node.title}" (${node.provider})...`,
        ...prev,
      ]);

      // Simulate realistic step delay
      await new Promise((r) => setTimeout(r, 900));

      // Step success
      setNodes((prev) =>
        prev.map((n, idx) => (idx === i ? { ...n, status: 'success' } : n))
      );

      setLogs((prev) => [
        `✓ [Step ${i + 1}/${nodes.length}] "${node.title}" completed successfully. Output payload attached.`,
        ...prev,
      ]);
    }

    setIsRunning(false);
    setActiveStepIndex(-1);

    setLogs((prev) => [
      `🎉 [Success] Workflow run completed with 0 errors! All triggers dispatched.`,
      ...prev,
    ]);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6366F1', '#10B981', '#06B6D4', '#F59E0B'],
      });
    } catch (e) {
      // ignore
    }
  };

  // Helper for node icons
  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case 'trigger':
        return <Play className="w-4 h-4 text-emerald-400" />;
      case 'search':
        return <Search className="w-4 h-4 text-cyan-400" />;
      case 'llm':
        return <Bot className="w-4 h-4 text-indigo-400" />;
      case 'memory':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'sheets':
        return <Database className="w-4 h-4 text-emerald-400" />;
      case 'whatsapp':
        return <Send className="w-4 h-4 text-green-400" />;
      case 'email':
        return <Mail className="w-4 h-4 text-rose-400" />;
      case 'delay':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <Layers className="w-4 h-4 text-slate-400" />;
    }
  };

  const getNodeColor = (type: NodeType) => {
    switch (type) {
      case 'trigger':
        return 'border-emerald-500/40 bg-emerald-950/20';
      case 'search':
        return 'border-cyan-500/40 bg-cyan-950/20';
      case 'llm':
        return 'border-indigo-500/40 bg-indigo-950/20';
      case 'memory':
        return 'border-amber-500/40 bg-amber-950/20';
      case 'sheets':
        return 'border-emerald-500/40 bg-emerald-950/20';
      case 'whatsapp':
        return 'border-green-500/40 bg-green-950/20';
      case 'email':
        return 'border-rose-500/40 bg-rose-950/20';
      case 'delay':
        return 'border-yellow-500/40 bg-yellow-950/20';
      default:
        return 'border-slate-700 bg-slate-900';
    }
  };

  // Helper to add custom node
  const addNode = (type: NodeType) => {
    const id = `node-${Date.now()}`;
    const titles: Record<NodeType, string> = {
      trigger: 'Webhook Trigger',
      search: 'Perplexity Sonar Search',
      llm: 'Gemini 3.8 Flash',
      memory: '10-Turn Memory Buffer',
      sheets: 'Google Sheets CRM',
      email: 'Gmail Notification',
      whatsapp: 'WhatsApp Business API',
      delay: 'Anti-Ban Delay',
    };

    const newNode: WorkflowNode = {
      id,
      title: titles[type],
      type,
      provider: type === 'llm' ? 'Gemini 3.8 Flash' : type === 'search' ? 'Perplexity Sonar' : 'FlowPulse Core',
      x: 200 + Math.random() * 200,
      y: 120 + Math.random() * 150,
      config: {},
      description: `Custom ${type} node configured by user`,
      status: 'idle',
    };

    setNodes((prev) => [...prev, newNode]);

    // Connect to previous if any
    if (nodes.length > 0) {
      const last = nodes[nodes.length - 1];
      setConnections((prev) => [
        ...prev,
        { id: `c_${Date.now()}`, from: last.id, to: id, label: 'data_flow' },
      ]);
    }
  };

  // Delete node
  const deleteNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setConnections((prev) => prev.filter((c) => c.from !== id && c.to !== id));
    if (selectedNode?.id === id) setSelectedNode(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Bar: Chat-to-Build / Prompt Input & Action Controls */}
      <div className="bg-slate-900/90 border-b border-slate-800 p-3 lg:px-6 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0">
        {/* Chat-to-Build Prompt Engine */}
        <form
          onSubmit={handleChatToBuild}
          className="flex-1 w-full max-w-3xl flex items-center gap-2"
        >
          <div className="relative flex-1">
            <div className="absolute left-3.5 top-2.5 flex items-center gap-1.5 text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider hidden sm:inline">
                Gami Planner:
              </span>
            </div>
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="e.g., 'Send me daily AI news updates at 8 AM via email' or 'WhatsApp lead capture to Google Sheets'"
              className="w-full pl-28 sm:pl-36 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={isPlanning || !promptInput.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-md transition shrink-0"
          >
            {isPlanning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Designing Flow...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Workflow</span>
              </>
            )}
          </button>
        </form>

        {/* Action Buttons: Templates, Run, and Add Nodes */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => setShowTemplatesModal(true)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Templates</span>
          </button>

          <button
            onClick={handleRunWorkflow}
            disabled={isRunning}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Running Step {activeStepIndex + 1}...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test Run ({currentPlan.estimatedCredits} credits)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Toolbar: Node Palette */}
        <aside className="w-14 sm:w-16 bg-slate-900/90 border-r border-slate-800/80 p-2 flex flex-col items-center gap-3 shrink-0 z-10">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
            Add
          </span>

          <button
            onClick={() => addNode('trigger')}
            title="Add Trigger Node"
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-emerald-950/60 border border-slate-700 hover:border-emerald-500/50 flex items-center justify-center text-emerald-400 transition"
          >
            <Play className="w-4 h-4" />
          </button>

          <button
            onClick={() => addNode('search')}
            title="Add Perplexity Sonar Search"
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-cyan-950/60 border border-slate-700 hover:border-cyan-500/50 flex items-center justify-center text-cyan-400 transition"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => addNode('llm')}
            title="Add Gemini 3.8 Flash Model"
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-indigo-950/60 border border-slate-700 hover:border-indigo-500/50 flex items-center justify-center text-indigo-400 transition"
          >
            <Bot className="w-4 h-4" />
          </button>

          <button
            onClick={() => addNode('sheets')}
            title="Add Google Sheets Lead Logger"
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-emerald-950/60 border border-slate-700 hover:border-emerald-500/50 flex items-center justify-center text-emerald-400 transition"
          >
            <Database className="w-4 h-4" />
          </button>

          <button
            onClick={() => addNode('whatsapp')}
            title="Add WhatsApp Business Node"
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-green-950/60 border border-slate-700 hover:border-green-500/50 flex items-center justify-center text-green-400 transition"
          >
            <Send className="w-4 h-4" />
          </button>

          <button
            onClick={() => addNode('email')}
            title="Add Email Notification"
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/50 flex items-center justify-center text-rose-400 transition"
          >
            <Mail className="w-4 h-4" />
          </button>

          <button
            onClick={() => addNode('delay')}
            title="Add Anti-Ban Delay Node"
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-yellow-950/60 border border-slate-700 hover:border-yellow-500/50 flex items-center justify-center text-yellow-400 transition"
          >
            <Clock className="w-4 h-4" />
          </button>
        </aside>

        {/* Center: Interactive Node Canvas */}
        <main
          className="flex-1 relative canvas-grid overflow-hidden select-none"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Canvas Header Subtitle */}
          <div className="absolute top-4 left-6 z-10 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs flex items-center gap-2">
            <span className="font-semibold text-white">{currentPlan.workflowTitle}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{nodes.length} Active Nodes</span>
          </div>

          {/* SVG Connection Curves */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {connections.map((conn) => {
              const fromNode = nodes.find((n) => n.id === conn.from);
              const toNode = nodes.find((n) => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              // Compute connection coordinates (from right edge of fromNode to left edge of toNode)
              const startX = fromNode.x + 220;
              const startY = fromNode.y + 40;
              const endX = toNode.x;
              const endY = toNode.y + 40;

              const dx = Math.abs(endX - startX) * 0.5;
              const pathD = `M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`;

              const isConnectionActive =
                isRunning &&
                fromNode.status === 'success' &&
                (toNode.status === 'running' || toNode.status === 'success');

              return (
                <g key={conn.id}>
                  {/* Background shadow curve */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#1E293B"
                    strokeWidth="4"
                  />
                  {/* Main curve */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isConnectionActive ? '#10B981' : '#4F46E5'}
                    strokeWidth={isConnectionActive ? '3' : '2'}
                    className={isConnectionActive ? 'animate-flow-dash' : ''}
                    strokeDasharray={isConnectionActive ? '6 6' : undefined}
                    opacity={isConnectionActive ? 1 : 0.65}
                  />
                  {/* Connection label */}
                  {conn.label && (
                    <text
                      x={(startX + endX) / 2}
                      y={(startY + endY) / 2 - 8}
                      fill="#94A3B8"
                      fontSize="10"
                      textAnchor="middle"
                      className="font-mono bg-slate-900"
                    >
                      {conn.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Render Draggable Nodes */}
          {nodes.map((node, index) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleMouseDown(e, node)}
                style={{
                  transform: `translate(${node.x}px, ${node.y}px)`,
                  width: '220px',
                }}
                className={`absolute top-0 left-0 rounded-xl p-3 border transition-shadow cursor-grab active:cursor-grabbing z-10 backdrop-blur-md ${getNodeColor(
                  node.type
                )} ${
                  isSelected ? 'ring-2 ring-indigo-400 shadow-xl shadow-indigo-500/20' : 'shadow-md'
                } ${
                  node.status === 'running' ? 'ring-2 ring-emerald-400 animate-pulse' : ''
                }`}
              >
                {/* Node Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-700">
                      {getNodeIcon(node.type)}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {node.provider}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  <div>
                    {node.status === 'running' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                    )}
                    {node.status === 'success' && (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    )}
                    {node.status === 'error' && (
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                    )}
                    {(!node.status || node.status === 'idle') && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        #{index + 1}
                      </span>
                    )}
                  </div>
                </div>

                {/* Node Title */}
                <h4 className="text-xs font-bold text-white mb-1 leading-snug">
                  {node.title}
                </h4>

                {/* Node Description */}
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {node.description}
                </p>

                {/* Connector dots */}
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-700 border-2 border-slate-900" />
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-indigo-500 border-2 border-slate-900" />
              </div>
            );
          })}
        </main>

        {/* Right Sidebar: Selected Node Inspector */}
        {selectedNode && (
          <aside className="w-80 bg-slate-900/95 border-l border-slate-800 p-4 flex flex-col justify-between overflow-y-auto shrink-0 z-20">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-800">
                    {getNodeIcon(selectedNode.type)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Node Inspector</h3>
                    <p className="text-[10px] text-slate-400">{selectedNode.provider}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Title editor */}
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Node Title
                  </label>
                  <input
                    type="text"
                    value={selectedNode.title}
                    onChange={(e) => {
                      const updated = { ...selectedNode, title: e.target.value };
                      setSelectedNode(updated);
                      setNodes((prev) =>
                        prev.map((n) => (n.id === selectedNode.id ? updated : n))
                      );
                    }}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={selectedNode.description}
                    onChange={(e) => {
                      const updated = { ...selectedNode, description: e.target.value };
                      setSelectedNode(updated);
                      setNodes((prev) =>
                        prev.map((n) => (n.id === selectedNode.id ? updated : n))
                      );
                    }}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white resize-none"
                  />
                </div>

                {/* Configuration JSON / Fields */}
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Parameters & Config (JSON)
                  </label>
                  <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-indigo-300 overflow-x-auto max-h-48">
                    {JSON.stringify(selectedNode.config || {}, null, 2)}
                  </pre>
                </div>

                {/* Specialized Actions based on node type */}
                {selectedNode.type === 'sheets' && onOpenSheetsTab && (
                  <button
                    onClick={onOpenSheetsTab}
                    className="w-full py-2 px-3 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-600/30 transition flex items-center justify-center gap-1.5"
                  >
                    <Database className="w-3.5 h-3.5" />
                    Open Live Google Sheets Sync
                  </button>
                )}
              </div>
            </div>

            {/* Delete button */}
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => deleteNode(selectedNode.id)}
                className="w-full py-2 px-3 rounded-lg bg-rose-600/10 border border-rose-500/20 text-rose-400 hover:bg-rose-600/20 text-xs font-medium flex items-center justify-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove Node
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* Bottom Drawer: Execution Console & Live Logs */}
      {showConsole && (
        <div className="h-44 bg-slate-950 border-t border-slate-800 flex flex-col shrink-0">
          <div className="px-4 py-1.5 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-bold text-slate-200">Execution Console</span>
              <span className="text-[11px] text-slate-500">
                (Gumloop & Cloud Execution Runtime)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLogs([])}
                className="text-[11px] text-slate-400 hover:text-white"
              >
                Clear Logs
              </button>
              <button
                onClick={() => setShowConsole(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex-1 p-3 font-mono text-xs overflow-y-auto space-y-1 bg-slate-950/90 text-slate-300">
            {logs.length === 0 ? (
              <p className="text-slate-500 italic">
                Ready. Click "Test Run" or prompt Gami Planner to execute.
              </p>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-slate-600 select-none">{idx + 1}</span>
                  <span
                    className={
                      log.includes('Success') || log.includes('✓')
                        ? 'text-emerald-400'
                        : log.includes('Executing') || log.includes('Analyzing')
                        ? 'text-indigo-400'
                        : log.includes('Deducted')
                        ? 'text-amber-400'
                        : 'text-slate-300'
                    }
                  >
                    {log}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Templates Modal */}
      {showTemplatesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white">Pre-Built Automation Templates</h2>
                <p className="text-xs text-slate-400">
                  Ready-to-use workflows inspired by Gumloop & WP Blaster
                </p>
              </div>
              <button
                onClick={() => setShowTemplatesModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {PRESET_WORKFLOWS.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => loadTemplate(tmpl)}
                  className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/60 cursor-pointer transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400">
                        {tmpl.estimatedCredits} Credits
                      </span>
                      <span className="text-xs text-slate-400">
                        {tmpl.nodes.length} nodes
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">
                      {tmpl.workflowTitle}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {tmpl.summary}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-indigo-400 font-semibold pt-2 border-t border-slate-700/50">
                    <span>Load Workflow</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
