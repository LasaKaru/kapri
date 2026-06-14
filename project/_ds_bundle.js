/* @ds-bundle: {"format":3,"namespace":"DesignSystem_db2035","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"CategoryTile","sourcePath":"components/core/CategoryTile.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"DeliveryStatus","sourcePath":"components/core/DeliveryStatus.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"MessageBubble","sourcePath":"components/core/MessageBubble.jsx"},{"name":"ProductCard","sourcePath":"components/core/ProductCard.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"cc3b6b3758ab","components/core/Button.jsx":"dff41d1d9149","components/core/CategoryTile.jsx":"bebe5a6ce9b3","components/core/Chip.jsx":"be0ddcdc5962","components/core/DeliveryStatus.jsx":"956870c509ff","components/core/Icon.jsx":"15a355006df3","components/core/IconButton.jsx":"20a8c3f19673","components/core/MessageBubble.jsx":"af4a01eb3e10","components/core/ProductCard.jsx":"035062f7378b","kapri-app/app.jsx":"e2ddf27da6f4","kapri-app/checkout.jsx":"abf4c5e3c185","kapri-app/data.jsx":"ec4612cd1103","kapri-app/engine.jsx":"cb11ab7583fa","kapri-app/genui.jsx":"6d6afa209b4a","kapri-app/ui.jsx":"a90584b97984","ui_kits/kapri/App.jsx":"a4930539c18c","ui_kits/kapri/GenUI.jsx":"f4caee0a65ae","ui_kits/kapri/Parts.jsx":"ce64c1ffcbfe"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.DesignSystem_db2035 = window.DesignSystem_db2035 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Small status / metadata badge. Used for discounts, stock state,
 * category pills over images, and the yellow cart/LIVE badges.
 */
function Badge({
  tone = 'neutral',
  children,
  style = {},
  ...props
}) {
  const tones = {
    neutral: {
      background: 'var(--surface)',
      color: 'var(--muted)',
      border: '1px solid var(--line)'
    },
    purple: {
      background: 'rgba(68,42,115,0.80)',
      color: '#fff',
      backdropFilter: 'blur(4px)'
    },
    accent: {
      background: 'var(--yellow-400)',
      color: 'var(--purple-700)',
      fontWeight: 700
    },
    success: {
      background: 'rgba(31,157,87,0.90)',
      color: '#fff'
    },
    warn: {
      background: 'rgba(217,138,0,0.90)',
      color: '#fff'
    },
    error: {
      background: 'rgba(214,59,59,0.90)',
      color: '#fff'
    },
    ink: {
      background: 'rgba(27,18,48,0.70)',
      color: '#fff',
      backdropFilter: 'blur(4px)'
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontFamily: 'var(--font-sans)',
      fontSize: 10,
      fontWeight: tones[tone].fontWeight || 600,
      lineHeight: 1,
      padding: '4px 8px',
      borderRadius: 'var(--radius-full)',
      whiteSpace: 'nowrap',
      ...tones[tone],
      ...style
    }
  }, props), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Kapruka primary action button.
 * Variants: primary (purple), secondary (outline), ghost, yellow (CTA).
 * Rounded 14px, semibold, springs down on press (active:scale-95).
 */
function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  children,
  style = {},
  ...props
}) {
  const sizes = {
    sm: {
      fontSize: 12,
      padding: '6px 12px'
    },
    md: {
      fontSize: 14,
      padding: '8px 16px'
    },
    lg: {
      fontSize: 16,
      padding: '12px 24px'
    }
  };
  const variants = {
    primary: {
      background: 'var(--purple-700)',
      color: '#fff',
      border: '2px solid transparent'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--purple-700)',
      border: '2px solid var(--purple-700)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--muted)',
      border: '2px solid transparent'
    },
    yellow: {
      background: 'var(--yellow-400)',
      color: 'var(--purple-700)',
      border: '2px solid transparent',
      fontWeight: 700
    }
  };
  const [hover, setHover] = React.useState(false);
  const hoverBg = {
    primary: 'var(--purple-600)',
    secondary: 'rgba(68,42,115,0.05)',
    ghost: 'var(--purple-100)',
    yellow: 'var(--yellow-500)'
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      width: fullWidth ? '100%' : 'auto',
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-sans)',
      fontWeight: variants[variant].fontWeight || 600,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
      ...sizes[size],
      ...variants[variant],
      ...(hover && !disabled ? {
        background: hoverBg[variant]
      } : {}),
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = 'scale(0.95)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'scale(1)';
    }
  }, props), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/CategoryTile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Category / occasion tile — emoji over label, used in the CategoryGrid.
 * Lifts and tints purple on hover.
 */
function CategoryTile({
  emoji,
  label,
  onClick,
  style = {},
  ...props
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      padding: 10,
      background: hover ? 'var(--purple-50)' : '#fff',
      border: `1px solid ${hover ? 'var(--purple-400)' : 'var(--line)'}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      cursor: 'pointer',
      transition: 'all var(--dur-fast) var(--ease-out)',
      ...style
    },
    onMouseDown: e => e.currentTarget.style.transform = 'scale(0.95)',
    onMouseUp: e => e.currentTarget.style.transform = 'scale(1)'
  }, props), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22,
      lineHeight: 1
    },
    role: "img",
    "aria-label": label
  }, emoji), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 10,
      fontWeight: 500,
      color: 'var(--ink)',
      textAlign: 'center',
      lineHeight: 1.2
    }
  }, label));
}
Object.assign(__ds_scope, { CategoryTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/CategoryTile.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Pill button used for quick-reply chips under Kapri messages and
 * the refine/sort bar on carousels. Two looks: outline (white) and
 * tonal (purple-100). Selected = solid purple.
 */
function Chip({
  children,
  selected = false,
  variant = 'outline',
  onClick,
  style = {},
  ...props
}) {
  const [hover, setHover] = React.useState(false);
  const base = {
    outline: {
      background: '#fff',
      color: 'var(--purple-700)',
      border: '1px solid var(--line)'
    },
    tonal: {
      background: 'var(--purple-100)',
      color: 'var(--purple-700)',
      border: '1px solid var(--purple-200)'
    }
  };
  const sel = {
    background: 'var(--purple-700)',
    color: '#fff',
    border: '1px solid var(--purple-700)'
  };
  const hov = {
    outline: {
      borderColor: 'var(--purple-700)',
      background: 'var(--purple-50)'
    },
    tonal: {
      borderColor: 'var(--purple-400)'
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      fontWeight: 600,
      padding: '5px 12px',
      borderRadius: 'var(--radius-full)',
      cursor: 'pointer',
      boxShadow: 'var(--shadow-sm)',
      transition: 'all var(--dur-fast) var(--ease-out)',
      ...(selected ? sel : base[variant]),
      ...(hover && !selected ? hov[variant] : {}),
      ...style
    },
    onMouseDown: e => e.currentTarget.style.transform = 'scale(0.95)',
    onMouseUp: e => e.currentTarget.style.transform = 'scale(1)'
  }, props), children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Lucide-faithful icon. Outline, 2px stroke, round caps — matches the
 * brand's iconography. Pass a lucide `name`; size/color inherit or via props.
 */
const PATHS = {
  'shopping-cart': '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  'shopping-bag': '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  'external-link': '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"/>',
  'check': '<path d="M20 6 9 17l-5-5"/>',
  'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m22 4-10 10.01-3-3"/>',
  'x-circle': '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
  'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  'send': '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  'mic': '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
  'plus': '<path d="M5 12h14"/><path d="M12 5v14"/>',
  'minus': '<path d="M5 12h14"/>',
  'trash-2': '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'chevron-left': '<path d="m15 18-6-6 6-6"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'sparkles': '<path d="M9.94 14.06 8 21l-1.94-6.94L-.88 12l6.94-1.94L8 3l1.94 6.94L16 12l-6.06 2.06Z" transform="translate(4)"/>',
  'truck': '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  'calendar': '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 2v4"/><path d="M16 2v4"/>',
  'clock': '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  'map-pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  'phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>',
  'package': '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  'gift': '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
  'alert-triangle': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>'
};
function Icon({
  name,
  size = 18,
  color = 'currentColor',
  strokeWidth = 2,
  style = {},
  ...props
}) {
  const inner = PATHS[name] || '';
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flexShrink: 0,
      display: 'block',
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: inner
    }
  }, props));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/DeliveryStatus.jsx
try { (() => {
function formatLKR(amount) {
  return `Rs. ${Number(amount).toLocaleString('en-LK')}`;
}

/**
 * Delivery availability card — generative UI for kapruka_check_delivery.
 * Green 2px border + soft header when available, red when not. Shows flat
 * delivery rate, and an amber (advisory, NOT error) perishable warning.
 */
function DeliveryStatus({
  city,
  date,
  available = true,
  rate,
  reason,
  nextAvailableDate,
  perishableWarning,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 360,
      background: '#fff',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: `2px solid ${available ? 'var(--success)' : 'var(--error)'}`,
      boxShadow: 'var(--shadow-md)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 16px',
      background: available ? 'var(--success-tint)' : 'var(--error-tint)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: available ? 'check-circle' : 'x-circle',
    size: 20,
    color: available ? 'var(--success)' : 'var(--error)'
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      fontWeight: 700,
      color: available ? 'var(--success)' : 'var(--error)'
    }
  }, available ? 'Delivery Available!' : 'Delivery Not Available'), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 12,
      color: 'var(--muted)',
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "calendar",
    size: 12
  }), " ", city, " \xB7 ", date))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, available && rate != null && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      color: 'var(--muted)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "truck",
    size: 16,
    color: "var(--purple-700)"
  }), " Delivery fee (flat per order)"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: 'var(--purple-700)'
    }
  }, formatLKR(rate))), reason && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 12px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--error-tint)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      color: 'var(--error)'
    }
  }, reason)), nextAvailableDate && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      color: 'var(--muted)'
    }
  }, "Next available: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--ink)'
    }
  }, nextAvailableDate)), perishableWarning && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8,
      padding: '10px 12px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--warn-tint)',
      border: '1px solid var(--yellow-200)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "alert-triangle",
    size: 16,
    color: "var(--warn)",
    style: {
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      lineHeight: 1.5,
      color: '#92400E'
    }
  }, perishableWarning))));
}
Object.assign(__ds_scope, { DeliveryStatus });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/DeliveryStatus.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Circular/rounded icon-only button. Used in chrome (cart, send, mic)
 * and inline actions. Defaults to the translucent-on-purple chrome style.
 */
function IconButton({
  icon,
  variant = 'chrome',
  size = 40,
  active = false,
  disabled = false,
  ariaLabel,
  style = {},
  ...props
}) {
  const variants = {
    chrome: {
      background: 'rgba(255,255,255,0.10)',
      color: '#fff'
    },
    soft: {
      background: 'var(--purple-100)',
      color: 'var(--purple-700)'
    },
    solid: {
      background: 'var(--purple-700)',
      color: '#fff'
    },
    danger: {
      background: 'var(--error)',
      color: '#fff'
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": ariaLabel,
    disabled: disabled,
    style: {
      width: size,
      height: size,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      transition: 'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
      ...variants[variant],
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = 'scale(0.92)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'scale(1)';
    }
  }, props), typeof icon === 'string' ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: Math.round(size * 0.45)
  }) : icon);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/MessageBubble.jsx
try { (() => {
/**
 * Chat message bubble. User = purple, right-aligned with a tail on the
 * top-right. Kapri = purple-100 ink, left-aligned with a 🛍️ avatar and a
 * tail on the top-left. Set `sinhala` for සිංහල/Tanglish line-height.
 */
function MessageBubble({
  role = 'kapri',
  children,
  sinhala = false,
  style = {}
}) {
  const isUser = role === 'user';
  const bubble = /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: isUser ? '82%' : '100%',
      padding: '10px 16px',
      fontFamily: sinhala ? 'var(--font-sinhala)' : 'var(--font-sans)',
      fontSize: 14,
      lineHeight: sinhala ? 1.6 : 1.5,
      color: isUser ? '#fff' : 'var(--ink)',
      background: isUser ? 'var(--purple-700)' : 'var(--purple-100)',
      borderRadius: 'var(--radius-lg)',
      borderTopRightRadius: isUser ? 'var(--radius-sm)' : 'var(--radius-lg)',
      borderTopLeftRadius: isUser ? 'var(--radius-lg)' : 'var(--radius-sm)',
      boxShadow: 'var(--shadow-sm)',
      whiteSpace: 'pre-wrap'
    }
  }, children);
  if (isUser) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'flex-end',
        ...style
      }
    }, bubble);
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      flexShrink: 0,
      marginTop: 2,
      borderRadius: 'var(--radius-full)',
      background: 'var(--purple-700)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 15,
      boxShadow: 'var(--shadow-sm)'
    }
  }, "\uD83D\uDECD\uFE0F"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      maxWidth: '90%',
      minWidth: 0
    }
  }, bubble));
}
Object.assign(__ds_scope, { MessageBubble });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/MessageBubble.jsx", error: String((e && e.message) || e) }); }

// components/core/ProductCard.jsx
try { (() => {
function formatLKR(amount) {
  return `Rs. ${Number(amount).toLocaleString('en-LK')}`;
}

/**
 * Product card — the atom of every carousel. White, rounded-20, purple-tinted
 * shadow, lifts on hover. Shows image, category tag, discount/stock badges,
 * name, summary, mono ID chip, price, and Add-to-Cart + open-on-Kapruka.
 */
function ProductCard({
  product,
  compact = false,
  onAdd,
  style = {}
}) {
  const {
    name,
    summary,
    id,
    price,
    compareAtPrice,
    image,
    category,
    inStock = true,
    lowStock = false
  } = product;
  const [hover, setHover] = React.useState(false);
  const [added, setAdded] = React.useState(false);
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discountPct = hasDiscount ? Math.round((1 - price / compareAtPrice) * 100) : 0;
  const handleAdd = () => {
    if (!inStock) return;
    setAdded(true);
    onAdd && onAdd(product);
    setTimeout(() => setAdded(false), 2000);
  };
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: compact ? 176 : 224,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: hover ? '0 12px 28px rgba(68,42,115,.20)' : 'var(--shadow-card)',
      transform: hover ? 'translateY(-3px)' : 'translateY(0)',
      transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: compact ? 160 : 208,
      background: 'var(--purple-50)',
      overflow: 'hidden'
    }
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transform: hover ? 'scale(1.05)' : 'scale(1)',
      transition: 'transform var(--dur-slow) var(--ease-out)'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 44
    }
  }, "\uD83C\uDF81"), category && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 8,
      left: 8
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "purple"
  }, category)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 8,
      right: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 4
    }
  }, !inStock && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "ink"
  }, "Out of Stock"), inStock && lowStock && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "warn"
  }, "Low Stock"), hasDiscount && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "success"
  }, "-", discountPct, "%"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontWeight: 600,
      fontSize: compact ? 12 : 14,
      lineHeight: 1.35,
      color: 'var(--ink)',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, name), !compact && summary && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 11,
      lineHeight: 1.5,
      color: 'var(--muted)',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, summary), /*#__PURE__*/React.createElement("span", {
    style: {
      alignSelf: 'flex-start',
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--muted)',
      background: 'var(--surface)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius-sm)',
      padding: '2px 6px'
    }
  }, id), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: compact ? 14 : 16,
      color: 'var(--purple-700)'
    }
  }, formatLKR(price)), hasDiscount && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--muted)',
      textDecoration: 'line-through'
    }
  }, formatLKR(compareAtPrice))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginTop: 'auto',
      paddingTop: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleAdd,
    disabled: !inStock,
    style: {
      flex: 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: '8px 0',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      fontWeight: 600,
      cursor: inStock ? 'pointer' : 'not-allowed',
      color: inStock ? '#fff' : 'var(--muted)',
      background: added ? 'var(--success)' : inStock ? 'var(--purple-700)' : 'var(--line)',
      transition: 'background var(--dur-fast) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: added ? 'check' : 'shopping-cart',
    size: 14
  }), added ? 'Added!' : 'Add to Cart'), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface)',
      border: '1px solid var(--line)',
      color: 'var(--muted)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "external-link",
    size: 14
  })))));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ProductCard.jsx", error: String((e && e.message) || e) }); }

// kapri-app/app.jsx
try { (() => {
/* Kapri demo — app orchestration. */
const {
  Header,
  SeasonBanner,
  UserBubble,
  KapriRow,
  KapriText,
  Typing,
  Chip,
  Composer
} = window.KapriUI;
const {
  EmptyState,
  ProductCarousel,
  BundleCard,
  DeliveryStatus,
  OrderTracker,
  ProductDetail,
  SkeletonCarousel
} = window.KapriGenUI;
const {
  CartDrawer,
  CheckoutFlow,
  CheckoutCard,
  PaymentSheet
} = window.KapriCheckout;
const {
  respond
} = window.KapriEngine;
const {
  CATALOG,
  CATEGORIES,
  BUNDLES,
  SEASON,
  LKR
} = window.KapriData;
const PROMPTS_EN = [{
  emoji: '🎁',
  text: 'I need a gift for my mother, under Rs. 5,000'
}, {
  emoji: '🎂',
  text: 'Mata ammata cake ekak gannako — Colombo ekata'
}, {
  emoji: '🛍️',
  text: 'අම්මට තෑග්ගක් — රු. 5000ට අඩුවෙන්'
}];
// Lead with the live season, then the staples
const PROMPTS = [{
  emoji: SEASON.emoji,
  text: SEASON.cta
}, ...PROMPTS_EN];
function App() {
  const [msgs, setMsgs] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [cart, setCart] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kapri_cart')) || [];
    } catch (e) {
      return [];
    }
  });
  const [giftMessage, setGiftMessage] = React.useState(() => {
    try {
      return localStorage.getItem('kapri_gift') || '';
    } catch (e) {
      return '';
    }
  });
  const [cartOpen, setCartOpen] = React.useState(false);
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);
  const [detailProduct, setDetailProduct] = React.useState(null);
  const [payOrder, setPayOrder] = React.useState(null);
  const [paidRef, setPaidRef] = React.useState(null);
  const [placedOrder, setPlacedOrder] = React.useState(null);
  const [lang, setLang] = React.useState(() => {
    try {
      return localStorage.getItem('kapri_lang') || 'en';
    } catch (e) {
      return 'en';
    }
  });
  const [lastLang, setLastLang] = React.useState('en');
  const [typing, setTyping] = React.useState(false);
  const [pendingKind, setPendingKind] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const [recording, setRecording] = React.useState(false);
  const recognitionRef = React.useRef(null);
  const scrollRef = React.useRef(null);
  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [msgs, typing]);
  // Persistence — cart, gift message and language survive a refresh
  React.useEffect(() => {
    try {
      localStorage.setItem('kapri_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);
  React.useEffect(() => {
    try {
      localStorage.setItem('kapri_gift', giftMessage);
    } catch (e) {}
  }, [giftMessage]);
  React.useEffect(() => {
    try {
      localStorage.setItem('kapri_lang', lang);
    } catch (e) {}
  }, [lang]);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartIds = cart.map(i => i.p.id);
  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(null), 1900);
  };
  const addToCart = p => {
    setCart(c => {
      const e = c.find(i => i.p.id === p.id);
      return e ? c.map(i => i.p.id === p.id ? {
        ...i,
        qty: i.qty + 1
      } : i) : [...c, {
        p,
        qty: 1,
        icing: ''
      }];
    });
    showToast(`Added · ${p.name.split('—')[0].trim()} 🛒`);
  };
  const addDetail = (p, qty = 1, icing) => {
    setCart(c => {
      const e = c.find(i => i.p.id === p.id);
      return e ? c.map(i => i.p.id === p.id ? {
        ...i,
        qty: i.qty + qty,
        icing: icing || i.icing
      } : i) : [...c, {
        p,
        qty,
        icing: icing || ''
      }];
    });
    showToast(`Added · ${p.name.split('—')[0].trim()} 🛒`);
  };
  const addBundle = key => {
    const ids = BUNDLES[key].ids;
    ids.forEach(id => {
      const p = CATALOG.find(x => x.id === id);
      if (p) addToCart(p);
    });
    showToast('Bundle added to cart 🎁');
  };
  const changeQty = (id, d) => setCart(c => c.map(i => i.p.id === id ? {
    ...i,
    qty: Math.max(1, i.qty + d)
  } : i));
  const removeItem = id => setCart(c => c.filter(i => i.p.id !== id));
  const setIcing = (id, v) => setCart(c => c.map(i => i.p.id === id ? {
    ...i,
    icing: v
  } : i));
  const send = text => {
    const v = (text ?? input).trim();
    if (!v) return;
    const isSearch = !/track|vimp|check ?out|pay now|place.*order|^\s*(help|hi|hello|hey|ayubowan)\s*$/i.test(v);
    setInput('');
    setMsgs(m => [...m, {
      role: 'user',
      text: v
    }]);
    setTyping(true);
    setPendingKind(isSearch ? 'search' : null);
    setTimeout(() => {
      const r = respond(v, {
        cartCount: cart.reduce((s, i) => s + i.qty, 0),
        lastVimp: placedOrder ? placedOrder.number : null
      });
      setLastLang(r.lang);
      if (r.lang !== 'en') setLang('si');
      setTyping(false);
      setPendingKind(null);
      setMsgs(m => [...m, {
        role: 'kapri',
        ...r
      }]);
      if (r.action === 'checkout') setTimeout(() => setCheckoutOpen(true), 350);
    }, 850 + Math.random() * 400);
  };
  const startCheckout = () => {
    setCartOpen(false);
    if (cartCount === 0) {
      send('I want to checkout');
      return;
    }
    setCheckoutOpen(true);
  };
  const onPlaced = order => {
    setCheckoutOpen(false);
    const vimp = 'VIMP' + Math.floor(10000 + Math.random() * 89999) + 'CB2';
    setPlacedOrder({
      number: vimp,
      statusDisplay: 'Order received',
      stage: 0,
      live: true,
      orderDate: new Date().toLocaleDateString('en-LK', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      }),
      deliveryDate: order.date ? `${order.date.label} ${order.date.day} ${order.date.mon}` : 'Soon',
      recipient: `${order.recipient}, ${order.city}`,
      amount: order.total,
      items: (order.items || []).map(it => ({
        img: it.p.img,
        name: it.p.name,
        qty: it.qty,
        price: it.p.price,
        icing: it.icing
      }))
    });
    setMsgs(m => [...m, {
      role: 'kapri',
      lang: lastLang,
      text: {
        en: `Bohoma santhosai! 🎉 Your order's locked in — just tap Pay Now to finish. After payment you'll get a VIMP tracking number by email.`,
        si: `බොහොම සන්තෝසයි! 🎉 ඔබේ ඇණවුම සකස් වුණා — අවසන් කරන්න Pay Now ඔබන්න. ගෙවීමෙන් පසු VIMP ට්‍රැකින් අංකයක් ඊමේල් එකෙන් ලැබේවි.`,
        tl: `Bohoma santhosai! 🎉 Oyage order eka lock-una — ivara karanna Pay Now eka press karanna. Gevimen passe VIMP tracking number ekak email ekata enawa.`
      }[lastLang] || '',
      card: {
        type: 'checkout',
        order
      },
      chips: ['Track my order', 'Shop something else']
    }]);
    setCart([]);
    setGiftMessage('');
  };
  const onPaid = o => {
    setPayOrder(null);
    setPaidRef(o.ref);
    setPlacedOrder(p => p ? {
      ...p,
      stage: 1,
      statusDisplay: 'Order confirmed'
    } : p);
    showToast('Payment successful 🎉');
    setMsgs(m => [...m, {
      role: 'kapri',
      lang: lastLang,
      text: {
        en: `Payment received — bohoma sthuthi! 🎉 Your order is confirmed and our team is on it. Track it anytime with your VIMP number.`,
        si: `ගෙවීම ලැබුණා — බොහොම ස්තූතියි! 🎉 ඔබේ ඇණවුම තහවුරුයි, අපේ කණ්ඩායම වැඩ පටන් අරන්. VIMP අංකයෙන් ඕනෑම වෙලාවක ට්‍රැක් කරන්න.`,
        tl: `Gevima læbuna — bohoma sthuthi! 🎉 Oyage order eka confirm, ape team eka weda patan aran. VIMP number eken ඕනෑම velawaka track karanna.`
      }[lastLang] || '',
      chips: ['Track my order', 'Shop something else']
    }]);
  };

  // Real speech-to-text — Sinhala first (si-LK), graceful fallback if unsupported/blocked.
  const onMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (recording && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }
    if (!SR) {
      // no Web Speech API → simulate so the demo still shows the flow
      setRecording(true);
      showToast('🎤 Listening… (demo)');
      setTimeout(() => {
        setRecording(false);
        send('Mata ammata mal bouquet ekak ඕනේ');
      }, 1500);
      return;
    }
    const rec = new SR();
    rec.lang = 'si-LK'; // Sinhala; en-LK words still resolve
    rec.interimResults = true;
    rec.continuous = false;
    let finalText = '';
    rec.onresult = e => {
      let interim = '';
      finalText = '';
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;else interim += r[0].transcript;
      }
      setInput(finalText || interim);
    };
    rec.onerror = e => {
      setRecording(false);
      if (e && e.error === 'not-allowed') showToast('🎤 Mic blocked — allow access to talk to Kapri');
    };
    rec.onend = () => {
      setRecording(false);
      const t = (finalText || '').trim();
      if (t) send(t);
    };
    recognitionRef.current = rec;
    setRecording(true);
    showToast('🎤 Listening… speak in Sinhala or English');
    try {
      rec.start();
    } catch (e) {
      setRecording(false);
    }
  };
  const lastKapri = msgs.map(m => m.role).lastIndexOf('kapri');
  const renderCard = card => {
    if (!card) return null;
    if (card.type === 'carousel') return /*#__PURE__*/React.createElement(ProductCarousel, {
      products: card.items,
      cartIds: cartIds,
      onAdd: addToCart,
      onOpen: setDetailProduct
    });
    if (card.type === 'bundle') {
      const b = BUNDLES[card.key];
      const prods = b.ids.map(id => CATALOG.find(x => x.id === id)).filter(Boolean);
      return /*#__PURE__*/React.createElement(BundleCard, {
        bundle: b,
        products: prods,
        cartIds: cartIds,
        onAdd: addToCart,
        onAddAll: () => addBundle(card.key),
        onGiftMsg: msg => {
          setGiftMessage(msg);
          showToast('Gift message saved ✍️');
        }
      });
    }
    if (card.type === 'delivery') {
      const today = new Date();
      const d = new Date(today);
      d.setDate(today.getDate() + (card.slow ? 2 : 1));
      const date = d.toLocaleDateString('en-LK', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
      return /*#__PURE__*/React.createElement(DeliveryStatus, {
        city: card.city,
        date: date,
        available: true,
        rate: card.rate,
        perishableWarning: card.slow ? `${card.city} needs a 2-day lead time, but we deliver there happily! Pick a date 2+ days out at checkout.` : null
      });
    }
    if (card.type === 'tracker') {
      if (placedOrder && (!card.number || card.number === placedOrder.number)) return /*#__PURE__*/React.createElement(OrderTracker, {
        order: {
          ...placedOrder,
          stage: 2,
          statusDisplay: 'Out for delivery'
        }
      });
      return /*#__PURE__*/React.createElement(OrderTracker, {
        order: {
          ...DEMO_ORDER,
          number: card.number || DEMO_ORDER.number
        }
      });
    }
    if (card.type === 'checkout') return /*#__PURE__*/React.createElement(CheckoutCard, {
      order: card.order,
      paid: card.order.ref === paidRef,
      onPay: o => setPayOrder(o)
    });
    return null;
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      background: 'var(--surface)'
    }
  }, /*#__PURE__*/React.createElement(Header, {
    count: cartCount,
    onCart: () => setCartOpen(true),
    lang: lang,
    onLang: () => setLang(l => l === 'en' ? 'si' : 'en')
  }), /*#__PURE__*/React.createElement(SeasonBanner, {
    season: SEASON,
    onShop: q => send('Show me ' + q)
  }), /*#__PURE__*/React.createElement("div", {
    ref: scrollRef,
    className: "scrollbar-hide",
    style: {
      flex: 1,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 780,
      flex: '1 0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      padding: '16px 16px 20px'
    }
  }, msgs.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, {
    prompts: PROMPTS,
    onPrompt: send,
    categories: CATEGORIES,
    onCategory: q => send('Show me ' + q),
    lang: lang
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, msgs.map((m, i) => m.role === 'user' ? /*#__PURE__*/React.createElement(UserBubble, {
    key: i
  }, m.text) : /*#__PURE__*/React.createElement(KapriRow, {
    key: i
  }, m.text && /*#__PURE__*/React.createElement(KapriText, null, m.text), renderCard(m.card), i === lastKapri && m.chips && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 2
    }
  }, m.chips.map(c => /*#__PURE__*/React.createElement(Chip, {
    key: c,
    onClick: () => send(c)
  }, c))))), typing && /*#__PURE__*/React.createElement(Typing, null), typing && pendingKind === 'search' && /*#__PURE__*/React.createElement("div", {
    style: {
      paddingLeft: 39
    }
  }, /*#__PURE__*/React.createElement(SkeletonCarousel, null))))), /*#__PURE__*/React.createElement(Composer, {
    value: input,
    onChange: setInput,
    onSend: () => send(),
    onMic: onMic,
    recording: recording,
    placeholder: lang === 'en' ? 'Type in English, Sinhala, or Tanglish…' : 'සිංහලෙන්, English, හෝ Tanglish ලියන්න…'
  }), /*#__PURE__*/React.createElement(CartDrawer, {
    open: cartOpen,
    items: cart,
    giftMessage: giftMessage,
    onClose: () => setCartOpen(false),
    onQty: changeQty,
    onRemove: removeItem,
    onIcing: setIcing,
    onCheckout: startCheckout,
    lang: lastLang
  }), checkoutOpen && /*#__PURE__*/React.createElement(CheckoutFlow, {
    items: cart,
    giftMessage: giftMessage,
    lang: lastLang,
    onClose: () => setCheckoutOpen(false),
    onPlaced: onPlaced
  }), detailProduct && /*#__PURE__*/React.createElement(ProductDetail, {
    p: detailProduct,
    inCart: cartIds.includes(detailProduct.id),
    onAdd: addDetail,
    onClose: () => setDetailProduct(null)
  }), payOrder && /*#__PURE__*/React.createElement(PaymentSheet, {
    order: payOrder,
    onClose: () => setPayOrder(null),
    onPaid: onPaid
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 84,
      left: '50%',
      transform: `translateX(-50%) translateY(${toast ? 0 : 12}px)`,
      opacity: toast ? 1 : 0,
      pointerEvents: 'none',
      transition: 'all .25s var(--ease-out)',
      zIndex: 55,
      background: 'var(--ink)',
      color: '#fff',
      fontSize: 13,
      fontWeight: 600,
      padding: '9px 16px',
      borderRadius: 999,
      boxShadow: 'var(--shadow-lg)',
      whiteSpace: 'nowrap'
    }
  }, toast));
}
const DEMO_ITEMS = ['CAKE-2291', 'FLOWERS-118', 'CHOC-540'].map(id => CATALOG.find(p => p.id === id)).filter(Boolean).map(p => ({
  img: p.img,
  name: p.name,
  qty: 1,
  price: p.price
}));
const DEMO_ORDER = {
  number: 'VIMP34456CB2',
  statusDisplay: 'Out for delivery',
  stage: 2,
  live: true,
  orderDate: 'Thu, 12 Jun',
  deliveryDate: 'Sat, 14 Jun',
  recipient: 'Amma, Colombo 05',
  amount: 4850,
  items: DEMO_ITEMS
};
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "kapri-app/app.jsx", error: String((e && e.message) || e) }); }

// kapri-app/checkout.jsx
try { (() => {
/* Kapri demo — cart drawer, gift-message editor, checkout flow, checkout card. */
const {
  Ico
} = window.KapriUI;
const {
  LKR,
  CITIES
} = window.KapriData;
const {
  DeliveryStatus
} = window.KapriGenUI;
const DELIVERY_FEE_DEFAULT = 350;

// Mirrors the Kapruka MCP "Check Delivery Availability and Rate" tool:
// input: city, delivery_date (+ perishable items); output: available, rate,
// currency, reason, next_available_date, perishable_warning.
function checkAvailability(cityObj, dateObj, hasPerishable) {
  if (!cityObj || !dateObj) return null;
  const dow = new Date(dateObj.iso).getDay(); // 0 = Sunday
  // Outstation hubs don't run Sunday routes — surface next_available_date.
  if (cityObj.slow && dow === 0) {
    const nd = new Date(dateObj.iso);
    nd.setDate(nd.getDate() + 1);
    return {
      available: false,
      rate: cityObj.rate,
      currency: 'LKR',
      reason: `Sorry — we don't run delivery routes to ${cityObj.name} on Sundays.`,
      nextDate: nd.toLocaleDateString('en-LK', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      })
    };
  }
  return {
    available: true,
    rate: cityObj.rate,
    currency: 'LKR',
    reason: null,
    nextDate: null,
    perishableWarning: hasPerishable ? `This order has fresh items (cake/flowers) — they're prepared on the delivery day. Please make sure someone can receive it. Delivery to ${cityObj.name} is available!` : null
  };
}

