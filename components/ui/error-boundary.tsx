"use client";

import React from "react";
import type { ThemeTokens } from "@/types";

interface Props {
  children: React.ReactNode;
  t?:       ThemeTokens;
}

interface State {
  hasError: boolean;
  error:    Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      const t = this.props.t;
      return (
        <div style={{ padding:40, textAlign:"center", fontFamily:"'IBM Plex Sans',sans-serif" }}>
          <div style={{ fontSize:32, marginBottom:12 }}>⚠️</div>
          <div style={{ fontSize:14, fontWeight:700, color: t?.tx ?? "#333", marginBottom:8 }}>
            Error al cargar este panel
          </div>
          <div style={{ fontSize:12, color: t?.mu ?? "#888", marginBottom:16 }}>
            {this.state.error?.message ?? "Error desconocido"}
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding:"8px 20px", borderRadius:8, border:"1px solid #ddd",
              background:"transparent", cursor:"pointer", fontSize:12, color: t?.tx ?? "#333",
            }}
          >
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
