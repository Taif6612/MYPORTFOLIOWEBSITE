import { Component } from "react";

/* If WebGL initialisation or the shader throws on a given machine/browser,
   swallow the error and render nothing — the CSS gradient behind the canvas
   stays as the fallback. This stops a GPU/driver quirk from crashing the
   whole page (which is what made the site "look very different" elsewhere). */
export default class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    // Non-fatal: keep it out of the user's face, but leave a breadcrumb.
    if (import.meta.env.DEV) console.warn("Hero shader disabled:", error);
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}