// ---- Gift message AI "rewriter" (canned, tone × language) ----
const GIFT_REWRITES = {
  warm: {
    en: "Thinking of you today and always. This little something is sent with all my love — enjoy every bite and every moment. 💜",
    si: "අද සහ හැමදාම ඔබ ගැන හිතනවා. මේ පුංචි තෑග්ග මගේ සියලු ආදරයෙන් එවනවා. 💜",
    tl: "Adath, hetath, hamadama oba gæna hithanawa. Mehe punchi dheyak — mage siyalu adarayen. Bohoma snehayen! 💜"
  },
  witty: {
    en: "Warning: contents may cause excessive smiling and at least one happy dance. No regifting allowed. 😄🎁",
    si: "අවවාදයයි: මේ තෑග්ග වැඩිපුර හිනා වෙන්න සහ පොඩි නැටුමක් දාන්න හේතු වෙන්න පුළුවන්! 😄",
    tl: "Warning eka: meka open kaloth wadipura hinawenna puluwan, podi natumak ekka! Re-gift karanna epa hari? 😄🎁"
  },
  formal: {
    en: "With warm wishes and heartfelt regards on this special occasion. May it bring you joy and good fortune.",
    si: "මෙම විශේෂ අවස්ථාවේදී සුබ පැතුම් සහ හෘදයාංගම ආචාර. සතුට සහ සශ්‍රීකත්වය ළඟා වේවා.",
    tl: "Me vishesha avasthawe subha pætum. Satutai sashreekathwayai oba veta lægavewa."
  }
};
function GiftMessageEditor({
  value,
  lang,
  onChange
}) {
  const [tone, setTone] = React.useState('warm');
  const [busy, setBusy] = React.useState(false);
  const enhance = () => {
    setBusy(true);
    setTimeout(() => {
      onChange(GIFT_REWRITES[tone][lang] || GIFT_REWRITES[tone].en);
      setBusy(false);
    }, 700);
  };
  const tones = [['warm', 'Warm 💜'], ['witty', 'Witty 😄'], ['formal', 'Formal 🎩']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("textarea", {
    value: value,
    onChange: e => onChange(e.target.value),
    maxLength: 240,
    rows: 3,
    placeholder: "Write a gift message\u2026",
    className: "sinhala-text",
    style: {
      width: '100%',
      resize: 'none',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--line)',
      padding: '10px 12px',
      fontSize: 13.5,
      color: 'var(--ink)',
      background: 'var(--surface)',
      outline: 'none',
      fontFamily: 'var(--font-sans)',
      boxSizing: 'border-box'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--muted)',
      fontWeight: 600
    }
  }, "Tone:"), tones.map(([id, l]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: () => setTone(id),
    style: {
      fontSize: 11.5,
      fontWeight: 600,
      padding: '4px 10px',
      borderRadius: 999,
      cursor: 'pointer',
      border: '1px solid',
      ...(tone === id ? {
        background: 'var(--purple-700)',
        color: '#fff',
        borderColor: 'var(--purple-700)'
      } : {
        background: '#fff',
        color: 'var(--purple-700)',
        borderColor: 'var(--line)'
      })
    }
  }, l)), /*#__PURE__*/React.createElement("button", {
    onClick: enhance,
    disabled: busy,
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      fontSize: 12,
      fontWeight: 700,
      padding: '5px 12px',
      borderRadius: 999,
      border: 'none',
      cursor: 'pointer',
      background: 'var(--yellow-400)',
      color: 'var(--purple-700)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "wand",
    size: 13
  }), " ", busy ? 'Writing…' : 'Enhance')));
}

// ---- Cart Drawer ----
function CartDrawer({
  open,
  items,
  giftMessage,
  onClose,
  onQty,
  onRemove,
  onIcing,
  onCheckout,
  lang
}) {
  const subtotal = items.reduce((s, i) => s + i.p.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(2px)',
      zIndex: 40,
      opacity: open ? 1 : 0,
      pointerEvents: open ? 'auto' : 'none',
      transition: 'opacity .3s'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      maxWidth: 380,
      background: '#fff',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'var(--shadow-xl)',
      transform: open ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform .4s var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '15px 18px',
      background: 'var(--purple-700)',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontWeight: 600,
      fontSize: 17
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "bag",
    size: 20
  }), " Your Cart", count > 0 && ` (${count})`), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'none',
      border: 'none',
      color: '#fff',
      cursor: 'pointer',
      padding: 6
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "x",
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    className: "scrollbar-hide",
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 14,
      display: 'flex',
      flexDirection: 'column',
      gap: 11
    }
  }, items.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: 12,
      color: 'var(--muted)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "bag",
    size: 54,
    color: "var(--purple-200)"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontWeight: 500,
      fontSize: 14
    }
  }, "Your cart is empty"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12.5,
      textAlign: 'center',
      maxWidth: 190
    }
  }, "Ask Kapri to find something special for you! \uD83C\uDF81")) : items.map(it => {
    const isCake = it.p.id.toUpperCase().includes('CAKE');
    return /*#__PURE__*/React.createElement("div", {
      key: it.p.id,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        padding: 11,
        boxShadow: 'var(--shadow-sm)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 11
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: it.p.img,
      alt: it.p.name,
      style: {
        width: 60,
        height: 60,
        borderRadius: 'var(--radius-md)',
        objectFit: 'cover',
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 13.5,
        fontWeight: 500,
        color: 'var(--ink)',
        lineHeight: 1.3,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }
    }, it.p.name), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '3px 0 0',
        fontSize: 13.5,
        fontWeight: 700,
        color: 'var(--purple-700)'
      }
    }, LKR(it.p.price)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 6
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => onQty(it.p.id, -1),
      style: qbtn
    }, /*#__PURE__*/React.createElement(Ico, {
      name: "minus",
      size: 12
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 600,
        width: 18,
        textAlign: 'center'
      }
    }, it.qty), /*#__PURE__*/React.createElement("button", {
      onClick: () => onQty(it.p.id, 1),
      style: qbtn
    }, /*#__PURE__*/React.createElement(Ico, {
      name: "plus",
      size: 12
    })), /*#__PURE__*/React.createElement("button", {
      onClick: () => onRemove(it.p.id),
      style: {
        marginLeft: 'auto',
        background: 'none',
        border: 'none',
        color: 'var(--muted)',
        cursor: 'pointer',
        padding: 2
      }
    }, /*#__PURE__*/React.createElement(Ico, {
      name: "trash",
      size: 16
    }))))), isCake && /*#__PURE__*/React.createElement("input", {
      value: it.icing || '',
      onChange: e => onIcing(it.p.id, e.target.value),
      maxLength: 120,
      placeholder: "\u270D\uFE0F Message on cake (optional)",
      className: "sinhala-text",
      style: {
        width: '100%',
        fontSize: 12,
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--line)',
        padding: '7px 11px',
        outline: 'none',
        background: '#fff',
        fontFamily: 'var(--font-sans)',
        boxSizing: 'border-box'
      }
    }));
  }), items.length > 0 && giftMessage && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'flex-start',
      padding: '10px 12px',
      background: 'var(--purple-50)',
      borderRadius: 'var(--radius-md)',
      border: '1px dashed var(--purple-200)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "gift",
    size: 15,
    color: "var(--purple-700)",
    style: {
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("p", {
    className: "sinhala-text",
    style: {
      margin: 0,
      fontSize: 12,
      color: 'var(--ink)',
      fontStyle: 'italic',
      lineHeight: 1.45
    }
  }, "\u201C", giftMessage, "\u201D"))), items.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      borderTop: '1px solid var(--line)',
      display: 'flex',
      flexDirection: 'column',
      gap: 11
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--muted)',
      fontSize: 14
    }
  }, "Subtotal"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: 'var(--purple-700)',
      fontSize: 18
    }
  }, LKR(subtotal))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 11.5,
      color: 'var(--muted)'
    }
  }, "Flat delivery fee per order \u2014 calculated at checkout"), /*#__PURE__*/React.createElement("button", {
    onClick: onCheckout,
    style: {
      width: '100%',
      padding: '13px',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      background: 'var(--purple-700)',
      color: '#fff',
      fontWeight: 600,
      fontSize: 15,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7
    }
  }, "Checkout with Kapri ", /*#__PURE__*/React.createElement(Ico, {
    name: "arrow-right",
    size: 16
  })))));
}
const qbtn = {
  width: 25,
  height: 25,
  borderRadius: 8,
  background: '#fff',
  border: '1px solid var(--line)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'var(--ink)'
};

