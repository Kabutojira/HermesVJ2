interface WebGLFallbackProps {
  chapterTitle: string;
  chapterDescription: string;
}

export function WebGLFallback({ chapterTitle, chapterDescription }: WebGLFallbackProps) {
  return (
    <section className="webgl-fallback" role="status">
      <p className="eyebrow">Static transmission</p>
      <h1>{chapterTitle}</h1>
      <p>{chapterDescription}</p>
      <p>The interactive world needs WebGL. Enable hardware acceleration or try a current browser, then reload. The chapter text and navigation remain available.</p>
    </section>
  );
}
