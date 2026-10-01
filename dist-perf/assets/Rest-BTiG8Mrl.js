import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { B as processIntro, C as business, D as faqCopy, E as faqCats, F as materialsCopy, G as stats, H as scopes, I as nav, K as statsCopy, L as phases, M as lakh, N as lumen, O as faqs, P as materials, Q as animate, R as places, S as useMedia, T as estimate, U as services, V as projects, W as servicesIntro, Y as voices, Z as workIntro, _ as ReadMore, a as lumenCtl, at as useMotionValueEvent, b as SnapPoints, c as useCalm, d as CURTAIN, et as useSpring, f as EASE$1, ft as require_jsx_runtime, g as PORTRAIT, h as Odometer, ht as require_react, it as useScroll, j as homeTypes, k as footerCopy, l as Img, lt as resolveElements, m as MaskLines, nt as useMotionTemplate, ot as motion, p as Logo, rt as useMotionValue, st as AnimatePresence, t as RoomDrawing, tt as useTransform, u as Arrow, v as Rise, w as contactCopy, x as scrollToY, y as SecHead, z as pricing } from "./index-BO8OfkkP.js";
//#region node_modules/framer-motion/dist/es/utils/use-animation-frame.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
//#endregion
//#region node_modules/framer-motion/dist/es/render/dom/viewport/index.mjs
var thresholds = {
	some: 0,
	all: 1
};
function inView(elementOrSelector, onStart, { root, margin: rootMargin, amount = "some" } = {}) {
	const elements = resolveElements(elementOrSelector);
	const activeIntersections = /* @__PURE__ */ new WeakMap();
	const onIntersectionChange = (entries) => {
		entries.forEach((entry) => {
			const onEnd = activeIntersections.get(entry.target);
			/**
			* If there's no change to the intersection, we don't need to
			* do anything here.
			*/
			if (entry.isIntersecting === Boolean(onEnd)) return;
			if (entry.isIntersecting) {
				const newOnEnd = onStart(entry.target, entry);
				if (typeof newOnEnd === "function") activeIntersections.set(entry.target, newOnEnd);
				else observer.unobserve(entry.target);
			} else if (typeof onEnd === "function") {
				onEnd(entry);
				activeIntersections.delete(entry.target);
			}
		});
	};
	const observer = new IntersectionObserver(onIntersectionChange, {
		root,
		rootMargin,
		threshold: typeof amount === "number" ? amount : thresholds[amount]
	});
	elements.forEach((element) => observer.observe(element));
	return () => observer.disconnect();
}
//#endregion
//#region node_modules/framer-motion/dist/es/utils/use-in-view.mjs
function useInView(ref, { root, margin, amount, once = false, initial = false } = {}) {
	const [isInView, setInView] = (0, import_react.useState)(initial);
	(0, import_react.useEffect)(() => {
		if (!ref.current || once && isInView) return;
		const onEnter = () => {
			setInView(true);
			return once ? void 0 : () => setInView(false);
		};
		const options = {
			root: root && root.current || void 0,
			margin,
			amount
		};
		return inView(ref.current, onEnter, options);
	}, [
		root,
		ref,
		margin,
		once,
		amount
	]);
	return isInView;
}
//#endregion
//#region src/sections/Services.jsx
var import_jsx_runtime = require_jsx_runtime();
var N$2 = services.length;
var INTRO = .1;
var STEP = .9 / N$2;
var stepAt = (p) => p < INTRO ? -1 : Math.min(N$2 - 1, Math.floor((p - INTRO) / STEP));
var ARCH_SIZES = "(max-width: 900px) 92vw, 34vw";
var rooms = [
	{
		x: 30,
		y: 30,
		w: 410,
		h: 350
	},
	{
		x: 440,
		y: 30,
		w: 390,
		h: 240
	},
	{
		x: 440,
		y: 270,
		w: 390,
		h: 210
	},
	{
		x: 30,
		y: 380,
		w: 280,
		h: 250
	},
	{
		x: 310,
		y: 480,
		w: 520,
		h: 150
	}
];
var furniture = [
	/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "120",
			y: "90",
			width: "230",
			height: "70",
			rx: "30"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "235",
			cy: "240",
			r: "46"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "70",
			y: "300",
			width: "80",
			height: "40"
		})
	] }, "f0"),
	/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
		x: "470",
		y: "60",
		width: "330",
		height: "36"
	}), [
		510,
		600,
		690,
		780
	].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
		cx: x,
		cy: "170",
		r: "22"
	}, x))] }, "f1"),
	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", { children: [
		[480, 310],
		[650, 310],
		[480, 380],
		[650, 380]
	].map(([x, y]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
		x,
		y,
		width: "140",
		height: "40"
	}, x + y)) }, "f2"),
	/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [[
		60,
		90,
		120
	].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
		x1: x,
		y1: "420",
		x2: x,
		y2: "600"
	}, x)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
		x: "170",
		y: "440",
		width: "100",
		height: "100"
	})] }, "f3"),
	/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
		x: "420",
		y: "520",
		width: "200",
		height: "60"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
		x: "660",
		y: "510",
		width: "130",
		height: "80",
		strokeDasharray: "6 6"
	})] }, "f4")
];
function FloorPlan({ active }) {
	const s = services[Math.max(0, active)];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className: "mini-plan",
		viewBox: "0 0 860 660",
		role: "img",
		"aria-label": `Studio plan — ${s.title} highlighted`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("pattern", {
				id: "svc-hatch",
				width: "12",
				height: "12",
				patternUnits: "userSpaceOnUse",
				patternTransform: "rotate(45)",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					width: "12",
					height: "12",
					fill: "rgba(255,111,89,0.18)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "0",
					y1: "0",
					x2: "0",
					y2: "12",
					stroke: "#FF6F59",
					strokeWidth: "3"
				})]
			}) }),
			rooms.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: r.x,
				y: r.y,
				width: r.w,
				height: r.h,
				fill: i === active ? "url(#svc-hatch)" : "transparent",
				style: { transition: "fill .5s" }
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
				fill: "none",
				stroke: "#D6CCFF",
				strokeWidth: "3",
				opacity: ".7",
				children: furniture
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				fill: "none",
				stroke: "#F7F3FF",
				strokeWidth: "10",
				strokeLinecap: "square",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M30 30 H830 V630 H30 Z" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M440 30 V120 M440 200 V480" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M440 270 H600 M680 270 H830" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M30 380 H180 M260 380 H440" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M310 380 V480 M310 560 V630" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M310 480 H520 M600 480 H830" })
				]
			}),
			active >= 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.circle, {
				className: "pulse",
				r: "14",
				fill: "#FF6F59",
				initial: {
					cx: s.pin[0],
					cy: s.pin[1]
				},
				animate: {
					cx: s.pin[0],
					cy: s.pin[1]
				},
				transition: {
					type: "spring",
					stiffness: 120,
					damping: 18
				}
			})
		]
	});
}
function Room({ slot, alt, inset, on, visible, p, range, eager }) {
	const scale = useTransform(p, range, [1.12, 1]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "arch-room" + (on ? " on" : "") + (visible ? " vis" : ""),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			className: "arch-zoom",
			style: { scale },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Img, {
				slot,
				alt: "",
				className: "arch-dark",
				sizes: ARCH_SIZES,
				eager,
				fade: false,
				"aria-hidden": "true"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "arch-lit",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Img, {
					slot,
					alt,
					sizes: ARCH_SIZES,
					eager,
					fade: false
				})
			})]
		}), inset && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "arch-inset",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Img, {
				slot: inset,
				alt: "",
				sizes: "160px"
			})
		})]
	});
}
function Rail({ active, go }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "svc-rail",
		"aria-label": "Rooms",
		children: services.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: i === active ? "on" : "",
			"aria-label": `Show ${s.title}`,
			"aria-current": i === active ? "step" : void 0,
			onClick: () => go(i),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
					className: "rail-n",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.title })
			]
		}, s.n))
	});
}
function Copy({ s, i, portrait, more, setMore, setRead }) {
	const ticks = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "ticks",
		children: s.tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "✓" }), t] }, t))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		className: "svc-copy",
		initial: "hidden",
		animate: "show",
		exit: "exit",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "disp svc-title",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mask",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
					style: { display: "inline-block" },
					variants: {
						hidden: { y: "105%" },
						show: {
							y: 0,
							transition: {
								duration: .9,
								ease: EASE$1
							}
						},
						exit: {
							y: "-105%",
							transition: {
								duration: .45,
								ease: CURTAIN
							}
						}
					},
					children: s.title
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			variants: {
				hidden: {
					opacity: 0,
					y: 16
				},
				show: {
					opacity: 1,
					y: 0,
					transition: {
						duration: .7,
						ease: EASE$1,
						delay: .15
					}
				},
				exit: {
					opacity: 0,
					transition: { duration: .25 }
				}
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadMore, {
				text: s.desc,
				onToggle: setRead
			}), portrait ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "more-btn mono",
				"aria-expanded": more,
				"aria-controls": `svc-more-${s.n}`,
				onClick: () => setMore(!more),
				children: more ? "Details −" : "Details +"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
				initial: false,
				children: more && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					id: `svc-more-${s.n}`,
					className: "more-panel",
					initial: {
						height: 0,
						opacity: 0
					},
					animate: {
						height: "auto",
						opacity: 1
					},
					exit: {
						height: 0,
						opacity: 0
					},
					transition: {
						duration: .45,
						ease: EASE$1
					},
					children: [ticks, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloorPlan, { active: i })]
				})
			})] }) : ticks]
		})]
	}, s.n);
}
function Gallery() {
	const ref = (0, import_react.useRef)(null);
	const [step, setStep] = (0, import_react.useState)(-1);
	const portrait = useMedia(PORTRAIT);
	const [more, setMore] = (0, import_react.useState)(false), [read, setRead] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMore(false);
		setRead(false);
	}, [step]);
	const { scrollYProgress: p } = useScroll({
		target: ref,
		offset: ["start start", "end end"]
	});
	useMotionValueEvent(p, "change", (v) => setStep(stepAt(v)));
	const go = (i) => {
		const el = ref.current;
		const top = el.getBoundingClientRect().top + window.scrollY;
		scrollToY(top + (el.offsetHeight - window.innerHeight) * (INTRO + (i + .5) * STEP));
	};
	const s = services[Math.max(0, step)];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "services",
		ref,
		className: "svc-gallery",
		"aria-label": "Services",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"aria-hidden": "true",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "svc-track",
				"data-lumen": "services",
				"data-lumen-hold": "",
				"data-lumen-state": "lit",
				"data-lumen-y": ".2",
				"data-lumen-scale": ".9",
				"data-lumen-beam": "1.2",
				"data-lumen-mobile-y": ".13",
				"data-lumen-mobile-scale": ".45",
				"data-lumen-mobile-beam": ".8"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SnapPoints, { ts: [INTRO / 2, ...services.map((_, i) => INTRO + (i + .5) * STEP)] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "svc-stage" + (more || read ? " expanded" : ""),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "svc-left",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "arch",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "arch-in",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Room, {
							slot: servicesIntro.establishing.slot,
							alt: servicesIntro.establishing.alt,
							on: true,
							visible: step === -1,
							p,
							range: [0, INTRO]
						}), services.map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Room, {
							slot: x.img,
							alt: x.alt,
							inset: x.inset,
							on: i === step,
							visible: i === step,
							p,
							range: [INTRO + i * STEP, INTRO + (i + 1) * STEP]
						}, x.n))]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "arch-cap",
						children: step < 0 ? "Lights off" : s.title
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "svc-right",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label",
						children: servicesIntro.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
						active: step,
						go
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "svc-body",
						"aria-live": "polite",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
							mode: "wait",
							children: step < 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								className: "svc-copy",
								initial: { opacity: 0 },
								animate: { opacity: 1 },
								exit: {
									opacity: 0,
									transition: { duration: .25 }
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MaskLines, {
									as: "h2",
									lines: servicesIntro.lines,
									className: "disp svc-title",
									once: false
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "note",
									children: servicesIntro.note
								})]
							}, "intro") : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
								s,
								i: step,
								portrait,
								more,
								setMore,
								setRead
							}, s.n)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "svc-foot",
						children: [!portrait && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloorPlan, { active: step }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							className: "btn btn-coral",
							href: "#contact",
							tabIndex: step < 0 ? -1 : 0,
							style: { opacity: step < 0 ? 0 : 1 },
							children: [
								servicesIntro.cta,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})
							]
						})]
					})
				]
			})]
		})]
	});
}
function Card$1({ s, i, still }) {
	const ref = (0, import_react.useRef)(null);
	const inView = useInView(ref, { amount: .5 });
	const lit = still || inView;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "svc-card",
		ref,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "lumen-pt",
				style: {
					right: 28,
					top: -34
				},
				"data-lumen": `services-${i}`,
				"data-lumen-state": "lit",
				"data-lumen-scale": ".8",
				"data-lumen-beam": ".9"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "arch",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "arch-in",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "arch-room vis" + (lit ? " on" : ""),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "arch-zoom",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Img, {
								slot: s.img,
								alt: "",
								className: "arch-dark",
								sizes: ARCH_SIZES,
								fade: false,
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "arch-lit",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Img, {
									slot: s.img,
									alt: s.alt,
									sizes: ARCH_SIZES,
									fade: false
								})
							})]
						}), s.inset && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "arch-inset",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Img, {
								slot: s.inset,
								alt: "",
								sizes: "120px"
							})
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "arch-cap",
					children: s.title
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "disp svc-title",
				children: s.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "lead",
				children: s.desc
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "ticks",
				children: s.tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "✓" }), t] }, t))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				className: "btn btn-coral",
				href: "#contact",
				children: [
					servicesIntro.cta,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})
				]
			})
		]
	});
}
function Stack$2({ still }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "services",
		className: "svc-stack sheet sheet-night",
		"aria-label": "Services",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "wrap",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sec-head",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "label",
					children: servicesIntro.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MaskLines, {
					lines: servicesIntro.lines,
					className: "disp h2"
				})] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "svc-cards",
				children: services.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card$1, {
					s,
					i,
					still
				}, s.n))
			})]
		})
	});
}
function Services() {
	return useCalm() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stack$2, { still: true }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gallery, {});
}
//#endregion
//#region src/sections/Stats.jsx
var DUR = 2.4;
var EASE = [
	.16,
	1,
	.3,
	1
];
function Row({ s, i }) {
	const calm = useCalm();
	const ref = (0, import_react.useRef)(null), num = (0, import_react.useRef)(null);
	const inView = useInView(ref, {
		once: true,
		amount: .6
	});
	const [done, setDone] = (0, import_react.useState)(false);
	const p = useMotionValue(0);
	const tip = useTransform(p, (v) => `${v * 100}%`);
	const from = s.n > 1900 ? s.n - 8 : 0;
	const out = (v) => {
		if (num.current) num.current.textContent = (from + (s.n - from) * v).toFixed(s.dec || 0);
	};
	useMotionValueEvent(p, "change", out);
	(0, import_react.useEffect)(() => {
		if (!inView) return;
		if (calm) {
			p.set(1);
			out(1);
			setDone(true);
			return;
		}
		const c = animate(p, 1, {
			duration: DUR,
			ease: EASE,
			delay: i * .12,
			onComplete: () => setDone(true)
		});
		return () => c.stop();
	}, [inView, calm]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "stat-row" + (done ? " done" : ""),
		ref,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "k",
				children: s.k
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "dim-area",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "dim disp",
					style: { width: `${s.w * 100}%` },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "tick t0" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.i, {
							className: "dline",
							style: { scaleX: p }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
							className: "laser",
							style: { x: tip },
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "tick t1" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "val",
							children: [
								s.pre && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: s.pre }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									ref: num,
									children: from.toFixed(s.dec || 0)
								}),
								s.s && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: s.s })
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "d",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.d })
			})
		]
	});
}
function Stats() {
	const rows = stats.filter((s) => s.n != null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "stats",
		className: "sheet sheet-lav sheet-in",
		"aria-label": "In numbers",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "lumen-pt",
			style: {
				right: "36%",
				top: "calc(var(--sec) * .55)"
			},
			"data-lumen": "stats",
			"data-lumen-state": "lit",
			"data-lumen-scale": ".5",
			"data-lumen-beam": "0",
			"data-lumen-bg": "light"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "wrap",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecHead, {
				label: statsCopy.eyebrow,
				lines: statsCopy.lines,
				right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "note",
					children: statsCopy.note
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: rows.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				s,
				i
			}, s.k)) })]
		})]
	});
}
//#endregion
//#region src/sections/Projects.jsx
var clamp01 = (v) => Math.min(1, Math.max(0, v));
var CARD_SIZES = "(max-width: 900px) 92vw, min(62vw, 880px)";
var TAB_SIZES = "(max-width: 480px) 50vw, (max-width: 960px) 33vw, 16vw";
var HOLD = 280;
function Tabs({ active, go }) {
	const ref = (0, import_react.useRef)(null);
	const inView = useInView(ref, {
		once: true,
		amount: .3
	});
	const [peek, setPeek] = (0, import_react.useState)(-1);
	const hold = (0, import_react.useRef)({
		t: 0,
		held: false
	});
	const down = (i) => (e) => {
		if (e.pointerType === "mouse") return;
		hold.current.held = false;
		clearTimeout(hold.current.t);
		hold.current.t = setTimeout(() => {
			hold.current.held = true;
			setPeek(i);
		}, HOLD);
	};
	const up = () => {
		clearTimeout(hold.current.t);
		setPeek(-1);
	};
	(0, import_react.useEffect)(() => {
		if (!inView || !window.matchMedia("(hover: none)").matches) return;
		try {
			if (sessionStorage.getItem("novara-peek")) return;
			sessionStorage.setItem("novara-peek", "1");
		} catch {}
		const a = setTimeout(() => setPeek(0), 700), b = setTimeout(() => setPeek(-1), 2300);
		return () => {
			clearTimeout(a);
			clearTimeout(b);
		};
	}, [inView]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "reel-tabs",
		ref,
		"aria-label": "Projects",
		style: { "--n": projects.length },
		children: projects.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
			type: "button",
			className: "ptab" + (i === active ? " on" : "") + (i === peek ? " peek" : ""),
			onClick: () => {
				if (hold.current.held) {
					hold.current.held = false;
					return;
				}
				go(i);
			},
			onPointerDown: down(i),
			onPointerUp: up,
			onPointerCancel: up,
			onPointerLeave: up,
			onContextMenu: (e) => e.preventDefault(),
			"aria-label": `Show ${p.name}, ${p.loc}`,
			"aria-current": i === active ? "true" : void 0,
			initial: {
				opacity: 0,
				y: 16
			},
			animate: inView ? {
				opacity: 1,
				y: 0
			} : void 0,
			transition: {
				duration: .6,
				ease: EASE$1,
				delay: i * .06
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "ptab-media",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Img, {
							slot: p.photo,
							alt: "",
							className: "ptab-photo",
							sizes: TAB_SIZES,
							fade: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ptab-draw",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Img, {
								slot: p.drawing,
								alt: "",
								sizes: TAB_SIZES,
								fade: false
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ptab-seam" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "ptab-code",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), p.scope]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ptab-name",
					children: p.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ptab-city",
					children: p.loc.split(",")[0]
				}),
				i === active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ptab-flash",
					"aria-hidden": "true"
				})
			]
		}, p.id))
	});
}
function Card({ p, i, wipe, onFocus }) {
	const clip = useMotionTemplate`inset(0 ${useTransform(wipe, (w) => (1 - w) * 100)}% 0 0)`;
	const seamX = useTransform(wipe, (w) => `${w * 100}%`);
	const seamO = useTransform(wipe, [
		0,
		.03,
		.97,
		1
	], [
		0,
		1,
		1,
		0
	]);
	const bx = useMotionValue(0), by = useMotionValue(0);
	const sx = useSpring(bx, {
		stiffness: 260,
		damping: 26
	}), sy = useSpring(by, {
		stiffness: 260,
		damping: 26
	});
	const [hover, setHover] = (0, import_react.useState)(false);
	const move = (e) => {
		if (e.pointerType !== "mouse") return;
		const r = e.currentTarget.getBoundingClientRect();
		bx.set(e.clientX - r.left);
		by.set(e.clientY - r.top);
		setHover(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		className: "reel-card",
		href: "#contact",
		onFocus,
		onPointerMove: move,
		onPointerLeave: () => setHover(false),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "reel-media",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Img, {
						slot: p.drawing,
						alt: "",
						className: "reel-img",
						sizes: CARD_SIZES,
						fade: false,
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						className: "reel-photo",
						style: { clipPath: clip },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Img, {
							slot: p.photo,
							alt: p.alt,
							className: "reel-img",
							sizes: CARD_SIZES,
							fade: false
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						className: "reel-seam",
						style: {
							x: seamX,
							opacity: seamO
						},
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "reel-year",
				children: p.year
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "reel-info",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label",
						children: p.scope
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "disp reel-name",
						children: p.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "reel-spec",
						children: [
							p.loc,
							" · ",
							p.scope,
							" · ",
							p.area,
							" · drawing → keys ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: p.dur })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sr-only",
						children: " — open case study"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
				className: "reel-badge" + (hover ? " on" : ""),
				style: {
					x: sx,
					y: sy
				},
				"aria-hidden": "true",
				children: workIntro.badge
			})
		]
	});
}
function Reel() {
	const ref = (0, import_react.useRef)(null), track = (0, import_react.useRef)(null);
	const geo = (0, import_react.useRef)({
		W: 1440,
		cw: 880,
		offs: [],
		shift: 1
	});
	const [snaps, setSnaps] = (0, import_react.useState)([]);
	const shift = useMotionValue(0);
	const [active, setActive] = (0, import_react.useState)(0);
	const { scrollYProgress: p } = useScroll({
		target: ref,
		offset: ["start start", "end end"]
	});
	const x = useTransform([p, shift], ([v, s]) => -v * s);
	(0, import_react.useEffect)(() => {
		const measure = () => {
			const t = track.current;
			const cards = [...t.querySelectorAll(".reel-card")];
			geo.current = {
				W: window.innerWidth,
				cw: cards[0].offsetWidth,
				offs: cards.map((c) => c.offsetLeft),
				shift: t.scrollWidth - window.innerWidth
			};
			shift.set(geo.current.shift);
			const { W, cw, offs, shift: s } = geo.current;
			setSnaps(offs.map((o) => clamp01((o + cw / 2 - W / 2) / s)));
		};
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(track.current);
		window.addEventListener("resize", measure);
		return () => {
			ro.disconnect();
			window.removeEventListener("resize", measure);
		};
	}, []);
	const wipes = projects.map((_, i) => useTransform([x, shift], ([v]) => {
		const { W, cw, offs } = geo.current;
		return clamp01(1 - ((offs[i] ?? 0) + v + cw / 2 - W / 2) / (W * .42));
	}));
	useMotionValueEvent(x, "change", (v) => {
		const { W, cw, offs } = geo.current;
		let best = 0, d = Infinity;
		offs.forEach((o, i) => {
			const e = Math.abs(o + v + cw / 2 - W / 2);
			if (e < d) {
				d = e;
				best = i;
			}
		});
		setActive(best);
	});
	const focusCard = (i) => {
		const el = ref.current, { W, cw, offs, shift: s } = geo.current;
		const top = el.getBoundingClientRect().top + window.scrollY;
		const t = clamp01((offs[i] + cw / 2 - W / 2) / s);
		scrollToY(top + (el.offsetHeight - window.innerHeight) * t);
	};
	const bar = useTransform(p, [0, 1], [0, 1]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "work",
		ref,
		className: "reel",
		"aria-label": "Selected work",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "story-track",
				style: {
					top: "50svh",
					height: "calc(100% - 100svh)"
				},
				"aria-hidden": "true",
				"data-lumen": "work",
				"data-lumen-hold": "",
				"data-lumen-state": "lit",
				"data-lumen-y": ".2",
				"data-lumen-scale": ".9",
				"data-lumen-beam": "1.4",
				"data-lumen-mobile-y": ".3",
				"data-lumen-mobile-scale": ".3",
				"data-lumen-mobile-beam": "0"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SnapPoints, { ts: snaps }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "reel-stage",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "reel-head",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label",
							children: workIntro.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MaskLines, {
							lines: workIntro.lines,
							className: "disp reel-title"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "note",
							children: workIntro.note
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "reel-film",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							className: "reel-track",
							ref: track,
							style: { x },
							children: projects.map((pr, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								p: pr,
								i,
								wipe: wipes[i],
								onFocus: () => focusCard(i)
							}, pr.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "reel-progress",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "reel-bar",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.i, { style: { scaleX: bar } })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "reel-now",
							"aria-live": "polite",
							children: [
								projects[active].name,
								" · ",
								projects[active].loc
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
						active,
						go: focusCard
					})
				]
			})
		]
	});
}
function StackCard({ p, i, still, onActive }) {
	const ref = (0, import_react.useRef)(null);
	const inView = useInView(ref, { amount: .6 });
	(0, import_react.useEffect)(() => {
		if (inView) onActive(i);
	}, [inView]);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "center 45%"]
	});
	const wipe = useTransform(scrollYProgress, (v) => still ? 1 : clamp01(v * 1.15));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		id: `work-${p.id}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			p,
			i,
			wipe
		})
	});
}
function Stack$1({ still }) {
	const [active, setActive] = (0, import_react.useState)(0);
	const go = (i) => {
		const el = document.getElementById(`work-${projects[i].id}`);
		scrollToY(el.getBoundingClientRect().top + window.scrollY - 90);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "work",
		className: "sheet sheet-night reel-stack",
		"aria-label": "Selected work",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "wrap",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sec-head",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label",
						children: workIntro.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MaskLines, {
						lines: workIntro.lines,
						className: "disp h2"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "lumen-pt",
						style: {
							right: 28,
							bottom: -20
						},
						"data-lumen": "work",
						"data-lumen-state": "lit",
						"data-lumen-scale": ".8",
						"data-lumen-beam": "0"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
					active,
					go
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "reel-cards",
					children: projects.map((pr, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackCard, {
						p: pr,
						i,
						still,
						onActive: setActive
					}, pr.id))
				})
			]
		})
	});
}
function Projects() {
	return useCalm() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stack$1, { still: true }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reel, {});
}
//#endregion
//#region src/sections/Process.jsx
var N$1 = phases.length;
var STAGE_SIZES = "(max-width: 900px) 92vw, 56vw";
function RoomStage({ phase }) {
	const v = phases[Math.max(0, phase)].visual;
	const drawO = {
		survey: .4,
		moodboard: .4,
		render: .5,
		handover: 0
	}[v];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "room-stage v-" + v,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "room-photo",
				style: { opacity: v === "render" || v === "handover" ? 1 : 0 },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Img, {
					slot: "hero",
					alt: "",
					sizes: STAGE_SIZES,
					fade: false
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "room-draw",
				style: { opacity: drawO },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoomDrawing, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "room-survey",
				style: { opacity: v === "survey" ? 1 : 0 },
				"aria-hidden": "true",
				children: processIntro.survey.map((pt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.span, {
					className: "survey-pt",
					style: {
						left: `${pt.x}%`,
						top: `${pt.y}%`
					},
					initial: false,
					animate: v === "survey" ? {
						scale: 1,
						opacity: 1
					} : {
						scale: 0,
						opacity: 0
					},
					transition: {
						type: "spring",
						stiffness: 380,
						damping: 16,
						delay: v === "survey" ? .3 + i * .18 : 0
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), pt.t]
				}, pt.t))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "room-mood",
				"aria-hidden": "true",
				children: processIntro.moodboard.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					className: "mood-tile",
					style: {
						left: `${t.x}%`,
						top: `${t.y}%`,
						width: `${t.w}%`
					},
					initial: false,
					animate: v === "moodboard" ? {
						opacity: 1,
						y: 0,
						rotate: t.r,
						scale: 1
					} : {
						opacity: 0,
						y: 70,
						rotate: t.r + 12,
						scale: 1.08
					},
					transition: v === "moodboard" ? {
						type: "spring",
						stiffness: 140,
						damping: 16,
						delay: .15 + i * .1
					} : {
						duration: .4,
						ease: CURTAIN
					},
					children: t.slot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Img, {
						slot: t.slot,
						alt: "",
						sizes: "16vw",
						fade: false
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mood-sw " + t.cls })
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "room-tag",
				style: { opacity: v === "render" ? 1 : 0 },
				children: processIntro.render
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: v === "handover" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				className: "room-stamp",
				initial: {
					opacity: 0,
					scale: 2.6,
					rotate: -10
				},
				animate: {
					opacity: 1,
					scale: 1,
					rotate: -10
				},
				exit: { opacity: 0 },
				transition: {
					duration: .5,
					ease: EASE$1,
					delay: .5
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "disp",
					children: processIntro.stamp
				})
			}, "stamp") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "room-cap",
				children: phases[Math.max(0, phase)].label
			})
		]
	});
}
function MiniGantt({ phase, local }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mini-gantt",
		"aria-hidden": "true",
		children: phases.map((ph, i) => {
			const l = i / N$1, w = 1 / N$1;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mg-bar" + (i === phase ? " on" : ""),
				style: {
					left: `${l * 100}%`,
					width: `${w * 100}%`
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.i, { style: { scaleX: i < phase ? 1 : i === phase ? local : 0 } })
			}, ph.n);
		})
	});
}
function Script({ phase, local }) {
	const ph = phases[phase];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "script",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "week disp",
				"aria-label": `Step ${phase + 1} of ${N$1}`,
				children: ["Step ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Odometer, { value: String(phase + 1) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "script-body",
				"aria-live": "polite",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
					mode: "wait",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						className: "script-copy",
						initial: {
							opacity: 0,
							y: 18
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: {
							opacity: 0,
							y: -12
						},
						transition: {
							duration: .45,
							ease: EASE$1
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mono step",
								children: ph.len
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "disp script-title",
								children: ph.t
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadMore, { text: ph.s })
						]
					}, ph.n)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniGantt, {
				phase,
				local
			})
		]
	});
}
function Build() {
	const ref = (0, import_react.useRef)(null);
	const [phase, setPhase] = (0, import_react.useState)(0);
	const { scrollYProgress: p } = useScroll({
		target: ref,
		offset: ["start start", "end end"]
	});
	const local = useTransform(p, (v) => {
		const x = Math.min(.9999, v) * N$1;
		return x - Math.floor(x);
	});
	useMotionValueEvent(p, "change", (v) => {
		const x = Math.min(.9999, Math.max(0, v)) * N$1;
		setPhase(Math.floor(x));
	});
	const holds = phases.flatMap((ph, i) => ph.lamp.map((st, j) => ({
		st,
		from: i + j / ph.lamp.length,
		to: i + (j + 1) / ph.lamp.length
	})));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "process",
		ref,
		className: "build",
		"aria-label": "Process",
		children: [
			holds.map((h, k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "build-track",
				"aria-hidden": "true",
				style: {
					top: `calc(50svh + (100% - 100svh) * ${h.from / N$1})`,
					height: `calc((100% - 100svh) * ${(h.to - h.from) / N$1})`
				},
				"data-lumen": `process-${k}`,
				"data-lumen-hold": "",
				"data-lumen-state": h.st,
				"data-lumen-y": ".24",
				"data-lumen-scale": ".75",
				"data-lumen-beam": ".7",
				"data-lumen-rot": h.st === "lit" ? -16 : 0,
				"data-lumen-mobile-y": ".3",
				"data-lumen-mobile-scale": ".3",
				"data-lumen-mobile-beam": "0"
			}, k)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SnapPoints, { ts: phases.map((_, i) => (i + .5) / N$1) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "build-stage sheet-plum",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "build-head",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label",
							children: processIntro.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MaskLines, {
							lines: processIntro.lines,
							className: "disp build-title"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Script, {
						phase,
						local
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "build-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoomStage, { phase }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "note",
							children: processIntro.note
						})]
					})
				]
			})
		]
	});
}
function PhaseCard({ ph, i, still }) {
	const ref = (0, import_react.useRef)(null);
	const inView = useInView(ref, {
		amount: .5,
		once: true
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "phase-card",
		ref,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "lumen-pt",
				style: {
					right: 28,
					top: -30
				},
				"data-lumen": `process-${i}`,
				"data-lumen-state": ph.lamp[ph.lamp.length - 1],
				"data-lumen-scale": ".7",
				"data-lumen-beam": "0"
			}),
			still || inView ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoomStage, { phase: i }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "room-stage" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "mono step",
				children: [
					"Step ",
					ph.n,
					" · ",
					ph.len
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "disp script-title",
				children: ph.t
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "lead",
				children: ph.s
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniGantt, {
				phase: i,
				local: 1
			})
		]
	});
}
function Stack({ still }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "process",
		className: "sheet sheet-plum build-stack",
		"aria-label": "Process",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "wrap",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sec-head",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label",
						children: processIntro.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MaskLines, {
						lines: processIntro.lines,
						className: "disp h2"
					})] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "phase-cards",
					children: phases.map((ph, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhaseCard, {
						ph,
						i,
						still
					}, ph.n))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "note",
					style: { marginTop: 28 },
					children: processIntro.note
				})
			]
		})
	});
}
function Process() {
	return useCalm() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stack, { still: true }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Build, {});
}
//#endregion
//#region src/store/brief.js
var state = {
	palette: [],
	scope: null,
	question: ""
};
var subs = /* @__PURE__ */ new Set();
var getBrief = () => state;
function setBrief(patch) {
	state = {
		...state,
		...typeof patch === "function" ? patch(state) : patch
	};
	subs.forEach((f) => f());
}
var subscribeBrief = (f) => {
	subs.add(f);
	return () => subs.delete(f);
};
var useBrief = () => (0, import_react.useSyncExternalStore)(subscribeBrief, getBrief);
//#endregion
//#region src/sections/Materials.jsx
var MAX = 3;
var JITTER = [
	-4,
	3,
	-2,
	4,
	-3,
	2
];
var topZ = 10;
var Chip = ({ m }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
	className: "chip-sw " + (m.cls || ""),
	children: m.img && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Img, {
		slot: m.img,
		alt: "",
		sizes: "48px"
	})
});
function Swatch({ m, i, phase, calm, inBox, onAdd, trayRef, bounds }) {
	const [flip, setFlip] = (0, import_react.useState)(false);
	const boxed = (0, import_react.useRef)(false);
	const ref = (0, import_react.useRef)(null);
	const x = useMotionValue(0), y = useMotionValue(0), z = useMotionValue(i + 1);
	const table = phase === "table";
	const rake = (e) => {
		const r = ref.current.getBoundingClientRect();
		const lx = (e.clientX - r.left) / r.width, ly = (e.clientY - r.top) / r.height;
		const s = ref.current.style;
		s.setProperty("--lx", `${lx * 100}%`);
		s.setProperty("--ly", `${ly * 100}%`);
		s.setProperty("--sx", `${(.5 - lx) * 22}px`);
		s.setProperty("--sy", `${(.5 - ly) * 16 + 14}px`);
		s.setProperty("--rk", "1");
	};
	const unrake = () => ref.current?.style.setProperty("--rk", "0");
	const overTray = (pt) => {
		const r = trayRef.current?.getBoundingClientRect();
		const px = pt.x - window.scrollX, py = pt.y - window.scrollY;
		return r && px > r.left && px < r.right && py > r.top && py < r.bottom;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		ref,
		layout: true,
		className: "swatch" + (flip ? " flipped" : "") + (inBox ? " boxed" : ""),
		"data-cursor": table && !calm ? "DRAG" : "SPEC",
		style: {
			x,
			y,
			zIndex: z
		},
		initial: false,
		animate: { rotate: phase === "closed" ? 0 : phase === "fan" ? m.rot : JITTER[i] },
		transition: {
			type: "spring",
			stiffness: 70,
			damping: 14,
			delay: phase === "fan" ? .2 + i * .06 : 0,
			layout: {
				type: "spring",
				stiffness: 190,
				damping: 26,
				delay: i * .04
			}
		},
		drag: table && !calm,
		dragElastic: .18,
		dragTransition: {
			power: .22,
			timeConstant: 240
		},
		whileDrag: {
			scale: 1.07,
			rotate: JITTER[i] + 7
		},
		onDragStart: () => z.set(++topZ),
		whileHover: table ? { scale: 1.03 } : void 0,
		onDrag: (e, info) => trayRef.current?.classList.toggle("hot", !!overTray(info.point)),
		onDragEnd: (e, info) => {
			trayRef.current?.classList.remove("hot");
			boxed.current = !!overTray(info.point);
			if (boxed.current) onAdd(m.code);
		},
		onDragTransitionEnd: () => {
			const r = ref.current.getBoundingClientRect(), t = bounds.current.getBoundingClientRect();
			const off = r.right < t.left + 40 || r.left > t.right - 40 || r.bottom < t.top + 40 || r.top > t.bottom - 40;
			if (boxed.current || off) {
				boxed.current = false;
				animate(x, 0, {
					type: "spring",
					stiffness: 200,
					damping: 24
				});
				animate(y, 0, {
					type: "spring",
					stiffness: 200,
					damping: 24
				});
			}
		},
		onTap: (e) => {
			if (!e.target.closest("button")) setFlip((f) => !f);
		},
		onPointerDown: rake,
		onPointerMove: rake,
		onPointerLeave: unrake,
		onPointerUp: (e) => e.pointerType !== "mouse" && unrake(),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "swatch-in",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "side front",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "face " + (m.cls || ""),
					children: [m.img && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Img, {
						slot: m.img,
						alt: `${m.name} sample`,
						sizes: "(max-width: 960px) 30vw, 200px"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rake",
						"aria-hidden": "true"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "cap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: m.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: m.meta })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "side back",
				"aria-hidden": !flip,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mono",
						children: [m.short, " · details"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: m.name }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: materialsCopy.back.best }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: m.best }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: materialsCopy.back.finish }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: m.finish }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: materialsCopy.back.lead }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: m.lead }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: materialsCopy.back.pairs }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: m.pairs })
					] })
				]
			})]
		}), table && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sw-acts",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "sw-btn",
				onClick: () => setFlip((f) => !f),
				"aria-pressed": flip,
				"aria-label": `${flip ? "Show the" : "Turn over the"} ${m.name} sample — ${flip ? "front" : "spec"}`,
				children: "↻"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "sw-btn add",
				onClick: () => onAdd(m.code),
				disabled: inBox,
				"aria-label": inBox ? `${m.name} is in your sample box` : `${materialsCopy.add}: ${m.name}`,
				children: inBox ? "✓" : "+"
			})]
		})]
	});
}
function Tray({ box, remove, trayRef, touch }) {
	const picked = box.map((c) => materials.find((m) => m.code === c));
	const name = picked.map((m) => m.short).join(" · ");
	const use = () => {
		setBrief({ palette: picked.map((m) => ({
			code: m.code,
			name: m.short,
			cls: m.cls || "",
			img: m.img || ""
		})) });
		const el = document.getElementById("contact");
		if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY - 40);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "tray",
		ref: trayRef,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "label tray-lbl",
				"aria-live": "polite",
				children: [
					materialsCopy.box,
					" (",
					box.length,
					"/",
					MAX,
					")"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "tray-slots",
				children: Array.from({ length: MAX }, (_, k) => {
					const m = picked[k];
					return m ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						className: "slot full",
						initial: {
							scale: 1.25,
							opacity: 0
						},
						animate: {
							scale: 1,
							opacity: 1
						},
						transition: {
							type: "spring",
							stiffness: 300,
							damping: 18
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { m }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: m.short }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => remove(m.code),
								"aria-label": `Remove ${m.name} from the sample box`,
								children: "✕"
							})
						]
					}, m.code) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "slot",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: k === box.length ? touch ? "tap +" : "drop here" : "" })
					}, `e${k}`);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "tray-name " + (name ? "disp" : "mono"),
				children: name || (touch ? materialsCopy.boxHintTouch : materialsCopy.boxHint)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "btn btn-coral",
				disabled: !box.length,
				onClick: use,
				children: [
					materialsCopy.use,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})
				]
			})
		]
	});
}
function Materials() {
	const calm = useCalm();
	const secRef = (0, import_react.useRef)(null), deck = (0, import_react.useRef)(null), trayRef = (0, import_react.useRef)(null);
	const inView = useInView(deck, {
		once: true,
		amount: .5
	});
	const [phase, setPhase] = (0, import_react.useState)(calm ? "table" : "closed");
	const [box, setBox] = (0, import_react.useState)([]);
	const touch = window.matchMedia("(hover: none)").matches;
	(0, import_react.useEffect)(() => {
		if (calm) {
			setPhase("table");
			return;
		}
		if (!inView) return;
		setPhase("fan");
		const t = setTimeout(() => setPhase("table"), 1700);
		return () => clearTimeout(t);
	}, [inView, calm]);
	(0, import_react.useEffect)(() => {
		if (phase !== "table" || calm || !touch) return;
		const el = deck.current?.querySelector(".swatch");
		if (!el) return;
		const s = el.style;
		let ctl;
		const t = setTimeout(() => {
			s.setProperty("--rk", "1");
			ctl = animate(0, 1, {
				duration: 1.6,
				ease: "easeInOut",
				onUpdate: (v) => {
					s.setProperty("--lx", `${v * 100}%`);
					s.setProperty("--ly", `${30 + v * 40}%`);
					s.setProperty("--sx", `${(.5 - v) * 22}px`);
				},
				onComplete: () => s.setProperty("--rk", "0")
			});
		}, 600);
		return () => {
			clearTimeout(t);
			ctl?.stop();
		};
	}, [phase]);
	const add = (code) => setBox((b) => b.includes(code) || b.length >= MAX ? b : [...b, code]);
	const remove = (code) => setBox((b) => b.filter((c) => c !== code));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "materials",
		ref: secRef,
		className: "sheet sheet-lav sheet-in",
		"aria-label": "Material library",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "wrap mat",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "table-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: deck,
					className: "fan" + (phase === "table" ? " spread" : ""),
					children: [materials.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swatch, {
						m,
						i,
						phase,
						calm,
						inBox: box.includes(m.code),
						onAdd: add,
						trayRef,
						bounds: secRef
					}, m.code)), phase !== "table" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pivot" })]
				}), phase === "table" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label table-note",
					children: touch || calm ? materialsCopy.tableHintTouch : materialsCopy.tableHint
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mat-side",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label",
						children: materialsCopy.eyebrow
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MaskLines, {
						className: "disp h2",
						lines: materialsCopy.lines
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rise, {
						as: "p",
						className: "lead",
						style: {
							margin: 0,
							color: "var(--muted-l)"
						},
						children: materialsCopy.lead
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tray, {
						box,
						remove,
						trayRef,
						touch: touch || calm
					})
				]
			})]
		})
	});
}
voices.length;
//#endregion
//#region src/sections/Plans.jsx
function Choice({ label, items, value, onChange }) {
	const key = (e, i) => {
		const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
		if (!d) return;
		e.preventDefault();
		const n = items[(i + d + items.length) % items.length];
		onChange(n.key);
		e.currentTarget.parentElement.children[(i + d + items.length) % items.length].focus();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "cfg-opts",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "label",
			id: `lbl-${label}`,
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "seg-group",
			role: "radiogroup",
			"aria-labelledby": `lbl-${label}`,
			children: items.map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				role: "radio",
				"aria-checked": x.key === value,
				tabIndex: x.key === value ? 0 : -1,
				onClick: () => onChange(x.key),
				onKeyDown: (e) => key(e, i),
				children: x.label
			}, x.key))
		})]
	});
}
function Configurator({ home, setHome, scope, setScope, est }) {
	const send = () => {
		setBrief({ scope: {
			home: est.home,
			scope: est.scope,
			low: est.low,
			high: est.high
		} });
		const el = document.getElementById("contact");
		if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY - 40);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "cfg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
				label: "Your home",
				items: homeTypes,
				value: home,
				onChange: setHome
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
				label: "What you need",
				items: scopes,
				value: scope,
				onChange: setScope
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cfg-out",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label",
						children: pricing.disclaimer
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "price-odo disp",
						"aria-hidden": "true",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Odometer, { value: lakh(est.low) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "dash",
								children: "–"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Odometer, { value: lakh(est.high) })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "sr-only",
						"aria-live": "polite",
						children: [
							"Indicative estimate for ",
							est.scope.toLowerCase(),
							", ",
							est.home,
							": ",
							lakh(est.low),
							" to ",
							lakh(est.high),
							". Final quote after a site visit."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "btn btn-coral",
						onClick: send,
						children: [
							pricing.send,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})
						]
					})
				]
			})
		]
	});
}
function Plans() {
	const [home, setHome] = (0, import_react.useState)("3bhk");
	const [scope, setScope] = (0, import_react.useState)("full");
	const est = (0, import_react.useMemo)(() => estimate({
		home,
		scope
	}), [home, scope]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "fees",
		className: "sheet sheet-plum sheet-in",
		"aria-label": "Fees",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "wrap",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecHead, {
					label: pricing.eyebrow,
					lines: pricing.lines,
					right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "lead",
						children: pricing.lead
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Configurator, {
					home,
					setHome,
					scope,
					setScope,
					est
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sched",
					role: "table",
					"aria-label": pricing.tableTitle,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col labels",
						role: "rowgroup",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hd",
							role: "row",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mono",
									children: pricing.tableTitle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Home" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
							]
						}), homeTypes.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "cell" + (h.key === home ? " row-on" : ""),
							role: "rowheader",
							children: h.label
						}, h.key))]
					}), scopes.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col" + (s.key === scope ? " is-rec" : ""),
						role: "rowgroup",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hd",
							role: "row",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mono",
									children: "from"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: s.label }),
								s.key === scope && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
									className: "stampbig rec-stamp",
									initial: {
										opacity: 0,
										scale: 1.6,
										rotate: -12
									},
									animate: {
										opacity: 1,
										scale: 1,
										rotate: -8
									},
									transition: {
										duration: .4,
										ease: [
											.16,
											1,
											.3,
											1
										]
									},
									children: "YOUR PICK"
								}, scope)
							]
						}), homeTypes.map((h) => {
							const e = estimate({
								home: h.key,
								scope: s.key
							});
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cell" + (h.key === home && s.key === scope ? " on" : "") + (h.key === home ? " row-on" : ""),
								role: "cell",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: h.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lakh(e.low) })]
							}, h.key);
						})]
					}, s.key))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "note",
					style: { marginTop: 18 },
					children: pricing.note
				})
			]
		})
	});
}
//#endregion
//#region src/sections/Faq.jsx
var norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
var words = (s) => norm(s).match(/[a-z0-9]+/g) || [];
function near(a, b) {
	if (Math.abs(a.length - b.length) > 1) return false;
	let i = 0, j = 0, e = 0;
	while (i < a.length && j < b.length) {
		if (a[i] === b[j]) {
			i++;
			j++;
			continue;
		}
		if (++e > 1) return false;
		if (a.length > b.length) i++;
		else if (b.length > a.length) j++;
		else {
			i++;
			j++;
		}
	}
	return e + (a.length - i) + (b.length - j) <= 1;
}
var STOP = /* @__PURE__ */ new Set([
	"a",
	"an",
	"the",
	"do",
	"does",
	"is",
	"are",
	"i",
	"my",
	"you",
	"your",
	"to",
	"of",
	"it",
	"can",
	"how",
	"what",
	"and",
	"in",
	"on",
	"for"
]);
var hit = (qw, w) => w.startsWith(qw) || qw.length >= 4 && (w.includes(qw) || near(qw, w));
function search(query) {
	const qs = words(query).filter((w) => w.length > 1 && !STOP.has(w));
	if (!qs.length) return {
		list: faqs.map((f, i) => ({
			...f,
			i
		})),
		terms: []
	};
	return {
		list: faqs.map((f, i) => ({
			...f,
			i
		})).filter((f) => {
			const ws = words(`${f.q} ${f.a} ${f.cat}`);
			return qs.every((q) => ws.some((w) => hit(q, w)));
		}),
		terms: qs
	};
}
function Hl({ text, terms }) {
	if (!terms.length) return text;
	return text.split(/(\s+)/).map((tok, k) => {
		const w = words(tok)[0];
		return w && terms.some((q) => hit(q, w)) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mark", { children: tok }, k) : tok;
	});
}
function Answer({ text, terms, calm, onDone }) {
	const [n, setN] = (0, import_react.useState)(calm ? text.length : 0);
	const done = n >= text.length;
	(0, import_react.useEffect)(() => {
		if (calm) {
			setN(text.length);
			return;
		}
		const t0 = performance.now();
		let raf;
		const tick = () => {
			const k = Math.min(text.length, Math.floor((performance.now() - t0) / 12));
			setN(k);
			if (k < text.length) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [text, calm]);
	(0, import_react.useEffect)(() => {
		if (done) onDone?.();
	}, [done]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "typed",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: text
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hl, {
					text,
					terms
				}) : text.slice(0, n)
			}),
			!done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
				className: "caret",
				"aria-hidden": "true"
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "rfi-sign" + (done ? " on" : ""),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			viewBox: "0 0 220 44",
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "2",
				y: "34",
				children: faqCopy.signer
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "sig",
			children: [
				"SIGNED — ",
				faqCopy.signer.toUpperCase(),
				" · ",
				faqCopy.signerRole.toUpperCase()
			]
		})]
	})] });
}
function Faq() {
	const calm = useCalm();
	const [open, setOpen] = (0, import_react.useState)(0);
	const [signed, setSigned] = (0, import_react.useState)(-1);
	const [q, setQ] = (0, import_react.useState)("");
	const [cat, setCat] = (0, import_react.useState)("All");
	const input = (0, import_react.useRef)(null);
	const { list, terms } = (0, import_react.useMemo)(() => search(q), [q]);
	const shown = list.filter((f) => cat === "All" || f.cat === cat);
	(0, import_react.useEffect)(() => {
		if (terms.length && shown[0] && shown[0].i !== open) setOpen(shown[0].i);
	}, [q]);
	const send = () => {
		setBrief({ question: q.trim() });
		const el = document.getElementById("contact");
		if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY - 40);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "faq",
		className: "sheet sheet-night sheet-in",
		"aria-label": "Frequently asked questions",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "wrap faq",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "faq-side",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label",
						children: faqCopy.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MaskLines, {
						className: "disp h2",
						lines: faqCopy.lines
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "lead",
						style: {
							margin: 0,
							color: "var(--muted-d)"
						},
						children: faqCopy.lead
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rfis-wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "rfi-entry",
						role: "search",
						onSubmit: (e) => {
							e.preventDefault();
							if (!shown.length && q.trim()) send();
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "rfi-code",
								htmlFor: "rfi-q",
								children: "Ask"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: input,
								id: "rfi-q",
								className: "rfi-line",
								type: "search",
								value: q,
								onChange: (e) => setQ(e.target.value),
								placeholder: faqCopy.search,
								autoComplete: "off",
								"aria-describedby": "rfi-count"
							}),
							q && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "rfi-clear",
								onClick: () => {
									setQ("");
									input.current.focus();
								},
								"aria-label": "Clear the question",
								children: "✕"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rfi-cats",
						role: "group",
						"aria-label": "Filter by category",
						children: ["All", ...faqCats].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: c === cat ? "on" : "",
							"aria-pressed": c === cat,
							onClick: () => setCat(c),
							children: c
						}, c))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						id: "rfi-count",
						className: "sr-only",
						"aria-live": "polite",
						children: shown.length ? `${shown.length} answers match` : "No answer yet — you can send the question to the studio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rfis",
						children: [shown.map((f) => {
							const isOpen = f.i === open;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rfi" + (isOpen ? " open" : ""),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setOpen(isOpen ? -1 : f.i),
									"aria-expanded": isOpen,
									"aria-controls": `rfi-${f.i}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "q",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hl, {
											text: f.q,
											terms
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "st",
										children: isOpen ? "OPEN ▲" : "VIEW ▼"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
									initial: false,
									children: isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
										id: `rfi-${f.i}`,
										className: "ans",
										initial: { height: 0 },
										animate: { height: "auto" },
										exit: { height: 0 },
										transition: {
											duration: .45,
											ease: EASE$1
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "ans-in",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rfi-cat mono",
													children: f.cat
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Answer, {
													text: f.a,
													terms,
													calm,
													onDone: () => setSigned(f.i)
												}, `${f.i}-${terms.join()}`),
												signed === f.i && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
													className: "stamp",
													initial: {
														opacity: 0,
														scale: 2.2,
														rotate: -12
													},
													animate: {
														opacity: 1,
														scale: 1,
														rotate: -12
													},
													transition: {
														duration: .4,
														ease: EASE$1,
														delay: calm ? 0 : .9
													},
													children: "ANSWERED"
												})
											]
										})
									})
								})]
							}, f.q);
						}), !shown.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rfi-none",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "note",
									children: faqCopy.none
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mono",
									children: [
										"“",
										q.trim(),
										"”"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "btn btn-coral",
									onClick: send,
									children: [
										faqCopy.send,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {})
									]
								})
							]
						})]
					})
				]
			})]
		})
	});
}
//#endregion
//#region src/lib/submitEnquiry.js
/**
* The one place an enquiry leaves the site.
*
* TODO(backend): connect this to email. Replace the timeout below with a POST to your form endpoint
* (e.g. a serverless function that emails the studio, or Formspree / Resend / Postmark), e.g.
*
*   const res = await fetch('/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
*   if (!res.ok) throw new Error(`Enquiry failed: ${res.status}`);
*   return res.json();
*
* `payload` = { name, email, type, location, budget, brief, palette, scope, question, drawingNo, date }.
* Throwing here makes the Contact section show its error state instead of the confirmation.
*/
async function submitEnquiry(payload) {
	await new Promise((resolve) => setTimeout(resolve, 800));
	return {
		ok: true,
		drawingNo: payload.drawingNo
	};
}
//#endregion
//#region src/sections/Contact.jsx
var coordsFor = (loc) => {
	const key = loc.toLowerCase().split(",")[0].trim();
	return places[key] || (key ? "— noted for the site visit —" : "");
};
var sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function RoomIcon({ type: home }) {
	const type = contactCopy.icons[home] ?? 0;
	const g = [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M18 58h84M24 58V44q0-6 6-6h60q6 0 6 6v14M30 38v-6q0-4 4-4h52q4 0 4 4v6" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M24 58v6M96 58v6" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M104 20v26M98 46h12" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M96 20h16l-4-8h-8z" })
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "60",
				cy: "50",
				r: "16"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M60 66v6M50 72h20" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "22",
				y: "44",
				width: "12",
				height: "18",
				rx: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "86",
				y: "44",
				width: "12",
				height: "18",
				rx: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M60 6v12M50 26a10 8 0 0 1 20 0z" })
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M14 44h92M20 44v24M100 44v24" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "22",
				width: "30",
				height: "20"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M51 42v2M44 44h14" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M78 56h14M85 56v12M78 68h14" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M72 30h20" })
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 68h96" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M20 68V24h50v44" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M20 36h50M20 48h50M20 60h50M45 24v12M33 36v12M57 36v12M45 48v12" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M84 30l18 18-6 6-18-18z" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M78 36l-6 20" })
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M16 68h88" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M28 68V38l32-22 32 22v30" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "52",
				y: "48",
				width: "16",
				height: "20"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "94",
				cy: "26",
				r: "6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M94 32v14M94 40h6M94 44h4" })
		] })
	][type];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		className: "room-ico",
		viewBox: "0 0 120 80",
		"aria-hidden": "true",
		children: g
	});
}
function Sheet({ f, brief, today, stamped }) {
	const { palette, scope, question } = brief;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "dsheet",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ds-draw",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ds-code mono",
						children: contactCopy.sheetTitle
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoomIcon, { type: f.type }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ds-type disp",
						children: contactCopy.types[f.type]
					}),
					palette.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ds-pal",
						"aria-label": `Palette: ${palette.map((m) => m.name).join(", ")}`,
						children: [palette.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ds-sw " + (m.cls || ""),
							title: m.name,
							children: m.img && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Img, {
								slot: m.img,
								alt: "",
								sizes: "40px"
							})
						}, m.code)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
							className: "mono",
							children: palette.map((m) => m.name).join(" · ")
						})]
					}),
					scope && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "ds-scope",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "✓" }),
							scope.scope,
							" · ",
							scope.home
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "mono",
							children: [
								"indicative ",
								lakh(scope.low),
								" – ",
								lakh(scope.high)
							]
						})]
					}),
					question && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "ds-q hand",
						children: [
							"Your question: “",
							question,
							"”"
						]
					}),
					!palette.length && !scope && !question && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "ds-hint hand",
						children: "fill in the title block — your sheet draws itself here"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ds-block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "wide",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CLIENT" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: f.name || "—" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "LOCATION" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: f.location || "—" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: coordsFor(f.location) })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "BUDGET" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: contactCopy.budgets[f.budget] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "scalebar",
							"aria-hidden": "true",
							children: [
								0,
								1,
								2
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: s <= f.budget ? "on" : "" }, s))
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "DATE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: today })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PHONE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: f.phone ? `+91 ${f.phone}` : "—" })] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: stamped && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				className: "ds-approved",
				initial: {
					opacity: 0,
					scale: 2.4,
					rotate: -14
				},
				animate: {
					opacity: 1,
					scale: 1,
					rotate: -10
				},
				transition: {
					duration: .4,
					ease: EASE$1
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "disp",
					children: "APPROVED"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "mono",
					children: ["SAMSKRITI · ", today]
				})]
			}) })
		]
	});
}
function Folding({ children, phase }) {
	const folded = [
		"fold",
		"envelope",
		"fly"
	].includes(phase);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		className: "fold-wrap",
		animate: phase === "fly" ? {
			y: "-120vh",
			rotate: -8,
			opacity: 0
		} : { y: 0 },
		transition: {
			duration: .8,
			ease: CURTAIN
		},
		children: [[
			0,
			1,
			2
		].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			className: "fold-panel p" + p,
			animate: folded ? { rotateX: p === 0 ? -178 : p === 2 ? 178 : 0 } : { rotateX: 0 },
			transition: {
				duration: .55,
				ease: CURTAIN,
				delay: p === 0 ? .45 : 0
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fold-front",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fold-inner",
					children
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fold-back" })]
		}, p)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: (phase === "envelope" || phase === "fly") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			className: "envelope",
			initial: {
				y: 60,
				opacity: 0
			},
			animate: {
				y: 0,
				opacity: 1
			},
			transition: {
				duration: .45,
				ease: EASE$1
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 200 110",
				preserveAspectRatio: "none",
				"aria-hidden": "true",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						className: "env-body",
						d: "M2 2h196v106H2z"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						className: "env-fold",
						d: "M2 108 L100 50 L198 108"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.path, {
						className: "env-flap",
						d: "M2 2 L100 62 L198 2",
						initial: { scaleY: -1 },
						animate: { scaleY: 1 },
						transition: {
							duration: .4,
							delay: .3
						},
						style: { transformOrigin: "50% 0%" }
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mono",
				children: "SAMSKRITI"
			})]
		}) })]
	});
}
var RedPen = ({ show }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: show && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.span, {
	className: "redpen",
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
	"aria-hidden": "true",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 200 60",
		preserveAspectRatio: "none",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.path, {
			d: "M100 4 C 30 2, 4 16, 6 32 C 8 52, 70 58, 150 55 C 196 52, 198 20, 170 10 C 140 1, 90 3, 60 8",
			initial: { pathLength: 0 },
			animate: { pathLength: 1 },
			transition: {
				duration: .6,
				ease: CURTAIN
			}
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
		className: "hand",
		children: contactCopy.need
	})]
}) });
function Contact() {
	const calm = useCalm();
	const brief = useBrief();
	const { palette, scope, question } = brief;
	const [f, setF] = (0, import_react.useState)({
		name: "",
		phone: "",
		email: "",
		type: 2,
		location: "",
		budget: 0,
		text: ""
	});
	const [err, setErr] = (0, import_react.useState)({});
	const [phase, setPhase] = (0, import_react.useState)("idle");
	const [showPrev, setShowPrev] = (0, import_react.useState)(false);
	const nameRef = (0, import_react.useRef)(null), phoneRef = (0, import_react.useRef)(null), emailRef = (0, import_react.useRef)(null), doneRef = (0, import_react.useRef)(null);
	const today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-GB").replace(/\//g, ".");
	const set = (key) => (e) => {
		setF({
			...f,
			[key]: e.target.value
		});
		if (err[key]) setErr({
			...err,
			[key]: false
		});
	};
	const lines = [
		palette.length && {
			tag: "Palette",
			text: palette.map((m) => m.name).join(" · "),
			clear: () => setBrief({ palette: [] })
		},
		scope && {
			tag: "Estimate",
			text: `${scope.scope} · ${scope.home} · indicative ${lakh(scope.low)} – ${lakh(scope.high)}`,
			clear: () => setBrief({ scope: null })
		},
		question && {
			tag: "Question",
			text: `“${question}”`,
			clear: () => setBrief({ question: "" })
		}
	].filter(Boolean);
	const fullBrief = [...lines.map((l) => `${l.tag}: ${l.text}`), f.text.trim()].filter(Boolean).join("\n");
	const submit = async (e) => {
		e?.preventDefault();
		if (phase !== "idle") return;
		const phone = f.phone.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
		const bad = {
			name: !f.name.trim(),
			phone: !/^[6-9]\d{9}$/.test(phone),
			email: !!f.email.trim() && !/^\S+@\S+\.\S+$/.test(f.email.trim())
		};
		setErr(bad);
		if (bad.name || bad.phone || bad.email) {
			(bad.name ? nameRef : bad.phone ? phoneRef : emailRef).current.focus();
			return;
		}
		setShowPrev(true);
		const sending = submitEnquiry({
			name: f.name.trim(),
			phone: `+91 ${phone}`,
			email: f.email.trim(),
			type: contactCopy.types[f.type],
			location: f.location.trim(),
			budget: contactCopy.budgets[f.budget],
			brief: fullBrief,
			palette: palette.map((m) => m.name),
			scope,
			question,
			date: today
		});
		if (!calm) {
			setPhase("stamp");
			await sleep(750);
			setPhase("fold");
			await sleep(1100);
			setPhase("envelope");
			await sleep(900);
		}
		try {
			await sending;
		} catch {
			setPhase("idle");
			setErr({ send: true });
			return;
		}
		if (!calm) {
			setPhase("fly");
			await sleep(750);
		}
		setPhase("done");
		lumenCtl.set({ flashAt: performance.now() });
	};
	(0, import_react.useEffect)(() => {
		if (phase === "done") doneRef.current?.focus();
	}, [phase]);
	const reset = () => {
		setPhase("idle");
		setF({
			name: "",
			phone: "",
			email: "",
			type: 2,
			location: "",
			budget: 0,
			text: ""
		});
		setBrief({
			palette: [],
			scope: null,
			question: ""
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "contact",
		className: "sheet sheet-lav sheet-in",
		"aria-label": "Start a project",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "wrap frame",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "zones top",
					"aria-hidden": "true",
					children: [
						1,
						2,
						3,
						4,
						5,
						6,
						7,
						8
					].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: n }, n))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "zones side",
					"aria-hidden": "true",
					children: [
						"A",
						"B",
						"C",
						"D",
						"E"
					].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: n }, n))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "contact-head",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "contact-side",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label",
							children: contactCopy.eyebrow
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MaskLines, {
							className: "disp h2",
							lines: contactCopy.lines
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "contact-side",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "lead",
								style: {
									margin: 0,
									color: "var(--muted-l)"
								},
								children: contactCopy.lead
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("address", {
								className: "c-address",
								children: business.address.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: l }, l))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "links",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: business.tel,
										children: [
											contactCopy.call,
											" · ",
											business.phone
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: business.whatsapp,
										target: "_blank",
										rel: "noopener noreferrer",
										children: [contactCopy.whatsapp, " →"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: business.directions,
										target: "_blank",
										rel: "noopener noreferrer",
										children: [contactCopy.directions, " →"]
									})
								]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "contact",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: { position: "relative" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "tform",
								onSubmit: submit,
								noValidate: true,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "odd fld-wrap",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "tlbl",
												children: "Client name *"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												ref: nameRef,
												className: "cellf",
												type: "text",
												name: "name",
												value: f.name,
												onChange: set("name"),
												placeholder: "Your full name",
												autoComplete: "name",
												"aria-invalid": !!err.name,
												"aria-describedby": err.name ? "err-name" : void 0
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedPen, { show: err.name }),
											err.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												id: "err-name",
												className: "sr-only",
												children: "Please add your name"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "fld-wrap",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "tlbl",
												children: "Phone *"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "phone-in",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "cc",
													"aria-hidden": "true",
													children: "+91"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													ref: phoneRef,
													className: "cellf",
													type: "tel",
													inputMode: "tel",
													name: "phone",
													value: f.phone,
													onChange: set("phone"),
													placeholder: "98xxx xxxxx",
													autoComplete: "tel-national",
													"aria-invalid": !!err.phone,
													"aria-describedby": err.phone ? "err-phone" : void 0
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedPen, { show: err.phone }),
											err.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												id: "err-phone",
												className: "sr-only",
												children: "Please add a 10-digit mobile number"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "odd fld-wrap",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "tlbl",
												children: "Email"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												ref: emailRef,
												className: "cellf",
												type: "email",
												name: "email",
												value: f.email,
												onChange: set("email"),
												placeholder: "you@email.com (optional)",
												autoComplete: "email",
												"aria-invalid": !!err.email,
												"aria-describedby": err.email ? "err-email" : void 0
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedPen, { show: err.email }),
											err.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												id: "err-email",
												className: "sr-only",
												children: "Please check the email address"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tlbl",
										children: "Location / area"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "cellf",
										type: "text",
										name: "location",
										value: f.location,
										onChange: set("location"),
										placeholder: "e.g. Whitefield",
										autoComplete: "address-level3"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "span",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tlbl",
											id: "type-lbl",
											children: "Home type"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "chips",
											role: "group",
											"aria-labelledby": "type-lbl",
											children: contactCopy.types.map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: i === f.type ? "on" : "",
												"aria-pressed": i === f.type,
												onClick: () => setF({
													...f,
													type: i
												}),
												children: x
											}, x))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "odd",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tlbl",
											children: "Budget"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											className: "cellf",
											name: "budget",
											value: f.budget,
											onChange: (e) => setF({
												...f,
												budget: +e.target.value
											}),
											children: contactCopy.budgets.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: i,
												children: b
											}, b))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "last",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tlbl",
											children: "Date"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mono",
											children: today
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "span brief-cell last",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "tlbl",
												htmlFor: "brief-text",
												children: "Message"
											}),
											lines.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
												className: "brief-lines",
												"aria-label": "Added from the page",
												children: lines.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "mono",
														children: l.tag
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "bl-text",
														children: l.text
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: l.clear,
														"aria-label": `Remove ${l.tag.toLowerCase()} from the brief`,
														children: "✕"
													})
												] }, l.tag))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
												id: "brief-text",
												className: "cellf",
												rows: "3",
												name: "brief-notes",
												value: f.text,
												onChange: set("text"),
												placeholder: "Tell us about your home and what you’d like to do…"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "hidden",
												name: "brief",
												value: fullBrief
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "hidden",
												name: "palette",
												value: palette.map((m) => m.name).join(" · ")
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "hidden",
												name: "scope",
												value: scope ? JSON.stringify(scope) : ""
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "hidden",
												name: "question",
												value: question
											})
										]
									})
								]
							}),
							err.send && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "note",
								role: "alert",
								children: "the sheet didn’t reach us — please try the stamp again"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "form-foot",
								style: { position: "relative" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "stamp-btn",
									"aria-label": "Send — approve and send your sheet",
									onClick: submit,
									disabled: phase !== "idle" && phase !== "done",
									"data-cursor": "SEND",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
										width: "168",
										height: "168",
										viewBox: "0 0 200 200",
										"aria-hidden": "true",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											id: "sc",
											d: "M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0"
										}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
											fill: "#2A1D52",
											fontFamily: "IBM Plex Mono, monospace",
											fontSize: "15",
											letterSpacing: "4.6",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textPath", {
												href: "#sc",
												children: "APPROVE · SIGN · SEND · APPROVE · SIGN · "
											})
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "core",
										children: "SEND ↗"
									})]
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "preview" + (showPrev ? " open" : ""),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "prev-toggle mono",
								"aria-expanded": showPrev,
								onClick: () => setShowPrev(!showPrev),
								children: [
									contactCopy.preview,
									" ",
									showPrev ? "▴" : "▾"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "lumen-pt contact-pt",
								"data-lumen": "contact",
								"data-lumen-state": "lit",
								"data-lumen-scale": ".8",
								"data-lumen-beam": ".8",
								"data-lumen-mobile-beam": ".6",
								"data-lumen-bg": "light"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "prev-body",
								"aria-live": "off",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "label prev-lbl",
									children: contactCopy.preview
								}), phase === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
									ref: doneRef,
									tabIndex: -1,
									className: "received",
									role: "status",
									initial: {
										opacity: 0,
										y: 30
									},
									animate: {
										opacity: 1,
										y: 0
									},
									transition: {
										duration: .7,
										ease: EASE$1
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "disp",
											children: "Received."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: contactCopy.received }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "btn btn-ink",
											onClick: reset,
											children: "Start another sheet"
										})
									]
								}) : phase === "idle" || phase === "stamp" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
									f,
									brief,
									today,
									stamped: phase === "stamp"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folding, {
									phase,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
										f,
										brief,
										today,
										stamped: true
									})
								})]
							})
						]
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/credits.json
var credits_default = [
	{
		"slot": "hero",
		"photo": "https://unsplash.com/photos/a-living-room-filled-with-furniture-and-a-large-window-x3mSC1WnWhc",
		"photographer": "Spacejoy",
		"profile": "https://unsplash.com/@spacejoy"
	},
	{
		"slot": "svc-residential",
		"photo": "https://unsplash.com/photos/12WFO8yWrsw",
		"photographer": "Caroline Badran",
		"profile": "https://unsplash.com/@___atmos"
	},
	{
		"slot": "svc-hospitality",
		"photo": "https://unsplash.com/photos/jHyxPnJTvIQ",
		"photographer": "Cody Chan",
		"profile": "https://unsplash.com/@cceee"
	},
	{
		"slot": "svc-workplace",
		"photo": "https://unsplash.com/photos/B74lBYC3PXI",
		"photographer": "Caroline Badran",
		"profile": "https://unsplash.com/@___atmos"
	},
	{
		"slot": "svc-materials",
		"photo": "https://unsplash.com/photos/pdCTX1harH4",
		"photographer": "Karolina Grabowska",
		"profile": "https://unsplash.com/@kaboompics"
	},
	{
		"slot": "svc-turnkey",
		"photo": "https://unsplash.com/photos/GEtu7WhqU2M",
		"photographer": "Warren Hansen",
		"profile": "https://unsplash.com/@hansen_pix"
	},
	{
		"slot": "svc-dusk",
		"photo": "https://unsplash.com/photos/KD_o-Ml2F_w",
		"photographer": "Bilal Mansuri",
		"profile": "https://unsplash.com/@itsbilalmn"
	},
	{
		"slot": "bedroom",
		"photo": "https://unsplash.com/photos/modern-bedroom-with-white-upholstered-bed-RUvW1KGD9a4",
		"photographer": "Spacejoy",
		"profile": "https://unsplash.com/@spacejoy"
	},
	{
		"slot": "dining",
		"photo": "https://unsplash.com/photos/a-dimly-lit-room-with-tables-and-chairs-Mxy87tWuMVE",
		"photographer": "Justin Smith",
		"profile": "https://unsplash.com/@jsmith_txs"
	},
	{
		"slot": "cafe",
		"photo": "https://unsplash.com/photos/a-restaurant-with-a-lot-of-tables-and-chairs-ZEfHrVDF3NM",
		"photographer": "Mustafa Fatemi",
		"profile": "https://unsplash.com/@solaticace"
	},
	{
		"slot": "office",
		"photo": "https://unsplash.com/photos/a-large-conference-room-with-a-long-table-and-chairs-bEBLQQPhqi8",
		"photographer": "Hammer Group",
		"profile": "https://unsplash.com/@hammergroup"
	},
	{
		"slot": "villa",
		"photo": "https://unsplash.com/photos/modern-white-villa-with-swimming-pool-Id7u0EkTjBE",
		"photographer": "John Fornander",
		"profile": "https://unsplash.com/@johnfo"
	},
	{
		"slot": "penthouse",
		"photo": "https://unsplash.com/photos/infinity-pool-overlooking-city-skyline-at-dusk--RWieW0kJ1E",
		"photographer": "Aalo Lens",
		"profile": "https://unsplash.com/@aalolens"
	},
	{
		"slot": "detail",
		"photo": "https://unsplash.com/photos/a-white-vase-sitting-on-top-of-a-table-uluH5a0sRdw",
		"photographer": "Mary Skrynnikova 💛💙",
		"profile": "https://unsplash.com/@mary_skr"
	},
	{
		"slot": "material-stone",
		"photo": "https://unsplash.com/photos/a-close-up-of-a-grey-surface-ZSZClcM0qWQ",
		"photographer": "Content Pixie",
		"profile": "https://unsplash.com/@contentpixie"
	},
	{
		"slot": "material-nero",
		"photo": "https://unsplash.com/photos/a-close-up-of-a-black-marble-surface-osuiatBDTww",
		"photographer": "Annie Spratt",
		"profile": "https://unsplash.com/@anniespratt"
	},
	{
		"slot": "team-1",
		"photo": "https://unsplash.com/photos/a-black-and-white-photo-of-a-woman-in-a-suit-N3KUeEzHkMM",
		"photographer": "Ivan Kazlouskij",
		"profile": "https://unsplash.com/@ivankazlouskij"
	},
	{
		"slot": "team-2",
		"photo": "https://unsplash.com/photos/a-woman-in-a-blue-dress-posing-for-a-picture-7oMpkXrMCmw",
		"photographer": "Oludemilade Aremu",
		"profile": "https://unsplash.com/@king_remus"
	},
	{
		"slot": "team-3",
		"photo": "https://unsplash.com/photos/man-working-on-architectural-model-at-desk-WUY0W2RSiBw",
		"photographer": "GN Group",
		"profile": "https://unsplash.com/@gnhearingglobal"
	},
	{
		"slot": "team-4",
		"photo": "https://unsplash.com/photos/man-wearing-black-blazer-D-8XODEIr_s",
		"photographer": "Paolo Bendandi",
		"profile": "https://unsplash.com/@paolobendandi"
	}
];
//#endregion
//#region src/sections/Footer.jsx
function studioNow() {
	const parts = Object.fromEntries(new Intl.DateTimeFormat("en-IN", {
		timeZone: "Asia/Kolkata",
		hour: "2-digit",
		minute: "2-digit",
		weekday: "short",
		hour12: false
	}).formatToParts(/* @__PURE__ */ new Date()).map((p) => [p.type, p.value]));
	const h = +parts.hour % 24, hrs = business.hours;
	const open = hrs ? parts.weekday !== "Sun" && h >= hrs.open[0] && h < hrs.open[1] : null;
	return {
		time: `${String(h).padStart(2, "0")}:${parts.minute}`,
		open
	};
}
function Skyline() {
	const [t, setT] = (0, import_react.useState)(studioNow);
	(0, import_react.useEffect)(() => {
		const id = setInterval(() => setT(studioNow()), 2e4);
		return () => clearInterval(id);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "skyline",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 520 150",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				className: "sk-line",
				d: "M0 140 H40 V96 H70 V120 H96 V60 H136 V140 H186 V104 H210 V140 H300 V84 H322 V36 H350 V84 H372 V140 H420 V110 H452 V74 H486 V140 H520"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				className: "sk-win" + (t.open ? " lit" : ""),
				x: "329",
				y: "48",
				width: "14",
				height: "18"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "sk-labels",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sk-st" + (t.open ? " open" : ""),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "mono",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { "aria-hidden": "true" }),
						"Whitefield · ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: t.time }),
						" IST",
						t.open != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" · ", t.open ? "open" : "closed"] })
					]
				})
			})
		})]
	});
}
function PullCord({ off, toggle }) {
	const y = useMotionValue(0);
	const tension = useTransform(y, [0, 36], [1, 1.35]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "cord",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.i, {
			className: "cord-chain",
			style: { scaleY: tension },
			"aria-hidden": "true"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
			type: "button",
			className: "cord-pull",
			style: { y },
			drag: "y",
			dragConstraints: {
				top: 0,
				bottom: 40
			},
			dragElastic: .12,
			dragSnapToOrigin: true,
			onDragEnd: (e, info) => {
				if (info.offset.y > 22) toggle();
			},
			onClick: (e) => {
				if (e.detail === 0 || Math.abs(y.get()) < 4) toggle();
			},
			"aria-pressed": off,
			"aria-label": off ? footerCopy.on : footerCopy.off,
			"data-cursor": "PULL",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { "aria-hidden": "true" })
		})]
	});
}
function Footer() {
	const calm = useCalm();
	const ref = (0, import_react.useRef)(null), wm = (0, import_react.useRef)(null);
	const inView = useInView(wm, {
		once: true,
		amount: .5
	});
	const [off, setOff] = (0, import_react.useState)(false);
	const dim = useMotionValue(0);
	(0, import_react.useEffect)(() => {
		let raf = 0;
		const measure = () => {
			raf = 0;
			const r = ref.current.getBoundingClientRect(), H = window.innerHeight;
			const p = Math.min(1, Math.max(0, (H - r.top) / Math.max(1, Math.min(r.height, H) * .8)));
			dim.set(p * .6);
		};
		const on = () => {
			if (!raf) raf = requestAnimationFrame(measure);
		};
		window.addEventListener("scroll", on, { passive: true });
		measure();
		return () => {
			window.removeEventListener("scroll", on);
			cancelAnimationFrame(raf);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		lumenCtl.set({ footerOff: off });
	}, [off]);
	const toggle = () => {
		if (!off) {
			setOff(true);
			return;
		}
		setOff(false);
		setTimeout(() => scrollToY(0), calm ? 0 : 500);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [!calm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		className: "night" + (off ? " out" : ""),
		style: { opacity: off ? .9 : dim },
		"aria-hidden": "true"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "footer" + (off ? " dark" : ""),
		ref,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "wrap",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "f-top",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "f-news",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "disp f-title",
								children: [
									"Visit the ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "foil",
										children: "studio"
									}),
									"."
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("address", {
								className: "f-address",
								children: business.address.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: l }, l))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skyline, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "f-cols",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "t",
								children: footerCopy.explore
							}), nav.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: n.href,
								children: n.label
							}, n.id))] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "t",
									children: footerCopy.reach
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: business.tel,
									children: business.phone
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: business.whatsapp,
									target: "_blank",
									rel: "noopener noreferrer",
									children: "WhatsApp ↗"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: business.directions,
									target: "_blank",
									rel: "noopener noreferrer",
									children: "Get directions ↗"
								}),
								business.instagram && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: business.instagram,
									target: "_blank",
									rel: "noopener noreferrer",
									children: "Instagram ↗"
								})
							] })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lights-out",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "lumen-pt",
							style: {
								left: "50%",
								top: 0
							},
							"data-lumen": "footer",
							"data-lumen-state": "lit",
							"data-lumen-scale": ".8",
							"data-lumen-beam": ".6",
							"data-lumen-mobile-free": "",
							"data-lumen-mobile-beam": ".5"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PullCord, {
							off,
							toggle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "note lo-note",
							children: off ? lumen.footerNote : "pull the cord when you’re done ↓"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: wm,
					className: "f-logo" + (inView ? " in" : "") + (off ? " plotted" : ""),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {
						kind: "full",
						alt: "The Samskriti Interiors — www.thesamskriti.com"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "f-bot",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: footerCopy.copyright }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
							className: "credits",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: "Photography via Unsplash" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: credits_default.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.slot }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: c.photo,
									target: "_blank",
									rel: "noopener noreferrer",
									children: "Photo"
								}),
								" by ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: c.profile,
									target: "_blank",
									rel: "noopener noreferrer",
									children: c.photographer
								})
							] }, c.slot)) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#top",
							style: { color: "var(--white)" },
							children: footerCopy.top
						})
					]
				})
			]
		})
	})] });
}
//#endregion
//#region src/sections/Rest.jsx
function Rest() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Services, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stats, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Projects, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Process, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Materials, {}),
		false,
		"            ",
		false,
		"  ",
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plans, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Faq, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contact, {})
	] });
}
//#endregion
export { Footer, Rest as default };