// ---- Checkout Flow (multi-step) ----
function dateStrip(leadDays) {
  const out = [];
  const today = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push({
      iso: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en-LK', {
        weekday: 'short'
      }),
      day: d.getDate(),
      mon: d.toLocaleDateString('en-LK', {
        month: 'short'
      }),
      disabled: i < leadDays
    });
  }
  return out;
}
function CheckoutFlow({
  items,
  giftMessage,
  onClose,
  onPlaced,
  lang
}) {
  const [step, setStep] = React.useState(0);
  const [f, setF] = React.useState({
    name: '',
    phone: '',
    city: 'Colombo',
    address: '',
    notes: '',
    date: '',
    sender: '',
    anon: false,
    msg: giftMessage || ''
  });
  const [cityQuery, setCityQuery] = React.useState('');
  const set = (k, v) => setF(p => ({
    ...p,
    [k]: v
  }));
  const cityObj = CITIES.find(c => c.name === f.city) || CITIES[0];
  const lead = cityObj.slow ? 2 : 1;
  const dates = React.useMemo(() => dateStrip(lead), [lead]);
  const hasPerishable = items.some(i => i.p.perishable);
  const subtotal = items.reduce((s, i) => s + i.p.price * i.qty, 0);
  const cityMatches = cityQuery.trim() ? CITIES.filter(c => c.name.toLowerCase().includes(cityQuery.trim().toLowerCase())).slice(0, 6) : [];
  const avail = checkAvailability(cityObj, dates.find(d => d.iso === f.date), hasPerishable);
  const steps = ['Recipient', 'Delivery', 'Gift', 'Review'];
  const canNext = [f.name.trim() && f.phone.trim().length >= 9, f.address.trim().length >= 6 && f.date && avail && avail.available, true, true][step];
  const place = () => {
    onPlaced({
      ref: 'ORD-' + Math.floor(1000 + Math.random() * 8999) + '-KP',
      city: f.city,
      date: dates.find(d => d.iso === f.date),
      rate: cityObj.rate,
      recipient: f.name,
      phone: f.phone,
      address: f.address,
      notes: f.notes,
      sender: f.anon ? 'Anonymous' : f.sender,
      msg: f.msg,
      items,
      subtotal,
      total: subtotal + cityObj.rate,
      perishable: hasPerishable
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(36,21,68,0.45)',
      backdropFilter: 'blur(3px)',
      animation: 'kapri-up .3s var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "kapri-modal",
    style: {
      width: '100%',
      maxWidth: 540,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-xl)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '14px 16px',
      background: 'var(--purple-700)',
      color: '#fff'
    }
  }, step > 0 ? /*#__PURE__*/React.createElement("button", {
    onClick: () => setStep(step - 1),
    style: {
      background: 'none',
      border: 'none',
      color: '#fff',
      cursor: 'pointer',
      padding: 2
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "chevron-left",
    size: 22
  })) : /*#__PURE__*/React.createElement(Ico, {
    name: "bag",
    size: 20,
    color: "var(--yellow-400)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontWeight: 700,
      fontSize: 16
    }
  }, "Checkout"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '1px 0 0',
      fontSize: 11.5,
      color: 'rgba(255,255,255,0.65)'
    }
  }, "Step ", step + 1, " of 4 \xB7 ", steps[step])), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'none',
      border: 'none',
      color: '#fff',
      cursor: 'pointer',
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "x",
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      padding: '10px 16px',
      background: '#fff',
      borderBottom: '1px solid var(--line)'
    }
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s,
    style: {
      flex: 1,
      height: 4,
      borderRadius: 999,
      background: i <= step ? 'var(--purple-700)' : 'var(--line)',
      transition: 'background .3s'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "scrollbar-hide",
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, step === 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Field, {
    label: "Recipient name",
    icon: "user"
  }, /*#__PURE__*/React.createElement("input", {
    value: f.name,
    onChange: e => set('name', e.target.value),
    placeholder: "Who is this for?",
    style: inp
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Recipient phone",
    icon: "phone"
  }, /*#__PURE__*/React.createElement("input", {
    value: f.phone,
    onChange: e => set('phone', e.target.value),
    placeholder: "07X XXX XXXX",
    inputMode: "tel",
    style: inp
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      color: 'var(--muted)',
      lineHeight: 1.5
    }
  }, "We'll only use this to coordinate delivery \u2014 Sri Lankan numbers (07X\u2026 or +947X\u2026).")), step === 1 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "pin",
    size: 14,
    color: "var(--purple-700)"
  }), " Delivery city"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      ...inp,
      padding: '0 12px'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "search",
    size: 15,
    color: "var(--muted)"
  }), /*#__PURE__*/React.createElement("input", {
    value: cityQuery || f.city,
    onChange: e => setCityQuery(e.target.value),
    placeholder: "Search a Sri Lankan city\u2026",
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      padding: '11px 0',
      fontSize: 14,
      background: 'transparent',
      fontFamily: 'var(--font-sans)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: 'var(--purple-700)',
      whiteSpace: 'nowrap'
    }
  }, LKR(cityObj.rate))), cityMatches.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      marginTop: 4,
      background: '#fff',
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      zIndex: 5,
      overflow: 'hidden'
    }
  }, cityMatches.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.name,
    onClick: () => {
      set('city', c.name);
      set('date', '');
      setCityQuery('');
    },
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 13px',
      border: 'none',
      borderBottom: '1px solid var(--line)',
      background: '#fff',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 13.5,
      color: 'var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "pin",
    size: 13,
    color: "var(--purple-400)"
  }), " ", c.name, c.slow ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--warn)'
    }
  }, " \xB7 2-day lead") : ''), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--muted)'
    }
  }, LKR(c.rate)))))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      fontSize: 11,
      color: 'var(--muted)'
    }
  }, "We deliver to ", CITIES.length, "+ cities island-wide \u2014 type to find yours.")), /*#__PURE__*/React.createElement(Field, {
    label: "Delivery address",
    icon: "bag"
  }, /*#__PURE__*/React.createElement("textarea", {
    value: f.address,
    onChange: e => set('address', e.target.value),
    rows: 2,
    placeholder: "House / building no, street, area",
    className: "sinhala-text",
    style: {
      ...inp,
      resize: 'none'
    }
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Delivery notes (optional)",
    icon: "edit"
  }, /*#__PURE__*/React.createElement("input", {
    value: f.notes,
    onChange: e => set('notes', e.target.value),
    placeholder: "Landmark, gate code, best time\u2026",
    className: "sinhala-text",
    style: inp
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "calendar",
    size: 14,
    color: "var(--purple-700)"
  }), " Delivery date"), /*#__PURE__*/React.createElement("div", {
    className: "scrollbar-hide",
    style: {
      display: 'flex',
      gap: 8,
      overflowX: 'auto',
      paddingBottom: 4
    }
  }, dates.map(d => /*#__PURE__*/React.createElement("button", {
    key: d.iso,
    disabled: d.disabled,
    onClick: () => set('date', d.iso),
    style: {
      flexShrink: 0,
      width: 56,
      padding: '9px 0',
      borderRadius: 'var(--radius-md)',
      border: `1.5px solid ${f.date === d.iso ? 'var(--purple-700)' : 'var(--line)'}`,
      cursor: d.disabled ? 'not-allowed' : 'pointer',
      opacity: d.disabled ? 0.35 : 1,
      background: f.date === d.iso ? 'var(--purple-700)' : '#fff',
      color: f.date === d.iso ? '#fff' : 'var(--ink)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 1,
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      opacity: .7
    }
  }, d.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 17,
      fontWeight: 700
    }
  }, d.day), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9.5,
      opacity: .7
    }
  }, d.mon)))), cityObj.slow && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 11.5,
      color: 'var(--warn)',
      display: 'flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "warn",
    size: 13,
    color: "var(--warn)"
  }), " ", f.city, " needs a 2-day lead time \u2014 earliest dates are disabled.")), f.date && avail && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "truck",
    size: 14,
    color: "var(--purple-700)"
  }), " Availability & rate"), /*#__PURE__*/React.createElement(DeliveryStatus, {
    city: f.city,
    date: `${dates.find(d => d.iso === f.date).label} ${dates.find(d => d.iso === f.date).day} ${dates.find(d => d.iso === f.date).mon}`,
    available: avail.available,
    rate: avail.rate,
    reason: avail.reason,
    nextDate: avail.nextDate,
    perishableWarning: avail.perishableWarning
  }), !avail.available && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 11.5,
      color: 'var(--error)'
    }
  }, "Pick another date to continue."))), step === 2 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Field, {
    label: "From (sender name)",
    icon: "user"
  }, /*#__PURE__*/React.createElement("input", {
    value: f.sender,
    onChange: e => set('sender', e.target.value),
    placeholder: "Your name",
    disabled: f.anon,
    style: {
      ...inp,
      opacity: f.anon ? .5 : 1
    }
  })), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      cursor: 'pointer',
      fontSize: 13.5,
      color: 'var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: f.anon,
    onChange: e => set('anon', e.target.checked),
    style: {
      width: 17,
      height: 17,
      accentColor: 'var(--purple-700)'
    }
  }), "Send as a secret admirer \uD83E\uDD2B (anonymous)"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "gift",
    size: 14,
    color: "var(--purple-700)"
  }), " Gift message"), /*#__PURE__*/React.createElement(GiftMessageEditor, {
    value: f.msg,
    lang: lang,
    onChange: v => set('msg', v)
  }))), step === 3 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.p.id,
    style: {
      display: 'flex',
      gap: 11,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: it.p.img,
    alt: it.p.name,
    style: {
      width: 46,
      height: 46,
      borderRadius: 'var(--radius-md)',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--ink)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, it.p.name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 12,
      color: 'var(--muted)'
    }
  }, "Qty ", it.qty, it.icing ? ` · ✍️ "${it.icing}"` : '')), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--ink)'
    }
  }, LKR(it.p.price * it.qty)))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--line)',
      paddingTop: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(Summary, {
    l: "Items",
    v: LKR(subtotal)
  }), /*#__PURE__*/React.createElement(Summary, {
    l: `Delivery to ${f.city} (flat)`,
    v: LKR(cityObj.rate)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: 7,
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: 'var(--ink)'
    }
  }, "Total"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 19,
      color: 'var(--purple-700)'
    }
  }, LKR(subtotal + cityObj.rate)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '11px 13px',
      background: '#fff',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--line)',
      fontSize: 12.5,
      color: 'var(--muted)',
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--ink)'
    }
  }, "To:"), " ", f.name || '—', " \xB7 ", f.phone), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--ink)'
    }
  }, "Address:"), " ", f.address || '—', ", ", f.city), f.notes && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--ink)'
    }
  }, "Notes:"), " ", f.notes), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--ink)'
    }
  }, "Date:"), " ", dates.find(d => d.iso === f.date)?.label, " ", dates.find(d => d.iso === f.date)?.day, " ", dates.find(d => d.iso === f.date)?.mon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--ink)'
    }
  }, "From:"), " ", f.anon ? 'Anonymous 🤫' : f.sender || '—'), f.msg && /*#__PURE__*/React.createElement("div", {
    className: "sinhala-text",
    style: {
      marginTop: 4,
      fontStyle: 'italic'
    }
  }, "\u201C", f.msg, "\u201D")))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      borderTop: '1px solid var(--line)',
      background: '#fff'
    }
  }, step < 3 ? /*#__PURE__*/React.createElement("button", {
    onClick: () => canNext && setStep(step + 1),
    disabled: !canNext,
    style: {
      width: '100%',
      padding: '13px',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      background: 'var(--purple-700)',
      color: '#fff',
      fontWeight: 600,
      fontSize: 15,
      cursor: canNext ? 'pointer' : 'not-allowed',
      opacity: canNext ? 1 : .45,
      fontFamily: 'var(--font-sans)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7
    }
  }, "Continue ", /*#__PURE__*/React.createElement(Ico, {
    name: "arrow-right",
    size: 16
  })) : /*#__PURE__*/React.createElement("button", {
    onClick: place,
    style: {
      width: '100%',
      padding: '14px',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      background: 'var(--yellow-400)',
      color: 'var(--purple-700)',
      fontWeight: 700,
      fontSize: 16,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "check-circle",
    size: 18
  }), " Place order \u2014 ", LKR(subtotal + cityObj.rate)))));
}
const inp = {
  width: '100%',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--line)',
  padding: '11px 13px',
  fontSize: 14,
  color: 'var(--ink)',
  background: '#fff',
  outline: 'none',
  fontFamily: 'var(--font-sans)',
  boxSizing: 'border-box'
};
const lbl = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--ink)',
  marginBottom: 8
};
function Field({
  label,
  icon,
  children
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, /*#__PURE__*/React.createElement(Ico, {
    name: icon,
    size: 14,
    color: "var(--purple-700)"
  }), " ", label), children);
}
function Summary({
  l,
  v
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 13.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--muted)'
    }
  }, l), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: 'var(--ink)'
    }
  }, v));
}

// ---- Checkout Card (pay link + countdown) ----
function CheckoutCard({
  order,
  onPay,
  paid
}) {
  const [secs, setSecs] = React.useState(3600);
  React.useEffect(() => {
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(secs / 60)).padStart(2, '0'),
    ss = String(secs % 60).padStart(2, '0');
  const warn = secs < 300;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 360,
      background: '#fff',
      borderRadius: 'var(--radius-lg)',
      border: '2px solid var(--purple-700)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--purple-700)',
      padding: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 999,
      background: 'var(--yellow-400)',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'kapri-pop .4s var(--ease-spring)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "check-circle",
    size: 24,
    color: "var(--purple-700)"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: '#fff',
      fontWeight: 700,
      fontSize: 16
    }
  }, "Order Ready! \uD83C\uDF89"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      color: 'rgba(249,219,9,0.85)',
      fontSize: 12,
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "package",
    size: 12
  }), " Ref: ", order.ref))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px 0'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      color: 'var(--muted)',
      background: 'var(--surface)',
      borderRadius: 'var(--radius-md)',
      padding: '8px 12px',
      lineHeight: 1.5
    }
  }, "\uD83D\uDCA1 Your tracking number (VIMP\u2026) arrives by email after payment \u2014 ", order.ref, " is just your order reference.")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      borderTop: '1px solid var(--line)',
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Summary, {
    l: "Items",
    v: LKR(order.subtotal)
  }), /*#__PURE__*/React.createElement(Summary, {
    l: "Delivery (flat per order)",
    v: LKR(order.rate)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 8,
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: 'var(--ink)'
    }
  }, "Total"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 20,
      color: 'var(--purple-700)'
    }
  }, LKR(order.total)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 16px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, paid ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: 14,
      borderRadius: 'var(--radius-md)',
      background: 'var(--success-tint)',
      color: 'var(--success)',
      fontWeight: 700,
      fontSize: 15,
      border: '1px solid var(--success)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "check-circle",
    size: 18,
    color: "var(--success)"
  }), " Payment received \u2014 thank you! \uD83C\uDF89") : /*#__PURE__*/React.createElement("button", {
    onClick: () => onPay && onPay(order),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: 14,
      borderRadius: 'var(--radius-md)',
      background: 'var(--yellow-400)',
      color: 'var(--purple-700)',
      fontWeight: 700,
      fontSize: 16,
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)'
    }
  }, "Pay Now on Kapruka ", /*#__PURE__*/React.createElement(Ico, {
    name: "arrow-right",
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      fontSize: 12,
      color: paid ? 'var(--success)' : warn ? 'var(--warn)' : 'var(--muted)',
      fontWeight: warn || paid ? 600 : 400
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: paid ? 'check' : 'clock',
    size: 12
  }), " ", paid ? 'Paid · tracking enabled' : `Price locked · ${mm}:${ss}`)));
}

// ---- Mock payment sheet (demo). In production the CheckoutCard's pay button
//      opens the real Kapruka `checkout_url` returned by kapruka_create_order. ----
function PaymentSheet({
  order,
  onClose,
  onPaid
}) {
  const [method, setMethod] = React.useState('card'); // card | account
  const [num, setNum] = React.useState('');
  const [name, setName] = React.useState('');
  const [exp, setExp] = React.useState('');
  const [cvv, setCvv] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [phase, setPhase] = React.useState('form'); // form | processing | done
  const fmtNum = v => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const fmtExp = v => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
  };
  const validCard = num.replace(/\s/g, '').length >= 15 && name.trim() && exp.length === 5 && cvv.length >= 3;
  const validAccount = (/\S+@\S+\.\S+/.test(email) || /\d{9,}/.test(email)) && pw.length >= 4;
  const valid = method === 'card' ? validCard : validAccount;
  const pay = () => {
    if (!valid) return;
    setPhase('processing');
    setTimeout(() => {
      setPhase('done');
      setTimeout(() => onPaid(order), 1300);
    }, method === 'account' ? 1400 : 1700);
  };
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 70,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(36,21,68,0.5)',
      backdropFilter: 'blur(3px)',
      animation: 'kapri-up .3s var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    className: "kapri-modal",
    style: {
      width: '100%',
      maxWidth: 440,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-xl)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px',
      background: 'var(--purple-700)',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../assets/kapruka-logo.jpg",
    alt: "Kapruka",
    style: {
      height: 22,
      borderRadius: 4
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600
    }
  }, "Secure Checkout")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'none',
      border: 'none',
      color: '#fff',
      cursor: 'pointer',
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "x",
    size: 20
  }))), phase === 'done' ? /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      padding: 24,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 72,
      height: 72,
      borderRadius: 999,
      background: 'var(--success)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'kapri-pop .4s var(--ease-spring)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "check",
    size: 38,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 21,
      fontWeight: 700,
      color: 'var(--ink)'
    }
  }, "Payment successful! \uD83C\uDF89"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 13.5,
      color: 'var(--muted)',
      lineHeight: 1.5
    }
  }, "Rs. ", Number(order.total).toLocaleString('en-LK'), " paid. Your order is confirmed \u2014 a VIMP tracking number is on its way to your inbox."))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "scrollbar-hide",
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--purple-700)',
      borderRadius: 'var(--radius-lg)',
      padding: '14px 16px',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      color: 'rgba(255,255,255,0.7)'
    }
  }, "Amount to pay \xB7 ", order.ref), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '3px 0 0',
      fontSize: 26,
      fontWeight: 700
    }
  }, "Rs. ", Number(order.total).toLocaleString('en-LK'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      background: 'var(--purple-100)',
      padding: 4,
      borderRadius: 'var(--radius-md)'
    }
  }, [['card', 'cart', 'Pay by card'], ['account', 'user', 'Kapruka account']].map(([m, ic, label]) => /*#__PURE__*/React.createElement("button", {
    key: m,
    onClick: () => setMethod(m),
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      padding: '9px 6px',
      borderRadius: 'var(--radius-sm)',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 600,
      background: method === m ? '#fff' : 'transparent',
      color: method === m ? 'var(--purple-700)' : 'var(--purple-500)',
      boxShadow: method === m ? 'var(--shadow-sm)' : 'none',
      transition: 'all .15s'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: ic,
    size: 15,
    color: method === m ? 'var(--purple-700)' : 'var(--purple-500)'
  }), " ", label))), method === 'card' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'linear-gradient(120deg, var(--purple-600), var(--purple-800))',
      borderRadius: 'var(--radius-lg)',
      padding: 16,
      color: '#fff',
      minHeight: 92,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 24,
      borderRadius: 4,
      background: 'var(--yellow-400)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      opacity: .8,
      fontWeight: 600,
      letterSpacing: '.1em'
    }
  }, "VISA")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 16,
      letterSpacing: '.12em'
    }
  }, num || '•••• •••• •••• ••••'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 11,
      opacity: .85
    }
  }, /*#__PURE__*/React.createElement("span", null, name.toUpperCase() || 'CARDHOLDER NAME'), /*#__PURE__*/React.createElement("span", null, exp || 'MM/YY'))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "cart",
    size: 13,
    color: "var(--purple-700)"
  }), " Card number"), /*#__PURE__*/React.createElement("input", {
    value: num,
    onChange: e => setNum(fmtNum(e.target.value)),
    inputMode: "numeric",
    placeholder: "4242 4242 4242 4242",
    style: inp
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "user",
    size: 13,
    color: "var(--purple-700)"
  }), " Name on card"), /*#__PURE__*/React.createElement("input", {
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "As printed on card",
    style: inp
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Expiry"), /*#__PURE__*/React.createElement("input", {
    value: exp,
    onChange: e => setExp(fmtExp(e.target.value)),
    inputMode: "numeric",
    placeholder: "MM/YY",
    style: inp
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "CVV"), /*#__PURE__*/React.createElement("input", {
    value: cvv,
    onChange: e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4)),
    inputMode: "numeric",
    placeholder: "\u2022\u2022\u2022",
    style: inp
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 11,
      color: 'var(--muted)',
      display: 'flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "check-circle",
    size: 13,
    color: "var(--success)"
  }), " Demo only \u2014 no real card is charged. Use any test numbers.")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: '12px 14px',
      background: 'var(--purple-50)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--purple-100)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 38,
      height: 38,
      borderRadius: 999,
      background: 'var(--purple-700)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "user",
    size: 18,
    color: "var(--yellow-400)"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13.5,
      fontWeight: 700,
      color: 'var(--ink)'
    }
  }, "Sign in to Kapruka"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 11.5,
      color: 'var(--muted)'
    }
  }, "Your saved cards, addresses & loyalty points apply automatically."))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "user",
    size: 13,
    color: "var(--purple-700)"
  }), " Email or mobile"), /*#__PURE__*/React.createElement("input", {
    value: email,
    onChange: e => setEmail(e.target.value),
    placeholder: "you@email.com or 07X XXX XXXX",
    style: inp
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "check-circle",
    size: 13,
    color: "var(--purple-700)"
  }), " Password"), /*#__PURE__*/React.createElement("input", {
    value: pw,
    onChange: e => setPw(e.target.value),
    type: "password",
    placeholder: "Your Kapruka password",
    style: inp
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: 'var(--purple-700)',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "Forgot password?"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: 'var(--muted)'
    }
  }, "New here? Create account")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 11,
      color: 'var(--muted)',
      display: 'flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "check-circle",
    size: 13,
    color: "var(--success)"
  }), " Demo only \u2014 no real login. Enter any email & password."))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      borderTop: '1px solid var(--line)',
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: pay,
    disabled: !valid || phase === 'processing',
    style: {
      width: '100%',
      padding: 14,
      borderRadius: 'var(--radius-md)',
      border: 'none',
      background: 'var(--yellow-400)',
      color: 'var(--purple-700)',
      fontWeight: 700,
      fontSize: 16,
      cursor: valid ? 'pointer' : 'not-allowed',
      opacity: valid ? 1 : .5,
      fontFamily: 'var(--font-sans)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8
    }
  }, phase === 'processing' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      border: '2px solid rgba(68,42,115,.3)',
      borderTopColor: 'var(--purple-700)',
      borderRadius: 999,
      animation: 'kapri-spin .7s linear infinite'
    }
  }), " ", method === 'account' ? 'Signing in…' : 'Processing…') : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Ico, {
    name: "check-circle",
    size: 17
  }), " ", method === 'account' ? 'Sign in & Pay' : 'Pay', " Rs. ", Number(order.total).toLocaleString('en-LK'))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '9px 0 0',
      fontSize: 11,
      color: 'var(--muted)',
      textAlign: 'center'
    }
  }, "\uD83D\uDD12 Secured by Kapruka Payments")))));
}
window.KapriCheckout = {
  CartDrawer,
  CheckoutFlow,
  CheckoutCard,
  GiftMessageEditor,
  PaymentSheet
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "kapri-app/checkout.jsx", error: String((e && e.message) || e) }); }

