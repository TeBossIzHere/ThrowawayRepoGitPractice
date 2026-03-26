/**
 * compliance-test.tsx
 *
 * TEST FILE — Deliberate WCAG 2.2 AA violations for local LLM pipeline validation.
 * This file is not part of the application. It exists to verify agent detection quality.
 *
 * Violations seeded by category:
 *   Visual    — contrast, resize, non-text contrast
 *   Keyboard  — keyboard trap, missing focus, broken focus order
 *   Semantic  — missing alt text, broken structure, unnamed UI components
 *   Media     — uncaptioned video, missing audio description, no transcript
 */

import React, { useState } from "react";

// ─── VISUAL VIOLATIONS ────────────────────────────────────────────────────────

// VIOLATION: 1.4.3 Contrast (Minimum)
// Text color #AAAAAA on white background — contrast ratio ~2.3:1, fails 4.5:1 minimum.
const LowContrastLabel = () => (
  <p style={{ color: "#AAAAAA", backgroundColor: "#FFFFFF", fontSize: "14px" }}>
    Your session will expire in 5 minutes.
  </p>
);

// VIOLATION: 1.4.3 Contrast (Minimum)
// Placeholder text #B0B0B0 on #F5F5F5 background — contrast ratio ~1.9:1.
const LowContrastInput = () => (
  <input
    type="text"
    placeholder="Search documents..."
    style={{
      color: "#B0B0B0",
      backgroundColor: "#F5F5F5",
      border: "1px solid #DDDDDD",
      fontSize: "13px",
    }}
  />
);

// VIOLATION: 1.4.4 Resize Text
// Font size fixed in px using !important via inline style object — prevents user scaling.
const FixedSizeNotice = () => (
  <span style={{ fontSize: "10px", whiteSpace: "nowrap", overflow: "hidden" }}>
    By continuing, you agree to the federal data handling terms and conditions.
  </span>
);

// VIOLATION: 1.4.11 Non-text Contrast
// Button border and icon use #CCCCCC on white — UI component contrast below 3:1.
const LowContrastButton = () => (
  <button
    style={{
      border: "2px solid #CCCCCC",
      backgroundColor: "#FFFFFF",
      color: "#333333",
      padding: "8px 16px",
    }}
  >
    <svg width="16" height="16" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="6" stroke="#CCCCCC" strokeWidth="2" fill="none" />
      <line x1="8" y1="5" x2="8" y2="11" stroke="#CCCCCC" strokeWidth="2" />
    </svg>
    Info
  </button>
);

// ─── KEYBOARD VIOLATIONS ──────────────────────────────────────────────────────

// VIOLATION: 2.1.1 Keyboard
// onClick handler on a div with no keyboard equivalent — unreachable via Tab/Enter.
const KeyboardInaccessibleCard = () => (
  <div
    onClick={() => alert("Card selected")}
    style={{ border: "1px solid #ccc", padding: "16px", cursor: "pointer" }}
  >
    <h3>Document: FY2026 Budget Proposal</h3>
    <p>Click to open document preview.</p>
  </div>
);

// VIOLATION: 2.1.2 No Keyboard Trap
// Modal closes only via mouse click on overlay — Escape key not handled.
// Tab cycles through modal content but there is no way to exit without a mouse.
const KeyboardTrapModal = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{ background: "#fff", padding: "32px", borderRadius: "8px" }}
            onClick={(e) => e.stopPropagation()}
            // No onKeyDown handler — Escape key does nothing
          >
            <h2>Confirm Submission</h2>
            <p>Are you sure you want to submit this form?</p>
            <button>Confirm</button>
            {/* No close/cancel button reachable without mouse click on overlay */}
          </div>
        </div>
      )}
    </>
  );
};

// VIOLATION: 2.4.3 Focus Order
// tabIndex values create an illogical reading/focus sequence.
// A user tabbing through this form will jump: Field 1 → Field 3 → Field 2 → Submit.
const BrokenFocusOrderForm = () => (
  <form>
    <label>
      First Name
      <input type="text" tabIndex={1} />
    </label>
    <label>
      Last Name
      <input type="text" tabIndex={3} />
    </label>
    <label>
      Agency
      <input type="text" tabIndex={2} />
    </label>
    <button type="submit" tabIndex={4}>Submit</button>
  </form>
);

