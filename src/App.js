import React, { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY_PREFIX = "quality-master-live-form:v11";

// Branding
const BRAND = "#2cb889";
const FONT_IMPORT_URL =
  "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap";

// Hosted logo URL (stable)
const LOGO_URL =
  "https://cdn.prod.website-files.com/66a3bb83d541c20d74e15117/67193a9cfdf685f3e0c7fca7_BuildingComposites-Horizontal-RGB-FullGreen-p-2000.png";

const LOGO_HEIGHT_PX = 46;

// Markup legend/colors
const LEGEND = [
  { key: "HIGH", label: "High", color: "#ff4da6" }, // pink
  { key: "LOW", label: "Low", color: "#ffd400" }, // yellow
  { key: "SAND", label: "Needs sanding", color: "#1f77b4" },
  { key: "BONDO", label: "Needs bondo", color: "#ff7f0e" },
  { key: "OTHER", label: "Other", color: "#2ca02c" },
  { key: "CHIP", label: "Chip", color: "#d62728" },
  { key: "SCRATCH", label: "Scratch", color: "#9467bd" },
];

function colorForKey(key) {
  const item = LEGEND.find((x) => x.key === key);
  return item ? item.color : "#000000";
}

function safeParse(raw) {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// PO from URL: ?po=10001
function getPoFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return (params.get("po") || "").trim();
}

// ---------------- UI primitives ----------------
function Card({ children, style }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e7e7e7",
        borderRadius: 14,
        padding: 16,
        boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
        ...(style || {}),
      }}
    >
      {children}
    </div>
  );
}

function Section({ title, children, subtitle }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "grid", gap: 4, marginBottom: 10 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: BRAND }}>
          {title}
        </div>
        {subtitle ? (
          <div style={{ fontSize: 12, color: "#666" }}>{subtitle}</div>
        ) : null}
      </div>
      <Card>{children}</Card>
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <div style={{ fontSize: 12, color: "#444", marginBottom: 6 }}>
      {children}
    </div>
  );
}

function TextField(props) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid #d7d7d7",
        fontSize: 14,
        outline: "none",
        background: props.readOnly ? "#f7f7f7" : "#fff",
        ...(props.style || {}),
      }}
    />
  );
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid #d7d7d7",
        fontSize: 14,
        minHeight: 90,
        outline: "none",
        background: "#fff",
        resize: "vertical",
        ...(props.style || {}),
      }}
    />
  );
}

function Button({ children, onClick, type = "button", style }) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        padding: "9px 12px",
        borderRadius: 10,
        border: "1px solid #d7d7d7",
        background: "#fff",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 800,
        whiteSpace: "nowrap",
        ...(style || {}),
      }}
    >
      {children}
    </button>
  );
}