// kapri-app/data.jsx
try { (() => {
/* Kapri demo — catalog, cities, bundles. Image-backed fake data. */

const IMG = id => `https://images.unsplash.com/${id}?w=500&h=500&fit=crop`;
const LKR = n => `Rs. ${Number(n).toLocaleString('en-LK')}`;
const CATALOG = [
// ---- Cakes (perishable, made-to-order: never "low stock") ----
{
  id: 'CAKE-2291',
  name: 'Belgian Chocolate Fudge Cake — 1kg',
  summary: 'Rich layered ganache, made fresh to order.',
  price: 4500,
  was: 5200,
  cat: 'Cakes',
  img: IMG('photo-1578985545062-69928b1d9587'),
  perishable: true,
  occ: ['birthday', 'anniversary', 'mother']
}, {
  id: 'CAKE-1180',
  name: 'Ribbon Butter Cake — 1kg',
  summary: 'A Sri Lankan classic — soft, buttery, nostalgic.',
  price: 3200,
  cat: 'Cakes',
  img: IMG('photo-1565958011703-44f9829ba187'),
  perishable: true,
  occ: ['birthday', 'mother']
}, {
  id: 'CAKE-3340',
  name: 'Fresh Strawberry Gateau — 1kg',
  summary: 'Whipped cream & seasonal strawberries.',
  price: 5400,
  cat: 'Cakes',
  img: IMG('photo-1464349095431-e9a21285b5f3'),
  perishable: true,
  occ: ['birthday', 'anniversary']
}, {
  id: 'CAKE-7782',
  name: 'Red Velvet Cream Cheese Cake',
  summary: 'Velvety crumb, tangy cream-cheese frosting.',
  price: 4900,
  cat: 'Cakes',
  img: IMG('photo-1586985289688-ca3cf47d3e6e'),
  perishable: true,
  occ: ['anniversary', 'valentine']
}, {
  id: 'CAKE-5521',
  name: 'Chocolate Drip Birthday Cake',
  summary: 'Tall, dramatic, candle-ready.',
  price: 6200,
  was: 6900,
  cat: 'Cakes',
  img: IMG('photo-1535141192574-5d4897c12636'),
  perishable: true,
  occ: ['birthday']
},
// ---- Flowers (perishable) ----
{
  id: 'FLOWERS-118',
  name: 'Red Rose Bouquet — Dozen',
  summary: 'A dozen long-stem roses, hand-tied.',
  price: 6900,
  cat: 'Flowers',
  img: IMG('photo-1518895949257-7621c3c786d7'),
  perishable: true,
  occ: ['anniversary', 'valentine', 'mother']
}, {
  id: 'FLOWERS-204',
  name: 'Mixed Gerbera Basket',
  summary: 'Bright daisies arranged in a woven basket.',
  price: 5200,
  cat: 'Flowers',
  img: IMG('photo-1490750967868-88aa4486c946'),
  perishable: true,
  occ: ['mother', 'birthday']
}, {
  id: 'FLOWERS-330',
  name: 'White Lily Arrangement',
  summary: 'Elegant, fragrant lilies for any occasion.',
  price: 6100,
  cat: 'Flowers',
  img: IMG('photo-1561181286-d3fee7d55364'),
  perishable: true,
  occ: ['anniversary', 'sympathy']
}, {
  id: 'FLOWERS-410',
  name: 'Sunflower & Rose Bunch',
  summary: 'A burst of sunshine, hand-wrapped.',
  price: 4800,
  cat: 'Flowers',
  img: IMG('photo-1597848212624-a19eb35e2651'),
  perishable: true,
  occ: ['birthday', 'mother']
},
// ---- Chocolates ----
{
  id: 'CHOC-540',
  name: 'Lindt Lindor Assorted Box',
  summary: 'Smooth-melting Swiss truffles.',
  price: 3200,
  was: 3800,
  cat: 'Chocolates',
  img: IMG('photo-1549007994-cb92caebd54b'),
  occ: ['birthday', 'valentine', 'anniversary']
}, {
  id: 'CHOC-612',
  name: 'Ferrero Rocher T24',
  summary: 'Golden hazelnut classics, 24-piece.',
  price: 4100,
  cat: 'Chocolates',
  img: IMG('photo-1481391319762-47dff72954d9'),
  occ: ['anniversary', 'valentine']
}, {
  id: 'CHOC-330',
  name: 'Kapruka Dark Truffle Selection',
  summary: '70% Ceylon dark — locally crafted.',
  price: 2900,
  cat: 'Chocolates',
  img: IMG('photo-1606312619070-d48b4c652a52'),
  occ: ['birthday', 'mother']
},
// ---- Hampers / Gift sets ----
{
  id: 'GIFT-2201',
  name: 'Pamper Hamper for Mum',
  summary: 'Chocolates, tea & a scented candle.',
  price: 4800,
  cat: 'Hampers',
  img: IMG('photo-1513885535751-8b9238bd345a'),
  occ: ['mother', 'birthday']
}, {
  id: 'GIFT-3090',
  name: 'Avurudu Sweetmeats Hamper',
  summary: 'Kokis, kavum, aluwa — the full New Year spread.',
  price: 5600,
  was: 6400,
  cat: 'Hampers',
  img: IMG('photo-1601493700631-2b16ec4b4716'),
  occ: ['avurudu']
}, {
  id: 'GIFT-4412',
  name: 'Gourmet Coffee & Cookies Box',
  summary: 'Roasted beans, biscotti & a ceramic mug.',
  price: 5200,
  cat: 'Hampers',
  img: IMG('photo-1559056199-641a0ac8b55e'),
  occ: ['father', 'birthday']
},
// ---- Perfumes ----
{
  id: 'PERF-091',
  name: 'Floral Eau de Parfum — 50ml',
  summary: 'Jasmine & sandalwood notes.',
  price: 7900,
  cat: 'Perfumes',
  img: IMG('photo-1541643600914-78b084683601'),
  low: true,
  occ: ['anniversary', 'mother', 'valentine']
}, {
  id: 'PERF-150',
  name: 'Mens Wood & Spice EDT — 100ml',
  summary: 'Warm cedar, bergamot, a hint of pepper.',
  price: 8400,
  cat: 'Perfumes',
  img: IMG('photo-1594035910387-fea47794261f'),
  occ: ['father', 'anniversary']
},
// ---- Jewellery ----
{
  id: 'JEWEL-070',
  name: 'Rose-Gold Heart Pendant',
  summary: '18k-plated, with a delicate chain.',
  price: 9200,
  was: 11000,
  cat: 'Jewellery',
  img: IMG('photo-1599643478518-a784e5dc4c8f'),
  occ: ['anniversary', 'valentine']
}, {
  id: 'JEWEL-122',
  name: 'Pearl Drop Earrings',
  summary: 'Freshwater pearls, classic elegance.',
  price: 6800,
  cat: 'Jewellery',
  img: IMG('photo-1535632066927-ab7c9ab60908'),
  low: true,
  occ: ['mother', 'anniversary']
},
// ---- Electronics ----
{
  id: 'ELEC-330',
  name: 'True-Wireless Earbuds Pro',
  summary: 'ANC, 30-hr case, USB-C.',
  price: 12900,
  was: 15900,
  cat: 'Electronics',
  img: IMG('photo-1572569511254-d8f925fe2cbb'),
  occ: ['father', 'birthday', 'graduation']
}, {
  id: 'ELEC-410',
  name: 'Smart Fitness Band',
  summary: 'Heart-rate, sleep & step tracking.',
  price: 7400,
  cat: 'Electronics',
  img: IMG('photo-1575311373937-040b8e1fd5b6'),
  occ: ['father', 'graduation']
},
// ---- Soft toys ----
{
  id: 'TOY-205',
  name: 'Giant Teddy Bear — 80cm',
  summary: 'Super-soft, huggable, gift-ready.',
  price: 5900,
  cat: 'Soft Toys',
  img: IMG('photo-1559454403-b8fb88521f11'),
  occ: ['birthday', 'valentine']
}];
const CATEGORIES = [{
  name: 'Cakes',
  emoji: '🎂',
  q: 'cakes'
}, {
  name: 'Flowers',
  emoji: '🌹',
  q: 'flowers'
}, {
  name: 'Chocolates',
  emoji: '🍫',
  q: 'chocolates'
}, {
  name: 'Hampers',
  emoji: '🧺',
  q: 'hampers'
}, {
  name: 'Perfumes',
  emoji: '🌸',
  q: 'perfumes'
}, {
  name: 'Jewellery',
  emoji: '💍',
  q: 'jewellery'
}, {
  name: 'Electronics',
  emoji: '📱',
  q: 'electronics'
}, {
  name: 'Soft Toys',
  emoji: '🧸',
  q: 'soft toys'
}];
const OCCASIONS = [{
  name: 'Birthday',
  emoji: '🎉',
  q: 'birthday'
}, {
  name: 'Anniversary',
  emoji: '💞',
  q: 'anniversary'
}, {
  name: 'For Mom',
  emoji: '👩',
  q: 'mother'
}, {
  name: 'For Dad',
  emoji: '👨',
  q: 'father'
}, {
  name: 'Avurudu',
  emoji: '🇱🇰',
  q: 'avurudu'
}, {
  name: 'Valentine',
  emoji: '❤️',
  q: 'valentine'
}];

// Sri Lankan delivery cities (subset). Some flagged no-same-day for realism.
const CITIES = [{
  name: 'Colombo',
  rate: 350
}, {
  name: 'Dehiwala',
  rate: 350
}, {
  name: 'Mount Lavinia',
  rate: 400
}, {
  name: 'Nugegoda',
  rate: 350
}, {
  name: 'Kandy',
  rate: 550
}, {
  name: 'Galle',
  rate: 600
}, {
  name: 'Negombo',
  rate: 450
}, {
  name: 'Kurunegala',
  rate: 600
}, {
  name: 'Matara',
  rate: 700
}, {
  name: 'Jaffna',
  rate: 850,
  slow: true
}, {
  name: 'Batticaloa',
  rate: 850,
  slow: true
}, {
  name: 'Anuradhapura',
  rate: 700
}, {
  name: 'Ratnapura',
  rate: 650
}, {
  name: 'Badulla',
  rate: 750
}];

// Curated bundles for the gift-bundle builder
const BUNDLES = {
  avurudu: {
    title: 'Avurudu Celebration Hamper 🇱🇰',
    blurb: "Suba Aluth Avuruddak! Here's a hamper that brings the whole New Year table together — sweetmeats to share, blooms for the home, and a little something sweet.",
    ids: ['GIFT-3090', 'FLOWERS-204', 'CHOC-330'],
    message: 'Suba Aluth Avuruddak! Wishing you and the family health, happiness and a table full of kavum. 🇱🇰'
  },
  mother: {
    title: 'Pamper-Mum Bundle 💐',
    blurb: "For the woman who does everything — flowers she'll display proudly, a cake to share, and a scent that's all hers.",
    ids: ['FLOWERS-118', 'CAKE-1180', 'PERF-091'],
    message: 'Amma, thank you for everything. You deserve the world today and every day. 💜'
  },
  birthday: {
    title: 'Birthday Surprise Bundle 🎉',
    blurb: "Everything for a birthday they won't forget — a show-stopper cake, a cuddly friend, and chocolates for the table.",
    ids: ['CAKE-5521', 'TOY-205', 'CHOC-540'],
    message: 'Happy Birthday! Hope your day is as wonderful as you are. 🎂🎉'
  }
};

/* ============================================================
   DROP-IN REAL CATALOG
   Paste raw `kapruka_search_products` result items below — in their
   native MCP shape (id, name, summary, price{amount,currency},
   compare_at_price, in_stock, stock_level, image_url, category{name},
   url, …). If MCP_PRODUCTS has items, it REPLACES the sample catalog.
   No other code needs to change — fromMCP() adapts the fields.
   ============================================================ */
const MCP_PRODUCTS = [
  // e.g. paste search_products `results` arrays here:
  // { "id": "CAKE-1001", "name": "…", "summary": "…",
  //   "price": { "amount": 4500, "currency": "LKR" },
  //   "compare_at_price": { "amount": 5200, "currency": "LKR" },
  //   "in_stock": true, "stock_level": "high",
  //   "image_url": "https://www.kapruka.com/…​.jpg",
  //   "category": { "name": "Cakes" },
  //   "url": "https://www.kapruka.com/p/…" },
];
const PERISHABLE_RE = /^(cake|flower|combo)/i;
function fromMCP(it) {
  return {
    id: it.id,
    name: it.name,
    summary: it.summary || it.description || '',
    price: it.price && it.price.amount != null ? it.price.amount : it.price,
    was: it.compare_at_price && it.compare_at_price.amount != null ? it.compare_at_price.amount : it.was,
    cat: it.category && it.category.name || it.category || it.cat || 'Gifts',
    img: it.image_url || it.images && it.images[0] || it.img,
    low: it.stock_level === 'low',
    inStock: it.in_stock !== false,
    perishable: PERISHABLE_RE.test(it.id || ''),
    url: it.url,
    occ: it.occ || []
  };
}

// Live catalog = real MCP data when present, else the curated sample set.
const LIVE_CATALOG = MCP_PRODUCTS.length ? MCP_PRODUCTS.map(fromMCP) : CATALOG;

// ---- Seasonal awareness — banner + prompt adapt to the Sri Lankan calendar ----
function currentSeason() {
  const m = new Date().getMonth(); // 0 = Jan
  const S = {
    3: {
      key: 'avurudu',
      emoji: '🇱🇰',
      greeting: 'Suba Aluth Avuruddak!',
      sub: 'Avurudu hampers, sweets & kiribath gifts — island-wide',
      cta: 'Avurudu hampers',
      q: 'Avurudu hamper bundle'
    },
    4: {
      key: 'wesak',
      emoji: '🪔',
      greeting: 'Happy Wesak!',
      sub: 'Brighten the season with a thoughtful gift',
      cta: 'Wesak gifts',
      q: 'gifts'
    },
    5: {
      key: 'poson',
      emoji: '🌕',
      greeting: 'Happy Poson!',
      sub: 'Share the Poson spirit — flowers, sweets & more',
      cta: 'Poson gifts',
      q: 'flowers'
    },
    9: {
      key: 'deepavali',
      emoji: '🪔',
      greeting: 'Happy Deepavali!',
      sub: 'Sweets, lights & gifts for the festival of lights',
      cta: 'Deepavali gifts',
      q: 'chocolates'
    },
    11: {
      key: 'christmas',
      emoji: '🎄',
      greeting: "Season's Greetings!",
      sub: 'Christmas cakes, hampers & gifts to spread cheer',
      cta: 'Christmas gifts',
      q: 'hampers'
    },
    1: {
      key: 'valentine',
      emoji: '❤️',
      greeting: "Happy Valentine's!",
      sub: 'Say it with flowers, chocolates & a sweet note',
      cta: 'Valentine gifts',
      q: 'valentine'
    }
  };
  return S[m] || {
    key: 'evergreen',
    emoji: '🎁',
    greeting: 'Gifting made joyful',
    sub: 'Find the perfect gift for any occasion',
    cta: 'Popular gifts',
    q: 'gifts'
  };
}
const SEASON = currentSeason();
window.KapriData = {
  CATALOG: LIVE_CATALOG,
  CATEGORIES,
  OCCASIONS,
  CITIES,
  BUNDLES,
  SEASON,
  IMG,
  LKR,
  fromMCP
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "kapri-app/data.jsx", error: String((e && e.message) || e) }); }

// kapri-app/engine.jsx
try { (() => {
/* Kapri demo — conversation engine: language detect + intents + multilingual replies. */
const {
  CATALOG,
  BUNDLES,
  CITIES
} = window.KapriData;
const TANGLISH_HINTS = ['mata', 'ekak', 'ekata', 'gannako', 'ganna', 'amma', 'ammata', 'thaaththa', 'hadanna', 'oyaa', 'mama', 'tikak', 'hoyanna', 'hoya', 'neda', 'denna', 'puluwan', 'kawda', 'monawada', 'mal', 'genna', 'avurudu', 'suba', 'bohoma', 'ane', 'hari', 'kohomada', 'kiyanna', 'heta', 'ada', 'salli'];
const SI_RE = /[\u0D80-\u0DFF]/;
function detectLang(text) {
  if (SI_RE.test(text)) return 'si';
  const t = ' ' + text.toLowerCase() + ' ';
  let hits = 0;
  for (const w of TANGLISH_HINTS) if (t.includes(' ' + w + ' ') || t.includes(w)) hits++;
  return hits >= 1 ? 'tl' : 'en';
}
function L(lang, m) {
  return m[lang] || m.en;
}
function parseBudget(text) {
  const t = text.replace(/,/g, '');
  let m = t.match(/(?:under|below|less than|max|budget|යට|ට\s*අඩු|wadi nathi|under)\D*(\d{3,6})/i);
  if (m) return parseInt(m[1], 10);
  m = t.match(/(\d{4,6})\s*(?:ට|ta|wලට|rupees|rs)/i);
  if (m) return parseInt(m[1], 10);
  m = t.match(/rs\.?\s*(\d{3,6})/i);
  if (m && /under|below|less|යට|wadi nathi|budget/i.test(t)) return parseInt(m[1], 10);
  return null;
}
const CAT_KEYS = {
  Cakes: ['cake', 'cakes', 'gateau', 'කේක්', 'cake ekak'],
  Flowers: ['flower', 'flowers', 'bouquet', 'rose', 'roses', 'මල්', 'mal', 'mala'],
  Chocolates: ['chocolate', 'chocolates', 'choc', 'truffle', 'ferrero', 'lindt', 'චොකලට්'],
  Hampers: ['hamper', 'hampers', 'gift set', 'giftset', 'basket'],
  Perfumes: ['perfume', 'perfumes', 'fragrance', 'scent', 'edt', 'edp', 'cologne'],
  Jewellery: ['jewellery', 'jewelry', 'pendant', 'earring', 'earrings', 'necklace', 'ring'],
  Electronics: ['electronic', 'electronics', 'earbud', 'earbuds', 'headphone', 'gadget', 'watch', 'band', 'tech'],
  'Soft Toys': ['soft toy', 'soft toys', 'teddy', 'toy', 'plush', 'bear']
};
const OCC_KEYS = {
  mother: ['mother', 'mom', 'mum', 'amma', 'ammata', 'amage', 'අම්ම'],
  father: ['father', 'dad', 'thaaththa', 'thatta', 'appa', 'තාත්ත'],
  birthday: ['birthday', 'bday', 'උපන්දින', 'upandina', 'janma'],
  anniversary: ['anniversary', 'wedding anniversary', 'සංවත්සර'],
  valentine: ['valentine', 'love', 'girlfriend', 'boyfriend', 'wife', 'husband', 'ආදර'],
  avurudu: ['avurudu', 'aurudu', 'new year', 'අවුරුදු', 'aluth avurudu'],
  graduation: ['graduation', 'graduate', 'convocation']
};
function findCat(t) {
  for (const [c, ks] of Object.entries(CAT_KEYS)) if (ks.some(k => t.includes(k))) return c;
  return null;
}
function findOcc(t) {
  for (const [o, ks] of Object.entries(OCC_KEYS)) if (ks.some(k => t.includes(k))) return o;
  return null;
}
function findCity(text) {
  return CITIES.find(c => new RegExp('\\b' + c.name + '\\b', 'i').test(text));
}
function search({
  cat,
  occ,
  budget
}) {
  let list = CATALOG.slice();
  if (cat) list = list.filter(p => p.cat === cat);
  if (occ) list = list.filter(p => (p.occ || []).includes(occ));
  if (budget) list = list.filter(p => p.price <= budget);
  if (list.length === 0 && occ) list = CATALOG.filter(p => (p.occ || []).includes(occ));
  if (list.length === 0) list = CATALOG.filter(p => ['Cakes', 'Flowers', 'Chocolates', 'Hampers'].includes(p.cat));
  return list.slice(0, 8);
}
function respond(text, ctx) {
  const lang = detectLang(text);
  const t = ' ' + text.toLowerCase().trim() + ' ';
  const cartCount = ctx.cartCount;

  // --- track order (Kapruka MCP: Track Kapruka Order — by VIMP number) ---
  if (/track|vimp|where.*order|order.*status|kohedha|tracking/i.test(text)) {
    const vimp = (text.match(/VIMP[A-Z0-9]+/i) || [])[0];
    if (vimp) return {
      lang,
      text: L(lang, {
        en: `Found it! 📦 Here's where ${vimp.toUpperCase()} is right now:`,
        si: `හම්බුණා! 📦 ${vimp.toUpperCase()} දැන් ඉන්නේ මෙතන:`,
        tl: `Hambuna! 📦 ${vimp.toUpperCase()} dæn inne mehe:`
      }),
      card: {
        type: 'tracker',
        number: vimp.toUpperCase()
      },
      chips: ['Shop something new', 'Talk to support']
    };
    if (ctx.lastVimp) return {
      lang,
      text: L(lang, {
        en: `Sure! Here's your most recent order. To track any other order, just paste its VIMP number. 📦`,
        si: `හරි! ඔබේ අලුත්ම ඇණවුම මෙන්න. වෙන ඇණවුමක් track කරන්න VIMP අංකය paste කරන්න. 📦`,
        tl: `Hari! Oyage aluthma order eka mehe. Wena order ekak track karanna VIMP number eka paste karanna. 📦`
      }),
      card: {
        type: 'tracker',
        number: ctx.lastVimp
      },
      chips: ['Shop something new']
    };
    return {
      lang,
      text: L(lang, {
        en: "Happy to track that! 📦 What's your order number? It starts with VIMP… (you'll find it in your confirmation email).",
        si: "ට්‍රැක් කරන්නම්! 📦 ඔබේ ඇණවුම් අංකය මොකක්ද? VIMP… වලින් පටන් ගන්නවා (ඊමේල් එකේ තියෙනවා).",
        tl: "Track karannam! 📦 Oyage order number eka mokakda? VIMP… valin patan gannawa (email eke thiyenawa)."
      }),
      chips: ['VIMP34456CB2', 'Shop something new']
    };
  }

  // --- checkout intent ---
  if (/check ?out|pay now|place.*order|buy now|proceed|order karanna|salli/i.test(text)) {
    if (cartCount === 0) return {
      lang,
      text: L(lang, {
        en: "Your cart's empty right now! 🛍️ Tell me who you're shopping for and I'll find something lovely first.",
        si: "ඔබේ කරත්තය දැන් හිස්! 🛍️ කාටද ගන්නේ කියන්න, මම මුලින්ම ලස්සන දෙයක් හොයන්නම්.",
        tl: "Oyage cart eka dæn his! 🛍️ Kaatada ganne kiyanna, mama mulinma lassana dheyak hoyannam."
      }),
      chips: ['Gifts for mom', 'Birthday cakes', 'Avurudu hamper']
    };
    return {
      lang,
      action: 'checkout',
      text: L(lang, {
        en: "Let's get this delivered! Just a few quick details… 🚚",
        si: "මේක ගෙදරටම ගේමු! පොඩි විස්තර කිහිපයක්… 🚚",
        tl: "Apita meka deliver karamu! Podi vistara tikak witharai… 🚚"
      })
    };
  }

  // --- bundle / hamper builder ---
  if (/hamper|bundle|combo|themed|package deal|curate/i.test(text) || /avurudu|aurudu|new year/i.test(text) && /hamper|bundle|gift/i.test(text)) {
    let key = 'birthday';
    if (/avurudu|aurudu|new year|අවුරුදු/i.test(text)) key = 'avurudu';else if (findOcc(t) === 'mother') key = 'mother';
    return {
      lang,
      text: L(lang, {
        en: "Ooh, I love a good hamper! 🎁 Here's a little something I curated — add it all in one tap:",
        si: "අනේ මට හැම්පර් හදන්න ආසයි! 🎁 මම හැදුව පුංචි එකතුවක් මෙන්න — එක ටැප් එකෙන් එකතු කරන්න:",
        tl: "Ane mata hamper hadanna aasai! 🎁 Mama curate-kaloth podi ekak mehe — eka tap eken okkoma add karanna:"
      }),
      card: {
        type: 'bundle',
        key
      },
      chips: ['Show me cakes', 'Add a gift message', 'Checkout']
    };
  }

  // --- delivery to a city ---
  const city = findCity(text);
  if (city && /deliver|delivery|send to|ship|ගේන්න|genna/i.test(text)) {
    return {
      lang,
      text: L(lang, {
        en: `Good news — here's the delivery picture for ${city.name}:`,
        si: `සුබ ආරංචියක් — ${city.name} සඳහා බෙදාහැරීමේ විස්තර මෙන්න:`,
        tl: `Suba aranchiyak — ${city.name} ekata delivery eka mehe:`
      }),
      card: {
        type: 'delivery',
        city: city.name,
        rate: city.rate,
        slow: city.slow
      },
      chips: ['Find a gift', 'Checkout']
    };
  }

  // --- gift message help ---
  if (/gift message|card message|what.*write|message.*card|sandeshaya|liyanna/i.test(text)) {
    return {
      lang,
      text: L(lang, {
        en: "I'd love to help you write the perfect note! ✍️ Add an item to your cart, then at checkout I'll help you craft a warm, witty, or formal message — in any language.",
        si: "හරිම ලස්සන සටහනක් ලියන්න මම උදව් කරන්නම්! ✍️ බඩුවක් කරත්තයට දාලා, චෙක්අවුට් එකේදී උණුසුම්, විනෝද හෝ විධිමත් පණිවිඩයක් හදමු.",
        tl: "Lassanama note ekak liyanna mama udaw karannam! ✍️ Baduwak cart ekata daala, checkout ekedi warm, witty nætnam formal message ekak hadamu — ඕනෑම language ekakin."
      }),
      chips: ['Gifts for mom', 'Birthday cakes', 'Checkout']
    };
  }

  // --- help / capabilities ---
  if (/^\s*(help|what can you|who are you|hi|hello|hey|ayubowan|ආයුබෝවන්|hari|start)\s*$/i.test(text) || /what.*do you do/i.test(text)) {
    return {
      lang,
      text: L(lang, {
        en: "Hi, I'm Kapri — your Kapruka shopping concierge! 🛍️ Tell me who you're shopping for and your budget, and I'll find the perfect gift, sort delivery to any city in Sri Lanka, and take you all the way to a pay link. What are we shopping for today?",
        si: "ආයුබෝවන්! මම Kapri — ඔබේ Kapruka සාප්පු සහායක! 🛍️ කාටද, කොච්චරටද කියන්න — මම හොඳම තෑග්ග හොයලා, ලංකාවේ ඕනෑම නගරයකට බෙදාහැරීම සකසලා, ගෙවීම දක්වාම ඔබව රැගෙන යන්නම්. අද මොනවද ගන්නේ?",
        tl: "Ayubowan! Mama Kapri — oyage Kapruka shopping concierge! 🛍️ Kaatada, koccharatada kiyanna — mama hondama gift eka hoyala, Lankawe ඕනෑම town ekakata delivery eka set-kara, pay link ekata kanma oyawa aran yannam. Ada monawada ganne?"
      }),
      chips: ['Gifts for mom under Rs. 5,000', 'Birthday cakes', 'Avurudu hamper']
    };
  }

  // --- search (category / occasion / budget) ---
  const cat = findCat(t),
    occ = findOcc(t),
    budget = parseBudget(text);
  if (cat || occ || budget || /gift|present|buy|find|show|need|want|තෑග|gift ekak|baduwak/i.test(text)) {
    const items = search({
      cat,
      occ,
      budget
    });
    const occLabel = {
      mother: 'your amma',
      father: 'your thaaththa',
      birthday: 'the birthday',
      anniversary: 'the anniversary',
      valentine: 'your special someone',
      avurudu: 'Avurudu',
      graduation: 'the graduate'
    }[occ];
    const bridge = L(lang, {
      en: `Here are some lovely picks${occLabel ? ' for ' + occLabel : ''}${budget ? ' under Rs. ' + budget.toLocaleString('en-LK') : ''} 🎁 — tap Add to drop one in your cart:`,
      si: `${budget ? 'රු. ' + budget.toLocaleString('en-LK') + 'ට අඩුවෙන් ' : ''}ලස්සන තේරීම් කිහිපයක් මෙන්න 🎁 — කරත්තයට දාන්න Add ඔබන්න:`,
      tl: `${budget ? 'Rs. ' + budget.toLocaleString('en-LK') + 'ට yatin ' : ''}lassana picks tikak mehe 🎁 — cart ekata danna Add eka press karanna:`
    });
    return {
      lang,
      text: bridge,
      card: {
        type: 'carousel',
        items
      },
      chips: budget ? ['Even cheaper', 'Add a gift message', 'Checkout'] : ['Under Rs. 5,000', 'Make it a hamper', 'Checkout']
    };
  }

  // --- fallback ---
  const items = search({
    cat: null,
    occ: null,
    budget: null
  });
  return {
    lang,
    text: L(lang, {
      en: "I want to get this just right! 💜 Tell me a little more — who's it for and roughly your budget? Meanwhile, here are some all-time favourites:",
      si: "මට හරියටම හොයලා දෙන්න ඕනේ! 💜 කාටද, කොච්චරටද කියන්න. මේ අතරේ, හැමෝම කැමති ටික මෙන්න:",
      tl: "Mata hariyatama hoyala denna ඕනේ! 💜 Kaatada, koccharatada kiyanna. Mesentharen, hæmotama favourite tika mehe:"
    }),
    card: {
      type: 'carousel',
      items
    },
    chips: ['Gifts for mom', 'Birthday cakes', 'Avurudu hamper']
  };
}
window.KapriEngine = {
  detectLang,
  respond
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "kapri-app/engine.jsx", error: String((e && e.message) || e) }); }

// kapri-app/genui.jsx
try { (() => {
/* Kapri demo — generative UI cards. */
const {
  Ico,
  Chip
} = window.KapriUI;
const {
  LKR
} = window.KapriData;
function Pill({
  tone,
  children
}) {
  const t = {
    purple: {
      background: 'rgba(68,42,115,0.82)',
      color: '#fff',
      backdropFilter: 'blur(4px)'
    },
    accent: {
      background: 'var(--yellow-400)',
      color: 'var(--purple-700)',
      fontWeight: 700
    },
    success: {
      background: 'rgba(31,157,87,0.92)',
      color: '#fff'
    },
    warn: {
      background: 'rgba(217,138,0,0.92)',
      color: '#fff'
    },
    ink: {
      background: 'rgba(27,18,48,0.72)',
      color: '#fff',
      backdropFilter: 'blur(4px)'
    }
  }[tone];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 10,
      fontWeight: 600,
      lineHeight: 1,
      padding: '4px 8px',
      borderRadius: 999,
      whiteSpace: 'nowrap',
      ...t
    }
  }, children);
}
function EmptyState({
  prompts,
  onPrompt,
  categories,
  onCategory,
  lang
}) {
  const feats = [['🎁', 'Find gifts'], ['🎂', 'Order cakes'], ['🌹', 'Send flowers']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100%',
      textAlign: 'center',
      gap: 20,
      padding: '12px 0 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      animation: 'kapri-breathe 3.5s ease-in-out infinite'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--purple-700)',
      borderRadius: 'var(--radius-lg)',
      padding: '14px 26px',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../assets/kapruka-logo.jpg",
    alt: "Kapruka",
    style: {
      height: 42,
      width: 'auto',
      borderRadius: 5
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '5px 13px',
      borderRadius: 999,
      background: 'var(--yellow-400)',
      color: 'var(--purple-700)',
      fontSize: 12,
      fontWeight: 700,
      boxShadow: 'var(--shadow-sm)'
    }
  }, "Kapri \u2014 AI Shopping Concierge")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "sinhala-text",
    style: {
      margin: 0,
      fontSize: 25,
      fontWeight: 700,
      color: 'var(--purple-700)'
    }
  }, "\u0D86\u0DBA\u0DD4\u0DB6\u0DDD\u0DC0\u0DB1\u0DCA! I'm Kapri \uD83D\uDC4B"), /*#__PURE__*/React.createElement("p", {
    className: "sinhala-text",
    style: {
      margin: '7px auto 0',
      maxWidth: 330,
      fontSize: 14,
      color: 'var(--muted)',
      lineHeight: 1.6
    }
  }, "Your shopping concierge for Kapruka.lk \u2014 Sri Lanka's #1 gifting platform. Chat in ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--ink)'
    }
  }, "English"), ", ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--ink)'
    }
  }, "\u0DC3\u0DD2\u0D82\u0DC4\u0DBD"), ", or ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--ink)'
    }
  }, "Tanglish"), "!")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 10,
      width: '100%',
      maxWidth: 320
    }
  }, feats.map(([e, t]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      padding: '12px 4px',
      background: '#fff',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--line)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 24
    }
  }, e), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: 'var(--muted)',
      fontWeight: 500
    }
  }, t)))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 380,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 11,
      color: 'var(--muted)',
      fontWeight: 600,
      letterSpacing: '.06em',
      textTransform: 'uppercase'
    }
  }, "Try saying\u2026"), prompts.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.text,
    onClick: () => onPrompt(p.text),
    className: "sinhala-text",
    style: {
      width: '100%',
      textAlign: 'left',
      padding: '12px 15px',
      background: '#fff',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--line)',
      fontSize: 14,
      color: 'var(--ink)',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      cursor: 'pointer',
      boxShadow: 'var(--shadow-sm)',
      transition: 'all .15s var(--ease-out)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = 'var(--purple-700)';
      e.currentTarget.style.background = 'var(--purple-50)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = 'var(--line)';
      e.currentTarget.style.background = '#fff';
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 19
    }
  }, p.emoji), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, p.text), /*#__PURE__*/React.createElement(Ico, {
    name: "sparkles",
    size: 15,
    color: "var(--purple-300)"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 380
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 8px',
      fontSize: 11,
      color: 'var(--muted)',
      fontWeight: 600,
      letterSpacing: '.06em',
      textTransform: 'uppercase'
    }
  }, "Or browse"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 7,
      justifyContent: 'center'
    }
  }, categories.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.name,
    onClick: () => onCategory(c.q),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '7px 12px',
      borderRadius: 999,
      background: '#fff',
      border: '1px solid var(--line)',
      fontSize: 13,
      color: 'var(--ink)',
      cursor: 'pointer',
      boxShadow: 'var(--shadow-sm)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15
    }
  }, c.emoji), c.name)))), /*#__PURE__*/React.createElement("button", {
    onClick: () => onPrompt('Track my order'),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      padding: '9px 16px',
      borderRadius: 999,
      background: 'var(--purple-100)',
      border: '1px solid var(--purple-200)',
      color: 'var(--purple-700)',
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "package",
    size: 15,
    color: "var(--purple-700)"
  }), " Track an order"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 11,
      color: 'var(--purple-200)'
    }
  }, "Powered by Kapruka \xD7 Anthropic Claude"));
}
function ProductCard({
  p,
  inCart,
  onAdd,
  onOpen
}) {
  const [hover, setHover] = React.useState(false);
  const [imgErr, setImgErr] = React.useState(false);
  const [added, setAdded] = React.useState(false);
  const hasDisc = p.was && p.was > p.price;
  const pct = hasDisc ? Math.round((1 - p.price / p.was) * 100) : 0;
  const lowStock = p.low && !p.perishable;
  const add = e => {
    e.stopPropagation();
    setAdded(true);
    onAdd(p);
    setTimeout(() => setAdded(false), 1600);
  };
  const open = () => onOpen && onOpen(p);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: 210,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: hover ? '0 12px 28px rgba(68,42,115,.20)' : 'var(--shadow-card)',
      transform: hover ? 'translateY(-3px)' : 'none',
      transition: 'all .25s var(--ease-out)',
      scrollSnapAlign: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: open,
    title: "View details",
    style: {
      position: 'relative',
      height: 188,
      background: 'var(--purple-50)',
      overflow: 'hidden',
      cursor: 'pointer'
    }
  }, !imgErr ? /*#__PURE__*/React.createElement("img", {
    src: p.img,
    alt: p.name,
    onError: () => setImgErr(true),
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transform: hover ? 'scale(1.05)' : 'none',
      transition: 'transform .4s var(--ease-out)'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 46
    }
  }, "\uD83C\uDF81"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 8,
      left: 8
    }
  }, /*#__PURE__*/React.createElement(Pill, {
    tone: "purple"
  }, p.cat)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 8,
      right: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 4
    }
  }, lowStock && /*#__PURE__*/React.createElement(Pill, {
    tone: "warn"
  }, "Low Stock"), hasDisc && /*#__PURE__*/React.createElement(Pill, {
    tone: "success"
  }, "-", pct, "%"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 7,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("p", {
    onClick: open,
    style: {
      margin: 0,
      fontWeight: 600,
      fontSize: 13.5,
      lineHeight: 1.35,
      color: 'var(--ink)',
      cursor: 'pointer',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, p.name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 11,
      lineHeight: 1.45,
      color: 'var(--muted)',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, p.summary), /*#__PURE__*/React.createElement("span", {
    style: {
      alignSelf: 'flex-start',
      fontFamily: 'var(--font-mono)',
      fontSize: 9.5,
      color: 'var(--muted)',
      background: 'var(--surface)',
      border: '1px solid var(--line)',
      borderRadius: 7,
      padding: '2px 6px'
    }
  }, p.id), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 15.5,
      color: 'var(--purple-700)'
    }
  }, LKR(p.price)), hasDisc && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--muted)',
      textDecoration: 'line-through'
    }
  }, LKR(p.was))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginTop: 'auto',
      paddingTop: 3
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: add,
    style: {
      flex: 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: '8px 0',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      fontSize: 12,
      fontWeight: 600,
      fontFamily: 'var(--font-sans)',
      cursor: 'pointer',
      color: '#fff',
      background: added ? 'var(--success)' : inCart ? 'var(--purple-500)' : 'var(--purple-700)',
      transition: 'background .15s'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: added ? 'check' : 'cart',
    size: 14
  }), added ? 'Added!' : inCart ? 'Add again' : 'Add to Cart'), /*#__PURE__*/React.createElement("button", {
    onClick: open,
    title: "View details",
    style: {
      width: 34,
      height: 34,
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface)',
      border: '1px solid var(--line)',
      color: 'var(--muted)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "search",
    size: 14
  })))));
}
function ProductCarousel({
  products,
  cartIds,
  onAdd,
  onOpen
}) {
  const [sort, setSort] = React.useState('rel');
  const scrollRef = React.useRef(null);
  const [edges, setEdges] = React.useState({
    left: false,
    right: false
  });
  let list = [...products];
  if (sort === 'asc') list.sort((a, b) => a.price - b.price);
  if (sort === 'desc') list.sort((a, b) => b.price - a.price);
  const pills = [['rel', 'Relevance'], ['asc', 'Price ↑'], ['desc', 'Price ↓']];
  const updateEdges = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setEdges({
      left: el.scrollLeft > 8,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 8
    });
  }, []);
  React.useEffect(() => {
    updateEdges();
    const t = setTimeout(updateEdges, 200);
    return () => clearTimeout(t);
  }, [updateEdges, sort, list.length]);
  const scrollBy = dir => {
    const el = scrollRef.current;
    if (el) el.scrollBy({
      left: dir * 234,
      behavior: 'smooth'
    });
  };
  const arrow = dir => /*#__PURE__*/React.createElement("button", {
    onClick: () => scrollBy(dir),
    "aria-label": dir < 0 ? 'Previous' : 'Next',
    style: {
      position: 'absolute',
      top: 94,
      [dir < 0 ? 'left' : 'right']: -6,
      transform: 'translateY(-50%)',
      zIndex: 4,
      width: 38,
      height: 38,
      borderRadius: 999,
      background: '#fff',
      border: '1px solid var(--line)',
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'var(--purple-700)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: dir < 0 ? 'chevron-left' : 'chevron-right',
    size: 20,
    color: "var(--purple-700)"
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 7,
      flexWrap: 'wrap'
    }
  }, pills.map(([id, l]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: () => setSort(id),
    style: {
      fontSize: 12,
      fontWeight: 600,
      padding: '4px 12px',
      borderRadius: 999,
      cursor: 'pointer',
      border: '1px solid',
      ...(sort === id ? {
        background: 'var(--purple-700)',
        color: '#fff',
        borderColor: 'var(--purple-700)'
      } : {
        background: 'var(--purple-100)',
        color: 'var(--purple-700)',
        borderColor: 'var(--purple-200)'
      })
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, edges.left && arrow(-1), edges.right && arrow(1), /*#__PURE__*/React.createElement("div", {
    ref: scrollRef,
    onScroll: updateEdges,
    className: "scrollbar-hide",
    style: {
      display: 'flex',
      gap: 12,
      overflowX: 'auto',
      paddingBottom: 6,
      scrollSnapType: 'x proximity'
    }
  }, list.map(p => /*#__PURE__*/React.createElement(ProductCard, {
    key: p.id,
    p: p,
    inCart: cartIds.includes(p.id),
    onAdd: onAdd,
    onOpen: onOpen
  })))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 11.5,
      color: 'var(--muted)'
    }
  }, list.length, " results \xB7 ", edges.right ? 'use the arrows or swipe →' : 'swipe to browse'));
}
function BundleCard({
  bundle,
  products,
  cartIds,
  onAdd,
  onAddAll,
  onGiftMsg
}) {
  const total = products.reduce((s, p) => s + p.price, 0);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 380,
      background: '#fff',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--line)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 16px',
      background: 'linear-gradient(120deg, var(--purple-700), var(--purple-600))'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: '#fff',
      fontWeight: 700,
      fontSize: 16
    }
  }, bundle.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '5px 0 0',
      color: 'rgba(255,255,255,0.8)',
      fontSize: 12.5,
      lineHeight: 1.5
    }
  }, bundle.blurb)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 14,
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, products.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    style: {
      display: 'flex',
      gap: 11,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: p.img,
    alt: p.name,
    style: {
      width: 52,
      height: 52,
      borderRadius: 'var(--radius-md)',
      objectFit: 'cover',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--ink)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, p.name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 12,
      color: 'var(--purple-700)',
      fontWeight: 700
    }
  }, LKR(p.price))), /*#__PURE__*/React.createElement("button", {
    onClick: () => onAdd(p),
    style: {
      width: 30,
      height: 30,
      borderRadius: 999,
      border: 'none',
      cursor: 'pointer',
      flexShrink: 0,
      background: cartIds.includes(p.id) ? 'var(--success)' : 'var(--purple-100)',
      color: cartIds.includes(p.id) ? '#fff' : 'var(--purple-700)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: cartIds.includes(p.id) ? 'check' : 'plus',
    size: 15
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 8,
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--muted)'
    }
  }, "Bundle total"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      color: 'var(--purple-700)'
    }
  }, LKR(total))), /*#__PURE__*/React.createElement("button", {
    onClick: onAddAll,
    style: {
      width: '100%',
      padding: '11px',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      background: 'var(--yellow-400)',
      color: 'var(--purple-700)',
      fontWeight: 700,
      fontSize: 14,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "gift",
    size: 16
  }), " Add all to cart"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onGiftMsg(bundle.message),
    style: {
      width: '100%',
      padding: '9px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--purple-200)',
      background: '#fff',
      color: 'var(--purple-700)',
      fontWeight: 600,
      fontSize: 13,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "wand",
    size: 15
  }), " Use the suggested gift message")));
}
function DeliveryStatus({
  city,
  date,
  available,
  rate,
  reason,
  nextDate,
  perishableWarning
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 360,
      background: '#fff',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: `2px solid ${available ? 'var(--success)' : 'var(--error)'}`,
      boxShadow: 'var(--shadow-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 16px',
      background: available ? 'var(--success-tint)' : 'var(--error-tint)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: available ? 'check-circle' : 'x',
    size: 20,
    color: available ? 'var(--success)' : 'var(--error)'
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      fontWeight: 700,
      color: available ? 'var(--success)' : 'var(--error)'
    }
  }, available ? ' Delivery Available!' : '❌ Not Available'), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 12,
      color: 'var(--muted)',
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "calendar",
    size: 12
  }), " ", city, " \xB7 ", date))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, available && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      color: 'var(--muted)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "truck",
    size: 16,
    color: "var(--purple-700)"
  }), " Delivery fee (flat per order)"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: 'var(--purple-700)'
    }
  }, LKR(rate))), reason && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 12px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--error-tint)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      color: 'var(--error)'
    }
  }, reason)), nextDate && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      color: 'var(--muted)'
    }
  }, "Next available: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--ink)'
    }
  }, nextDate)), perishableWarning && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8,
      padding: '10px 12px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--warn-tint)',
      border: '1px solid var(--yellow-200)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "warn",
    size: 16,
    color: "var(--warn)",
    style: {
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      lineHeight: 1.5,
      color: '#92400E'
    }
  }, perishableWarning))));
}
function OrderTracker({
  order
}) {
  const stages = [['Received', 'package'], ['Confirmed', 'check-circle'], ['Out for Delivery', 'truck'], ['Delivered', 'gift']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 360,
      background: '#fff',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: '1px solid var(--line)',
      boxShadow: 'var(--shadow-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--purple-700)',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: '#fff',
      fontWeight: 700,
      fontSize: 14,
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "package",
    size: 16,
    color: "var(--yellow-400)"
  }), " ", order.number), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      color: 'rgba(249,219,9,0.85)',
      fontSize: 12
    }
  }, order.statusDisplay)), order.live && /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '3px 9px',
      borderRadius: 999,
      background: 'var(--yellow-400)',
      color: 'var(--purple-700)',
      fontSize: 10,
      fontWeight: 700,
      animation: 'kapri-pulse 1.6s infinite'
    }
  }, "\u25CF LIVE")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 16px 10px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 16,
      left: 16,
      right: 16,
      height: 2,
      background: 'var(--line)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 16,
      left: 16,
      height: 2,
      background: 'var(--success)',
      width: `calc(${order.stage / 3 * 100}% - ${order.stage / 3 * 32}px)`,
      transition: 'width .7s var(--ease-out)'
    }
  }), stages.map(([label, icon], i) => {
    const done = i <= order.stage;
    return /*#__PURE__*/React.createElement("div", {
      key: label,
      style: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        zIndex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 32,
        height: 32,
        borderRadius: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: done ? 'var(--success)' : 'var(--surface)',
        border: done ? 'none' : '1px solid var(--line)',
        boxShadow: i === order.stage ? '0 0 0 4px rgba(31,157,87,.2)' : 'none'
      }
    }, /*#__PURE__*/React.createElement(Ico, {
      name: icon,
      size: 15,
      color: done ? '#fff' : 'var(--muted)'
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9.5,
        fontWeight: 500,
        textAlign: 'center',
        maxWidth: 58,
        lineHeight: 1.2,
        color: done ? 'var(--ink)' : 'var(--muted)'
      }
    }, label));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 12px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--yellow-100)',
      border: '1px solid var(--yellow-300)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "gift",
    size: 16,
    color: "var(--purple-700)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--ink)',
      fontWeight: 500
    }
  }, "Delivery photo available \u2014 proof of a delivered smile \uD83C\uDF81"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px',
      borderTop: '1px solid var(--line)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      fontSize: 13.5
    }
  }, [['clock', 'Ordered', order.orderDate], ['truck', 'Delivery', order.deliveryDate], ['pin', 'To', order.recipient]].map(([ic, l, v]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      color: 'var(--muted)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: ic,
    size: 14
  }), " ", l), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink)',
      fontWeight: 500,
      textAlign: 'right'
    }
  }, v))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: 8,
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--muted)'
    }
  }, "Total paid"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--purple-700)',
      fontWeight: 700
    }
  }, LKR(order.amount)))), order.items && order.items.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px',
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 9px',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: 'var(--muted)'
    }
  }, order.items.length, " item", order.items.length > 1 ? 's' : '', " in this order"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, order.items.map((it, idx) => {
    const itemStatus = ['Preparing', 'Packed', 'Out for delivery', 'Delivered'][order.stage] || 'Preparing';
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: it.img,
      alt: it.name,
      onError: e => {
        e.currentTarget.style.display = 'none';
      },
      style: {
        width: 42,
        height: 42,
        borderRadius: 'var(--radius-md)',
        objectFit: 'cover',
        flexShrink: 0,
        background: 'var(--purple-50)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 12.5,
        fontWeight: 600,
        color: 'var(--ink)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, it.name), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginTop: 3
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 10,
        fontWeight: 600,
        padding: '2px 7px',
        borderRadius: 999,
        background: order.stage >= 3 ? 'rgba(31,157,87,.12)' : 'var(--purple-100)',
        color: order.stage >= 3 ? 'var(--success)' : 'var(--purple-700)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 5,
        height: 5,
        borderRadius: 999,
        background: order.stage >= 3 ? 'var(--success)' : 'var(--purple-500)'
      }
    }), itemStatus), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: 'var(--muted)'
      }
    }, "Qty ", it.qty), it.icing && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: 'var(--purple-700)',
        background: 'var(--purple-50)',
        padding: '1px 6px',
        borderRadius: 6,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: 110
      }
    }, "\u270D\uFE0F ", it.icing))), it.price != null && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--ink)',
        flexShrink: 0
      }
    }, LKR(it.price * it.qty)));
  }))));
}

