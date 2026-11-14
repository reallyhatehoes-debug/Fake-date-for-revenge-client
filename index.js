(function () {
  const REAL_DATE = "Oct 15, 2024";
  const CUSTOM_DATE = "Feb 7, 2001";

  const { React } = vendetta.metro.common;
  const { findByProps } = vendetta.metro;
  const { before } = vendetta.patcher;

  const unpatches = [];

  function swapDate(val) {
    if (typeof val === "string" && val.includes(REAL_DATE)) {
      return val.replace(REAL_DATE, CUSTOM_DATE);
    }
    if (Array.isArray(val)) {
      return val.map(swapDate);
    }
    return val;
  }

  function patchProps(props) {
    if (!props || typeof props !== "object") return;
    if (props.children) {
      props.children = swapDate(props.children);
    }
  }

  return {
    onLoad: function () {
      // 1. Patch classic React.createElement (props are in args[1])
      if (React && React.createElement) {
        unpatches.push(
          before("createElement", React, function (args) {
            patchProps(args[1]);
            for (let i = 2; i < args.length; i++) {
              args[i] = swapDate(args[i]);
            }
          })
        );
      }

      // 2. Patch modern React jsx / jsxs runtime (used by newer Discord builds)
      const jsxRuntime = findByProps("jsx", "jsxs");
      if (jsxRuntime) {
        if (jsxRuntime.jsx) {
          unpatches.push(
            before("jsx", jsxRuntime, function (args) {
              patchProps(args[1]);
            })
          );
        }
        if (jsxRuntime.jsxs) {
          unpatches.push(
            before("jsxs", jsxRuntime, function (args) {
              patchProps(args[1]);
            })
          );
        }
      }
    },
    onUnload: function () {
      unpatches.forEach(function (u) {
        if (u) u();
      });
    }
  };
})();
