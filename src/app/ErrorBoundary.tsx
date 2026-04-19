import { Component } from "react";
import type { ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div
          role="alert"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100dvh",
            gap: "16px",
            padding: "32px",
            fontFamily: "sans-serif",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "1.1rem", color: "#1A1806" }}>
            Coś poszło nie tak. Odśwież stronę lub zadzwoń do nas bezpośrednio.
          </p>
          <a
            href="tel:+48123123123"
            style={{ color: "#B01C2E", textDecoration: "underline" }}
          >
            +48 123 123 123
          </a>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              marginTop: "8px",
              padding: "10px 24px",
              background: "#B01C2E",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Odśwież stronę
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