// Maps to the Kapruka MCP "Get Product Details" tool — full single-product view.
const CAT_BLURB = {
  Cakes: "Freshly baked to order by Kapruka's master bakers using premium ingredients, and delivered on a sturdy board with a complimentary message card. Personalise it with an icing message below.",
  Flowers: "Hand-arranged by our florists on the morning of delivery and presented in protective wrapping so it arrives garden-fresh.",
  Chocolates: "Stored and shipped with care to keep every piece perfect. A crowd-pleasing gift for any occasion.",
  Hampers: "Thoughtfully curated and gift-wrapped, ready to hand over. A little of everything they'll love.",
  Perfumes: "100% authentic, sealed stock sourced through authorised channels. Comes boxed and gift-ready.",
  Jewellery: "Comes in a presentation box with a care card — a keepsake they'll treasure.",
  Electronics: "Genuine stock with manufacturer warranty. Boxed and ready to gift or use straight away.",
  'Soft Toys': "Super-soft, cuddle-tested and surface-washable — a friend for keeps."
};
function SpecRow({
  label,
  value
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12,
      padding: '9px 0',
      borderBottom: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: 'var(--muted)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      fontWeight: 600,
      color: 'var(--ink)',
      textAlign: 'right'
    }
  }, value));
}
function ProductDetail({
  p,
  inCart,
  onAdd,
  onClose
}) {
  const [qty, setQty] = React.useState(1);
  const [icing, setIcing] = React.useState('');
  const [imgErr, setImgErr] = React.useState(false);
  const [added, setAdded] = React.useState(false);
  if (!p) return null;
  const isCake = p.id.toUpperCase().includes('CAKE');
  const hasDisc = p.was && p.was > p.price;
  const pct = hasDisc ? Math.round((1 - p.price / p.was) * 100) : 0;
  const lowStock = p.low && !p.perishable;
  const availability = p.perishable ? 'Made fresh to order' : lowStock ? 'Low stock — order soon' : 'In stock';
  const add = () => {
    onAdd(p, qty, isCake ? icing : undefined);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 700);
  };
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(36,21,68,0.45)',
      backdropFilter: 'blur(3px)',
      animation: 'kapri-up .3s var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "kapri-modal",
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      maxWidth: 540,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-xl)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px',
      background: 'var(--purple-700)',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontWeight: 700,
      fontSize: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "search",
    size: 17,
    color: "var(--yellow-400)"
  }), " Product details"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'none',
      border: 'none',
      color: '#fff',
      cursor: 'pointer',
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "x",
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    className: "scrollbar-hide",
    style: {
      flex: 1,
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 300,
      background: 'var(--purple-50)'
    }
  }, !imgErr ? /*#__PURE__*/React.createElement("img", {
    src: p.img,
    alt: p.name,
    onError: () => setImgErr(true),
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 64
    }
  }, "\uD83C\uDF81"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 12,
      left: 12
    }
  }, /*#__PURE__*/React.createElement(Pill, {
    tone: "purple"
  }, p.cat)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 12,
      right: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 5,
      alignItems: 'flex-end'
    }
  }, lowStock && /*#__PURE__*/React.createElement(Pill, {
    tone: "warn"
  }, "Low Stock"), hasDisc && /*#__PURE__*/React.createElement(Pill, {
    tone: "success"
  }, "-", pct, "% OFF"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "sinhala-text",
    style: {
      margin: 0,
      fontSize: 20,
      fontWeight: 700,
      color: 'var(--ink)',
      lineHeight: 1.3
    }
  }, p.name), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      marginTop: 7,
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--muted)',
      background: '#fff',
      border: '1px solid var(--line)',
      borderRadius: 7,
      padding: '3px 8px'
    }
  }, p.id)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 26,
      color: 'var(--purple-700)'
    }
  }, LKR(p.price)), hasDisc && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      color: 'var(--muted)',
      textDecoration: 'line-through'
    }
  }, LKR(p.was)), hasDisc && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: 'var(--success)'
    }
  }, "Save ", LKR(p.was - p.price))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      fontSize: 13,
      color: p.perishable ? 'var(--warn)' : 'var(--success)',
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: p.perishable ? 'clock' : 'check-circle',
    size: 16,
    color: p.perishable ? 'var(--warn)' : 'var(--success)'
  }), " ", availability), /*#__PURE__*/React.createElement("p", {
    className: "sinhala-text",
    style: {
      margin: 0,
      fontSize: 13.5,
      lineHeight: 1.6,
      color: 'var(--ink)'
    }
  }, p.summary, " ", CAT_BLURB[p.cat] || ''), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 2px',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: 'var(--muted)'
    }
  }, "Details"), /*#__PURE__*/React.createElement(SpecRow, {
    label: "Category",
    value: p.cat
  }), /*#__PURE__*/React.createElement(SpecRow, {
    label: "Product ID",
    value: p.id
  }), /*#__PURE__*/React.createElement(SpecRow, {
    label: "Availability",
    value: availability
  }), isCake && /*#__PURE__*/React.createElement(SpecRow, {
    label: "Size",
    value: "1 kg (serves ~8)"
  }), /*#__PURE__*/React.createElement(SpecRow, {
    label: "Delivery",
    value: "Island-wide \xB7 flat fee per order"
  }), /*#__PURE__*/React.createElement(SpecRow, {
    label: "Personalisation",
    value: isCake ? 'Icing message (≤120 chars)' : 'Free gift message at checkout'
  })), p.perishable && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      padding: '10px 12px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--warn-tint)',
      border: '1px solid var(--yellow-200)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "warn",
    size: 15,
    color: "var(--warn)",
    style: {
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      lineHeight: 1.5,
      color: '#92400E'
    }
  }, "Fresh item \u2014 prepared on the delivery day. Choose a date 1\u20132 days ahead and make sure someone can receive it.")), isCake && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--ink)',
      marginBottom: 7
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "edit",
    size: 14,
    color: "var(--purple-700)"
  }), " Message on cake (optional)"), /*#__PURE__*/React.createElement("input", {
    value: icing,
    onChange: e => setIcing(e.target.value),
    maxLength: 120,
    placeholder: "e.g. Happy Birthday Amma! \uD83C\uDF82",
    className: "sinhala-text",
    style: {
      width: '100%',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--line)',
      padding: '10px 12px',
      fontSize: 13.5,
      outline: 'none',
      background: '#fff',
      fontFamily: 'var(--font-sans)',
      boxSizing: 'border-box'
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      borderTop: '1px solid var(--line)',
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius-md)',
      padding: '6px 10px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setQty(q => Math.max(1, q - 1)),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--ink)',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "minus",
    size: 15
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      width: 18,
      textAlign: 'center'
    }
  }, qty), /*#__PURE__*/React.createElement("button", {
    onClick: () => setQty(q => q + 1),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--ink)',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "plus",
    size: 15
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: add,
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: '13px',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      background: added ? 'var(--success)' : 'var(--purple-700)',
      color: '#fff',
      fontWeight: 700,
      fontSize: 15,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: added ? 'check' : 'cart',
    size: 17
  }), " ", added ? 'Added to cart!' : `Add ${qty} · ${LKR(p.price * qty)}`))));
}
function SkeletonCarousel() {
  const sk = {
    background: 'var(--purple-100)',
    borderRadius: 8
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 7
    }
  }, [60, 54, 54].map((w, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "skeleton",
    style: {
      width: w,
      height: 24,
      borderRadius: 999
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      overflow: 'hidden'
    }
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: 210,
      flexShrink: 0,
      background: '#fff',
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-card)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "skeleton",
    style: {
      height: 188,
      borderRadius: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "skeleton",
    style: {
      ...sk,
      height: 12,
      width: '90%'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "skeleton",
    style: {
      ...sk,
      height: 12,
      width: '60%'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "skeleton",
    style: {
      ...sk,
      height: 22,
      width: 66
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "skeleton",
    style: {
      ...sk,
      height: 34,
      width: '100%',
      marginTop: 4
    }
  }))))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 11.5,
      color: 'var(--muted)'
    }
  }, "Searching Kapruka for you\u2026"));
}
window.KapriGenUI = {
  Pill,
  EmptyState,
  ProductCard,
  ProductCarousel,
  BundleCard,
  DeliveryStatus,
  OrderTracker,
  ProductDetail,
  SkeletonCarousel
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "kapri-app/genui.jsx", error: String((e && e.message) || e) }); }

