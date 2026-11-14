(function () {
  const REAL_DATE = "Oct 15, 2024";
  const CUSTOM_DATE = "May 7, 2015";

  const { React } = vendetta.metro.common;
  const { before } = vendetta.patcher;

  let unpatch;

  function swapDate(val) {
    if (typeof val === "string" && val.includes(REAL_DATE)) {
      return val.replace(REAL_DATE, CUSTOM_DATE);
    }
    if (Array.isArray(val)) {
      return val.map(swapDate);
    }
    return val;
  }

  return {
    onLoad: function () {
      unpatch = before("createElement", React, function (args) {
        if (args[1] && args[1].children) {
          args[1].children = swapDate(args[1].children);
        }
        if (args.length > 2) {
          for (let i = 2; i < args.length; i++) {
            args[i] = swapDate(args[i]);
          }
        }
      });
    },
    onUnload: function () {
      if (unpatch) unpatch();
    }
  };
})();