function ChecklistInitials({ items, onChange }) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {items.map((it) => (
        <div
          key={it.id}
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 160px",
            gap: 12,
            alignItems: "center",
            padding: 12,
            border: "1px solid #efefef",
            borderRadius: 12,
            background: "#fff",
          }}
        >
          <div style={{ lineHeight: 1.25, fontSize: 14 }}>{it.label}</div>
          <TextField
            placeholder="Initials"
            value={it.initials}
            onChange={(e) => onChange(it.id, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}

export default function App() {
  // Load Montserrat font
  useEffect(() => {
    const id = "qc-montserrat-font";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = FONT_IMPORT_URL;
    document.head.appendChild(link);
  }, []);

  // PO from URL + per-PO storage key
  const poFromUrl = useMemo(() => getPoFromUrl(), []);
  const storageKey = useMemo(
    () => `${STORAGE_KEY_PREFIX}:${poFromUrl || "NO_PO"}`,
    [poFromUrl]
  );

  const defaultData = useMemo(
    () => ({
      header: { productionOrder: "", panelSerial: "" },

      ip6: {
        date: "",
        notes: "",
        items: [
          {
            id: "ip6_1",
            label:
              "A-surface flat with no visible depressions under raking light",
            initials: "",
          },
          {
            id: "ip6_2",
            label: "Fillet corners acceptable (rounded, not flattened)",
            initials: "",
          },
          {
            id: "ip6_3",
            label: "No surface porosity or pinholes visible",
            initials: "",
          },
          { id: "ip6_4", label: "No high spots", initials: "" },
          { id: "ip6_5", label: "No low spots", initials: "" },
          {
            id: "ip6_6",
            label: "No unsanded substrate or spot-primed areas",
            initials: "",
          },
          {
            id: "ip6_7",
            label: "Pin holes and bun holes filled and feathered",
            initials: "",
          },
          {
            id: "ip6_8",
            label: 'First 3" of returns sanded and acceptable',
            initials: "",
          },
          { id: "ip6_9", label: "No witness tool lines remain", initials: "" },
          {
            id: "ip6_10",
            label: "Clearly label “Ready for paint” on the bag side of panel",
            initials: "",
          },
          {
            id: "ip6_11",
            label: "Write the inspector’s initials on the bag side of panel",
            initials: "",
          },
        ],
        readyForPrimerInitials: "",
      },

      ip8: {
        date: "",
        notes: "",
        items: [
          { id: "ip8_1", label: "Inspected from ~10 ft", initials: "" },
          {
            id: "ip8_2",
            label: "High-gloss finish consistent across panel",
            initials: "",
          },
          {
            id: "ip8_3",
            label: "No visible paint defects (runs, dirt nibs, fisheyes)",
            initials: "",
          },
          {
            id: "ip8_4",
            label: "Orange peel within acceptable visual standard",
            initials: "",
          },
          {
            id: "ip8_5",
            label: "No dramatic waves or lines visible",
            initials: "",
          },
          {
            id: "ip8_6",
            label: "No tool witness lines telegraphing",
            initials: "",
          },
          {
            id: "ip8_7",
            label: "Fillet corners remain rounded (not flat)",
            initials: "",
          },
        ],
        removeFromPaintlineInitials: "",
      },

      visual: {
        date: "",
        notes: "",
        items: [
          { id: "vis_1", label: "Pinholes / Pitting", initials: "" },
          { id: "vis_2", label: "Embeds verified", initials: "" },
          { id: "vis_3", label: "Threading verified", initials: "" },
          { id: "vis_4", label: "Corners / Contours", initials: "" },
          { id: "vis_5", label: "Air Pockets / Bugholes", initials: "" },
          { id: "vis_6", label: "Uniform Flatness", initials: "" },
        ],
        approvedForPrimerInitials: "",
        approvedForTopcoatInitials: "",
        qcFinalApprovalInitials: "",
      },

      markup: {
        tool: "PEN",
        legendKey: "HIGH",
        brushSize: 6,
        backgroundImageDataUrl: null,
        drawingDataUrl: null,
      },
    }),
    []
  );

  const [data, setData] = useState(
    () => safeParse(localStorage.getItem(storageKey)) || defaultData
  );

  // If URL included ?po=..., set it once and lock input UI
  useEffect(() => {
    if (!poFromUrl) return;
    setData((p) => {
      if (p.header?.productionOrder) return p;
      return {
        ...p,
        header: { ...p.header, productionOrder: poFromUrl },
      };
    });
  }, [poFromUrl]);

  // Persist per-PO
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }, [data, storageKey]);

  const productionOrder = data.header.productionOrder;
  const panelSerial = data.header.panelSerial;

  const setProductionOrder = (v) =>
    setData((p) => ({ ...p, header: { ...p.header, productionOrder: v } }));

  const setPanelSerial = (v) =>
    setData((p) => ({ ...p, header: { ...p.header, panelSerial: v } }));

  function setInitials(sectionKey, itemId, value) {
    setData((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        items: prev[sectionKey].items.map((it) =>
          it.id === itemId ? { ...it, initials: value } : it
        ),
      },
    }));
  }

  // ---------- Markup (two-layer canvas) ----------
  const bgCanvasRef = useRef(null);
  const drawCanvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastRef = useRef(null);

  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width,
      ch = canvas.height;
    ctx.clearRect(0, 0, cw, ch);

    if (!data.markup.backgroundImageDataUrl) return;

    const img = new Image();
    img.onload = () => {
      const iw = img.width,
        ih = img.height;
      const scale = Math.min(cw / iw, ch / ih);
      const w = iw * scale,
        h = ih * scale;
      const x = (cw - w) / 2,
        y = (ch - h) / 2;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, x, y, w, h);
    };
    img.src = data.markup.backgroundImageDataUrl;
  }, [data.markup.backgroundImageDataUrl]);

  useEffect(() => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!data.markup.drawingDataUrl) return;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = data.markup.drawingDataUrl;
  }, [data.markup.drawingDataUrl]);

  function saveDrawingToState() {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    setData((p) => ({ ...p, markup: { ...p.markup, drawingDataUrl: url } }));
  }

  function getPoint(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy };
  }

  function drawLine(from, to) {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = data.markup.brushSize;

    if (data.markup.tool === "ERASER") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = colorForKey(data.markup.legendKey);
    }

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.restore();
  }

  function onPointerDown(e) {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    lastRef.current = getPoint(e, canvas);
  }

  function onPointerMove(e) {
    if (!isDrawingRef.current || !lastRef.current) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const next = getPoint(e, canvas);
    drawLine(lastRef.current, next);
    lastRef.current = next;
  }

  function onPointerUp() {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastRef.current = null;
    saveDrawingToState();
  }

  function clearDrawingOnly() {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setData((p) => ({ ...p, markup: { ...p.markup, drawingDataUrl: null } }));
  }

  function clearBackgroundAndDrawing() {
    const bg = bgCanvasRef.current;
    const dr = drawCanvasRef.current;
    if (bg) bg.getContext("2d")?.clearRect(0, 0, bg.width, bg.height);
    if (dr) dr.getContext("2d")?.clearRect(0, 0, dr.width, dr.height);
    setData((p) => ({
      ...p,
      markup: {
        ...p.markup,
        backgroundImageDataUrl: null,
        drawingDataUrl: null,
      },
    }));
  }

  function exportFlattenedPng() {
    const bg = bgCanvasRef.current;
    const dr = drawCanvasRef.current;
    if (!bg || !dr) return;

    const out = document.createElement("canvas");
    out.width = bg.width;
    out.height = bg.height;

    const ctx = out.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(bg, 0, 0);
    ctx.drawImage(dr, 0, 0);

    const url = out.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;

    const po = (productionOrder || "").trim();
    const ps = (panelSerial || "").trim();
    a.download = `markup${po ? `_${po}` : ""}${ps ? `_${ps}` : ""}.png`;

    a.click();
  }

  const twoCol = {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
    gap: 14,
  };

  const threeCol = {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)",
    gap: 14,
  };

  const pageStyle = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: 16,
    fontFamily:
      '"Montserrat", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    background: "#fafafa",
    minHeight: "100vh",
  };

  const contextChip = {
    display: "inline-flex",
    gap: 8,
    alignItems: "center",
    border: "1px solid #e7e7e7",
    background: "#fff",
    padding: "7px 10px",
    borderRadius: 999,
    fontSize: 13,
  };

  return (
    <div style={pageStyle}>
      {/* HEADER */}
      <Card style={{ padding: 16 }}>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: 60,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src={LOGO_URL}
              alt=""
              style={{ height: LOGO_HEIGHT_PX, objectFit: "contain" }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 26,
              fontWeight: 900,
              color: BRAND,
              pointerEvents: "none",
              letterSpacing: 0.2,
            }}
          >
            Quality Master
          </div>

          {/* No Reset button (per request) */}
          <div style={{ width: 1, height: 1 }} />
        </div>

        {/* Key fields */}
        <div
          style={{
            marginTop: 14,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            maxWidth: 760,
          }}
        >
          <div>
            <FieldLabel>Production Order</FieldLabel>
            <TextField
              value={productionOrder}
              onChange={(e) => setProductionOrder(e.target.value)}
              placeholder="Use a PO link (?po=...) or enter here"
              readOnly={!!poFromUrl}
            />
            {!!poFromUrl && (
              <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
                Locked from link: <b>{poFromUrl}</b>
              </div>
            )}
          </div>

          <div>
            <FieldLabel>Panel Serial</FieldLabel>
            <TextField
              value={panelSerial}
              onChange={(e) => setPanelSerial(e.target.value)}
              placeholder="Enter panel serial"
            />
          </div>
        </div>
      </Card>

      {/* Sticky context bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "rgba(250,250,250,0.92)",
          backdropFilter: "blur(6px)",
          padding: "10px 0",
          marginTop: 10,
          marginBottom: 12,
          borderBottom: "1px solid #eee",
        }}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={contextChip}>
            <span style={{ fontWeight: 900, color: BRAND }}>PO</span>
            <span>{productionOrder || "—"}</span>
          </div>
          <div style={contextChip}>
            <span style={{ fontWeight: 900, color: BRAND }}>Panel</span>
            <span>{panelSerial || "—"}</span>
          </div>
        </div>
      </div>

      {/* IP6 */}
      <Section title="Inspection Point 6" subtitle="Pre-Paint Line Inspection">
        <div style={{ maxWidth: 320 }}>
          <FieldLabel>Date</FieldLabel>
          <TextField
            type="date"
            value={data.ip6.date}
            onChange={(e) =>
              setData((p) => ({
                ...p,
                ip6: { ...p.ip6, date: e.target.value },
              }))
            }
          />
        </div>

        <div style={{ height: 12 }} />

        <ChecklistInitials
          items={data.ip6.items}
          onChange={(id, v) => setInitials("ip6", id, v)}
        />

        <div style={{ height: 12 }} />

        <div style={twoCol}>
          <div style={{ minWidth: 0 }}>
            <FieldLabel>Ready for Primer</FieldLabel>
            <TextField
              placeholder="Initials"
              value={data.ip6.readyForPrimerInitials}
              onChange={(e) =>
                setData((p) => ({
                  ...p,
                  ip6: { ...p.ip6, readyForPrimerInitials: e.target.value },
                }))
              }
            />
          </div>

          <div style={{ minWidth: 0 }}>
            <FieldLabel>Notes</FieldLabel>
            <TextArea
              value={data.ip6.notes}
              onChange={(e) =>
                setData((p) => ({
                  ...p,
                  ip6: { ...p.ip6, notes: e.target.value },
                }))
              }
            />
          </div>
        </div>
      </Section>

      {/* IP8 */}
      <Section
        title="Inspection Point 8"
        subtitle="Post-Paint Inspection (Coraflon)"
      >
        <div style={{ maxWidth: 320 }}>
          <FieldLabel>Date</FieldLabel>
          <TextField
            type="date"
            value={data.ip8.date}
            onChange={(e) =>
              setData((p) => ({
                ...p,
                ip8: { ...p.ip8, date: e.target.value },
              }))
            }
          />
        </div>

        <div style={{ height: 12 }} />

        <ChecklistInitials
          items={data.ip8.items}
          onChange={(id, v) => setInitials("ip8", id, v)}
        />

        <div style={{ height: 12 }} />

        <div style={twoCol}>
          <div style={{ minWidth: 0 }}>
            <FieldLabel>Remove from the Paintline</FieldLabel>
            <TextField
              placeholder="Initials"
              value={data.ip8.removeFromPaintlineInitials}
              onChange={(e) =>
                setData((p) => ({
                  ...p,
                  ip8: {
                    ...p.ip8,
                    removeFromPaintlineInitials: e.target.value,
                  },
                }))
              }
            />
          </div>

          <div style={{ minWidth: 0 }}>
            <FieldLabel>Notes</FieldLabel>
            <TextArea
              value={data.ip8.notes}
              onChange={(e) =>
                setData((p) => ({
                  ...p,
                  ip8: { ...p.ip8, notes: e.target.value },
                }))
              }
            />
          </div>
        </div>
      </Section>

      {/* Visual */}
      <Section title="Visual Inspection Guide">
        <div style={{ maxWidth: 320 }}>
          <FieldLabel>Date</FieldLabel>
          <TextField
            type="date"
            value={data.visual.date}
            onChange={(e) =>
              setData((p) => ({
                ...p,
                visual: { ...p.visual, date: e.target.value },
              }))
            }
          />
        </div>

        <div style={{ height: 12 }} />

        <div style={threeCol}>
          <div style={{ minWidth: 0 }}>
            <FieldLabel>Approved for primer</FieldLabel>
            <TextField
              placeholder="Initials"
              value={data.visual.approvedForPrimerInitials}
              onChange={(e) =>
                setData((p) => ({
                  ...p,
                  visual: {
                    ...p.visual,
                    approvedForPrimerInitials: e.target.value,
                  },
                }))
              }
            />
          </div>

          <div style={{ minWidth: 0 }}>
            <FieldLabel>Approved for topcoat</FieldLabel>
            <TextField
              placeholder="Initials"
              value={data.visual.approvedForTopcoatInitials}
              onChange={(e) =>
                setData((p) => ({
                  ...p,
                  visual: {
                    ...p.visual,
                    approvedForTopcoatInitials: e.target.value,
                  },
                }))
              }
            />
          </div>

          <div style={{ minWidth: 0 }}>
            <FieldLabel>QC Final Approval</FieldLabel>
            <TextField
              placeholder="Initials"
              value={data.visual.qcFinalApprovalInitials}
              onChange={(e) =>
                setData((p) => ({
                  ...p,
                  visual: {
                    ...p.visual,
                    qcFinalApprovalInitials: e.target.value,
                  },
                }))
              }
            />
          </div>
        </div>

        <div style={{ height: 12 }} />

        <ChecklistInitials
          items={data.visual.items}
          onChange={(id, v) => setInitials("visual", id, v)}
        />

        <div style={{ height: 12 }} />

        <FieldLabel>Notes</FieldLabel>
        <TextArea
          value={data.visual.notes}
          onChange={(e) =>
            setData((p) => ({
              ...p,
              visual: { ...p.visual, notes: e.target.value },
            }))
          }
        />
      </Section>

      {/* Markup */}
      <Section title="Markup" subtitle="Annotate on top of an uploaded image">
        <Card style={{ padding: 14, marginBottom: 12 }}>
          <div style={{ fontWeight: 900, marginBottom: 8, color: BRAND }}>
            Color Legend
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              alignItems: "center",
            }}
          >
            {LEGEND.map((l) => {
              const active =
                data.markup.legendKey === l.key &&
                data.markup.tool !== "ERASER";
              return (
                <button
                  key={l.key}
                  type="button"
                  onClick={() =>
                    setData((p) => ({
                      ...p,
                      markup: { ...p.markup, tool: "PEN", legendKey: l.key },
                    }))
                  }
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    padding: "7px 10px",
                    borderRadius: 999,
                    border: active ? `2px solid ${BRAND}` : "1px solid #d7d7d7",
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 800,
                  }}
                >
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 4,
                      background: l.color,
                      border: "1px solid rgba(0,0,0,0.2)",
                      display: "inline-block",
                    }}
                  />
                  <span>{l.label}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() =>
                setData((p) => ({
                  ...p,
                  markup: { ...p.markup, tool: "ERASER" },
                }))
              }
              style={{
                padding: "7px 10px",
                borderRadius: 999,
                border:
                  data.markup.tool === "ERASER"
                    ? `2px solid ${BRAND}`
                    : "1px solid #d7d7d7",
                background: "#fff",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 900,
              }}
            >
              Eraser
            </button>

            <label
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginLeft: 6,
              }}
            >
              <span style={{ fontWeight: 900, color: BRAND }}>Brush</span>
              <input
                type="range"
                min={2}
                max={30}
                value={data.markup.brushSize}
                onChange={(e) =>
                  setData((p) => ({
                    ...p,
                    markup: {
                      ...p.markup,
                      brushSize: Number(e.target.value),
                    },
                  }))
                }
              />
              <span style={{ width: 52, textAlign: "right", fontWeight: 800 }}>
                {data.markup.brushSize}px
              </span>
            </label>
          </div>
        </Card>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontWeight: 900, color: BRAND }}>Upload image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () =>
                  setData((p) => ({
                    ...p,
                    markup: {
                      ...p.markup,
                      backgroundImageDataUrl: String(reader.result || ""),
                    },
                  }));
                reader.readAsDataURL(file);
                e.target.value = "";
              }}
            />
          </label>

          <Button onClick={clearDrawingOnly}>Clear Drawing</Button>
          <Button onClick={clearBackgroundAndDrawing}>Clear Background</Button>
          <Button onClick={saveDrawingToState}>Save Drawing</Button>
          <Button
            onClick={exportFlattenedPng}
            style={{ borderColor: BRAND, color: BRAND }}
          >
            Download PNG
          </Button>
        </div>

        <Card style={{ padding: 0 }}>
          <div
            style={{
              border: "1px solid #e6e6e6",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                background: "#fff",
              }}
            >
              <canvas
                ref={bgCanvasRef}
                width={900}
                height={450}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
              <canvas
                ref={drawCanvasRef}
                width={900}
                height={450}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "auto",
                  display: "block",
                  touchAction: "none",
                }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onPointerLeave={onPointerUp}
              />
            </div>
          </div>
        </Card>
      </Section>

      <div style={{ height: 24 }} />
    </div>
  );
}