// kapri-app/ui.jsx
try { (() => {
/* Kapri demo — UI primitives. */

const ICONS = {
  'cart': '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  'bag': '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  'send': '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  'mic': '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
  'sparkles': '<path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z"/><path d="M19 3v4M21 5h-4M5 17v4M7 19H3"/>',
  'link': '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"/>',
  'check': '<path d="M20 6 9 17l-5-5"/>',
  'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m22 4-10 10.01-3-3"/>',
  'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  'plus': '<path d="M5 12h14"/><path d="M12 5v14"/>',
  'minus': '<path d="M5 12h14"/>',
  'trash': '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  'truck': '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  'calendar': '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 2v4"/><path d="M16 2v4"/>',
  'clock': '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  'pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  'phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>',
  'package': '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  'gift': '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
  'warn': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  'user': '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  'wand': '<path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8 19 13M17.8 6.2 19 5M3 21l9-9M12.2 6.2 11 5"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'chevron-left': '<path d="m15 18-6-6 6-6"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  'edit': '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>',
  'heart': '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  'search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  'globe': '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"/>'
};
function Ico({
  name,
  size = 18,
  color = 'currentColor',
  sw = 2,
  style
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: sw,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flexShrink: 0,
      display: 'block',
      ...(style || {})
    },
    dangerouslySetInnerHTML: {
      __html: ICONS[name] || ''
    }
  });
}
function Header({
  count,
  onCart,
  lang,
  onLang
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      padding: '11px 16px',
      background: 'var(--purple-700)',
      boxShadow: 'var(--shadow-lg)',
      zIndex: 20,
      flexShrink: 0,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 1180,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../assets/kapruka-logo.jpg",
    alt: "Kapruka",
    style: {
      height: 30,
      width: 'auto',
      borderRadius: 5
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 22,
      background: 'rgba(255,255,255,0.2)'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--yellow-400)',
      fontWeight: 700,
      lineHeight: 1
    }
  }, "Kapri"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9.5,
      color: 'rgba(255,255,255,0.6)',
      lineHeight: 1,
      marginTop: 2,
      letterSpacing: '.02em'
    }
  }, "AI Shopping Concierge"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onLang,
    title: "Switch language",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '7px 11px',
      borderRadius: 'var(--radius-md)',
      background: 'rgba(255,255,255,0.1)',
      color: '#fff',
      fontSize: 12,
      fontWeight: 600,
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "globe",
    size: 14,
    color: "rgba(255,255,255,.8)"
  }), lang === 'en' ? /*#__PURE__*/React.createElement("span", null, "EN ", /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .55
    }
  }, "\xB7 \u0DC3\u0DD2\u0D82")) : /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .55
    }
  }, "EN \xB7"), " \u0DC3\u0DD2\u0D82")), /*#__PURE__*/React.createElement("button", {
    onClick: onCart,
    "aria-label": "Cart",
    style: {
      position: 'relative',
      width: 40,
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-md)',
      background: 'rgba(255,255,255,0.1)',
      color: '#fff',
      border: 'none',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "cart",
    size: 20
  }), count > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -6,
      right: -6,
      minWidth: 19,
      height: 19,
      padding: '0 4px',
      background: 'var(--yellow-400)',
      color: 'var(--purple-700)',
      fontSize: 11,
      fontWeight: 700,
      borderRadius: 999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'var(--shadow-sm)',
      animation: 'kapri-pop .3s var(--ease-spring)'
    }
  }, count)))));
}
function Avatar() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      flexShrink: 0,
      marginTop: 2,
      borderRadius: 999,
      background: 'var(--purple-700)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 16,
      boxShadow: 'var(--shadow-sm)'
    }
  }, "\uD83D\uDECD\uFE0F");
}
function UserBubble({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'kapri-in-right .3s var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sinhala-text",
    style: {
      maxWidth: '82%',
      padding: '10px 15px',
      fontSize: 14,
      color: '#fff',
      background: 'var(--purple-700)',
      borderRadius: 'var(--radius-lg)',
      borderTopRightRadius: 'var(--radius-sm)',
      boxShadow: 'var(--shadow-sm)',
      whiteSpace: 'pre-wrap'
    }
  }, children));
}
function KapriRow({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 9,
      animation: 'kapri-in-left .3s var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      flex: 1,
      minWidth: 0
    }
  }, children));
}
function KapriText({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sinhala-text",
    style: {
      alignSelf: 'flex-start',
      maxWidth: '92%',
      padding: '10px 15px',
      background: 'var(--purple-100)',
      color: 'var(--ink)',
      borderRadius: 'var(--radius-lg)',
      borderTopLeftRadius: 'var(--radius-sm)',
      fontSize: 14,
      lineHeight: 1.5,
      boxShadow: 'var(--shadow-sm)',
      whiteSpace: 'pre-wrap'
    }
  }, children);
}
function Typing() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(Avatar, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '12px 15px',
      background: 'var(--purple-100)',
      borderRadius: 'var(--radius-lg)',
      borderTopLeftRadius: 'var(--radius-sm)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 7,
      height: 7,
      borderRadius: 999,
      background: 'var(--purple-500)',
      animation: `kapri-bounce 1s ease-in-out ${i * 0.18}s infinite`
    }
  }))));
}
function Chip({
  children,
  onClick,
  tone
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      padding: '6px 13px',
      borderRadius: 999,
      fontSize: 12.5,
      fontWeight: 600,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      boxShadow: 'var(--shadow-sm)',
      transition: 'all .15s var(--ease-out)',
      background: tone === 'accent' ? 'var(--yellow-400)' : h ? 'var(--purple-50)' : '#fff',
      color: tone === 'accent' ? 'var(--purple-700)' : 'var(--purple-700)',
      border: `1px solid ${tone === 'accent' ? 'var(--yellow-400)' : h ? 'var(--purple-700)' : 'var(--line)'}`
    }
  }, children);
}
function Composer({
  value,
  onChange,
  onSend,
  onMic,
  recording,
  placeholder
}) {
  const ref = React.useRef(null);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      padding: '12px 16px',
      background: '#fff',
      borderTop: '1px solid var(--line)',
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      onSend();
    },
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 8,
      maxWidth: 780,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("input", {
    ref: ref,
    value: value,
    onChange: e => onChange(e.target.value),
    placeholder: placeholder,
    className: "sinhala-text",
    style: {
      flex: 1,
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--line)',
      padding: '12px 16px',
      fontSize: 14,
      color: 'var(--ink)',
      background: 'var(--surface)',
      outline: 'none',
      fontFamily: 'var(--font-sans)'
    },
    onFocus: e => {
      e.target.style.borderColor = 'var(--purple-700)';
      e.target.style.background = '#fff';
      e.target.style.boxShadow = '0 0 0 3px var(--focus-ring)';
    },
    onBlur: e => {
      e.target.style.borderColor = 'var(--line)';
      e.target.style.background = 'var(--surface)';
      e.target.style.boxShadow = 'none';
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onMic,
    "aria-label": "Voice input",
    style: {
      width: 44,
      height: 44,
      flexShrink: 0,
      borderRadius: 'var(--radius-lg)',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      background: recording ? 'var(--error)' : 'var(--purple-100)',
      color: recording ? '#fff' : 'var(--purple-700)',
      animation: recording ? 'kapri-pulse 1s infinite' : 'none'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "mic",
    size: 18
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: !value.trim(),
    "aria-label": "Send",
    style: {
      width: 44,
      height: 44,
      flexShrink: 0,
      borderRadius: 'var(--radius-lg)',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: value.trim() ? 'pointer' : 'not-allowed',
      background: 'var(--purple-700)',
      color: '#fff',
      opacity: value.trim() ? 1 : 0.45
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "send",
    size: 18
  }))), recording && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      maxWidth: 780,
      margin: '9px auto 0',
      padding: '0 2px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      height: 18
    }
  }, [0, 1, 2, 3, 4, 5, 6].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 3,
      height: '100%',
      borderRadius: 999,
      background: 'var(--error)',
      transformOrigin: 'center',
      animation: `kapri-wave .7s ease-in-out ${i * 0.09}s infinite alternate`
    }
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--error)',
      fontWeight: 600
    },
    className: "sinhala-text"
  }, "Listening\u2026 speak in \u0DC3\u0DD2\u0D82\u0DC4\u0DBD or English \xB7 tap mic to stop")));
}
function SeasonBanner({
  season,
  onShop
}) {
  const [show, setShow] = React.useState(() => {
    try {
      return localStorage.getItem('kapri_season_x_' + season.key) !== '1';
    } catch (e) {
      return true;
    }
  });
  if (!show) return null;
  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem('kapri_season_x_' + season.key, '1');
    } catch (e) {}
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      background: 'linear-gradient(90deg, var(--yellow-300), var(--yellow-400))',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 1180,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '8px 16px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20,
      lineHeight: 1
    }
  }, season.emoji), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      fontWeight: 700,
      color: 'var(--purple-800)'
    }
  }, season.greeting), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: 'var(--purple-700)',
      marginLeft: 8,
      opacity: .85
    },
    className: "kapri-hide-sm"
  }, season.sub)), /*#__PURE__*/React.createElement("button", {
    onClick: () => onShop(season.q),
    style: {
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 13px',
      borderRadius: 999,
      background: 'var(--purple-700)',
      color: '#fff',
      border: 'none',
      fontSize: 12.5,
      fontWeight: 600,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)'
    }
  }, season.cta, " ", /*#__PURE__*/React.createElement(Ico, {
    name: "arrow-right",
    size: 14
  })), /*#__PURE__*/React.createElement("button", {
    onClick: dismiss,
    "aria-label": "Dismiss",
    style: {
      flexShrink: 0,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--purple-700)',
      padding: 4,
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "x",
    size: 16
  }))));
}
window.KapriUI = {
  Ico,
  Header,
  SeasonBanner,
  Avatar,
  UserBubble,
  KapriRow,
  KapriText,
  Typing,
  Chip,
  Composer
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "kapri-app/ui.jsx", error: String((e && e.message) || e) }); }

