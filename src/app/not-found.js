export default function NotFound() {
  return (
    <section className="state">
      <div className="motif" />
      <div className="state__inner fade-up">
        <div className="big404">
          4<span className="z">0</span>4
        </div>
        <h2>This page hasn&apos;t been written.</h2>
        <p>
          The link&apos;s broken, moved, or the pipeline hasn&apos;t gotten to it yet.
          Either way — there&apos;s plenty else to read.
        </p>
        <div className="state__actions">
          <a className="btn btn--primary" href="/">Back to the latest</a>
          <a className="btn btn--ghost" href="/">Browse topics</a>
        </div>
      </div>
    </section>
  );
}