// VIOLATION: 2.1.1 Keyboard
// Custom dropdown implemented with mouse-only events — no keydown handling.
const MouseOnlyDropdown = () => {
  const [open, setOpen] = useState(false);
  const options = ["Option A", "Option B", "Option C"];
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        style={{ padding: "8px 16px", border: "1px solid #ccc", cursor: "pointer" }}
      >
        Select an option ▾
      </div>
      {open && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            margin: 0,
            padding: 0,
            listStyle: "none",
            border: "1px solid #ccc",
            background: "#fff",
            zIndex: 10,
          }}
        >
          {options.map((opt) => (
            <li
              key={opt}
              onMouseDown={() => alert(`Selected: ${opt}`)}
              style={{ padding: "8px 16px", cursor: "pointer" }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ─── SEMANTIC VIOLATIONS ──────────────────────────────────────────────────────

// VIOLATION: 1.1.1 Non-text Content
// Meaningful icon image with no alt text — screen reader announces filename or nothing.
const MissingAltImage = () => (
  <img src="/icons/warning-triangle.png" width="24" height="24" />
);

// VIOLATION: 1.1.1 Non-text Content
// Chart image conveys data — alt text is empty, information is lost to screen readers.
const EmptyAltChart = () => (
  <img
    src="/charts/q3-compliance-trend.png"
    alt=""
    style={{ maxWidth: "100%" }}
  />
);

// VIOLATION: 1.3.1 Info and Relationships
// Visual heading styled with bold/size but marked as a paragraph — structure not in markup.
const FakeHeading = () => (
  <p style={{ fontWeight: "700", fontSize: "22px", marginBottom: "8px" }}>
    Section 3: Audit Findings
  </p>
);

// VIOLATION: 1.3.1 Info and Relationships
// Required field indicated only by color (red label) — no programmatic association.
const ColorOnlyRequired = () => (
  <div>
    <label style={{ color: "#CC0000" }}>Email Address</label>
    <input type="email" />
    {/* No aria-required, no asterisk with legend, no visible text indicator */}
  </div>
);

// VIOLATION: 4.1.2 Name, Role, Value
// Icon-only button has no accessible name — screen reader announces "button" with no label.
const UnnamedIconButton = () => (
  <button style={{ border: "none", background: "transparent", cursor: "pointer" }}>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm1 11H9v-2h2v2zm0-4H9V7h2v2z" />
    </svg>
  </button>
);

// VIOLATION: 4.1.2 Name, Role, Value
// Custom toggle switch built from a div — no role, no aria-checked, no label.
const InaccessibleToggle = () => {
  const [on, setOn] = useState(false);
  return (
    <div
      onClick={() => setOn(!on)}
      style={{
        width: "48px",
        height: "24px",
        borderRadius: "12px",
        backgroundColor: on ? "#2563EB" : "#94A3B8",
        cursor: "pointer",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "2px",
          left: on ? "26px" : "2px",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: "#fff",
          transition: "left 0.2s",
        }}
      />
    </div>
  );
};

// VIOLATION: 4.1.2 Name, Role, Value
// Select element has no associated label — screen readers cannot identify the field purpose.
const UnlabelledSelect = () => (
  <select>
    <option value="">-- Select --</option>
    <option value="draft">Draft</option>
    <option value="review">In Review</option>
    <option value="approved">Approved</option>
  </select>
);

// ─── MEDIA VIOLATIONS ─────────────────────────────────────────────────────────

// VIOLATION: 1.2.2 Captions (Prerecorded)
// Video element has no <track> element for captions — deaf users cannot access audio content.
const UncaptionedVideo = () => (
  <video width="640" height="360" controls>
    <source src="/media/onboarding-overview.mp4" type="video/mp4" />
    Your browser does not support the video element.
    {/* No <track kind="captions" /> */}
  </video>
);

// VIOLATION: 1.2.5 Audio Description (Prerecorded)
// Video contains visual-only information (charts, screen demos) with no audio description track.
const NoAudioDescriptionVideo = () => (
  <video width="640" height="360" controls>
    <source src="/media/compliance-dashboard-demo.mp4" type="video/mp4" />
    <track kind="captions" src="/media/compliance-dashboard-demo.vtt" srcLang="en" label="English" />
    {/* No <track kind="descriptions" /> — blind users cannot access on-screen visual content */}
  </video>
);

// VIOLATION: 1.2.1 Audio-only and Video-only (Prerecorded)
// Audio-only podcast clip has no transcript link or text alternative.
const AudioOnlyNoTranscript = () => (
  <div>
    <p>Section 508 Compliance Briefing — Episode 12</p>
    <audio controls>
      <source src="/media/briefing-ep12.mp3" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
    {/* No transcript provided — deaf users have no access to this content */}
  </div>
);

// ─── PAGE ASSEMBLY ────────────────────────────────────────────────────────────

export default function ComplianceTestPage() {
  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "900px", margin: "0 auto", padding: "32px" }}>
      <h1>Compliance Test Page</h1>
      <p>This page contains deliberate WCAG 2.2 AA violations for agent pipeline validation.</p>

      <section>
        <h2>Visual</h2>
        <LowContrastLabel />
        <LowContrastInput />
        <FixedSizeNotice />
        <LowContrastButton />
      </section>

      <section>
        <h2>Keyboard</h2>
        <KeyboardInaccessibleCard />
        <KeyboardTrapModal />
        <BrokenFocusOrderForm />
        <MouseOnlyDropdown />
      </section>

      <section>
        <h2>Semantic</h2>
        <MissingAltImage />
        <EmptyAltChart />
        <FakeHeading />
        <ColorOnlyRequired />
        <UnnamedIconButton />
        <InaccessibleToggle />
        <UnlabelledSelect />
      </section>

      <section>
        <h2>Media</h2>
        <UncaptionedVideo />
        <NoAudioDescriptionVideo />
        <AudioOnlyNoTranscript />
      </section>
    </div>
  );
}