// ui_kits/kapri/App.jsx
try { (() => {
/* Kapri UI kit — interactive App. Scripted fake conversation engine that
   demonstrates: empty state → search → add to cart → checkout → track. */

const CATALOG = {
  cakes: [{
    id: 'CAKE-2291',
    name: 'Belgian Chocolate Fudge Cake — 1kg',
    summary: 'Rich layered ganache, made fresh to order.',
    price: 4500,
    compareAtPrice: 5200,
    category: 'Cakes',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop'
  }, {
    id: 'CAKE-1180',
    name: 'Ribbon Butter Cake — 1kg',
    summary: 'A Sri Lankan classic, soft and buttery.',
    price: 3200,
    category: 'Cakes',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop'
  }, {
    id: 'CAKE-3340',
    name: 'Fresh Strawberry Gateau — 1kg',
    summary: 'Whipped cream & seasonal strawberries.',
    price: 5400,
    category: 'Cakes',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=400&fit=crop'
  }, {
    id: 'CAKE-7782',
    name: 'Red Velvet Cream Cheese Cake',
    summary: 'Velvety crumb, tangy frosting.',
    price: 4900,
    category: 'Cakes',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=400&fit=crop'
  }],
  gifts: [{
    id: 'GIFT-2201',
    name: 'Pamper Hamper for Mum',
    summary: 'Chocolates, tea & a scented candle.',
    price: 4800,
    category: 'Giftset',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=400&fit=crop'
  }, {
    id: 'CHOC-540',
    name: 'Lindt Lindor Assorted Box',
    summary: 'Smooth-melting Swiss truffles.',
    price: 3200,
    compareAtPrice: 3800,
    category: 'Chocolates',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop'
  }, {
    id: 'PERF-091',
    name: 'Floral Eau de Parfum — 50ml',
    summary: 'Jasmine & sandalwood notes.',
    price: 7900,
    category: 'Perfumes',
    inStock: true,
    lowStock: true,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop'
  }, {
    id: 'FLOWERS-118',
    name: 'Red Rose Bouquet — Dozen',
    summary: 'A dozen long-stem roses, hand-tied.',
    price: 6900,
    category: 'Flowers',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=400&fit=crop'
  }],
  flowers: [{
    id: 'FLOWERS-118',
    name: 'Red Rose Bouquet — Dozen',
    summary: 'A dozen long-stem roses, hand-tied.',
    price: 6900,
    category: 'Flowers',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=400&fit=crop'
  }, {
    id: 'FLOWERS-204',
    name: 'Mixed Gerbera Basket',
    summary: 'Bright daisies in a woven basket.',
    price: 5200,
    category: 'Flowers',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop'
  }, {
    id: 'FLOWERS-330',
    name: 'White Lily Arrangement',
    summary: 'Elegant lilies for any occasion.',
    price: 6100,
    category: 'Flowers',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&h=400&fit=crop'
  }]
};
const PROMPTS = [{
  emoji: '🎁',
  text: 'I need a gift for my mother, under Rs. 5,000'
}, {
  emoji: '🎂',
  text: 'Mata ammata cake ekak gannako — Colombo ekata'
}, {
  emoji: '🇱🇰',
  text: 'Avurudu hamper bundle ekak hadanna under Rs. 8,000'
}, {
  emoji: '🛍️',
  text: 'අම්මට තෑග්ගක් — රු. 5000ට අඩුවෙන්'
}];
function reply(text) {
  const t = text.toLowerCase();
  if (t.includes('track') || t.includes('vimp')) {
    return {
      text: "Mama balannam! 📦 Mehe oyage order eke latest status eka:",
      card: {
        type: 'tracker'
      }
    };
  }
  if (t.includes('checkout') || t.includes('check out') || t.includes('pay') || t.includes('order')) {
    return {
      text: "Suba! Colombo ekata delivery eka confirm karannam — eth ekka order eka ready! 🎉",
      card: {
        type: 'checkout'
      }
    };
  }
  if (t.includes('cake')) return {
    text: "Mata amma ta lassana cake tikak hoyaa-gaththa! Balanna 🎂",
    card: {
      type: 'carousel',
      items: CATALOG.cakes
    }
  };
  if (t.includes('flower') || t.includes('rose') || t.includes('මල්')) return {
    text: "Here are some beautiful fresh flowers for you 🌹",
    card: {
      type: 'carousel',
      items: CATALOG.flowers
    }
  };
  return {
    text: "Mehe mama hithapu hondha gift ideas tikak — amma ta perfect! 🎁",
    card: {
      type: 'carousel',
      items: CATALOG.gifts
    }
  };
}
function CartDrawer({
  open,
  items,
  onClose,
  onQty,
  onRemove,
  onCheckout
}) {
  const total = items.reduce((s, i) => s + i.p.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  return /*#__PURE__*/React.createElement(React.Fragment, null, open && /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(2px)',
      zIndex: 40
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      maxWidth: 360,
      background: '#fff',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'var(--shadow-xl)',
      transform: open ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform .4s var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      background: 'var(--purple-700)',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontWeight: 600,
      fontSize: 18
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "shopping-bag",
    size: 20
  }), " Your Cart", count > 0 && ` (${count})`), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'none',
      border: 'none',
      color: '#fff',
      cursor: 'pointer',
      padding: 6
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "x",
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    className: "scrollbar-hide",
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, items.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: 12,
      color: 'var(--muted)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "shopping-bag",
    size: 56,
    color: "var(--purple-200)"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontWeight: 500,
      fontSize: 14
    }
  }, "Your cart is empty"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      textAlign: 'center',
      maxWidth: 180
    }
  }, "Ask Kapri to find something special for you! \uD83C\uDF81")) : items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.p.id,
    style: {
      display: 'flex',
      gap: 12,
      background: 'var(--surface)',
      borderRadius: 'var(--radius-lg)',
      padding: 12,
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: it.p.image,
    alt: it.p.name,
    style: {
      width: 64,
      height: 64,
      borderRadius: 'var(--radius-md)',
      objectFit: 'cover',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--ink)',
      lineHeight: 1.35,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, it.p.name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--purple-700)'
    }
  }, LKR(it.p.price)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onQty(it.p.id, -1),
    style: qtyBtn
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "minus",
    size: 12
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      width: 18,
      textAlign: 'center'
    }
  }, it.qty), /*#__PURE__*/React.createElement("button", {
    onClick: () => onQty(it.p.id, 1),
    style: qtyBtn
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "plus",
    size: 12
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => onRemove(it.p.id),
    style: {
      marginLeft: 'auto',
      background: 'none',
      border: 'none',
      color: 'var(--muted)',
      cursor: 'pointer',
      padding: 2
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "trash-2",
    size: 16
  }))))))), items.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      borderTop: '1px solid var(--line)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--muted)',
      fontSize: 14
    }
  }, "Subtotal"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: 'var(--purple-700)',
      fontSize: 18
    }
  }, LKR(total))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      color: 'var(--muted)'
    }
  }, "Flat delivery fee per order \u2014 calculated at checkout"), /*#__PURE__*/React.createElement("button", {
    onClick: onCheckout,
    style: {
      width: '100%',
      padding: '13px',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      background: 'var(--purple-700)',
      color: '#fff',
      fontWeight: 600,
      fontSize: 15,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)'
    }
  }, "Checkout with Kapri \uD83D\uDECD\uFE0F"))));
}
const qtyBtn = {
  width: 24,
  height: 24,
  borderRadius: 8,
  background: '#fff',
  border: '1px solid var(--line)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'var(--ink)'
};
function App() {
  const [msgs, setMsgs] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [cart, setCart] = React.useState([]);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [lang, setLang] = React.useState('en');
  const [thinking, setThinking] = React.useState(false);
  const scrollRef = React.useRef(null);
  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, thinking]);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const send = text => {
    const t = (text ?? input).trim();
    if (!t) return;
    setInput('');
    setMsgs(m => [...m, {
      role: 'user',
      text: t
    }]);
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMsgs(m => [...m, {
        role: 'kapri',
        ...reply(t)
      }]);
    }, 850);
  };
  const addToCart = p => setCart(c => {
    const ex = c.find(i => i.p.id === p.id);
    return ex ? c.map(i => i.p.id === p.id ? {
      ...i,
      qty: i.qty + 1
    } : i) : [...c, {
      p,
      qty: 1
    }];
  });
  const changeQty = (id, d) => setCart(c => c.map(i => i.p.id === id ? {
    ...i,
    qty: Math.max(1, i.qty + d)
  } : i));
  const removeItem = id => setCart(c => c.filter(i => i.p.id !== id));
  const checkout = () => {
    setCartOpen(false);
    send("I'd like to checkout the items in my cart.");
  };
  const order = {
    ref: 'ORD-8842-KP',
    total: cart.reduce((s, i) => s + i.p.price * i.qty, 0) + 350 || 4850,
    expires: 3540,
    lines: [{
      label: 'Items',
      amount: cart.reduce((s, i) => s + i.p.price * i.qty, 0) || 4500
    }, {
      label: 'Delivery (flat per order)',
      amount: 350
    }]
  };
  const trackOrder = {
    number: 'VIMP34456CB2',
    statusDisplay: 'Out for delivery',
    stage: 2,
    live: true,
    proof: true,
    orderDate: 'Thu, 12 Jun 2026',
    deliveryDate: 'Sat, 14 Jun 2026',
    recipient: 'Amma, Colombo 05',
    amount: 4850
  };
  const lastKapri = msgs.map(m => m.role).lastIndexOf('kapri');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      background: 'var(--surface)'
    }
  }, /*#__PURE__*/React.createElement(Header, {
    cartCount: count,
    onCart: () => setCartOpen(true),
    lang: lang,
    onLang: () => setLang(l => l === 'en' ? 'si' : 'en')
  }), /*#__PURE__*/React.createElement("div", {
    ref: scrollRef,
    className: "scrollbar-hide",
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, msgs.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, {
    prompts: PROMPTS,
    onPrompt: send
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, msgs.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, m.role === 'user' ? /*#__PURE__*/React.createElement(Bubble, {
    role: "user"
  }, m.text) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      flexShrink: 0,
      marginTop: 2,
      borderRadius: 999,
      background: 'var(--purple-700)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 15,
      boxShadow: 'var(--shadow-sm)'
    }
  }, "\uD83D\uDECD\uFE0F"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'flex-start',
      maxWidth: '90%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sinhala-text",
    style: {
      padding: '10px 16px',
      background: 'var(--purple-100)',
      color: 'var(--ink)',
      borderRadius: 'var(--radius-lg)',
      borderTopLeftRadius: 'var(--radius-sm)',
      fontSize: 14,
      boxShadow: 'var(--shadow-sm)'
    }
  }, m.text)), m.card?.type === 'carousel' && /*#__PURE__*/React.createElement(ProductCarousel, {
    products: m.card.items,
    onAdd: addToCart
  }), m.card?.type === 'checkout' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DeliveryStatus, {
    d: {
      city: 'Colombo',
      date: 'Sat, 14 Jun 2026',
      available: true,
      rate: 350,
      perishableWarning: 'Cakes are made fresh — please make sure someone can receive it on the day.'
    }
  }), /*#__PURE__*/React.createElement(CheckoutCard, {
    order: order
  })), m.card?.type === 'tracker' && /*#__PURE__*/React.createElement(OrderTracker, {
    order: trackOrder
  }), i === lastKapri && /*#__PURE__*/React.createElement(QuickReplies, {
    items: ['Show more', 'Under Rs. 3,000', 'Track my order'],
    onPick: send
  }))))), thinking && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      paddingLeft: 36
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 14px',
      background: '#fff',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--line)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 8,
      height: 8,
      borderRadius: 999,
      background: 'var(--purple-700)',
      animation: `kapruka-breathe 1s ease-in-out ${i * 0.2}s infinite`
    }
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--muted)'
    }
  }, "Kapri is thinking..."))))), /*#__PURE__*/React.createElement(Composer, {
    value: input,
    onChange: setInput,
    onSend: () => send(),
    lang: lang
  }), /*#__PURE__*/React.createElement(CartDrawer, {
    open: cartOpen,
    items: cart,
    onClose: () => setCartOpen(false),
    onQty: changeQty,
    onRemove: removeItem,
    onCheckout: checkout
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/kapri/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/kapri/GenUI.jsx
try { (() => {
/* Kapri UI kit — generative-UI cards: ProductCard, ProductCarousel,
   DeliveryStatus, CheckoutCard, OrderTracker, EmptyState. */

function Pill({
  tone,
  children
}) {
  const tones = {
    purple: {
      background: 'rgba(68,42,115,0.82)',
      color: '#fff',
      backdropFilter: 'blur(4px)'
    },
    accent: {
      background: 'var(--yellow-400)',
      color: 'var(--purple-700)',
      fontWeight: 700
    },
    success: {
      background: 'rgba(31,157,87,0.92)',
      color: '#fff'
    },
    warn: {
      background: 'rgba(217,138,0,0.92)',
      color: '#fff'
    },
    ink: {
      background: 'rgba(27,18,48,0.72)',
      color: '#fff',
      backdropFilter: 'blur(4px)'
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 10,
      fontWeight: 600,
      lineHeight: 1,
      padding: '4px 8px',
      borderRadius: 999,
      whiteSpace: 'nowrap',
      ...tones[tone]
    }
  }, children);
}
function ProductCard({
  p,
  onAdd
}) {
  const [hover, setHover] = React.useState(false);
  const [added, setAdded] = React.useState(false);
  const hasDisc = p.compareAtPrice && p.compareAtPrice > p.price;
  const pct = hasDisc ? Math.round((1 - p.price / p.compareAtPrice) * 100) : 0;
  const add = () => {
    if (!p.inStock) return;
    setAdded(true);
    onAdd(p);
    setTimeout(() => setAdded(false), 1800);
  };
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: 220,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: hover ? '0 12px 28px rgba(68,42,115,.20)' : 'var(--shadow-card)',
      transform: hover ? 'translateY(-3px)' : 'none',
      transition: 'all .25s var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 196,
      background: 'var(--purple-50)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: p.image,
    alt: p.name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transform: hover ? 'scale(1.05)' : 'none',
      transition: 'transform .4s var(--ease-out)'
    }
  }), p.category && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 8,
      left: 8
    }
  }, /*#__PURE__*/React.createElement(Pill, {
    tone: "purple"
  }, p.category)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 8,
      right: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 4
    }
  }, !p.inStock && /*#__PURE__*/React.createElement(Pill, {
    tone: "ink"
  }, "Out of Stock"), p.inStock && p.lowStock && /*#__PURE__*/React.createElement(Pill, {
    tone: "warn"
  }, "Low Stock"), hasDisc && /*#__PURE__*/React.createElement(Pill, {
    tone: "success"
  }, "-", pct, "%"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontWeight: 600,
      fontSize: 14,
      lineHeight: 1.35,
      color: 'var(--ink)',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, p.name), p.summary && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 11,
      lineHeight: 1.5,
      color: 'var(--muted)',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, p.summary), /*#__PURE__*/React.createElement("span", {
    style: {
      alignSelf: 'flex-start',
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--muted)',
      background: 'var(--surface)',
      border: '1px solid var(--line)',
      borderRadius: 8,
      padding: '2px 6px'
    }
  }, p.id), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 16,
      color: 'var(--purple-700)'
    }
  }, LKR(p.price)), hasDisc && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--muted)',
      textDecoration: 'line-through'
    }
  }, LKR(p.compareAtPrice))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginTop: 'auto',
      paddingTop: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: add,
    disabled: !p.inStock,
    style: {
      flex: 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: '8px 0',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      fontSize: 12,
      fontWeight: 600,
      fontFamily: 'var(--font-sans)',
      cursor: p.inStock ? 'pointer' : 'not-allowed',
      color: p.inStock ? '#fff' : 'var(--muted)',
      background: added ? 'var(--success)' : p.inStock ? 'var(--purple-700)' : 'var(--line)',
      transition: 'background .15s'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: added ? 'check' : 'shopping-cart',
    size: 14
  }), added ? 'Added!' : 'Add to Cart'), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface)',
      border: '1px solid var(--line)',
      color: 'var(--muted)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "external-link",
    size: 14
  })))));
}
function ProductCarousel({
  products,
  onAdd
}) {
  const [sort, setSort] = React.useState('rel');
  const sorted = [...products].sort((a, b) => sort === 'asc' ? a.price - b.price : sort === 'desc' ? b.price - a.price : 0);
  const pills = [['rel', 'Relevance'], ['asc', 'Price ↑'], ['desc', 'Price ↓']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, pills.map(([id, l]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: () => setSort(id),
    style: {
      fontSize: 12,
      fontWeight: 600,
      padding: '4px 12px',
      borderRadius: 999,
      cursor: 'pointer',
      border: '1px solid',
      ...(sort === id ? {
        background: 'var(--purple-700)',
        color: '#fff',
        borderColor: 'var(--purple-700)'
      } : {
        background: 'var(--purple-100)',
        color: 'var(--purple-700)',
        borderColor: 'var(--purple-200)'
      })
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    className: "scrollbar-hide",
    style: {
      display: 'flex',
      gap: 12,
      overflowX: 'auto',
      paddingBottom: 8
    }
  }, sorted.map(p => /*#__PURE__*/React.createElement(ProductCard, {
    key: p.id,
    p: p,
    onAdd: onAdd
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      color: 'var(--muted)'
    }
  }, products.length, " results \xB7 Scroll to see more"));
}
function DeliveryStatus({
  d
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 360,
      background: '#fff',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: `2px solid ${d.available ? 'var(--success)' : 'var(--error)'}`,
      boxShadow: 'var(--shadow-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 16px',
      background: d.available ? 'var(--success-tint)' : 'var(--error-tint)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: d.available ? 'check-circle' : 'x',
    size: 20,
    color: d.available ? 'var(--success)' : 'var(--error)'
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      fontWeight: 700,
      color: d.available ? 'var(--success)' : 'var(--error)'
    }
  }, d.available ? ' Delivery Available!' : '❌ Not Available'), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 12,
      color: 'var(--muted)',
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "calendar",
    size: 12
  }), " ", d.city, " \xB7 ", d.date))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, d.available && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      color: 'var(--muted)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "truck",
    size: 16,
    color: "var(--purple-700)"
  }), " Delivery fee (flat per order)"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: 'var(--purple-700)'
    }
  }, LKR(d.rate))), d.perishableWarning && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8,
      padding: '10px 12px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--warn-tint)',
      border: '1px solid var(--yellow-200)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "alert-triangle",
    size: 16,
    color: "var(--warn)",
    style: {
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      lineHeight: 1.5,
      color: '#92400E'
    }
  }, d.perishableWarning))));
}
function CheckoutCard({
  order
}) {
  const [secs, setSecs] = React.useState(order.expires || 3600);
  React.useEffect(() => {
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(secs / 60)).padStart(2, '0'),
    ss = String(secs % 60).padStart(2, '0');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 360,
      background: '#fff',
      borderRadius: 'var(--radius-lg)',
      border: '2px solid var(--purple-700)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--purple-700)',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 999,
      background: 'var(--yellow-400)',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "check-circle",
    size: 24,
    color: "var(--purple-700)"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: '#fff',
      fontWeight: 700,
      fontSize: 16
    }
  }, "Order Ready! \uD83C\uDF89"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      color: 'rgba(249,219,9,0.85)',
      fontSize: 12,
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "package",
    size: 12
  }), " Ref: ", order.ref))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px 0'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      color: 'var(--muted)',
      background: 'var(--surface)',
      borderRadius: 'var(--radius-md)',
      padding: '8px 12px'
    }
  }, "\uD83D\uDCA1 Your tracking number (VIMP\u2026) arrives by email after payment \u2014 ", order.ref, " is your order reference.")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      borderTop: '1px solid var(--line)',
      marginTop: 12
    }
  }, order.lines.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--muted)'
    }
  }, l.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: 'var(--ink)'
    }
  }, LKR(l.amount)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 8,
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: 'var(--ink)'
    }
  }, "Total"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 20,
      color: 'var(--purple-700)'
    }
  }, LKR(order.total)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 16px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: '14px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--yellow-400)',
      color: 'var(--ink)',
      fontWeight: 700,
      fontSize: 16,
      textDecoration: 'none'
    }
  }, "Pay Now on Kapruka ", /*#__PURE__*/React.createElement(Ico, {
    name: "external-link",
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      fontSize: 12,
      color: 'var(--muted)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "clock",
    size: 12
  }), " Price locked \xB7 ", mm, ":", ss)));
}
function OrderTracker({
  order
}) {
  const stages = [['Received', 'package'], ['Confirmed', 'check-circle'], ['Out for Delivery', 'truck'], ['Delivered', 'gift']];
  const active = order.stage;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 360,
      background: '#fff',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: '1px solid var(--line)',
      boxShadow: 'var(--shadow-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--purple-700)',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: '#fff',
      fontWeight: 700,
      fontSize: 14,
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "package",
    size: 16,
    color: "var(--yellow-400)"
  }), " ", order.number), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      color: 'rgba(249,219,9,0.85)',
      fontSize: 12
    }
  }, order.statusDisplay)), order.live && /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '3px 8px',
      borderRadius: 999,
      background: 'var(--yellow-400)',
      color: 'var(--purple-700)',
      fontSize: 10,
      fontWeight: 700
    }
  }, "\u25CF LIVE")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 16px 8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 16,
      left: 16,
      right: 16,
      height: 2,
      background: 'var(--line)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 16,
      left: 16,
      height: 2,
      background: 'var(--success)',
      width: `calc(${active / 3 * 100}% - ${active / 3 * 32}px)`,
      transition: 'width .6s var(--ease-out)'
    }
  }), stages.map(([label, icon], i) => {
    const done = i <= active;
    return /*#__PURE__*/React.createElement("div", {
      key: label,
      style: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        zIndex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 32,
        height: 32,
        borderRadius: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: done ? 'var(--success)' : 'var(--surface)',
        color: done ? '#fff' : 'var(--muted)',
        border: done ? 'none' : '1px solid var(--line)',
        boxShadow: i === active ? '0 0 0 4px rgba(31,157,87,.2)' : 'none'
      }
    }, /*#__PURE__*/React.createElement(Ico, {
      name: icon,
      size: 16,
      color: done ? '#fff' : 'var(--muted)'
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: 500,
        textAlign: 'center',
        maxWidth: 60,
        lineHeight: 1.2,
        color: done ? 'var(--ink)' : 'var(--muted)'
      }
    }, label));
  }))), order.proof && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 12px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--yellow-100)',
      border: '1px solid var(--yellow-300)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "gift",
    size: 16,
    color: "var(--purple-700)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--ink)',
      fontWeight: 500
    }
  }, "Delivery photo available \u2014 proof of a delivered smile \uD83C\uDF81"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px',
      borderTop: '1px solid var(--line)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement(Row, {
    icon: "clock",
    label: "Ordered",
    value: order.orderDate
  }), /*#__PURE__*/React.createElement(Row, {
    icon: "truck",
    label: "Delivery",
    value: order.deliveryDate
  }), /*#__PURE__*/React.createElement(Row, {
    icon: "map-pin",
    label: "To",
    value: order.recipient
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: 8,
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--muted)'
    }
  }, "Total paid"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--purple-700)',
      fontWeight: 700
    }
  }, LKR(order.amount)))));
}
function Row({
  icon,
  label,
  value
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      color: 'var(--muted)'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    name: icon,
    size: 14
  }), " ", label), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink)',
      fontWeight: 500,
      textAlign: 'right'
    }
  }, value));
}
function EmptyState({
  prompts,
  onPrompt
}) {
  const feats = [['🎁', ' gifts'], ['🎂', 'Order cakes'], ['🌹', 'Send flowers']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100%',
      textAlign: 'center',
      gap: 22,
      padding: '24px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
      animation: 'kapruka-breathe 3s ease-in-out infinite'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--purple-700)',
      borderRadius: 'var(--radius-lg)',
      padding: '14px 24px',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/kapruka-logo.jpg",
    alt: "Kapruka",
    style: {
      height: 44,
      width: 'auto',
      borderRadius: 4
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '5px 12px',
      borderRadius: 999,
      background: 'var(--yellow-400)',
      color: 'var(--purple-700)',
      fontSize: 12,
      fontWeight: 700,
      boxShadow: 'var(--shadow-sm)'
    }
  }, "Kapri \u2014 AI Shopping Concierge")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 24,
      fontWeight: 700,
      color: 'var(--purple-700)'
    },
    className: "sinhala-text"
  }, "\u0D86\u0DBA\u0DD4\u0DB6\u0DDD\u0DC0\u0DB1\u0DCA! I'm Kapri \uD83D\uDC4B"), /*#__PURE__*/React.createElement("p", {
    className: "sinhala-text",
    style: {
      margin: '6px auto 0',
      maxWidth: 320,
      fontSize: 14,
      color: 'var(--muted)',
      lineHeight: 1.6
    }
  }, "Your AI shopping concierge for Kapruka.lk \u2014 chat in ", /*#__PURE__*/React.createElement("strong", null, "English"), ", ", /*#__PURE__*/React.createElement("strong", null, "\u0DC3\u0DD2\u0D82\u0DC4\u0DBD"), ", or ", /*#__PURE__*/React.createElement("strong", null, "Tanglish"), "!")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 12,
      width: '100%',
      maxWidth: 320
    }
  }, feats.map(([e, t]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      padding: 12,
      background: '#fff',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--line)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 24
    }
  }, e), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--muted)',
      fontWeight: 500
    }
  }, t)))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 360,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 11,
      color: 'var(--muted)',
      fontWeight: 600,
      letterSpacing: '.06em',
      textTransform: 'uppercase'
    }
  }, "Try saying..."), prompts.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.text,
    onClick: () => onPrompt(p.text),
    className: "sinhala-text",
    style: {
      width: '100%',
      textAlign: 'left',
      padding: '12px 16px',
      background: '#fff',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--line)',
      fontSize: 14,
      color: 'var(--ink)',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      cursor: 'pointer',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20
    }
  }, p.emoji), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, p.text), /*#__PURE__*/React.createElement(Ico, {
    name: "sparkles",
    size: 16,
    color: "var(--line)"
  })))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 11,
      color: 'var(--line)'
    }
  }, "Powered by Kapruka MCP \xD7 Anthropic Claude"));
}
Object.assign(window, {
  ProductCarousel,
  DeliveryStatus,
  CheckoutCard,
  OrderTracker,
  EmptyState,
  Pill
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/kapri/GenUI.jsx", error: String((e && e.message) || e) }); }

// ui_kits/kapri/Parts.jsx
try { (() => {
/* Kapri UI kit — shared parts: Icon, Header, MessageBubble, Composer, chrome.
   Self-contained (no bundle dependency) so the kit always renders.
   Styling references the design-system tokens from styles.css. */

const ICON_PATHS = {
  'shopping-cart': '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  'shopping-bag': '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  'send': '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  'mic': '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
  'sparkles': '<path d="M9.94 14.06 8 21l-1.94-6.94L-.88 12l6.94-1.94L8 3l1.94 6.94L16 12l-6.06 2.06Z" transform="translate(4)"/>',
  'external-link': '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"/>',
  'check': '<path d="M20 6 9 17l-5-5"/>',
  'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m22 4-10 10.01-3-3"/>',
  'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  'plus': '<path d="M5 12h14"/><path d="M12 5v14"/>',
  'minus': '<path d="M5 12h14"/>',
  'trash-2': '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
  'truck': '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  'calendar': '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 2v4"/><path d="M16 2v4"/>',
  'clock': '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  'map-pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  'phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>',
  'package': '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  'gift': '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
  'alert-triangle': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>'
};
function Ico({
  name,
  size = 18,
  color = 'currentColor',
  sw = 2,
  style
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: sw,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flexShrink: 0,
      display: 'block',
      ...(style || {})
    },
    dangerouslySetInnerHTML: {
      __html: ICON_PATHS[name] || ''
    }
  });
}
const LKR = n => `Rs. ${Number(n).toLocaleString('en-LK')}`;
function Header({
  cartCount,
  onCart,
  lang,
  onLang
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 16px',
      background: 'var(--purple-700)',
      boxShadow: 'var(--shadow-lg)',
      zIndex: 10,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/kapruka-logo.jpg",
    alt: "Kapruka",
    style: {
      height: 30,
      width: 'auto',
      borderRadius: 4
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 20,
      background: 'rgba(255,255,255,0.2)'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--yellow-400)',
      fontWeight: 600,
      lineHeight: 1
    }
  }, "Kapri"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'rgba(255,255,255,0.6)',
      lineHeight: 1,
      marginTop: 2
    }
  }, "AI Shopping Concierge"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onLang,
    style: chromeBtn,
    "aria-label": "Toggle language"
  }, lang === 'en' ? /*#__PURE__*/React.createElement("span", null, "EN | ", /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.7,
      fontWeight: 400
    }
  }, "\u0DC3\u0DD2\u0D82")) : /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.7,
      fontWeight: 400
    }
  }, "EN"), " | \u0DC3\u0DD2\u0D82")), /*#__PURE__*/React.createElement("button", {
    onClick: onCart,
    style: {
      ...chromeBtn,
      position: 'relative',
      padding: 8
    },
    "aria-label": "Cart"
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "shopping-cart",
    size: 20,
    color: "#fff"
  }), cartCount > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -6,
      right: -6,
      minWidth: 19,
      height: 19,
      padding: '0 4px',
      background: 'var(--yellow-400)',
      color: 'var(--purple-700)',
      fontSize: 11,
      fontWeight: 700,
      borderRadius: 999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, cartCount))));
}
const chromeBtn = {
  padding: '7px 10px',
  borderRadius: 'var(--radius-md)',
  background: 'rgba(255,255,255,0.1)',
  color: '#fff',
  fontSize: 12,
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'var(--font-sans)'
};
function Bubble({
  role,
  sinhala,
  children
}) {
  const isUser = role === 'user';
  const bub = /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: isUser ? '82%' : '100%',
      padding: '10px 16px',
      fontFamily: sinhala ? 'var(--font-sinhala)' : 'var(--font-sans)',
      fontSize: 14,
      lineHeight: sinhala ? 1.6 : 1.5,
      color: isUser ? '#fff' : 'var(--ink)',
      background: isUser ? 'var(--purple-700)' : 'var(--purple-100)',
      borderRadius: 'var(--radius-lg)',
      borderTopRightRadius: isUser ? 'var(--radius-sm)' : 'var(--radius-lg)',
      borderTopLeftRadius: isUser ? 'var(--radius-lg)' : 'var(--radius-sm)',
      boxShadow: 'var(--shadow-sm)',
      whiteSpace: 'pre-wrap',
      animation: 'kapruka-fade-in .3s var(--ease-out)'
    }
  }, children);
  if (isUser) return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, bub);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      flexShrink: 0,
      marginTop: 2,
      borderRadius: 999,
      background: 'var(--purple-700)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 15,
      boxShadow: 'var(--shadow-sm)'
    }
  }, "\uD83D\uDECD\uFE0F"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      maxWidth: '90%',
      minWidth: 0
    }
  }, bub));
}
function QuickReplies({
  items,
  onPick
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      paddingLeft: 36,
      marginTop: -4
    }
  }, items.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    onClick: () => onPick(c),
    style: {
      padding: '5px 12px',
      borderRadius: 999,
      background: '#fff',
      border: '1px solid var(--line)',
      color: 'var(--purple-700)',
      fontSize: 12,
      fontWeight: 600,
      cursor: 'pointer',
      boxShadow: 'var(--shadow-sm)',
      fontFamily: 'var(--font-sans)'
    }
  }, c)));
}
function Composer({
  value,
  onChange,
  onSend,
  lang
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      padding: '12px 16px',
      background: '#fff',
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      onSend();
    },
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: value,
    onChange: e => onChange(e.target.value),
    placeholder: "Type in English, Sinhala, or Tanglish...",
    className: "sinhala-text",
    style: {
      flex: 1,
      resize: 'none',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--line)',
      padding: '11px 16px',
      fontSize: 14,
      color: 'var(--ink)',
      background: 'var(--surface)',
      outline: 'none',
      fontFamily: 'var(--font-sans)'
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: {
      ...sqBtn,
      background: 'var(--purple-100)',
      color: 'var(--purple-700)'
    },
    "aria-label": "Voice"
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "mic",
    size: 18
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    style: {
      ...sqBtn,
      background: 'var(--purple-700)',
      color: '#fff'
    },
    "aria-label": "Send"
  }, /*#__PURE__*/React.createElement(Ico, {
    name: "send",
    size: 18
  }))));
}
const sqBtn = {
  width: 42,
  height: 42,
  flexShrink: 0,
  borderRadius: 'var(--radius-lg)',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
};
Object.assign(window, {
  Ico,
  LKR,
  Header,
  Bubble,
  QuickReplies,
  Composer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/kapri/Parts.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.CategoryTile = __ds_scope.CategoryTile;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.DeliveryStatus = __ds_scope.DeliveryStatus;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.MessageBubble = __ds_scope.MessageBubble;

__ds_ns.ProductCard = __ds_scope.ProductCard;

})();
